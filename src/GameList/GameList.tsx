import React, { useState } from "react";
import { FunctionComponent } from "react";
import { useList } from "react-firebase-hooks/database";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

import { Button, Popconfirm, Space, Table } from "antd";
import { db, gamesRef } from "../database";
import { orderByChild, query, ref, remove } from "firebase/database";
import { GameInfoPopup } from "../GameInfo/GameInfo";
import { Game } from "../types";
import { GameEditModal } from "../GameEditModal/GameEditModal";

export const GameList: FunctionComponent = () => {
  const [selectedItem, setSelectedItem] = useState<null | Game>(null);
  const [editItem, setEditItem] = useState<null | Game>(null);

  const q = query(gamesRef, orderByChild("title"));
  const [gameSnapshots, gamesLoading] = useList(q);

  return (
    <>
      {selectedItem && (
        <GameInfoPopup
          title={selectedItem.title}
          onClose={() => setSelectedItem(null)}
        />
      )}
      {editItem && (
        <GameEditModal game={editItem} onClose={() => setEditItem(null)} />
      )}
      <Table
        size="small"
        loading={gamesLoading}
        rowKey="key"
        onRow={(item) => {
          return {
            onClick() {
              setSelectedItem(item.val());
            },
            style: { cursor: "pointer" },
          };
        }}
        rowClassName={(val) => (val.val().claimedBy ? "bg-blue-100" : "")}
        columns={[
          {
            title: "Title",
            key: "title",
            dataIndex: "title",
            render(_, val) {
              return val.val().title;
            },
          },
          {
            title: "Claimed by",
            key: "claimedBy",
            dataIndex: "claimedBy",
            width: 300,
            render(_, val) {
              return val.val().claimedBy;
            },
            filters: Array.from(
              new Set(
                gameSnapshots
                  ?.filter((g) => g.val().claimedBy)
                  .map((v) => v.val().claimedBy)
              )
            ).map((g) => ({
              value: g,
              text: g,
            })),
            onFilter(val, record) {
              return record.val().claimedBy === val;
            },
          },
          {
            title: "Gedoneerd door",
            key: "donatedBy",
            dataIndex: "donatedBy",
            width: 300,
            render(_, val) {
              return val.val().donatedBy;
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
                      setEditItem({ id: val.key, ...val.val() });
                      e.stopPropagation();
                    }}
                  />
                  <Popconfirm
                    onConfirm={(e) => {
                      e?.stopPropagation();
                      remove(ref(db, `/games/${val.key}`));
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
        pagination={{ pageSize: 20 }}
        dataSource={gameSnapshots}
      />
    </>
  );
};
