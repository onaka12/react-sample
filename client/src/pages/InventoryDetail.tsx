import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, Table, Typography } from 'antd';

const { Title } = Typography;

// 指定した引当元番号の明細10件を生成
const createDetails = (allocationSourceNo: string) =>
  Array.from({ length: 10 }).map((_, i) => ({
    key: i + 1,
    allocationSourceNo,
    detailNo: (i + 1).toString().padStart(4, '0'),
    modelNo: `MDL-${allocationSourceNo.slice(-3)}${i + 1}`,
    branchNo: String.fromCharCode(65 + (i % 3)),
    deliveryPlace: `倉庫${allocationSourceNo.slice(-1)}`,
    stockStatus: i % 2 === 0 ? '入庫済' : '未入庫',
    costUnitPrice: 1000 + i * 100,
    orderNo: `PO-202406${allocationSourceNo.slice(-1)}${i + 1}`,
    orderQty: 10 + i,
    allocated: 5 + i,
    reserved: 2 + i,
  }));

const columns = [
  { title: '引当元番号', dataIndex: 'allocationSourceNo', key: 'allocationSourceNo', onCell: () => ({ style: { minWidth: 110 } }) },
  { title: '明細番号', dataIndex: 'detailNo', key: 'detailNo', onCell: () => ({ style: { minWidth: 80 } }) },
  { title: '型番', dataIndex: 'modelNo', key: 'modelNo', onCell: () => ({ style: { minWidth: 80 } }) },
  { title: '枝番', dataIndex: 'branchNo', key: 'branchNo', onCell: () => ({ style: { minWidth: 60 } }) },
  { title: '納品先', dataIndex: 'deliveryPlace', key: 'deliveryPlace', onCell: () => ({ style: { minWidth: 100 } }) },
  { title: '入庫状況', dataIndex: 'stockStatus', key: 'stockStatus', onCell: () => ({ style: { minWidth: 80 } }) },
  { title: '原価単価', dataIndex: 'costUnitPrice', key: 'costUnitPrice', render: (v: number) => v.toLocaleString(), onCell: () => ({ style: { minWidth: 90 } }) },
  { title: '発注番号', dataIndex: 'orderNo', key: 'orderNo', onCell: () => ({ style: { minWidth: 120 } }) },
  { title: '発注数', dataIndex: 'orderQty', key: 'orderQty', onCell: () => ({ style: { minWidth: 80 } }) },
  { title: '引当済', dataIndex: 'allocated', key: 'allocated', onCell: () => ({ style: { minWidth: 80 } }) },
  { title: '予約済', dataIndex: 'reserved', key: 'reserved', onCell: () => ({ style: { minWidth: 80 } }) },
];

const InventoryDetail: React.FC = () => {
  const { id } = useParams();
  const details = id ? createDetails(id) : [];

  return (
    <Card style={{ borderRadius: 12, boxShadow: '0 2px 8px #f0f1f2', margin: 24, background: '#fff' }}>
      <Title level={4} style={{ marginBottom: 24 }}>発注明細一覧（引当元番号: {id}）</Title>
      <Table
        columns={columns}
        dataSource={details}
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
    </Card>
  );
};

export default InventoryDetail; 