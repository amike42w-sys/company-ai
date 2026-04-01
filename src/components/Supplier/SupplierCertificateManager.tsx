import React, { useState, useEffect, useRef } from 'react';
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
import type { TableColumnsType } from 'antd';
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
import { useAuthStore } from '../../store/authStore';
import { api } from '../../services/api';
import dayjs from 'dayjs';

// 服务器基础地址
const serverBase = 'http://106.52.31.237:3001';
const API_BASE = 'http://106.52.31.237:3001';

const { Title, Text } = Typography;
const { Option } = Select;

interface Certificate {
  id: string;
  companyId: string;
  companyName: string;
  name: string;
  standard: string[];
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
  originalName?: string;
}

interface Company {
  id: string;
  name: string;
  description?: string;
}

// 定义一个转换函数
const transformCertificate = (cert: any): Certificate => ({
  ...cert,
  category: cert.type || '其他',         // 将 type 转为 category
  description: cert.notes || '',         // 将 notes 转为 description
  standard: Array.isArray(cert.standard)
    ? cert.standard
    : (cert.standard ? [cert.standard] : [])
});

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
  const [selectedFolder, setSelectedFolder] = useState<string>('all');

  const [isPdfPreviewVisible, setIsPdfPreviewVisible] = useState(false);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string>('');
  const [fileName, setFileName] = useState<string>(''); // 新增状态
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null); // 【第一步修改】新增本地预览URL状态
  const [fileType, setFileType] = useState<'image' | 'pdf' | null>(null); // 新增：文件类型检测
  const [previewError, setPreviewError] = useState<string | null>(null); // 新增：预览错误信息
  const [hasSelectedNewFile, setHasSelectedNewFile] = useState<boolean>(false); // 【关键】是否选择了新文件
  const [selectedCertificates, setSelectedCertificates] = useState<string[]>([]); // 新增：批量选择的证书ID
  const fileRef = React.useRef<File | null>(null); // 【第一步修改】新增文件引用
  const isAdmin = role === 'internal' || role === 'certificate_admin';

  // 标准类型文件夹分类
  const folders = [
    { key: 'all', name: '全部证书', icon: <SafetyCertificateOutlined /> },
    { key: '中国标准', name: '中国标准', icon: <SafetyCertificateOutlined /> },
    { key: '欧盟标准', name: '欧盟标准', icon: <SafetyCertificateOutlined /> },
    { key: '英国标准', name: '英国标准', icon: <SafetyCertificateOutlined /> },
    { key: '香港标准', name: '香港标准', icon: <SafetyCertificateOutlined /> },
    { key: '国际标准', name: '国际标准', icon: <SafetyCertificateOutlined /> },
    { key: '美国标准', name: '美国标准', icon: <SafetyCertificateOutlined /> },
  ];

  // 标准类型映射到文件夹
  const standardToFolder: Record<string, string> = {
    '中国标准': '中国标准',
    '中华人民共和国商标法': '中国标准',
    '中华人民共和国环境保护法': '中国标准',
    '中华人民共和国大气污染防治法': '中国标准',
    '广东省市场监督管理局守合同重信用企业公示规则': '中国标准',
    '高新技术企业认定管理办法': '中国标准',
    '企业安全生产标准化基本规范': '中国标准',
    '排污许可管理条例': '中国标准',
    '欧标': '欧盟标准',
    '港标': '香港标准',
    '国际标准': '国际标准',
    '美标': '美国标准',
    '国际商会会员标准': '国际标准',
    '行业荣誉标准': '国际标准',
  };

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
        const formattedCerts = result.certificates.map(transformCertificate);
        const filteredCerts = formattedCerts.filter(
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
        const formattedCerts = result.certificates.map(transformCertificate);
        setCertificates(formattedCerts);
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
    // 【关键修复】添加证书时也要清空本地预览相关状态
    if (localPreviewUrl) {
      // 暂时注释掉，防止在 React 18 下被误杀
      // URL.revokeObjectURL(localPreviewUrl);
      setLocalPreviewUrl(null);
    }
    fileRef.current = null;
    setFileName('');
    setFileType(null); // 清空文件类型
    setPreviewError(null); // 清空错误信息
    setHasSelectedNewFile(false); // 【关键】重置新文件选择标记
    setIsModalVisible(true);
  };



  const handleEdit = (record: Certificate) => {
    setEditingCertificate(record);

    // 【关键修复】清空本地预览URL和文件引用
    if (localPreviewUrl) {
      // 暂时注释掉，防止在 React 18 下被误杀
      // URL.revokeObjectURL(localPreviewUrl);
      setLocalPreviewUrl(null);
    }
    fileRef.current = null;
    setFileType(null); // 清空文件类型
    setPreviewError(null); // 清空错误信息
    setHasSelectedNewFile(false); // 【关键】重置新文件选择标记

    // 1. 修复文件名显示：优先用 originalName，没有则从 URL 截取，还是没有就显示未知
    let displayName = record.originalName;
    if (!displayName && record.imageUrl) {
      const parts = record.imageUrl.split('/');
      displayName = parts[parts.length - 1]; // 截取文件名
    }
    setFileName(displayName || ''); // 不要给默认值"未上传"，否则无法判断

    // 2. 修复图片/PDF预览：确保这里传入的是最新的 record
    setImageBase64(null); // 清空旧的内存预览
    
    // 3. 表单赋值
    form.setFieldsValue({
      companyId: record.companyId,
      name: record.name,
      standard: record.standard,
      category: record.category,
      issueDate: record.issueDate ? dayjs(record.issueDate) : null,
      expiryDate: (record.expiryDate && record.expiryDate !== '长期有效') ? dayjs(record.expiryDate) : null,
      issuingAuthority: record.issuingAuthority,
      status: record.status,
      description: record.description,
    });

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

  const handleBatchDelete = async () => {
    if (selectedCertificates.length === 0) {
      message.warning('请选择要删除的证书');
      return;
    }

    Modal.confirm({
      title: '批量删除',
      content: `确定要删除选中的 ${selectedCertificates.length} 个证书吗？此操作不可恢复。`,
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          let successCount = 0;
          for (const id of selectedCertificates) {
            const result = await api.deleteCertificate(id);
            if (result.success) {
              successCount++;
            }
          }
          message.success(`成功删除 ${successCount} 个证书`);
          // 清空选择
          setSelectedCertificates([]);
          // 重新获取证书列表
          if (supplierId) {
            fetchCertificates(supplierId);
          } else {
            fetchAllCertificates();
          }
        } catch (error) {
          console.error('批量删除证书失败:', error);
          message.error('批量删除证书失败');
        }
      },
    });
  };

  const handleSubmit = async (values: any) => {
    if (!fileName && !imageBase64 && !fileRef.current) {
      message.error('请先上传证书文件');
      return;
    }

    try {
      // 核心修改：使用 FormData 组装表单和文件
      const formData = new FormData();
      formData.append('companyId', values.companyId);
      formData.append('name', values.name);
      formData.append('standard', Array.isArray(values.standard) ? values.standard[0] : values.standard);
      formData.append('category', values.category);
      formData.append('issueDate', values.issueDate ? values.issueDate.format('YYYY-MM-DD') : '');
      formData.append('expiryDate', typeof values.expiryDate === 'string' ? values.expiryDate : (values.expiryDate ? values.expiryDate.format('YYYY-MM-DD') : ''));
      formData.append('issuingAuthority', values.issuingAuthority || '');
      formData.append('description', values.description || '');
      formData.append('status', values.status || 'valid');
      formData.append('originalName', fileName || '');

      // 如果有新选择的文件，则追加文件本身，而不是 base64
      if (fileRef.current) {
        formData.append('file', fileRef.current);
      }

      if (editingCertificate) {
        const result = await api.updateCertificate(editingCertificate.id, formData);
        if (result.success) {
          const updatedCert = transformCertificate(result.certificate);
          setCertificates(certificates.map(c => c.id === editingCertificate.id ? updatedCert : c));
          message.success('证书更新成功');
        }
      } else {
        const result = await api.addCertificate(formData);
        if (result.success) {
          const newCert = transformCertificate(result.certificate);
          setCertificates([...certificates, newCert]);
          message.success('证书添加成功');
        }
      }
      
      setIsModalVisible(false);
      setEditingCertificate(null);
      setImageBase64(null);
      setFileName('');
      fileRef.current = null; // 清空文件引用
      form.resetFields();
    } catch (error) {
      console.error('操作失败:', error);
      message.error('操作失败');
    }
  };

  const isExpired = (expiryDate: string) => {
    if (!expiryDate || expiryDate === '长期有效') return false;
    return new Date(expiryDate) < new Date();
  };

  // 生成Blob URL（用于PDF预览）
  const getBlobUrl = (record: Certificate) => {
    // 如果后端有返回路径，优先使用 (推荐)
    if (record.imageUrl) {
      return `${record.imageUrl}`;
    }
    // 如果必须用 Base64
    if (record.imageBase64) {
      try {
        // 清除可能存在的 Data URI 前缀
        const base64Data = record.imageBase64.includes('base64,') ? record.imageBase64.split('base64,')[1] : record.imageBase64;
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

  const filteredCertificates = certificates.filter(
    (cert) => {
      const searchLower = typeof searchText === 'string' ? searchText.toLowerCase() : '';
      
      // 确保standard是数组
      const standards = Array.isArray(cert.standard) ? cert.standard : (cert.standard ? [cert.standard] : []);

      // 按搜索文本过滤
      const matchesSearch = (
        cert.name?.toLowerCase().includes(searchLower) ||
        standards.some((s: string) => s?.toLowerCase().includes(searchLower)) ||
        cert.category?.toLowerCase().includes(searchLower)
      );

      // 按文件夹过滤
      if (selectedFolder === 'all') {
        return matchesSearch;
      } else {
        // 检查证书的标准类型是否属于选中的文件夹
        const certFolders = standards.map((s: string) => standardToFolder[s] || '其他');
        return matchesSearch && certFolders.includes(selectedFolder);
      }
    }
  );

  const columns: TableColumnsType<Certificate> = [
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
      render: (standard: string | string[]) => {
        const standards = Array.isArray(standard) ? standard : (standard ? [standard] : []);
        return (
          <Tag color="blue">
            {standards.join('/')}
          </Tag>
        );
      },
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
      render: (date: string) => (date && date !== '长期有效') ? dayjs(date).format('YYYY-MM-DD') : (date || '-'),
    },
    {
      title: '有效期至',
      dataIndex: 'expiryDate',
      key: 'expiryDate',
      render: (date: string) => {
        const expired = isExpired(date);
        let displayDate = '-';
        if (date) {
          if (date === '长期有效') {
            displayDate = '长期有效';
          } else {
            displayDate = dayjs(date).format('YYYY-MM-DD');
          }
        }
        return (
          <Text type={expired ? 'danger' : undefined}>
            {displayDate}
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
      render: (_: any, record: Certificate) => (
        <Space size="small">
          <Tooltip title="查看证书详情">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => {
                Modal.info({
                  title: '证书详情',
                  content: (
                    <div style={{ padding: 16 }}>
                      <p><strong>证书名称：</strong>{record.name}</p>
                      <p><strong>标准类型：</strong>
                        {(() => {
                          const standards = Array.isArray(record.standard) ? record.standard : (record.standard ? [record.standard] : []);
                          return standards.join('/');
                        })()}
                      </p>
                      <p><strong>证书类别：</strong>{record.category}</p>
                      <p><strong>发证日期：</strong>{record.issueDate ? dayjs(record.issueDate).format('YYYY-MM-DD') : '-'}</p>
                      <p><strong>有效期至：</strong>{record.expiryDate === '长期有效' ? '长期有效' : (record.expiryDate ? dayjs(record.expiryDate).format('YYYY-MM-DD') : '-')}</p>
                      <p><strong>发证机构：</strong>{record.issuingAuthority || '-'}</p>
                      <p><strong>状态：</strong>
                        {isExpired(record.expiryDate) ? '已过期' :
                          ({
                            'valid': '有效',
                            'expired': '已过期',
                            'pending': '待审核'
                          }[record.status] || record.status)
                        }
                      </p>
                      {record.description && (
                        <p style={{ marginTop: 8 }}>
                          <strong>证书描述：</strong>
                          <div style={{ marginTop: 4, padding: '8px', background: '#f5f5f5', borderRadius: '4px', whiteSpace: 'pre-wrap' }}>
                            {record.description}
                          </div>
                        </p>
                      )}
                      {(record.imageBase64 || record.imageUrl) && (
                        <div style={{ marginTop: 16 }}>
                          <p><strong>证书文件预览：</strong></p>
                          
                          {/* 核心修改逻辑 */}
                          {record.imageUrl && record.imageUrl.toLowerCase().endsWith('.pdf') ? (
                            // 如果是 PDF，使用 iframe 预览
                            <iframe 
                              src={`${API_BASE}${record.imageUrl}`} 
                              width="100%" 
                              height="500px" 
                              title="PDF Preview"
                              style={{ border: 'none' }}
                              onError={() => message.error("PDF 加载失败，请检查文件是否存在")}
                            />
                          ) : (
                            // 如果是图片，才使用 Image 组件
                            <Image
                              src={record.imageBase64 || `${API_BASE}${record.imageUrl}`}
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
                          )}
                        </div>
                      )}
                    </div>
                  ),
                  width: 600,
                  maskClosable: true,
                });
              }}
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
            <Space size="small">
              <Button 
                danger
                icon={<DeleteOutlined />}
                onClick={handleBatchDelete}
                disabled={selectedCertificates.length === 0}
              >
                批量删除
              </Button>
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                添加证书
              </Button>
            </Space>
          )}
        </Col>
      </Row>

      {/* 标准类型文件夹 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Space size="small" wrap>
            {folders.map((folder) => (
              <Button
                key={folder.key}
                type={selectedFolder === folder.key ? 'primary' : 'default'}
                icon={folder.icon}
                onClick={() => setSelectedFolder(folder.key)}
                style={{ minWidth: 100 }}
              >
                {folder.name}
              </Button>
            ))}
          </Space>
        </Col>
      </Row>

      <Card>
        <Table
          columns={columns}
          dataSource={filteredCertificates}
          rowKey="id"
          loading={loading}
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            showTotal: (total) => `共 ${total} 条记录`,
          }}
          scroll={{ x: 'max-content' }}
          rowSelection={isAdmin ? {
            selectedRowKeys: selectedCertificates,
            onChange: (selectedRowKeys: any[]) => {
              setSelectedCertificates(selectedRowKeys.map(key => String(key)));
            },
            selections: [
              Table.SELECTION_ALL,
              Table.SELECTION_INVERT,
              Table.SELECTION_NONE,
            ],
            preserveSelectedRowKeys: true,
          } : undefined}
        />
      </Card>

      <Modal
        title={editingCertificate ? '编辑证书' : '添加证书'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          // 【第三步修改】清理内存
          if (localPreviewUrl) {
            // 暂时注释掉，防止在 React 18 下被误杀
            // URL.revokeObjectURL(localPreviewUrl);
            setLocalPreviewUrl(null);
          }
          fileRef.current = null;
          setEditingCertificate(null);
          setImageBase64(null);
          setFileName('');
          setFileType(null); // 清空文件类型
          setPreviewError(null); // 清空错误信息
          setHasSelectedNewFile(false); // 【关键】重置新文件选择标记
          form.resetFields();
        }}
        onOk={() => form.submit()}
        width={window.innerWidth < 768 ? '95%' : 700}
        style={{ top: 20 }}
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
            <Col xs={24} sm={12}>
              <Form.Item
                name="standard"
                label="标准类型"
              >
                <Select placeholder="请选择标准类型" mode="multiple">
                  <Option value="国际标准">国际标准</Option>
                  <Option value="中国标准">中国标准</Option>
                  <Option value="澳标">澳标</Option>
                  <Option value="港标">港标</Option>
                  <Option value="欧标">欧标</Option>
                  <Option value="美标">美标</Option>
                  <Option value="中华人民共和国商标法">中华人民共和国商标法</Option>
                  <Option value="中华人民共和国环境保护法">中华人民共和国环境保护法</Option>
                  <Option value="中华人民共和国大气污染防治法">中华人民共和国大气污染防治法</Option>
                  <Option value="广东省市场监督管理局守合同重信用企业公示规则">广东省市场监督管理局守合同重信用企业公示规则</Option>
                  <Option value="高新技术企业认定管理办法">高新技术企业认定管理办法</Option>
                  <Option value="企业安全生产标准化基本规范">企业安全生产标准化基本规范</Option>
                  <Option value="排污许可管理条例">排污许可管理条例</Option>
                  <Option value="国际商会会员标准">国际商会会员标准</Option>
                  <Option value="行业荣誉标准">行业荣誉标准</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="category"
                label="证书类别"
              >
                <Select placeholder="请选择证书类别">
                  <Option value="产品证书">产品证书</Option>
                  <Option value="产品认证类">产品认证类</Option>
                  <Option value="体系证书">体系证书</Option>
                  <Option value="CE证书">CE证书</Option>
                  <Option value="知识产权类 - 商标注册证书">知识产权类 - 商标注册证书</Option>
                  <Option value="企业荣誉类">企业荣誉类</Option>
                  <Option value="会员资质类">会员资质类</Option>
                  <Option value="环保合规类">环保合规类</Option>
                  <Option value="企业信用类">企业信用类</Option>
                  <Option value="企业资质类">企业资质类</Option>
                  <Option value="安全生产资质类">安全生产资质类</Option>
                  <Option value="焊接工艺资质类">焊接工艺资质类</Option>
                  <Option value="焊工资格证书类">焊工资格证书类</Option>
                  <Option value="其他">其他</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item name="issueDate" label="发证日期">
                <DatePicker 
                  style={{ width: '100%' }} 
                  placeholder="请选择或输入(如 2024-05-08)"
                  format="YYYY-MM-DD"
                  allowClear
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="expiryDate" label="有效期至">
                <DatePicker 
                  style={{ width: '100%' }} 
                  placeholder="请选择或输入(如 2024-05-08)"
                  format="YYYY-MM-DD"
                  allowClear
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="issuingAuthority" label="发证机构">
            <Input placeholder="请输入发证机构" />
          </Form.Item>
          <Form.Item name="status" label="状态" initialValue="valid">
            <Select placeholder="请选择状态">
              <Option value="valid">有效</Option>
              <Option value="expired">已过期</Option>
              <Option value="pending">待审核</Option>
            </Select>
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input.TextArea rows={3} placeholder="请输入描述" />
          </Form.Item>
          <Form.Item label="证书文件">
            <Space direction="vertical" style={{ width: '100%' }}>
              
              {/* 文件名显示行 */}
              {(fileName || editingCertificate?.imageUrl) && (
                <div style={{ marginBottom: 12, padding: '8px 12px', background: '#f5f5f5', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>当前文件: <strong>{fileName || (editingCertificate?.originalName || '未知文件名')}</strong></span>
                  <Space>
                    {/* 在新窗口打开按钮 */}
                    {hasSelectedNewFile && localPreviewUrl && (
                      <Button 
                        type="link" 
                        icon={<EyeOutlined />} 
                        onClick={() => {
                          window.open(localPreviewUrl, '_blank');
                        }}
                      >
                        在新窗口打开
                      </Button>
                    )}
                    {/* 删除按钮 */}
                    <Button 
                      type="text" 
                      danger 
                      icon={<DeleteOutlined />} 
                      onClick={() => {
                        if (localPreviewUrl) {
                          // 暂时注释掉，防止在 React 18 下被误杀
                          // URL.revokeObjectURL(localPreviewUrl);
                          setLocalPreviewUrl(null);
                        }
                        fileRef.current = null;
                        setFileName('');
                        setImageBase64(null);
                        setFileType(null); // 清空文件类型
                        setPreviewError(null); // 清空错误信息
                        setHasSelectedNewFile(false); // 【关键】重置新文件选择标记
                        if (editingCertificate) {
                          setEditingCertificate({ ...editingCertificate, imageUrl: '' });
                        }
                      }} 
                    />
                  </Space>
                </div>
              )}

              {/* 【错误提示 */}
              {previewError && (
                <div style={{ 
                  marginTop: 10, 
                  padding: '16px', 
                  background: '#fff2f0', 
                  border: '1px solid #ffccc7', 
                  borderRadius: '4px',
                  color: '#ff4d4f'
                }}>
                  <ExclamationCircleOutlined style={{ marginRight: 8 }} />
                  {previewError}
                </div>
              )}
              
              {/* 【实时预览窗口】只在真正选择了新文件且无错误时显示预览 */}
              {hasSelectedNewFile && localPreviewUrl && !previewError && (
                <div style={{ marginTop: 10, height: '400px', border: '1px solid #d9d9d9', borderRadius: '4px', overflow: 'hidden' }}>
                  {fileType === 'image' ? (
                    // 图片文件用 <img> 标签显示
                    <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#fafafa' }}>
                      <img 
                        src={localPreviewUrl} 
                        alt="证书预览"
                        style={{ 
                          maxWidth: '100%', 
                          maxHeight: '100%', 
                          objectFit: 'contain' 
                        }}
                        onError={() => {
                          setPreviewError('图片加载失败，请检查文件是否损坏');
                        }}
                      />
                    </div>
                  ) : (
                    // PDF 文件：显示友好提示 + 新窗口打开按钮
                    <div style={{ 
                      width: '100%', 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      justifyContent: 'center', 
                      alignItems: 'center', 
                      background: '#f5f5f5'
                    }}>
                      <SafetyCertificateOutlined style={{ fontSize: '64px', color: '#1890ff', marginBottom: 16 }} />
                      <Text style={{ marginBottom: 16, fontSize: '16px' }}>
                        PDF 文件已选择，点击下方按钮在新窗口预览
                      </Text>
                      <Button 
                        type="primary" 
                        icon={<EyeOutlined />}
                        onClick={() => {
                          window.open(localPreviewUrl, '_blank');
                        }}
                      >
                        在新窗口预览 PDF
                      </Button>
                    </div>
                  )}
                </div>
              )}

              <Upload
                name="image"
                accept="image/*,application/pdf"
                showUploadList={false}
                beforeUpload={(file) => {
                  setFileName(file.name);
                  setPreviewError(null); // 清除之前的错误
                  setHasSelectedNewFile(true); // 【关键】标记已选择新文件
                  
                  const isLt100M = file.size / 1024 / 1024 < 100;
                  if (!isLt100M) {
                    message.error('文件大小不能超过 100MB!');
                    return false;
                  }
                  
                  // 1. 【关键】提取原生 File 对象（使用类型断言处理 TypeScript）
                  const nativeFile = (file as any).originFileObj || (file as any).raw || file;
                  
                  // 2. 【关键】安全校验：确保是 Blob/File 实例
                  if (!(nativeFile instanceof Blob)) {
                    console.error('未能提取到原生 Blob/File 对象', { 
                      file, 
                      nativeFile
                    });
                    setPreviewError('无法获取有效的文件对象，请检查文件后重新选择');
                    message.error('无法获取有效的文件对象，请检查文件后重新选择');
                    return false;
                  }
                  
                  // 3. 检测文件类型
                  const isImage = nativeFile.type.startsWith('image/');
                  const isPdf = nativeFile.type === 'application/pdf' || (nativeFile as File).name.toLowerCase().endsWith('.pdf');
                  
                  if (!isImage && !isPdf) {
                    setPreviewError('不支持的文件格式，请选择 JPG、PNG、GIF 或 PDF 文件');
                    message.error('不支持的文件格式，请选择 JPG、PNG、GIF 或 PDF 文件');
                    return false;
                  }
                  
                  // 4. 设置文件类型
                  const newFileType = isImage ? 'image' : 'pdf';
                  setFileType(newFileType);
                  
                  // 5. 清理旧的 Blob URL（如果有的话）
                  if (localPreviewUrl && localPreviewUrl.startsWith('blob:')) {
                    // 暂时注释掉，防止在 React 18 下被误杀
                    // URL.revokeObjectURL(localPreviewUrl);
                  }
                  
                  try {
                    // 6. 保存文件引用供提交时使用（使用类型断言）
                    fileRef.current = nativeFile as File;
                    
                    // 7. 【直接方案】直接使用原生 File 对象创建 Blob URL
                    try {
                      // 直接使用原生 File 对象创建 Blob URL
                      const directUrl = URL.createObjectURL(nativeFile);
                      
                      console.log('设置直接预览URL:', { directUrl, isPdf, newFileType, nativeFile: (nativeFile as File).name });
                      setLocalPreviewUrl(directUrl);
                      
                      // 同时读取 Base64 供后端提交
                      const base64Reader = new FileReader();
                      base64Reader.onload = (base64Event) => {
                        setImageBase64(base64Event.target?.result as string);
                      };
                      base64Reader.onerror = () => {
                        setPreviewError('文件读取失败，请检查文件是否损坏');
                        message.error('文件读取失败，请检查文件是否损坏');
                      };
                      base64Reader.readAsDataURL(nativeFile);
                    } catch (innerError) {
                      console.error('文件处理失败:', innerError);
                      setPreviewError('文件损坏，无法预览，请检查文件后重新选择');
                      message.error('文件损坏，无法预览，请检查文件后重新选择');
                    }
                  } catch (error) {
                    console.error('文件处理失败:', error);
                    setPreviewError('文件损坏，无法预览，请检查文件后重新选择');
                    message.error('文件损坏，无法预览，请检查文件后重新选择');
                    return false;
                  }
                  
                  return false;
                }}
              >
                <Button icon={<UploadOutlined />}>
                  {imageBase64 || fileName ? '更换文件' : '上传文件'}
                </Button>
              </Upload>
              <Text type="secondary">支持 JPG、PNG、GIF、PDF 格式，最大 100MB</Text>
            </Space>
          </Form.Item>
        </Form>
      </Modal>



      {/* PDF 预览模态框 */}
      <Modal
        title="PDF 预览"
        open={isPdfPreviewVisible}
        onCancel={() => {
          setIsPdfPreviewVisible(false);
          setPdfPreviewUrl('');
        }}
        footer={[
          <Button 
            key="download" 
            type="primary" 
            onClick={() => {
              const link = document.createElement('a');
              link.href = pdfPreviewUrl;
              link.download = 'certificate.pdf';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
          >
            下载 PDF
          </Button>
        ]}
        width={1000}
        style={{ top: 20 }}
      >
        <div style={{ width: '100%', height: 700 }}>
          <object 
            data={pdfPreviewUrl} 
            type="application/pdf" 
            style={{ width: '100%', height: '100%', border: 'none' }}
          >
            <div style={{ textAlign: 'center', padding: '100px 20px' }}>
              <div style={{ fontSize: 64, marginBottom: 20 }}>📄</div>
              <Title level={4} style={{ marginBottom: 16 }}>无法预览 PDF</Title>
              <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
                您的浏览器不支持直接预览 PDF，请点击下方按钮下载查看
              </Text>
            </div>
          </object>
        </div>
      </Modal>
    </div>
  );
};

export default SupplierCertificateManager;
