import { Button, Input, Layout } from "antd";
import React, { useEffect, useState } from "react";
import { FunctionComponent } from "react";

import { signInAnonymously } from "firebase/auth";
import { push, set } from "firebase/database";
import { useAuthState } from "react-firebase-hooks/auth";

import { Header } from "./Header/Header";
import { auth, gamesRef } from "./database";
import { GameList } from "./GameList/GameList";

export const App: FunctionComponent = () => {
  const [user] = useAuthState(auth);
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (!user) {
      signInAnonymously(auth);
    }
  }, [user]);

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

  return (
    <Layout>
      <Header />
      <Layout.Content style={{ padding: 10 }}>
        <Button onClick={addGame}>Add Game </Button>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} />

        <GameList />
      </Layout.Content>
    </Layout>
  );
};
