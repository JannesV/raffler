import { Button, Pagination, Spin } from "antd";
import React, { useCallback, useState } from "react";
import { FunctionComponent } from "react";
import { Game } from "../types";

import { GameCover } from "../GameCover/GameCover";
import { useAuthState } from "react-firebase-hooks/auth";
import { EditOutlined } from "@ant-design/icons";

import { auth } from "../database";

export interface GameGalleryProps {
  games: Game[];
  gamesLoading: boolean;
  onEditItem(game: Game): void;
  onViewItem(game: Game): void;
}

export const GameGallery: FunctionComponent<GameGalleryProps> = ({
  games,
  gamesLoading,
  onEditItem: handleEditItem,
  onViewItem: handleViewItem,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setPageSize] = useState(50);
  const [user] = useAuthState(auth);

  const handlePaginationChange = useCallback(
    (page: number, pageSize?: number | undefined) => {
      setCurrentPage(page);
      setPageSize(pageSize || currentPageSize);
    },
    [currentPageSize]
  );

  return (
    <div>
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
                  className="text-center relative pb-1 flex flex-col justify-between cursor-pointer transition-transform transform hover:-translate-y-2 hover:scale-105 overflow-hidden rounded-lg"
                  key={g.id}
                  onClick={() => handleViewItem(g)}
                >
                  {g.claimedBy && (
                    <div className="absolute bg-yellow-600 border-1 bg-opacity-70 border-white top-0 w-full py-2">
                      {g.claimedBy}
                    </div>
                  )}
                  {user && (
                    <div className="absolute left-2 top-2">
                      {" "}
                      <Button
                        shape="circle"
                        size="small"
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={(e) => {
                          handleEditItem(g);
                          e.stopPropagation();
                        }}
                      />{" "}
                    </div>
                  )}
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
