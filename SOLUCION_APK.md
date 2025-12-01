# 🎯 Solución al Problema: App no Muestra Recetas

## ✅ Problema Identificado

El servicio `receta.service.ts` estaba usando una URL hardcodeada:
```typescript
private apiUrl = 'http://localhost:3000/api/recetas'; // ❌ INCORRECTO
```

En lugar de usar la variable de entorno:
```typescript
private apiUrl = `${environment.apiUrl}/recetas`; // ✅ CORRECTO
```

**Resultado:** La app del teléfono intentaba conectarse a `localhost` en lugar de a Railway.

---

## 🔧 Solución Aplicada

He actualizado `src/app/services/receta.service.ts` para que use correctamente la variable de entorno.

Ahora:
- En **desarrollo** usará: `http://localhost:3000/api`
- En **producción** usará: `https://recetas-production-a79e.up.railway.app/api`

---

## 📱 Pasos para Reconstruir el APK

**IMPORTANTE:** Debes reconstruir el APK para que este cambio se aplique.

### 1. Limpiar build anterior

```bash
cd c:\Users\h\Downloads\recetas-mexicanas\recetas-mexicanas
Remove-Item -Recurse -Force www -ErrorAction SilentlyContinue
```

### 2. Build de producción

```bash
npm run build -- --configuration=production
```

Esto debería tomar unos minutos. Verás algo como:
```
✔ Browser application bundle generation complete.
✔ Copying assets complete.
✔ Index html generation complete.
```

### 3. Sincronizar con Capacitor

```bash
npx cap sync android
```

### 4. Abrir en Android Studio

```bash
npx cap open android
```

### 5. Generar nuevo APK

En Android Studio:
1. Espera a que termine de cargar (barra de progreso en la parte inferior)
2. Ve a **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
3. Espera a que termine (verás una notificación)
4. Haz clic en **"locate"** para encontrar el APK
5. El APK estará en: `android/app/build/outputs/apk/debug/app-debug.apk`

### 6. Instalar en tu teléfono

**Opción A: Por USB**
1. Conecta tu teléfono por USB
2. En Android Studio, haz clic en el botón ▶️ **"Run"**
3. Selecciona tu dispositivo

**Opción B: Transferir APK**
1. Copia el archivo `app-debug.apk` a tu teléfono
2. Abre el archivo en tu teléfono
3. Instala (reemplazará la versión anterior)

---

## ✅ Verificación

Después de instalar el nuevo APK:

1. **Abre la app** en tu teléfono
2. **Verifica que veas la receta** "Tacos de Prueba" que creaste desde Postman
3. **Intenta crear una nueva receta** desde la app
4. **Verifica que aparezca** en la lista inmediatamente

Si todo funciona correctamente, deberías ver:
- ✅ La receta de prueba que creaste desde Postman
- ✅ Poder crear nuevas recetas desde el teléfono
- ✅ Las recetas se actualizan en tiempo real

---

## 🔍 Cómo Verificar que Está Usando la URL Correcta

Si quieres confirmar que la app está usando la URL de Railway:

1. Conecta tu teléfono por USB
2. Abre Chrome en tu PC
3. Ve a `chrome://inspect`
4. Selecciona tu app
5. En la consola, deberías ver las peticiones a `https://recetas-production-a79e.up.railway.app`

---

## 📝 Comandos Rápidos (Copia y Pega)

```bash
# Ir a la carpeta del proyecto
cd c:\Users\h\Downloads\recetas-mexicanas\recetas-mexicanas

# Limpiar build anterior
Remove-Item -Recurse -Force www -ErrorAction SilentlyContinue

# Build de producción
npm run build -- --configuration=production

# Sincronizar con Capacitor
npx cap sync android

# Abrir en Android Studio
npx cap open android
```

Luego en Android Studio: **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**

---

## 🎉 Resultado Esperado

Después de instalar el nuevo APK:
- ✅ La app se conectará a Railway
- ✅ Verás todas las recetas que hayas creado
- ✅ Podrás crear, editar y eliminar recetas desde el teléfono
- ✅ Los cambios se sincronizarán con la base de datos en Railway
