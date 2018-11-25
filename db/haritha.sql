
-- required procedures
-- deposit to account
-- withdraw from account
-- chargeFee from account
-- add interest to account

--required functions
--calculate interest
-- calculate fd interest

-- the null transaction id wont work as long as autoincrement is disabled
drop PROCEDURE addInterestToAccount;
DELIMITER //
create procedure addInterestToAccount(in account_number bigint(20))
BEGIN
    declare interest float default 0;
    start transaction;
    select balance from account where account_no = account_number into interest;
    set interest = interest*0.1;
    insert into transaction (transaction_id, account_no, credit_debit, date_time, amount, type_, agent_id, is_fee)  values (null, account_number, 'debit', now(), interest, 'not_special', null, false);
    update account set balance = balance + interest where account_no = account_number;
    commit;
END //
DELIMITER ;

call addInterestToAccount(84365289118);

DELIMITER //
create PROCEDURE specialWithdraw(in account_number bigint(20), in withdrawal float)
BEGIN
    start transaction;

    -- check balance
    declare balanceCheck boolean default false;
    declare balanceAmount float DEFAULT 0;
    select balance from account where account_no = account_number into balanceAmount;
    if withdrawal + 50 < balanceAmount
        THEN set balanceCheck = true;
    end if;

    -- reduce amount
    insert into transaction (transaction_id, account_no, credit_debit, date_time, amount, type_, agent_id, is_fee)  values (null, account_number, 'credit', now(), withdrawal, 'special', null, false);
    update account set balance = balance - withdrawal where account_no = account_number;

    -- record fee
    insert into transaction (transaction_id, account_no, credit_debit, date_time, amount, type_, agent_id, is_fee)  values (null, account_number, 'credit', now(), 50, 'not_special', null, true);
    update account set balance = balance - 50 where account_no = account_number;
   
    commit;
END //
DELIMITER ;

drop PROCEDURE withdraw;
DELIMITER //
create PROCEDURE withdraw(in account_number bigint(20), in withdrawal float)
BEGIN
       
    -- check balance
    declare balanceCheck boolean default false;
    declare balanceAmount float DEFAULT 0;
    declare success boolean default false;
    start TRANSACTION;
    select balance from account where account_no = account_number into balanceAmount;
    if withdrawal < balanceAmount
        THEN 
            insert into transaction (transaction_id, account_no, credit_debit, date_time, amount, type_, agent_id, is_fee)  values (34, account_number, 'credit', now(), withdrawal, 'not_special', null, false);
            update account set balance = balance - withdrawal where account_no = account_number;
            set success = true;
    commit;
    end if;

    -- withdraw amount

END //
DELIMITER ;

call withdraw(84365289118, 30);

