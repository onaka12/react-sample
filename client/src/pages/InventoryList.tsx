import React, { useState } from 'react';
import { Table, Typography, Button, Popconfirm, Modal, Form, Input, InputNumber, Space, Card, Tag, Descriptions, DatePicker, Select } from 'antd';
import { SearchOutlined, EditOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title } = Typography;

interface InventoryItem {
  key: number;
  orderId: string;
  name: string;
  quantity: number;
  date: string;
  status: '進行中' | '完了' | '未着手';
}

const initialData: InventoryItem[] = [
  { key: 1, orderId: 'PUR-001', name: '発注A', quantity: 120, date: '2024-06-01', status: '進行中' },
  { key: 2, orderId: 'PUR-002', name: '発注B', quantity: 80, date: '2024-06-02', status: '完了' },
  { key: 3, orderId: 'PUR-003', name: '発注C', quantity: 45, date: '2024-05-15', status: '未着手' },
];

const InventoryList: React.FC = () => {
  const [data, setData] = useState<InventoryItem[]>(initialData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [form] = Form.useForm();
  const [viewItem, setViewItem] = useState<InventoryItem | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  // 検索条件のstate
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [monthFilter, setMonthFilter] = useState('');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>([null, null]);

  const handleDelete = (key: number) => {
    setData(prev => prev.filter(item => item.key !== key));
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

  // 検索条件でフィルタ
  const filteredData = data.filter(item => {
    // フリーワード（発注名・発注ID）
    if (searchText) {
      const text = searchText.toLowerCase();
      if (!(item.name.toLowerCase().includes(text) || item.orderId.toLowerCase().includes(text))) return false;
    }
    // ステータス
    if (statusFilter && item.status !== statusFilter) return false;
    // 月フィルタ
    if (monthFilter) {
      const now = new Date();
      const ym = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      if (!item.date.startsWith(ym)) return false;
    }
    // 日付範囲
    if (dateRange[0] && dayjs(item.date).isBefore(dateRange[0], 'day')) return false;
    if (dateRange[1] && dayjs(item.date).isAfter(dateRange[1], 'day')) return false;
    return true;
  });

  const handleView = (record: InventoryItem) => {
    setViewItem(record);
    setIsViewModalOpen(true);
  };

  const statusColor = (status: string) => {
    if (status === '進行中') return 'blue';
    if (status === '完了') return 'green';
    if (status === '未着手') return 'default';
    return 'default';
  };
  const columns = [
    {
      title: 'ステータス',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <Tag color={statusColor(status)}>{status}</Tag>,
      width: 100,
    },
    {
      title: '発注ID',
      dataIndex: 'orderId',
      key: 'orderId',
      sorter: (a: InventoryItem, b: InventoryItem) => {
        const numA = Number(a.orderId.replace(/\D/g, ''));
        const numB = Number(b.orderId.replace(/\D/g, ''));
        return numA - numB;
      },
      width: 120,
    },
    {
      title: '発注名',
      dataIndex: 'name',
      key: 'name',
      width: 120,
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      key: 'quantity',
      sorter: (a: InventoryItem, b: InventoryItem) => a.quantity - b.quantity,
      width: 80,
    },
    {
      title: '発注日',
      dataIndex: 'date',
      key: 'date',
      sorter: (a: InventoryItem, b: InventoryItem) => a.date.localeCompare(b.date),
      width: 120,
    },
    {
      title: '操作',
      key: 'more',
      width: 160,
      render: (_: any, record: InventoryItem) => (
        <Space>
          <Button icon={<EyeOutlined />} size="small" onClick={() => handleView(record)}>
            詳細
          </Button>
          <Button icon={<EditOutlined />} size="small" onClick={() => handleEdit(record)}>
            編集
          </Button>
          <Popconfirm title="本当に削除しますか？" onConfirm={() => handleDelete(record.key)} okText="はい" cancelText="いいえ">
            <Button icon={<DeleteOutlined />} size="small" danger>
              削除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const renderViewModal = () => (
    <Modal
      title="発注詳細"
      open={isViewModalOpen}
      onCancel={() => setIsViewModalOpen(false)}
      footer={null}
      width={400}
    >
      {viewItem && (
        <Descriptions column={1} bordered size="middle" labelStyle={{ color: '#888', fontWeight: 500, width: 120 }} contentStyle={{ fontWeight: 600, background: '#f6f8fa' }}>
          <Descriptions.Item label="発注ID">{viewItem.orderId}</Descriptions.Item>
          <Descriptions.Item label="発注名">{viewItem.name}</Descriptions.Item>
          <Descriptions.Item label="数量">{viewItem.quantity}</Descriptions.Item>
          <Descriptions.Item label="発注日">{viewItem.date}</Descriptions.Item>
          <Descriptions.Item label="ステータス">{viewItem.status}</Descriptions.Item>
        </Descriptions>
      )}
    </Modal>
  );

  return (
    <>
      <Title level={4} style={{ marginBottom: 24 }}>発注一覧</Title>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, alignItems: 'center' }}>
        <Button type="primary" style={{ marginBottom: 16 }} onClick={handleAdd}>
          登録
        </Button>
        <Card style={{ marginBottom: 16, borderRadius: 8, boxShadow: '0 1px 4px #e0e0e0', background: '#fafbfc' }} bodyStyle={{ padding: 16 }}>
          <Space wrap align="center">
            <Input
              placeholder="フリーワード"
              allowClear
              prefix={<SearchOutlined />}
              style={{ width: 180 }}
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
            />
            <Select
              placeholder="ステータス"
              style={{ width: 120 }}
              value={statusFilter || undefined}
              onChange={v => setStatusFilter(v)}
              allowClear
              options={['進行中', '完了', '未着手'].map(s => ({ value: s, label: s }))}
            />
            <Button type={monthFilter === '今月' ? 'primary' : 'default'} onClick={() => setMonthFilter('今月')}>今月</Button>
            <Button type={monthFilter === '先月' ? 'primary' : 'default'} onClick={() => setMonthFilter('先月')}>先月</Button>
            <DatePicker.RangePicker
              value={dateRange}
              onChange={range => setDateRange(range as [dayjs.Dayjs | null, dayjs.Dayjs | null])}
              style={{ width: 260 }}
              allowClear
            />
            <Button onClick={() => { setStatusFilter(''); setMonthFilter(''); setSearchText(''); setDateRange([null, null]); }}>条件クリア</Button>
          </Space>
        </Card>
        {selectedRowKeys.length > 0 && (
          <Button type="primary" style={{ marginBottom: 12 }} onClick={() => {
            Modal.confirm({
              title: `選択した${selectedRowKeys.length}件を応諾しますか？`,
              okText: 'はい',
              cancelText: 'いいえ',
              onOk: () => {
                setData(prev => prev.map(item => selectedRowKeys.includes(item.key) ? { ...item, status: '完了' } : item));
                setSelectedRowKeys([]);
              },
            });
          }}>
            選択した{selectedRowKeys.length}件を応諾
          </Button>
        )}
      </div>
      <Table
        columns={columns}
        dataSource={filteredData}
        pagination={{ position: ['bottomCenter'], pageSize: 10, showSizeChanger: true, pageSizeOptions: [10, 20, 50] }}
        rowKey="key"
        bordered
        size="middle"
        rowClassName={(_, idx) => idx % 2 === 0 ? 'modern-table-row-even' : 'modern-table-row-odd'}
        style={{ borderRadius: 12, marginTop: 8 }}
        scroll={{ x: true }}
        rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
        sticky
        components={{
          header: {
            cell: (props: any) => <th {...props} style={{ ...props.style, background: '#f5f6fa', fontWeight: 700, fontSize: 15 }} />,
          },
        }}
      />
      <Modal
        title={editingItem ? '発注編集' : '発注登録'}
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={() => setIsModalOpen(false)}
        okText="保存"
        cancelText="キャンセル"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="orderId" label="発注ID" rules={[{ required: true, message: '発注IDを入力してください' }]}> <Input /> </Form.Item>
          <Form.Item name="name" label="発注名" rules={[{ required: true, message: '発注名を入力してください' }]}> <Input /> </Form.Item>
          <Form.Item name="quantity" label="数量" rules={[{ required: true, message: '数量を入力してください' }]}> <InputNumber min={0} style={{ width: '100%' }} /> </Form.Item>
          <Form.Item name="date" label="発注日" rules={[{ required: true, message: '発注日を入力してください' }]}> <DatePicker style={{ width: '100%' }} /> </Form.Item>
          <Form.Item name="status" label="ステータス" rules={[{ required: true, message: 'ステータスを選択してください' }]}> <Input /> </Form.Item>
        </Form>
      </Modal>
      {renderViewModal()}
    </>
  );
};

export default InventoryList; 