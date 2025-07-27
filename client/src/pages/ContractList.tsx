import React, { useState } from 'react';
import { Card, Table, Typography, Input, Button, Space, Tag, DatePicker, InputNumber, Select, Menu, Dropdown, Modal, Form } from 'antd';
import { SearchOutlined, ImportOutlined, DownloadOutlined, EllipsisOutlined, EditOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;
const { Search } = Input;

interface ContractData {
  key: string;
  contractNo: string;
  contractDate: string;
  contractAmount: number;
  manager: string;
  customerName: string;
  status: 'active' | 'completed' | 'pending';
  memo: string;
}

// ダミーデータを生成
const generateContractData = (): ContractData[] => {
  return Array.from({ length: 20 }).map((_, i) => ({
    key: (i + 1).toString(),
    contractNo: `CT-2024${(i + 1).toString().padStart(4, '0')}`,
    contractDate: dayjs().subtract(Math.floor(Math.random() * 365), 'day').format('YYYY-MM-DD'),
    contractAmount: Math.floor(Math.random() * 10000000) + 1000000,
    manager: ['田中太郎', '佐藤花子', '鈴木一郎', '高橋美咲', '伊藤健太'][Math.floor(Math.random() * 5)],
    customerName: `株式会社サンプル${i + 1}`,
    status: ['active', 'completed', 'pending'][Math.floor(Math.random() * 3)] as ContractData['status'],
    memo: `メモ${i + 1}`,
  }));
};

const ContractList: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<ContractData[]>(generateContractData());
  const [searchText, setSearchText] = useState('');
  
  // 検索条件用のstate
  const [searchContractNo, setSearchContractNo] = useState('');
  const [searchContractDateRange, setSearchContractDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>([null, null]);
  const [searchContractAmountRange, setSearchContractAmountRange] = useState<[number | null, number | null]>([null, null]);
  const [searchManager, setSearchManager] = useState('');
  const [searchCustomerName, setSearchCustomerName] = useState('');
  const [searchStatus, setSearchStatus] = useState<string>('');
  
  // メモ編集用のstate
  const [isMemoModalOpen, setIsMemoModalOpen] = useState(false);
  const [editingContract, setEditingContract] = useState<ContractData | null>(null);
  const [memoForm] = Form.useForm();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'green';
      case 'completed': return 'blue';
      case 'pending': return 'orange';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return '進行中';
      case 'completed': return '完了';
      case 'pending': return '保留';
      default: return status;
    }
  };

  const handleViewDetails = (contractNo: string) => {
    navigate(`/contract-detail?contractNo=${contractNo}`);
  };

  const handleEditMemo = (record: ContractData) => {
    setEditingContract(record);
    memoForm.setFieldsValue({ memo: record.memo });
    setIsMemoModalOpen(true);
  };

  const handleMemoModalOk = () => {
    memoForm.validateFields().then(values => {
      if (editingContract) {
        setData(prev => prev.map(item => 
          item.key === editingContract.key 
            ? { ...item, memo: values.memo }
            : item
        ));
      }
      setIsMemoModalOpen(false);
      setEditingContract(null);
      memoForm.resetFields();
    });
  };

  const handleMemoModalCancel = () => {
    setIsMemoModalOpen(false);
    setEditingContract(null);
    memoForm.resetFields();
  };

  const menu = (record: ContractData) => (
    <Menu>
      <Menu.Item key="details" onClick={() => handleViewDetails(record.contractNo)}>
        明細
      </Menu.Item>
      <Menu.Item key="editMemo" icon={<EditOutlined />} onClick={() => handleEditMemo(record)}>
        メモを編集
      </Menu.Item>
    </Menu>
  );

  const columns: ColumnsType<ContractData> = [
    {
      title: '成約番号',
      dataIndex: 'contractNo',
      key: 'contractNo',
      sorter: (a, b) => a.contractNo.localeCompare(b.contractNo),
      onCell: () => ({ style: { minWidth: 120 } }),
    },
    {
      title: '成約日',
      dataIndex: 'contractDate',
      key: 'contractDate',
      sorter: (a, b) => new Date(a.contractDate).getTime() - new Date(b.contractDate).getTime(),
      onCell: () => ({ style: { minWidth: 100 } }),
    },
    {
      title: '成約金額',
      dataIndex: 'contractAmount',
      key: 'contractAmount',
      render: (value: number) => `¥${value.toLocaleString()}`,
      sorter: (a, b) => a.contractAmount - b.contractAmount,
      onCell: () => ({ style: { minWidth: 120 } }),
    },
    {
      title: '担当者',
      dataIndex: 'manager',
      key: 'manager',
      onCell: () => ({ style: { minWidth: 100 } }),
    },
    {
      title: '顧客名',
      dataIndex: 'customerName',
      key: 'customerName',
      onCell: () => ({ style: { minWidth: 150 } }),
    },
    {
      title: 'ステータス',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
      onCell: () => ({ style: { minWidth: 100 } }),
    },
    {
      title: 'メモ',
      dataIndex: 'memo',
      key: 'memo',
      onCell: () => ({ style: { minWidth: 150 } }),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Dropdown overlay={menu(record)} trigger={['click']}>
          <Button type="text" icon={<EllipsisOutlined />} />
        </Dropdown>
      ),
      onCell: () => ({ style: { minWidth: 80 } }),
    },
  ];

  const filteredData = data.filter(item => {
    // 成約番号 部分一致
    if (searchContractNo && !item.contractNo.toLowerCase().includes(searchContractNo.toLowerCase())) return false;
    // 成約日 範囲
    if (searchContractDateRange[0] && dayjs(item.contractDate).isBefore(searchContractDateRange[0], 'day')) return false;
    if (searchContractDateRange[1] && dayjs(item.contractDate).isAfter(searchContractDateRange[1], 'day')) return false;
    // 成約金額 範囲
    if (searchContractAmountRange[0] !== null && item.contractAmount < searchContractAmountRange[0]!) return false;
    if (searchContractAmountRange[1] !== null && item.contractAmount > searchContractAmountRange[1]!) return false;
    // 担当者 部分一致
    if (searchManager && !item.manager.toLowerCase().includes(searchManager.toLowerCase())) return false;
    // 顧客名 部分一致
    if (searchCustomerName && !item.customerName.toLowerCase().includes(searchCustomerName.toLowerCase())) return false;
    // ステータス 完全一致
    if (searchStatus && item.status !== searchStatus) return false;
    return true;
  });

  return (
    <Card style={{ borderRadius: 12, boxShadow: '0 2px 8px #f0f1f2', margin: 24, background: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={4} style={{ margin: 0 }}>成約一覧</Title>
        <Space>
          <Button type="primary" icon={<ImportOutlined />}>
            インポート
          </Button>
          <Button icon={<DownloadOutlined />}>
            エクスポート
          </Button>
        </Space>
      </div>
      
      {/* 検索パネル */}
      <Card style={{ marginBottom: 16, borderRadius: 8, boxShadow: '0 1px 4px #e0e0e0', background: '#fafbfc' }} bodyStyle={{ padding: 16 }}>
        <Space wrap align="center">
          <Input
            placeholder="成約番号"
            allowClear
            style={{ width: 160 }}
            value={searchContractNo}
            onChange={e => setSearchContractNo(e.target.value)}
          />
          <DatePicker.RangePicker
            value={searchContractDateRange}
            onChange={range => setSearchContractDateRange(range as [dayjs.Dayjs | null, dayjs.Dayjs | null])}
            style={{ width: 260 }}
            allowClear
            placeholder={["成約日(開始)", "成約日(終了)"]}
          />
          <InputNumber
            placeholder="成約金額(最小)"
            value={searchContractAmountRange[0]}
            onChange={val => setSearchContractAmountRange([val, searchContractAmountRange[1]])}
            style={{ width: 140 }}
            min={0}
          />
          <InputNumber
            placeholder="成約金額(最大)"
            value={searchContractAmountRange[1]}
            onChange={val => setSearchContractAmountRange([searchContractAmountRange[0], val])}
            style={{ width: 140 }}
            min={0}
          />
          <Input
            placeholder="担当者"
            allowClear
            style={{ width: 160 }}
            value={searchManager}
            onChange={e => setSearchManager(e.target.value)}
          />
          <Input
            placeholder="顧客名"
            allowClear
            style={{ width: 160 }}
            value={searchCustomerName}
            onChange={e => setSearchCustomerName(e.target.value)}
          />
          <Select
            placeholder="ステータス"
            allowClear
            style={{ width: 120 }}
            value={searchStatus}
            onChange={setSearchStatus}
            options={[
              { value: 'active', label: '進行中' },
              { value: 'completed', label: '完了' },
              { value: 'pending', label: '保留' },
            ]}
          />
          <Button onClick={() => {
            setSearchContractNo('');
            setSearchContractDateRange([null, null]);
            setSearchContractAmountRange([null, null]);
            setSearchManager('');
            setSearchCustomerName('');
            setSearchStatus('');
          }}>条件クリア</Button>
        </Space>
      </Card>

      {/* メモ編集モーダル */}
      <Modal
        title="メモ編集"
        open={isMemoModalOpen}
        onOk={handleMemoModalOk}
        onCancel={handleMemoModalCancel}
        okText="保存"
        cancelText="キャンセル"
      >
        <Form form={memoForm} layout="vertical">
          <Form.Item
            name="memo"
            label="メモ"
            rules={[{ required: true, message: 'メモを入力してください' }]}
          >
            <Input.TextArea rows={4} placeholder="メモを入力してください" />
          </Form.Item>
        </Form>
      </Modal>

      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="key"
        bordered
        pagination={{
          total: filteredData.length,
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} / ${total}件`,
        }}
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
    </Card>
  );
};

export default ContractList; 