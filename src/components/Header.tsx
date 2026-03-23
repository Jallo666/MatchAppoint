import React from "react";

export default function Header() {
  return (
    <header className="bg-blue-600 text-white p-4 flex items-center justify-between">
      {/* Logo / titolo */}
      <div className="text-xl font-bold">MatchAppoint</div>

      {/* Menu di navigazione (placeholder) */}
      <nav className="space-x-4">
        <a href="#" className="hover:underline">Home</a>
        <a href="#" className="hover:underline">Prenotazioni</a>
        <a href="#" className="hover:underline">Contatti</a>
      </nav>
    </header>
  );
}