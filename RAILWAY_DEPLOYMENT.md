# 🚀 Guía Completa: Desplegar Backend en Railway

Esta guía te llevará paso a paso para desplegar tu backend de recetas mexicanas en Railway.

---

## 📋 Tabla de Contenidos

1. [Preparar el Backend para Railway](#1-preparar-el-backend-para-railway)
2. [Crear Base de Datos MySQL en Railway](#2-crear-base-de-datos-mysql-en-railway)
3. [Desplegar el Backend en Railway](#3-desplegar-el-backend-en-railway)
4. [Ejecutar el Seed de Datos](#4-ejecutar-el-seed-de-datos)
5. [Verificación Final](#5-verificación-final)

---

## 1. Preparar el Backend para Railway

### 1.1 Verificar archivos necesarios

Tu backend ya tiene todo lo necesario:

✅ **Dockerfile** - Para construir la imagen en Railway
✅ **.dockerignore** - Para excluir archivos innecesarios
✅ **package.json** - Con script `start: node dist/server.js`
✅ **.env.example** - Plantilla de variables de entorno

### 1.2 Subir a GitHub (si no lo has hecho)

```bash
cd c:\Users\h\Downloads\recetas-mexicanas\recetas-mexicanas

# Inicializar Git
git init
git add .
git commit -m "Initial commit - Recetas Mexicanas"

# Crear repositorio en GitHub y subir
# Ve a https://github.com y crea un nuevo repositorio llamado "recetas-mexicanas"
git remote add origin https://github.com/TU-USUARIO/recetas-mexicanas.git
git branch -M main
git push -u origin main
```

---

## 2. Crear Base de Datos MySQL en Railway

### 2.1 Acceder a Railway

1. Ve a [https://railway.app](https://railway.app)
2. Inicia sesión con tu cuenta (GitHub, Google, o email)

### 2.2 Crear un Nuevo Proyecto

1. Haz clic en **"New Project"**
2. Selecciona **"Provision MySQL"**
3. Railway creará automáticamente una base de datos MySQL

### 2.3 Obtener las Credenciales de la Base de Datos

1. Haz clic en el servicio **MySQL** que acabas de crear
2. Ve a la pestaña **"Variables"**
3. Verás las siguientes variables (cópialas en un lugar seguro):
   - `MYSQLHOST` o `MYSQL_HOST`
   - `MYSQLPORT` o `MYSQL_PORT` (generalmente 3306)
   - `MYSQLUSER` o `MYSQL_USER` (generalmente "root")
   - `MYSQLPASSWORD` o `MYSQL_PASSWORD`
   - `MYSQLDATABASE` o `MYSQL_DATABASE` (generalmente "railway")

💡 **Tip:** También puedes encontrar una URL de conexión completa en la variable `DATABASE_URL`

---

## 3. Desplegar el Backend en Railway

### 3.1 Agregar el Servicio del Backend

**Opción A: Desplegar desde GitHub (Recomendado)**

1. En tu proyecto de Railway, haz clic en **"New"** → **"GitHub Repo"**
2. Selecciona tu repositorio `recetas-mexicanas`
3. Railway detectará automáticamente el Dockerfile

**Opción B: Desplegar desde Railway CLI**

```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Iniciar sesión
railway login

# Vincular tu proyecto
cd c:\Users\h\Downloads\recetas-mexicanas\recetas-mexicanas\backend
railway link

# Desplegar
railway up
```

### 3.2 Configurar el Root Directory

⚠️ **MUY IMPORTANTE:** Como tu Dockerfile está en la carpeta `backend`, debes configurar esto:

1. Haz clic en tu servicio del **Backend** (no MySQL)
2. Ve a **"Settings"**
3. Busca **"Root Directory"**
4. Escribe: `backend`
5. Haz clic en **"Save"**

### 3.3 Configurar Variables de Entorno en Railway

1. Haz clic en tu servicio del **Backend**
2. Ve a la pestaña **"Variables"**
3. Haz clic en **"Raw Editor"**
4. Pega lo siguiente:

```env
PORT=3000
DB_HOST=${{MySQL.MYSQLHOST}}
DB_PORT=${{MySQL.MYSQLPORT}}
DB_USER=${{MySQL.MYSQLUSER}}
DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}
DB_NAME=${{MySQL.MYSQLDATABASE}}
UPLOAD_PATH=./uploads/fotos
MAX_FILE_SIZE=10485760
JWT_SECRET=cambia_esto_por_una_clave_super_segura_en_produccion_12345
```

> [!TIP]
> Las variables `${{MySQL.VARIABLE}}` se referencian automáticamente desde tu servicio MySQL. Railway las resolverá automáticamente.

5. Haz clic en **"Save"** o presiona `Ctrl + S`

### 3.4 Generar Dominio Público

1. Ve a **"Settings"** de tu servicio Backend
2. Busca la sección **"Networking"**
3. Haz clic en **"Generate Domain"**
4. Railway te dará una URL como: `https://recetas-mexicanas-production.up.railway.app`
5. **Copia esta URL**, la necesitarás para el frontend

### 3.5 Verificar el Despliegue

1. Ve a la pestaña **"Deployments"** en Railway
2. Verifica que el estado sea **"Success"** (✅ verde)
3. Revisa los **"Logs"** para asegurarte de que no haya errores
4. Deberías ver algo como:
   ```
   🚀 Servidor corriendo en http://localhost:3000
   📊 API disponible en http://localhost:3000/api
   🏥 Health check: http://localhost:3000/api/health
   ```

---

## 4. Ejecutar el Seed de Datos

### 4.1 Opción A: Usando Railway CLI (Recomendado)

```bash
# Asegúrate de estar en la carpeta backend
cd c:\Users\h\Downloads\recetas-mexicanas\recetas-mexicanas\backend

# Ejecutar el seed
railway run npm run seed
```

### 4.2 Opción B: Conectarte manualmente a MySQL

Si prefieres usar un cliente MySQL como **MySQL Workbench** o **DBeaver**:

1. Usa las credenciales que copiaste en el paso 2.3
2. Conecta a la base de datos
3. Ejecuta manualmente las consultas SQL para crear las tablas y datos

---

## 5. Verificación Final

### 5.1 Probar el Endpoint de Salud

Abre tu navegador y ve a:

```
https://tu-app.up.railway.app/api/health
```

Deberías ver algo como:

```json
{
  "success": true,
  "message": "API funcionando correctamente",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### 5.2 Probar el Endpoint de Recetas

```
https://tu-app.up.railway.app/api/recetas
```

Deberías ver un JSON con las recetas.

### 5.3 Probar desde tu App Ionic (Local)

Actualiza temporalmente tu servicio en el frontend para apuntar a Railway y prueba que funcione:

```typescript
// En tu servicio de Angular
private apiUrl = 'https://tu-app.up.railway.app/api';
```

---

## 🎉 ¡Listo!

Tu backend ahora está desplegado en Railway y funcionando.

**Anota tu URL:** `https://tu-app.up.railway.app`

La necesitarás para configurar el frontend y generar el APK.

---

## 🆘 Solución de Problemas Comunes

### ❌ Error: "Cannot connect to database"

- Verifica que las variables de entorno estén correctamente configuradas
- Asegúrate de que el servicio MySQL esté corriendo en Railway
- Revisa los logs del backend para ver el error exacto

### ❌ Error: "Build failed" o "tsc: Permission denied"

- Verifica que el **Root Directory** esté configurado como `backend`
- Asegúrate de que el `Dockerfile` esté en la carpeta `backend`
- Revisa los logs de build en Railway para ver el error específico

### ❌ Error: "Port already in use"

- No te preocupes, Railway asigna automáticamente el puerto
- Tu código ya usa `process.env.PORT || 3000`, así que está bien

### ❌ El seed no funciona

- Asegúrate de estar en la carpeta `backend` cuando ejecutes `railway run npm run seed`
- Verifica que el servicio MySQL esté corriendo
- Revisa que las credenciales de la base de datos sean correctas

---

## 📝 Checklist Final

- [ ] Base de datos MySQL creada en Railway
- [ ] Backend desplegado en Railway
- [ ] Root Directory configurado como `backend`
- [ ] Variables de entorno configuradas correctamente
- [ ] Dominio público generado
- [ ] Seed de datos ejecutado
- [ ] Endpoint `/api/health` funcionando
- [ ] Endpoint `/api/recetas` devolviendo datos

---

## 📚 Próximos Pasos

Ahora que tu backend está en producción, continúa con la [Guía de Generación de APK](file:///c:/Users/h/Downloads/recetas-mexicanas/recetas-mexicanas/APK_GENERATION.md).
