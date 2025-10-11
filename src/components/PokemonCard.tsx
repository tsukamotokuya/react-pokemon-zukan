// src/components/PokemonCard.tsx
import React from 'react';
import { PokemonWithJapaneseName } from '../api/pokemonWithJapaneseName';

interface PokemonCardProps {
  pokemon: PokemonWithJapaneseName;
}

const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon }) => {
  return (
    <div className="pokemon-card">
      <div className="pokemon-image">
        <img
          src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
          alt={pokemon.japaneseName}
          loading="lazy"
        />
      </div>
      <div className="pokemon-info">
        <h3 className="pokemon-name">{pokemon.japaneseName}</h3>
        <p className="pokemon-english-name">{pokemon.name}</p>
        <p className="pokemon-id">#{pokemon.id.toString().padStart(3, '0')}</p>
      </div>
    </div>
  );
};

export default PokemonCard;