import {
  Modal,
  Image,
  Rate,
  Carousel,
  Typography,
  Divider,
  Skeleton,
  Alert,
  Empty,
  Button
} from 'antd';
import React, { FunctionComponent, useEffect } from 'react';
import { Game, SteamApp } from '../types';
import { useFetch } from 'use-http';
import croteBB from '../images/croteBB.png';

interface GameInfoPopupProps {
  game: Game;
  onClose(): void;
}

export const GameInfoPopup: FunctionComponent<GameInfoPopupProps> = ({
  game,
  onClose: handleClose
}) => {
  const { loading, data, error, get } =
    useFetch<Record<string, { data: SteamApp }>>(`/steamapi`);

  useEffect(() => {
    if (game.appId) {
      get(`/${game.appId}`);
    }
  }, []);

  const steamApp: SteamApp | null =
    game.appId && data?.[game.appId]?.data ? data[game.appId]?.data : null;

  return (
    <Modal
      footer={null}
      width={650}
      visible
      onCancel={handleClose}
      title={game.title}
    >
      {game.appId && !steamApp && !error && (
        <>
          <Skeleton.Image />
          <Skeleton active={loading} paragraph={{ rows: 4 }} />
        </>
      )}
      {error && <Alert type="error" message={error.message} />}
      {!game.appId && (
        <Empty description="Gin match gevonden in de stoom databaas." />
      )}
      {steamApp && (
        <>
          <Image width={600} src={steamApp.header_image} preview={false} />
          <Rate
            disabled
            value={
              steamApp.metacritic ? steamApp.metacritic.score / 20 : undefined
            }
            allowHalf
          />
          <Typography.Paragraph ellipsis={{ rows: 5, expandable: true }}>
            {steamApp.short_description}
          </Typography.Paragraph>
          <Divider />
          <Typography.Title>Screenshots</Typography.Title>
          <Carousel autoplay>
            {steamApp.screenshots?.map((screenshot) => (
              <Image
                width={600}
                key={screenshot.id}
                src={screenshot.path_thumbnail}
                preview={false}
              />
            ))}
          </Carousel>
          <Divider />
          <Typography.Title>Videos</Typography.Title>
          <Carousel dotPosition="top">
            {steamApp.movies?.map((movie) => (
              <video controls={true} style={{ width: '100%' }} key={movie.id}>
                <source src={movie.mp4.max} type="video/mp4" />
                <source src={movie.webm.max} type="video/webm" />
              </video>
            ))}
          </Carousel>

          {game.appId && (
            <Button
              className="block mx-auto mb-4"
              target="_blank"
              href={`https://store.steampowered.com/app/${game.appId}`}
            >
              <img className="inline-block h-5 mr-2" src={croteBB} />
              NAAR DE STOOM WINKEL!
              <img className="inline-block h-5 ml-2" src={croteBB} />
            </Button>
          )}
        </>
      )}
    </Modal>
  );
};
