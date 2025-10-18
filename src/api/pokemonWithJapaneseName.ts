// src/api/pokemonWithJapaneseName.ts

// ポケモンAPIのレスポンス型定義
export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonBasic[];
}

export interface PokemonBasic {
  name: string;
  url: string;
}

// 日本語名を含むポケモンの型定義
export interface PokemonWithJapaneseName {
  id: number;
  name: string;
  japaneseName: string;
  url: string;
  number: string;
  sprites: {
    front_default: string;
    other: {
      'official-artwork': {
        front_default: string;
      };
    };
  };
}

// ポケモン種族データの型定義
export interface PokemonSpecies {
  names: {
    language: {
      name: string;
    };
    name: string;
  }[];
}

// ポケモン詳細データの型定義
export interface PokemonDetail {
  id: number;
  name: string;
  sprites: {
    front_default: string;
    other: {
      'official-artwork': {
        front_default: string;
      };
    };
  };
  species: {
    url: string;
  };
}

// ポケモンのIDをURLから抽出する関数
const extractPokemonId = (url: string): number => {
  const matches = url.match(/\/pokemon\/(\d+)\//);
  return matches ? parseInt(matches[1], 10) : 0;
};

// 日本語名を取得する関数
const fetchJapaneseName = async (speciesUrl: string): Promise<string> => {
  try {
    const response = await fetch(speciesUrl);
    if (!response.ok) {
      throw new Error(`Species fetch failed: ${response.status}`);
    }
    
    const speciesData: PokemonSpecies = await response.json();
    
    // 日本語名を検索
    const japaneseName = speciesData.names.find(
      (nameEntry) => nameEntry.language.name === 'ja-Hrkt'
    );
    
    return japaneseName ? japaneseName.name : 'Unknown';
  } catch (error) {
    console.error('Error fetching Japanese name:', error);
    return 'Unknown';
  }
};

// ポケモンの詳細情報を取得する関数
const fetchPokemonDetail = async (url: string): Promise<PokemonDetail> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Pokemon detail fetch failed: ${response.status}`);
  }
  return await response.json();
};

// 日本語名付きポケモンリストを取得するメイン関数
export const fetchPokemonListWithJapaneseNames = async (
  offset: number = 0,
  limit: number = 20
): Promise<{
  results: PokemonWithJapaneseName[];
  next: string | null;
  previous: string | null;
  count: number;
}> => {
  try {
    // ポケモンリストを取得
    const listResponse = await fetch(
      `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`
    );
    
    if (!listResponse.ok) {
      throw new Error(`Pokemon list fetch failed: ${listResponse.status}`);
    }
    
    const listData: PokemonListResponse = await listResponse.json();
    
    // 各ポケモンの詳細情報と日本語名を並行して取得
    const pokemonWithJapaneseNames = await Promise.all(
      listData.results.map(async (pokemon): Promise<PokemonWithJapaneseName> => {
        try {
          // ポケモンの詳細情報を取得
          const pokemonDetail = await fetchPokemonDetail(pokemon.url);
          
          // 日本語名を取得
          const japaneseName = await fetchJapaneseName(pokemonDetail.species.url);
          
          return {
            id: pokemonDetail.id,
            name: pokemonDetail.name,
            japaneseName,
            url: pokemon.url,
            number: pokemonDetail.id.toString().padStart(3, '0'),
            sprites: pokemonDetail.sprites,
          };
        } catch (error) {
          console.error(`Error processing pokemon ${pokemon.name}:`, error);
          
          // エラーが発生した場合のフォールバック
          return {
            id: extractPokemonId(pokemon.url),
            name: pokemon.name,
            japaneseName: 'Unknown',
            url: pokemon.url,
            number: extractPokemonId(pokemon.url).toString().padStart(3, '0'),
            sprites: {
              front_default: '',
              other: {
                'official-artwork': {
                  front_default: '',
                },
              },
            },
          };
        }
      })
    );
    
    return {
      results: pokemonWithJapaneseNames,
      next: listData.next,
      previous: listData.previous,
      count: listData.count,
    };
  } catch (error) {
    console.error('Error fetching pokemon list with Japanese names:', error);
    throw new Error('Failed to fetch pokemon list');
  }
};

// 単一ポケモンの日本語名付き詳細情報を取得する関数
export const fetchPokemonWithJapaneseName = async (
  pokemonId: number | string
): Promise<PokemonWithJapaneseName> => {
  try {
    // ポケモンの詳細情報を取得
    const pokemonResponse = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemonId}`
    );
    
    if (!pokemonResponse.ok) {
      throw new Error(`Pokemon fetch failed: ${pokemonResponse.status}`);
    }
    
    const pokemonDetail: PokemonDetail = await pokemonResponse.json();
    
    // 日本語名を取得
    const japaneseName = await fetchJapaneseName(pokemonDetail.species.url);
    
    return {
      id: pokemonDetail.id,
      name: pokemonDetail.name,
      japaneseName,
      url: `https://pokeapi.co/api/v2/pokemon/${pokemonDetail.id}/`,
      number: pokemonDetail.id.toString().padStart(3, '0'),
      sprites: pokemonDetail.sprites,
    };
  } catch (error) {
    console.error(`Error fetching pokemon ${pokemonId}:`, error);
    throw new Error(`Failed to fetch pokemon ${pokemonId}`);
  }
};