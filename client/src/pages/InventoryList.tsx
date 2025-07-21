import React, { useState } from 'react';
import { Table, Typography, Button, Modal, Form, Input, InputNumber, Space, Dropdown, Menu, Tooltip, Card, Descriptions, Row, Col, Divider } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import './InventoryList.css';

const { Title } = Typography;
const { Search } = Input;

interface InventoryItem {
  key: number;
  name: string;
  stock: number;
  price: number;
}

const initialData: InventoryItem[] = [
  { key: 1, name: '商品A', stock: 120, price: 1500 },
  { key: 2, name: '商品B', stock: 80, price: 2300 },
  { key: 3, name: '商品C', stock: 45, price: 3200 },
  { key: 4, name: '商品D', stock: 200, price: 500 },
];

const InventoryList: React.FC = () => {
  const [data, setData] = useState<InventoryItem[]>(initialData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [form] = Form.useForm();
  const [viewItem, setViewItem] = useState<InventoryItem | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  // Remove filters state and use only AntD's built-in filter logic

  const handleDelete = (key: number) => {
    setData(data.filter(item => item.key !== key));
  };

  const handleEdit = (item: InventoryItem) => {
    setEditingItem(item);
    form.setFieldsValue(item);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingItem(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      if (editingItem) {
        setData(data.map(item => item.key === editingItem.key ? { ...editingItem, ...values } : item));
      } else {
        const newKey = data.length ? Math.max(...data.map(i => i.key)) + 1 : 1;
        setData([...data, { key: newKey, ...values }]);
      }
      setIsModalOpen(false);
    });
  };

  const handleView = (item: InventoryItem) => {
    setViewItem(item);
    setIsViewModalOpen(true);
  };

  const menu = (record: InventoryItem) => (
    <Menu>
      <Menu.Item key="view" onClick={() => handleView(record)}>
        参照
      </Menu.Item>
      <Menu.Item key="edit" onClick={() => handleEdit(record)}>
        編集
      </Menu.Item>
      <Menu.Item key="delete" onClick={() => handleDelete(record.key)} danger>
        削除
      </Menu.Item>
    </Menu>
  );

  // Remove filters state and use only AntD's built-in filter logic
  const filteredData = data.filter(item => item.name.includes(searchText));

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys: React.Key[]) => setSelectedRowKeys(selectedKeys),
  };

  const getColumnSearchProps = (dataIndex: keyof InventoryItem, label: string) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`${label}でフィルタ`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => confirm()}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => confirm()}
            size="small"
            style={{ width: 90 }}
          >
            フィルタ
          </Button>
          <Button onClick={() => clearFilters && clearFilters()} size="small" style={{ width: 90 }}>
            リセット
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => <span style={{ color: filtered ? '#1677ff' : undefined }}>🔍</span>,
    onFilter: (value: string | number | boolean, record: InventoryItem) => {
      return record[dataIndex].toString().includes(value as string);
    },
  });

  const getNumberRangeFilterProps = (dataIndex: keyof InventoryItem, label: string) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
      <div style={{ padding: 8 }}>
        <InputNumber
          placeholder="最小値"
          value={selectedKeys[0]}
          onChange={val => setSelectedKeys([val, selectedKeys[1]])}
          style={{ width: 90, marginBottom: 8 }}
        />
        <InputNumber
          placeholder="最大値"
          value={selectedKeys[1]}
          onChange={val => setSelectedKeys([selectedKeys[0], val])}
          style={{ width: 90, marginBottom: 8, marginLeft: 8 }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => confirm()}
            size="small"
            style={{ width: 90 }}
          >
            フィルタ
          </Button>
          <Button onClick={() => clearFilters && clearFilters()} size="small" style={{ width: 90 }}>
            リセット
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => <span style={{ color: filtered ? '#1677ff' : undefined }}>🔢</span>,
    onFilter: (value: string | number | boolean, record: InventoryItem) => {
      const [min, max] = Array.isArray(value) ? value : [undefined, undefined];
      const v = record[dataIndex] as number;
      const minVal = min === undefined ? -Infinity : Number(min);
      const maxVal = max === undefined ? Infinity : Number(max);
      return v >= minVal && v <= maxVal;
    },
  });

  const getNumberFilterProps = (dataIndex: keyof InventoryItem, label: string) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
      <div style={{ padding: 8 }}>
        <InputNumber
          placeholder={`${label}でフィルタ`}
          value={selectedKeys[0]}
          onChange={val => setSelectedKeys(val !== undefined ? [val] : [])}
          style={{ width: 120, marginBottom: 8 }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => confirm()}
            size="small"
            style={{ width: 90 }}
          >
            フィルタ
          </Button>
          <Button onClick={() => clearFilters && clearFilters()} size="small" style={{ width: 90 }}>
            リセット
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => <span style={{ color: filtered ? '#1677ff' : undefined }}>🔢</span>,
    onFilter: (value: string | number | boolean, record: InventoryItem) => {
      return record[dataIndex] === value;
    },
  });

  const columns = [
    {
      title: 'ID',
      dataIndex: 'key',
      key: 'key',
      width: 80,
      ...getNumberFilterProps('key', 'ID'),
      sorter: (a: InventoryItem, b: InventoryItem) => a.key - b.key,
    },
    {
      title: '商品名',
      dataIndex: 'name',
      key: 'name',
      ...getColumnSearchProps('name', '商品名'),
    },
    {
      title: '在庫数',
      dataIndex: 'stock',
      key: 'stock',
      ...getNumberRangeFilterProps('stock', '在庫数'),
      sorter: (a: InventoryItem, b: InventoryItem) => a.stock - b.stock,
    },
    {
      title: '価格 (円)',
      dataIndex: 'price',
      key: 'price',
      render: (value: number) => value.toLocaleString(),
      ...getNumberRangeFilterProps('price', '価格'),
      sorter: (a: InventoryItem, b: InventoryItem) => a.price - b.price,
    },
    {
      title: '',
      key: 'more',
      width: 48,
      render: (_: any, record: InventoryItem) => (
        <Tooltip title="操作メニュー">
          <Dropdown overlay={menu(record)} trigger={["click"]} placement="bottomRight">
            <Button type="text" icon={<EllipsisOutlined />} />
          </Dropdown>
        </Tooltip>
      ),
    },
  ];

  return (
    <Card className="modern-table-card" bodyStyle={{ padding: 0, borderRadius: 12 }}>
      <div style={{ padding: '24px 24px 0 24px' }}>
        <Title level={4} style={{ marginBottom: 24 }}>在庫一覧</Title>
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <Button type="primary" onClick={handleAdd}>
            登録
          </Button>
          <Search
            placeholder="商品名で検索"
            allowClear
            onChange={e => setSearchText(e.target.value)}
            style={{ width: 240 }}
          />
          {selectedRowKeys.length > 0 && (
            <span style={{ marginLeft: 8, color: '#1677ff', fontWeight: 500 }}>
              {selectedRowKeys.length}件選択中
            </span>
          )}
        </div>
      </div>
      <Table
        className="modern-table"
        columns={columns}
        dataSource={filteredData}
        pagination={false}
        rowKey="key"
        bordered
        size="middle"
        rowClassName={(_, idx) => idx % 2 === 0 ? 'modern-table-row-even' : 'modern-table-row-odd'}
        style={{ borderRadius: 12, margin: 24 }}
        scroll={{ x: true }}
        rowSelection={rowSelection}
      />
      <Modal
        title={editingItem ? '在庫編集' : '在庫登録'}
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={() => setIsModalOpen(false)}
        okText="保存"
        cancelText="キャンセル"
        width={editingItem ? 600 : 400}
        bodyStyle={{ padding: editingItem ? 0 : undefined }}
      >
        {editingItem ? (
          <Row gutter={0} style={{ minHeight: 220 }}>
            <Col xs={24} md={11} style={{ background: '#f6f8fa', borderRight: '1px solid #f0f0f0', padding: 20, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ fontWeight: 600, marginBottom: 12, color: '#555' }}>現在の値</div>
              <Descriptions column={1} size="small" labelStyle={{ color: '#888', fontWeight: 500 }} contentStyle={{ fontWeight: 600 }}>
                <Descriptions.Item label="商品名">{editingItem.name}</Descriptions.Item>
                <Descriptions.Item label="在庫数">{editingItem.stock}</Descriptions.Item>
                <Descriptions.Item label="価格 (円)">{editingItem.price.toLocaleString()}</Descriptions.Item>
              </Descriptions>
            </Col>
            <Col xs={24} md={13} style={{ padding: 24 }}>
              <div style={{ fontWeight: 600, marginBottom: 12, color: '#555' }}>新しい値</div>
              <Form form={form} layout="vertical">
                <Form.Item name="name" label="商品名" rules={[{ required: true, message: '商品名を入力してください' }]}> <Input /> </Form.Item>
                <Form.Item name="stock" label="在庫数" rules={[{ required: true, message: '在庫数を入力してください' }]}> <InputNumber min={0} style={{ width: '100%' }} /> </Form.Item>
                <Form.Item name="price" label="価格 (円)" rules={[{ required: true, message: '価格を入力してください' }]}> <InputNumber min={0} style={{ width: '100%' }} /> </Form.Item>
              </Form>
            </Col>
          </Row>
        ) : (
          <Form form={form} layout="vertical">
            <Form.Item name="name" label="商品名" rules={[{ required: true, message: '商品名を入力してください' }]}> <Input /> </Form.Item>
            <Form.Item name="stock" label="在庫数" rules={[{ required: true, message: '在庫数を入力してください' }]}> <InputNumber min={0} style={{ width: '100%' }} /> </Form.Item>
            <Form.Item name="price" label="価格 (円)" rules={[{ required: true, message: '価格を入力してください' }]}> <InputNumber min={0} style={{ width: '100%' }} /> </Form.Item>
          </Form>
        )}
      </Modal>
      <Modal
        title="在庫詳細"
        open={isViewModalOpen}
        onCancel={() => setIsViewModalOpen(false)}
        footer={null}
        width={400}
      >
        {viewItem && (
          <Descriptions column={1} bordered size="middle" labelStyle={{ color: '#888', fontWeight: 500, width: 120 }} contentStyle={{ fontWeight: 600, background: '#f6f8fa' }}>
            <Descriptions.Item label="ID">{viewItem.key}</Descriptions.Item>
            <Descriptions.Item label="商品名">{viewItem.name}</Descriptions.Item>
            <Descriptions.Item label="在庫数">{viewItem.stock}</Descriptions.Item>
            <Descriptions.Item label="価格 (円)">{viewItem.price.toLocaleString()}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </Card>
  );
};

export default InventoryList; 