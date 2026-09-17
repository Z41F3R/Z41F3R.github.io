+++
title = "Appointment"
description = "Máquina de Starting Point enfocada en la enumeración web y la explotación de SQL Injection."

platform = "HackTheBox"
OS = "Linux"
difficulty = "Very-Easy"

tags = [
"SQL Injection",
"Starting Point",
"Fundamental Exploitation"
]

image = "/images/writeups/Appointment/appointment.png"
+++

### Descripción general

**Appointment** es una máquina perteneciente a **Starting Point** de Hack The Box. Está diseñada para practicar conceptos fundamentales de enumeración web y explotación de una vulnerabilidad de **SQL Injection** en un formulario de autenticación.

El objetivo consiste en identificar el servicio web expuesto y utilizar una inyección SQL para modificar la consulta de autenticación y obtener acceso a la aplicación.

---

### Enumeración

Comenzamos realizando un escaneo con **Nmap** para identificar el servicio web disponible:

```bash
nmap -sC -sV -p 80 -sS --min-rate 5000 -T4 -Pn <TARGET_IP>
```

El escaneo muestra el siguiente resultado:

```text
PORT   STATE SERVICE VERSION
80/tcp open  http    Apache httpd 2.4.38 ((Debian))
```

El puerto `80/tcp` se encuentra abierto y corresponde al servicio **HTTP**. Además, Nmap identifica que la aplicación utiliza **Apache 2.4.38 sobre Debian**.

El título de la aplicación se identifica como:

```text
Login
```

Continuamos con la enumeración de directorios utilizando **Gobuster**:

```bash
gobuster dir -u http://<TARGET_IP> -w big.txt
```

Entre los resultados encontramos varios directorios relacionados con los recursos de la aplicación:

```text
css       (Status: 301)
fonts     (Status: 301)
images    (Status: 301)
js        (Status: 301)
vendor    (Status: 301)
```

La aplicación principal corresponde a un formulario de inicio de sesión.

---

### Acceso inicial

Al analizar el formulario de autenticación, identificamos que el campo de usuario puede ser susceptible a **SQL Injection**.

Para comprender el funcionamiento de la vulnerabilidad, podemos representar de forma simplificada la consulta SQL utilizada por la aplicación:

```sql
SELECT * FROM usuarios WHERE email = 'USER_INPUT' AND password = 'USER_INPUT';
```

La aplicación incorpora los valores introducidos por el usuario dentro de la consulta SQL para comprobar las credenciales.

El problema aparece cuando la entrada proporcionada por el usuario puede modificar la estructura de la consulta SQL en lugar de ser tratada únicamente como datos.

En el campo de usuario introducimos:

![sqli.es.png](/images/writeups/Appointment/login_bypass.png)

El payload puede dividirse en tres partes:

```text
admin  → valor que queremos utilizar como usuario
'      → cierra la comilla que delimita el valor del usuario
#      → inicia un comentario en SQL
```

Al introducir el payload, la consulta puede quedar representada de la siguiente manera:

```sql
SELECT * FROM usuarios WHERE email = 'admin'#' AND password = 'USER_INPUT';
```

El carácter `#` hace que todo lo que aparece después sea interpretado como un comentario. Por lo tanto, la parte correspondiente a la contraseña deja de formar parte de la consulta ejecutada.

La consulta efectiva queda simplificada a:

```sql
SELECT * FROM usuarios WHERE email = 'admin';
```

De esta manera, la aplicación solamente comprueba si existe un usuario cuyo valor corresponda a `admin`, sin realizar la validación de la contraseña.

El payload permite realizar un **bypass de autenticación** y acceder a la aplicación sin proporcionar una contraseña válida.

![sqli.es.png](/images/writeups/Appointment/sqli.es.png)

---

### Bandera

Después de conseguir acceso mediante la inyección SQL, obtenemos la bandera proporcionada por la máquina.

La obtención de la bandera confirma que el bypass de autenticación fue exitoso y permite completar **Appointment**.

![login_ok.png](/images/writeups/Appointment/login_ok.png)

---

### Conclusión

**Appointment** presenta un escenario sencillo basado en la enumeración de un servicio web y la explotación de una vulnerabilidad de **SQL Injection** en un formulario de autenticación.

El proceso seguido fue:

```text
Enumeración
    ↓
Identificación del puerto 80
    ↓
Detección del servicio HTTP
    ↓
Enumeración de directorios
    ↓
Identificación del formulario de Login
    ↓
SQL Injection
    ↓
Payload: admin'#
    ↓
Comentario del resto de la consulta
    ↓
Bypass de autenticación
    ↓
Obtención de la bandera
```

A pesar de su dificultad **Very Easy**, la máquina permite comprender de forma práctica cómo una entrada controlada por el usuario puede modificar una consulta SQL y afectar directamente al mecanismo de autenticación de una aplicación web.

---

### [Estado: Completada](https://labs.hackthebox.com/achievement/machine/3933963/402)

