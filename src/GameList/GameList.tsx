import React, { useMemo } from 'react';
import { FunctionComponent } from 'react';
import {
  DeleteOutlined,
  EditOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';

import { Button, Popconfirm, Space, Table } from 'antd';
import { auth, db } from '../database';
import { ref, remove } from 'firebase/database';
import { Game } from '../types';
import { useAuthState } from 'react-firebase-hooks/auth';
import { ColumnsType } from 'antd/lib/table';

interface GameListProps {
  games: Game[];
  gamesLoading: boolean;
  onEditItem(game: Game): void;
  onViewItem(game: Game): void;
}

export const GameList: FunctionComponent<GameListProps> = ({
  games,
  gamesLoading,
  onEditItem: handleEditItem,
  onViewItem: handleViewItem
}) => {
  const [user] = useAuthState(auth);

  const colums = useMemo<ColumnsType<Game>>(() => {
    const cols: ColumnsType<Game> = [
      {
        title: 'Title',
        key: 'title',
        dataIndex: 'title'
      },
      {
        title: 'Claimed by',
        key: 'claimedBy',
        dataIndex: 'claimedBy',
        width: 300,
        sorter: (a, b) => {
          console.log(a, b);
          return a.claimedBy?.localeCompare(b.claimedBy || '') || 0;
        },
        sortDirections: ['descend']
      },
      {
        title: 'Gedoneerd door',
        key: 'donatedBy',
        dataIndex: 'donatedBy',
        width: 300,
        render(_, val) {
          return val.donatedBy;
        }
      }
    ];

    if (user) {
      cols.push(
        {
          title: 'Key gegeven',
          key: 'keyGiven',
          dataIndex: 'keyGiven',
          width: 150,
          align: 'center',
          render(v) {
            return v ? (
              <CheckCircleOutlined style={{ fontSize: 20, color: '#52c41a' }} />
            ) : (
              <CloseCircleOutlined
                style={{ fontSize: 20, color: '#ff4d4f', opacity: 0.3 }}
              />
            );
          }
        },
        {
          title: '',
          key: 'buttons',
          width: 40,

          render(_, val) {
            return (
              <Space>
                <Button
                  icon={<EditOutlined />}
                  onClick={(e) => {
                    handleEditItem(val);
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
          }
        }
      );
    }

    return cols;
  }, [user, games]);

  return (
    <>
      <Table
        size="small"
        loading={gamesLoading}
        rowKey="id"
        onRow={(item) => {
          return {
            onClick() {
              handleViewItem(item);
            },
            style: { cursor: 'pointer' }
          };
        }}
        rowClassName={(val) => (val.claimedBy ? 'bg-gray-800' : '')}
        columns={colums}
        pagination={{ pageSize: 20, position: ['bottomCenter', 'topCenter'] }}
        dataSource={games}
      />
    </>
  );
};
