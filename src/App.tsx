import { Button, Layout, Space } from "antd";
import React, { useCallback, useMemo, useState } from "react";
import { FunctionComponent } from "react";

import {} from "firebase/auth";
import { orderByChild, push, query, set } from "firebase/database";

import { Header } from "./Header/Header";
import { gamesRef } from "./database";
import { GameList } from "./GameList/GameList";
import { RaffleModal } from "./RaffleModal/RaffleModal";
import { useList } from "react-firebase-hooks/database";
import { Game } from "./types";

import crotePog from "./images/crotePog.png";

const gamesQuery = query(gamesRef, orderByChild("title"));

export const App: FunctionComponent = () => {
  const [title, setTitle] = useState("");
  const [showRaffleModal, setShowRaffleModal] = useState(false);

  const [gameSnapshots, gamesLoading] = useList(gamesQuery);

  const games = useMemo<Game[]>(
    () =>
      gameSnapshots?.map((snapshot) => ({
        id: snapshot.key,
        ...snapshot.val(),
      })) || [],
    [gameSnapshots]
  );

  const addGame = async () => {
    try {
      const newGameRef = push(gamesRef);
      await set(newGameRef, {
        title,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleShowRaffleModal = useCallback(() => setShowRaffleModal(true), []);
  const handleCloseRaffleModal = useCallback(
    () => setShowRaffleModal(false),
    []
  );

  return (
    <Layout>
      {showRaffleModal && (
        <RaffleModal games={games} onClose={handleCloseRaffleModal} />
      )}
      <Header />
      <Layout.Content style={{ padding: 10 }}>
        <Space className="mb-2">
          <Button type="primary" onClick={handleShowRaffleModal}>
            <img className="inline-block h-4 mr-1" src={crotePog} />
            <span className="">Random Raffle time!</span>
            <img className="inline-block h-4 ml-1" src={crotePog} />
          </Button>

          <Button onClick={addGame}>+ Voeg game toe</Button>
        </Space>
        {/* <Input value={title} onChange={(e) => setTitle(e.target.value)} /> */}

        <GameList games={games} gamesLoading={gamesLoading} />
      </Layout.Content>
    </Layout>
  );
};
