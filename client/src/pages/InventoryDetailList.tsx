import React, { useState, useEffect } from 'react';
import { Table, Typography, Card, Input, DatePicker, InputNumber, Select, Button, Space, Dropdown, Menu, Modal, Form, Popconfirm, message } from 'antd';
import dayjs from 'dayjs';
import { useLocation } from 'react-router-dom';
import { EllipsisOutlined } from '@ant-design/icons';

const { Title } = Typography;

// ダミー明細データ（引当元番号ごとに明細番号を1から連番で割り振る）
const allocationSources = ['SRC-001', 'SRC-002', 'SRC-003', 'SRC-004', 'SRC-005'];
const allDetails = allocationSources.flatMap(srcNo =>
  Array.from({ length: 6 }).map((_, i) => ({
    key: `${srcNo}-${(i + 1).toString().padStart(4, '0')}`,
    allocationSourceNo: srcNo,
    detailNo: (i + 1).toString().padStart(4, '0'),
    modelNo: `MDL-${srcNo.slice(-3)}${(i % 10) + 1}`,
    branchNo: String.fromCharCode(65 + (i % 3)),
    deliveryPlace: `倉庫${srcNo.slice(-1)}`,
    stockStatus: i % 2 === 0 ? '入庫済' : '未入庫',
    costUnitPrice: 1000 + (i % 10) * 100,
    orderNo: `PO-202406${srcNo.slice(-1)}${(i % 10) + 1}`,
    orderQty: 10 + (i % 10),
    allocated: 5 + (i % 10),
    reserved: 2 + (i % 10),
    orderDate: dayjs('2024-06-01').add(i, 'day').format('YYYY-MM-DD'),
  }))
);

const menu = (record: any) => (
  <Menu>
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
    title: '明細番号',
    dataIndex: 'detailNo',
    key: 'detailNo',
    sorter: (a: any, b: any) => a.detailNo.localeCompare(b.detailNo),
    onCell: () => ({ style: { minWidth: 80 } })
  },
  {
    title: '型番',
    dataIndex: 'modelNo',
    key: 'modelNo',
    sorter: (a: any, b: any) => a.modelNo.localeCompare(b.modelNo),
    onCell: () => ({ style: { minWidth: 80 } })
  },
  { title: '枝番', dataIndex: 'branchNo', key: 'branchNo', onCell: () => ({ style: { minWidth: 60 } }) },
  { title: '納品先', dataIndex: 'deliveryPlace', key: 'deliveryPlace', onCell: () => ({ style: { minWidth: 100 } }) },
  { title: '入庫状況', dataIndex: 'stockStatus', key: 'stockStatus', onCell: () => ({ style: { minWidth: 80 } }) },
  {
    title: '原価単価',
    dataIndex: 'costUnitPrice',
    key: 'costUnitPrice',
    sorter: (a: any, b: any) => a.costUnitPrice - b.costUnitPrice,
    render: (v: number) => v.toLocaleString(),
    onCell: () => ({ style: { minWidth: 90 } })
  },
  { title: '発注番号', dataIndex: 'orderNo', key: 'orderNo', onCell: () => ({ style: { minWidth: 120 } }) },
  {
    title: '発注数',
    dataIndex: 'orderQty',
    key: 'orderQty',
    sorter: (a: any, b: any) => a.orderQty - b.orderQty,
    onCell: () => ({ style: { minWidth: 80 } })
  },
  {
    title: '引当済',
    dataIndex: 'allocated',
    key: 'allocated',
    sorter: (a: any, b: any) => a.allocated - b.allocated,
    onCell: () => ({ style: { minWidth: 80 } })
  },
  {
    title: '予約済',
    dataIndex: 'reserved',
    key: 'reserved',
    sorter: (a: any, b: any) => a.reserved - b.reserved,
    onCell: () => ({ style: { minWidth: 80 } })
  },
  {
    title: '発注日',
    dataIndex: 'orderDate',
    key: 'orderDate',
    sorter: (a: any, b: any) => a.orderDate.localeCompare(b.orderDate),
    onCell: () => ({ style: { minWidth: 100 } })
  },
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

const InventoryDetailList: React.FC = () => {
  const location = useLocation();
  // 検索条件state
  const [searchSource, setSearchSource] = useState('');
  const [searchOrderDateRange, setSearchOrderDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>([null, null]);
  const [data, setData] = useState(allDetails);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [form] = Form.useForm();

  // 編集・削除
  const handleEdit = (record: any) => {
    setEditingItem(record);
    form.setFieldsValue({ ...record, orderDate: dayjs(record.orderDate) });
    setIsModalOpen(true);
  };
  const handleDelete = (key: string) => {
    setData(prev => prev.filter(item => item.key !== key));
    message.success('削除しました');
  };
  const handleModalOk = () => {
    form.validateFields().then(values => {
      setData(prev => prev.map(item => item.key === editingItem.key ? { ...editingItem, ...values, orderDate: values.orderDate.format('YYYY-MM-DD') } : item));
      setIsModalOpen(false);
    });
  };

  // クエリパラメータからsourceを取得し、初回のみセット
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const source = params.get('source');
    if (source) setSearchSource(source);
  }, [location.search]);

  // フィルタ処理
  const filteredData = data.filter(item => {
    if (searchSource && !item.allocationSourceNo.toLowerCase().includes(searchSource.toLowerCase())) return false;
    if (searchOrderDateRange[0] && dayjs(item.orderDate).isBefore(searchOrderDateRange[0], 'day')) return false;
    if (searchOrderDateRange[1] && dayjs(item.orderDate).isAfter(searchOrderDateRange[1], 'day')) return false;
    return true;
  });

  return (
    <Card style={{ borderRadius: 12, boxShadow: '0 2px 8px #f0f1f2', margin: 24, background: '#fff' }}>
      <Title level={4} style={{ marginBottom: 24 }}>発注詳細</Title>
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
          <Button onClick={() => {
            setSearchSource('');
            setSearchOrderDateRange([null, null]);
          }}>条件クリア</Button>
        </Space>
      </Card>
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="key"
        bordered
        pagination={{ pageSize: 10, showSizeChanger: true, pageSizeOptions: [10, 20, 50] }}
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
        title={editingItem ? '明細編集' : '明細登録'}
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={() => setIsModalOpen(false)}
        okText="保存"
        cancelText="キャンセル"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="modelNo" label="型番" rules={[{ required: true, message: '型番を入力してください' }]}> <Input /> </Form.Item>
          <Form.Item name="branchNo" label="枝番" rules={[{ required: true, message: '枝番を入力してください' }]}> <Input /> </Form.Item>
          <Form.Item name="deliveryPlace" label="納品先" rules={[{ required: true, message: '納品先を入力してください' }]}> <Input /> </Form.Item>
          <Form.Item name="costUnitPrice" label="原価単価" rules={[{ required: true, message: '原価単価を入力してください' }]}> <InputNumber min={0} style={{ width: '100%' }} /> </Form.Item>
          <Form.Item name="orderQty" label="発注数" rules={[{ required: true, message: '発注数を入力してください' }]}> <InputNumber min={1} style={{ width: '100%' }} /> </Form.Item>
          <Form.Item name="allocated" label="引当済" rules={[{ required: true, message: '引当済を入力してください' }]}> <InputNumber min={0} style={{ width: '100%' }} /> </Form.Item>
          <Form.Item name="reserved" label="予約済" rules={[{ required: true, message: '予約済を入力してください' }]}> <InputNumber min={0} style={{ width: '100%' }} /> </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default InventoryDetailList; 