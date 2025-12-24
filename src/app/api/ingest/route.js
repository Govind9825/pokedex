import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Pokemon from '@/lib/models/Pokemon';
import axios from 'axios';

export async function GET() {
  await dbConnect();
  
  try {
    const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=151');
    const results = response.data.results;
    const pokemonData = [];

    for (const p of results) {
      const detail = await axios.get(p.url);
      const d = detail.data;

      
      const speciesDetail = await axios.get(d.species.url);
      const entries = speciesDetail.data.flavor_text_entries;
      
      const description = entries.find(e => e.language.name === 'en')?.flavor_text
        .replace(/[\f\n\r\t]/g, ' ')
        .replace(/\u00ad/g, '') || "";

      pokemonData.push({
        id: d.id,
        name: d.name,
        height: d.height,
        weight: d.weight,
        types: d.types.map(t => t.type.name),
        hp: d.stats[0].base_stat,
        attack: d.stats[1].base_stat,
        defense: d.stats[2].base_stat,
        speed: d.stats[5].base_stat,
        image: d.sprites.other['official-artwork'].front_default,
        description: description
       
      });
      
      console.log(`Fetched: ${d.name}`);
    }

   
    await Pokemon.deleteMany({});
    await Pokemon.insertMany(pokemonData);

    return NextResponse.json({ 
      success: true, 
      message: "Ingested 151 Pokémon successfully",
      count: pokemonData.length 
    });
  } catch (error) {
    console.error("Ingest Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}