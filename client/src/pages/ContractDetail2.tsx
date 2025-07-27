import React, { useState } from 'react';
import { Card, Table, Typography, Input, Button, Space, Tag, DatePicker, InputNumber, Select, Row, Col } from 'antd';
import { SearchOutlined, ImportOutlined, DownloadOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

const { Title } = Typography;

interface ContractDetailData {
  key: string;
  contractNo: string;
  detailNo: string;
  modelNo: string;
  unitPrice: number;
  deliveryDate: string;
  status: 'ordered' | 'shipped' | 'delivered' | 'cancelled';
  notes: string;
}

// MDL-0011の個数分の明細を生成（個数はランダムに決定）
const createContractDetails2 = (): ContractDetailData[] => {
  const quantity = Math.floor(Math.random() * 50) + 10; // 10〜59個
  const unitPrice = Math.floor(Math.random() * 100000) + 10000; // 10,000〜110,000円
  
  return Array.from({ length: quantity }).map((_, i) => ({
    key: (i + 1).toString(),
    contractNo: 'CT-20240001',
    detailNo: (i + 1).toString().padStart(3, '0'),
    modelNo: 'MDL-0011',
    unitPrice: unitPrice,
    deliveryDate: dayjs().add(Math.floor(Math.random() * 30), 'day').format('YYYY-MM-DD'),
    status: ['ordered', 'shipped', 'delivered', 'cancelled'][Math.floor(Math.random() * 4)] as ContractDetailData['status'],
    notes: `備考${i + 1}`,
  }));
};

const ContractDetail2: React.FC = () => {
  const [data] = useState<ContractDetailData[]>(createContractDetails2());
  
  // 検索条件用のstate
  const [searchDetailNo, setSearchDetailNo] = useState('');
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
      title: '単価',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      render: (value: number) => `¥${value.toLocaleString()}`,
      sorter: (a, b) => a.unitPrice - b.unitPrice,
      onCell: () => ({ style: { minWidth: 100 } }),
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
    // 明細番号 部分一致
    if (searchDetailNo && !item.detailNo.toLowerCase().includes(searchDetailNo.toLowerCase())) return false;
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
        <Title level={4} style={{ margin: 0 }}>成約明細2（CT-20240001 - MDL-0011）</Title>
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
            <div style={{ fontSize: 14, marginTop: 4 }}>CT-20240001</div>
          </Col>
          <Col span={6}>
            <div style={{ fontWeight: 'bold', color: '#666', fontSize: 12 }}>成約日</div>
            <div style={{ fontSize: 14, marginTop: 4 }}>{dayjs().subtract(Math.floor(Math.random() * 365), 'day').format('YYYY-MM-DD')}</div>
          </Col>
          <Col span={6}>
            <div style={{ fontWeight: 'bold', color: '#666', fontSize: 12 }}>成約金額</div>
            <div style={{ fontSize: 14, marginTop: 4 }}>¥{(Math.floor(Math.random() * 10000000) + 1000000).toLocaleString()}</div>
          </Col>
          <Col span={6}>
            <div style={{ fontWeight: 'bold', color: '#666', fontSize: 12 }}>ステータス</div>
            <div style={{ fontSize: 14, marginTop: 4 }}>
              <Tag color="green">進行中</Tag>
            </div>
          </Col>
          <Col span={6}>
            <div style={{ fontWeight: 'bold', color: '#666', fontSize: 12 }}>担当者</div>
            <div style={{ fontSize: 14, marginTop: 4 }}>田中太郎</div>
          </Col>
          <Col span={18}>
            <div style={{ fontWeight: 'bold', color: '#666', fontSize: 12 }}>顧客名</div>
            <div style={{ fontSize: 14, marginTop: 4 }}>株式会社サンプルA</div>
          </Col>
        </Row>
      </Card>
      
      {/* 検索パネル */}
      <Card style={{ marginBottom: 16, borderRadius: 8, boxShadow: '0 1px 4px #e0e0e0', background: '#fafbfc' }} bodyStyle={{ padding: 16 }}>
        <Space wrap align="center">
          <Input
            placeholder="明細番号"
            allowClear
            style={{ width: 120 }}
            value={searchDetailNo}
            onChange={e => setSearchDetailNo(e.target.value)}
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
            setSearchDetailNo('');
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

export default ContractDetail2; 