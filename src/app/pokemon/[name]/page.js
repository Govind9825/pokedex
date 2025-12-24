"use client";
import { useEffect, useState, use } from 'react';
import Link from 'next/link';

export default function PokemonDetail({ params }) {
  const resolvedParams = use(params);
  const [pokemon, setPokemon] = useState(null);

  useEffect(() => {
    fetch(`/api/pokemon?name=${resolvedParams.name}`)
      .then(res => res.json())
      .then(data => setPokemon(data));
  }, [resolvedParams.name]);

  if (!pokemon) return <div className="p-10 text-center">Loading Pokémon details...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Link href="/" className="text-red-600 font-bold mb-6 inline-flex items-center hover:underline">
        <span className="mr-2">←</span> Back to PokéDex
      </Link>
      
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden mt-4">
        <div className="bg-red-500 p-10 flex flex-col items-center">
          <img src={pokemon.image} alt={pokemon.name} className="w-64 h-64 drop-shadow-2xl z-10" />
          <p className="text-white/70 font-mono text-xl mt-4">#{pokemon.id.toString().padStart(3, '0')}</p>
        </div>
        
        <div className="p-10">
          <h1 className="text-5xl font-black capitalize text-gray-800 mb-6">{pokemon.name}</h1>

          <div className="mb-10 p-6 bg-slate-50 border-l-4 border-red-500 rounded-r-2xl">
            <h3 className="text-sm uppercase tracking-widest font-bold text-gray-400 mb-2">Pokédex Entry</h3>
            <p className="text-xl text-gray-700 leading-relaxed italic">
              "{pokemon.description}"
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-8">
            <div className="space-y-6">
              <h3 className="font-bold text-xl text-black border-b pb-2">Physical Traits</h3>
              <div className="space-y-4">
                <p className="text-lg text-black flex justify-between">
                  <span className="font-bold text-gray-500">Height</span> 
                  <span>{pokemon.height / 10} m</span>
                </p>
                <p className="text-lg text-black flex justify-between">
                  <span className="font-bold text-gray-500">Weight</span> 
                  <span>{pokemon.weight / 10} kg</span>
                </p>
                <p className="text-lg text-black flex justify-between">
                  <span className="font-bold text-gray-500">Types</span> 
                  <span className="capitalize">{pokemon.types.join(', ')}</span>
                </p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-2xl shadow-inner">
              <h3 className="font-bold text-xl mb-6 text-black border-b border-gray-200 pb-2">Base Stats</h3>
              <div className="space-y-4 text-black">
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
        <span className="font-bold text-gray-500">{label}</span>
        <span className="font-black text-slate-900">{value}</span>
      </div>
      <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
        <div 
          className="bg-red-500 h-full rounded-full transition-all duration-1000" 
          style={{ width: `${Math.min((value / 200) * 100, 100)}%` }}
        ></div>
      </div>
    </div>
  );
}