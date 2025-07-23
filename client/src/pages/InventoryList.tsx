import React, { useState } from 'react';
import { Table, Typography, Card, Input, Button, Space, Modal, Form, Popconfirm, message, Dropdown, Menu } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import Papa from 'papaparse';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

// ダミーデータ
const initialData = [
  { key: 'P-001', modelNo: 'P-001', branchNo: 'A', orderTotal: 100, stockTotal: 80, remaining: 20 },
  { key: 'P-002', modelNo: 'P-002', branchNo: 'B', orderTotal: 50, stockTotal: 30, remaining: 20 },
  { key: 'P-003', modelNo: 'P-003', branchNo: 'A', orderTotal: 70, stockTotal: 70, remaining: 0 },
  { key: 'P-004', modelNo: 'P-004', branchNo: 'C', orderTotal: 120, stockTotal: 100, remaining: 20 },
  { key: 'P-005', modelNo: 'P-005', branchNo: 'B', orderTotal: 90, stockTotal: 60, remaining: 30 },
];

const InventoryList: React.FC = () => {
  const [data, setData] = useState(initialData);
  const [searchModelNo, setSearchModelNo] = useState('');
  const [searchBranchNo, setSearchBranchNo] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  // フィルタ処理
  const filteredData = data.filter(item => {
    if (searchModelNo && !item.modelNo.toLowerCase().includes(searchModelNo.toLowerCase())) return false;
    if (searchBranchNo && !item.branchNo.toLowerCase().includes(searchBranchNo.toLowerCase())) return false;
    return true;
  });

  // 編集・削除・詳細
  const handleEdit = (record: any) => {
    setEditingItem(record);
    form.setFieldsValue({ ...record });
    setIsModalOpen(true);
  };
  const handleDelete = (key: string) => {
    setData(prev => prev.filter(item => item.key !== key));
    message.success('削除しました');
  };
  const handleDetail = (record: any) => {
    navigate(`/inventory-detail?modelNo=${encodeURIComponent(record.modelNo)}`);
  };
  const menu = (record: any) => (
    <Menu>
      <Menu.Item key="detail" onClick={() => handleDetail(record)}>
        詳細
      </Menu.Item>
      <Menu.Item key="edit" onClick={() => handleEdit(record)}>
        編集
      </Menu.Item>
      <Menu.Item key="delete">
        <Popconfirm title="削除しますか？" onConfirm={() => handleDelete(record.key)} okText="はい" cancelText="いいえ">
          <span style={{ color: 'red' }}>削除</span>
        </Popconfirm>
      </Menu.Item>
    </Menu>
  );

  // 登録・編集モーダル
  const handleAdd = () => {
    setEditingItem(null);
    form.resetFields();
    setIsModalOpen(true);
  };
  const handleModalOk = () => {
    form.validateFields().then(values => {
      if (editingItem) {
        setData(prev => prev.map(item => item.key === editingItem.key ? { ...editingItem, ...values } : item));
      } else {
        const newKey = `P-${Math.floor(Math.random() * 900 + 100)}`;
        setData(prev => [...prev, { key: newKey, ...values }]);
      }
      setIsModalOpen(false);
    });
  };

  // CSVインポート
  const handleCsvImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results: any) => {
        const newRows = (results.data as any[]).map(row => ({
          key: row['製品番号'] || `P-${Math.floor(Math.random() * 900 + 100)}`,
          modelNo: row['製品番号'] || '',
          branchNo: row['枝番'] || '',
          orderTotal: Number(row['注文総数']) || 0,
          stockTotal: Number(row['入庫総数']) || 0,
          remaining: Number(row['残数']) || 0,
        }));
        setData(prev => [...prev, ...newRows]);
      },
    });
    e.target.value = '';
  };

  const columns = [
    { title: '型番', dataIndex: 'modelNo', key: 'modelNo', sorter: (a: any, b: any) => a.modelNo.localeCompare(b.modelNo), onCell: () => ({ style: { minWidth: 110 } }) },
    { title: '枝番', dataIndex: 'branchNo', key: 'branchNo', sorter: (a: any, b: any) => a.branchNo.localeCompare(b.branchNo), onCell: () => ({ style: { minWidth: 80 } }) },
    { title: '注文総数', dataIndex: 'orderTotal', key: 'orderTotal', sorter: (a: any, b: any) => a.orderTotal - b.orderTotal, onCell: () => ({ style: { minWidth: 100 } }) },
    { title: '入庫総数', dataIndex: 'stockTotal', key: 'stockTotal', sorter: (a: any, b: any) => a.stockTotal - b.stockTotal, onCell: () => ({ style: { minWidth: 100 } }) },
    { title: '残数', dataIndex: 'remaining', key: 'remaining', sorter: (a: any, b: any) => a.remaining - b.remaining, onCell: () => ({ style: { minWidth: 100 } }) },
    {
      title: '',
      key: 'actions',
      fixed: 'right' as const,
      render: (_: any, record: any) => (
        <Dropdown overlay={menu(record)} trigger={["click"]} placement="bottomRight">
          <Button icon={<EllipsisOutlined />} shape="default" />
        </Dropdown>
      ),
    },
  ];

  return (
    <Card style={{ borderRadius: 12, boxShadow: '0 2px 8px #f0f1f2', margin: 24, background: '#fff' }}>
      <Title level={4} style={{ marginBottom: 24 }}>在庫一覧</Title>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <Button type="primary" onClick={handleAdd}>登録</Button>
      </div>
      <Card style={{ marginBottom: 16, borderRadius: 8, boxShadow: '0 1px 4px #e0e0e0', background: '#fafbfc' }} bodyStyle={{ padding: 16 }}>
        <Space wrap align="center">
          <Input
            placeholder="型番"
            allowClear
            style={{ width: 160 }}
            value={searchModelNo}
            onChange={e => setSearchModelNo(e.target.value)}
          />
          <Input
            placeholder="枝番"
            allowClear
            style={{ width: 100 }}
            value={searchBranchNo}
            onChange={e => setSearchBranchNo(e.target.value)}
          />
          <Button onClick={() => {
            setSearchModelNo('');
            setSearchBranchNo('');
          }}>条件クリア</Button>
        </Space>
      </Card>
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="key"
        bordered
        pagination={false}
        style={{ borderRadius: 12, marginTop: 8, overflowX: 'auto' }}
        scroll={{ x: true }}
        components={{
          header: {
            cell: (props: any) => <th {...props} style={{ ...props.style, background: '#f5f6fa', fontWeight: 700, fontSize: 15, whiteSpace: 'nowrap' }} />,
          },
          body: {
            cell: (props: any) => <td {...props} style={{ ...props.style, whiteSpace: 'nowrap' }} />,
          },
        }}
      />
      <Modal
        title={editingItem ? '在庫編集' : '在庫登録'}
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={() => setIsModalOpen(false)}
        okText="保存"
        cancelText="キャンセル"
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="modelNo" label="型番" rules={[{ required: true, message: '型番を入力してください' }]}> <Input /> </Form.Item>
          <Form.Item name="branchNo" label="枝番" rules={[{ required: true, message: '枝番を入力してください' }]}> <Input /> </Form.Item>
          <Form.Item name="orderTotal" label="注文総数" rules={[{ required: true, message: '注文総数を入力してください' }]}> <Input /> </Form.Item>
          <Form.Item name="stockTotal" label="入庫総数" rules={[{ required: true, message: '入庫総数を入力してください' }]}> <Input /> </Form.Item>
          <Form.Item name="remaining" label="残数" rules={[{ required: true, message: '残数を入力してください' }]}> <Input /> </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default InventoryList; 