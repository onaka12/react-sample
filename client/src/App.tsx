import React, { useState } from 'react';
import { Layout, Menu, Typography } from 'antd';
import {
  AppstoreOutlined,
  UnorderedListOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import 'antd/dist/reset.css';
import InventoryList from './pages/InventoryList';
import OrderList from './pages/OrderList';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const Settings: React.FC = () => (
  <>
    <Title level={4} style={{ marginBottom: 24 }}>設定</Title>
    <div>設定画面（ダミー）</div>
  </>
);

const App: React.FC = () => {
  const [selectedMenu, setSelectedMenu] = useState('inventory');
  const [collapsed, setCollapsed] = useState(false);

  const renderContent = () => {
    if (selectedMenu === 'orders') {
      return <OrderList />;
    }
    if (selectedMenu === 'settings') {
      return <Settings />;
    }
    // default: inventory
    return <InventoryList />;
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        breakpoint="lg"
        collapsedWidth={60}
        style={{ minHeight: '100vh' }}
        trigger={undefined} // Use default trigger
      >
        <div style={{ height: 32, margin: 16, background: 'rgba(255,255,255,0.2)', borderRadius: 6, textAlign: 'center', color: '#fff', lineHeight: '32px', fontWeight: 'bold', fontSize: collapsed ? 14 : 18 }}>
          {collapsed ? 'サンプル' : 'サンプル'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedMenu]}
          onClick={({ key }) => setSelectedMenu(key as string)}
        >
          <Menu.Item key="inventory" icon={<UnorderedListOutlined />}>
            在庫一覧
          </Menu.Item>
          <Menu.Item key="orders" icon={<AppstoreOutlined />}>
            発注情報一覧
          </Menu.Item>
          <Menu.Item key="settings" icon={<SettingOutlined />}>
            設定
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: 0, boxShadow: '0 2px 8px #f0f1f2' }}>
          <Title level={3} style={{ margin: '16px' }}>モダン在庫管理アプリ</Title>
        </Header>
        <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
          <div style={{ padding: 24, background: '#fff', borderRadius: 8, minHeight: 360 }}>
            {renderContent()}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default App; 