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
});

// Full-text index for the search functionality
PokemonSchema.index({ name: 'text', types: 'text' });

export default mongoose.models.Pokemon || mongoose.model('Pokemon', PokemonSchema);