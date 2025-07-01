# Stage 1: Build dell'applicazione
FROM node:18-alpine AS build

# Imposta la directory di lavoro
WORKDIR /app

# Copia i file package.json e package-lock.json
COPY package*.json ./

# Installa le dipendenze (incluse quelle di dev per il build)
RUN npm ci

# Copia tutto il codice sorgente
COPY . .

# Builda l'applicazione per la produzione
RUN npm run build --production

# Stage 2: Serve l'applicazione con Nginx
FROM nginx:alpine

# Copia i file buildati dal primo stage (cartella browser per il client)
COPY --from=build /app/dist/corvo/browser/ /usr/share/nginx/html/

# Rinomina index.csr.html in index.html per nginx
RUN mv /usr/share/nginx/html/index.csr.html /usr/share/nginx/html/index.html

# Copia la configurazione personalizzata di nginx (opzionale)
# COPY nginx.conf /etc/nginx/nginx.conf

# Esponi la porta 80
EXPOSE 80

# Avvia nginx
CMD ["nginx", "-g", "daemon off;"]
