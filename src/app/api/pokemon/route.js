import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Pokemon from '@/lib/models/Pokemon';
import { pipeline, env } from '@xenova/transformers';

env.allowLocalModels = false;
env.useBrowserCache = false;
env.remoteModels = true;
env.backends.onnx.wasm.proxy = false;

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
      const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
      const output = await extractor(query, { pooling: 'mean', normalize: true });
      const queryVector = Array.from(output.data);

      const pokemons = await Pokemon.aggregate([
        {
          "$vectorSearch": {
            "index": "default", 
            "path": "vector",
            "queryVector": queryVector,
            "numCandidates": 151,
            "limit": 151
          }
        }
      ]);

      if (pokemons.length > 0) return NextResponse.json(pokemons);

      const fallback = await Pokemon.find({
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { types: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } }
        ]
      }).limit(151);
      
      return NextResponse.json(fallback);
    }

    const allPokemons = await Pokemon.find({}).sort({ id: 1 }).limit(151);
    return NextResponse.json(allPokemons);

  } catch (error) {
    console.error("Semantic Search Error:", error);
    const lastResort = await Pokemon.find({
      $or: [
        { name: { $regex: query || '', $options: 'i' } },
        { description: { $regex: query || '', $options: 'i' } }
      ]
    }).limit(151);
    return NextResponse.json(lastResort);
  }
}