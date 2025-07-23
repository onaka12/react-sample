import React, { useState } from 'react';
import { Table, Typography, Button, Popconfirm, Modal, Form, Input, InputNumber, Space, DatePicker, Menu, Dropdown, Tooltip, Card, Row, Col, Descriptions, Tag, Select } from 'antd';
import dayjs from 'dayjs';
import { EllipsisOutlined, SearchOutlined, EditOutlined, EyeOutlined, DeleteOutlined, DownOutlined } from '@ant-design/icons';
// Dropdown, Menuは既にantdからimportされている場合は重複importを削除
const { Search } = Input;

const { Title } = Typography;

interface OrderItem {
  key: number;
  transactionId: string;
  orderDate: string;
  totalAmount: number;
  emergencyType: string;
  requesterCompany: string;
  orgCode: string;
  orgName: string;
  estimateNumber: string;
  requestNumber: string;
  personInCharge: string;
  deliveryDate: string;
  receiveShopCode: string;
  receiveExtraShopCode: string;
  receiveShopName: string;
  receiveShopTel: string;
  shippingCode: string;
  deliveryPlace: string;
  deliveryZip: string;
  deliveryAddress: string;
  unifiedTel: string;
  itemCode: string;
  itemName: string;
  orderMark: string;
  specNumber: string;
  quantity: number;
  edition: string;
  unitPrice: number;
  amount: number;
  status: string; // 追加
}

const initialData: OrderItem[] = [
  {
    key: 1,
    transactionId: 'TRX-001',
    orderDate: '2024-06-01',
    totalAmount: 100000,
    emergencyType: '通常',
    requesterCompany: 'A社',
    orgCode: 'ORG001',
    orgName: '営業部',
    estimateNumber: 'EST-001',
    requestNumber: 'REQ-001',
    personInCharge: '田中',
    deliveryDate: '2024-06-10',
    receiveShopCode: 'SHOP001',
    receiveExtraShopCode: 'EXTRA001',
    receiveShopName: '東京店',
    receiveShopTel: '03-1234-5678',
    shippingCode: 'SHIP001',
    deliveryPlace: '本社倉庫',
    deliveryZip: '100-0001',
    deliveryAddress: '東京都千代田区1-1-1',
    unifiedTel: '03-0000-0000',
    itemCode: 'ITEM001',
    itemName: '商品A',
    orderMark: 'A1',
    specNumber: 'SPEC-001',
    quantity: 10,
    edition: '1',
    unitPrice: 10000,
    amount: 100000,
    status: '未応諾',
  },
  {
    key: 2,
    transactionId: 'TRX-002',
    orderDate: '2024-06-02',
    totalAmount: 50000,
    emergencyType: '緊急',
    requesterCompany: 'B社',
    orgCode: 'ORG002',
    orgName: '技術部',
    estimateNumber: 'EST-002',
    requestNumber: 'REQ-002',
    personInCharge: '佐藤',
    deliveryDate: '2024-06-12',
    receiveShopCode: 'SHOP002',
    receiveExtraShopCode: 'EXTRA002',
    receiveShopName: '大阪店',
    receiveShopTel: '06-1234-5678',
    shippingCode: 'SHIP002',
    deliveryPlace: '大阪倉庫',
    deliveryZip: '530-0001',
    deliveryAddress: '大阪市北区1-2-3',
    unifiedTel: '06-0000-0000',
    itemCode: 'ITEM002',
    itemName: '商品B',
    orderMark: 'B1',
    specNumber: 'SPEC-002',
    quantity: 5,
    edition: '2',
    unitPrice: 10000,
    amount: 50000,
    status: '未応諾',
  },
  // 追加ダミーデータ
  {
    key: 3,
    transactionId: 'TRX-003',
    orderDate: '2024-06-03',
    totalAmount: 75000,
    emergencyType: '通常',
    requesterCompany: 'C社',
    orgCode: 'ORG003',
    orgName: '総務部',
    estimateNumber: 'EST-003',
    requestNumber: 'REQ-003',
    personInCharge: '鈴木',
    deliveryDate: '2024-06-15',
    receiveShopCode: 'SHOP003',
    receiveExtraShopCode: 'EXTRA003',
    receiveShopName: '名古屋店',
    receiveShopTel: '052-123-4567',
    shippingCode: 'SHIP003',
    deliveryPlace: '名古屋倉庫',
    deliveryZip: '460-0001',
    deliveryAddress: '名古屋市中区1-3-5',
    unifiedTel: '052-0000-0000',
    itemCode: 'ITEM003',
    itemName: '商品C',
    orderMark: 'C1',
    specNumber: 'SPEC-003',
    quantity: 8,
    edition: '1',
    unitPrice: 9375,
    amount: 75000,
    status: '未応諾',
  },
  {
    key: 4,
    transactionId: 'TRX-004',
    orderDate: '2024-06-04',
    totalAmount: 120000,
    emergencyType: '緊急',
    requesterCompany: 'D社',
    orgCode: 'ORG004',
    orgName: '経理部',
    estimateNumber: 'EST-004',
    requestNumber: 'REQ-004',
    personInCharge: '高橋',
    deliveryDate: '2024-06-18',
    receiveShopCode: 'SHOP004',
    receiveExtraShopCode: 'EXTRA004',
    receiveShopName: '札幌店',
    receiveShopTel: '011-123-4567',
    shippingCode: 'SHIP004',
    deliveryPlace: '札幌倉庫',
    deliveryZip: '060-0001',
    deliveryAddress: '札幌市中央区1-4-7',
    unifiedTel: '011-0000-0000',
    itemCode: 'ITEM004',
    itemName: '商品D',
    orderMark: 'D1',
    specNumber: 'SPEC-004',
    quantity: 12,
    edition: '2',
    unitPrice: 10000,
    amount: 120000,
    status: '未応諾',
  },
  {
    key: 5,
    transactionId: 'TRX-005',
    orderDate: '2024-06-05',
    totalAmount: 30000,
    emergencyType: '通常',
    requesterCompany: 'E社',
    orgCode: 'ORG005',
    orgName: '人事部',
    estimateNumber: 'EST-005',
    requestNumber: 'REQ-005',
    personInCharge: '伊藤',
    deliveryDate: '2024-06-20',
    receiveShopCode: 'SHOP005',
    receiveExtraShopCode: 'EXTRA005',
    receiveShopName: '福岡店',
    receiveShopTel: '092-123-4567',
    shippingCode: 'SHIP005',
    deliveryPlace: '福岡倉庫',
    deliveryZip: '810-0001',
    deliveryAddress: '福岡市中央区1-5-9',
    unifiedTel: '092-0000-0000',
    itemCode: 'ITEM005',
    itemName: '商品E',
    orderMark: 'E1',
    specNumber: 'SPEC-005',
    quantity: 3,
    edition: '1',
    unitPrice: 10000,
    amount: 30000,
    status: '未応諾',
  },
  {
    key: 6,
    transactionId: 'TRX-006',
    orderDate: '2024-06-06',
    totalAmount: 45000,
    emergencyType: '通常',
    requesterCompany: 'F社',
    orgCode: 'ORG006',
    orgName: '開発部',
    estimateNumber: 'EST-006',
    requestNumber: 'REQ-006',
    personInCharge: '渡辺',
    deliveryDate: '2024-06-22',
    receiveShopCode: 'SHOP006',
    receiveExtraShopCode: 'EXTRA006',
    receiveShopName: '仙台店',
    receiveShopTel: '022-123-4567',
    shippingCode: 'SHIP006',
    deliveryPlace: '仙台倉庫',
    deliveryZip: '980-0001',
    deliveryAddress: '仙台市青葉区1-6-11',
    unifiedTel: '022-0000-0000',
    itemCode: 'ITEM006',
    itemName: '商品F',
    orderMark: 'F1',
    specNumber: 'SPEC-006',
    quantity: 9,
    edition: '2',
    unitPrice: 5000,
    amount: 45000,
    status: '未応諾',
  },
  {
    key: 7,
    transactionId: 'TRX-007',
    orderDate: '2024-06-07',
    totalAmount: 80000,
    emergencyType: '緊急',
    requesterCompany: 'G社',
    orgCode: 'ORG007',
    orgName: '営業部',
    estimateNumber: 'EST-007',
    requestNumber: 'REQ-007',
    personInCharge: '山本',
    deliveryDate: '2024-06-25',
    receiveShopCode: 'SHOP007',
    receiveExtraShopCode: 'EXTRA007',
    receiveShopName: '広島店',
    receiveShopTel: '082-123-4567',
    shippingCode: 'SHIP007',
    deliveryPlace: '広島倉庫',
    deliveryZip: '730-0001',
    deliveryAddress: '広島市中区1-7-13',
    unifiedTel: '082-0000-0000',
    itemCode: 'ITEM007',
    itemName: '商品G',
    orderMark: 'G1',
    specNumber: 'SPEC-007',
    quantity: 8,
    edition: '1',
    unitPrice: 10000,
    amount: 80000,
    status: '未応諾',
  },
  {
    key: 8,
    transactionId: 'TRX-008',
    orderDate: '2024-06-08',
    totalAmount: 60000,
    emergencyType: '通常',
    requesterCompany: 'H社',
    orgCode: 'ORG008',
    orgName: '技術部',
    estimateNumber: 'EST-008',
    requestNumber: 'REQ-008',
    personInCharge: '中村',
    deliveryDate: '2024-06-28',
    receiveShopCode: 'SHOP008',
    receiveExtraShopCode: 'EXTRA008',
    receiveShopName: '京都店',
    receiveShopTel: '075-123-4567',
    shippingCode: 'SHIP008',
    deliveryPlace: '京都倉庫',
    deliveryZip: '600-0001',
    deliveryAddress: '京都市下京区1-8-15',
    unifiedTel: '075-0000-0000',
    itemCode: 'ITEM008',
    itemName: '商品H',
    orderMark: 'H1',
    specNumber: 'SPEC-008',
    quantity: 6,
    edition: '2',
    unitPrice: 10000,
    amount: 60000,
    status: '未応諾',
  },
  {
    key: 9,
    transactionId: 'TRX-009',
    orderDate: '2024-06-09',
    totalAmount: 90000,
    emergencyType: '通常',
    requesterCompany: 'I社',
    orgCode: 'ORG009',
    orgName: '総務部',
    estimateNumber: 'EST-009',
    requestNumber: 'REQ-009',
    personInCharge: '小林',
    deliveryDate: '2024-06-30',
    receiveShopCode: 'SHOP009',
    receiveExtraShopCode: 'EXTRA009',
    receiveShopName: '神戸店',
    receiveShopTel: '078-123-4567',
    shippingCode: 'SHIP009',
    deliveryPlace: '神戸倉庫',
    deliveryZip: '650-0001',
    deliveryAddress: '神戸市中央区1-9-17',
    unifiedTel: '078-0000-0000',
    itemCode: 'ITEM009',
    itemName: '商品I',
    orderMark: 'I1',
    specNumber: 'SPEC-009',
    quantity: 9,
    edition: '1',
    unitPrice: 10000,
    amount: 90000,
    status: '未応諾',
  },
  {
    key: 10,
    transactionId: 'TRX-010',
    orderDate: '2024-06-10',
    totalAmount: 110000,
    emergencyType: '緊急',
    requesterCompany: 'J社',
    orgCode: 'ORG010',
    orgName: '経理部',
    estimateNumber: 'EST-010',
    requestNumber: 'REQ-010',
    personInCharge: '加藤',
    deliveryDate: '2024-07-02',
    receiveShopCode: 'SHOP010',
    receiveExtraShopCode: 'EXTRA010',
    receiveShopName: '横浜店',
    receiveShopTel: '045-123-4567',
    shippingCode: 'SHIP010',
    deliveryPlace: '横浜倉庫',
    deliveryZip: '220-0001',
    deliveryAddress: '横浜市西区1-10-19',
    unifiedTel: '045-0000-0000',
    itemCode: 'ITEM010',
    itemName: '商品J',
    orderMark: 'J1',
    specNumber: 'SPEC-010',
    quantity: 11,
    edition: '2',
    unitPrice: 10000,
    amount: 110000,
    status: '未応諾',
  },
  // ... 10 more ダミーデータ ...
  {
    key: 11,
    transactionId: 'TRX-011',
    orderDate: '2024-06-11',
    totalAmount: 70000,
    emergencyType: '通常',
    requesterCompany: 'K社',
    orgCode: 'ORG011',
    orgName: '人事部',
    estimateNumber: 'EST-011',
    requestNumber: 'REQ-011',
    personInCharge: '吉田',
    deliveryDate: '2024-07-05',
    receiveShopCode: 'SHOP011',
    receiveExtraShopCode: 'EXTRA011',
    receiveShopName: '千葉店',
    receiveShopTel: '043-123-4567',
    shippingCode: 'SHIP011',
    deliveryPlace: '千葉倉庫',
    deliveryZip: '260-0001',
    deliveryAddress: '千葉市中央区1-11-21',
    unifiedTel: '043-0000-0000',
    itemCode: 'ITEM011',
    itemName: '商品K',
    orderMark: 'K1',
    specNumber: 'SPEC-011',
    quantity: 7,
    edition: '1',
    unitPrice: 10000,
    amount: 70000,
    status: '未応諾',
  },
  {
    key: 12,
    transactionId: 'TRX-012',
    orderDate: '2024-06-12',
    totalAmount: 95000,
    emergencyType: '緊急',
    requesterCompany: 'L社',
    orgCode: 'ORG012',
    orgName: '開発部',
    estimateNumber: 'EST-012',
    requestNumber: 'REQ-012',
    personInCharge: '山田',
    deliveryDate: '2024-07-08',
    receiveShopCode: 'SHOP012',
    receiveExtraShopCode: 'EXTRA012',
    receiveShopName: 'さいたま店',
    receiveShopTel: '048-123-4567',
    shippingCode: 'SHIP012',
    deliveryPlace: 'さいたま倉庫',
    deliveryZip: '330-0001',
    deliveryAddress: 'さいたま市大宮区1-12-23',
    unifiedTel: '048-0000-0000',
    itemCode: 'ITEM012',
    itemName: '商品L',
    orderMark: 'L1',
    specNumber: 'SPEC-012',
    quantity: 9,
    edition: '2',
    unitPrice: 10556,
    amount: 95000,
    status: '未応諾',
  },
  {
    key: 13,
    transactionId: 'TRX-013',
    orderDate: '2024-06-13',
    totalAmount: 40000,
    emergencyType: '通常',
    requesterCompany: 'M社',
    orgCode: 'ORG013',
    orgName: '営業部',
    estimateNumber: 'EST-013',
    requestNumber: 'REQ-013',
    personInCharge: '佐々木',
    deliveryDate: '2024-07-10',
    receiveShopCode: 'SHOP013',
    receiveExtraShopCode: 'EXTRA013',
    receiveShopName: '新潟店',
    receiveShopTel: '025-123-4567',
    shippingCode: 'SHIP013',
    deliveryPlace: '新潟倉庫',
    deliveryZip: '950-0001',
    deliveryAddress: '新潟市中央区1-13-25',
    unifiedTel: '025-0000-0000',
    itemCode: 'ITEM013',
    itemName: '商品M',
    orderMark: 'M1',
    specNumber: 'SPEC-013',
    quantity: 4,
    edition: '1',
    unitPrice: 10000,
    amount: 40000,
    status: '未応諾',
  },
  {
    key: 14,
    transactionId: 'TRX-014',
    orderDate: '2024-06-14',
    totalAmount: 105000,
    emergencyType: '緊急',
    requesterCompany: 'N社',
    orgCode: 'ORG014',
    orgName: '技術部',
    estimateNumber: 'EST-014',
    requestNumber: 'REQ-014',
    personInCharge: '斎藤',
    deliveryDate: '2024-07-12',
    receiveShopCode: 'SHOP014',
    receiveExtraShopCode: 'EXTRA014',
    receiveShopName: '岡山店',
    receiveShopTel: '086-123-4567',
    shippingCode: 'SHIP014',
    deliveryPlace: '岡山倉庫',
    deliveryZip: '700-0001',
    deliveryAddress: '岡山市北区1-14-27',
    unifiedTel: '086-0000-0000',
    itemCode: 'ITEM014',
    itemName: '商品N',
    orderMark: 'N1',
    specNumber: 'SPEC-014',
    quantity: 7,
    edition: '2',
    unitPrice: 15000,
    amount: 105000,
    status: '未応諾',
  },
  {
    key: 15,
    transactionId: 'TRX-015',
    orderDate: '2024-06-15',
    totalAmount: 85000,
    emergencyType: '通常',
    requesterCompany: 'O社',
    orgCode: 'ORG015',
    orgName: '総務部',
    estimateNumber: 'EST-015',
    requestNumber: 'REQ-015',
    personInCharge: '松本',
    deliveryDate: '2024-07-15',
    receiveShopCode: 'SHOP015',
    receiveExtraShopCode: 'EXTRA015',
    receiveShopName: '鹿児島店',
    receiveShopTel: '099-123-4567',
    shippingCode: 'SHIP015',
    deliveryPlace: '鹿児島倉庫',
    deliveryZip: '890-0001',
    deliveryAddress: '鹿児島市中央区1-15-29',
    unifiedTel: '099-0000-0000',
    itemCode: 'ITEM015',
    itemName: '商品O',
    orderMark: 'O1',
    specNumber: 'SPEC-015',
    quantity: 5,
    edition: '1',
    unitPrice: 17000,
    amount: 85000,
    status: '未応諾',
  },
  {
    key: 16,
    transactionId: 'TRX-016',
    orderDate: '2024-06-16',
    totalAmount: 60000,
    emergencyType: '緊急',
    requesterCompany: 'P社',
    orgCode: 'ORG016',
    orgName: '経理部',
    estimateNumber: 'EST-016',
    requestNumber: 'REQ-016',
    personInCharge: '井上',
    deliveryDate: '2024-07-18',
    receiveShopCode: 'SHOP016',
    receiveExtraShopCode: 'EXTRA016',
    receiveShopName: '松山店',
    receiveShopTel: '089-123-4567',
    shippingCode: 'SHIP016',
    deliveryPlace: '松山倉庫',
    deliveryZip: '790-0001',
    deliveryAddress: '松山市中央区1-16-31',
    unifiedTel: '089-0000-0000',
    itemCode: 'ITEM016',
    itemName: '商品P',
    orderMark: 'P1',
    specNumber: 'SPEC-016',
    quantity: 6,
    edition: '2',
    unitPrice: 10000,
    amount: 60000,
    status: '未応諾',
  },
  {
    key: 17,
    transactionId: 'TRX-017',
    orderDate: '2024-06-17',
    totalAmount: 78000,
    emergencyType: '通常',
    requesterCompany: 'Q社',
    orgCode: 'ORG017',
    orgName: '人事部',
    estimateNumber: 'EST-017',
    requestNumber: 'REQ-017',
    personInCharge: '木村',
    deliveryDate: '2024-07-20',
    receiveShopCode: 'SHOP017',
    receiveExtraShopCode: 'EXTRA017',
    receiveShopName: '金沢店',
    receiveShopTel: '076-123-4567',
    shippingCode: 'SHIP017',
    deliveryPlace: '金沢倉庫',
    deliveryZip: '920-0001',
    deliveryAddress: '金沢市中央区1-17-33',
    unifiedTel: '076-0000-0000',
    itemCode: 'ITEM017',
    itemName: '商品Q',
    orderMark: 'Q1',
    specNumber: 'SPEC-017',
    quantity: 6,
    edition: '1',
    unitPrice: 13000,
    amount: 78000,
    status: '未応諾',
  },
  {
    key: 18,
    transactionId: 'TRX-018',
    orderDate: '2024-06-18',
    totalAmount: 50000,
    emergencyType: '緊急',
    requesterCompany: 'R社',
    orgCode: 'ORG018',
    orgName: '開発部',
    estimateNumber: 'EST-018',
    requestNumber: 'REQ-018',
    personInCharge: '林',
    deliveryDate: '2024-07-22',
    receiveShopCode: 'SHOP018',
    receiveExtraShopCode: 'EXTRA018',
    receiveShopName: '宇都宮店',
    receiveShopTel: '028-123-4567',
    shippingCode: 'SHIP018',
    deliveryPlace: '宇都宮倉庫',
    deliveryZip: '320-0001',
    deliveryAddress: '宇都宮市中央区1-18-35',
    unifiedTel: '028-0000-0000',
    itemCode: 'ITEM018',
    itemName: '商品R',
    orderMark: 'R1',
    specNumber: 'SPEC-018',
    quantity: 5,
    edition: '2',
    unitPrice: 10000,
    amount: 50000,
    status: '未応諾',
  },
  {
    key: 19,
    transactionId: 'TRX-019',
    orderDate: '2024-06-19',
    totalAmount: 120000,
    emergencyType: '通常',
    requesterCompany: 'S社',
    orgCode: 'ORG019',
    orgName: '営業部',
    estimateNumber: 'EST-019',
    requestNumber: 'REQ-019',
    personInCharge: '清水',
    deliveryDate: '2024-07-25',
    receiveShopCode: 'SHOP019',
    receiveExtraShopCode: 'EXTRA019',
    receiveShopName: '静岡店',
    receiveShopTel: '054-123-4567',
    shippingCode: 'SHIP019',
    deliveryPlace: '静岡倉庫',
    deliveryZip: '420-0001',
    deliveryAddress: '静岡市葵区1-19-37',
    unifiedTel: '054-0000-0000',
    itemCode: 'ITEM019',
    itemName: '商品S',
    orderMark: 'S1',
    specNumber: 'SPEC-019',
    quantity: 12,
    edition: '1',
    unitPrice: 10000,
    amount: 120000,
    status: '未応諾',
  },
  {
    key: 20,
    transactionId: 'TRX-020',
    orderDate: '2024-06-20',
    totalAmount: 65000,
    emergencyType: '緊急',
    requesterCompany: 'T社',
    orgCode: 'ORG020',
    orgName: '技術部',
    estimateNumber: 'EST-020',
    requestNumber: 'REQ-020',
    personInCharge: '森',
    deliveryDate: '2024-07-28',
    receiveShopCode: 'SHOP020',
    receiveExtraShopCode: 'EXTRA020',
    receiveShopName: '高松店',
    receiveShopTel: '087-123-4567',
    shippingCode: 'SHIP020',
    deliveryPlace: '高松倉庫',
    deliveryZip: '760-0001',
    deliveryAddress: '高松市中央区1-20-39',
    unifiedTel: '087-0000-0000',
    itemCode: 'ITEM020',
    itemName: '商品T',
    orderMark: 'T1',
    specNumber: 'SPEC-020',
    quantity: 5,
    edition: '2',
    unitPrice: 13000,
    amount: 65000,
    status: '未応諾',
  },
];

const OrderList: React.FC = () => {
  const [data, setData] = useState<OrderItem[]>(initialData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<OrderItem | null>(null);
  const [form] = Form.useForm();
  const [viewItem, setViewItem] = useState<OrderItem | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [monthFilter, setMonthFilter] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
  const [searchText, setSearchText] = useState('');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>([null, null]);
  // 追加: 検索条件用のstate
  const [searchTransactionId, setSearchTransactionId] = useState('');
  const [searchOrderDateRange, setSearchOrderDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>([null, null]);
  const [searchTotalAmountRange, setSearchTotalAmountRange] = useState<[number | null, number | null]>([null, null]);
  const [searchDeliveryDateRange, setSearchDeliveryDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>([null, null]);
  const [searchDeliveryPlace, setSearchDeliveryPlace] = useState('');
  const [searchItemName, setSearchItemName] = useState('');
  // ページネーション用stateを追加
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleDelete = (key: number) => {
    setData(data.filter(item => item.key !== key));
  };

  const handleEdit = (item: OrderItem) => {
    setEditingItem(item);
    form.setFieldsValue({ ...item, orderDate: dayjs(item.orderDate) });
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

  // filteredDataのロジックを修正
  const filteredData = data.filter(item => {
    // 取引番号 部分一致
    if (searchTransactionId && !item.transactionId.toLowerCase().includes(searchTransactionId.toLowerCase())) return false;
    // 注文年月日 範囲
    if (searchOrderDateRange[0] && dayjs(item.orderDate).isBefore(searchOrderDateRange[0], 'day')) return false;
    if (searchOrderDateRange[1] && dayjs(item.orderDate).isAfter(searchOrderDateRange[1], 'day')) return false;
    // 注文合計金額 範囲
    if (searchTotalAmountRange[0] !== null && item.totalAmount < searchTotalAmountRange[0]!) return false;
    if (searchTotalAmountRange[1] !== null && item.totalAmount > searchTotalAmountRange[1]!) return false;
    // 納期 範囲
    if (searchDeliveryDateRange[0] && dayjs(item.deliveryDate).isBefore(searchDeliveryDateRange[0], 'day')) return false;
    if (searchDeliveryDateRange[1] && dayjs(item.deliveryDate).isAfter(searchDeliveryDateRange[1], 'day')) return false;
    // 納入場所 部分一致
    if (searchDeliveryPlace && !item.deliveryPlace.toLowerCase().includes(searchDeliveryPlace.toLowerCase())) return false;
    // 品名 部分一致
    if (searchItemName && !item.itemName.toLowerCase().includes(searchItemName.toLowerCase())) return false;
    return true;
  });

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys: React.Key[]) => setSelectedRowKeys(selectedKeys as number[]),
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
      const num = Number(record.transactionId.replace(/\D/g, ''));
      return num === value;
    },
  });

  // ステータスの色分け例
  const statusColor = (status: string) => {
    if (status === '進行中') return 'blue';
    if (status === '完了') return 'green';
    if (status === '未着手') return 'default';
    return 'default';
  };

  const columns = [
    {
      title: '取引番号',
      dataIndex: 'transactionId',
      key: 'transactionId',
      sorter: (a: OrderItem, b: OrderItem) => a.transactionId.localeCompare(b.transactionId),
      onCell: () => ({ style: { minWidth: 108 } })
    },
    {
      title: '注文年月日',
      dataIndex: 'orderDate',
      key: 'orderDate',
      sorter: (a: OrderItem, b: OrderItem) => a.orderDate.localeCompare(b.orderDate),
      onCell: () => ({ style: { minWidth: 126 } })
    },
    {
      title: '注文合計金額',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      sorter: (a: OrderItem, b: OrderItem) => a.totalAmount - b.totalAmount,
      render: (v: number) => v.toLocaleString(),
      onCell: () => ({ style: { minWidth: 144 } })
    },
    { title: 'ステータス', dataIndex: 'status', key: 'status', onCell: () => ({ style: { minWidth: 90 } }), render: (status: string) => (
      <Tag color={status === '応諾済み' ? 'green' : 'default'}>{status}</Tag>
    ) },
    { title: '緊急区分', dataIndex: 'emergencyType', key: 'emergencyType', onCell: () => ({ style: { minWidth: 108 } }) },
    { title: '要求元会社名', dataIndex: 'requesterCompany', key: 'requesterCompany', onCell: () => ({ style: { minWidth: 144 } }) },
    { title: '発注部課組織コード', dataIndex: 'orgCode', key: 'orgCode', onCell: () => ({ style: { minWidth: 180 } }) },
    { title: '発注部課名', dataIndex: 'orgName', key: 'orgName', onCell: () => ({ style: { minWidth: 126 } }) },
    { title: '見積番号', dataIndex: 'estimateNumber', key: 'estimateNumber', onCell: () => ({ style: { minWidth: 108 } }) },
    { title: '要求番号', dataIndex: 'requestNumber', key: 'requestNumber', onCell: () => ({ style: { minWidth: 108 } }) },
    { title: '担当者', dataIndex: 'personInCharge', key: 'personInCharge', onCell: () => ({ style: { minWidth: 90 } }) },
    { title: '納期', dataIndex: 'deliveryDate', key: 'deliveryDate', onCell: () => ({ style: { minWidth: 72 } }) },
    { title: '受取販売店コード', dataIndex: 'receiveShopCode', key: 'receiveShopCode', onCell: () => ({ style: { minWidth: 162 } }) },
    { title: '受取付加販売店コード', dataIndex: 'receiveExtraShopCode', key: 'receiveExtraShopCode', onCell: () => ({ style: { minWidth: 198 } }) },
    { title: '受取販売店名', dataIndex: 'receiveShopName', key: 'receiveShopName', onCell: () => ({ style: { minWidth: 126 } }) },
    { title: '受取販売店電話番号', dataIndex: 'receiveShopTel', key: 'receiveShopTel', onCell: () => ({ style: { minWidth: 162 } }) },
    { title: '送付先コード', dataIndex: 'shippingCode', key: 'shippingCode', onCell: () => ({ style: { minWidth: 108 } }) },
    { title: '納入場所', dataIndex: 'deliveryPlace', key: 'deliveryPlace', onCell: () => ({ style: { minWidth: 90 } }) },
    { title: '納入場所郵便番号', dataIndex: 'deliveryZip', key: 'deliveryZip', onCell: () => ({ style: { minWidth: 162 } }) },
    { title: '納入場所住所', dataIndex: 'deliveryAddress', key: 'deliveryAddress', onCell: () => ({ style: { minWidth: 162 } }) },
    { title: '統一電話番号', dataIndex: 'unifiedTel', key: 'unifiedTel', onCell: () => ({ style: { minWidth: 126 } }) },
    { title: '物品コード', dataIndex: 'itemCode', key: 'itemCode', onCell: () => ({ style: { minWidth: 90 } }) },
    { title: '品名', dataIndex: 'itemName', key: 'itemName', onCell: () => ({ style: { minWidth: 72 } }) },
    { title: '注文記号', dataIndex: 'orderMark', key: 'orderMark', onCell: () => ({ style: { minWidth: 108 } }) },
    { title: '仕様書番号', dataIndex: 'specNumber', key: 'specNumber', onCell: () => ({ style: { minWidth: 126 } }) },
    { title: '数量', dataIndex: 'quantity', key: 'quantity', onCell: () => ({ style: { minWidth: 72 } }) },
    { title: '版数', dataIndex: 'edition', key: 'edition', onCell: () => ({ style: { minWidth: 72 } }) },
    { title: '単価', dataIndex: 'unitPrice', key: 'unitPrice', render: (v: number) => v.toLocaleString(), onCell: () => ({ style: { minWidth: 90 } }) },
    { title: '合計', dataIndex: 'amount', key: 'amount', render: (v: number) => v.toLocaleString(), onCell: () => ({ style: { minWidth: 72 } }) },
    {
      title: '操作',
      key: 'more',
      fixed: 'right' as const,
      onCell: () => ({ style: { minWidth: 72 } }),
      render: (_: any, record: OrderItem) => {
        const menu = (
          <Menu>
            <Menu.Item key="view" icon={<EyeOutlined />} onClick={() => handleView(record)}>
              参照
            </Menu.Item>
            <Menu.Item key="edit" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
              編集
            </Menu.Item>
            <Menu.Item key="delete" icon={<DeleteOutlined />} danger onClick={() => handleDelete(record.key)}>
              削除
            </Menu.Item>
          </Menu>
        );
        return (
          <Dropdown overlay={menu} trigger={["click"]} placement="bottomRight">
            <Button icon={<EllipsisOutlined />} size="small" />
          </Dropdown>
        );
      },
    },
  ];

  return (
    <Card style={{ borderRadius: 12, boxShadow: '0 2px 8px #f0f1f2', margin: 24, background: '#fff' }}>
      {/* 画面タイトル */}
      <Title level={4} style={{ marginBottom: 24 }}>注文一覧</Title>
      {/* 検索パネル */}
      <Card style={{ marginBottom: 16, borderRadius: 8, boxShadow: '0 1px 4px #e0e0e0', background: '#fafbfc' }} bodyStyle={{ padding: 16 }}>
        <Space wrap align="center">
          <Input
            placeholder="取引番号"
            allowClear
            style={{ width: 160 }}
            value={searchTransactionId}
            onChange={e => setSearchTransactionId(e.target.value)}
          />
          <DatePicker.RangePicker
            value={searchOrderDateRange}
            onChange={range => setSearchOrderDateRange(range as [dayjs.Dayjs | null, dayjs.Dayjs | null])}
            style={{ width: 260 }}
            allowClear
            placeholder={["注文年月日(開始)", "注文年月日(終了)"]}
          />
          <InputNumber
            placeholder="注文合計金額(最小)"
            value={searchTotalAmountRange[0]}
            onChange={val => setSearchTotalAmountRange([val, searchTotalAmountRange[1]])}
            style={{ width: 140 }}
            min={0}
          />
          <InputNumber
            placeholder="注文合計金額(最大)"
            value={searchTotalAmountRange[1]}
            onChange={val => setSearchTotalAmountRange([searchTotalAmountRange[0], val])}
            style={{ width: 140 }}
            min={0}
          />
          <DatePicker.RangePicker
            value={searchDeliveryDateRange}
            onChange={range => setSearchDeliveryDateRange(range as [dayjs.Dayjs | null, dayjs.Dayjs | null])}
            style={{ width: 260 }}
            allowClear
            placeholder={["納期(開始)", "納期(終了)"]}
          />
          <Input
            placeholder="納入場所"
            allowClear
            style={{ width: 160 }}
            value={searchDeliveryPlace}
            onChange={e => setSearchDeliveryPlace(e.target.value)}
          />
          <Input
            placeholder="品名"
            allowClear
            style={{ width: 160 }}
            value={searchItemName}
            onChange={e => setSearchItemName(e.target.value)}
          />
          <Button onClick={() => {
            setSearchTransactionId('');
            setSearchOrderDateRange([null, null]);
            setSearchTotalAmountRange([null, null]);
            setSearchDeliveryDateRange([null, null]);
            setSearchDeliveryPlace('');
            setSearchItemName('');
          }}>条件クリア</Button>
        </Space>
      </Card>
      {/* 一括操作ボタン */}
      {selectedRowKeys.length > 0 && (
        <Button type="primary" style={{ marginBottom: 12 }} onClick={() => {
          Modal.confirm({
            title: `選択した${selectedRowKeys.length}件を応諾しますか？`,
            okText: 'はい',
            cancelText: 'いいえ',
            onOk: () => {
              setData(prev => prev.map(item =>
                selectedRowKeys.includes(item.key)
                  ? { ...item, status: '応諾済み' }
                  : item
              ));
              setSelectedRowKeys([]);
              setCurrentPage(1);
            },
          });
        }}>
          選択した{selectedRowKeys.length}件を応諾
        </Button>
      )}
      <Table
        columns={columns}
        dataSource={filteredData}
        pagination={{
          position: ['bottomCenter'],
          current: currentPage,
          pageSize: pageSize,
          total: filteredData.length,
          showSizeChanger: true,
          pageSizeOptions: [10, 20, 50],
          onChange: (page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          },
        }}
        rowKey="key"
        bordered
        size="middle"
        rowClassName={(_, idx) => idx % 2 === 0 ? 'modern-table-row-even' : 'modern-table-row-odd'}
        style={{ borderRadius: 12, marginTop: 8, overflowX: 'auto' }}
        scroll={{ x: true }}
        rowSelection={rowSelection}
        sticky
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
        title={editingItem ? '注文編集' : '注文登録'}
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={() => setIsModalOpen(false)}
        okText="保存"
        cancelText="キャンセル"
        width={editingItem ? 800 : 600}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="transactionId" label="取引番号" rules={[{ required: true, message: '取引番号を入力してください' }]}> <Input /> </Form.Item>
          <Form.Item name="orderDate" label="注文年月日" rules={[{ required: true, message: '注文年月日を入力してください' }]}> <DatePicker style={{ width: '100%' }} /> </Form.Item>
          <Form.Item name="totalAmount" label="注文合計金額" rules={[{ required: true, message: '注文合計金額を入力してください' }]}> <InputNumber min={0} style={{ width: '100%' }} /> </Form.Item>
          <Form.Item name="emergencyType" label="緊急区分" rules={[{ required: true, message: '緊急区分を入力してください' }]}> <Input /> </Form.Item>
          <Form.Item name="requesterCompany" label="要求元会社名" rules={[{ required: true, message: '要求元会社名を入力してください' }]}> <Input /> </Form.Item>
          <Form.Item name="orgCode" label="発注部課組織コード" rules={[{ required: true, message: '発注部課組織コードを入力してください' }]}> <Input /> </Form.Item>
          <Form.Item name="orgName" label="発注部課名" rules={[{ required: true, message: '発注部課名を入力してください' }]}> <Input /> </Form.Item>
          <Form.Item name="estimateNumber" label="見積番号" rules={[{ required: true, message: '見積番号を入力してください' }]}> <Input /> </Form.Item>
          <Form.Item name="requestNumber" label="要求番号" rules={[{ required: true, message: '要求番号を入力してください' }]}> <Input /> </Form.Item>
          <Form.Item name="personInCharge" label="担当者" rules={[{ required: true, message: '担当者を入力してください' }]}> <Input /> </Form.Item>
          <Form.Item name="deliveryDate" label="納期" rules={[{ required: true, message: '納期を入力してください' }]}> <DatePicker style={{ width: '100%' }} /> </Form.Item>
          <Form.Item name="receiveShopCode" label="受取販売店コード" rules={[{ required: true, message: '受取販売店コードを入力してください' }]}> <Input /> </Form.Item>
          <Form.Item name="receiveExtraShopCode" label="受取付加販売店コード" rules={[{ required: true, message: '受取付加販売店コードを入力してください' }]}> <Input /> </Form.Item>
          <Form.Item name="receiveShopName" label="受取販売店名" rules={[{ required: true, message: '受取販売店名を入力してください' }]}> <Input /> </Form.Item>
          <Form.Item name="receiveShopTel" label="受取販売店電話番号" rules={[{ required: true, message: '受取販売店電話番号を入力してください' }]}> <Input /> </Form.Item>
          <Form.Item name="shippingCode" label="送付先コード" rules={[{ required: true, message: '送付先コードを入力してください' }]}> <Input /> </Form.Item>
          <Form.Item name="deliveryPlace" label="納入場所" rules={[{ required: true, message: '納入場所を入力してください' }]}> <Input /> </Form.Item>
          <Form.Item name="deliveryZip" label="納入場所郵便番号" rules={[{ required: true, message: '納入場所郵便番号を入力してください' }]}> <Input /> </Form.Item>
          <Form.Item name="deliveryAddress" label="納入場所住所" rules={[{ required: true, message: '納入場所住所を入力してください' }]}> <Input /> </Form.Item>
          <Form.Item name="unifiedTel" label="統一電話番号" rules={[{ required: true, message: '統一電話番号を入力してください' }]}> <Input /> </Form.Item>
          <Form.Item name="itemCode" label="物品コード" rules={[{ required: true, message: '物品コードを入力してください' }]}> <Input /> </Form.Item>
          <Form.Item name="itemName" label="品名" rules={[{ required: true, message: '品名を入力してください' }]}> <Input /> </Form.Item>
          <Form.Item name="orderMark" label="注文記号" rules={[{ required: true, message: '注文記号を入力してください' }]}> <Input /> </Form.Item>
          <Form.Item name="specNumber" label="仕様書番号" rules={[{ required: true, message: '仕様書番号を入力してください' }]}> <Input /> </Form.Item>
          <Form.Item name="quantity" label="数量" rules={[{ required: true, message: '数量を入力してください' }]}> <InputNumber min={1} style={{ width: '100%' }} /> </Form.Item>
          <Form.Item name="edition" label="版数" rules={[{ required: true, message: '版数を入力してください' }]}> <Input /> </Form.Item>
          <Form.Item name="unitPrice" label="単価" rules={[{ required: true, message: '単価を入力してください' }]}> <InputNumber min={0} style={{ width: '100%' }} /> </Form.Item>
          <Form.Item name="amount" label="合計" rules={[{ required: true, message: '合計を入力してください' }]}> <InputNumber min={0} style={{ width: '100%' }} /> </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="注文詳細"
        open={isViewModalOpen}
        onCancel={() => setIsViewModalOpen(false)}
        footer={null}
        width={800}
      >
        {viewItem && (
          <Descriptions column={2} bordered size="middle" labelStyle={{ color: '#888', fontWeight: 500, width: 120 }} contentStyle={{ fontWeight: 600, background: '#f6f8fa' }}>
            <Descriptions.Item label="取引番号">{viewItem.transactionId}</Descriptions.Item>
            <Descriptions.Item label="注文年月日">{viewItem.orderDate}</Descriptions.Item>
            <Descriptions.Item label="注文合計金額">{viewItem.totalAmount.toLocaleString()}</Descriptions.Item>
            <Descriptions.Item label="緊急区分">{viewItem.emergencyType}</Descriptions.Item>
            <Descriptions.Item label="要求元会社名">{viewItem.requesterCompany}</Descriptions.Item>
            <Descriptions.Item label="発注部課組織コード">{viewItem.orgCode}</Descriptions.Item>
            <Descriptions.Item label="発注部課名">{viewItem.orgName}</Descriptions.Item>
            <Descriptions.Item label="見積番号">{viewItem.estimateNumber}</Descriptions.Item>
            <Descriptions.Item label="要求番号">{viewItem.requestNumber}</Descriptions.Item>
            <Descriptions.Item label="担当者">{viewItem.personInCharge}</Descriptions.Item>
            <Descriptions.Item label="納期">{viewItem.deliveryDate}</Descriptions.Item>
            <Descriptions.Item label="受取販売店コード">{viewItem.receiveShopCode}</Descriptions.Item>
            <Descriptions.Item label="受取付加販売店コード">{viewItem.receiveExtraShopCode}</Descriptions.Item>
            <Descriptions.Item label="受取販売店名">{viewItem.receiveShopName}</Descriptions.Item>
            <Descriptions.Item label="受取販売店電話番号">{viewItem.receiveShopTel}</Descriptions.Item>
            <Descriptions.Item label="送付先コード">{viewItem.shippingCode}</Descriptions.Item>
            <Descriptions.Item label="納入場所">{viewItem.deliveryPlace}</Descriptions.Item>
            <Descriptions.Item label="納入場所郵便番号">{viewItem.deliveryZip}</Descriptions.Item>
            <Descriptions.Item label="納入場所住所">{viewItem.deliveryAddress}</Descriptions.Item>
            <Descriptions.Item label="統一電話番号">{viewItem.unifiedTel}</Descriptions.Item>
            <Descriptions.Item label="物品コード">{viewItem.itemCode}</Descriptions.Item>
            <Descriptions.Item label="品名">{viewItem.itemName}</Descriptions.Item>
            <Descriptions.Item label="注文記号">{viewItem.orderMark}</Descriptions.Item>
            <Descriptions.Item label="仕様書番号">{viewItem.specNumber}</Descriptions.Item>
            <Descriptions.Item label="数量">{viewItem.quantity}</Descriptions.Item>
            <Descriptions.Item label="版数">{viewItem.edition}</Descriptions.Item>
            <Descriptions.Item label="単価">{viewItem.unitPrice.toLocaleString()}</Descriptions.Item>
            <Descriptions.Item label="合計">{viewItem.amount.toLocaleString()}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </Card>
  );
};

export default OrderList; 