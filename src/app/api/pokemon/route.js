import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Pokemon from '@/lib/models/Pokemon';

export async function GET(request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const name = searchParams.get('name');

  if (name) {
    const pokemon = await Pokemon.findOne({ name: name.toLowerCase() });
    return NextResponse.json(pokemon);
  }

  try {
    if (query && query.trim() !== "") {
      const pokemons = await Pokemon.aggregate([
        {
          $search: {
            index: "default",
            text: {
              query: query,
              path: ["name", "types", "description"],
              fuzzy: { maxEdits: 2 } 
            }
          }
        },
        { $limit: 151 }
      ]);

      if (pokemons.length > 0) return NextResponse.json(pokemons);

      return NextResponse.json(await Pokemon.find({
        name: { $regex: query, $options: 'i' }
      }).limit(151));
    }

    const all = await Pokemon.find({}).sort({ id: 1 }).limit(151);
    return NextResponse.json(all);
  } catch (error) {
    console.error("Search Error:", error);
    const fallback = await Pokemon.find({ name: { $regex: query || '', $options: 'i' } }).limit(151);
    return NextResponse.json(fallback);
  }
}