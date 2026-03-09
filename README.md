# 👟 SneakPeak

Eine moderne Web-Plattform für Sneaker-Enthusiasten zum Bewerten, Entdecken und Teilen ihrer Lieblings-Sneakers.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=flat-square&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-4.1-38B2AC?style=flat-square&logo=tailwind-css)
![Convex](https://img.shields.io/badge/Convex-Backend-orange?style=flat-square)

## 📋 Übersicht

SneakPeak ist eine Community-getriebene Bewertungsplattform, auf der Nutzer Sneakers hochladen, detailliert bewerten und die Meinungen anderer einsehen können. Die Anwendung bietet ein intuitives Interface mit Echtzeit-Updates und umfassenden Bewertungskategorien.

### 🎯 Hauptfunktionen auf einen Blick
- ✅ Sneakers hochladen und verwalten
- ⭐ 4-Kategorien Bewertungssystem (Design, Komfort, Qualität, Preis-Leistung)
- 👥 Community-Durchschnittswerte und Feedback
- 📏 Sizing-Feedback für bessere Kaufentscheidungen
- 🔄 Echtzeit-Synchronisation über alle Geräte
- 🔐 Sichere Authentifizierung

## ✨ Features

- **Sneaker Management**
  - Sneakers hochladen mit Bild, Name, Marke und Beschreibung
  - Eigene Sneakers verwalten und bearbeiten
  - Community-Galerie mit allen Sneakers durchsuchen

- **Detaillierte Bewertungen**
  - Bewerte Sneakers in 4 Kategorien (je 1-5 Sterne):
    - 🎨 Design
    - 👟 Komfort
    - ⭐ Qualität
    - 💰 Preis-Leistung
  - Sizing-Feedback (-2 bis +2: zu klein bis zu groß)
  - Textkommentare für detailliertes Feedback
  
- **Community-Features**
  - Durchschnittswerte pro Kategorie anzeigen
  - Alle Community-Bewertungen einsehen
  - Eigene Bewertungen bearbeiten/aktualisieren
  - Anzahl der Bewertungen pro Sneaker

- **Technische Highlights**
  - 🔄 Echtzeit-Updates ohne Reload
  - 📱 Vollständig responsive (Mobile & Desktop)
  - 🔐 Sichere Authentifizierung mit WorkOS
  - ⚡ Optimistische UI-Updates
  - 🎨 Moderne, minimalistisches Design

## 🛠 Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Backend**: Convex (Backend-as-a-Service)
- **Authentifizierung**: WorkOS AuthKit
- **Icons**: Lucide React
- **Deployment**: Vercel-ready

## 📋 Voraussetzungen

- Node.js (Version 18 oder höher)
- npm oder yarn
- Ein [WorkOS Account](https://workos.com/) (kostenlos)
- Ein [Convex Account](https://convex.dev/) (kostenlos)

## 🚀 Setup-Anleitung

### 1. Repository klonen und Dependencies installieren

```bash
git clone <repository-url>
cd m245_sneakpeek
npm install
```

### 2. Umgebungsvariablen konfigurieren

Erstelle eine `.env.local` Datei im Root-Verzeichnis:

```bash
cp .env.local.example .env.local
```

### 3. WorkOS AuthKit einrichten

1. Erstelle einen [WorkOS Account](https://workos.com/)
2. Hole dir die Client ID und den API Key aus dem WorkOS Dashboard
3. Füge im WorkOS Dashboard `http://localhost:3000/callback` als Redirect URI hinzu
4. Generiere ein sicheres Passwort für Cookie-Verschlüsselung (min. 32 Zeichen)
5. Füge diese Werte in `.env.local` ein:

```env
WORKOS_CLIENT_ID=your_client_id
WORKOS_API_KEY=your_api_key
WORKOS_COOKIE_PASSWORD=your_secure_password_min_32_chars
WORKOS_REDIRECT_URI=http://localhost:3000/callback
```

### 4. Convex konfigurieren

Initialisiere Convex und verbinde es mit deinem Projekt:

```bash
npx convex dev
```

Dies wird:
- Deine Convex-Deployment erstellen
- Die Convex URL automatisch zu `.env.local` hinzufügen
- Das Convex Dashboard öffnen

Konfiguriere dann die WorkOS-Authentifizierung in Convex:

```bash
npx convex auth add workos
```

Dies erstellt `convex/auth.config.ts` mit der WorkOS-Integration.

### 5. Development Server starten

```bash
npm run dev
```

Dieser Befehl startet sowohl den Next.js Frontend-Server als auch das Convex Backend parallel.

### 6. Anwendung öffnen

Öffne [http://localhost:3000](http://localhost:3000) in deinem Browser.

## 📁 Projektstruktur

```
m245_sneakpeek/
├── app/                      # Next.js App Router
│   ├── add/                 # Sneaker hinzufügen Seite
│   ├── callback/            # Auth Callback
│   ├── server/              # Server-Seite (meine Sneakers)
│   ├── sign-in/             # Login Route
│   ├── sign-up/             # Registrierung Route
│   ├── sneakers/[id]/       # Sneaker Detail-Seite
│   ├── layout.tsx           # Root Layout mit Footer
│   ├── page.tsx             # Homepage
│   └── globals.css          # Globale Styles
├── components/              # Wiederverwendbare React Components
│   ├── CategoryRatings.tsx  # Kategorie-Durchschnitte Anzeige
│   ├── ConvexClientProvider.tsx
│   ├── Footer.tsx           # App Footer
│   ├── Header.tsx           # Navigation Header
│   ├── RatingCard.tsx       # Einzelne Bewertung
│   ├── RatingForm.tsx       # Bewertungsformular
│   ├── RatingSlider.tsx     # Stern-Bewertungs-Input
│   ├── SneakerGrid.tsx      # Sneaker-Grid Layout
│   ├── StarRating.tsx       # Stern-Anzeige Komponente
│   └── useUserSync.ts       # User Sync Hook
├── convex/                  # Convex Backend
│   ├── _generated/          # Auto-generierte Types
│   ├── actions.ts           # Server Actions
│   ├── auth.config.ts       # Auth Konfiguration
│   ├── ratings.ts           # Bewertungs-Queries/Mutations
│   ├── schema.ts            # Datenbank Schema
│   ├── sneakers.ts          # Sneaker-Queries/Mutations
│   └── users.ts             # User-Queries/Mutations
├── public/                  # Statische Assets
├── .env.local              # Umgebungsvariablen (nicht committen!)
├── convex.json             # Convex Konfiguration
├── next.config.ts          # Next.js Konfiguration
├── tailwind.config.ts      # Tailwind Konfiguration
└── tsconfig.json           # TypeScript Konfiguration
```

## 🏗️ Architektur & Code-Qualität

Das Projekt folgt modernen Best Practices:

### Komponenten-Architektur
- **Modulare Komponenten**: UI-Elemente sind in wiederverwendbare Komponenten aufgeteilt
- **Single Responsibility**: Jede Komponen in Convex:

### **users**
```typescript
{
  userId: string,        // WorkOS User ID
  email: string,         // E-Mail Adresse
  name?: string          // Optionaler Name
}
```

### **sneakers**
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

### **ratings**
```typescript
{
  sneakerId: Id,         // Referenz zu sneakers
  creatorId: Id,         // Referenz zu users
  comment: string,       // Bewertungstext
  ratingDesign: number,  // 1-5 Sterne
  ratingComfort: number, // 1-5 Sterne
  ratingQuality: number, // 1-5 Sterne
  ratingValue: number,   // 1-5 Sterne (Preis-Leistung)
  sizing: number,        // -2 bis +2 (Größenausfall)
  createdAt: number      // Timestamp
}
```

### Indizes
- `users`: by_userId
- `sneakers`: by_creator
- `ratings`: by_sneaker, by_creator
- `RatingSlider`: Interaktive Stern-Bewertung mit Hover-Effekten
- `StarRating`: Flexible Stern-Anzeige (konfigurierbare Größe)
- `CategoryRatings`: Zeigt alle 4 Bewertungs-Kategorien
- `RatingCard`: Formatierte Anzeige einer einzelnen Bewertung
- `RatingForm`: Vollständiges Formular mit Validierung

### Backend (Convex)
- **Type-Safe Queries**: Automatisch generierte TypeScript Types
- **Echtzeit-Sync**: Reaktive Daten ohne manuelle Polling
- **Optimistic Updates**: Sofortiges UI-Feedback
- **Schema Validation**: Validierung auf Datenbankebene

## 🎯 Verfügbare Scripts

```bash
npm run dev          # Startet Frontend und Backend im Dev-Mode
npm run build        # Erstellt Production Build
npm run start        # Startet Production Server
npm run lint         # Führt ESLint und Prettier Check aus
npm run format       # Formatiert Code mit Prettier
```

## 📝 Datenbank Schema

Die Anwendung verwendet drei Haupttabellen:

- **users**: Benutzerinformationen
- **sneakers**: Sneaker-Daten mit Bildern
- **ratings**: Bewertungen mit 4 Kategorien + Sizing

## 👥 Entwickler

- [Leandro Aebi](https://github.com/leandroaebi)
- [Lorenz Boss](https://github.com/lorenzboss)

## � Deployment

Die Anwendung ist bereit für Deployment auf Vercel:

1. Pushe dein Repository zu GitHub
2. Importiere das Projekt in [Vercel](https://vercel.com)
3. Füge die Umgebungsvariablen in Vercel hinzu
4. Deploy! 🎉

Convex wird automatisch mit deinem Production-Environment verbunden.

## 🐛 Troubleshooting

### Authentifizierung funktioniert nicht
- Überprüfe, ob die WorkOS Redirect URI korrekt konfiguriert ist
- Stelle sicher, dass `WORKOS_COOKIE_PASSWORD` mindestens 32 Zeichen hat

### Bilder werden nicht angezeigt
- Prüfe die Convex Storage Konfiguration
- Stelle sicher, dass `generateUploadUrl` korrekt funktioniert

### Convex Verbindungsfehler
- Führe `npx convex dev` aus, um die Verbindung wiederherzustellen
- Überprüfe, ob die `CONVEX_URL` in `.env.local` korrekt ist

## 📚 Weitere Ressourcen

- [Next.js Dokumentation](https://nextjs.org/docs)
- [Convex Dokumentation](https://docs.convex.dev)
- [WorkOS AuthKit Docs](https://workos.com/docs/authkit)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

## �📄 Lizenz

MIT

---

Entwickelt mit ❤️ für die Sneaker-Community
