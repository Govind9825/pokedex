import mongoose from 'mongoose';

const PokemonSchema = new mongoose.Schema({
  id: Number,
  name: { type: String, index: true },
  height: Number,
  weight: Number,
  types: [String],
  hp: Number,
  attack: Number,
  defense: Number,
  speed: Number,
  image: String,
  description: String, 
  vector: [Number]
});


PokemonSchema.index({ 
  name: 'text', 
  types: 'text', 
  description: 'text' 
}, {
  weights: { name: 10, types: 5, description: 1 } 
});

export default mongoose.models.Pokemon || mongoose.model('Pokemon', PokemonSchema);