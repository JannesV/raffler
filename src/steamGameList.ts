import games from "./steamGameList.json";

export const steamGamesList = (
  games as {
    apps: { appid: number; name: string }[];
  }
).apps
  .sort((a, b) => a.name.localeCompare(b.name))
  .map((game) => ({
    ...game,
    simplifiedName: game.name.toLowerCase().replace(/\W/g, ""),
  }));
