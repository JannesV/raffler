import { Empty, Input, Pagination, Spin } from "antd";
import React, { useCallback, useMemo, useState } from "react";
import { FunctionComponent } from "react";
import { steamGamesList } from "../steamGameList";
import { Game } from "../types";
import croteT from "../images/croteT.png";
import { GameInfoPopup } from "../GameInfo/GameInfo";
import { SearchOutlined } from "@ant-design/icons";

export interface GameGalleryProps {
  games: Game[];
  gamesLoading: boolean;
}

export const GameGallery: FunctionComponent<GameGalleryProps> = ({
  games,
  gamesLoading,
}) => {
  const [search, setSearch] = useState("");
  const [imageErrors, setImageErrors] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setPageSize] = useState(20);
  const [selectedItem, setSelectedItem] = useState<null | Game>(null);

  const gamesWithLookup = useMemo(
    () =>
      games.map<Game & { appId?: number }>((g) => {
        const app = steamGamesList.find(
          (app) =>
            app.simplifiedName === g.title.toLowerCase().replace(/\W/g, "")
        );

        return {
          ...g,
          appId: app?.appid,
        };
      }),

    [games]
  );

  const filteredGames = useMemo(
    () =>
      search
        ? gamesWithLookup.filter((g) =>
            g.title
              .toLowerCase()
              .replace(/\W/g, "")
              .includes(search.toLowerCase().replace(/\W/g, ""))
          )
        : gamesWithLookup,
    [games, search]
  );

  const handlePaginationChange = useCallback(
    (page: number, pageSize?: number | undefined) => {
      setCurrentPage(page);
      setPageSize(pageSize || currentPageSize);
    },
    [currentPageSize]
  );

  return (
    <div>
      {selectedItem && (
        <GameInfoPopup
          title={selectedItem.title}
          onClose={() => setSelectedItem(null)}
        />
      )}
      <Input
        prefix={<SearchOutlined />}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="zoekn"
        className="mb-3"
        allowClear
      />
      <Pagination
        className="mb-4"
        total={games.length}
        pageSize={currentPageSize}
        current={currentPage}
        onChange={handlePaginationChange}
      />
      <Spin spinning={gamesLoading}>
        <div
          className="grid gap-3 auto-cols-max"
          style={{
            gridTemplateColumns: "repeat(auto-fill,minmax(200px, 1fr))",
            minHeight: 400,
          }}
        >
          {filteredGames
            .slice(
              (currentPage - 1) * currentPageSize,
              (currentPage - 1) * currentPageSize + currentPageSize
            )
            .map((g, index) => {
              return (
                <div
                  className="text-center pb-1 flex flex-col justify-between cursor-pointer transition-transform transform hover:-translate-y-2 hover:scale-105"
                  key={index}
                  onClick={() => setSelectedItem(g)}
                >
                  {g.appId && !imageErrors.includes(g.appId) ? (
                    <img
                      className="rounded-lg mb-1 max-w-xs"
                      onError={() => setImageErrors([...imageErrors, g.appId!])}
                      src={`https://steamcdn-a.akamaihd.net/steam/apps/${g.appId}/library_600x900_2x.jpg`}
                    />
                  ) : (
                    <Empty
                      image={<img className="mx-auto mt-20" src={croteT} />}
                      className="opacity-50"
                      description="GIN AFBEELDING "
                    />
                  )}
                  <span className="px-2">{g.title}</span>
                </div>
              );
            })}
        </div>
      </Spin>
      <Pagination
        className="mt-4"
        total={games.length}
        pageSize={currentPageSize}
        current={currentPage}
        onChange={handlePaginationChange}
      />
    </div>
  );
};
