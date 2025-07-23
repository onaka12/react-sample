import React, { useState, useEffect } from 'react';
import { Table, Typography, Card, Input, Button, Space, Dropdown, Menu, Modal, Form, Popconfirm, message } from 'antd';
import dayjs from 'dayjs';
import { useLocation } from 'react-router-dom';
import { EllipsisOutlined } from '@ant-design/icons';

const { Title } = Typography;

// 在庫一覧の型番と一致させる
const modelNos = ['P-001', 'P-002', 'P-003', 'P-004', 'P-005'];
const allDetails = modelNos.flatMap(modelNo =>
  Array.from({ length: 6 }).map((_, i) => {
    const orderNo = `PO-202406${modelNos.indexOf(modelNo) + 1}`;
    return {
      key: `${orderNo}-${(i + 1).toString().padStart(4, '0')}`,
      orderNo,
      detailNo: (i + 1).toString().padStart(4, '0'),
      modelNo,
      branchNo: String.fromCharCode(65 + (i % 3)),
      deliveryPlace: `倉庫${modelNos.indexOf(modelNo) + 1}`,
      stockStatus: i % 2 === 0 ? '入庫済' : '未入庫',
      costUnitPrice: 1000 + (i % 10) * 100,
    };
  })
);

const InventoryDetailList: React.FC = () => {
  const location = useLocation();
  const [searchOrderNo, setSearchOrderNo] = useState('');
  const [searchModelNo, setSearchModelNo] = useState('');
  const [data, setData] = useState(allDetails);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [form] = Form.useForm();
  const [registerCount, setRegisterCount] = useState(1);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const modelNo = params.get('modelNo');
    if (modelNo) setSearchModelNo(modelNo);
  }, [location.search]);

  // 編集・削除
  const handleEdit = (record: any) => {
    setEditingItem(record);
    form.setFieldsValue({ ...record });
    setIsModalOpen(true);
  };
  const handleDelete = (key: string) => {
    setData(prev => prev.filter(item => item.key !== key));
    message.success('削除しました');
  };
  const handleModalOk = () => {
    form.validateFields().then(values => {
      if (editingItem) {
        setData(prev => prev.map(item => item.key === editingItem.key ? { ...editingItem, ...values } : item));
      } else {
        const maxDetailNo = data.reduce((max, item) => Math.max(max, Number(item.detailNo)), 0);
        const newRows = Array.from({ length: registerCount }).map((_, i) => ({
          ...values,
          detailNo: (maxDetailNo + i + 1).toString().padStart(4, '0'),
          key: `${values.orderNo}-${(maxDetailNo + i + 1).toString().padStart(4, '0')}`,
          stockStatus: '未入庫',
        }));
        setData(prev => [...prev, ...newRows]);
      }
      setIsModalOpen(false);
    });
  };

  // 一括入庫
  const handleBulkStock = () => {
    Modal.confirm({
      title: `選択した${selectedRowKeys.length}件を入庫済にしますか？`,
      okText: 'はい',
      cancelText: 'いいえ',
      onOk: () => {
        setData(prev => prev.map(item =>
          selectedRowKeys.includes(item.key)
            ? { ...item, stockStatus: '入庫済' }
            : item
        ));
        setSelectedRowKeys([]);
      },
    });
  };
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

  // フィルタ処理
  const filteredData = data.filter(item => {
    if (searchOrderNo && !item.orderNo.toLowerCase().includes(searchOrderNo.toLowerCase())) return false;
    if (searchModelNo && !item.modelNo.toLowerCase().includes(searchModelNo.toLowerCase())) return false;
    return true;
  });

  const columns = [
    { title: '発注番号', dataIndex: 'orderNo', key: 'orderNo', sorter: (a: any, b: any) => a.orderNo.localeCompare(b.orderNo), onCell: () => ({ style: { minWidth: 110 } }) },
    { title: '明細番号', dataIndex: 'detailNo', key: 'detailNo', sorter: (a: any, b: any) => a.detailNo.localeCompare(b.detailNo), onCell: () => ({ style: { minWidth: 80 } }) },
    { title: '型番', dataIndex: 'modelNo', key: 'modelNo', sorter: (a: any, b: any) => a.modelNo.localeCompare(b.modelNo), onCell: () => ({ style: { minWidth: 100 } }) },
    { title: '枝番', dataIndex: 'branchNo', key: 'branchNo', sorter: (a: any, b: any) => a.branchNo.localeCompare(b.branchNo), onCell: () => ({ style: { minWidth: 60 } }) },
    { title: '納品先', dataIndex: 'deliveryPlace', key: 'deliveryPlace', onCell: () => ({ style: { minWidth: 100 } }) },
    { title: '入庫状況', dataIndex: 'stockStatus', key: 'stockStatus', onCell: () => ({ style: { minWidth: 80 } }) },
    { title: '原価単価', dataIndex: 'costUnitPrice', key: 'costUnitPrice', sorter: (a: any, b: any) => a.costUnitPrice - b.costUnitPrice, render: (v: number) => v.toLocaleString(), onCell: () => ({ style: { minWidth: 90 } }) },
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

  // 登録モーダル
  const handleAdd = () => {
    setEditingItem(null);
    setRegisterCount(1);
    form.resetFields();
    setIsModalOpen(true);
  };

  return (
    <Card style={{ borderRadius: 12, boxShadow: '0 2px 8px #f0f1f2', margin: 24, background: '#fff' }}>
      <Title level={4} style={{ marginBottom: 24 }}>在庫詳細</Title>
      <Button type="primary" style={{ marginBottom: 16 }} onClick={handleAdd}>登録</Button>
      {selectedRowKeys.length > 0 && (
        <Button type="primary" style={{ marginBottom: 12, marginLeft: 8 }} onClick={handleBulkStock}>
          選択した{selectedRowKeys.length}件を入庫する
        </Button>
      )}
      <Card style={{ marginBottom: 16, borderRadius: 8, boxShadow: '0 1px 4px #e0e0e0', background: '#fafbfc' }} bodyStyle={{ padding: 16 }}>
        <Space wrap align="center">
          <Input
            placeholder="発注番号"
            allowClear
            style={{ width: 160 }}
            value={searchOrderNo}
            onChange={e => setSearchOrderNo(e.target.value)}
          />
          <Input
            placeholder="型番"
            allowClear
            style={{ width: 140 }}
            value={searchModelNo}
            onChange={e => setSearchModelNo(e.target.value)}
          />
          <Button onClick={() => {
            setSearchOrderNo('');
            setSearchModelNo('');
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
        rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
      />
      <Modal
        title={editingItem ? '在庫詳細編集' : '在庫詳細登録'}
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={() => setIsModalOpen(false)}
        okText="保存"
        cancelText="キャンセル"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="orderNo" label="発注番号" rules={[{ required: true, message: '発注番号を入力してください' }]}> <Input /> </Form.Item>
          {editingItem && (
            <Form.Item name="detailNo" label="明細番号" rules={[{ required: true, message: '明細番号を入力してください' }]}> <Input /> </Form.Item>
          )}
          {!editingItem && (
            <Form.Item label="登録数" required>
              <Input type="number" min={1} value={registerCount} onChange={e => setRegisterCount(Number(e.target.value) || 1)} />
            </Form.Item>
          )}
          <Form.Item name="modelNo" label="型番" rules={[{ required: true, message: '型番を入力してください' }]}> <Input /> </Form.Item>
          <Form.Item name="branchNo" label="枝番" rules={[{ required: true, message: '枝番を入力してください' }]}> <Input /> </Form.Item>
          <Form.Item name="deliveryPlace" label="納品先" rules={[{ required: true, message: '納品先を入力してください' }]}> <Input /> </Form.Item>
          <Form.Item name="costUnitPrice" label="原価単価" rules={[{ required: true, message: '原価単価を入力してください' }]}> <Input /> </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default InventoryDetailList; 