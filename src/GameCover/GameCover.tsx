import { Empty } from 'antd';
import React from 'react';
import { FunctionComponent, useState } from 'react';
import croteT from '../images/croteT.png';

export interface GameCoverProps {
  appId: number | null;
  className?: string;
}

export const GameCover: FunctionComponent<GameCoverProps> = ({
  appId,
  className
}) => {
  const [imageError, setImageError] = useState(false);

  return appId && !imageError ? (
    <img
      width={900}
      height={600}
      className={`rounded-lg mb-1 max-w-xs w-full ${className || ''}`}
      onError={() => setImageError(true)}
      src={`https://steamcdn-a.akamaihd.net/steam/apps/${appId}/library_600x900_2x.jpg`}
    />
  ) : (
    <Empty
      image={<img className="mx-auto mt-20" src={croteT} />}
      className={`opacity-50 ${className || ''}`}
      description="GIN AFBEELDING "
    />
  );
};
