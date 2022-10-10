DROP PROCEDURE IF EXISTS insertData;

DELIMITER $$

CREATE PROCEDURE insertData()
BEGIN
    DECLARE i INT DEFAULT 1;
    WHILE  i <= 100 DO
        INSERT INTO post (code, title, contents, fk_user_code) VALUES (i, CONCAT('title',i), 'contents...', '4e50c03132843fa0a420a0476bb061d4');
        SET i = i + 1;
    END WHILE;
END$$
DELIMITER ;

CALL insertData();