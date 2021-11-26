import React, { useState } from "react";
import { FunctionComponent } from "react";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

import { Button, Popconfirm, Space, Table } from "antd";
import { db } from "../database";
import { ref, remove } from "firebase/database";
import { GameInfoPopup } from "../GameInfo/GameInfo";
import { Game } from "../types";
import { GameEditModal } from "../GameEditModal/GameEditModal";

interface GameListProps {
  games: Game[];
  gamesLoading: boolean;
}

export const GameList: FunctionComponent<GameListProps> = ({
  games,
  gamesLoading,
}) => {
  const [selectedItem, setSelectedItem] = useState<null | Game>(null);
  const [editItem, setEditItem] = useState<null | Game>(null);

  return (
    <>
      {selectedItem && (
        <GameInfoPopup
          game={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
      {editItem && (
        <GameEditModal game={editItem} onClose={() => setEditItem(null)} />
      )}
      <Table
        size="small"
        loading={gamesLoading}
        rowKey="id"
        onRow={(item) => {
          return {
            onClick() {
              setSelectedItem(item);
            },
            style: { cursor: "pointer" },
          };
        }}
        rowClassName={(val) => (val.claimedBy ? "bg-gray-800" : "")}
        columns={[
          {
            title: "Title",
            key: "title",
            dataIndex: "title",
          },
          {
            title: "Claimed by",
            key: "claimedBy",
            dataIndex: "claimedBy",
            width: 300,
            filters: Array.from(
              new Set(
                games?.filter((g) => g.claimedBy).map((v) => v.claimedBy!)
              )
            ).map((g) => ({
              value: g,
              text: g,
            })),
            onFilter(val, record) {
              return record.claimedBy === val;
            },
            sorter: (a, b) =>
              a.claimedBy?.localeCompare(b.claimedBy || "") || 0,
            sortDirections: ["descend"],
          },
          {
            title: "Gedoneerd door",
            key: "donatedBy",
            dataIndex: "donatedBy",
            width: 300,
            render(_, val) {
              return val.donatedBy;
            },
          },
          {
            title: "",
            key: "buttons",
            width: 40,

            render(_, val) {
              return (
                <Space>
                  <Button
                    icon={<EditOutlined />}
                    onClick={(e) => {
                      setEditItem(val);
                      e.stopPropagation();
                    }}
                  />
                  <Popconfirm
                    onConfirm={(e) => {
                      e?.stopPropagation();
                      remove(ref(db, `/games/${val.id}`));
                    }}
                    onCancel={(e) => e?.stopPropagation()}
                    title="Zeker daj em wilt wegsmitn?"
                  >
                    <Button
                      onClick={(e) => e.stopPropagation()}
                      icon={<DeleteOutlined />}
                    />
                  </Popconfirm>
                </Space>
              );
            },
          },
        ]}
        pagination={{ pageSize: 20, position: ["bottomCenter", "topCenter"] }}
        dataSource={games}
      />
    </>
  );
};
