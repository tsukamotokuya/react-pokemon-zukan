// src/pokemonTypesMap.ts
// ポケモンのタイプ情報マップ

export type PokemonTypeInfo = {
  jaType: string;
  color: string;
};

export const pokemonTypesMap: PokemonTypeInfo[] = [
  { jaType: 'ノーマル', color: '#A8A878' },
  { jaType: 'ほのお', color: '#F08030' },
  { jaType: 'みず', color: '#6890F0' },
  { jaType: 'でんき', color: '#F8D030' },
  { jaType: 'くさ', color: '#78C850' },
  { jaType: 'こおり', color: '#98D8D8' },
  { jaType: 'かくとう', color: '#C03028' },
  { jaType: 'どく', color: '#A040A0' },
  { jaType: 'じめん', color: '#E0C068' },
  { jaType: 'ひこう', color: '#A890F0' },
  { jaType: 'エスパー', color: '#F85888' },
  { jaType: 'むし', color: '#A8B820' },
  { jaType: 'いわ', color: '#B8A038' },
  { jaType: 'ゴースト', color: '#705898' },
  { jaType: 'ドラゴン', color: '#7038F8' },
  { jaType: 'あく', color: '#705848' },
  { jaType: 'はがね', color: '#B8B8D0' },
  { jaType: 'フェアリー', color: '#EE99AC' },
];
