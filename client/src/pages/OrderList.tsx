import React, { useState } from 'react';
import { Table, Typography, Button, Modal, Form, Input, InputNumber, Space, Dropdown, Menu, DatePicker, Tooltip, Card, Descriptions, Row, Col, Divider } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import './OrderList.css';

const { Title } = Typography;
const { Search } = Input;

interface OrderItem {
  key: number;
  orderId: string;
  customer: string;
  item: string;
  quantity: number;
  date: string;
}

const initialData: OrderItem[] = [
  { key: 1, orderId: 'ORD-001', customer: '山田太郎', item: '商品A', quantity: 10, date: '2024-06-01' },
  { key: 2, orderId: 'ORD-002', customer: '佐藤花子', item: '商品B', quantity: 5, date: '2024-06-02' },
  { key: 3, orderId: 'ORD-003', customer: '鈴木一郎', item: '商品C', quantity: 2, date: '2024-06-03' },
];

const OrderList: React.FC = () => {
  const [data, setData] = useState<OrderItem[]>(initialData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<OrderItem | null>(null);
  const [form] = Form.useForm();
  const [viewItem, setViewItem] = useState<OrderItem | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  // Remove filters state and use only AntD's built-in filter logic

  const handleDelete = (key: number) => {
    setData(data.filter(item => item.key !== key));
  };

  const handleEdit = (item: OrderItem) => {
    setEditingItem(item);
    form.setFieldsValue({ ...item, date: dayjs(item.date) });
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingItem(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      const formattedValues = { ...values, date: values.date.format('YYYY-MM-DD') };
      if (editingItem) {
        setData(data.map(item => item.key === editingItem.key ? { ...editingItem, ...formattedValues } : item));
      } else {
        const newKey = data.length ? Math.max(...data.map(i => i.key)) + 1 : 1;
        setData([...data, { key: newKey, ...formattedValues }]);
      }
      setIsModalOpen(false);
    });
  };

  const handleView = (item: OrderItem) => {
    setViewItem(item);
    setIsViewModalOpen(true);
  };

  const menu = (record: OrderItem) => (
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
  const filteredData = data.filter(item => item.customer.includes(searchText) || item.item.includes(searchText));

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys: React.Key[]) => setSelectedRowKeys(selectedKeys),
  };

  const getColumnSearchProps = (dataIndex: keyof OrderItem, label: string) => ({
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
    onFilter: (value: string | number | boolean, record: OrderItem) => {
      return record[dataIndex].toString().includes(value as string);
    },
  });

  const getNumberRangeFilterProps = (dataIndex: keyof OrderItem, label: string) => ({
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
    onFilter: (value: string | number | boolean, record: OrderItem) => {
      const [min, max] = Array.isArray(value) ? value : [undefined, undefined];
      const v = record[dataIndex] as number;
      const minVal = min === undefined ? -Infinity : Number(min);
      const maxVal = max === undefined ? Infinity : Number(max);
      return v >= minVal && v <= maxVal;
    },
  });

  const getDateRangeFilterProps = (dataIndex: keyof OrderItem, label: string) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
      <div style={{ padding: 8 }}>
        <DatePicker.RangePicker
          value={selectedKeys[0]}
          onChange={val => setSelectedKeys([val])}
          style={{ marginBottom: 8, width: 220 }}
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
    filterIcon: (filtered: boolean) => <span style={{ color: filtered ? '#1677ff' : undefined }}>📅</span>,
    onFilter: (value: string | number | boolean, record: OrderItem) => {
      if (!Array.isArray(value) || value.length !== 1 || !value[0]) return true;
      const [range] = value;
      if (!range || range.length !== 2) return true;
      const [start, end] = range;
      const date = record[dataIndex];
      return (!start || date >= start.format('YYYY-MM-DD')) && (!end || date <= end.format('YYYY-MM-DD'));
    },
  });

  const getNumberFilterProps = (dataIndex: keyof OrderItem, label: string) => ({
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
    onFilter: (value: string | number | boolean, record: OrderItem) => {
      // Extract number part from orderId (e.g., ORD-001 -> 1)
      const num = Number(record.orderId.replace(/\D/g, ''));
      return num === value;
    },
  });

  const columns = [
    {
      title: '注文ID',
      dataIndex: 'orderId',
      key: 'orderId',
      ...getNumberFilterProps('orderId', '注文ID'),
      sorter: (a: OrderItem, b: OrderItem) => {
        const numA = Number(a.orderId.replace(/\D/g, ''));
        const numB = Number(b.orderId.replace(/\D/g, ''));
        return numA - numB;
      },
    },
    {
      title: '顧客名',
      dataIndex: 'customer',
      key: 'customer',
      ...getColumnSearchProps('customer', '顧客名'),
    },
    {
      title: '商品名',
      dataIndex: 'item',
      key: 'item',
      ...getColumnSearchProps('item', '商品名'),
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      key: 'quantity',
      ...getNumberRangeFilterProps('quantity', '数量'),
      sorter: (a: OrderItem, b: OrderItem) => a.quantity - b.quantity,
    },
    {
      title: '注文日',
      dataIndex: 'date',
      key: 'date',
      ...getDateRangeFilterProps('date', '注文日'),
      sorter: (a: OrderItem, b: OrderItem) => a.date.localeCompare(b.date),
    },
    {
      title: '',
      key: 'more',
      width: 48,
      render: (_: any, record: OrderItem) => (
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
        <Title level={4} style={{ marginBottom: 24 }}>発注情報一覧</Title>
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <Button type="primary" onClick={handleAdd}>
            登録
          </Button>
          <Search
            placeholder="顧客名・商品名で検索"
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
        title={editingItem ? '発注情報編集' : '発注情報登録'}
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={() => setIsModalOpen(false)}
        okText="保存"
        cancelText="キャンセル"
        width={editingItem ? 600 : 400}
        bodyStyle={{ padding: editingItem ? 0 : undefined }}
      >
        {editingItem ? (
          <Row gutter={0} style={{ minHeight: 260 }}>
            <Col xs={24} md={11} style={{ background: '#f6f8fa', borderRight: '1px solid #f0f0f0', padding: 20, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ fontWeight: 600, marginBottom: 12, color: '#555' }}>現在の値</div>
              <Descriptions column={1} size="small" labelStyle={{ color: '#888', fontWeight: 500 }} contentStyle={{ fontWeight: 600 }}>
                <Descriptions.Item label="注文ID">{editingItem.orderId}</Descriptions.Item>
                <Descriptions.Item label="顧客名">{editingItem.customer}</Descriptions.Item>
                <Descriptions.Item label="商品名">{editingItem.item}</Descriptions.Item>
                <Descriptions.Item label="数量">{editingItem.quantity}</Descriptions.Item>
                <Descriptions.Item label="注文日">{editingItem.date}</Descriptions.Item>
              </Descriptions>
            </Col>
            <Col xs={24} md={13} style={{ padding: 24 }}>
              <div style={{ fontWeight: 600, marginBottom: 12, color: '#555' }}>新しい値</div>
              <Form form={form} layout="vertical">
                <Form.Item name="orderId" label="注文ID" rules={[{ required: true, message: '注文IDを入力してください' }]}> <Input /> </Form.Item>
                <Form.Item name="customer" label="顧客名" rules={[{ required: true, message: '顧客名を入力してください' }]}> <Input /> </Form.Item>
                <Form.Item name="item" label="商品名" rules={[{ required: true, message: '商品名を入力してください' }]}> <Input /> </Form.Item>
                <Form.Item name="quantity" label="数量" rules={[{ required: true, message: '数量を入力してください' }]}> <InputNumber min={1} style={{ width: '100%' }} /> </Form.Item>
                <Form.Item name="date" label="注文日" rules={[{ required: true, message: '注文日を入力してください' }]}> <DatePicker style={{ width: '100%' }} /> </Form.Item>
              </Form>
            </Col>
          </Row>
        ) : (
          <Form form={form} layout="vertical">
            <Form.Item name="orderId" label="注文ID" rules={[{ required: true, message: '注文IDを入力してください' }]}> <Input /> </Form.Item>
            <Form.Item name="customer" label="顧客名" rules={[{ required: true, message: '顧客名を入力してください' }]}> <Input /> </Form.Item>
            <Form.Item name="item" label="商品名" rules={[{ required: true, message: '商品名を入力してください' }]}> <Input /> </Form.Item>
            <Form.Item name="quantity" label="数量" rules={[{ required: true, message: '数量を入力してください' }]}> <InputNumber min={1} style={{ width: '100%' }} /> </Form.Item>
            <Form.Item name="date" label="注文日" rules={[{ required: true, message: '注文日を入力してください' }]}> <DatePicker style={{ width: '100%' }} /> </Form.Item>
          </Form>
        )}
      </Modal>
      <Modal
        title="発注情報詳細"
        open={isViewModalOpen}
        onCancel={() => setIsViewModalOpen(false)}
        footer={null}
        width={420}
      >
        {viewItem && (
          <Descriptions column={1} bordered size="middle" labelStyle={{ color: '#888', fontWeight: 500, width: 120 }} contentStyle={{ fontWeight: 600, background: '#f6f8fa' }}>
            <Descriptions.Item label="注文ID">{viewItem.orderId}</Descriptions.Item>
            <Descriptions.Item label="顧客名">{viewItem.customer}</Descriptions.Item>
            <Descriptions.Item label="商品名">{viewItem.item}</Descriptions.Item>
            <Descriptions.Item label="数量">{viewItem.quantity}</Descriptions.Item>
            <Descriptions.Item label="注文日">{viewItem.date}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </Card>
  );
};

export default OrderList; 