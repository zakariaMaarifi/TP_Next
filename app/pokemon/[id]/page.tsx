import { getPokemon } from "@/lib/api";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getTypeColor } from "@/lib/typeColors";
import { PokemonStats } from "@/lib/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

const STAT_LABELS: Record<keyof PokemonStats, string> = {
  HP: "PV",
  attack: "Attaque",
  defense: "Défense",
  specialAttack: "Att. Spé.",
  specialDefense: "Déf. Spé.",
  speed: "Vitesse",
};

const STAT_MAX = 255;

function StatBar({ label, value }: { label: string; value: number }) {
  const pct = Math.round((value / STAT_MAX) * 100);
  const color =
    value >= 100 ? "bg-green-500" : value >= 60 ? "bg-yellow-400" : "bg-red-400";

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-500 w-28 text-right shrink-0">{label}</span>
      <span className="text-sm font-semibold w-8 text-right shrink-0">{value}</span>
      <div className="flex-1 bg-gray-200 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full transition-all ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default async function PokemonDetailPage({ params }: PageProps) {
  const { id: rawId } = await params;
  const id = Number(rawId);

  if (isNaN(id)) notFound();

  let pokemon;
  try {
    pokemon = await getPokemon(id);
  } catch {
    notFound();
  }

  const stats = pokemon.stats;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Back button */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
      >
        ← Retour à la liste
      </Link>

      {/* Header card */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow border border-blue-100 p-6 flex flex-col sm:flex-row items-center gap-6">
        <div className="relative w-48 h-48 shrink-0">
          <Image
            src={pokemon.image}
            alt={pokemon.name}
            fill
            sizes="192px"
            className="object-contain drop-shadow-xl"
            priority
          />
        </div>
        <div className="flex flex-col gap-3 text-center sm:text-left">
          <p className="text-gray-400 font-mono text-sm">
            #{String(pokemon.pokedexId).padStart(3, "0")}
          </p>
          <h2 className="text-3xl font-bold text-gray-800 capitalize">{pokemon.name}</h2>
          <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
            {pokemon.types.map((type) => (
              <span
                key={type.id}
                className={`text-sm font-medium px-3 py-1 rounded-full ${getTypeColor(type.name)}`}
              >
                {type.name}
              </span>
            ))}
          </div>
          <p className="text-sm text-gray-500">Génération {pokemon.generation}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow border border-blue-100 p-6 space-y-4">
        <h3 className="font-bold text-blue-900 text-lg">Statistiques</h3>
        <div className="space-y-3">
          {(Object.keys(STAT_LABELS) as Array<keyof PokemonStats>).map((key) => (
            <StatBar key={key} label={STAT_LABELS[key]} value={stats[key]} />
          ))}
        </div>
      </div>

      {/* Evolutions */}
      {pokemon.evolutions && pokemon.evolutions.length > 0 && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow border border-blue-100 p-6 space-y-4">
          <h3 className="font-bold text-blue-900 text-lg">Évolutions</h3>
          <div className="flex flex-wrap gap-4">
            {pokemon.evolutions.map((evo) => (
              <Link
                key={evo.pokedexId}
                href={`/pokemon/${evo.pokedexId}`}
                className="flex flex-col items-center gap-2 bg-blue-50/50 hover:bg-cyan-50 border border-blue-100 hover:border-cyan-300 rounded-xl p-3 transition-colors w-28"
              >
                <div className="relative w-16 h-16">
                  <Image
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${evo.pokedexId}.png`}
                    alt={evo.name}
                    fill
                    sizes="64px"
                    className="object-contain"
                  />
                </div>
                <span className="text-xs font-medium text-gray-700 text-center capitalize">
                  {evo.name}
                </span>
                <span className="text-xs text-gray-400 font-mono">
                  #{String(evo.pokedexId).padStart(3, "0")}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
