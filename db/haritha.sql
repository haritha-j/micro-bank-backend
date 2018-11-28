
-- required procedures
-- deposit to account
-- withdraw from account
-- chargeFee from account
-- add interest to account

-- required functions
-- calculate interest
-- calculate fd interest

-- the null transaction id wont work as long as autoincrement is disabled

DELIMITER //

create procedure addInterestToAccount(in account_number bigint(20))
BEGIN
    declare interest float default 0;
    declare account_type varchar(10);
    declare rate float;
    start transaction;
    select balance from account where account_no = account_number into interest;
    SELECT type_id from account where account_no = account_number into account_type;
    select interest_rate from account_type_info where type_id = account_type into rate;
    set interest = interest*rate/1200;

    insert into transaction (transaction_id, account_no, credit_debit, date_time, amount, type_, agent_id, is_fee)  values (null, account_number, 'debit', now(), interest, 'not_special', null, false);
    update account set balance = balance + interest where account_no = account_number;
    commit;
END //
DELIMITER ;

call addInterestToAccount(222);

DELIMITER //
create PROCEDURE specialWithdraw(in account_number bigint(20), in withdrawal float, in agentid varchar(10))
BEGIN
    start transaction;
    -- reduce amount
    insert into transaction (transaction_id, account_no, credit_debit, date_time, amount, type_, agent_id, is_fee)  values (null, account_number, 'credit', now(), withdrawal, 'special', agentid, false);
    update account set balance = balance - withdrawal where account_no = account_number;

    -- record fee
    insert into transaction (transaction_id, account_no, credit_debit, date_time, amount, type_, agent_id, is_fee)  values (null, account_number, 'credit', now(), 50, 'not_special', null, true);
    update account set balance = balance - 50 where account_no = account_number;
    select account_no, balance from account where account_no = account_number;
   
    commit;
END //
DELIMITER ;


call specialWithdraw(222, 30, 'agent1');


DELIMITER //
create PROCEDURE withdraw(in account_number bigint(20), in withdrawal float, in agentid varchar(10))
BEGIN
    start TRANSACTION;
     -- withdraw amount
    insert into transaction (transaction_id, account_no, credit_debit, date_time, amount, type_, agent_id, is_fee)  values (null, account_number, 'credit', now(), withdrawal, 'not_special', agentid, false);
    update account set balance = balance - withdrawal where account_no = account_number;
    commit;
END //
DELIMITER ;

call withdraw(222, 30, 'agent1');


DELIMITER //
create PROCEDURE deposit(in account_number bigint(20), in deposit float, in agentid varchar(10))
BEGIN
    start TRANSACTION;
     -- deposit amount
    insert into transaction (transaction_id, account_no, credit_debit, date_time, amount, type_, agent_id, is_fee)  values (null, account_number, 'debit', now(), deposit, 'not_special', agentid, false);
    update account set balance = balance + deposit where account_no = account_number;
    commit;
END //
DELIMITER ;

call deposit(84365289118, 1200, 'agent1');

delimiter //
create function checkBalance(account_number bigint(20), withdrawal float)
returns boolean
BEGIN
    -- check balance
    declare balanceCheck boolean default false;
    declare balanceAmount float DEFAULT 0;
    declare minimum float DEFAULT 0;
    select minimum_balance from account join account_type_info on account.type_id = account_type_info.type_id where account.account_no = account_number into minimum;
    select balance from account where account_no = account_number into balanceAmount;
    if withdrawal+minimum < balanceAmount
        THEN set balanceCheck = true;
    end if;
    return balanceCheck;
end //
delimiter ;

select checkbalance(222, 30);


DELIMITER //

create procedure addFDInterestToAccount(in account_number bigint(20))
BEGIN
    declare interest float default 0;
    declare account_type varchar(10);
    declare rate float;
    declare savings_account bigint(20);

    start transaction;
    select balance from fd_account where account_no = account_number into interest;
    SELECT plan_id from fd_account where account_no = account_number into account_type;
    SELECT saving_account_no from fd_account where account_no = account_number into savings_account;
    select interest_rate from fd_plan where plan_id = account_type into rate;
    set interest = interest*rate/1200;

    insert into transaction (transaction_id, account_no, credit_debit, date_time, amount, type_, agent_id, is_fee)  values (null, savings_account, 'debit', now(), interest, 'not_special', null, false);
    update account set balance = balance + interest where account_no = savings_account;
    commit;
END //
DELIMITER ;

call addFDInterestToAccount(90842311);


  GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, DROP, INDEX, ALTER, CREATE TEMPORARY TABLES, CREATE VIEW, EVENT, TRIGGER, SHOW VIEW, CREATE ROUTINE, ALTER ROUTINE, EXECUTE ON  `database\_proj`.* TO 'admin'@'localhost';

  REVOKE ALL PRIVILEGES ON  `database_proj`.`transaction` FROM 'manager'@'localhost';  GRANT SELECT ON  `database_proj`.`transaction` TO 'manager'@'localhost';

  REVOKE ALL PRIVILEGES ON `database_proj`.* FROM 'dbuser'@'localhost'; REVOKE GRANT OPTION ON `database_proj`.* FROM 'dbuser'@'localhost'; GRANT SELECT, INSERT, UPDATE ON `database_proj`.* TO 'dbuser'@'localhost';