export interface Pokemon {
  id: number;
  name: string;
  image: string;
  details?: PokemonDetails; // Detalles opcionales
}

export interface PokemonDetails {
  weight: number;
  types: string[]; // Los tipos del Pokémon
  typesString?: string; // Representación en cadena
}
