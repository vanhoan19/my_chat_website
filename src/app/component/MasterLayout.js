import React from 'react';
import { Layout, theme } from 'antd'
import { Outlet } from 'react-router-dom';
import './app.css';
const { Content } = Layout;

export const MasterLayout = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <Layout>
      <Content>
        <Outlet />
      </Content>
    </Layout>
  );
};