"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Pokemon, PokemonType } from "@/lib/types";
import { getPokemons } from "@/lib/api";
import PokemonCard from "@/components/PokemonCard";
import TypeFilter from "@/components/TypeFilter";

const LIMIT_OPTIONS = [20, 50, 100];

interface PokemonListProps {
  initialPokemons: Pokemon[];
  types: PokemonType[];
}

export default function PokemonList({ initialPokemons, types }: PokemonListProps) {
  const [pokemons, setPokemons] = useState<Pokemon[]>(initialPokemons);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [name, setName] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const nameTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstMount = useRef(true);

  const fetchPokemons = useCallback(
    async (pageNum: number, reset: boolean) => {
      setLoading(true);
      try {
        const data = await getPokemons({
          page: pageNum,
          limit,
          name: name || undefined,
          types: selectedTypes.length > 0 ? selectedTypes : undefined,
        });
        if (reset) {
          setPokemons(data);
        } else {
          setPokemons((prev) => [...prev, ...data]);
        }
        setHasMore(data.length === limit);
      } catch {
        // silently ignore
      } finally {
        setLoading(false);
      }
    },
    [limit, name, selectedTypes]
  );

  // Reset when filters change
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    setPage(1);
    setHasMore(true);
    fetchPokemons(1, true);
  }, [limit, selectedTypes]); // eslint-disable-line react-hooks/exhaustive-deps

  // Debounce name filter
  useEffect(() => {
    if (isFirstMount.current) return;
    if (nameTimeoutRef.current) clearTimeout(nameTimeoutRef.current);
    nameTimeoutRef.current = setTimeout(() => {
      setPage(1);
      setHasMore(true);
      fetchPokemons(1, true);
    }, 400);
    return () => {
      if (nameTimeoutRef.current) clearTimeout(nameTimeoutRef.current);
    };
  }, [name]); // eslint-disable-line react-hooks/exhaustive-deps

  // Infinite scroll
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          const nextPage = page + 1;
          setPage(nextPage);
          fetchPokemons(nextPage, false);
        }
      },
      { threshold: 0.1 }
    );

    if (sentinelRef.current) {
      observerRef.current.observe(sentinelRef.current);
    }

    return () => observerRef.current?.disconnect();
  }, [hasMore, loading, page, fetchPokemons]);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-blue-100 p-4 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Rechercher un pokémon..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 border border-blue-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/80"
          />
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 whitespace-nowrap">Par page :</label>
            <select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="border border-blue-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/80"
            >
              {LIMIT_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>
        <TypeFilter types={types} selected={selectedTypes} onChange={setSelectedTypes} />
      </div>

      {/* Grid */}
      {pokemons.length === 0 && !loading ? (
        <p className="text-center text-gray-500 py-12">Aucun pokémon trouvé.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {pokemons.map((pokemon) => (
            <PokemonCard key={pokemon.id} pokemon={pokemon} />
          ))}
        </div>
      )}

      {/* Sentinel for infinite scroll */}
      <div ref={sentinelRef} className="h-8 flex items-center justify-center">
        {loading && (
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <span className="animate-spin inline-block w-5 h-5 border-2 border-gray-300 border-t-red-500 rounded-full" />
            Chargement...
          </div>
        )}
        {!hasMore && pokemons.length > 0 && (
          <p className="text-gray-400 text-sm">Tous les pokémons sont affichés.</p>
        )}
      </div>
    </div>
  );
}
