# Usar Node.js 20 LTS
FROM node:20-alpine

# Instalar dependencias del sistema necesarias para bcrypt
RUN apk add --no-cache python3 make g++

# Crear directorio de la aplicación
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias de producción
RUN npm ci --only=production

# Copiar el código fuente
COPY . .

# Compilar TypeScript
RUN npm install -D typescript @types/node && npm run build

# Crear directorio para uploads
RUN mkdir -p uploads/fotos

# Exponer el puerto
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "start"]
