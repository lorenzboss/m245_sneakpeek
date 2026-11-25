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
- **Authentifizierung**: Convex Auth v2 (E-Mail + Passwort)
- **Icons**: Lucide React
- **Deployment**: Vercel

## 📋 Voraussetzungen

Bevor du beginnst, stelle sicher, dass du folgendes installiert hast:

- **Node.js** 18 oder höher ([Download](https://nodejs.org/))
- **npm** oder **yarn**
- Ein **[Resend Account](https://resend.com/)** mit verifizierter Absenderdomain
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

### 3. Convex-Deployment auswählen

Wähle ein Convex-Dev-Deployment aus oder erstelle eines:

```bash
npx convex dev
```

Die CLI schreibt die Deployment-URL nach `.env.local`. Wenn der Prozess startet, stoppe ihn nach der Auswahl mit `Ctrl+C`. Beim ersten Lauf kann Convex wegen der noch fehlenden Resend-Variablen abbrechen; setze sie im nächsten Schritt.

### 4. E-Mail-Versand konfigurieren

Convex Auth versendet E-Mail-Verifikation und Passwort-Reset-Links über Resend. Richte eine Resend-Domain ein und setze die Werte für das aktive Convex-Deployment:

```bash
npx convex env set RESEND_API_KEY
npx convex env set SENDER_EMAIL no-reply@your-verified-domain.example
npx convex env set SENDER_NAME "SneakPeek"
npx convex env set SITE_URL http://localhost:3000
```

`RESEND_API_KEY` wird interaktiv abgefragt. `SENDER_EMAIL` muss zu einer in Resend verifizierten Domain gehören.

### 5. Development Server starten

Starte sowohl das Next.js Frontend als auch das Convex Backend:

```bash
npm run dev
```

Dies startet:

- Next.js auf `http://localhost:3000`
- Convex Backend im Watch-Modus

### 6. Anwendung öffnen

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
   - Verbinde Vercel mit dem Convex-Projekt, damit `NEXT_PUBLIC_CONVEX_URL` gesetzt ist.
5. Klicke auf **"Deploy"**

#### 3. Convex-Produktionsumgebung konfigurieren

Setze die Resend-Variablen und die öffentliche URL auf dem Convex-Produktionsdeployment:

```bash
npx convex env set RESEND_API_KEY
npx convex env set SENDER_EMAIL no-reply@your-verified-domain.example
npx convex env set SENDER_NAME "SneakPeek"
npx convex env set SITE_URL https://your-app.vercel.app
```

Deploye anschließend das Backend:

```bash
npx convex deploy
```

Wähle für `npx convex env set` und `npx convex deploy` jeweils das passende Convex-Produktionsdeployment. In Vercel muss `NEXT_PUBLIC_CONVEX_URL` auf dessen URL zeigen.

#### Daten und Nutzerkonten

Convex Auth v2 kann WorkOS-Konten und deren Passwörter/Sessions nicht übernehmen. Nutzer müssen sich neu registrieren. Die bestehenden Convex-Dokumente für Sneaker, Reviews und frühere Nutzer bleiben erhalten; neue Konten erhalten neue Nutzer-IDs, daher werden frühere Inhalte nicht automatisch dem neuen Konto zugeordnet.

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
│   ├── server/              # Meine Sneakers Seite
│   ├── sign-in/             # Sign-in-Seite
│   ├── sign-up/             # Registrierungsseite
│   ├── auth/                # Convex-Auth-Session-Routen
│   ├── validate-email/      # E-Mail-Verifikation
│   ├── reset-password/      # Passwort-Wiederherstellung
│   ├── sneakers/[id]/       # Sneaker Detail & Edit Seiten
│   ├── layout.tsx           # Root Layout
│   ├── page.tsx             # Homepage
│   └── globals.css          # Globale Styles
├── components/              # Wiederverwendbare React Komponenten
│   ├── CategoryRatings.tsx  # Kategorie-Durchschnitte Anzeige
│   ├── AuthPanel.tsx
│   ├── Footer.tsx           # App Footer
│   ├── Header.tsx           # Navigation Header
│   ├── PasswordRecoveryFlow.tsx
│   ├── RatingCard.tsx       # Einzelne Bewertung Anzeige
│   ├── RatingForm.tsx       # Bewertungsformular
│   ├── RatingSlider.tsx     # Stern-Bewertungs-Input
│   ├── SneakerGrid.tsx      # Sneaker Grid Layout
│   ├── StarRating.tsx       # Stern-Anzeige Komponente
│   ├── SignInForm.tsx       # E-Mail-/Passwort-Login
│   ├── SignUpForm.tsx       # Registrierung
│   ├── UserProfileSync.tsx  # Convex-Profil synchronisieren
│   └── ValidateEmailFlow.tsx
├── convex/                  # Convex Backend
│   ├── _generated/          # Auto-generierte Types
│   ├── auth.ts              # Convex Auth v2
│   ├── auth.config.ts       # Auth Konfiguration
│   ├── convex.config.ts     # Auth- und Resend-Komponenten
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
  userId?: string,       // Legacy WorkOS-ID, bleibt für alte Dokumente erhalten
  email?: string,        // E-Mail Adresse
  name?: string          // Optionaler Anzeigename
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

- `users`: `by_userId` (Legacy-Index)
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

- Prüfe im Convex-Dashboard, ob `RESEND_API_KEY` und `SENDER_EMAIL` für das aktive Deployment gesetzt sind.
- Stelle sicher, dass die Absenderdomain in Resend verifiziert ist und `SITE_URL` auf die richtige Next.js-URL zeigt.
- Nach der WorkOS-Ablösung müssen sich bestehende Nutzer neu registrieren.

### Bilder werden nicht angezeigt

- Prüfe die Convex Storage Konfiguration
- Stelle sicher, dass `generateUploadUrl` korrekt funktioniert
- Überprüfe, ob die Bilddateitypen unterstützt werden (PNG, JPG, WEBP, AVIF)

### Convex Verbindungsfehler

- Führe `npx convex dev` aus, um die Verbindung wiederherzustellen
- Überprüfe, ob `NEXT_PUBLIC_CONVEX_URL` in `.env.local` korrekt ist
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
- [Convex Auth v2](https://docs.convex.dev/auth/convex-auth)
- [Resend Dokumentation](https://resend.com/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Lucide Icons](https://lucide.dev/)

---

## 📄 Lizenz

MIT

---

Entwickelt mit ❤️ für die Sneaker-Community
