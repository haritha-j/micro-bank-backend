drop database database_proj;
create database database_proj;
use database_proj;

CREATE TABLE account_type_info ( 
  type_id VARCHAR(10) NOT NULL ,
  type_name VARCHAR(45) NOT NULL ,
  interest_rate float NOT NULL,
  minimum_balance DECIMAL(10,2) NOT NULL,
  min_age tinyint unsigned check (min_age >= 0),
  max_age tinyint unsigned check (max_age >= 0) ,
  PRIMARY KEY (type_id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8; 

CREATE TABLE employee ( 
 employee_id VARCHAR(10) NOT NULL ,
  employee_type varchar(45) not null,
  first_name varchar(45) not null,
  last_name varchar(45) not null,
  gender ENUM('male','female') DEFAULT 'male',
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
  balance DECIMAL(10,2) NOT NULL ,
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
  PRIMARY KEY  (account_no),
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
 account_no bigint NOT NULL ,
  balance DECIMAL(10,2) NOT NULL,
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
  amount DECIMAL(10,2) NOT NULL, 
  type_ ENUM('special','not_special') DEFAULT 'not_special', 
  is_fee boolean not null,
  agent_id VARCHAR(10),
  PRIMARY KEY  (transaction_id),
  FOREIGN KEY (account_no) REFERENCES account (account_no) ON DELETE RESTRICT ON UPDATE CASCADE,
  FOREIGN KEY (agent_id) REFERENCES mobile_agent (agent_id) ON DELETE RESTRICT ON UPDATE CASCADE

)ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Triggers  
DELIMITER ;;
CREATE TRIGGER age_calculate
BEFORE INSERT ON customer
FOR EACH ROW
BEGIN
  SET new.age=floor(TIMESTAMPDIFF(YEAR,new.dob,curdate()));
END;;

DELIMITER ;