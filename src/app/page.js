"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Pokedex() {
  const [pokemon, setPokemon] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchPokemon = async () => {
      const res = await fetch(`/api/pokemon?q=${search}`);
      const data = await res.json();
      setPokemon(data);
    };
    const timer = setTimeout(fetchPokemon, 300);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <main className="p-8 bg-gray-50 min-h-screen font-sans">
      <h1 className="text-4xl font-extrabold text-center text-red-600 mb-8">PokéDex Explorer</h1>
      
      <div className="max-w-md mx-auto mb-10 text-black">
        <input 
          type="text" 
          placeholder="Search Pokémon..."
          className="w-full p-4 rounded-full shadow-lg border-none focus:ring-2 focus:ring-red-500"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {pokemon.map(p => (
          <Link href={`/pokemon/${p.name}`} key={p.id}>
            <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all cursor-pointer border border-gray-100 flex flex-col items-center">
              <img src={p.image} alt={p.name} className="w-32 h-32 object-contain" />
              <h2 className="text-black text-xl font-bold capitalize mt-4">{p.name}</h2>
              <p className="text-gray-500 text-sm">#{p.id.toString().padStart(3, '0')}</p>
              <div className="flex gap-2 mt-3">
                {p.types.map(t => (
                  <span key={t} className="px-3 py-1 bg-red-100 text-red-600 text-xs rounded-full font-semibold uppercase">{t}</span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}