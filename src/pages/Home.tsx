import React from "react";
import type { ReactNode } from "react";
import Header from "../components/Header";

interface HomeProps {
  children?: ReactNode;
}

export default function Home({ children }: HomeProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header sempre in alto */}
      <Header />

      {/* Contenuto principale */}
      <main className="flex-grow flex items-center justify-center p-4">
        {children || <h1 className="text-3xl font-bold">Hello World</h1>}
      </main>
    </div>
  );
}