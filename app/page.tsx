'use client';

import { useState } from 'react';
import { Authenticated, Unauthenticated } from 'convex/react';
import { Header } from '../components/Header';
import { AddSneakerModal } from '../components/AddSneakerModal';
import { SneakerGrid } from '../components/SneakerGrid';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Header onAddClick={() => setIsModalOpen(true)} />
      <main className="container mx-auto p-8">
        <Authenticated>
          <SneakerGrid />
        </Authenticated>
        <Unauthenticated>
          <SignInForm />
        </Unauthenticated>
      </main>
      <AddSneakerModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}

function SignInForm() {
  return (
    <div className="flex flex-col gap-8 w-96 mx-auto mt-16">
      <h2 className="text-2xl font-bold text-center">Willkommen bei SneakPeak</h2>
      <p className="text-center text-slate-600 dark:text-slate-400">
        Melde dich an, um deine Sneaker-Sammlung zu teilen
      </p>
      <a href="/sign-in">
        <button className="w-full bg-foreground text-background px-4 py-2 rounded-md hover:opacity-80 transition-opacity">
          Anmelden
        </button>
      </a>
      <a href="/sign-up">
        <button className="w-full bg-slate-200 dark:bg-slate-800 px-4 py-2 rounded-md hover:opacity-80 transition-opacity">
          Registrieren
        </button>
      </a>
    </div>
  );
}
