import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Space, Typography, Card, Avatar, message, Spin } from 'antd';
import type { TableColumnsType } from 'antd';
import { EyeOutlined, UserOutlined, RobotOutlined, ReloadOutlined } from '@ant-design/icons';
import { api } from '../../services/api';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

interface ChatSession {
  id: string;
  userName: string;
  lastMessage: string;
  updatedAt: string;
  messageCount: number;
}

interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  type?: string;
  createdAt: string;
}

const ChatMonitor: React.FC = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState<ChatMessage[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [messagesLoading, setMessagesLoading] = useState(false);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    setLoading(true);
    try {
      const result = await api.getAdminChatSessions();
      if (result.success) {
        setSessions(result.sessions);
      }
    } catch (error) {
      console.error('加载会话列表失败:', error);
      message.error('加载会话列表失败');
    } finally {
      setLoading(false);
    }
  };

  const showChatDetail = async (sessionId: string, userName: string) => {
    setSelectedUser(userName);
    setModalVisible(true);
    setMessagesLoading(true);
    
    try {
      const result = await api.getAdminChatMessages(sessionId);
      if (result.success) {
        setSelectedMessages(result.messages);
      }
    } catch (error) {
      console.error('加载对话详情失败:', error);
      message.error('加载对话详情失败');
    } finally {
      setMessagesLoading(false);
    }
  };

  const columns: TableColumnsType<ChatSession> = [
    { title: '客户标识', dataIndex: 'userName', key: 'userName', fixed: 'left' },
    { title: '数量', dataIndex: 'messageCount', key: 'messageCount', responsive: ['md'] },
    {
      title: '最后咨询时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (t: string) => dayjs(t).format('MM-DD HH:mm')
    },
    { title: '预览', dataIndex: 'lastMessage', key: 'lastMessage', ellipsis: true, responsive: ['sm'] },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: ChatSession) => (
        <Button
          icon={<EyeOutlined />}
          onClick={() => showChatDetail(record.id, record.userName)}
        >
          查看对话内容
        </Button>
      )
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <Title level={2}>聊天监控</Title>
          <Text type="secondary">查看所有客户的咨询记录</Text>
        </div>
        <Button type="primary" icon={<ReloadOutlined />} onClick={loadSessions}>
          刷新数据
        </Button>
      </div>
      
      <Card style={{ marginTop: '24px' }}>
        <Table
          columns={columns}
          dataSource={sessions}
          rowKey="id"
          loading={loading}
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条会话`
          }}
          scroll={{ x: 'max-content' }}
        />
      </Card>

      <Modal
        title={`与 ${selectedUser} 的对话`}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        width={600}
        footer={[
          <Button key="close" onClick={() => setModalVisible(false)}>
            关闭
          </Button>
        ]}
      >
        {messagesLoading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <Spin size="large" />
          </div>
        ) : (
          <div style={{ maxHeight: '500px', overflowY: 'auto', padding: '10px' }}>
            {selectedMessages.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                暂无消息
              </div>
            ) : (
              <Space direction="vertical" style={{ width: '100%' }}>
                {selectedMessages.map((msg) => (
                  <div
                    key={msg.id}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      marginBottom: '16px',
                      flexDirection: msg.role === 'user' ? 'row-reverse' : 'row'
                    }}
                  >
                    <Avatar
                      style={{
                        flexShrink: 0,
                        marginRight: msg.role === 'user' ? '0' : '12px',
                        marginLeft: msg.role === 'user' ? '12px' : '0',
                        backgroundColor: msg.role === 'user' ? '#1890ff' : '#52c41a'
                      }}
                      icon={msg.role === 'user' ? <UserOutlined /> : <RobotOutlined />}
                    />
                    <div
                      style={{
                        maxWidth: '70%',
                        backgroundColor: msg.role === 'user' ? '#1890ff' : '#f0f0f0',
                        color: msg.role === 'user' ? '#fff' : '#333',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        wordBreak: 'break-word'
                      }}
                    >
                      <div>{msg.content}</div>
                      <div
                        style={{
                          fontSize: '11px',
                          color: msg.role === 'user' ? 'rgba(255,255,255,0.7)' : '#999',
                          marginTop: '4px'
                        }}
                      >
                        {dayjs(msg.createdAt).format('HH:mm')}
                      </div>
                    </div>
                  </div>
                ))}
              </Space>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ChatMonitor;
