+++
title = "Crocodile"
description = "Máquina de Starting Point enfocada en la enumeración de servicios, acceso FTP anónimo y descubrimiento de credenciales para acceder a un panel web."

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

### Descripción general

**Crocodile** es una máquina perteneciente a **Starting Point** de Hack The Box. Está diseñada para practicar conceptos fundamentales de enumeración de servicios, acceso mediante **FTP anónimo** y descubrimiento de credenciales.

El objetivo consiste en identificar los servicios expuestos, acceder al servidor FTP para obtener información sobre usuarios y contraseñas, y utilizar estas credenciales para acceder al panel web y localizar la bandera.

---

### Enumeración

Comenzamos realizando un escaneo con **Nmap** sobre los puertos `21` y `80`:

```bash
sudo nmap -sC -sV -p 21,80 --min-rate 5000 -sS -Pn -T5 <TARGET_IP>
```

El resultado muestra dos servicios expuestos:

```text
PORT   STATE SERVICE VERSION
21/tcp open  ftp     vsftpd 3.0.3
80/tcp open  http    Apache httpd 2.4.41 ((Ubuntu))
```

Además, Nmap identifica que el servidor FTP permite el acceso mediante **Anonymous FTP**:

```text
| ftp-anon: Anonymous FTP login allowed (FTP code 230)
| -rw-r--r--    1 ftp      ftp            33 Jun 08  2021 allowed.userlist
| -rw-r--r--    1 ftp      ftp            62 Apr 20  2021 allowed.userlist.passwd
```

Esto nos permite acceder al servicio FTP sin necesidad de credenciales:

```bash
ftp <TARGET_IP>
```

Utilizamos `anonymous` como usuario:

```text
Name (<TARGET_IP>:anonymous): anonymous
230 Login successful.
```

Al enumerar el contenido disponible encontramos dos archivos:

```text
allowed.userlist
allowed.userlist.passwd
```

Procedemos a descargarlos:

```text
ftp> get allowed.userlist
ftp> get allowed.userlist.passwd
```

Una vez descargados, podemos consultar su contenido:

```bash
cat allowed.userlist
cat allowed.userlist.passwd
```

Los archivos contienen una lista de usuarios y una lista de contraseñas que posteriormente podemos utilizar para identificar credenciales válidas.

---

### Enumeración web

El segundo servicio identificado se encuentra en el puerto `80`, donde se ejecuta un servidor **Apache HTTP**.

![sqli.es.png](/images/writeups/Crocodile/pagina_encontrada.png)

Para continuar con la enumeración del sitio web utilizamos **Gobuster**:

```bash
sudo gobuster dir -u http://<TARGET_IP> -w moding.txt -x php.html
```

Entre los resultados encontramos varios recursos, incluyendo:

```text
config.php           (Status: 200)
login.php            (Status: 200)
logout.php           (Status: 302)
dashboard            (Status: 301)
```

El recurso `login.php` resulta especialmente relevante, ya que corresponde a un panel de autenticación:

```text
http://<TARGET_IP>/login.php
```

---

### Acceso inicial

Después de obtener los usuarios y contraseñas mediante FTP, identificamos las credenciales correspondientes al usuario `admin`.

Estas credenciales pueden utilizarse en el formulario de autenticación disponible en:

```text
http://<TARGET_IP>/login.php
```

Ingresamos:

![login\_ok.png](/images/writeups/Crocodile/login.png)

La autenticación es exitosa y obtenemos acceso al panel web.

Una vez autenticados, encontramos la bandera de la máquina.

---

### Bandera

La bandera obtenida después de acceder al panel web es:

![login\_ok.png](/images/writeups/Crocodile/flag.png)

---

### Conclusión

**Crocodile** presenta un escenario sencillo basado en la enumeración de servicios, acceso mediante **FTP anónimo** y descubrimiento de credenciales.

El proceso seguido fue:

```text
Enumeración
    ↓
Identificación de FTP y HTTP
    ↓
Acceso mediante FTP Anonymous
    ↓
Obtención de allowed.userlist
    ↓
Obtención de allowed.userlist.passwd
    ↓
Enumeración del servidor web
    ↓
Descubrimiento de login.php
    ↓
Identificación de credenciales válidas
    ↓
Acceso al panel web
    ↓
Obtención de la bandera
```

A pesar de su dificultad **Very Easy**, la máquina permite practicar conceptos fundamentales relacionados con la enumeración de servicios, acceso FTP anónimo, descubrimiento de recursos web y reutilización de credenciales para obtener acceso a una aplicación web.

---

### [Estado: Completada](https://labs.hackthebox.com/achievement/machine/3933963/404)

