"use client";

import { PokemonType } from "@/lib/types";
import { getTypeColor } from "@/lib/typeColors";

interface TypeFilterProps {
  types: PokemonType[];
  selected: number[];
  onChange: (ids: number[]) => void;
}

export default function TypeFilter({ types, selected, onChange }: TypeFilterProps) {
  function toggle(id: number) {
    if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id));
    } else {
      onChange([...selected, id]);
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {types.map((type) => {
        const active = selected.includes(type.id);
        return (
          <button
            key={type.id}
            onClick={() => toggle(type.id)}
            className={`text-xs font-medium px-3 py-1 rounded-full border-2 transition-all ${
              active
                ? `${getTypeColor(type.name)} border-transparent shadow-md scale-105`
                : "bg-blue-50 text-blue-800 border-blue-200 hover:border-blue-400"
            }`}
          >
            {type.name}
          </button>
        );
      })}
    </div>
  );
}
