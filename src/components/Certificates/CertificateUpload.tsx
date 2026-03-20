import React, { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Upload,
  message,
  Space,
  Table,
  Image,
  Tabs,
  Row,
  Col,
  Typography,
  List
} from 'antd';
import {
  UploadOutlined,
  PlusOutlined,
  DeleteOutlined,
  EyeOutlined,
  FileImageOutlined,
  SafetyCertificateOutlined,
  FilePdfOutlined
} from '@ant-design/icons';
import { api } from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

// 标准类型选项
const standards = ['国标', '澳标', '港标', '欧标', '美标', '日标'];

// 证书分类选项
const categories = ['质量管理', '国际认证', '区域认证', '食品安全', '有机认证', '环境认证', '安全认证', '其他'];

// 证书状态选项
const statuses = [
  { value: 'valid', label: '有效', color: 'green' },
  { value: 'expired', label: '已过期', color: 'red' },
  { value: 'pending', label: '待审核', color: 'orange' }
];

interface Company {
  id: string;
  name: string;
  description?: string;
}

interface Certificate {
  id: string;
  companyId: string;
  companyName: string;
  name: string;
  standard: string;
  issueDate: string;
  expiryDate: string;
  issuingAuthority: string;
  imageUrl?: string;
  description?: string;
  category: string;
  status: 'valid' | 'expired' | 'pending';
}

const CertificateUpload: React.FC = () => {
  const { user } = useAuthStore();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('certificates');

  // 新增：批量上传待处理列表
  const [pendingFiles, setPendingFiles] = useState<{ name: string, base64: string }[]>([]);

  // 表单相关
  const [certificateForm] = Form.useForm();
  const [companyForm] = Form.useForm();

  // 1. 添加缺失的状态定义
  const [selectedCertificate, setSelectedCertificate] = useState<any>(null);
  const [editImageBase64, setEditImageBase64] = useState<string | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [standardFilter, setStandardFilter] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');

  // 搜索和筛选
  const [searchText, setSearchText] = useState('');

  const isAdmin = user?.role === 'internal' || user?.role === 'certificate_admin';

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [companiesRes, certificatesRes] = await Promise.all([
        api.getCompanies(),
        api.getCertificates()
      ]);
      if (companiesRes.success) setCompanies(companiesRes.companies);
      if (certificatesRes.success) setCertificates(certificatesRes.certificates);
    } catch (error) {
      message.error('加载数据失败');
    }
    setLoading(false);
  };

  // 处理多文件/文件夹读取
  const handleFilesChange = (files: File[]) => {
    // 1. 定义支持的扩展名
    const supportedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'pdf'];

    // 2. 过滤掉不支持的文件（以及 macOS/Windows 的系统垃圾文件）
    const validFiles = files.filter(file => {
      const fileName = file.name.toLowerCase();
      const ext = fileName.split('.').pop();
      // 排除隐藏文件（如 .DS_Store）和不支持的格式
      return ext && supportedExtensions.includes(ext) && !fileName.startsWith('.');
    });

    if (validFiles.length === 0) {
      message.warning('未找到支持的文件类型（支持 JPG, PNG, GIF, PDF）');
      return;
    }

    const promises = validFiles.map(file => new Promise<{ name: string, base64: string }>((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        // 优先使用 webkitRelativePath（文件夹路径），如果没有则使用 file.name
        const name = file.webkitRelativePath || file.name;
        resolve({
          name: name,
          base64: e.target?.result as string
        });
      };
      reader.readAsDataURL(file);
    }));

    Promise.all(promises).then(results => {
      setPendingFiles(prev => [...prev, ...results]);
      message.success(`已添加 ${results.length} 个文件`);
    });
  };

  // 批量添加证书
  const handleAddCertificate = async (values: any) => {
    if (pendingFiles.length === 0) {
      message.error('请先选择证书文件');
      return;
    }

    setLoading(true);
    try {
      for (const file of pendingFiles) {
        await api.addCertificate({
          companyId: values.companyId,
          name: file.name, // 使用文件名作为证书名
          standard: values.standard,
          issueDate: values.issueDate.format('YYYY-MM-DD'),
          expiryDate: values.expiryDate.format('YYYY-MM-DD'),
          issuingAuthority: values.issuingAuthority,
          description: values.description,
          category: values.category,
          status: values.status,
          imageBase64: file.base64
        });
      }
      message.success(`成功上传 ${pendingFiles.length} 个证书`);
      certificateForm.resetFields();
      setPendingFiles([]);
      loadData();
    } catch (error) {
      message.error('上传失败，请检查网络或文件大小');
    } finally {
      setLoading(false);
    }
  };

  // 渲染表格图标（支持PDF判断）
  const renderFileCell = (url: string) => {
    if (!url) return <div style={{ width: 80, height: 60, background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FileImageOutlined /></div>;

    // 简单的后缀判断
    const isPdf = url.toLowerCase().endsWith('.pdf');
    if (isPdf) {
      return (
        <div style={{ width: 80, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', border: '1px solid #eee' }}>
          <FilePdfOutlined style={{ fontSize: 24, color: 'red' }} />
          <Text type="secondary" style={{ fontSize: 10 }}>PDF</Text>
        </div>
      );
    }
    return <Image src={`${url}`} width={80} height={60} style={{ objectFit: 'cover', borderRadius: 4 }} />;
  };

  // 其他辅助函数保持原有逻辑
  const handleAddCompany = async (values: any) => {
    const result = await api.addCompany(values.name, values.description);
    if (result.success) { message.success('添加成功'); companyForm.resetFields(); loadData(); }
  };

  const handleDeleteCompany = async (id: string) => {
    const result = await api.deleteCompany(id);
    if (result.success) { message.success('删除成功'); loadData(); }
  };

  const handleSaveEdit = async (values: any) => {
    if (!selectedCertificate) return;
    const data = { ...values, issueDate: values.issueDate.format('YYYY-MM-DD'), expiryDate: values.expiryDate.format('YYYY-MM-DD') };
    if (editImageBase64) (data as any).imageBase64 = editImageBase64;
    const result = await api.updateCertificate(selectedCertificate.id, data);
    if (result.success) { message.success('更新成功'); setEditModalVisible(false); loadData(); }
  };

  const handleDeleteCertificate = async (id: string) => {
    const result = await api.deleteCertificate(id);
    if (result.success) { message.success('删除成功'); loadData(); }
  };

  const filteredCertificates = certificates.filter(cert => {
    const matchesSearch = cert.companyName.toLowerCase().includes(searchText.toLowerCase()) || cert.name.toLowerCase().includes(searchText.toLowerCase());
    return matchesSearch && (!standardFilter || cert.standard === standardFilter) && (!categoryFilter || cert.category === categoryFilter);
  });

  const columns: any = [
    { title: '证书', dataIndex: 'imageUrl', width: 120, render: (url: string) => renderFileCell(url) },
    { title: '公司名称', dataIndex: 'companyName', width: 180 },
    { title: '证书名称', dataIndex: 'name', width: 200 },
    { title: '标准', dataIndex: 'standard', width: 100 },
    { title: '日期', dataIndex: 'issueDate', width: 120 },
    {
      title: '操作', key: 'action', width: 140, render: (_: any, record: Certificate) => (
        <Space>
          <Button type="text" icon={<EyeOutlined />} onClick={() => { setSelectedCertificate(record); setViewModalVisible(true); }} />
          {isAdmin && <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDeleteCertificate(record.id)} />}
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}><SafetyCertificateOutlined /> 证书管理系统</Title>
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="证书管理" key="certificates">
          <Card style={{ marginBottom: 24 }}>
            <Row gutter={16}>
              <Col span={8}><Input placeholder="搜索" value={searchText} onChange={(e) => setSearchText(e.target.value)} /></Col>
            </Row>
          </Card>
          <Table columns={columns} dataSource={filteredCertificates} rowKey="id" loading={loading} />
        </TabPane>

        {isAdmin && (
          <TabPane tab="添加证书" key="add-certificate">
            <Card title="批量添加证书" style={{ maxWidth: 800 }}>
              <Form form={certificateForm} layout="vertical" onFinish={handleAddCertificate}>
                <Form.Item name="companyId" label="所属公司" rules={[{ required: true }]}>
                  <Select>{companies.map(c => <Option key={c.id} value={c.id}>{c.name}</Option>)}</Select>
                </Form.Item>
                <Row gutter={16}>
                  <Col span={12}><Form.Item name="standard" label="标准类型" rules={[{ required: true }]}><Select>{standards.map(s => <Option key={s} value={s}>{s}</Option>)}</Select></Form.Item></Col>
                  <Col span={12}><Form.Item name="category" label="证书分类" rules={[{ required: true }]}><Select>{categories.map(c => <Option key={c} value={c}>{c}</Option>)}</Select></Form.Item></Col>
                </Row>
                <Row gutter={16}>
                  <Col span={12}><Form.Item name="issueDate" label="发证日期" rules={[{ required: true }]}><DatePicker style={{ width: '100%' }} /></Form.Item></Col>
                  <Col span={12}><Form.Item name="expiryDate" label="有效期至" rules={[{ required: true }]}><DatePicker style={{ width: '100%' }} /></Form.Item></Col>
                </Row>
                <Form.Item name="issuingAuthority" label="发证机构" rules={[{ required: true }]}><Input /></Form.Item>
                <Form.Item name="status" label="证书状态" initialValue="valid"><Select>{statuses.map(s => <Option key={s.value} value={s.value}>{s.label}</Option>)}</Select></Form.Item>

                {/* 批量上传组件 */}
                <Form.Item label="证书文件/文件夹" required>
                  <Upload
                    beforeUpload={() => false}
                    onChange={(info) => {
                      const files = info.fileList
                        .filter((f) => f.status !== 'removed')
                        .map((f) => f.originFileObj as File);

                      if (files.length > 0) {
                        handleFilesChange(files);
                      }
                    }}
                    showUploadList={false}
                    // 【修改点】：删掉 directory={true}，或者改为 false
                    // directory={true} 
                    multiple={true}
                    // 【修改点】：加上一个宽泛的 accept，或者直接删掉它以显示所有文件
                    accept="*"
                  >
                    <Button icon={<UploadOutlined />}>选择文件或文件夹(可全选)</Button>
                  </Upload>
                  {pendingFiles.length > 0 && (
                    <div style={{ marginTop: 16 }}>
                      <Text strong>待上传列表 ({pendingFiles.length}个):</Text>
                      <List size="small" dataSource={pendingFiles} renderItem={(item: any) => <List.Item>{item.name}</List.Item>} />
                      <Button danger size="small" onClick={() => setPendingFiles([])} style={{ marginTop: 8 }}>清空</Button>
                    </div>
                  )}
                </Form.Item>

                <Button type="primary" htmlType="submit" loading={loading} size="large">开始批量上传</Button>
              </Form>
            </Card>
          </TabPane>
        )}

        {isAdmin && <TabPane tab="公司管理" key="companies"> {/* ...原有公司管理代码... */}</TabPane>}
      </Tabs>
    </div>
  );
};

export default CertificateUpload;