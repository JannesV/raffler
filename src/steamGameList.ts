const games = import(
  /* webpackChunkName: "steam-games" */ './steamGameList.json'
);

export let steamGamesList: {
  simplifiedName: string;
  appid: number;
  name: string;
}[] = [];

games.then((g) => {
  steamGamesList = (
    g.default as {
      apps: { appid: number; name: string }[];
    }
  ).apps
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((game) => ({
      ...game,
      simplifiedName: game.name.toLowerCase().replace(/\W/g, '')
    }));
});
