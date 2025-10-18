// src/components/PokemonCardSkeleton.tsx
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const PokemonCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center">
      <Skeleton width={24} height={16} className="mr-auto mb-2" />
      <Skeleton width={80} height={80} />
      <Skeleton width={100} height={24} className="mt-2" />
    </div>
  );
};

export default PokemonCardSkeleton;
