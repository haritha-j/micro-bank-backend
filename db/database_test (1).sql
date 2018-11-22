INSERT INTO account_type_info VALUES ('ch@123','children',12,0,0,12),('te@123','teen',11,500,13,18),('ad@123','adults',10,1000,19,60),('se@123','senior',13,1000,61,150),('jo@123','joint',7,5000,0,150);

INSERT INTO employee VALUES ('emp1','mobile agent','chris','patt', 'male'),('emp2','Manager','tom','cruise', 'male'),('emp3','officer','emma','watson', 'female'),('emp4','mobile agent','mark','wood', 'male'),('emp5','mobile agent','scarlet','johanson', 'female'),('emp6','mobile agent','david','miller', 'male');



INSERT INTO mobile_agent VALUES ('agent1','emp1'),('agent2','emp4'),('agent3','emp5'),('agent4','emp6');


INSERT INTO account VALUES ('ch@123',84365289116,1203.56,'2006-02-14 22:04:36','agent1','hd#74537jdg83'),('te@123',23365280016,234657.00,'2007-04-14 6:04:36','agent1','ty74537jdg83'),('ch@123',56365289116,3456.24,'2016-02-14 22:04:36','agent2','hp774537jdg83'),('ad@123',78365289116,1203.56,'2009-02-14 12:04:36','agent3','iu874537jdg83'),('se@123',1035289116,45997.24,'2016-02-14 22:04:36','agent2','vrt74537jdg83'),('ad@123',40365289116,3456.56,'2014-02-14 03:04:11','agent4','gbv74537jdg83');

INSERT INTO customer VALUES ('ahkam','naseek','962371932v','male','1996-08-24','cust1',23,'335 egoda uyana, moratuwa'),('alan','walker','902371932v','male','1990-08-24','cust2',28,'02 egoda uyana, colombo'),('ruvan','pathirana','932371932v','male','1993-08-24','cust3',26,'02 egoda uyana, gampaha'),('akila','dananjaya','922371932v','male','1992-08-24','cust4',25,'9 egoda uyana, kalutara'),('dulaj','sameera','892371932v','male','1989-08-24','cust5',25,'66 egoda uyana, matara');


INSERT INTO customer_phone VALUES ('cust1',0776040385),('cust2',0774525652),('cust3',0755349046),('cust4',0726040385),('cust5',0766040385);

INSERT INTO employee_phone VALUES ('emp1',0776040385),('emp2',0774525652),('emp3',0755349046),('emp4',0726040385),('emp5',0776040385),('emp6',0774525652);


INSERT INTO owner_info VALUES ('cust1',84365289116),('cust2',23365280016),('cust3',56365289116),('cust4',78365289116),('cust5',1035289116);


INSERT INTO fd_plan VALUES (13,6,'short@123'),(14,12,'medium@123'),(15,36,'long@123');


INSERT INTO fd_account VALUES (64542311,59874.00,'2016-02-15 04:34:33',23365280016,'short@123'),(77142311,45678.00,'2011-02-15 04:34:33',1035289116,'medium@123'),(90842311,12345.00,'2013-02-15 04:34:33',40365289116,'long@123');


INSERT INTO transaction VALUES ('trans@1',78365289116,'debit','2018-02-15 04:34:33',1000,'not_special','agent1'),('trans@2',1035289116,'credit','2005-02-15 04:34:33',3876,'not_special','agent2'),('trans@3',40365289116,'debit','2007-02-15 04:34:33',9600,'special','agent3');
