"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Pokedex() {
  const [pokemon, setPokemon] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPokemon = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/pokemon?q=${search}`);
        const data = await res.json();
        setPokemon(data);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    const timer = setTimeout(fetchPokemon, 300);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <main className="p-8 bg-gray-50 min-h-screen text-slate-900">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-black text-center text-red-600 mb-2">PokéDex</h1>
        <p className="text-center text-slate-500 mb-8 font-medium">Search and filter your favorite Pokémon</p>
        
        <div className="max-w-md mx-auto mb-12">
          <input 
            type="text" 
            placeholder="Search by name or type (e.g. Fire)..."
            className="w-full p-4 rounded-2xl shadow-md border border-gray-200 focus:ring-2 focus:ring-red-500 outline-none text-slate-800 placeholder-slate-400 bg-white"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-400 font-medium">Searching the tall grass...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {pokemon.map(p => (
              <Link href={`/pokemon/${p.name}`} key={p.id}>
                <div className="bg-white p-6 rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-100 flex flex-col items-center group">
                  <div className="bg-slate-50 rounded-2xl p-4 mb-4 group-hover:bg-red-50 transition-colors">
                    <img src={p.image} alt={p.name} className="w-32 h-32 object-contain drop-shadow-md" />
                  </div>
                  <p className="text-slate-400 text-xs font-bold mb-1">#{p.id.toString().padStart(3, '0')}</p>
                  <h2 className="text-2xl font-bold capitalize text-slate-800">{p.name}</h2>
                  <div className="flex gap-2 mt-4">
                    {p.types.map(t => (
                      <span key={t} className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] rounded-lg font-black uppercase tracking-wider">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!loading && pokemon.length === 0 && (
          <div className="text-center py-20">
            <p className="text-slate-400 text-xl font-semibold">No Pokémon found matching "{search}"</p>
          </div>
        )}
      </div>
    </main>
  );
}