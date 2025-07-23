import React, { useState } from 'react';
import { Table, Typography, Card, Input, DatePicker, InputNumber, Select, Button, Space, Modal, Form, Popconfirm, message, Dropdown, Menu } from 'antd';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { EllipsisOutlined } from '@ant-design/icons';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import * as Papa from 'papaparse';

const { Title } = Typography;

const statusOptions = [
  { value: '', label: 'すべて' },
  { value: '未発注', label: '未発注' },
  { value: '発注済', label: '発注済' },
];

const initialData = [
  { key: 'SRC-001', allocationSourceNo: 'SRC-001', orderDate: '2024-06-01', orderer: '山田太郎', status: '未発注', totalAmount: 120000 },
  { key: 'SRC-002', allocationSourceNo: 'SRC-002', orderDate: '2024-06-02', orderer: '佐藤花子', status: '発注済', totalAmount: 98000 },
  { key: 'SRC-003', allocationSourceNo: 'SRC-003', orderDate: '2024-06-03', orderer: '鈴木一郎', status: '未発注', totalAmount: 150000 },
  { key: 'SRC-004', allocationSourceNo: 'SRC-004', orderDate: '2024-06-04', orderer: '田中美咲', status: '発注済', totalAmount: 87000 },
  { key: 'SRC-005', allocationSourceNo: 'SRC-005', orderDate: '2024-06-05', orderer: '高橋健', status: '未発注', totalAmount: 112000 },
];

const InventoryList: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(initialData);
  // 検索条件state
  const [searchSource, setSearchSource] = useState('');
  const [searchOrderDateRange, setSearchOrderDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>([null, null]);
  const [searchTotalAmountRange, setSearchTotalAmountRange] = useState<[number | null, number | null]>([null, null]);
  const [searchOrderer, setSearchOrderer] = useState('');
  const [searchStatus, setSearchStatus] = useState('');
  // モーダル・フォーム
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [form] = Form.useForm();

  // フィルタ処理
  const filteredData = data.filter(item => {
    if (searchSource && !item.allocationSourceNo.toLowerCase().includes(searchSource.toLowerCase())) return false;
    if (searchOrderDateRange[0] && dayjs(item.orderDate).isBefore(searchOrderDateRange[0], 'day')) return false;
    if (searchOrderDateRange[1] && dayjs(item.orderDate).isAfter(searchOrderDateRange[1], 'day')) return false;
    if (searchTotalAmountRange[0] !== null && item.totalAmount < searchTotalAmountRange[0]!) return false;
    if (searchTotalAmountRange[1] !== null && item.totalAmount > searchTotalAmountRange[1]!) return false;
    if (searchOrderer && !item.orderer.toLowerCase().includes(searchOrderer.toLowerCase())) return false;
    if (searchStatus && item.status !== searchStatus) return false;
    return true;
  });

  // 操作カラム
  const handleEdit = (record: any) => {
    setEditingItem(record);
    let details = record.details;
    if (!details || !Array.isArray(details) || details.length === 0) {
      details = [{}];
    }
    form.setFieldsValue({
      ...record,
      orderDate: dayjs(record.orderDate),
      details,
    });
    setIsModalOpen(true);
  };
  const handleDelete = (key: string) => {
    setData(prev => prev.filter(item => item.key !== key));
    message.success('削除しました');
  };
  const handleView = (record: any) => {
    navigate(`/inventory-detail?source=${encodeURIComponent(record.allocationSourceNo)}`);
  };

  const menu = (record: any) => (
    <Menu>
      <Menu.Item key="view" onClick={() => handleView(record)}>
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

  const columns = [
    {
      title: '引当元番号',
      dataIndex: 'allocationSourceNo',
      key: 'allocationSourceNo',
      sorter: (a: any, b: any) => a.allocationSourceNo.localeCompare(b.allocationSourceNo),
      onCell: () => ({ style: { minWidth: 110 } })
    },
    {
      title: '発注日',
      dataIndex: 'orderDate',
      key: 'orderDate',
      sorter: (a: any, b: any) => a.orderDate.localeCompare(b.orderDate),
      onCell: () => ({ style: { minWidth: 100 } })
    },
    {
      title: '発注者',
      dataIndex: 'orderer',
      key: 'orderer',
      sorter: (a: any, b: any) => a.orderer.localeCompare(b.orderer),
      onCell: () => ({ style: { minWidth: 100 } })
    },
    {
      title: '発注ステータス',
      dataIndex: 'status',
      key: 'status',
      sorter: (a: any, b: any) => a.status.localeCompare(b.status),
      onCell: () => ({ style: { minWidth: 100 } })
    },
    {
      title: '合計金額',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      sorter: (a: any, b: any) => a.totalAmount - b.totalAmount,
      render: (v: number) => v.toLocaleString(),
      onCell: () => ({ style: { minWidth: 100 } })
    },
    {
      title: '操作',
      key: 'actions',
      fixed: 'right' as const,
      render: (_: any, record: any) => (
        <Dropdown overlay={menu(record)} trigger={["click"]} placement="bottomRight">
          <Button icon={<EllipsisOutlined />} shape="default" />
        </Dropdown>
      ),
    },
  ];

  // 登録・編集モーダル
  const handleAdd = () => {
    setEditingItem(null);
    form.resetFields();
    setIsModalOpen(true);
  };
  const handleModalOk = () => {
    form.validateFields().then(values => {
      const formatted = { ...values, orderDate: values.orderDate.format('YYYY-MM-DD') };
      if (editingItem) {
        setData(prev => prev.map(item => item.key === editingItem.key ? { ...editingItem, ...formatted } : item));
      } else {
        const newKey = `SRC-${Math.floor(Math.random() * 900 + 100)}`;
        setData(prev => [...prev, { key: newKey, ...formatted }]);
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
          key: row['引当元番号'] || `SRC-${Math.floor(Math.random() * 900 + 100)}`,
          allocationSourceNo: row['引当元番号'] || '',
          orderDate: row['発注日'] || '',
          orderer: row['発注者'] || '',
          status: row['発注ステータス'] || '',
          totalAmount: Number(row['合計金額']) || 0,
        }));
        setData(prev => [...prev, ...newRows]);
      },
    });
    e.target.value = '';
  };

  return (
    <Card style={{ borderRadius: 12, boxShadow: '0 2px 8px #f0f1f2', margin: 24, background: '#fff' }}>
      <Title level={4} style={{ marginBottom: 24 }}>発注一覧</Title>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <Button type="primary" onClick={handleAdd}>登録</Button>
        <label>
          <input type="file" accept=".csv" style={{ display: 'none' }} onChange={handleCsvImport} />
          <Button>CSVインポート</Button>
        </label>
      </div>
      <Card style={{ marginBottom: 16, borderRadius: 8, boxShadow: '0 1px 4px #e0e0e0', background: '#fafbfc' }} bodyStyle={{ padding: 16 }}>
        <Space wrap align="center">
          <Input
            placeholder="引当元番号"
            allowClear
            style={{ width: 160 }}
            value={searchSource}
            onChange={e => setSearchSource(e.target.value)}
          />
          <DatePicker.RangePicker
            value={searchOrderDateRange}
            onChange={range => setSearchOrderDateRange(range as [dayjs.Dayjs | null, dayjs.Dayjs | null])}
            style={{ width: 260 }}
            allowClear
            placeholder={["発注日(開始)", "発注日(終了)"]}
          />
          <InputNumber
            placeholder="合計金額(最小)"
            value={searchTotalAmountRange[0]}
            onChange={val => setSearchTotalAmountRange([val, searchTotalAmountRange[1]])}
            style={{ width: 140 }}
            min={0}
          />
          <InputNumber
            placeholder="合計金額(最大)"
            value={searchTotalAmountRange[1]}
            onChange={val => setSearchTotalAmountRange([searchTotalAmountRange[0], val])}
            style={{ width: 140 }}
            min={0}
          />
          <Input
            placeholder="発注者"
            allowClear
            style={{ width: 140 }}
            value={searchOrderer}
            onChange={e => setSearchOrderer(e.target.value)}
          />
          <Select
            placeholder="発注ステータス"
            style={{ width: 120 }}
            value={searchStatus}
            onChange={v => setSearchStatus(v)}
            allowClear
            options={statusOptions}
          />
          <Button onClick={() => {
            setSearchSource('');
            setSearchOrderDateRange([null, null]);
            setSearchTotalAmountRange([null, null]);
            setSearchOrderer('');
            setSearchStatus('');
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
        title={editingItem ? '発注編集' : '発注登録'}
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={() => setIsModalOpen(false)}
        okText="保存"
        cancelText="キャンセル"
        width={800}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="allocationSourceNo" label="引当元番号" rules={[{ required: true, message: '引当元番号を入力してください' }]}> <Input /> </Form.Item>
          <Form.Item name="orderDate" label="発注日" rules={[{ required: true, message: '発注日を入力してください' }]}> <DatePicker style={{ width: '100%' }} /> </Form.Item>
          <Form.Item name="orderer" label="発注者" rules={[{ required: true, message: '発注者を入力してください' }]}> <Input /> </Form.Item>
          <Form.Item name="status" label="発注ステータス" rules={[{ required: true, message: '発注ステータスを選択してください' }]}> <Select options={statusOptions.filter(o => o.value)} /> </Form.Item>
          <Form.Item name="totalAmount" label="合計金額" rules={[{ required: true, message: '合計金額を入力してください' }]}> <InputNumber min={0} style={{ width: '100%' }} /> </Form.Item>
          {editingItem === null && (
            <Form.List name="details" initialValue={[{}]}>
              {(fields, { add, remove }) => (
                <>
                  <div style={{ fontWeight: 600, margin: '16px 0 8px' }}>明細</div>
                  <Table
                    dataSource={fields}
                    pagination={false}
                    rowKey="key"
                    size="small"
                    columns={[
                      { title: '型番', dataIndex: 'modelNo', render: (_, __, idx) => (
                          <Form.Item name={[idx, 'modelNo']} rules={[{ required: true, message: '型番' }]} noStyle>
                            <Input placeholder="型番" />
                          </Form.Item>
                        ) },
                      { title: '枝番', dataIndex: 'branchNo', render: (_, __, idx) => (
                          <Form.Item name={[idx, 'branchNo']} rules={[{ required: true, message: '枝番' }]} noStyle>
                            <Input placeholder="枝番" />
                          </Form.Item>
                        ) },
                      { title: '納品先', dataIndex: 'deliveryPlace', render: (_, __, idx) => (
                          <Form.Item name={[idx, 'deliveryPlace']} rules={[{ required: true, message: '納品先' }]} noStyle>
                            <Input placeholder="納品先" />
                          </Form.Item>
                        ) },
                      { title: '原価単価', dataIndex: 'costUnitPrice', render: (_, __, idx) => (
                          <Form.Item name={[idx, 'costUnitPrice']} rules={[{ required: true, message: '原価単価' }]} noStyle>
                            <InputNumber min={0} style={{ width: 90 }} placeholder="原価単価" />
                          </Form.Item>
                        ) },
                      { title: '発注数', dataIndex: 'orderQty', render: (_, __, idx) => (
                          <Form.Item name={[idx, 'orderQty']} rules={[{ required: true, message: '発注数' }]} noStyle>
                            <InputNumber min={1} style={{ width: 70 }} placeholder="発注数" />
                          </Form.Item>
                        ) },
                      { title: '引当済', dataIndex: 'allocated', render: (_, __, idx) => (
                          <Form.Item name={[idx, 'allocated']} rules={[{ required: true, message: '引当済' }]} noStyle>
                            <InputNumber min={0} style={{ width: 70 }} placeholder="引当済" />
                          </Form.Item>
                        ) },
                      { title: '予約済', dataIndex: 'reserved', render: (_, __, idx) => (
                          <Form.Item name={[idx, 'reserved']} rules={[{ required: true, message: '予約済' }]} noStyle>
                            <InputNumber min={0} style={{ width: 70 }} placeholder="予約済" />
                          </Form.Item>
                        ) },
                      { title: '', dataIndex: 'actions', render: (_, __, idx) => (
                          <Button icon={<MinusCircleOutlined />} onClick={() => remove(idx)} size="small" />
                        ) },
                    ]}
                    footer={() => (
                      <Button icon={<PlusOutlined />} onClick={() => add()} size="small">明細を追加</Button>
                    )}
                  />
                </>
              )}
            </Form.List>
          )}
        </Form>
      </Modal>
    </Card>
  );
};

export default InventoryList; 