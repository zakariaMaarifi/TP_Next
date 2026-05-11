import { Pokemon, PokemonType, PokemonsParams } from "./types";

const BASE_URL = "https://nestjs-pokedex-api.vercel.app";

export async function getPokemons(params: PokemonsParams = {}): Promise<Pokemon[]> {
  const { page = 1, limit = 50, typeId, types, name } = params;

  const searchParams = new URLSearchParams();
  searchParams.set("page", String(page));
  searchParams.set("limit", String(limit));

  if (typeId !== undefined) {
    searchParams.set("typeId", String(typeId));
  }

  if (types && types.length > 0) {
    types.forEach((t) => searchParams.append("types", String(t)));
  }

  if (name) {
    searchParams.set("name", name);
  }

  const res = await fetch(`${BASE_URL}/pokemons?${searchParams.toString()}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch pokemons");
  }

  return res.json();
}

export async function getPokemon(pokedexId: number): Promise<Pokemon> {
  const res = await fetch(`${BASE_URL}/pokemons/${pokedexId}`, {
    cache: "force-cache",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch pokemon #${pokedexId}`);
  }

  return res.json();
}

export async function getTypes(): Promise<PokemonType[]> {
  const res = await fetch(`${BASE_URL}/types`, {
    cache: "force-cache",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch types");
  }

  return res.json();
}
