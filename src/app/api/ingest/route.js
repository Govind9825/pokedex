import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Pokemon from '@/lib/models/Pokemon';
import axios from 'axios';

export async function GET() {
  await dbConnect();
  
  try {
    // 1. Get the list of all pokemon (limit to 151 or 500 for testing)
    const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=151');
    const results = response.data.results;

    const pokemonData = await Promise.all(results.map(async (p) => {
      const detail = await axios.get(p.url);
      const d = detail.data;

      // Extract only essential stats as per Task 1
      return {
        id: d.id,
        name: d.name,
        height: d.height,
        weight: d.weight,
        types: d.types.map(t => t.type.name),
        hp: d.stats[0].base_stat,
        attack: d.stats[1].base_stat,
        defense: d.stats[2].base_stat,
        speed: d.stats[5].base_stat,
        image: d.sprites.other['official-artwork'].front_default
      };
    }));

    // 2. Clear existing and Insert into MongoDB
    await Pokemon.deleteMany({});
    await Pokemon.insertMany(pokemonData);

    return NextResponse.json({ message: "Successfully ingested 151 Pokémon" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}