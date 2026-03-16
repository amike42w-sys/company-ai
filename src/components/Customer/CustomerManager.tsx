import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Input,
  Modal,
  Form,
  message,
  Tooltip,
  Row,
  Col,
  Typography,
  Divider,
  Select,
  Tabs,
  Descriptions,
  Badge,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SearchOutlined,
  TeamOutlined,
  DollarOutlined,
  FileTextOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';

const { Option } = Select;
const { TabPane } = Tabs;
import { useAuthStore } from '../../store/authStore';
import { api } from '../../services/api';

const { Title, Text } = Typography;

// 客户等级类型
type CustomerLevel = 'S' | 'A' | 'B' | 'C';

// 报价单类型
interface Quotation {
  id: string;
  customerId?: string;
  customerName: string;
  standard: string;
  standardRate: number;
  items: any[];
  totalAmount: number;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'ordered';
  createdAt: string;
  notes?: string;
}

// 客户数据类型
interface Customer {
  id: string;
  customerLevel: CustomerLevel;
  date: string;
  region: string;
  constructionType: string;
  productType: string;
  customerName: string;
  progress: string;
  notes: string;
  requirement: string;
  completionDate: string;
  personInCharge: string;
  createdAt: string;
}

// 证书类型
interface Certificate {
  id: string;
  companyId: string;
  companyName: string;
  name: string;
  standard: string;
  category: string;
  issueDate: string;
  expiryDate: string;
  issuingAuthority: string;
  status: string;
}

const CustomerManager: React.FC = () => {
  const { role } = useAuthStore();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerQuotations, setCustomerQuotations] = useState<Quotation[]>([]);
  const [form] = Form.useForm();

  const isAdmin = role === 'internal' || role === 'certificate_admin';

  useEffect(() => {
    fetchCustomers();
    fetchQuotations();
    fetchCertificates();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    setTimeout(() => {
      setCustomers([
        {
          id: '1',
          customerLevel: 'S',
          date: '4月12日',
          region: '横琴',
          constructionType: 'ACU项目',
          productType: '集装箱房屋',
          customerName: 'Jack Lee',
          progress: '已下单',
          notes: '客户已支付定金',
          requirement: '客户需要10套集装箱房屋，用于工地临时办公和住宿，要求防火等级A级，配备空调和基本家具',
          completionDate: '4月28日',
          personInCharge: '张经理',
          createdAt: '2024-04-10',
        },
        {
          id: '2',
          customerLevel: 'A',
          date: '4月17日',
          region: '佛山',
          constructionType: '公共建筑',
          productType: '集装箱办公室',
          customerName: '佛山市政',
          progress: '方案已发送',
          notes: '客户对方案比较满意，正在走审批流程',
          requirement: '市政部门需要5套集装箱办公室，用于临时办公场所',
          completionDate: '5月5日',
          personInCharge: '李工程师',
          createdAt: '2024-04-15',
        },
        {
          id: '3',
          customerLevel: 'B',
          date: '4月20日',
          region: '深圳',
          constructionType: '循环建筑',
          productType: '定制集装箱',
          customerName: '深圳华瑞',
          progress: '沟通中',
          notes: '客户还在比较价格',
          requirement: '需要定制化集装箱房屋，用于高端临时办公',
          completionDate: '5月10日',
          personInCharge: '王主管',
          createdAt: '2024-04-18',
        },
        {
          id: '4',
          customerLevel: 'C',
          date: '4月21日',
          region: '广州',
          constructionType: '商业',
          productType: '集装箱展厅',
          customerName: '广州商茂',
          progress: '初步联系',
          notes: '可能是同行试探，先保持联系',
          requirement: '商业广场需要临时展厅，展示新产品',
          completionDate: '5月15日',
          personInCharge: '陈经理',
          createdAt: '2024-04-20',
        },
        {
          id: '5',
          customerLevel: 'B',
          date: '4月23日',
          region: '珠海',
          constructionType: '住宅',
          productType: '集装箱宿舍',
          customerName: '珠海酒店管理公司',
          progress: '需求确认中',
          notes: '客户正在考虑宿舍数量',
          requirement: '酒店需要临时员工宿舍，解决人员住宿问题',
          completionDate: '5月20日',
          personInCharge: '刘主管',
          createdAt: '2024-04-22',
        },
        {
          id: '6',
          customerLevel: 'C',
          date: '4月25日',
          region: '中山',
          constructionType: '工业',
          productType: '集装箱仓库',
          customerName: '中山物流公司',
          progress: '初步联系',
          notes: '刚打电话来问问价格',
          requirement: '想了解集装箱仓库的价格',
          completionDate: '待定',
          personInCharge: '张经理',
          createdAt: '2024-04-25',
        },
      ]);
      setLoading(false);
    }, 500);
  };

  const fetchQuotations = async () => {
    try {
      const result = await api.getQuotations();
      if (result.success) {
        const formattedQuotations = result.quotations.map((q: any) => ({
          ...q,
          createdAt: new Date(q.createdAt).toISOString().split('T')[0],
        }));
        setQuotations(formattedQuotations);
      }
    } catch (error) {
      console.error('获取报价单失败:', error);
      setQuotations([]);
    }
  };

  const fetchCertificates = async () => {
    try {
      const result = await api.getCertificates();
      if (result.success) {
        setCertificates(result.certificates);
      }
    } catch (error) {
      console.error('获取证书失败:', error);
    }
  };

  const handleAdd = () => {
    setEditingCustomer(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record: Customer) => {
    setEditingCustomer(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleViewDetail = (record: Customer) => {
    setSelectedCustomer(record);
    const relatedQuotations = quotations.filter(q => q.customerName === record.customerName);
    setCustomerQuotations(relatedQuotations);
    setIsDetailModalVisible(true);
  };

  const handleDelete = async (_id: string) => {
    message.success('客户删除成功');
    fetchCustomers();
  };

  const handleSubmit = async (_values: any) => {
    message.success(editingCustomer ? '客户更新成功' : '客户添加成功');
    setIsModalVisible(false);
    fetchCustomers();
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.customerLevel.toLowerCase().includes(searchText.toLowerCase()) ||
      customer.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
      customer.personInCharge.toLowerCase().includes(searchText.toLowerCase()) ||
      customer.region.toLowerCase().includes(searchText.toLowerCase())
  );

  const getStatusTag = (status: string) => {
    const statusMap: Record<string, { color: string; text: string }> = {
      draft: { color: 'blue', text: '草稿' },
      sent: { color: 'green', text: '已发送' },
      accepted: { color: 'purple', text: '已接受' },
      rejected: { color: 'red', text: '已拒绝' },
      ordered: { color: 'gold', text: '已下单' },
    };
    const { color, text } = statusMap[status] || { color: 'default', text: status };
    return <Tag color={color}>{text}</Tag>;
  };

  const getStandardTag = (standard: string) => {
    const colorMap: Record<string, string> = {
      '国标': 'blue',
      '澳标': 'green',
      '港标': 'orange',
      '欧标': 'purple',
      '美标': 'red',
      '日标': 'cyan',
    };
    return <Tag color={colorMap[standard] || 'default'}>{standard}</Tag>;
  };

  const isExpired = (expiryDate: string) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  const columns = [
    {
      title: '客户等级',
      dataIndex: 'customerLevel',
      key: 'customerLevel',
      width: 100,
      render: (level: string) => {
        let color = 'default';
        let desc = '';
        if (level === 'S') {
          color = 'red';
          desc = '已下单';
        } else if (level === 'A') {
          color = 'gold';
          desc = '交易成功率较高';
        } else if (level === 'B') {
          color = 'blue';
          desc = '还在观望';
        } else if (level === 'C') {
          color = 'default';
          desc = '问问/同行试探';
        }
        return (
          <Tooltip title={desc}>
            <Tag color={color} style={{ cursor: 'help' }}>
              {level}级
            </Tag>
          </Tooltip>
        );
      },
    },
    {
      title: '时间',
      dataIndex: 'date',
      key: 'date',
      width: 100,
    },
    {
      title: '地区',
      dataIndex: 'region',
      key: 'region',
      width: 100,
    },
    {
      title: '建筑类型',
      dataIndex: 'constructionType',
      key: 'constructionType',
      width: 120,
    },
    {
      title: '产品种类',
      dataIndex: 'productType',
      key: 'productType',
      width: 120,
    },
    {
      title: '客户名称',
      dataIndex: 'customerName',
      key: 'customerName',
      width: 150,
    },
    {
      title: '进度',
      dataIndex: 'progress',
      key: 'progress',
      width: 120,
      render: (progress: string) => {
        let color = 'blue';
        if (progress === '已下单') color = 'green';
        if (progress === '方案已发送') color = 'gold';
        if (progress === '需求确认中') color = 'orange';
        return <Tag color={color}>{progress}</Tag>;
      },
    },
    {
      title: '报价/订单',
      key: 'quotations',
      width: 100,
      render: (_: any, record: Customer) => {
        const relatedQuotations = quotations.filter(q => q.customerName === record.customerName);
        const orderCount = relatedQuotations.filter(q => q.status === 'ordered').length;
        const quotationCount = relatedQuotations.length;
        return (
          <Tooltip title={`${quotationCount}个报价单，${orderCount}个订单`}>
            <Badge count={quotationCount} style={{ marginRight: 8 }}>
              <DollarOutlined style={{ fontSize: 16, color: '#1890ff' }} />
            </Badge>
            {orderCount > 0 && (
              <Badge count={orderCount} style={{ backgroundColor: '#52c41a' }}>
                <FileTextOutlined style={{ fontSize: 16, color: '#52c41a' }} />
              </Badge>
            )}
          </Tooltip>
        );
      },
    },
    {
      title: '负责人',
      dataIndex: 'personInCharge',
      key: 'personInCharge',
      width: 100,
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      align: 'left' as const,
      render: (_: any, record: Customer) => (
        <Space size="small">
          <Tooltip title="查看详情">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handleViewDetail(record)}
            />
          </Tooltip>
          {isAdmin && (
            <>
              <Tooltip title="编辑">
                <Button
                  type="text"
                  icon={<EditOutlined />}
                  onClick={() => handleEdit(record)}
                />
              </Tooltip>
              <Tooltip title="删除">
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleDelete(record.id)}
                />
              </Tooltip>
            </>
          )}
        </Space>
      ),
    },
  ];

  const quotationColumns = [
    {
      title: '报价单号',
      dataIndex: 'id',
      key: 'id',
      width: 120,
      render: (id: string) => `QT-${id.slice(-6).toUpperCase()}`,
    },
    {
      title: '标准类型',
      dataIndex: 'standard',
      key: 'standard',
      width: 100,
      render: (standard: string) => getStandardTag(standard || '国标'),
    },
    {
      title: '总金额',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 120,
      render: (amount: number) => <Text strong style={{ color: '#cf1322' }}>¥{amount.toFixed(2)}</Text>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => getStatusTag(status),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
    },
  ];

  const certificateColumns = [
    {
      title: '证书名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: '标准类型',
      dataIndex: 'standard',
      key: 'standard',
      width: 100,
      render: (standard: string) => getStandardTag(standard),
    },
    {
      title: '有效期至',
      dataIndex: 'expiryDate',
      key: 'expiryDate',
      width: 120,
      render: (date: string) => (
        <Text type={isExpired(date) ? 'danger' : undefined}>
          {date}
          {isExpired(date) && (
            <Tooltip title="证书已过期">
              <Tag color="red" style={{ marginLeft: 4 }}>已过期</Tag>
            </Tooltip>
          )}
        </Text>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string, record: Certificate) => (
        <Tag color={isExpired(record.expiryDate) ? 'red' : 'green'}>
          {isExpired(record.expiryDate) ? '已过期' : status}
        </Tag>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>
        <TeamOutlined style={{ marginRight: 12 }} />
        客户管理系统
      </Title>
      <Text type="secondary">管理客户信息、联系方式、合作状态、报价单和订单</Text>

      <Divider />

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={16}>
          <Input
            placeholder="搜索客户等级、客户名称、负责人或地区"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 400 }}
          />
        </Col>
        <Col span={8} style={{ textAlign: 'right' }}>
          {isAdmin && (
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              添加客户
            </Button>
          )}
        </Col>
      </Row>

      <Card>
        <Table
          columns={columns}
          dataSource={filteredCustomers}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1400 }}
        />
      </Card>

      <Modal
        title={editingCustomer ? '编辑客户' : '添加客户'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="customerLevel"
                label="客户等级"
                rules={[{ required: true, message: '请选择客户等级' }]}
              >
                <Select placeholder="请选择客户等级">
                  <Option value="S">S级 - 已下单</Option>
                  <Option value="A">A级 - 交易成功率较高</Option>
                  <Option value="B">B级 - 还在观望</Option>
                  <Option value="C">C级 - 问问/同行试探</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="date"
                label="时间"
                rules={[{ required: true, message: '请输入时间' }]}
              >
                <Input placeholder="如：4月12日" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="region"
                label="地区"
                rules={[{ required: true, message: '请输入地区' }]}
              >
                <Input placeholder="请输入地区" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="constructionType"
                label="建筑类型"
                rules={[{ required: true, message: '请输入建筑类型' }]}
              >
                <Input placeholder="请输入建筑类型" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="productType"
                label="产品种类"
                rules={[{ required: true, message: '请输入产品种类' }]}
              >
                <Input placeholder="请输入产品种类" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="customerName"
                label="客户名称"
                rules={[{ required: true, message: '请输入客户名称' }]}
              >
                <Input placeholder="请输入客户名称" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="progress"
                label="进度"
                rules={[{ required: true, message: '请选择进度' }]}
              >
                <Select placeholder="请选择进度">
                  <Option value="初步联系">初步联系</Option>
                  <Option value="需求确认中">需求确认中</Option>
                  <Option value="沟通中">沟通中</Option>
                  <Option value="方案已发送">方案已发送</Option>
                  <Option value="已下单">已下单</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="personInCharge"
                label="负责人"
                rules={[{ required: true, message: '请输入负责人' }]}
              >
                <Input placeholder="请输入负责人" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="notes" label="备注">
            <Input.TextArea rows={2} placeholder="请输入备注信息" />
          </Form.Item>
          <Form.Item
            name="requirement"
            label="客户需求"
            rules={[{ required: true, message: '请输入客户需求' }]}
          >
            <Input.TextArea rows={3} placeholder="请输入客户需求" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="completionDate" label="完成时间">
                <Input placeholder="如：4月28日" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      <Modal
        title={
          <Space>
            <TeamOutlined />
            客户详情 - {selectedCustomer?.customerName}
          </Space>
        }
        open={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsDetailModalVisible(false)}>
            关闭
          </Button>,
        ]}
        width={900}
      >
        {selectedCustomer && (
          <Tabs defaultActiveKey="info">
            <TabPane
              tab={
                <span>
                  <TeamOutlined />
                  基本信息
                </span>
              }
              key="info"
            >
              <Descriptions bordered column={2}>
                <Descriptions.Item label="客户等级">
                  <Tag color={selectedCustomer.customerLevel === 'S' ? 'red' : 
                    selectedCustomer.customerLevel === 'A' ? 'gold' : 
                    selectedCustomer.customerLevel === 'B' ? 'blue' : 'default'}>
                    {selectedCustomer.customerLevel}级
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="时间">{selectedCustomer.date}</Descriptions.Item>
                <Descriptions.Item label="地区">{selectedCustomer.region}</Descriptions.Item>
                <Descriptions.Item label="建筑类型">{selectedCustomer.constructionType}</Descriptions.Item>
                <Descriptions.Item label="产品种类">{selectedCustomer.productType}</Descriptions.Item>
                <Descriptions.Item label="进度">
                  <Tag color={selectedCustomer.progress === '已下单' ? 'green' : 'blue'}>
                    {selectedCustomer.progress}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="负责人">{selectedCustomer.personInCharge}</Descriptions.Item>
                <Descriptions.Item label="完成时间">{selectedCustomer.completionDate}</Descriptions.Item>
                <Descriptions.Item label="客户需求" span={2}>
                  {selectedCustomer.requirement}
                </Descriptions.Item>
                <Descriptions.Item label="备注" span={2}>
                  {selectedCustomer.notes || '无'}
                </Descriptions.Item>
              </Descriptions>
            </TabPane>

            <TabPane
              tab={
                <span>
                  <DollarOutlined />
                  报价单 ({customerQuotations.length})
                </span>
              }
              key="quotations"
            >
              {customerQuotations.length > 0 ? (
                <Table
                  columns={quotationColumns}
                  dataSource={customerQuotations}
                  rowKey="id"
                  pagination={false}
                />
              ) : (
                <div style={{ textAlign: 'center', padding: 40 }}>
                  <DollarOutlined style={{ fontSize: 48, color: '#d9d9d9' }} />
                  <p style={{ color: '#999', marginTop: 16 }}>暂无报价单</p>
                </div>
              )}
            </TabPane>

            <TabPane
              tab={
                <span>
                  <FileTextOutlined />
                  订单 ({customerQuotations.filter(q => q.status === 'ordered').length})
                </span>
              }
              key="orders"
            >
              {customerQuotations.filter(q => q.status === 'ordered').length > 0 ? (
                <Table
                  columns={quotationColumns}
                  dataSource={customerQuotations.filter(q => q.status === 'ordered')}
                  rowKey="id"
                  pagination={false}
                />
              ) : (
                <div style={{ textAlign: 'center', padding: 40 }}>
                  <FileTextOutlined style={{ fontSize: 48, color: '#d9d9d9' }} />
                  <p style={{ color: '#999', marginTop: 16 }}>暂无订单</p>
                </div>
              )}
            </TabPane>

            <TabPane
              tab={
                <span>
                  <SafetyCertificateOutlined />
                  相关证书
                </span>
              }
              key="certificates"
            >
              <div style={{ marginBottom: 16 }}>
                <Text type="secondary">
                  查看产品相关的证书标准信息，了解不同标准的认证要求
                </Text>
              </div>
              <Table
                columns={certificateColumns}
                dataSource={certificates}
                rowKey="id"
                pagination={{ pageSize: 5 }}
              />
            </TabPane>
          </Tabs>
        )}
      </Modal>
    </div>
  );
};

export default CustomerManager;
