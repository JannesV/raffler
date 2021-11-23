import { Button, Input, Modal, Result, Space } from "antd";
import React, { useCallback, useMemo, useState } from "react";
import { FunctionComponent } from "react";
import { Game } from "../types";
import croteHappy from "../images/croteHappy.png";
import { GameInfoPopup } from "../GameInfo/GameInfo";
import { update } from "@firebase/database";
import { gamesRef } from "../database";

interface RafleModalProps {
  games: Game[];
  onClose(): void;
}

function getRandomIntInclusive(min, max) {
  const randomBuffer = new Uint32Array(1);

  window.crypto.getRandomValues(randomBuffer);

  const randomNumber = randomBuffer[0] / (0xffffffff + 1);

  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(randomNumber * (max - min + 1)) + min;
}

export const RaffleModal: FunctionComponent<RafleModalProps> = ({
  games,
  onClose: handleClose,
}) => {
  const [left, setLeft] = useState(600);
  const [showGameInfo, setShowGameInfo] = useState(false);
  const [prize, setPrize] = useState<Game | null>(null);
  const [reset, setReset] = useState(false);
  const [claimeeName, setClaimeeName] = useState("");

  const raffleGames = useMemo(() => {
    const out: Game[] = [];
    for (let i = 0; i < 2; i++) {
      out.push(...games.filter((g) => !g.claimedBy));
    }

    return out;
  }, [games]);

  const doTheRaffle = useCallback(() => {
    const winner = getRandomIntInclusive(
      (raffleGames.length - 1) / 2,
      raffleGames.length - 1
    );

    // const winner = 3;
    setLeft(160 - winner * 172);

    setTimeout(() => {
      setPrize(raffleGames[winner]);
    }, 10000);
  }, [raffleGames]);

  const handleReset = useCallback(() => {
    setPrize(null);
    setReset(true);
    setLeft(600);
    setClaimeeName("");
    setTimeout(() => {
      setReset(false);
    }, 100);
  }, []);

  return (
    <Modal
      footer={null}
      onCancel={handleClose}
      visible
      bodyStyle={{ display: "flex", flexDirection: "column" }}
    >
      {prize && showGameInfo && (
        <GameInfoPopup
          onClose={() => setShowGameInfo(false)}
          title={prize.title}
        />
      )}
      <div className="overflow-hidden relative py-5">
        <div className="h-full w-px bg-black left-1/2 top-0 absolute -translate-x-1/2 z-10" />
        <div
          className="flex transition-transform"
          style={{
            transform: `translate3d(${left}px, 0, 0)`,
            transitionDuration: reset ? "0s" : "10s",
            backfaceVisibility: "hidden",
          }}
        >
          {raffleGames.map((g, index) => (
            <div
              className="w-40 h-24 flex-shrink-0 bg-yellow-600 rounded flex items-center justify-center text-center text-white mr-3 last:mr-0 p-3"
              key={index}
            >
              {g.title}
            </div>
          ))}
        </div>
      </div>
      {prize && (
        <Result
          icon={<img className="mx-auto" src={croteHappy} />}
          title={prize?.title}
          subTitle="GOE GEDAAN!"
          extra={
            <div>
              <Space>
                <Button onClick={() => setShowGameInfo(true)}>Game info</Button>

                <Button onClick={handleReset}>OPNIEUW!</Button>
              </Space>
              <Space className="mt-5">
                <Input
                  value={claimeeName}
                  onChange={(ev) => setClaimeeName(ev.target.value)}
                  placeholder="Naam van de toarte"
                />
                <Button
                  onClick={async () => {
                    await update(gamesRef, {
                      [`/${prize.id}/claimedBy`]: claimeeName,
                    });
                    handleReset();
                  }}
                  type="primary"
                >
                  Claim
                </Button>
              </Space>
            </div>
          }
        />
      )}

      {!prize && (
        <Button
          size="large"
          type="primary"
          className="mx-auto mt-4"
          onClick={doTheRaffle}
        >
          Do the raffle thing!
        </Button>
      )}
    </Modal>
  );
};
