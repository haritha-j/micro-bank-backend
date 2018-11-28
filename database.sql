drop database database_proj;
create database database_proj;
use database_proj;

CREATE TABLE account_type_info ( 
  type_id VARCHAR(10) NOT NULL ,
  type_name VARCHAR(45) NOT NULL ,
  interest_rate float NOT NULL,
  minimum_balance DECIMAL(10,2) check (minimum_balance >= 0) ,
  min_age tinyint unsigned check (min_age >= 0),
  max_age tinyint unsigned check (max_age >= 0) ,
  PRIMARY KEY (type_id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8; 

CREATE TABLE employee ( 
 employee_id VARCHAR(10) NOT NULL ,
  employee_type varchar(45) not null,
  first_name varchar(45) not null,
  last_name varchar(45) not null,
  gender ENUM('male','female') ,
  PRIMARY KEY  (employee_id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE mobile_agent ( 
  agent_id VARCHAR(10) NOT NULL,
  employee_id VARCHAR(10) NOT NULL, 
  PRIMARY KEY  (agent_id),
  FOREIGN KEY (employee_id) REFERENCES employee (employee_id) ON DELETE RESTRICT ON UPDATE CASCADE

)ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE account (
  type_id VARCHAR(10) NOT NULL,
  account_no bigint NOT NULL AUTO_INCREMENT,
  balance DECIMAL(10,2) check (balance >= 0),
  active boolean NOT NULL ,
  opening_date DATETIME NOT NULL,
  agent_id VARCHAR(10) NOT NULL,
  password VARCHAR(255) NOT NULL, 
  PRIMARY KEY  (account_no),
  FOREIGN KEY (type_id) REFERENCES account_type_info (type_id) ON DELETE RESTRICT ON UPDATE CASCADE,
  FOREIGN KEY (agent_id) REFERENCES mobile_agent (agent_id) ON DELETE RESTRICT ON UPDATE CASCADE
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE customer ( 
 first_name VARCHAR(10) NOT NULL,
 last_name VARCHAR(10) NOT NULL,
  nic VARCHAR(12) NOT NULL,
  gender ENUM('male','female'),
  dob DATE NOT NULL,
  customer_id VARCHAR(10) NOT NULL, 
  age tinyint unsigned check(age>=0) , 
  address VARCHAR(100) NOT NULL,
  PRIMARY KEY  (customer_id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE Customer_phone (
  customer_id VARCHAR(10) NOT NULL,
  phone int unsigned NOT NULL  , 
  PRIMARY KEY  (customer_id,phone),
  FOREIGN KEY (customer_id) REFERENCES customer (customer_id) ON DELETE RESTRICT ON UPDATE CASCADE
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE employee_phone (
  employee_id VARCHAR(10) NOT NULL,
  phone int unsigned NOT NULL , 
  PRIMARY KEY  (employee_id,phone),
  FOREIGN KEY (employee_id) REFERENCES employee (employee_id) ON DELETE RESTRICT ON UPDATE CASCADE
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE owner_info (
  customer_id VARCHAR(10) NOT NULL,
  account_no bigint  NOT NULL, 
  PRIMARY KEY  (customer_id),
  FOREIGN KEY (customer_id) REFERENCES customer (customer_id) ON DELETE RESTRICT ON UPDATE CASCADE,
  FOREIGN KEY (account_no) REFERENCES account (account_no) ON DELETE RESTRICT ON UPDATE CASCADE


)ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE fd_plan ( 
  interest_rate float NOT NULL,
  duration_in_months int NOT NULL,
  plan_id VARCHAR(10) NOT NULL, 
  PRIMARY KEY  (plan_id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE fd_account ( 
 account_no bigint NOT NULL  AUTO_INCREMENT ,
  balance DECIMAL(10,2) check (balance >= 0),
  opening_date DATETIME NOT NULL,
  saving_account_no bigint  NOT NULL ,
  plan_id VARCHAR(10) NOT NULL, 
  PRIMARY KEY  (account_no),
  FOREIGN KEY (saving_account_no) REFERENCES account (account_no) ON DELETE RESTRICT ON UPDATE CASCADE,
  FOREIGN KEY (plan_id) REFERENCES fd_plan (plan_id) ON DELETE RESTRICT ON UPDATE CASCADE

)ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE transaction ( 
 transaction_id bigint NOT NULL AUTO_INCREMENT, 
  account_no bigint NOT NULL ,
  credit_debit ENUM('credit','debit') DEFAULT 'debit',
  date_time DATETIME NOT NULL,
  amount DECIMAL(5,2) NOT NULL, 
  type_ ENUM('special','not_special') DEFAULT 'not_special', 
  is_fee boolean not null,
  agent_id VARCHAR(10),
  PRIMARY KEY  (transaction_id),
  FOREIGN KEY (account_no) REFERENCES account (account_no) ON DELETE RESTRICT ON UPDATE CASCADE,
  FOREIGN KEY (agent_id) REFERENCES mobile_agent (agent_id) ON DELETE RESTRICT ON UPDATE CASCADE

)ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- procedure to add interest to Fixed Deposit accounts

DELIMITER //

create procedure addFDInterestToAccount()
BEGIN

    DECLARE done INT DEFAULT FALSE;
    DECLARE op_date DATETIME;
    DECLARE acc_numb bigint;
    declare interest float default 0;
    declare account_type varchar(10);
    declare rate float;
    declare savings_account bigint;
    DECLARE cur1 CURSOR FOR select account_no from fd_account;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    OPEN cur1;

    read_loop: LOOP
      FETCH cur1 INTO acc_numb;
      IF done THEN
      LEAVE read_loop;
      END IF;

      SELECT opening_date from fd_account where account_no = acc_numb into op_date;
      IF floor(TIMESTAMPDIFF(day,op_date,now()))%30 =0 THEN
        start transaction;
        select balance from fd_account where account_no = acc_numb into interest;
        SELECT plan_id from fd_account where account_no = acc_numb into account_type;
        SELECT saving_account_no from fd_account where account_no = acc_numb into savings_account;
        select interest_rate from fd_plan where plan_id = account_type into rate;
        set interest = interest*rate/1200;

        insert into transaction (transaction_id, account_no, credit_debit, date_time, amount, type_, agent_id, is_fee)  values (null, savings_account, 'debit', now(), interest, 'not_special', null, false);
        update account set balance = balance + interest where account_no = savings_account;
        commit;
      END IF;

      END LOOP;
      CLOSE cur1;

      END //
    
DELIMITER ;

-- procedure to add interest to Saving accounts

DELIMITER //

create procedure addInterestToAccount()
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE op_date DATETIME;
    DECLARE acc_numb bigint;
    declare interest float default 0;
    declare account_type varchar(10);
    declare rate float;
    DECLARE cur1 CURSOR FOR select account_no from account;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    OPEN cur1;

    read_loop: LOOP
        FETCH cur1 INTO acc_numb;
        IF done THEN
        LEAVE read_loop;
        END IF;

        SELECT opening_date from account where account_no = acc_numb into op_date;
        IF floor(TIMESTAMPDIFF(day,op_date,now()))%30 = 0 THEN
            start transaction;
            select balance from account where account_no = acc_numb into interest;
            SELECT type_id from account where account_no = acc_numb into account_type;
            select interest_rate from account_type_info where type_id = account_type into rate;
            set interest = interest*rate/1200;

            insert into transaction (transaction_id, account_no, credit_debit, date_time, amount, type_, agent_id, is_fee)  values (null, account_number, 'debit', now(), interest, 'not_special', null, false);
            update account set balance = balance + interest where account_no = acc_numb;
            commit;
        END IF;
    END LOOP;
    CLOSE cur1;
  
  END //
DELIMITER ;


-- Triggers  
DELIMITER ;;


CREATE TRIGGER age_calculate
BEFORE INSERT ON customer
FOR EACH ROW
BEGIN
  SET new.age=floor(TIMESTAMPDIFF(YEAR,new.dob,curdate()));
END;;

DELIMITER ;

-- events 
SET GLOBAL event_scheduler = ON;
-- event to run the procedure addFDInterestToAccount once a day
CREATE EVENT fd_event
ON SCHEDULE EVERY 1 DAY
STARTS CURRENT_TIMESTAMP
DO call addFDInterestToAccount();

-- event to run the procedure addFDInterestToAccount once a day
CREATE EVENT saving_event
ON SCHEDULE EVERY 1 DAY
STARTS CURRENT_TIMESTAMP
DO call addInterestToAccount();






-- users
-- CREATE USER 'manager'@'localhost' IDENTIFIED BY 'manager@123';
-- CREATE USER 'admin'@'localhost' IDENTIFIED BY 'admin@123';
-- CREATE USER 'user'@'localhost' IDENTIFIED BY 'user@123';

-- GRANT ALL PRIVILEGES ON university.faculty TO 'manager'@'localhost';
-- flush privileges;

-- GRANT ALL PRIVILEGES ON university.takes TO 'uomcse'@'localhost';
-- flush privileges;
