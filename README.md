# 🐦‍⬛ Corvo

> Piattaforma distribuita per il monitoraggio continuo della sicurezza di server Linux aziendali, sviluppata come progetto di tesi magistrale in collaborazione con **Sinelec S.p.A.**

---

## 📋 Descrizione

Corvo permette agli operatori di monitorare in tempo reale lo stato di sicurezza degli host Linux di una rete aziendale, gestire policy di auditing tramite **Lynis** e amministrare gli accessi degli utenti, il tutto da un'unica interfaccia web centralizzata.

Il sistema è progettato per operare in **ambienti air-gapped** (reti aziendali isolate da internet), senza dipendenze da servizi cloud o repository remoti a runtime.

---

## 🏗️ Architettura

Il sistema è composto da tre componenti, ciascuno in un sottomodulo Git indipendente:

```
Corvo/
├── corvo_front/     # Frontend Angular (SPA)  
├── corvo_back/      # Backend Java Spring Boot
└── corvo_agent/     # Agent Python (daemon sugli host monitorati)
```

### Flusso di comunicazione

```
[Operatore]
     │  browser
     ▼
[corvo_front]  ──── HTTP REST ────►  [corvo_back]  ◄──── HTTP REST ────  [corvo_agent]
 Angular + Nginx                     Spring Boot                           Python daemon
   porta 4200                        porta 8083                           porta 5000 (default)
                                          │
                                          ▼
                                     [PostgreSQL]
                                       porta 5432
```

### Componenti

| Componente | Tecnologia | Ruolo |
|---|---|---|
| [`corvo_front`](./corvo_front) | Angular 19 + Angular Material + Nginx | Interfaccia web per gli operatori |
| [`corvo_back`](./corvo_back) | Java 24 + Spring Boot + PostgreSQL | Orchestratore centrale, API REST, persistenza |
| [`corvo_agent`](./corvo_agent) | Python 3 (solo Standard Library) | Daemon installato sugli host monitorati |

### Funzionamento in sintesi

1. Ogni **agent** si registra autonomamente al backend all'avvio, inviando IP, porta, nome e descrizione dell'host
2. Il **backend** accetta la registrazione, esegue un ping di verifica e avvia un monitoraggio periodico ogni 5 minuti (stato servizi, regole di auditing, configurazione Lynis)
3. Il **frontend** interroga il backend per visualizzare lo stato degli agent e inviare comandi (avvio scansioni, modifica regole, gestione utenti)
4. In caso di disconnessione, il backend ritenta fino a 10 volte; al decimo fallimento l'agent viene marcato `INACTIVE`

---

## 📦 Struttura del repository

Questo repository è il punto di ingresso del progetto e contiene i file di orchestrazione Docker. I tre componenti applicativi sono inclusi come **Git submodule**.

```
Corvo/
├── corvo_front/          # Submodule — Frontend Angular
├── corvo_back/           # Submodule — Backend Spring Boot
├── corvo_agent/          # Submodule — Agent Python
├── docker-compose.yml    # Orchestrazione dei container (front + back + db + pgAdmin)
└── .env.example          # Template variabili d'ambiente
```

---

## 🐳 Architettura Docker

Il sistema (frontend + backend + database) è containerizzato tramite **Docker Compose** (v3.9) e orchestrato su una rete privata interna `app_network`.

| Servizio | Immagine base | Porta esposta | Note |
|---|---|---|---|
| `postgres` | `postgres:15-alpine` | 5432 | Dati persistiti su volume Docker |
| `pgadmin` | `dpage/pgadmin4` | 8081 | Interfaccia web di amministrazione DB |
| `corvo-server` | `openjdk:24-jdk-slim` | 8083 | Eseguito con utente non-root |
| `corvo-front` | `node:18-alpine` → `nginx:alpine` | 4200 | Multi-stage build |

> **Nota:** L'agent Python (`corvo_agent`) non è containerizzato — viene eseguito direttamente come processo daemon sugli host Linux da monitorare. Consulta il README di [`corvo_agent`](./corvo_agent) per le istruzioni di avvio.

### Rete e resilienza

- Tutti i container comunicano tramite la rete interna `app_network` (driver `bridge`) usando nomi logici DNS, senza esporre porte interne non necessarie
- Politica di riavvio automatico `on-failure` per tutti i servizi applicativi
- `healthcheck` configurati per `postgres` e `corvo-server` per coordinare l'ordine di avvio

---

## 🚀 Avvio del sistema

### Prerequisiti

- Docker e Docker Compose installati
- Git con supporto ai submodule

### 1. Clona il repository con i submodule

```bash
git clone --recurse-submodules https://github.com/<tuo-utente>/Corvo.git
cd Corvo
```

Se hai già clonato il repository senza submodule:

```bash
git submodule update --init --recursive
```

### 2. Configura le variabili d'ambiente

```bash
cp .env.example .env
# Modifica .env con i parametri del tuo ambiente
```

Le variabili principali da configurare:

```env
# Database
POSTGRES_DB=corvo
POSTGRES_USER=corvo_user
POSTGRES_PASSWORD=<password>

# pgAdmin
PGADMIN_DEFAULT_EMAIL=admin@admin.com
PGADMIN_DEFAULT_PASSWORD=<password>

# Backend
SERVER_PORT=8083
```

### 3. Avvia i container

```bash
docker compose up -d
```

I servizi saranno disponibili su:
- **Frontend:** `http://localhost:4200`
- **Backend API:** `http://localhost:8083`
- **pgAdmin:** `http://localhost:8081`

### 4. Avvia gli agent sugli host da monitorare

Per ogni host Linux da monitorare, segui le istruzioni nel README di [`corvo_agent`](./corvo_agent). In sintesi:

```bash
# Sull'host da monitorare
cd corvo_agent
# Configura data/config.json con l'IP del backend
python3 main.py
```

### 5. Primo accesso

Al primo avvio è disponibile un utente amministratore predefinito:

| Campo | Valore |
|---|---|
| Email | `admin@gmail.com` |
| Password | `Admin@123_!` |

> ⚠️ Cambiare la password al primo accesso prima di mettere il sistema in produzione.

---

## 🔒 Note di sicurezza

- La comunicazione avviene in **HTTP non cifrato**: il sistema è progettato esclusivamente per **reti aziendali isolate (intranet)** e **non deve essere esposto su reti pubbliche**
- Le password degli utenti sono hashate con **Argon2id** (memory-hard, salt univoco per utente) — le credenziali nel database non sono mai recuperabili in chiaro
- Il backend espone solo le porte strettamente necessarie; la comunicazione interna tra i container avviene sulla rete privata Docker
- L'agent Python utilizza esclusivamente la Standard Library: nessuna dipendenza esterna da installare sugli host monitorati, minima superficie di attacco

---

## 📄 Contesto del progetto

**Corvo** è stato sviluppato come progetto di tesi magistrale presso **Sinelec S.p.A.**, trattato durante lo stage come un progetto aziendale a tutti gli effetti.

---

## 📜 Licenza

Tutti i diritti riservati. Progetto sviluppato nell'ambito di un tirocinio magistrale presso Sinelec S.p.A.
