# 📱 Guía de Generación de APK para Android

Esta guía te llevará paso a paso para generar un APK de tu aplicación de recetas mexicanas que cualquier persona pueda instalar en su teléfono Android.

## Prerrequisitos

- ✅ Backend desplegado en Railway (ver [RAILWAY_DEPLOYMENT.md](file:///c:/Users/h/Downloads/recetas-mexicanas/recetas-mexicanas/RAILWAY_DEPLOYMENT.md))
- ✅ Node.js instalado
- ✅ Java JDK 17 o superior

---

## Paso 1: Instalar Android Studio

### 1.1 Descargar Android Studio

1. Ve a [developer.android.com/studio](https://developer.android.com/studio)
2. Descarga Android Studio para Windows
3. Ejecuta el instalador y sigue las instrucciones

### 1.2 Configurar SDK de Android

1. Abre Android Studio
2. Ve a **"More Actions"** → **"SDK Manager"**
3. En la pestaña **"SDK Platforms"**, marca:
   - ✅ Android 13.0 (Tiramisu) - API Level 33
   - ✅ Android 12.0 (S) - API Level 31
4. En la pestaña **"SDK Tools"**, marca:
   - ✅ Android SDK Build-Tools
   - ✅ Android SDK Command-line Tools
   - ✅ Android Emulator
   - ✅ Android SDK Platform-Tools
5. Haz clic en **"Apply"** y espera a que se descarguen

### 1.3 Configurar Variables de Entorno

1. Busca "Variables de entorno" en Windows
2. Agrega estas variables de sistema:

```
ANDROID_HOME=C:\Users\TU-USUARIO\AppData\Local\Android\Sdk
JAVA_HOME=C:\Program Files\Android\Android Studio\jbr
```

3. Agrega a la variable `Path`:

```
%ANDROID_HOME%\platform-tools
%ANDROID_HOME%\tools
%ANDROID_HOME%\tools\bin
%JAVA_HOME%\bin
```

4. Reinicia tu terminal

### 1.4 Verificar Instalación

```bash
java -version
# Debería mostrar: openjdk version "17.x.x" o superior

adb --version
# Debería mostrar: Android Debug Bridge version x.x.x
```

---

## Paso 2: Configurar Capacitor para Android

### 2.1 Actualizar capacitor.config.ts

Abre `capacitor.config.ts` y actualízalo:

```typescript
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.tunombre.recetasmexicanas', // ⚠️ CAMBIA ESTO
  appName: 'Recetas Mexicanas',
  webDir: 'www',
  server: {
    // Solo para desarrollo local, quítalo para producción
    // url: 'http://localhost:8100',
    // cleartext: true
  }
};

export default config;
```

> [!IMPORTANT]
> Cambia `com.tunombre.recetasmexicanas` por tu propio identificador único. Usa el formato: `com.tudominio.nombreapp`

### 2.2 Agregar Plataforma Android

```bash
cd c:\Users\h\Downloads\recetas-mexicanas\recetas-mexicanas
npx cap add android
```

---

## Paso 3: Configurar URL del Backend en Producción

### 3.1 Crear Archivos de Environment

Crea `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

Crea `src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://tu-app.up.railway.app/api' // ⚠️ CAMBIA ESTO
};
```

### 3.2 Actualizar tus Servicios

En todos tus servicios de Angular, cambia las URLs hardcodeadas por:

```typescript
import { environment } from '../../environments/environment';

export class RecetasService {
  private apiUrl = environment.apiUrl;
  
  // Resto de tu código...
}
```

### 3.3 Configurar angular.json

Abre `angular.json` y busca la sección `configurations.production`. Asegúrate de que tenga:

```json
"configurations": {
  "production": {
    "fileReplacements": [
      {
        "replace": "src/environments/environment.ts",
        "with": "src/environments/environment.prod.ts"
      }
    ],
    // ... resto de configuración
  }
}
```

---

## Paso 4: Generar Build de Producción

### 4.1 Compilar el Frontend

```bash
npm run build -- --configuration=production
```

Esto generará los archivos optimizados en la carpeta `www/`.

### 4.2 Sincronizar con Capacitor

```bash
npx cap sync android
```

---

## Paso 5: Generar APK (Sin Firmar - Para Pruebas)

### 5.1 Abrir Proyecto en Android Studio

```bash
npx cap open android
```

Esto abrirá Android Studio con tu proyecto.

### 5.2 Generar APK de Debug

1. En Android Studio, ve a **"Build"** → **"Build Bundle(s) / APK(s)"** → **"Build APK(s)"**
2. Espera a que termine el build
3. Haz clic en **"locate"** cuando aparezca la notificación
4. El APK estará en: `android/app/build/outputs/apk/debug/app-debug.apk`

### 5.3 Instalar en tu Teléfono

1. Conecta tu teléfono Android por USB
2. Habilita **"Depuración USB"** en tu teléfono:
   - Ve a **Ajustes** → **Acerca del teléfono**
   - Toca 7 veces en **"Número de compilación"**
   - Regresa y ve a **Opciones de desarrollador**
   - Activa **"Depuración USB"**
3. En Android Studio, haz clic en el botón ▶️ **"Run"**
4. Selecciona tu dispositivo

---

## Paso 6: Generar APK Firmado (Para Distribución)

### 6.1 Crear Keystore

```bash
cd android/app
keytool -genkey -v -keystore recetas-mexicanas.keystore -alias recetas-key -keyalg RSA -keysize 2048 -validity 10000
```

Responde las preguntas:
- **Contraseña del keystore:** (guárdala en un lugar seguro)
- **Nombre y apellido:** Tu nombre
- **Unidad organizativa:** Tu empresa/nombre
- **Organización:** Tu empresa/nombre
- **Ciudad, Estado, País:** Tu ubicación

### 6.2 Configurar Gradle

Crea el archivo `android/key.properties`:

```properties
storePassword=TU_CONTRASEÑA_KEYSTORE
keyPassword=TU_CONTRASEÑA_KEY
keyAlias=recetas-key
storeFile=recetas-mexicanas.keystore
```

> [!CAUTION]
> **NO** subas `key.properties` ni el `.keystore` a GitHub. Agrégalos a `.gitignore`

Edita `android/app/build.gradle` y agrega antes de `android {`:

```gradle
def keystoreProperties = new Properties()
def keystorePropertiesFile = rootProject.file('key.properties')
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}
```

Dentro de `android {`, agrega:

```gradle
signingConfigs {
    release {
        keyAlias keystoreProperties['keyAlias']
        keyPassword keystoreProperties['keyPassword']
        storeFile file(keystoreProperties['storeFile'])
        storePassword keystoreProperties['storePassword']
    }
}

buildTypes {
    release {
        signingConfig signingConfigs.release
        minifyEnabled false
        proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
    }
}
```

### 6.3 Generar APK Firmado

En Android Studio:

1. Ve a **"Build"** → **"Generate Signed Bundle / APK"**
2. Selecciona **"APK"** → **"Next"**
3. Selecciona tu keystore (`recetas-mexicanas.keystore`)
4. Ingresa las contraseñas
5. Selecciona **"release"** como build variant
6. Haz clic en **"Finish"**

El APK firmado estará en: `android/app/build/outputs/apk/release/app-release.apk`

---

## Paso 7: Distribuir tu APK

### 7.1 Compartir Directamente

Puedes enviar el archivo `app-release.apk` por:
- WhatsApp
- Email
- Google Drive
- Dropbox

### 7.2 Publicar en Google Play Store (Opcional)

Para publicar en Google Play Store, necesitarás:
1. Crear una cuenta de desarrollador ($25 USD único pago)
2. Generar un **App Bundle** (`.aab`) en lugar de APK
3. Seguir el proceso de publicación de Google Play

---

## 🎉 ¡Listo!

Ahora tienes un APK que cualquier persona puede instalar en su teléfono Android.

---

## Troubleshooting

### ❌ Error: "SDK location not found"

Crea el archivo `android/local.properties`:

```properties
sdk.dir=C\:\\Users\\TU-USUARIO\\AppData\\Local\\Android\\Sdk
```

### ❌ Error: "JAVA_HOME is not set"

Verifica que la variable de entorno `JAVA_HOME` esté configurada correctamente.

### ❌ La app no se conecta al backend

- Verifica que `environment.prod.ts` tenga la URL correcta de Railway
- Asegúrate de haber compilado con `--configuration=production`
- Verifica que tu backend en Railway esté funcionando

### ❌ Error: "Cleartext HTTP traffic not permitted"

Si tu backend usa HTTP (no HTTPS), agrega en `android/app/src/main/AndroidManifest.xml`:

```xml
<application
    android:usesCleartextTraffic="true"
    ...>
```

> [!WARNING]
> Railway proporciona HTTPS automáticamente, así que esto no debería ser necesario.

---

## Comandos Rápidos de Referencia

```bash
# Build de producción
npm run build -- --configuration=production

# Sincronizar con Capacitor
npx cap sync android

# Abrir en Android Studio
npx cap open android

# Ejecutar en dispositivo conectado
npx cap run android

# Limpiar y reconstruir
cd android
./gradlew clean
./gradlew build
```

---

## Próximos Pasos

- 🚀 Comparte tu APK con amigos y familia
- 📊 Considera agregar analytics (Firebase Analytics)
- 🔔 Agrega notificaciones push
- 🌐 Publica en Google Play Store
