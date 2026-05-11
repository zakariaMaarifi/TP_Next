import Link from "next/link";
import Image from "next/image";
import { Pokemon } from "@/lib/types";
import { getTypeColor } from "@/lib/typeColors";

interface PokemonCardProps {
  pokemon: Pokemon;
}

export default function PokemonCard({ pokemon }: PokemonCardProps) {
  return (
    <Link href={`/pokemon/${pokemon.pokedexId}`}>
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow hover:shadow-blue-200 hover:shadow-lg transition-all cursor-pointer flex flex-col items-center p-4 gap-2 border border-blue-100 hover:border-blue-300">
        <span className="text-xs text-gray-400 font-mono self-start">
          #{String(pokemon.pokedexId).padStart(3, "0")}
        </span>
        <div className="relative w-28 h-28">
          <Image
            src={pokemon.image}
            alt={pokemon.name}
            fill
            sizes="112px"
            className="object-contain drop-shadow-md"
          />
        </div>
        <p className="font-semibold text-gray-800 capitalize">{pokemon.name}</p>
        <div className="flex gap-1 flex-wrap justify-center">
          {pokemon.types.map((type) => (
            <span
              key={type.id}
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${getTypeColor(type.name)}`}
            >
              {type.name}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
