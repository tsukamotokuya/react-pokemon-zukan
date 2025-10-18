// src/api/pokemonDetail.ts
// ポケモンの詳細情報を取得するAPI

export type PokemonDetailData = {
  id: number;
  japaneseName: string;
  image: string;
  description: string;
  types: string[];
  abilities: string[];
  baseStats: {
    name: string;
    value: number;
  }[];
};

// 日本語名を取得する関数
const fetchJapaneseName = async (speciesUrl: string): Promise<string> => {
  try {
    const response = await fetch(speciesUrl);
    if (!response.ok) {
      throw new Error(`Species fetch failed: ${response.status}`);
    }
    
    const speciesData = await response.json();
    
    // 日本語名を検索
    const japaneseName = speciesData.names.find(
      (nameEntry: any) => nameEntry.language.name === 'ja-Hrkt'
    );
    
    return japaneseName ? japaneseName.name : 'Unknown';
  } catch (error) {
    console.error('Error fetching Japanese name:', error);
    return 'Unknown';
  }
};

// 日本語の説明文を取得する関数
const fetchJapaneseDescription = async (speciesUrl: string): Promise<string> => {
  try {
    const response = await fetch(speciesUrl);
    if (!response.ok) {
      throw new Error(`Species fetch failed: ${response.status}`);
    }
    
    const speciesData = await response.json();
    
    // 日本語の説明文を検索
    const japaneseFlavorText = speciesData.flavor_text_entries.find(
      (entry: any) => entry.language.name === 'ja'
    );
    
    // 改行文字を削除して整形
    return japaneseFlavorText 
      ? japaneseFlavorText.flavor_text.replace(/\n|\f/g, ' ') 
      : '説明文がありません';
  } catch (error) {
    console.error('Error fetching Japanese description:', error);
    return '説明文の取得に失敗しました';
  }
};

// タイプの日本語名を取得する関数
const fetchJapaneseTypeName = async (typeUrl: string): Promise<string> => {
  try {
    const response = await fetch(typeUrl);
    if (!response.ok) {
      throw new Error(`Type fetch failed: ${response.status}`);
    }
    
    const typeData = await response.json();
    
    // 日本語名を検索
    const japaneseName = typeData.names.find(
      (nameEntry: any) => nameEntry.language.name === 'ja'
    );
    
    return japaneseName ? japaneseName.name : typeData.name;
  } catch (error) {
    console.error('Error fetching Japanese type name:', error);
    return 'Unknown';
  }
};

// 特性の日本語名を取得する関数
const fetchJapaneseAbilityName = async (abilityUrl: string): Promise<string> => {
  try {
    const response = await fetch(abilityUrl);
    if (!response.ok) {
      throw new Error(`Ability fetch failed: ${response.status}`);
    }
    
    const abilityData = await response.json();
    
    // 日本語名を検索
    const japaneseName = abilityData.names.find(
      (nameEntry: any) => nameEntry.language.name === 'ja'
    );
    
    return japaneseName ? japaneseName.name : abilityData.name;
  } catch (error) {
    console.error('Error fetching Japanese ability name:', error);
    return 'Unknown';
  }
};

// ステータス名の日本語マップ
const statNameMap: Record<string, string> = {
  hp: 'HP',
  attack: 'こうげき',
  defense: 'ぼうぎょ',
  'special-attack': 'とくこう',
  'special-defense': 'とくぼう',
  speed: 'すばやさ',
};

// ポケモンの詳細情報を取得するメイン関数
export const fetchPokemonDetail = async (id: number): Promise<PokemonDetailData> => {
  try {
    // ポケモンの基本情報を取得
    const pokemonResponse = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${id}`
    );
    
    if (!pokemonResponse.ok) {
      throw new Error(`Pokemon fetch failed: ${pokemonResponse.status}`);
    }
    
    const pokemonData = await pokemonResponse.json();
    
    // 並行して各種情報を取得
    const [japaneseName, description, types, abilities] = await Promise.all([
      fetchJapaneseName(pokemonData.species.url),
      fetchJapaneseDescription(pokemonData.species.url),
      Promise.all(
        pokemonData.types.map((typeEntry: any) => 
          fetchJapaneseTypeName(typeEntry.type.url)
        )
      ),
      Promise.all(
        pokemonData.abilities.map((abilityEntry: any) => 
          fetchJapaneseAbilityName(abilityEntry.ability.url)
        )
      ),
    ]);
    
    // 基礎ステータスを整形
    const baseStats = pokemonData.stats.map((statEntry: any) => ({
      name: statNameMap[statEntry.stat.name] || statEntry.stat.name,
      value: statEntry.base_stat,
    }));
    
    // 画像URLを取得
    const image = pokemonData.sprites.other['official-artwork'].front_default 
      || pokemonData.sprites.front_default;
    
    return {
      id: pokemonData.id,
      japaneseName,
      image,
      description,
      types,
      abilities,
      baseStats,
    };
  } catch (error) {
    console.error(`Error fetching pokemon detail ${id}:`, error);
    throw new Error(`Failed to fetch pokemon detail ${id}`);
  }
};
