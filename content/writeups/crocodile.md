+++
title = "Crocodile"
description = "Starting Point machine focused on service enumeration, anonymous FTP access, and credential discovery to access a web panel."

platform = "HackTheBox"
OS = "Linux"
difficulty = "Very-Easy"

tags = [
"FTP",
"Web",
"Credential Discovery",
"Starting Point",
"Fundamental Exploitation"
]

image = "/images/writeups/Crocodile/crocodile.png"
+++

### Overview

**Crocodile** is a machine from the **Starting Point** path on Hack The Box. It is designed to practice fundamental concepts of service enumeration, **anonymous FTP access**, and credential discovery.

The objective is to identify the exposed services, access the FTP server to obtain information about users and passwords, and use these credentials to access the web panel and locate the flag.

---

### Enumeration

We begin by performing a scan with **Nmap** on ports `21` and `80`:

```bash
sudo nmap -sC -sV -p 21,80 --min-rate 5000 -sS -Pn -T5 <TARGET_IP>
```

The result shows two exposed services:

```text
PORT   STATE SERVICE VERSION
21/tcp open  ftp     vsftpd 3.0.3
80/tcp open  http    Apache httpd 2.4.41 ((Ubuntu))
```

Additionally, Nmap identifies that the FTP server allows access through **Anonymous FTP**:

```text
| ftp-anon: Anonymous FTP login allowed (FTP code 230)
| -rw-r--r--    1 ftp      ftp            33 Jun 08  2021 allowed.userlist
| -rw-r--r--    1 ftp      ftp            62 Apr 20  2021 allowed.userlist.passwd
```

This allows us to access the FTP service without credentials:

```bash
ftp <TARGET_IP>
```

We use `anonymous` as the username:

```text
Name (<TARGET_IP>:anonymous): anonymous
230 Login successful.
```

By enumerating the available content, we find two files:

```text
allowed.userlist
allowed.userlist.passwd
```

We proceed to download them:

```text
ftp> get allowed.userlist
ftp> get allowed.userlist.passwd
```

Once downloaded, we can inspect their contents:

```bash
cat allowed.userlist
cat allowed.userlist.passwd
```

The files contain a list of users and a list of passwords that can later be used to identify valid credentials.

---

### Web Enumeration

The second identified service is running on port `80`, where an **Apache HTTP** server is running.

![sqli.es.png](/images/writeups/Crocodile/pagina_encontrada.png)

To continue enumerating the website, we use **Gobuster**:

```bash
sudo gobuster dir -u http://<TARGET_IP> -w moding.txt -x php.html
```

Among the results, we find several resources, including:

```text
config.php           (Status: 200)
login.php            (Status: 200)
logout.php           (Status: 302)
dashboard            (Status: 301)
```

The `login.php` resource is particularly relevant, as it corresponds to an authentication panel:

```text
http://<TARGET_IP>/login.php
```

---

### Initial Access

After obtaining the users and passwords through FTP, we identify the credentials corresponding to the `admin` user.

These credentials can be used in the authentication form available at:

```text
http://<TARGET_IP>/login.php
```

We enter:

![login\_ok.png](/images/writeups/Crocodile/login.png)

The authentication is successful and we gain access to the web panel.

Once authenticated, we find the machine's flag.

---

### Flag

The flag obtained after accessing the web panel is:

![login\_ok.png](/images/writeups/Crocodile/flag.png)

---

### Conclusion

**Crocodile** presents a straightforward scenario based on service enumeration, **anonymous FTP access**, and credential discovery.

The process followed was:

```text
Enumeration
    ↓
Identification of FTP and HTTP
    ↓
Anonymous FTP Access
    ↓
Retrieval of allowed.userlist
    ↓
Retrieval of allowed.userlist.passwd
    ↓
Web Server Enumeration
    ↓
Discovery of login.php
    ↓
Identification of Valid Credentials
    ↓
Web Panel Access
    ↓
Flag Retrieval
```

Despite its **Very Easy** difficulty, the machine allows us to practice fundamental concepts related to service enumeration, anonymous FTP access, web resource discovery, and credential reuse to gain access to a web application.

---

### [Status: Completed](https://labs.hackthebox.com/achievement/machine/3933963/404)

