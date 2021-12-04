import { Button, Select, Input, Layout, Space } from 'antd';
import React, { useCallback, useMemo, useState } from 'react';
import { FunctionComponent } from 'react';
import { SearchOutlined, UserOutlined } from '@ant-design/icons';
import {} from 'firebase/auth';
import { orderByChild, query } from 'firebase/database';

import { Header } from './Header/Header';
import { auth, gamesRef } from './database';
import { GameList } from './GameList/GameList';
import { RaffleModal } from './RaffleModal/RaffleModal';
import { useList } from 'react-firebase-hooks/database';
import { Game } from './types';

import crotePog from './images/crotePog.png';
import { GameAddModal } from './GameAddModal/GameAddModal';
import { GameGallery } from './GameGallery/GameGallery';
import { GameInfoPopup } from './GameInfo/GameInfo';
import { GameEditModal } from './GameEditModal/GameEditModal';
import { useAuthState } from 'react-firebase-hooks/auth';

const gamesQuery = query(gamesRef, orderByChild('title'));

export const App: FunctionComponent = () => {
  const [showRaffleModal, setShowRaffleModal] = useState(false);
  const [showAddGameModal, setShowAddGameModal] = useState(false);
  const [search, setSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [claimedFilter, setClaimedFilter] = useState<
    'claimed' | 'unclaimed' | undefined
  >('unclaimed');
  const [page, setPage] = useState<'gallery' | 'list'>('gallery');
  const [selectedItem, setSelectedItem] = useState<null | Game>(null);
  const [editItem, setEditItem] = useState<null | Game>(null);

  const [user] = useAuthState(auth);

  const [gameSnapshots, gamesLoading] = useList(gamesQuery);

  const games = useMemo<Game[]>(
    () =>
      gameSnapshots?.map((snapshot) => ({
        id: snapshot.key,
        ...snapshot.val()
      })) || [],
    [gameSnapshots]
  );

  const handleShowRaffleModal = useCallback(() => setShowRaffleModal(true), []);
  const handleCloseRaffleModal = useCallback(
    () => setShowRaffleModal(false),
    []
  );

  const handleShowAddGameModal = useCallback(
    () => setShowAddGameModal(true),
    []
  );
  const handleCloseAddGameModal = useCallback(
    () => setShowAddGameModal(false),
    []
  );

  // SOME LOVELY CLIENT SIDE FILTERING 🥴
  const filteredGames = useMemo(
    () =>
      search || userSearch || claimedFilter
        ? games.filter((g) => {
            const title = g.title.toLowerCase().replace(/\W/g, '');

            const user = g.claimedBy?.toLowerCase().replace(/\W/g, '');

            let match = true;
            if (
              search &&
              !title.includes(search.toLowerCase().replace(/\W/g, ''))
            ) {
              match = false;
            }

            if (
              userSearch &&
              (!user ||
                !user.includes(userSearch.toLowerCase().replace(/\W/g, '')))
            ) {
              match = false;
            }

            if (
              !userSearch &&
              claimedFilter &&
              claimedFilter === 'claimed' &&
              !g.claimedBy
            ) {
              match = false;
            }

            if (
              !userSearch &&
              claimedFilter &&
              claimedFilter === 'unclaimed' &&
              g.claimedBy
            ) {
              match = false;
            }

            return match;
          })
        : games,
    [games, search, userSearch, claimedFilter]
  );

  return (
    <Layout>
      {showRaffleModal && (
        <RaffleModal games={games} onClose={handleCloseRaffleModal} />
      )}
      {selectedItem && (
        <GameInfoPopup
          game={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
      {editItem && (
        <GameEditModal game={editItem} onClose={() => setEditItem(null)} />
      )}
      {showAddGameModal && <GameAddModal onClose={handleCloseAddGameModal} />}
      <Header selectedKey={page} onChangePage={setPage} />
      <Layout.Content style={{ padding: 10 }}>
        {user && (
          <Space className="mb-2">
            <Button type="primary" onClick={handleShowRaffleModal}>
              <img className="inline-block h-4 mr-1" src={crotePog} />
              <span className="">Random Raffle time!</span>
              <img className="inline-block h-4 ml-1" src={crotePog} />
            </Button>

            <Button onClick={handleShowAddGameModal}>+ Voeg game toe</Button>
          </Space>
        )}
        <div className="grid gap-2 grid-cols-3 max-w-3xl mb-3">
          <Input
            prefix={<SearchOutlined />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="zoekn op gametitel"
            allowClear
          />
          <Input
            prefix={<UserOutlined />}
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
            placeholder="zoekn op gebruiker"
            allowClear
          />

          <Select
            value={claimedFilter}
            options={[
              { value: 'claimed', label: 'Claimed' },
              { value: 'unclaimed', label: 'Niet geclaimed' }
            ]}
            allowClear
            placeholder="Claimed of unclaimed"
            onChange={(e) => setClaimedFilter(e)}
          />
        </div>
        {page === 'gallery' ? (
          <GameGallery
            games={filteredGames}
            gamesLoading={gamesLoading}
            onEditItem={setEditItem}
            onViewItem={setSelectedItem}
          />
        ) : (
          <GameList
            games={filteredGames}
            gamesLoading={gamesLoading}
            onEditItem={setEditItem}
            onViewItem={setSelectedItem}
          />
        )}
      </Layout.Content>
    </Layout>
  );
};
