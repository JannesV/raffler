import { UserOutlined } from "@ant-design/icons";
import { Avatar, Layout, Menu } from "antd";
import React from "react";
import { FunctionComponent } from "react";

export const UserInfo: FunctionComponent = (params) => {
  return (
    <div className="ml-auto my-auto rounded-full w-8 h-8 bg-gray-600 flex justify-center items-center">
      <UserOutlined />
    </div>
  );
};
