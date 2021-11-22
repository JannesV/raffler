import { UserOutlined } from "@ant-design/icons";
import { Avatar, Layout, Menu } from "antd";
import React from "react";
import { FunctionComponent } from "react";
import { UserInfo } from "./UserInfo/UserInfo";

export const Header: FunctionComponent = (params) => {
  return (
    <Layout.Header>
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["lijst"]}>
        <Menu.Item key="lijst">Lijst</Menu.Item>
        <UserInfo />
      </Menu>
    </Layout.Header>
  );
};
