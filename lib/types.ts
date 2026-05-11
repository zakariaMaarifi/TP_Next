export interface PokemonType {
  id: number;
  name: string;
  image: string;
}

export interface PokemonStats {
  HP: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
}

export interface PokemonEvolution {
  name: string;
  pokedexId: number;
}

export interface Pokemon {
  id: number;
  pokedexId: number;
  name: string;
  image: string;
  sprite: string;
  generation: number;
  stats: PokemonStats;
  types: PokemonType[];
  evolutions: PokemonEvolution[];
}

export interface PokemonsParams {
  page?: number;
  limit?: number;
  typeId?: number;
  types?: number[];
  name?: string;
}
