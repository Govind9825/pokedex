"use client";
import { useEffect, useState, use } from 'react';
import Link from 'next/link';

export default function PokemonDetail({ params }) {
  const resolvedParams = use(params); // Needed in Next.js 15
  const [pokemon, setPokemon] = useState(null);

  useEffect(() => {
    fetch(`/api/pokemon?name=${resolvedParams.name}`)
      .then(res => res.json())
      .then(data => setPokemon(data));
  }, [resolvedParams.name]);

  if (!pokemon) return <div className="p-10 text-center">Loading Pokémon details...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Link href="/" className="text-red-500 font-bold mb-4 inline-block">← Back to PokéDex</Link>
      
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden mt-10">
        <div className="bg-red-500 p-10 flex justify-center">
          <img src={pokemon.image} alt={pokemon.name} className="w-64 h-64 drop-shadow-2xl" />
        </div>
        
        <div className="p-10">
          <h1 className="text-5xl font-black capitalize text-gray-800 mb-4">{pokemon.name}</h1>
          
          <div className="grid grid-cols-2 gap-8 mt-8">
            <div className="space-y-4">
              <p className="text-lg text-black"><strong>Height:</strong> {pokemon.height / 10} m</p>
              <p className="text-lg text-black"><strong>Weight:</strong> {pokemon.weight / 10} kg</p>
              <p className="text-lg text-black"><strong>Types:</strong> {pokemon.types.join(', ')}</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-2xl">
              <h3 className="font-bold text-xl mb-4 text-black">Base Stats</h3>
              <div className="space-y-2 text-black">
                <StatBar label="HP" value={pokemon.hp} />
                <StatBar label="ATK" value={pokemon.attack} />
                <StatBar label="DEF" value={pokemon.defense} />
                <StatBar label="SPD" value={pokemon.speed} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatBar({ label, value }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span>{label}</span>
        <span className="font-bold text-slate-900">{value}</span>
      </div>
      <div className="w-full bg-gray-200 h-2 rounded-full">
        <div className="bg-red-500 h-2 rounded-full" style={{ width: `${(value / 255) * 100}%` }}></div>
      </div>
    </div>
  );
}