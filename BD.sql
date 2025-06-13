CREATE DATABASE jwt_db;
USE jwt_db;

CREATE TABLE usuarios(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    segundo_nombre VARCHAR(100),
    apellido_paterno VARCHAR(100) NOT NULL,
    apellido_materno VARCHAR(100) NOT NULL,
    usuario VARCHAR(100) NOT NULL UNIQUE, 
    password VARCHAR(255) NOT NULL
);
select *from usuarios;
drop database jwt_db; 
DROP TABLE IF EXISTS usuarios;

