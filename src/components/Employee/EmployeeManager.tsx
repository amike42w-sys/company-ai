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
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SearchOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '../../store/authStore';

const { Title, Text } = Typography;
const { Option } = Select;
const { confirm } = Modal;

interface Employee {
  id: string;
  name: string;
  employeeNo: string;
  department: string;
  position: string;
  phone: string;
  email: string;
  status: 'active' | 'inactive' | 'on_leave';
  joinDate: string;
  gender: 'male' | 'female';
  idCard?: string;
  address?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
}

const EmployeeManager: React.FC = () => {
  const { role } = useAuthStore();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [form] = Form.useForm();

  const isAdmin = role === 'internal';

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    setTimeout(() => {
      setEmployees([
        {
          id: '1',
          name: '张三',
          employeeNo: 'EMP001',
          department: '技术部',
          position: '工程师',
          phone: '13800138001',
          email: 'zhangsan@company.com',
          status: 'active',
          joinDate: '2023-03-15',
          gender: 'male',
        },
        {
          id: '2',
          name: '李四',
          employeeNo: 'EMP002',
          department: '销售部',
          position: '销售经理',
          phone: '13800138002',
          email: 'lisi@company.com',
          status: 'active',
          joinDate: '2022-06-20',
          gender: 'female',
        },
      ]);
      setLoading(false);
    }, 500);
  };

  const handleAdd = () => {
    setEditingEmployee(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record: Employee) => {
    setEditingEmployee(record);
    const formValues = {
      ...record,
    };
    form.setFieldsValue(formValues);
    setIsModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    confirm({
      title: '确认删除',
      content: '确定要删除该员工吗？此操作不可恢复。',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        setEmployees(employees.filter(employee => employee.id !== id));
        message.success('员工删除成功');
      },
    });
  };

  const handleSubmit = async (values: any) => {
    if (editingEmployee) {
      const updatedEmployees = employees.map(emp => 
        emp.id === editingEmployee.id ? { ...emp, ...values } : emp
      );
      setEmployees(updatedEmployees);
      message.success('员工更新成功');
    } else {
      const newEmployee: Employee = {
        id: Date.now().toString(),
        name: values.name,
        employeeNo: values.employeeNo,
        department: values.department,
        position: values.position,
        phone: values.phone,
        email: values.email || '',
        status: values.status || 'active',
        joinDate: values.joinDate || new Date().toISOString().split('T')[0],
        gender: values.gender,
        idCard: values.idCard,
        address: values.address,
        emergencyContact: values.emergencyContact,
        emergencyPhone: values.emergencyPhone,
      };
      setEmployees([...employees, newEmployee]);
      message.success('员工添加成功');
    }
    setIsModalVisible(false);
  };

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchText.toLowerCase()) ||
      employee.employeeNo.toLowerCase().includes(searchText.toLowerCase()) ||
      employee.phone.includes(searchText) ||
      employee.department.toLowerCase().includes(searchText.toLowerCase())
  );

  const getStatusTag = (status: string) => {
    const statusMap: Record<string, { color: string; text: string }> = {
      active: { color: 'green', text: '在职' },
      inactive: { color: 'red', text: '离职' },
      on_leave: { color: 'orange', text: '休假' },
    };
    const { color, text } = statusMap[status] || { color: 'default', text: status };
    return <Tag color={color}>{text}</Tag>;
  };

  const columns = [
    {
      title: '员工编号',
      dataIndex: 'employeeNo',
      key: 'employeeNo',
      width: 120,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: 100,
    },
    {
      title: '性别',
      dataIndex: 'gender',
      key: 'gender',
      width: 80,
      render: (gender: string) => (gender === 'male' ? '男' : '女'),
    },
    {
      title: '部门',
      dataIndex: 'department',
      key: 'department',
      width: 120,
    },
    {
      title: '职位',
      dataIndex: 'position',
      key: 'position',
      width: 120,
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      key: 'phone',
      width: 150,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => getStatusTag(status),
    },
    {
      title: '入职日期',
      dataIndex: 'joinDate',
      key: 'joinDate',
      width: 120,
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      align: 'left' as const,
      render: (_: any, record: Employee) => (
        <Space size="small">
          <Tooltip title="查看">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handleEdit(record)}
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
        <UserOutlined style={{ marginRight: 12 }} />
        员工管理系统
      </Title>
      <Text type="secondary">管理员工信息、部门分配和在职状态</Text>

      <Divider />

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={16}>
          <Input
            placeholder="搜索姓名、工号、电话或部门"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 400 }}
          />
        </Col>
        <Col span={8} style={{ textAlign: 'right' }}>
          {isAdmin && (
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              添加员工
            </Button>
          )}
        </Col>
      </Row>

      <Card>
        <Table
          columns={columns}
          dataSource={filteredEmployees}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1200 }}
        />
      </Card>

      <Modal
        title={editingEmployee ? '编辑员工' : '添加员工'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
        width={800}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="姓名"
                rules={[{ required: true, message: '请输入姓名' }]}
              >
                <Input placeholder="请输入姓名" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="employeeNo"
                label="员工编号"
                rules={[{ required: true, message: '请输入员工编号' }]}
              >
                <Input placeholder="请输入员工编号" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="gender"
                label="性别"
                rules={[{ required: true, message: '请选择性别' }]}
              >
                <Select placeholder="请选择性别">
                  <Option value="male">男</Option>
                  <Option value="female">女</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="department"
                label="部门"
                rules={[{ required: true, message: '请输入部门' }]}
              >
                <Input placeholder="请输入部门" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="position"
                label="职位"
                rules={[{ required: true, message: '请输入职位' }]}
              >
                <Input placeholder="请输入职位" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="joinDate"
                label="入职日期"
                rules={[{ required: true, message: '请输入入职日期' }]}
              >
                <Input placeholder="请输入入职日期，如 2024-01-01" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="联系电话"
                rules={[{ required: true, message: '请输入联系电话' }]}
              >
                <Input placeholder="请输入联系电话" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="email" label="邮箱">
                <Input placeholder="请输入邮箱" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="idCard" label="身份证号">
                <Input placeholder="请输入身份证号" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="状态"
                initialValue="active"
              >
                <Select placeholder="请选择状态">
                  <Option value="active">在职</Option>
                  <Option value="inactive">离职</Option>
                  <Option value="on_leave">休假</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="address" label="家庭住址">
            <Input.TextArea rows={2} placeholder="请输入家庭住址" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="emergencyContact" label="紧急联系人">
                <Input placeholder="请输入紧急联系人" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="emergencyPhone" label="紧急联系电话">
                <Input placeholder="请输入紧急联系电话" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default EmployeeManager;
