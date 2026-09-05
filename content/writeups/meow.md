+++
title = "Meow"
description = "Starting Point machine focused on service enumeration and remote access through Telnet."

platform = "HackTheBox"
OS = "Linux"
difficulty = "Very-Easy"

tags = [
"Telnet",
"Enumeration",
"Starting Point"
]

image = "/images/writeups/meow.png"
+++

### Overview

**Meow** is a machine from the **Starting Point** path on Hack The Box. It is designed as an introduction to fundamental concepts such as reconnaissance, service enumeration, and remote access.

The objective is to identify the services exposed by the target and use the information gathered during enumeration to gain access to the system.

---

### Enumeration

We begin by performing an **Nmap** scan to identify the ports and services available on the target:

```bash
nmap -sC -sV <TARGET_IP>
```

The scan reveals the following result:

```text
Starting Nmap 7.95
Nmap scan report for <TARGET_IP>

PORT   STATE SERVICE
23/tcp open  telnet
```

Port `23/tcp` is open and corresponds to the **Telnet** service.

Since Telnet is commonly used to establish remote connections to a system, we proceed to investigate it as a potential access vector.

---

### Initial Access

We attempt to connect to the Telnet service:

```bash
telnet <TARGET_IP>
```

The connection is established successfully and the service requests authentication:

```text
Trying <TARGET_IP>...
Connected to <TARGET_IP>.

login:
Password:
```

Using the credentials provided by the lab, we successfully authenticate to the target.

The session provides direct access to the system:

```text
root@meow:~#
```

The `#` prompt indicates that the current session has elevated privileges.

---

### Flag

Once access is obtained, we proceed to locate the flag:

```bash
cat /root/flag.txt
```

The flag is displayed directly in the terminal:

```text
<FLAG>
```

This completes the **Meow** machine.

### Conclusion

---

**Meow** presents a simple scenario primarily focused on service enumeration and remote access through Telnet.

The methodology followed was:

```text
Enumeration
    ↓
Port 23 Identification
    ↓
Telnet Detection
    ↓
Service Connection
    ↓
Authentication
    ↓
System Access
    ↓
Flag Retrieval
```

Despite its **Very Easy** difficulty, the machine reinforces one of the fundamental principles of offensive security: **enumerate the target before attempting to gain access**.

---

### [Completed](https://labs.hackthebox.com/achievement/machine/3933963/394)
