+++
title = "Meow"
description = "Máquina de Starting Point enfocada en enumeración de servicios y acceso remoto mediante Telnet."

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

### Descripción general

**Meow** es una máquina perteneciente a **Starting Point** de Hack The Box. Está diseñada como una introducción a los conceptos fundamentales de reconocimiento, enumeración de servicios y acceso remoto.

El objetivo consiste en identificar los servicios expuestos por el objetivo y utilizar la información obtenida durante la enumeración para conseguir acceso al sistema.

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
23/tcp open  telnet
```

El puerto `23/tcp` se encuentra abierto y corresponde al servicio **Telnet**.

Al tratarse de un servicio utilizado para establecer conexiones remotas, procedemos a investigar esta vía de acceso.

---

### Acceso inicial

Intentamos conectarnos al servicio Telnet:

```bash
telnet <TARGET_IP>
```

La conexión se establece correctamente y el servicio solicita autenticación:

```bash
Trying <TARGET_IP>...
Connected to <TARGET_IP>.

login:
Password:
```

Utilizando las credenciales proporcionadas por el laboratorio, conseguimos autenticarnos correctamente.

La sesión nos proporciona acceso directo al sistema:

```bash
root@meow:~#
```

El indicador `#` permite identificar que la sesión dispone de privilegios elevados.

---

### Bandera

Una vez obtenido el acceso, procedemos a localizar la bandera:

```bash
cat /root/flag.txt
```

El contenido de la bandera se muestra directamente en la terminal:

```text
<FLAG>
```

Con esto se completa la máquina **Meow**.

---

### Conclusión

**Meow** presenta un escenario sencillo basado principalmente en la enumeración de servicios y el acceso remoto mediante Telnet.

El proceso seguido fue:

```text
Enumeración
    ↓
Identificación del puerto 23
    ↓
Detección de Telnet
    ↓
Conexión al servicio
    ↓
Autenticación
    ↓
Acceso al sistema
    ↓
Obtención de la bandera
```

A pesar de su dificultad **Very Easy**, la máquina permite reforzar una de las bases fundamentales de la seguridad ofensiva: **enumerar el objetivo antes de intentar obtener acceso**.

---

### [Estado: Completada](https://labs.hackthebox.com/achievement/machine/3933963/394)

