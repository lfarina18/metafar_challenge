FROM node:18-alpine

WORKDIR /app

# Copia el archivo package.json y ejecuta npm install
COPY package.json .
RUN npm install

# Copia el resto de los archivos
COPY . .

# Expone el puerto 8080 (si es necesario)
EXPOSE 8080

# Comando por defecto para ejecutar tu aplicación
CMD [ "npm", "run", "dev" ]

