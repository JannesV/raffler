import { Button, Input, Modal, Result, Space } from "antd";
import React, { useCallback, useMemo, useState } from "react";
import { FunctionComponent } from "react";
import { Game } from "../types";
import croteHappy from "../images/croteHappy.png";
import { GameInfoPopup } from "../GameInfo/GameInfo";
import { update } from "@firebase/database";
import { gamesRef } from "../database";
import { GameCover } from "../GameCover/GameCover";

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
  const [left, setLeft] = useState(1000);
  const [showGameInfo, setShowGameInfo] = useState(false);
  const [prize, setPrize] = useState<Game | null>(null);
  const [reset, setReset] = useState(false);
  const [claimeeName, setClaimeeName] = useState("");

  const raffleGames = useMemo(() => {
    const filtered = games.filter((g) => !g.claimedBy);
    const out = [...filtered.slice(0, 20), ...filtered];

    return out;
  }, [games]);

  const doTheRaffle = useCallback(() => {
    const winner = getRandomIntInclusive(19, raffleGames.length - 1);

    setLeft(246 - winner * 172);

    setTimeout(() => {
      setPrize(raffleGames[winner]);
    }, 10000);
  }, [raffleGames]);

  const handleReset = useCallback(() => {
    setPrize(null);
    setReset(true);
    setLeft(1000);
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
      width={700}
      title="RAFFLE TIME!"
    >
      {prize && showGameInfo && (
        <GameInfoPopup onClose={() => setShowGameInfo(false)} game={prize} />
      )}
      <div className="overflow-hidden relative py-5 raffle-content">
        <div className="h-full w-px bg-white opacity-75 left-1/2 top-0 absolute -translate-x-1/2 z-10" />
        <div
          className="absolute inset-y-0 left-0 w-40 z-20"
          style={{
            background:
              "linear-gradient(90deg, rgba(31,31,31,1) 0%, rgba(31,31,31,0) 100%)",
          }}
        />
        <div
          className="absolute inset-y-0 right-0 w-40 z-20"
          style={{
            background:
              "linear-gradient(-90deg, rgba(31,31,31,1) 0%, rgba(31,31,31,0) 100%)",
          }}
        />
        <div
          className="flex transition-transform "
          style={{
            transform: `translate3d(${left}px, 0, 0)`,
            transitionDuration: reset ? "0s" : "10s",
            backfaceVisibility: "hidden",
          }}
        >
          {raffleGames.map((g) => (
            <div
              className="w-40 h-80 flex-shrink-0 bg-gray-800 rounded-lg overflow-hidden flex flex-col items-center justify-between text-center text-white mr-3 last:mr-0"
              style={{ backfaceVisibility: "hidden" }}
              key={g.id}
            >
              <GameCover
                key={g.id}
                appId={g.appId}
                className="w-full rounded-none"
              />
              <p className="px-3 pb-3">{g.title}</p>
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
