export const TYPE_COLORS: Record<string, string> = {
  Feu: "bg-orange-500 text-white",
  Eau: "bg-blue-500 text-white",
  Plante: "bg-green-500 text-white",
  Poison: "bg-purple-500 text-white",
  Électrik: "bg-yellow-400 text-black",
  Glace: "bg-cyan-300 text-black",
  Combat: "bg-red-700 text-white",
  Sol: "bg-yellow-600 text-white",
  Vol: "bg-indigo-400 text-white",
  Psy: "bg-pink-500 text-white",
  Insecte: "bg-lime-500 text-white",
  Roche: "bg-stone-500 text-white",
  Spectre: "bg-violet-700 text-white",
  Dragon: "bg-blue-700 text-white",
  Ténèbres: "bg-gray-800 text-white",
  Acier: "bg-gray-400 text-black",
  Normal: "bg-gray-300 text-black",
  Fée: "bg-pink-300 text-black",
};

export function getTypeColor(typeName: string): string {
  return TYPE_COLORS[typeName] ?? "bg-gray-200 text-black";
}
