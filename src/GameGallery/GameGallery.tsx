import { Pagination, Spin } from "antd";
import React, { useCallback, useState } from "react";
import { FunctionComponent } from "react";
import { Game } from "../types";

import { GameInfoPopup } from "../GameInfo/GameInfo";
import { GameCover } from "../GameCover/GameCover";

export interface GameGalleryProps {
  games: Game[];
  gamesLoading: boolean;
}

export const GameGallery: FunctionComponent<GameGalleryProps> = ({
  games,
  gamesLoading,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setPageSize] = useState(20);
  const [selectedItem, setSelectedItem] = useState<null | Game>(null);

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
          game={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}

      <Pagination
        size="small"
        className="mb-4 text-center"
        total={games.length}
        pageSize={currentPageSize}
        current={currentPage}
        onChange={handlePaginationChange}
      />
      <Spin spinning={gamesLoading}>
        <div
          className="grid gap-5 auto-cols-max"
          style={{
            gridTemplateColumns: "repeat(auto-fill,minmax(200px, 1fr))",
            minHeight: 400,
          }}
        >
          {games
            .slice(
              (currentPage - 1) * currentPageSize,
              (currentPage - 1) * currentPageSize + currentPageSize
            )
            .map((g) => {
              return (
                <div
                  className="text-center pb-1 flex flex-col justify-between cursor-pointer transition-transform transform hover:-translate-y-2 hover:scale-105"
                  key={g.id}
                  onClick={() => setSelectedItem(g)}
                >
                  <GameCover appId={g.appId} />
                  <span className="px-2">{g.title}</span>
                </div>
              );
            })}
        </div>
      </Spin>
      <Pagination
        size="small"
        className="mt-4 text-center"
        total={games.length}
        pageSize={currentPageSize}
        current={currentPage}
        onChange={handlePaginationChange}
      />
    </div>
  );
};
