FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# --- DODANE DLA NEXT.JS ---
# 1. Odbieramy zmienną przekazaną z komendy docker build
ARG NEXT_PUBLIC_API_URL
# 2. Ustawiamy ją jako zmienną środowiskową na czas budowania
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
# --------------------------

# Teraz Next.js bezbłędnie zaczyta wartość '/api'
RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "start", "--", "-H", "0.0.0.0", "-p", "3000"]