// src/queryKeys.ts

export const apiQueryKeys = {
  pokemon: {
    list: (offset?: number) => ['pokemonList', offset] as const,
    detail: (id: number | string) => ['pokemon', id] as const,
  },
} as const;