import React, { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Card, Table, Typography, Input, Button, Space, Tag, DatePicker, InputNumber, Select, Descriptions, Row, Col } from 'antd';
import { SearchOutlined, ImportOutlined, DownloadOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

const { Title } = Typography;

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

// 指定した成約番号の明細10件を生成
const createContractDetails = (contractNo: string) =>
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

const ContractDetail: React.FC = () => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const contractNoFromParams = searchParams.get('contractNo') || id || '';
  
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedRow, setSelectedRow] = useState<ContractDetailData | null>(null);
  
  const [data] = useState<ContractDetailData[]>(() => {
    if (contractNoFromParams) {
      return createContractDetails(contractNoFromParams);
    } else {
      // サイドメニューから直接アクセスした場合のダミーデータ
      // 複数の成約番号に対して、それぞれ10件の明細を生成
      const contractNumbers = ['CT-20240001', 'CT-20240002', 'CT-20240003', 'CT-20240004', 'CT-20240005'];
      const allDetails: ContractDetailData[] = [];
      
      contractNumbers.forEach((contractNo, contractIndex) => {
        // 各成約番号に対して10件の明細を生成
        for (let i = 0; i < 10; i++) {
          const detailIndex = contractIndex * 10 + i;
          allDetails.push({
            key: (detailIndex + 1).toString(),
            contractNo: contractNo,
            detailNo: (i + 1).toString().padStart(3, '0'), // 001から開始
            modelNo: `MDL-${contractNo.slice(-3)}${(i + 1).toString().padStart(2, '0')}`,
            quantity: Math.floor(Math.random() * 100) + 1,
            unitPrice: Math.floor(Math.random() * 100000) + 10000,
            amount: 0, // 後で計算
            deliveryDate: dayjs().add(Math.floor(Math.random() * 30), 'day').format('YYYY-MM-DD'),
            status: ['ordered', 'shipped', 'delivered', 'cancelled'][Math.floor(Math.random() * 4)] as ContractDetailData['status'],
            notes: `備考${i + 1}`,
          });
        }
      });
      
      return allDetails.map(item => ({
        ...item,
        amount: item.quantity * item.unitPrice,
      }));
    }
  });
  
  // 親の成約情報を生成（実際のアプリではAPIから取得）
  const getParentContractInfo = (contractNo: string) => ({
    contractNo: contractNo,
    contractDate: dayjs().subtract(Math.floor(Math.random() * 365), 'day').format('YYYY-MM-DD'),
    contractAmount: Math.floor(Math.random() * 10000000) + 1000000,
    manager: ['田中太郎', '佐藤花子', '鈴木一郎', '高橋美咲', '伊藤健太'][Math.floor(Math.random() * 5)],
    customerName: `株式会社サンプル${contractNo.slice(-1)}`,
    status: ['active', 'completed', 'pending'][Math.floor(Math.random() * 3)] as 'active' | 'completed' | 'pending',
  });

  // 表示する親の成約情報を決定
  const displayContractNo = selectedRow?.contractNo || contractNoFromParams || 'CT-20240001';
  const parentContractInfo = getParentContractInfo(displayContractNo);
  
  // 検索条件用のstate
  const [searchContractNo, setSearchContractNo] = useState(contractNoFromParams);
  const [searchDetailNo, setSearchDetailNo] = useState('');
  const [searchModelNo, setSearchModelNo] = useState('');
  const [searchQuantityRange, setSearchQuantityRange] = useState<[number | null, number | null]>([null, null]);
  const [searchAmountRange, setSearchAmountRange] = useState<[number | null, number | null]>([null, null]);
  const [searchDeliveryDateRange, setSearchDeliveryDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>([null, null]);
  const [searchStatus, setSearchStatus] = useState<string>('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ordered': return 'blue';
      case 'shipped': return 'orange';
      case 'delivered': return 'green';
      case 'cancelled': return 'red';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ordered': return '発注済';
      case 'shipped': return '出荷済';
      case 'delivered': return '納品済';
      case 'cancelled': return 'キャンセル';
      default: return status;
    }
  };

  const getParentStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'green';
      case 'completed': return 'blue';
      case 'pending': return 'orange';
      default: return 'default';
    }
  };

  const getParentStatusText = (status: string) => {
    switch (status) {
      case 'active': return '進行中';
      case 'completed': return '完了';
      case 'pending': return '保留';
      default: return status;
    }
  };

  const columns: ColumnsType<ContractDetailData> = [
    {
      title: '成約番号',
      dataIndex: 'contractNo',
      key: 'contractNo',
      sorter: (a, b) => a.contractNo.localeCompare(b.contractNo),
      onCell: () => ({ style: { minWidth: 120 } }),
    },
    {
      title: '明細番号',
      dataIndex: 'detailNo',
      key: 'detailNo',
      sorter: (a, b) => a.detailNo.localeCompare(b.detailNo),
      onCell: () => ({ style: { minWidth: 80 } }),
    },
    {
      title: '型番',
      dataIndex: 'modelNo',
      key: 'modelNo',
      sorter: (a, b) => a.modelNo.localeCompare(b.modelNo),
      onCell: () => ({ style: { minWidth: 120 } }),
    },
    {
      title: '個数',
      dataIndex: 'quantity',
      key: 'quantity',
      sorter: (a, b) => a.quantity - b.quantity,
      onCell: () => ({ style: { minWidth: 80 } }),
    },
    {
      title: '単価',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      render: (value: number) => `¥${value.toLocaleString()}`,
      sorter: (a, b) => a.unitPrice - b.unitPrice,
      onCell: () => ({ style: { minWidth: 100 } }),
    },
    {
      title: '金額',
      dataIndex: 'amount',
      key: 'amount',
      render: (value: number) => `¥${value.toLocaleString()}`,
      sorter: (a, b) => a.amount - b.amount,
      onCell: () => ({ style: { minWidth: 120 } }),
    },
    {
      title: '納期',
      dataIndex: 'deliveryDate',
      key: 'deliveryDate',
      sorter: (a, b) => new Date(a.deliveryDate).getTime() - new Date(b.deliveryDate).getTime(),
      onCell: () => ({ style: { minWidth: 100 } }),
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
      title: '備考',
      dataIndex: 'notes',
      key: 'notes',
      onCell: () => ({ style: { minWidth: 120 } }),
    },
  ];

  const filteredData = data.filter(item => {
    // 成約番号 部分一致
    if (searchContractNo && !item.contractNo.toLowerCase().includes(searchContractNo.toLowerCase())) return false;
    // 明細番号 部分一致
    if (searchDetailNo && !item.detailNo.toLowerCase().includes(searchDetailNo.toLowerCase())) return false;
    // 型番 部分一致
    if (searchModelNo && !item.modelNo.toLowerCase().includes(searchModelNo.toLowerCase())) return false;
    // 個数 範囲
    if (searchQuantityRange[0] !== null && item.quantity < searchQuantityRange[0]!) return false;
    if (searchQuantityRange[1] !== null && item.quantity > searchQuantityRange[1]!) return false;
    // 金額 範囲
    if (searchAmountRange[0] !== null && item.amount < searchAmountRange[0]!) return false;
    if (searchAmountRange[1] !== null && item.amount > searchAmountRange[1]!) return false;
    // 納期 範囲
    if (searchDeliveryDateRange[0] && dayjs(item.deliveryDate).isBefore(searchDeliveryDateRange[0], 'day')) return false;
    if (searchDeliveryDateRange[1] && dayjs(item.deliveryDate).isAfter(searchDeliveryDateRange[1], 'day')) return false;
    // ステータス 完全一致
    if (searchStatus && item.status !== searchStatus) return false;
    return true;
  });

  return (
    <Card style={{ borderRadius: 12, boxShadow: '0 2px 8px #f0f1f2', margin: 24, background: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={4} style={{ margin: 0 }}>
          成約明細一覧
          {selectedRow && `（選択中: ${selectedRow.contractNo} - ${selectedRow.detailNo}）`}
          {!selectedRow && contractNoFromParams && `（成約番号: ${contractNoFromParams}）`}
        </Title>
        <Space>
          <Button type="primary" icon={<ImportOutlined />}>
            インポート
          </Button>
          <Button icon={<DownloadOutlined />}>
            エクスポート
          </Button>
        </Space>
      </div>

      {/* 親の成約情報 */}
      <Card style={{ marginBottom: 16, borderRadius: 8, boxShadow: '0 1px 4px #e0e0e0', background: '#f8f9fa' }} bodyStyle={{ padding: 16 }}>
          <Title level={5} style={{ marginBottom: 16, color: '#1890ff' }}>成約情報</Title>
          <Row gutter={[16, 8]}>
            <Col span={6}>
              <div style={{ fontWeight: 'bold', color: '#666', fontSize: 12 }}>成約番号</div>
              <div style={{ fontSize: 14, marginTop: 4 }}>{parentContractInfo.contractNo}</div>
            </Col>
            <Col span={6}>
              <div style={{ fontWeight: 'bold', color: '#666', fontSize: 12 }}>成約日</div>
              <div style={{ fontSize: 14, marginTop: 4 }}>{parentContractInfo.contractDate}</div>
            </Col>
            <Col span={6}>
              <div style={{ fontWeight: 'bold', color: '#666', fontSize: 12 }}>成約金額</div>
              <div style={{ fontSize: 14, marginTop: 4 }}>¥{parentContractInfo.contractAmount.toLocaleString()}</div>
            </Col>
            <Col span={6}>
              <div style={{ fontWeight: 'bold', color: '#666', fontSize: 12 }}>ステータス</div>
              <div style={{ fontSize: 14, marginTop: 4 }}>
                <Tag color={getParentStatusColor(parentContractInfo.status)}>
                  {getParentStatusText(parentContractInfo.status)}
                </Tag>
              </div>
            </Col>
            <Col span={6}>
              <div style={{ fontWeight: 'bold', color: '#666', fontSize: 12 }}>担当者</div>
              <div style={{ fontSize: 14, marginTop: 4 }}>{parentContractInfo.manager}</div>
            </Col>
            <Col span={18}>
              <div style={{ fontWeight: 'bold', color: '#666', fontSize: 12 }}>顧客名</div>
              <div style={{ fontSize: 14, marginTop: 4 }}>{parentContractInfo.customerName}</div>
            </Col>
          </Row>
        </Card>
      
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
          <Input
            placeholder="明細番号"
            allowClear
            style={{ width: 120 }}
            value={searchDetailNo}
            onChange={e => setSearchDetailNo(e.target.value)}
          />
          <Input
            placeholder="型番"
            allowClear
            style={{ width: 160 }}
            value={searchModelNo}
            onChange={e => setSearchModelNo(e.target.value)}
          />
          <InputNumber
            placeholder="個数(最小)"
            value={searchQuantityRange[0]}
            onChange={val => setSearchQuantityRange([val, searchQuantityRange[1]])}
            style={{ width: 120 }}
            min={0}
          />
          <InputNumber
            placeholder="個数(最大)"
            value={searchQuantityRange[1]}
            onChange={val => setSearchQuantityRange([searchQuantityRange[0], val])}
            style={{ width: 120 }}
            min={0}
          />
          <InputNumber
            placeholder="金額(最小)"
            value={searchAmountRange[0]}
            onChange={val => setSearchAmountRange([val, searchAmountRange[1]])}
            style={{ width: 120 }}
            min={0}
          />
          <InputNumber
            placeholder="金額(最大)"
            value={searchAmountRange[1]}
            onChange={val => setSearchAmountRange([searchAmountRange[0], val])}
            style={{ width: 120 }}
            min={0}
          />
          <DatePicker.RangePicker
            value={searchDeliveryDateRange}
            onChange={range => setSearchDeliveryDateRange(range as [dayjs.Dayjs | null, dayjs.Dayjs | null])}
            style={{ width: 260 }}
            allowClear
            placeholder={["納期(開始)", "納期(終了)"]}
          />
          <Select
            placeholder="ステータス"
            allowClear
            style={{ width: 120 }}
            value={searchStatus}
            onChange={setSearchStatus}
            options={[
              { value: 'ordered', label: '発注済' },
              { value: 'shipped', label: '出荷済' },
              { value: 'delivered', label: '納品済' },
              { value: 'cancelled', label: 'キャンセル' },
            ]}
          />
          <Button onClick={() => {
            setSearchContractNo(contractNoFromParams);
            setSearchDetailNo('');
            setSearchModelNo('');
            setSearchQuantityRange([null, null]);
            setSearchAmountRange([null, null]);
            setSearchDeliveryDateRange([null, null]);
            setSearchStatus('');
          }}>条件クリア</Button>
        </Space>
      </Card>

      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="key"
        bordered
        onRow={(record) => ({
          onClick: () => {
            setSelectedRowKeys([record.key]);
            setSelectedRow(record);
          },
          style: {
            cursor: 'pointer',
            backgroundColor: selectedRowKeys.includes(record.key) ? '#e6f7ff' : undefined,
          },
        })}
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

export default ContractDetail; 