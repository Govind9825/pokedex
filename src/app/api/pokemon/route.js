// src/app/api/pokemon/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Pokemon from '@/lib/models/Pokemon';

export async function GET(request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const name = searchParams.get('name');

  // If "name" is provided, return details for one pokemon
  if (name) {
    const pokemon = await Pokemon.findOne({ name: name.toLowerCase() });
    return NextResponse.json(pokemon);
  }

  // Otherwise, perform search
  let filter = {};
  if (query) {
    filter = { name: { $regex: query, $options: 'i' } }; // Simple regex search
  }

  const pokemons = await Pokemon.find(filter).limit(20);
  return NextResponse.json(pokemons);
}