import { getPokemons, getTypes } from "@/lib/api";
import PokemonList from "@/components/PokemonList";

export default async function HomePage() {
  const [initialPokemons, types] = await Promise.all([
    getPokemons({ page: 1, limit: 50 }),
    getTypes(),
  ]);

  return <PokemonList initialPokemons={initialPokemons} types={types} />;
}
