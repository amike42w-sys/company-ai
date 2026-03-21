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
  DatePicker,
  Upload,
  Image,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  SafetyCertificateOutlined,
  ExclamationCircleOutlined,
  UploadOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '../../../store/authStore';
import { api } from '../../../services/api';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;

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
  description?: string;
  imageUrl?: string;
  imageBase64?: string;
  imagePath?: string;
  createdAt?: number;
  updatedAt?: number;
}

interface Company {
  id: string;
  name: string;
  description?: string;
}

const SupplierCertificateManager: React.FC = () => {
  const { role } = useAuthStore();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [companiesLoading, setCompaniesLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCertificate, setEditingCertificate] = useState<Certificate | null>(null);
  const [form] = Form.useForm();
  const [supplierId, setSupplierId] = useState<string>('');
  const [imageBase64, setImageBase64] = useState<string | null>(null);

  const getBlobUrl = (record: Certificate) => {
    // 如果后端有返回路径，优先使用 (推荐)
    if (record.imageUrl) {
      return `${record.imageUrl}`;
    }
    // 如果必须用 Base64
    if (record.imageBase64) {
      try {
        // 清除可能存在的 Data URI 前缀
        const base64Data = record.imageBase64.includes('base64,')
          ? record.imageBase64.split('base64,')[1]
          : record.imageBase64;
        
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Uint8Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const blob = new Blob([byteNumbers], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        console.log("最终预览地址:", url);
        return url;
      } catch (e) {
        console.error("Base64 转 Blob 失败:", e);
        return '';
      }
    }
    return '';
  };

  const isAdmin = role === 'internal' || role === 'certificate_admin';

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('supplierId');
    if (id) {
      setSupplierId(id);
    }
    fetchCompanies();
  }, []);

  useEffect(() => {
    if (supplierId) {
      fetchCertificates(supplierId);
    } else {
      fetchAllCertificates();
    }
  }, [supplierId]);

  const fetchCompanies = async () => {
    setCompaniesLoading(true);
    try {
      const result = await api.getCompanies();
      if (result.success) {
        setCompanies(result.companies);
      }
    } catch (error) {
      console.error('获取公司列表失败:', error);
    } finally {
      setCompaniesLoading(false);
    }
  };

  const fetchCertificates = async (companyId: string) => {
    setLoading(true);
    try {
      const result = await api.getCertificates();
      if (result.success) {
        const filteredCerts = result.certificates.filter(
          (cert: Certificate) => cert.companyId === companyId
        );
        setCertificates(filteredCerts);
      }
    } catch (error) {
      console.error('获取证书失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllCertificates = async () => {
    setLoading(true);
    try {
      const result = await api.getCertificates();
      if (result.success) {
        setCertificates(result.certificates);
      }
    } catch (error) {
      console.error('获取证书失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingCertificate(null);
    form.resetFields();
    setImageBase64(null);
    setIsModalVisible(true);
  };

  const handleEdit = (record: Certificate) => {
    setEditingCertificate(record);
    form.setFieldsValue({
      companyId: record.companyId,
      name: record.name,
      standard: record.standard,
      category: record.category,
      issueDate: record.issueDate ? dayjs(record.issueDate) : null,
      expiryDate: record.expiryDate ? dayjs(record.expiryDate) : null,
      issuingAuthority: record.issuingAuthority,
      status: record.status,
      description: record.description,
    });
    setImageBase64(record.imageBase64 || null);
    setIsModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除该证书吗？此操作不可恢复。',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          const result = await api.deleteCertificate(id);
          if (result.success) {
            setCertificates(certificates.filter(c => c.id !== id));
            message.success('证书删除成功');
          } else {
            message.error(result.message || '删除失败');
          }
        } catch (error) {
          console.error('删除证书失败:', error);
          message.error('删除证书失败');
        }
      },
    });
  };

  const handleSubmit = async (values: any) => {
    try {
      const certData: any = {
        companyId: values.companyId,
        name: values.name,
        standard: values.standard,
        category: values.category,
        issueDate: values.issueDate ? values.issueDate.format('YYYY-MM-DD') : '',
        expiryDate: values.expiryDate ? values.expiryDate.format('YYYY-MM-DD') : '',
        issuingAuthority: values.issuingAuthority,
        description: values.description,
        status: values.status || '有效',
      };

      if (imageBase64) {
        certData.imageBase64 = imageBase64;
      }

      if (editingCertificate) {
        const result = await api.updateCertificate(editingCertificate.id, certData);
        if (result.success) {
          const updatedCerts = certificates.map(c =>
            c.id === editingCertificate.id ? { ...c, ...certData, companyName: result.certificate.companyName } : c
          );
          setCertificates(updatedCerts);
          message.success('证书更新成功');
        }
      } else {
        const result = await api.addCertificate(certData);
        if (result.success) {
          const newCert: Certificate = {
            id: result.certificate.id,
            companyName: result.certificate.companyName,
            ...certData,
          };
          setCertificates([...certificates, newCert]);
          message.success('证书添加成功');
        }
      }
      setIsModalVisible(false);
      setEditingCertificate(null);
      setImageBase64(null);
      form.resetFields();
    } catch (error) {
      console.error('操作失败:', error);
      message.error('操作失败');
    }
  };

  const isExpired = (expiryDate: string) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  // 放在组件内部的其他 const 函数旁边
  const getPdfUrl = (record: Certificate) =>  {
    if  (record.imageUrl) {
      return `${record.imageUrl}`;
    }
    if  (record.imageBase64) {
      const base64Data = record.imageBase64.includes('base64,')
        ? record.imageBase64.split('base64,')[1]
        : record.imageBase64;
      const  byteCharacters = atob(base64Data);
      const byteNumbers = new Array (byteCharacters.length);
      for (let i = 0 ; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array (byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      return  URL.createObjectURL(blob);
    }
    return '';
  };

  const filteredCertificates = certificates.filter(
    (cert) =>
      cert.name.toLowerCase().includes(searchText.toLowerCase()) ||
      cert.standard.toLowerCase().includes(searchText.toLowerCase()) ||
      cert.category.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: '证书名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: '标准类型',
      dataIndex: 'standard',
      key: 'standard',
      render: (standard: string) => (
        <Tag color={
          standard === '国标' ? 'blue' :
            standard === '澳标' ? 'green' :
              standard === '港标' ? 'orange' :
                standard === '欧标' ? 'purple' : 'red'
        }>
          {standard}
        </Tag>
      ),
    },
    {
      title: '证书类别',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: '发证日期',
      dataIndex: 'issueDate',
      key: 'issueDate',
    },
    {
      title: '有效期至',
      dataIndex: 'expiryDate',
      key: 'expiryDate',
      render: (date: string) => {
        const expired = isExpired(date);
        return (
          <Text type={expired ? 'danger' : undefined}>
            {date}
            {expired && (
              <Tooltip title="证书已过期">
                <ExclamationCircleOutlined style={{ marginLeft: 8, color: '#ff4d4f' }} />
              </Tooltip>
            )}
          </Text>
        );
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string, record: Certificate) => {
        const expired = isExpired(record.expiryDate);
        const statusMap: Record<string, string> = {
          'valid': '有效',
          'invalid': '无效',
          'expired': '已过期',
          'pending': '待审核'
        };
        return (
          <Tag color={expired ? 'red' : 'green'}>
            {expired ? '已过期' : (statusMap[status] || status)}
          </Tag>
        );
      },
    },
    {
      title: '发证机构',
      dataIndex: 'issuingAuthority',
      key: 'issuingAuthority',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Certificate) => {
        // 1. 在这里定义好所有逻辑
        const previewUrl = getBlobUrl(record); // 调用刚才定义的函数
        const isPdf = record.name.toLowerCase().endsWith('.pdf') || (record.imageUrl && record.imageUrl.toLowerCase().endsWith('.pdf'));

        // 2. 必须 return 一段 JSX
        return (
          <Space size="small">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => {
                Modal.info({
                  title: '证书详情',
                  width: 800,
                  content: (
                    <div style={{ padding: 16 }}>
                      <p><strong>证书名称：</strong>{record.name}</p>
                      <div style={{ marginTop: 16 }}>
                        <p><strong>文件预览：</strong></p>
                        {(() => {
                          const fullImageUrl = record.imageUrl ? `${record.imageUrl}` : '';
                          const displaySrc = record.imageBase64 || fullImageUrl;
                          const isPdf = displaySrc.includes('data:application/pdf') || (record.imageUrl && record.imageUrl.toLowerCase().endsWith('.pdf'));
                          
                          if (isPdf) {
                            return (
                              <iframe
                                src={previewUrl}
                                width="100%"
                                height="600px"
                                title="PDF Preview"
                                style={{ border: 'none' }}
                              />
                            );
                          } else {
                            return (
                              <Image
                                src={displaySrc}
                                style={{ maxWidth: '100%' }}
                                fallback="https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg"
                                preview={{
                                  mask: (
                                    <Space>
                                      <EyeOutlined />
                                      预览
                                    </Space>
                                  )
                                }}
                              />
                            );
                          }
                        })()}
                      </div>
                    </div>
                  ),
                });
              }}
            />
            {/* ... 这里保留你原来的编辑/删除按钮逻辑 ... */}
            {isAdmin && (
              <>
                <Button
                  type="text"
                  icon={<EditOutlined />}
                  onClick={() => handleEdit(record)}
                />
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleDelete(record.id)}
                />
              </>
            )}
          </Space>
        );
      },
    }
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>
        <SafetyCertificateOutlined style={{ marginRight: 12 }} />
        供应商证书管理
      </Title>
      <Text type="secondary">管理供应商的证书信息，包括标准类型、有效期等</Text>

      <Divider />

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={16}>
          <Input
            placeholder="搜索证书名称、标准或类别"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 400 }}
          />
        </Col>
        <Col span={8} style={{ textAlign: 'right' }}>
          {isAdmin && (
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              添加证书
            </Button>
          )}
        </Col>
      </Row>

      <Card>
        <Table
          columns={columns}
          dataSource={filteredCertificates}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={editingCertificate ? '编辑证书' : '添加证书'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingCertificate(null);
          setImageBase64(null);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} preserve={true}>
          <Form.Item
            name="companyId"
            label="供应商"
            rules={[{ required: true, message: '请选择供应商' }]}
          >
            <Select
              placeholder="请选择供应商"
              loading={companiesLoading}
              disabled={!!supplierId}
            >
              {companies.map(company => (
                <Option key={company.id} value={company.id}>
                  {company.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="name"
            label="证书名称"
            rules={[{ required: true, message: '请输入证书名称' }]}
          >
            <Input placeholder="请输入证书名称" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="standard"
                label="标准类型"
                rules={[{ required: true, message: '请选择标准类型' }]}
              >
                <Select placeholder="请选择标准类型">
                  <Option value="国标">国标</Option>
                  <Option value="澳标">澳标</Option>
                  <Option value="港标">港标</Option>
                  <Option value="欧标">欧标</Option>
                  <Option value="美标">美标</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="category"
                label="证书类别"
                rules={[{ required: true, message: '请选择证书类别' }]}
              >
                <Select placeholder="请选择证书类别">
                  <Option value="产品证书">产品证书</Option>
                  <Option value="体系证书">体系证书</Option>
                  <Option value="CE证书">CE证书</Option>
                  <Option value="其他">其他</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="issueDate" label="发证日期">
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="expiryDate" label="有效期至">
                <DatePicker style={{ width: '100%' }} placeholder="请选择或输入日期" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="issuingAuthority" label="发证机构">
            <Input placeholder="请输入发证机构" />
          </Form.Item>
          <Form.Item name="status" label="状态" initialValue="valid">
            <Select placeholder="请选择状态">
              <Option value="valid">有效</Option>
              <Option value="invalid">无效</Option>
              <Option value="expired">已过期</Option>
              <Option value="pending">待审核</Option>
            </Select>
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input.TextArea rows={3} placeholder="请输入描述" />
          </Form.Item>
          <Form.Item label="证书图片">
            <Space direction="vertical" style={{ width: '100%' }}>
              {imageBase64 !== null && (
                <Image
                  src={imageBase64}
                  width={200}
                  style={{ marginBottom: 8 }}
                  alt="证书图片"
                  preview={{
                    mask: (
                      <Space>
                        <EyeOutlined />
                        预览
                      </Space>
                    )
                  }}
                />
              )}
              <Upload
                name="image"
                accept="image/*,.pdf"
                showUploadList={false}
                beforeUpload={(file) => {
                  const isLt5M = file.size / 1024 / 1024 < 5;
                  if (!isLt5M) {
                    message.error('图片大小不能超过 5MB!');
                    return false;
                  }
                  const reader = new FileReader();
                  reader.onload = (e) => {
                    const base64String = e.target?.result as string;
                    setImageBase64(base64String);
                  };
                  reader.readAsDataURL(file);
                  return false;
                }}
              >
                <Button icon={<UploadOutlined />}>{imageBase64 !== null ? '更换图片' : '上传图片'}</Button>
              </Upload>
              <Text type="secondary">支持 JPG、PNG、GIF 格式，最大 5MB</Text>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SupplierCertificateManager;