import {
  Modal,
  Image,
  Rate,
  Carousel,
  Typography,
  Divider,
  Skeleton,
  Alert,
} from "antd";
import React, { FunctionComponent } from "react";
import { SteamApp } from "../types";
import { useFetch } from "use-http";
import { steamGamesList } from "../steamGameList";

interface GameInfoPopupProps {
  title: string;
  onClose(): void;
}

export const GameInfoPopup: FunctionComponent<GameInfoPopupProps> = ({
  title,
  onClose: handleClose,
}) => {
  const app = steamGamesList.find(
    (app) => app.simplifiedName === title.toLowerCase().replace(/\W/g, "")
  );

  const { loading, data, error } = useFetch<Record<string, { data: SteamApp }>>(
    `/steamapi/appdetails?appids=${app?.appid}`,
    {},
    []
  );

  const steamApp: SteamApp | null =
    app?.appid && data?.[app.appid]?.data ? data[app.appid]?.data : null;

  console.log(steamApp);

  return (
    <Modal
      footer={null}
      width={650}
      visible
      onCancel={handleClose}
      title={title}
    >
      {!steamApp && !error && (
        <>
          <Skeleton.Image />
          <Skeleton active={loading} paragraph={{ rows: 4 }} />
        </>
      )}
      {error && <Alert type="error" message={error.message} />}
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
              <video controls={true} style={{ width: "100%" }} key={movie.id}>
                <source src={movie.mp4.max} type="video/mp4" />
                <source src={movie.webm.max} type="video/webm" />
              </video>
            ))}
          </Carousel>
        </>
      )}
    </Modal>
  );
};
