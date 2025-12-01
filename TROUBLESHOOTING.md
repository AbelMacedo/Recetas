# 🔧 Solución de Problemas - Railway y APK

## Problema Actual

✅ **Backend desplegado:** `https://recetas-production-a79e.up.railway.app`
✅ **APK generado** y funcionando
❌ **Base de datos vacía:** `/api/recetas` devuelve `{"success":true,"data":[]}`
❌ **Error al registrar receta** desde el teléfono

---

## Solución 1: Ejecutar el Seed en Railway

La base de datos está vacía porque no se ha ejecutado el seed. Sigue estos pasos:

### Opción A: Usando Railway CLI (Recomendado)

```bash
# 1. Instalar Railway CLI (si no lo tienes)
npm install -g @railway/cli

# 2. Iniciar sesión
railway login

# 3. Ir a la carpeta del backend
cd c:\Users\h\Downloads\recetas-mexicanas\recetas-mexicanas\backend

# 4. Vincular al proyecto (selecciona tu proyecto cuando te pregunte)
railway link

# 5. Ejecutar el seed
railway run npm run seed
```

Deberías ver algo como:
```
🌱 Iniciando seed de recetas tradicionales...
✅ Receta "Carne Asada Norteña" creada
✅ Receta "Machaca con Huevo" creada
...
🎉 Seed completado exitosamente!
```

### Opción B: Ejecutar seed manualmente

Si Railway CLI no funciona, puedes ejecutar el seed directamente en Railway:

1. Ve a tu proyecto en Railway
2. Haz clic en tu servicio **Backend**
3. Ve a la pestaña **"Settings"**
4. Busca **"Custom Start Command"** o **"Deploy"**
5. Temporalmente cambia el comando de inicio a:
   ```
   npm run seed && npm start
   ```
6. Espera a que se redespliegue
7. Revisa los logs para ver si el seed se ejecutó
8. **IMPORTANTE:** Vuelve a cambiar el comando a solo `npm start`

---

## Solución 2: Verificar Error al Registrar Receta

El error al registrar desde el teléfono puede ser por varias razones:

### A. Verificar que el endpoint POST funciona

Prueba desde tu navegador o Postman:

```bash
# URL
POST https://recetas-production-a79e.up.railway.app/api/recetas

# Headers
Content-Type: application/json

# Body (ejemplo)
{
  "nombre": "Tacos de Prueba",
  "descripcion": "Receta de prueba",
  "region": "NORTE",
  "categoria": "ANTOJITOS",
  "tiempoPreparacion": 30,
  "porciones": 4,
  "ingredientes": ["Tortillas", "Carne", "Cebolla"],
  "pasos": ["Paso 1", "Paso 2"]
}
```

### B. Revisar los Logs en Railway

1. Ve a tu proyecto en Railway
2. Haz clic en tu servicio **Backend**
3. Ve a la pestaña **"Logs"**
4. Busca errores cuando intentas registrar una receta desde el teléfono

Los errores comunes son:
- **CORS:** Si ves errores de CORS, necesitas configurar CORS en el backend
- **Validación:** Si los datos no cumplen con el formato esperado
- **Base de datos:** Si hay problemas de conexión

### C. Verificar CORS en el Backend

Tu backend ya tiene CORS habilitado (`app.use(cors())`), pero asegúrate de que esté permitiendo todas las origins. Si ves errores de CORS en los logs, actualiza el archivo `server.ts`:

```typescript
// En lugar de:
app.use(cors());

// Usa:
app.use(cors({
  origin: '*', // Permite todas las origins (solo para desarrollo/pruebas)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

---

## Solución 3: Verificar la Configuración del Frontend

### A. Verificar que la URL esté correcta

Abre `src/environments/environment.prod.ts` y verifica:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://recetas-production-a79e.up.railway.app/api'
};
```

✅ Ya está correcto según tus cambios.

### B. Reconstruir el APK

Después de hacer cualquier cambio en el frontend, debes reconstruir el APK:

```bash
# 1. Limpiar build anterior
cd c:\Users\h\Downloads\recetas-mexicanas\recetas-mexicanas
rm -rf www

# 2. Build de producción
npm run build -- --configuration=production

# 3. Sincronizar con Capacitor
npx cap sync android

# 4. Abrir en Android Studio
npx cap open android

# 5. Generar nuevo APK
# En Android Studio: Build → Build Bundle(s) / APK(s) → Build APK(s)
```

---

## Solución 4: Probar la Conexión desde el Teléfono

### A. Verificar conectividad

Desde el navegador de tu teléfono, abre:
```
https://recetas-production-a79e.up.railway.app/api/health
```

Deberías ver:
```json
{
  "success": true,
  "message": "API funcionando correctamente",
  "timestamp": "..."
}
```

Si no funciona:
- ❌ Tu teléfono no tiene internet
- ❌ Railway está caído (poco probable)
- ❌ La URL está mal escrita

### B. Verificar que la app use la URL correcta

Agrega logs en tu servicio de Angular para verificar qué URL está usando:

```typescript
// En tu servicio de recetas
crearReceta(receta: any) {
  console.log('URL del API:', this.apiUrl); // Debería mostrar la URL de Railway
  console.log('Datos a enviar:', receta);
  return this.http.post(`${this.apiUrl}/recetas`, receta);
}
```

Luego, en Chrome DevTools (conectando tu teléfono por USB):
1. Conecta tu teléfono por USB
2. Abre Chrome en tu PC
3. Ve a `chrome://inspect`
4. Selecciona tu app
5. Revisa la consola para ver los logs

---

## Checklist de Verificación

- [ ] Seed ejecutado en Railway
- [ ] Endpoint `/api/recetas` devuelve datos (no array vacío)
- [ ] Endpoint `/api/health` funciona desde el teléfono
- [ ] CORS configurado correctamente
- [ ] URL del backend correcta en `environment.prod.ts`
- [ ] APK reconstruido con la configuración de producción
- [ ] Logs de Railway revisados para ver errores específicos

---

## Próximos Pasos

1. **Primero:** Ejecuta el seed en Railway (Solución 1)
2. **Segundo:** Verifica que `/api/recetas` devuelva datos
3. **Tercero:** Prueba registrar una receta desde Postman/navegador
4. **Cuarto:** Revisa los logs de Railway cuando intentes desde el teléfono
5. **Quinto:** Comparte el error específico que ves en los logs

---

## Comandos Rápidos

```bash
# Ejecutar seed en Railway
cd c:\Users\h\Downloads\recetas-mexicanas\recetas-mexicanas\backend
railway login
railway link
railway run npm run seed

# Reconstruir APK
cd c:\Users\h\Downloads\recetas-mexicanas\recetas-mexicanas
npm run build -- --configuration=production
npx cap sync android
npx cap open android
```
