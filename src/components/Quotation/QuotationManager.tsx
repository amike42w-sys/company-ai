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
  InputNumber,
  Checkbox,
  AutoComplete,
  Descriptions,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SearchOutlined,
  DollarOutlined,
  SaveOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '../../store/authStore';
import { api } from '../../services/api';

const { Title, Text } = Typography;
const { Option } = Select;

// 标准价格系数配置
const STANDARD_PRICE_RATES: Record<string, number> = {
  '国标': 1.0,
  '澳标': 1.35,
  '港标': 1.25,
  '欧标': 1.40,
  '美标': 1.30,
  '日标': 1.20,
};

// 产品数据类型
interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  unit: string;
  image?: string;
  options?: ProductOption[];
}

// 产品选项类型
interface ProductOption {
  id: string;
  name: string;
  price: number;
  description: string;
}

// 报价项目类型
interface QuotationItem {
  id: string;
  product: Product;
  quantity: number;
  options: string[];
  unitPrice: number;
  totalPrice: number;
}

// 报价单类型
interface Quotation {
  id: string;
  customerId?: string;
  customerName: string;
  standard: string;
  standardRate: number;
  items: QuotationItem[];
  totalAmount: number;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'ordered';
  createdAt: string;
  notes?: string;
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

const QuotationManager: React.FC = () => {
  const { role } = useAuthStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCreateQuotationVisible, setIsCreateQuotationVisible] = useState(false);
  const [isViewQuotationVisible, setIsViewQuotationVisible] = useState(false);
  const [editingQuotation, setEditingQuotation] = useState<Quotation | null>(null);
  const [viewingQuotation, setViewingQuotation] = useState<Quotation | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<QuotationItem[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [selectedStandard, setSelectedStandard] = useState<string>('国标');
  const [quotationForm] = Form.useForm();

  const isAdmin = role === 'internal';

  useEffect(() => {
    fetchProducts();
    fetchQuotations();
    fetchCertificates();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setTimeout(() => {
      setProducts([
        {
          id: '1',
          name: '集装箱房屋',
          category: '标准产品',
          price: 12000,
          description: '20尺标准集装箱房屋，含基础装修',
          unit: '个',
          options: [
            {
              id: '1-1',
              name: '豪华装修',
              price: 3000,
              description: '包含吊顶、地板、墙面装修',
            },
            {
              id: '1-2',
              name: '空调系统',
              price: 1500,
              description: '1.5匹壁挂式空调',
            },
          ],
        },
        {
          id: '2',
          name: '活动板房',
          category: '标准产品',
          price: 8000,
          description: '标准活动板房，含基础配置',
          unit: '平方米',
        },
        {
          id: '3',
          name: '钢结构别墅',
          category: '定制产品',
          price: 2500,
          description: '轻钢结构别墅，按平方米计价',
          unit: '平方米',
          options: [
            {
              id: '3-1',
              name: '高端装修',
              price: 1000,
              description: '豪华装修标准',
            },
          ],
        },
        {
          id: '4',
          name: '移动岗亭',
          category: '标准产品',
          price: 6000,
          description: '标准移动岗亭，含基础配置',
          unit: '个',
        },
      ]);
      setLoading(false);
    }, 500);
  };

  const fetchQuotations = async () => {
    setLoading(true);
    try {
      const result = await api.getQuotations();
      if (result.success) {
        const formattedQuotations = result.quotations.map((q: any) => ({
          ...q,
          createdAt: new Date(q.createdAt).toISOString().split('T')[0],
        }));
        setQuotations(formattedQuotations);
      } else {
        setQuotations([]);
      }
    } catch (error) {
      console.error('获取报价单错误:', error);
      setQuotations([]);
    } finally {
      setLoading(false);
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

  const handleCreateQuotation = () => {
    setSelectedProducts([]);
    setTotalAmount(0);
    setSelectedStandard('国标');
    quotationForm.resetFields();
    quotationForm.setFieldsValue({ standard: '国标', status: 'draft' });
    setEditingQuotation(null);
    setIsCreateQuotationVisible(true);
  };

  const handleEditQuotation = (record: Quotation) => {
    setEditingQuotation(record);
    quotationForm.setFieldsValue(record);
    setSelectedProducts(record.items);
    setTotalAmount(record.totalAmount);
    setSelectedStandard(record.standard || '国标');
    setIsCreateQuotationVisible(true);
  };

  const handleViewQuotation = (record: Quotation) => {
    setViewingQuotation(record);
    setIsViewQuotationVisible(true);
  };

  const handleDeleteQuotation = async (id: string) => {
    try {
      const result = await api.deleteQuotation(id);
      if (result.success) {
        setQuotations(quotations.filter(quotation => quotation.id !== id));
        message.success('报价单删除成功');
      } else {
        message.error(result.message || '删除失败');
      }
    } catch (error) {
      console.error('删除报价单错误:', error);
      message.error('删除报价单失败');
    }
  };

  const handleStandardChange = (standard: string) => {
    setSelectedStandard(standard);
    const rate = STANDARD_PRICE_RATES[standard] || 1.0;
    const updatedItems = selectedProducts.map(item => ({
      ...item,
      unitPrice: Math.round(item.product.price * rate),
      totalPrice: Math.round(item.product.price * rate * item.quantity),
    }));
    setSelectedProducts(updatedItems);
    calculateTotal(updatedItems);
  };

  const handleAddProduct = (product: Product) => {
    const rate = STANDARD_PRICE_RATES[selectedStandard] || 1.0;
    const newItem: QuotationItem = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      product,
      quantity: 1,
      options: [],
      unitPrice: Math.round(product.price * rate),
      totalPrice: Math.round(product.price * rate),
    };
    const updatedItems = [...selectedProducts, newItem];
    setSelectedProducts(updatedItems);
    calculateTotal(updatedItems);
    message.success(`${product.name} 添加成功，共 ${updatedItems.filter(item => item.product.id === product.id).length} 个`);
  };

  const handleRemoveProduct = (id: string) => {
    const updatedItems = selectedProducts.filter(item => item.id !== id);
    setSelectedProducts(updatedItems);
    calculateTotal(updatedItems);
  };

  const handleQuantityChange = (id: string, quantity: number) => {
    const updatedItems = selectedProducts.map(item => {
      if (item.id === id) {
        const updatedItem = {
          ...item,
          quantity,
          totalPrice: item.unitPrice * quantity,
        };
        return updatedItem;
      }
      return item;
    });
    setSelectedProducts(updatedItems);
    calculateTotal(updatedItems);
  };

  const handleOptionChange = (itemId: string, optionName: string, checked: boolean) => {
    const rate = STANDARD_PRICE_RATES[selectedStandard] || 1.0;
    const updatedItems = selectedProducts.map(item => {
      if (item.id === itemId) {
        let newOptions = [...item.options];
        if (checked) {
          newOptions.push(optionName);
        } else {
          newOptions = newOptions.filter(opt => opt !== optionName);
        }
        
        let newUnitPrice = Math.round(item.product.price * rate);
        item.product.options?.forEach(option => {
          if (newOptions.includes(option.name)) {
            newUnitPrice += Math.round(option.price * rate);
          }
        });
        
        const updatedItem = {
          ...item,
          options: newOptions,
          unitPrice: newUnitPrice,
          totalPrice: newUnitPrice * item.quantity,
        };
        return updatedItem;
      }
      return item;
    });
    setSelectedProducts(updatedItems);
    calculateTotal(updatedItems);
  };

  const calculateTotal = (items: QuotationItem[]) => {
    const total = items.reduce((sum, item) => sum + item.totalPrice, 0);
    setTotalAmount(total);
  };

  const handleQuotationSubmit = async (values: any) => {
    const standardRate = STANDARD_PRICE_RATES[values.standard] || 1.0;
    
    if (editingQuotation) {
      const hasChanges = 
        editingQuotation.customerName !== values.customerName ||
        editingQuotation.standard !== values.standard ||
        editingQuotation.status !== values.status ||
        editingQuotation.totalAmount !== totalAmount ||
        editingQuotation.notes !== values.notes ||
        JSON.stringify(editingQuotation.items) !== JSON.stringify(selectedProducts);
      
      if (!hasChanges) {
        message.warning('未检测到任何变化，无需更新');
        return;
      }
      
      try {
        const result = await api.updateQuotation(editingQuotation.id, {
          customerName: values.customerName,
          standard: values.standard,
          standardRate: standardRate,
          status: values.status,
          items: selectedProducts,
          totalAmount: totalAmount,
          notes: values.notes,
        });
        
        if (result.success) {
          await fetchQuotations();
          message.success('报价单更新成功');
          setIsCreateQuotationVisible(false);
        } else {
          message.error(result.message || '更新失败');
        }
      } catch (error) {
        console.error('更新报价单错误:', error);
        setTimeout(() => {
          message.error('更新报价单失败');
        }, 0);
      }
    } else {
      try {
        const result = await api.createQuotation({
          customerName: values.customerName,
          standard: values.standard,
          standardRate: standardRate,
          items: selectedProducts,
          totalAmount: totalAmount,
          status: values.status,
          notes: values.notes,
        });
        
        if (result.success) {
          await fetchQuotations();
          message.success('报价单创建成功');
          setIsCreateQuotationVisible(false);
        } else {
          message.error(result.message || '创建失败');
        }
      } catch (error) {
        console.error('创建报价单错误:', error);
        setTimeout(() => {
          message.error('创建报价单失败');
        }, 0);
      }
    }
  };

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

  const quotationColumns = [
    {
      title: '报价单号',
      dataIndex: 'id',
      key: 'id',
      width: 120,
      render: (id: string) => `QT-${id.slice(-6).toUpperCase()}`,
    },
    {
      title: '客户名称',
      dataIndex: 'customerName',
      key: 'customerName',
      width: 150,
    },
    {
      title: '标准类型',
      dataIndex: 'standard',
      key: 'standard',
      width: 100,
      render: (standard: string) => getStandardTag(standard || '国标'),
    },
    {
      title: '价格系数',
      dataIndex: 'standardRate',
      key: 'standardRate',
      width: 100,
      render: (rate: number) => `${((rate || 1) * 100).toFixed(0)}%`,
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
    {
      title: '操作',
      key: 'action',
      width: 180,
      align: 'left' as const,
      render: (_: any, record: Quotation) => (
        <Space size="small">
          <Tooltip title="查看详情">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handleViewQuotation(record)}
            />
          </Tooltip>
          {isAdmin && (
            <>
              <Tooltip title="编辑">
                <Button
                  type="text"
                  icon={<EditOutlined />}
                  onClick={() => handleEditQuotation(record)}
                />
              </Tooltip>
              <Tooltip title="删除">
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleDeleteQuotation(record.id)}
                />
              </Tooltip>
            </>
          )}
        </Space>
      ),
    },
  ];

  const availableStandards = [...new Set(certificates.map(c => c.standard))];

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>
        <DollarOutlined style={{ marginRight: 12 }} />
        报价管理系统
      </Title>
      <Text type="secondary">为客户创建和管理报价单，支持根据证书标准类型自动调整价格</Text>

      <Divider />

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={24} style={{ textAlign: 'right' }}>
          {isAdmin && (
            <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateQuotation}>
              创建报价单
            </Button>
          )}
        </Col>
      </Row>

      <Card style={{ marginBottom: 24 }}>
        <Title level={4}>报价单列表</Title>
        <Table
          columns={quotationColumns}
          dataSource={quotations}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1200 }}
        />
      </Card>

      <Modal
        title={editingQuotation ? '编辑报价单' : '创建报价单'}
        open={isCreateQuotationVisible}
        onCancel={() => setIsCreateQuotationVisible(false)}
        onOk={() => quotationForm.submit()}
        width={900}
        footer={[
          <Button key="cancel" onClick={() => setIsCreateQuotationVisible(false)}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={() => quotationForm.submit()}>
            <SaveOutlined />
            {editingQuotation ? '更新报价单' : '创建报价单'}
          </Button>,
        ]}
      >
        <Form form={quotationForm} layout="vertical" onFinish={handleQuotationSubmit}>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="customerName"
                label="客户名称"
                rules={[{ required: true, message: '请输入客户名称' }]}
              >
                <Input placeholder="请输入客户名称" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item 
                name="standard" 
                label="证书标准" 
                initialValue="国标"
                tooltip="选择不同的标准类型，价格会自动按系数调整"
              >
                <Select 
                  placeholder="请选择标准类型" 
                  onChange={handleStandardChange}
                  suffixIcon={<SafetyCertificateOutlined />}
                >
                  {availableStandards.length > 0 ? (
                    availableStandards.map(s => (
                      <Option key={s} value={s}>{s} ({((STANDARD_PRICE_RATES[s] || 1) * 100).toFixed(0)}%价格)</Option>
                    ))
                  ) : (
                    Object.entries(STANDARD_PRICE_RATES).map(([standard, rate]) => (
                      <Option key={standard} value={standard}>{standard} ({(rate * 100).toFixed(0)}%价格)</Option>
                    ))
                  )}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="status" label="状态" initialValue="draft">
                <Select placeholder="请选择状态">
                  <Option value="draft">草稿</Option>
                  <Option value="sent">已发送</Option>
                  <Option value="accepted">已接受</Option>
                  <Option value="rejected">已拒绝</Option>
                  <Option value="ordered">已下单</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Card size="small" style={{ marginBottom: 16, background: '#fafafa' }}>
            <Row gutter={16} align="middle">
              <Col span={12}>
                <Text>当前标准: <Tag color="blue">{selectedStandard}</Tag></Text>
                <Text style={{ marginLeft: 16 }}>价格系数: <Tag color="orange">{((STANDARD_PRICE_RATES[selectedStandard] || 1) * 100).toFixed(0)}%</Tag></Text>
              </Col>
              <Col span={12} style={{ textAlign: 'right' }}>
                <Text type="secondary">说明: 不同国家标准有不同认证要求，价格会有所调整</Text>
              </Col>
            </Row>
          </Card>
          
          <Form.Item label="报价项目">
            <div style={{ marginBottom: 16 }}>
              <Row gutter={[16, 16]} align="middle">
                <Col flex="auto">
                  <AutoComplete
                    style={{ width: '100%' }}
                    placeholder="输入产品名称搜索并添加..."
                    options={products.map(product => ({
                      value: product.name,
                      label: `${product.name} (¥${Math.round(product.price * (STANDARD_PRICE_RATES[selectedStandard] || 1))})`,
                      product: product,
                    }))}
                    filterOption={(inputValue, option) => {
                      return option!.value.toLowerCase().includes(inputValue.toLowerCase());
                    }}                    onSelect={(_, option) => {
                      handleAddProduct(option.product);
                    }}
                  >
                    <Input prefix={<SearchOutlined />} />
                  </AutoComplete>
                </Col>
                <Col>
                  <Text type="secondary">或点击添加：</Text>
                </Col>
              </Row>
              <Row gutter={[8, 8]} style={{ marginTop: 8 }}>
                {products.slice(0, 6).map((product) => (
                  <Col key={product.id}>
                    <Button
                      type="dashed"
                      size="small"
                      icon={<PlusOutlined />}
                      onClick={() => handleAddProduct(product)}
                    >
                      {product.name}
                    </Button>
                  </Col>
                ))}
              </Row>
            </div>
            {selectedProducts.length > 0 ? (
              <Table
                columns={[
                  {
                    title: '产品名称',
                    dataIndex: 'product',
                    key: 'product',
                    render: (product: Product) => product.name,
                  },
                  {
                    title: '单价',
                    dataIndex: 'unitPrice',
                    key: 'unitPrice',
                    render: (price: number) => `¥${price.toFixed(2)}`,
                  },
                  {
                    title: '数量',
                    dataIndex: 'quantity',
                    key: 'quantity',
                    render: (_: any, record: QuotationItem) => (
                      <InputNumber
                        min={1}
                        value={record.quantity}
                        onChange={(value) => handleQuantityChange(record.id, value || 1)}
                        style={{ width: 80 }}
                      />
                    ),
                  },
                  {
                    title: '配置',
                    dataIndex: 'options',
                    key: 'options',
                    render: (_: any, record: QuotationItem) => (
                      <div>
                        {record.product.options?.map((option) => (
                          <Checkbox
                            key={option.id}
                            checked={record.options.includes(option.name)}
                            onChange={(e) => handleOptionChange(record.id, option.name, e.target.checked)}
                          >
                            {option.name} (¥{Math.round(option.price * (STANDARD_PRICE_RATES[selectedStandard] || 1)).toFixed(2)})
                          </Checkbox>
                        ))}
                      </div>
                    ),
                  },
                  {
                    title: '小计',
                    dataIndex: 'totalPrice',
                    key: 'totalPrice',
                    render: (price: number) => <Text strong>¥{price.toFixed(2)}</Text>,
                  },
                  {
                    title: '操作',
                    key: 'action',
                    render: (_: any, record: QuotationItem) => (
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleRemoveProduct(record.id)}
                      />
                    ),
                  },
                ]}
                dataSource={selectedProducts}
                rowKey="id"
                pagination={false}
              />
            ) : (
              <Text type="secondary">暂无产品，请点击上方按钮添加</Text>
            )}
          </Form.Item>
          
          <Row gutter={16} style={{ marginTop: 24 }}>
            <Col span={12}>
              <Form.Item name="notes" label="备注">
                <Input.TextArea rows={3} placeholder="请输入备注信息" />
              </Form.Item>
            </Col>
            <Col span={12} style={{ display: 'flex', alignItems: 'flex-end' }}>
              <Card style={{ width: '100%', background: '#fff7e6' }}>
                <Row gutter={16} align="middle">
                  <Col span={8}>
                    <Text strong style={{ fontSize: 14 }}>标准: {selectedStandard}</Text>
                  </Col>
                  <Col span={8}>
                    <Text strong style={{ fontSize: 14 }}>系数: {((STANDARD_PRICE_RATES[selectedStandard] || 1) * 100).toFixed(0)}%</Text>
                  </Col>
                  <Col span={8} style={{ textAlign: 'right' }}>
                    <Text type="danger" strong style={{ fontSize: 20 }}>¥{totalAmount.toFixed(2)}</Text>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </Form>
      </Modal>

      <Modal
        title="报价单详情"
        open={isViewQuotationVisible}
        onCancel={() => setIsViewQuotationVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsViewQuotationVisible(false)}>
            关闭
          </Button>,
        ]}
        width={800}
      >
        {viewingQuotation && (
          <div>
            <Descriptions bordered column={2} style={{ marginBottom: 24 }}>
              <Descriptions.Item label="报价单号">QT-{viewingQuotation.id.slice(-6).toUpperCase()}</Descriptions.Item>
              <Descriptions.Item label="客户名称">{viewingQuotation.customerName}</Descriptions.Item>
              <Descriptions.Item label="标准类型">{getStandardTag(viewingQuotation.standard || '国标')}</Descriptions.Item>
              <Descriptions.Item label="价格系数">{((viewingQuotation.standardRate || 1) * 100).toFixed(0)}%</Descriptions.Item>
              <Descriptions.Item label="状态">{getStatusTag(viewingQuotation.status)}</Descriptions.Item>
              <Descriptions.Item label="创建时间">{viewingQuotation.createdAt}</Descriptions.Item>
              <Descriptions.Item label="备注" span={2}>{viewingQuotation.notes || '无'}</Descriptions.Item>
            </Descriptions>
            
            <Title level={5}>报价项目</Title>
            <Table
              columns={[
                { title: '产品名称', dataIndex: ['product', 'name'], key: 'name' },
                { title: '单价', dataIndex: 'unitPrice', key: 'unitPrice', render: (p: number) => `¥${p.toFixed(2)}` },
                { title: '数量', dataIndex: 'quantity', key: 'quantity' },
                { title: '配置', dataIndex: 'options', key: 'options', render: (opts: string[]) => opts.join(', ') || '-' },
                { title: '小计', dataIndex: 'totalPrice', key: 'totalPrice', render: (p: number) => `¥${p.toFixed(2)}` },
              ]}
              dataSource={viewingQuotation.items}
              rowKey="id"
              pagination={false}
              summary={() => (
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} colSpan={4} align="right">
                    <Text strong>总计</Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={1}>
                    <Text type="danger" strong style={{ fontSize: 16 }}>¥{viewingQuotation.totalAmount.toFixed(2)}</Text>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              )}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default QuotationManager;
