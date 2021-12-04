import { Layout, Menu } from 'antd';
import React from 'react';
import { FunctionComponent } from 'react';
import { UserInfo } from './UserInfo/UserInfo';

interface HeaderProps {
  selectedKey: 'gallery' | 'list';
  onChangePage(page: 'gallery' | 'list'): void;
}

export const Header: FunctionComponent<HeaderProps> = ({
  selectedKey,
  onChangePage
}) => {
  return (
    <Layout.Header className="flex">
      <div style={{ minWidth: 200 }}>
        <Menu theme="dark" mode="horizontal" selectedKeys={[selectedKey]}>
          <Menu.Item onClick={() => onChangePage('gallery')} key="gallery">
            Gallerij
          </Menu.Item>
          <Menu.Item onClick={() => onChangePage('list')} key="list">
            Lijst
          </Menu.Item>
        </Menu>
      </div>
      <UserInfo />
    </Layout.Header>
  );
};
