import { push, set } from "@firebase/database";
import { Modal, Input, Alert } from "antd";
import React, { useCallback, useState } from "react";
import { FunctionComponent } from "react";
import { gamesRef } from "../database";

interface GameAddModalProps {
  onClose(): void;
}

export const GameAddModal: FunctionComponent<GameAddModalProps> = ({
  onClose: handleClose,
}) => {
  const [gameList, setGameList] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = useCallback(async () => {
    setSubmitting(true);
    setSubmitError(null);

    const games = gameList
      .replace(/\t.*\n/g, "\n")
      .split(/\n/g)
      .map((g) => g.trim())
      .filter((g) => g);

    await Promise.all(
      games.map(async (title) => {
        const newGameRef = push(gamesRef);
        try {
          set(newGameRef, { title });
          handleClose();
        } catch (err) {
          setSubmitting(err.message);
          setSubmitting(false);
        }
      })
    );
  }, [gameList]);

  return (
    <Modal
      visible
      title="Voeg games toe"
      okButtonProps={{ loading: submitting }}
      onOk={handleSubmit}
      onCancel={handleClose}
    >
      <Input.TextArea
        value={gameList}
        onChange={(e) => setGameList(e.target.value)}
        autoSize={{ minRows: 6, maxRows: 25 }}
      />

      {submitError && <Alert type="error" message={submitError} />}
    </Modal>
  );
};

// const addGame = async () => {
//     try {
//       const newGameRef = push(gamesRef);
//       await set(newGameRef, {
//         title,
//       });
//     } catch (err) {
//       console.log(err);
//     }
//   };
