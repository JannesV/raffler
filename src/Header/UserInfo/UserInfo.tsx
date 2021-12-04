import { UserOutlined } from '@ant-design/icons';
import { signInWithPopup, signOut } from '@firebase/auth';
import { Dropdown, Menu } from 'antd';

import React, { useCallback } from 'react';
import { FunctionComponent } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, googleAuth } from '../../database';

export const UserInfo: FunctionComponent = () => {
  const [user] = useAuthState(auth);

  const handleLogin = useCallback(async () => {
    await signOut(auth);
    await signInWithPopup(auth, googleAuth);
  }, []);

  const handleLogout = useCallback(async () => {
    await signOut(auth);
  }, []);

  return (
    <div className="ml-auto flex">
      <span className="mr-2">{user?.displayName}</span>
      <Dropdown
        placement="bottomRight"
        overlay={
          <Menu>
            {(!user || user?.isAnonymous) && (
              <Menu.Item onClick={handleLogin}>Login</Menu.Item>
            )}
            {user && !user.isAnonymous && (
              <Menu.Item onClick={handleLogout}>Logout</Menu.Item>
            )}
          </Menu>
        }
      >
        <div className=" my-auto rounded-full w-8 h-8 bg-gray-600 flex justify-center items-center cursor-pointer overflow-hidden">
          {user?.photoURL ? <img src={user.photoURL} /> : <UserOutlined />}
        </div>
      </Dropdown>
    </div>
  );
};
