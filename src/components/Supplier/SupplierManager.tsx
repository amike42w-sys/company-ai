import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  BankOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '../../store/authStore';
import { api } from '../../services/api';

const { Title, Text } = Typography;

interface Supplier {
  id: string;
  name: string;
  contact: string;
  phone: string;
  email: string;
  address: string;
  industry: string;
  status: 'active' | 'inactive';
  createdAt: string;
  notes?: string;
}

const SupplierManager: React.FC = () => {
  const { role } = useAuthStore();
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [form] = Form.useForm();

  const isAdmin = role === 'internal';

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const result = await api.getCompanies();
      if (result.success) {
        const formattedSuppliers = result.companies.map((c: any) => ({
          id: c.id,
          name: c.name,
          contact: c.contact || '',
          phone: c.phone || '',
          email: c.email || '',
          address: c.address || '',
          industry: c.industry || '',
          status: c.status || 'active',
          createdAt: c.createdAt ? new Date(c.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          notes: c.description || '',
        }));
        setSuppliers(formattedSuppliers);
      }
    } catch (error) {
      console.error('获取供应商失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingSupplier(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record: Supplier) => {
    setEditingSupplier(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除该供应商吗？此操作不可恢复。',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          const result = await api.deleteCompany(id);
          if (result.success) {
            setSuppliers(suppliers.filter(s => s.id !== id));
            message.success('供应商删除成功');
          } else {
            message.error(result.message || '删除失败');
          }
        } catch (error) {
          console.error('删除供应商失败:', error);
          message.error('删除供应商失败');
        }
      },
    });
  };

  const handleSubmit = async (values: any) => {
    try {
      let success = false;
      
      if (editingSupplier) {
        const result = await api.updateCompany(editingSupplier.id, {
          name: values.name,
          description: values.notes,
        });
        if (result.success) {
          const updatedSuppliers = suppliers.map(s => 
            s.id === editingSupplier.id ? { ...s, ...values } : s
          );
          setSuppliers(updatedSuppliers);
          message.success('供应商更新成功');
          success = true;
        } else {
          message.error(result.message || '更新失败');
        }
      } else {
        const result = await api.addCompany(values.name, values.notes);
        if (result.success) {
          const newSupplier: Supplier = {
            id: result.company.id,
            name: values.name,
            contact: values.contact || '',
            phone: values.phone || '',
            email: values.email || '',
            address: values.address || '',
            industry: values.industry || '',
            status: 'active',
            createdAt: new Date().toISOString().split('T')[0],
            notes: values.notes || '',
          };
          setSuppliers([...suppliers, newSupplier]);
          message.success('供应商添加成功');
          success = true;
        } else {
          message.error(result.message || '添加失败');
        }
      }
      
      if (success) {
        setIsModalVisible(false);
      }
    } catch (error) {
      console.error('操作失败:', error);
      // 使用setTimeout避免在渲染过程中更新状态
      setTimeout(() => {
        message.error('操作失败');
      }, 0);
    }
  };

  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.name.toLowerCase().includes(searchText.toLowerCase()) ||
      supplier.contact.toLowerCase().includes(searchText.toLowerCase()) ||
      supplier.phone.includes(searchText)
  );

  const columns = [
    {
      title: '供应商名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: '联系人',
      dataIndex: 'contact',
      key: 'contact',
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? '正常' : '停用'}
        </Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Supplier) => (
        <Space size="small">
          <Tooltip title="查看证书">
            <Button
              type="text"
              icon={<SafetyCertificateOutlined />}
              onClick={() => navigate(`/supplier-certificates?supplierId=${record.id}`)}
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

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>
        <BankOutlined style={{ marginRight: 12 }} />
        供应商管理
      </Title>
      <Text type="secondary">管理供应商信息及供应商证书</Text>

      <Divider />

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={16}>
          <Input
            placeholder="搜索供应商名称、联系人或电话"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 400 }}
          />
        </Col>
        <Col span={8} style={{ textAlign: 'right' }}>
          {isAdmin && (
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              添加供应商
            </Button>
          )}
        </Col>
      </Row>

      <Card>
        <Table
          columns={columns}
          dataSource={filteredSuppliers}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={editingSupplier ? '编辑供应商' : '添加供应商'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="name"
            label="供应商名称"
            rules={[{ required: true, message: '请输入供应商名称' }]}
          >
            <Input placeholder="请输入供应商名称" />
          </Form.Item>
          <Form.Item name="contact" label="联系人">
            <Input placeholder="请输入联系人" />
          </Form.Item>
          <Form.Item name="phone" label="联系电话">
            <Input placeholder="请输入联系电话" />
          </Form.Item>
          <Form.Item name="email" label="邮箱">
            <Input placeholder="请输入邮箱" />
          </Form.Item>
          <Form.Item name="address" label="地址">
            <Input placeholder="请输入地址" />
          </Form.Item>
          <Form.Item name="industry" label="行业">
            <Input placeholder="请输入行业" />
          </Form.Item>
          <Form.Item name="notes" label="备注">
            <Input.TextArea rows={3} placeholder="请输入备注" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SupplierManager;
