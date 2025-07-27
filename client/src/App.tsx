import React from 'react';
import { Layout, Menu, Typography } from 'antd';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import {
  AppstoreOutlined,
  UnorderedListOutlined,
  SettingOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import 'antd/dist/reset.css';
import InventoryList from './pages/InventoryList';
import OrderList from './pages/OrderList';
import InventoryDetail from './pages/InventoryDetail';
import InventoryDetailList from './pages/InventoryDetailList';
import ContractList from './pages/ContractList';
import ContractList2 from './pages/ContractList2';
import ContractDetail from './pages/ContractDetail';
import ContractDetail2 from './pages/ContractDetail2';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const Settings: React.FC = () => (
  <>
    <Title level={4} style={{ marginBottom: 24 }}>設定</Title>
    <div>設定画面（ダミー）</div>
  </>
);

const AppLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = React.useState(false);
  // パスから選択中メニューを決定
  const selectedMenu =
    location.pathname.startsWith('/order') ? 'orders'
    : location.pathname.startsWith('/settings') ? 'settings'
    : location.pathname.startsWith('/inventory-detail') ? 'inventory-detail'
    : location.pathname.startsWith('/contract-detail2') ? 'contract-detail2'
    : location.pathname.startsWith('/contract-detail') ? 'contract-detail'
    : location.pathname.startsWith('/contract2') ? 'contract2'
    : location.pathname.startsWith('/contract') ? 'contract'
    : 'inventory';

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        breakpoint="lg"
        collapsedWidth={60}
        style={{ minHeight: '100vh' }}
        trigger={undefined}
      >
        <div style={{ height: 32, margin: 16, background: 'rgba(255,255,255,0.2)', borderRadius: 6, textAlign: 'center', color: '#fff', lineHeight: '32px', fontWeight: 'bold', fontSize: collapsed ? 14 : 18 }}>
          {collapsed ? 'サンプル' : 'サンプル'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedMenu]}
          onClick={({ key }) => {
            if (key === 'orders') navigate('/order');
            else if (key === 'inventory') navigate('/inventory');
            else if (key === 'inventory-detail') navigate('/inventory-detail');
            else if (key === 'contract') navigate('/contract');
            else if (key === 'contract2') navigate('/contract2');
            else if (key === 'contract-detail') navigate('/contract-detail');
            else if (key === 'contract-detail2') navigate('/contract-detail2');
            else if (key === 'settings') navigate('/settings');
          }}
        >
          <Menu.Item key="orders" icon={<AppstoreOutlined />}>
            注文一覧
          </Menu.Item>
          <Menu.Item key="inventory" icon={<UnorderedListOutlined />}>
            在庫一覧
          </Menu.Item>
          <Menu.Item key="inventory-detail" icon={<UnorderedListOutlined />}>
            在庫詳細
          </Menu.Item>
          <Menu.Item key="contract" icon={<FileTextOutlined />}>
            成約一覧
          </Menu.Item>
          <Menu.Item key="contract2" icon={<FileTextOutlined />}>
            成約一覧2
          </Menu.Item>
          <Menu.Item key="contract-detail" icon={<FileTextOutlined />}>
            成約明細
          </Menu.Item>
          <Menu.Item key="contract-detail2" icon={<FileTextOutlined />}>
            成約明細2
          </Menu.Item>
          <Menu.Item key="settings" icon={<SettingOutlined />}>
            設定
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: 0, boxShadow: '0 2px 8px #f0f1f2' }}>
          <Title level={3} style={{ margin: '16px' }}>成約自動化</Title>
        </Header>
        <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
          <div style={{ padding: 24, background: '#fff', borderRadius: 8, minHeight: 360 }}>
            <Routes>
              <Route path="/inventory" element={<InventoryList />} />
              <Route path="/inventory/:id" element={<InventoryDetail />} />
              <Route path="/inventory-detail" element={<InventoryDetailList />} />
              <Route path="/order" element={<OrderList />} />
              <Route path="/contract" element={<ContractList />} />
              <Route path="/contract2" element={<ContractList2 />} />
              <Route path="/contract-detail" element={<ContractDetail />} />
              <Route path="/contract-detail2" element={<ContractDetail2 />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/" element={<Navigate to="/order" replace />} />
            </Routes>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

const App: React.FC = () => (
  <Router>
    <AppLayout />
  </Router>
);

export default App; 