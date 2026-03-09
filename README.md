# 👟 SneakPeek

Eine moderne Web-Plattform für Sneaker-Enthusiasten zum Bewerten, Entdecken und Teilen ihrer Lieblings-Sneakers.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=flat-square&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-4.1-38B2AC?style=flat-square&logo=tailwind-css)
![Convex](https://img.shields.io/badge/Convex-Backend-orange?style=flat-square)

## 📋 Übersicht

SneakPeek ist eine Community-getriebene Bewertungsplattform, auf der Nutzer Sneakers hochladen, detailliert bewerten und die Meinungen anderer einsehen können. Die Anwendung bietet ein intuitives Interface mit Echtzeit-Updates und umfassenden Bewertungskategorien.

### ✨ Hauptfunktionen

- ✅ Sneakers hochladen und verwalten
- ⭐ 4-Kategorien Bewertungssystem (Design, Komfort, Qualität, Preis-Leistung)
- 👥 Community-Durchschnittswerte und Feedback
- 📏 Sizing-Feedback für bessere Kaufentscheidungen
- 🔄 Echtzeit-Synchronisation über alle Geräte
- 🔐 Sichere Authentifizierung
- 📱 Vollständig responsive (Mobile & Desktop)

## 🛠 Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Backend**: Convex (Backend-as-a-Service)
- **Authentifizierung**: WorkOS AuthKit
- **Icons**: Lucide React
- **Deployment**: Vercel

## 📋 Voraussetzungen

Bevor du beginnst, stelle sicher, dass du folgendes installiert hast:

- **Node.js** 18 oder höher ([Download](https://nodejs.org/))
- **npm** oder **yarn**
- Ein **[WorkOS Account](https://workos.com/)** (kostenloser Tarif verfügbar)
- Ein **[Convex Account](https://convex.dev/)** (kostenloser Tarif verfügbar)

---

## 🚀 Lokale Installation

Folge diesen Schritten, um SneakPeek auf deinem lokalen Rechner zum Laufen zu bringen.

### 1. Repository klonen

```bash
git clone <repository-url>
cd m245_sneakpeek
```

### 2. Dependencies installieren

```bash
npm install
```

### 3. Umgebungsvariablen konfigurieren

Erstelle eine `.env.local` Datei im Root-Verzeichnis:

```bash
cp .env.local.example .env.local
```

Öffne `.env.local` und konfiguriere die folgenden Variablen:

```env
# WorkOS AuthKit Konfiguration
WORKOS_CLIENT_ID=client_your_client_id_here
WORKOS_API_KEY=sk_test_your_api_key_here
WORKOS_COOKIE_PASSWORD=your_secure_password_here_must_be_at_least_32_characters_long
NEXT_PUBLIC_WORKOS_REDIRECT_URI=http://localhost:3000/callback
```

### 4. WorkOS Authentifizierung einrichten

1. Gehe zum [WorkOS Dashboard](https://dashboard.workos.com/)
2. Erstelle ein neues Projekt oder wähle ein existierendes aus
3. Navigiere zu **API Keys** und kopiere:
   - **Client ID** → `WORKOS_CLIENT_ID`
   - **API Key** → `WORKOS_API_KEY`
4. Generiere ein sicheres Passwort (min. 32 Zeichen) für `WORKOS_COOKIE_PASSWORD`
   ```bash
   # Sicheres Passwort auf macOS/Linux generieren:
   openssl rand -base64 32
   ```
5. Füge die Redirect URI im WorkOS Dashboard hinzu:
   - Gehe zu **Redirect URIs**
   - Füge hinzu: `http://localhost:3000/callback`

### 5. Convex Backend einrichten

Initialisiere Convex und verbinde es mit deinem Projekt:

```bash
npx convex dev
```

Dies wird:
- Dein Convex Deployment erstellen
- Automatisch `CONVEX_URL` zu `.env.local` hinzufügen
- Das Convex Dashboard im Browser öffnen

Konfiguriere die WorkOS Authentifizierung in Convex:

```bash
npx convex auth add workos
```

Dies erstellt `convex/auth.config.ts` mit der WorkOS-Integration.

### 6. Development Server starten

Starte sowohl das Next.js Frontend als auch das Convex Backend:

```bash
npm run dev
```

Dies startet:
- Next.js auf `http://localhost:3000`
- Convex Backend im Watch-Modus

### 7. Anwendung öffnen

Öffne [http://localhost:3000](http://localhost:3000) in deinem Browser.

Alles fertig! 🎉

---

## 🌐 Deployment

Deploye SneakPeek in die Produktion in wenigen einfachen Schritten.

### Deployment auf Vercel

#### 1. Zu GitHub pushen

Stelle sicher, dass dein Code in einem GitHub Repository ist:

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

#### 2. Frontend auf Vercel deployen

1. Gehe zum [Vercel Dashboard](https://vercel.com/dashboard)
2. Klicke auf **"Add New Project"**
3. Importiere dein GitHub Repository
4. Konfiguriere das Projekt:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (Standard)
5. Füge Umgebungsvariablen hinzu:
   ```
   WORKOS_CLIENT_ID=client_your_production_client_id
   WORKOS_API_KEY=sk_your_production_api_key
   WORKOS_COOKIE_PASSWORD=your_production_secure_password_32_chars
   NEXT_PUBLIC_WORKOS_REDIRECT_URI=https://your-app.vercel.app/callback
   ```
6. Klicke auf **"Deploy"**

#### 3. Backend auf Convex deployen

Deploye dein Convex Backend in die Produktion:

```bash
npx convex deploy
```

Dies wird:
- Deine Convex Functions in die Produktion deployen
- Eine Produktions-`CONVEX_URL` generieren
- Die Produktions-URL ausgeben

#### 4. Vercel Umgebungsvariablen aktualisieren

1. Kopiere die Produktions-`CONVEX_URL` aus dem Convex Deployment
2. Gehe zu deinem Vercel Projekt → **Settings** → **Environment Variables**
3. Füge hinzu oder aktualisiere:
   ```
   CONVEX_URL=https://your-production.convex.cloud
   ```
4. Deploye dein Vercel Projekt neu, um die Änderungen zu übernehmen

#### 5. WorkOS Redirect URIs aktualisieren

1. Gehe zum [WorkOS Dashboard](https://dashboard.workos.com/)
2. Navigiere zu **Redirect URIs**
3. Füge deine Produktions-Redirect URI hinzu:
   ```
   https://your-app.vercel.app/callback
   ```

### Verifikation

Besuche deine deployed Anwendung unter `https://your-app.vercel.app` und überprüfe:
- ✅ Sign-in/Sign-up funktioniert korrekt
- ✅ Sneakers können hochgeladen werden
- ✅ Bewertungen können abgegeben werden
- ✅ Bilder werden korrekt angezeigt
- ✅ Echtzeit-Updates funktionieren

---

## 📁 Projektstruktur

```
m245_sneakpeek/
├── app/                      # Next.js App Router
│   ├── add/                 # Sneaker hinzufügen Seite
│   ├── callback/            # Auth Callback Route
│   ├── server/              # Meine Sneakers Seite
│   ├── sign-in/             # Sign-in Route
│   ├── sign-up/             # Sign-up Route
│   ├── sneakers/[id]/       # Sneaker Detail & Edit Seiten
│   ├── layout.tsx           # Root Layout
│   ├── page.tsx             # Homepage
│   └── globals.css          # Globale Styles
├── components/              # Wiederverwendbare React Komponenten
│   ├── CategoryRatings.tsx  # Kategorie-Durchschnitte Anzeige
│   ├── ConvexClientProvider.tsx
│   ├── Footer.tsx           # App Footer
│   ├── Header.tsx           # Navigation Header
│   ├── RatingCard.tsx       # Einzelne Bewertung Anzeige
│   ├── RatingForm.tsx       # Bewertungsformular
│   ├── RatingSlider.tsx     # Stern-Bewertungs-Input
│   ├── SneakerGrid.tsx      # Sneaker Grid Layout
│   ├── StarRating.tsx       # Stern-Anzeige Komponente
│   └── useUserSync.ts       # User Sync Hook
├── convex/                  # Convex Backend
│   ├── _generated/          # Auto-generierte Types
│   ├── actions.ts           # Server Actions
│   ├── auth.config.ts       # Auth Konfiguration
│   ├── ratings.ts           # Rating Queries/Mutations
│   ├── schema.ts            # Datenbank Schema
│   ├── sneakers.ts          # Sneaker Queries/Mutations
│   └── users.ts             # User Queries/Mutations
├── public/                  # Statische Assets
├── .env.local              # Umgebungsvariablen (NICHT COMMITTEN!)
├── .env.local.example      # Beispiel Umgebungsvariablen
├── convex.json             # Convex Konfiguration
├── next.config.ts          # Next.js Konfiguration
├── tailwind.config.ts      # Tailwind Konfiguration
└── tsconfig.json           # TypeScript Konfiguration
```

---

## 🗄️ Datenbank Schema

### Tabellen

#### **users**
```typescript
{
  userId: string,        // WorkOS User ID
  email: string,         // E-Mail Adresse
  name?: string          // Optionaler Name
}
```

#### **sneakers**
```typescript
{
  name: string,          // Sneaker Name
  brand: string,         // Marke (z.B. Nike, Adidas)
  description: string,   // Beschreibung
  imageUrl: string,      // Bild URL
  imageStorageId: Id,    // Convex Storage ID
  creatorId: Id,         // Referenz zu users
  createdAt: number      // Timestamp
}
```

#### **ratings**
```typescript
{
  sneakerId: Id,         // Referenz zu sneakers
  creatorId: Id,         // Referenz zu users
  comment: string,       // Bewertungskommentar
  ratingDesign: number,  // 1-5 Sterne (Design)
  ratingComfort: number, // 1-5 Sterne (Komfort)
  ratingQuality: number, // 1-5 Sterne (Qualität)
  ratingValue: number,   // 1-5 Sterne (Preis-Leistung)
  sizing: number,        // -2 bis +2 (zu klein bis zu groß)
  createdAt: number      // Timestamp
}
```

### Indizes

- `users`: `by_userId`
- `sneakers`: `by_creator`
- `ratings`: `by_sneaker`, `by_creator`

---

## 🎯 Verfügbare Scripts

```bash
npm run dev          # Frontend und Backend im Dev-Modus starten
npm run dev:frontend # Nur Next.js Frontend starten
npm run dev:backend  # Nur Convex Backend starten
npm run build        # Production Build erstellen
npm run start        # Production Server starten
npm run lint         # ESLint und Prettier Check ausführen
npm run format       # Code mit Prettier formatieren
```

---

## 🐛 Troubleshooting

### Authentifizierung funktioniert nicht

- Überprüfe, ob die WorkOS Redirect URI korrekt konfiguriert ist
- Stelle sicher, dass `WORKOS_COOKIE_PASSWORD` mindestens 32 Zeichen hat
- Prüfe, ob alle WorkOS Umgebungsvariablen korrekt gesetzt sind

### Bilder werden nicht angezeigt

- Prüfe die Convex Storage Konfiguration
- Stelle sicher, dass `generateUploadUrl` korrekt funktioniert
- Überprüfe, ob die Bilddateitypen unterstützt werden (PNG, JPG, WEBP, AVIF)

### Convex Verbindungsfehler

- Führe `npx convex dev` aus, um die Verbindung wiederherzustellen
- Überprüfe, ob `CONVEX_URL` in `.env.local` korrekt ist
- Prüfe das Convex Dashboard auf den Deployment-Status

### Build-Fehler

- Next.js Cache löschen: `rm -rf .next`
- Dependencies neu installieren: `rm -rf node_modules && npm install`
- Stelle sicher, dass alle Umgebungsvariablen gesetzt sind

---

## 👥 Entwickler

- [Leandro Aebi](https://github.com/leandroaebi)
- [Lorenz Boss](https://github.com/lorenzboss)

---

## 📚 Weitere Ressourcen

- [Next.js Dokumentation](https://nextjs.org/docs)
- [Convex Dokumentation](https://docs.convex.dev)
- [WorkOS AuthKit Docs](https://workos.com/docs/authkit)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Lucide Icons](https://lucide.dev/)

---

## 📄 Lizenz

MIT

---

Entwickelt mit ❤️ für die Sneaker-Community
