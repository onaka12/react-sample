import React, { useState } from 'react';
import { Card, Table, Typography, Input, Button, Space, Tag, DatePicker, InputNumber, Select, Collapse, Row, Col } from 'antd';
import { SearchOutlined, ImportOutlined, DownloadOutlined, DownOutlined, RightOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

const { Title } = Typography;
const { Panel } = Collapse;

interface ContractData {
  key: string;
  contractNo: string;
  contractDate: string;
  contractAmount: number;
  manager: string;
  customerName: string;
  status: 'active' | 'completed' | 'pending';
}

interface ContractDetailData {
  key: string;
  contractNo: string;
  detailNo: string;
  modelNo: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  deliveryDate: string;
  status: 'ordered' | 'shipped' | 'delivered' | 'cancelled';
  notes: string;
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
  }));
};

// 指定した成約番号の明細10件を生成
const createContractDetails = (contractNo: string): ContractDetailData[] =>
  Array.from({ length: 10 }).map((_, i) => ({
    key: (i + 1).toString(),
    contractNo,
    detailNo: (i + 1).toString().padStart(3, '0'),
    modelNo: `MDL-${contractNo.slice(-3)}${i + 1}`,
    quantity: Math.floor(Math.random() * 100) + 1,
    unitPrice: Math.floor(Math.random() * 100000) + 10000,
    amount: 0, // 後で計算
    deliveryDate: dayjs().add(Math.floor(Math.random() * 30), 'day').format('YYYY-MM-DD'),
    status: ['ordered', 'shipped', 'delivered', 'cancelled'][Math.floor(Math.random() * 4)] as ContractDetailData['status'],
    notes: `備考${i + 1}`,
  })).map(item => ({
    ...item,
    amount: item.quantity * item.unitPrice,
  }));

const ContractList2: React.FC = () => {
  const [data] = useState<ContractData[]>(generateContractData());
  
  // 検索条件用のstate
  const [searchContractNo, setSearchContractNo] = useState('');
  const [searchContractDateRange, setSearchContractDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>([null, null]);
  const [searchContractAmountRange, setSearchContractAmountRange] = useState<[number | null, number | null]>([null, null]);
  const [searchManager, setSearchManager] = useState('');
  const [searchCustomerName, setSearchCustomerName] = useState('');
  const [searchStatus, setSearchStatus] = useState<string>('');

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

  const getDetailStatusColor = (status: string) => {
    switch (status) {
      case 'ordered': return 'blue';
      case 'shipped': return 'orange';
      case 'delivered': return 'green';
      case 'cancelled': return 'red';
      default: return 'default';
    }
  };

  const getDetailStatusText = (status: string) => {
    switch (status) {
      case 'ordered': return '発注済';
      case 'shipped': return '出荷済';
      case 'delivered': return '納品済';
      case 'cancelled': return 'キャンセル';
      default: return status;
    }
  };

  const detailColumns: ColumnsType<ContractDetailData> = [
    {
      title: '明細番号',
      dataIndex: 'detailNo',
      key: 'detailNo',
      onCell: () => ({ style: { minWidth: 80 } }),
    },
    {
      title: '型番',
      dataIndex: 'modelNo',
      key: 'modelNo',
      onCell: () => ({ style: { minWidth: 120 } }),
    },
    {
      title: '個数',
      dataIndex: 'quantity',
      key: 'quantity',
      onCell: () => ({ style: { minWidth: 80 } }),
    },
    {
      title: '単価',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      render: (value: number) => `¥${value.toLocaleString()}`,
      onCell: () => ({ style: { minWidth: 100 } }),
    },
    {
      title: '金額',
      dataIndex: 'amount',
      key: 'amount',
      render: (value: number) => `¥${value.toLocaleString()}`,
      onCell: () => ({ style: { minWidth: 120 } }),
    },
    {
      title: '納期',
      dataIndex: 'deliveryDate',
      key: 'deliveryDate',
      onCell: () => ({ style: { minWidth: 100 } }),
    },
    {
      title: 'ステータス',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getDetailStatusColor(status)}>
          {getDetailStatusText(status)}
        </Tag>
      ),
      onCell: () => ({ style: { minWidth: 100 } }),
    },
    {
      title: '備考',
      dataIndex: 'notes',
      key: 'notes',
      onCell: () => ({ style: { minWidth: 120 } }),
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
        <Title level={4} style={{ margin: 0 }}>成約一覧2</Title>
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

      {/* アコーディオンメニュー */}
      <Collapse 
        ghost 
        expandIcon={({ isActive }) => isActive ? <DownOutlined /> : <RightOutlined />}
        style={{ background: 'transparent' }}
      >
        {filteredData.map((contract) => {
          const details = createContractDetails(contract.contractNo);
          return (
            <Panel
              key={contract.key}
              header={
                <Row gutter={16} style={{ width: '100%', alignItems: 'center' }}>
                  <Col span={3}>
                    <div style={{ fontWeight: 'bold', fontSize: 14 }}>{contract.contractNo}</div>
                  </Col>
                  <Col span={3}>
                    <div style={{ fontSize: 12, color: '#666' }}>{contract.contractDate}</div>
                  </Col>
                  <Col span={4}>
                    <div style={{ fontSize: 12, color: '#666' }}>¥{contract.contractAmount.toLocaleString()}</div>
                  </Col>
                  <Col span={3}>
                    <div style={{ fontSize: 12, color: '#666' }}>{contract.manager}</div>
                  </Col>
                  <Col span={6}>
                    <div style={{ fontSize: 12, color: '#666' }}>{contract.customerName}</div>
                  </Col>
                  <Col span={5}>
                    <Tag color={getStatusColor(contract.status)}>
                      {getStatusText(contract.status)}
                    </Tag>
                  </Col>
                </Row>
              }
            >
              <div style={{ padding: '16px 0' }}>
                <Table
                  columns={detailColumns}
                  dataSource={details}
                  rowKey="key"
                  bordered
                  size="small"
                  pagination={false}
                  style={{ borderRadius: 8, overflowX: 'auto' }}
                  scroll={{ x: true }}
                  components={{
                    header: {
                      cell: (props: any) => <th {...props} style={{ ...props.style, background: '#f5f6fa', fontWeight: 700, fontSize: 13, whiteSpace: 'nowrap' }} />,
                    },
                    body: {
                      cell: (props: any) => <td {...props} style={{ ...props.style, whiteSpace: 'nowrap', fontSize: 12 }} />,
                    },
                  }}
                />
              </div>
            </Panel>
          );
        })}
      </Collapse>
    </Card>
  );
};

export default ContractList2; 