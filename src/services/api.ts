const API_BASE = '/api';

export const api = {
  async login(username: string, password: string) {
    const response = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    return response.json();
  },

  async register(username: string, password: string, email?: string, phone?: string) {
    const response = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, email, phone }),
    });
    return response.json();
  },

  async getUser(userId: string) {
    const response = await fetch(`${API_BASE}/user/${userId}`);
    return response.json();
  },

  async updateUser(userId: string, data: { email?: string; phone?: string; password?: string }) {
    const response = await fetch(`${API_BASE}/user/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async createSession(userId: string, type: 'company' | 'analysis', title?: string) {
    const response = await fetch(`${API_BASE}/sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, type, title }),
    });
    return response.json();
  },

  async getSessions(userId: string, type?: 'company' | 'analysis') {
    const url = type 
      ? `${API_BASE}/sessions/${userId}?type=${type}`
      : `${API_BASE}/sessions/${userId}`;
    const response = await fetch(url);
    return response.json();
  },

  async deleteSession(sessionId: string) {
    const response = await fetch(`${API_BASE}/sessions/${sessionId}`, {
      method: 'DELETE',
    });
    return response.json();
  },

  async clearSessions(userId: string | number) {
    try {
      const response = await fetch(`${API_BASE}/sessions/user/${userId}`, {
        method: 'DELETE',
      });
      return response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  async saveMessage(sessionId: string, userId: string, role: 'user' | 'assistant', content: string, type?: 'company' | 'analysis', lang?: string) {
    const response = await fetch(`${API_BASE}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, userId, role, content, type, lang }),
    });
    return response.json();
  },

  async getSessionMessages(sessionId: string) {
    const response = await fetch(`${API_BASE}/messages/${sessionId}`);
    return response.json();
  },

  async getUserMessages(userId: string, type?: 'company' | 'analysis') {
    const url = type 
      ? `${API_BASE}/messages/user/${userId}?type=${type}`
      : `${API_BASE}/messages/user/${userId}`;
    const response = await fetch(url);
    return response.json();
  },

  // ==================== 证书管理 API ====================
  
  // 获取所有公司列表
  async getCompanies() {
    const response = await fetch(`${API_BASE}/companies`);
    return response.json();
  },

  // 添加新公司
  async addCompany(name: string, description?: string) {
    const response = await fetch(`${API_BASE}/companies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description }),
    });
    return response.json();
  },

  // 更新公司
  async updateCompany(companyId: string, data: { name?: string; description?: string }) {
    const response = await fetch(`${API_BASE}/companies/${companyId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // 删除公司
  async deleteCompany(companyId: string) {
    const response = await fetch(`${API_BASE}/companies/${companyId}`, {
      method: 'DELETE',
    });
    return response.json();
  },

  // 获取所有证书列表
  async getCertificates() {
    const response = await fetch(`${API_BASE}/certificates`);
    return response.json();
  },

  // 获取单个证书详情
  async getCertificate(certificateId: string) {
    const response = await fetch(`${API_BASE}/certificates/${certificateId}`);
    return response.json();
  },

  // 添加证书 (支持传入 JSON 或 FormData)
  async addCertificate(data: any) {
    const isFormData = data instanceof FormData;
    const options: RequestInit = {
      method: 'POST',
      body: isFormData ? data : JSON.stringify(data),
    };
    // 只有当不是 FormData 时，才手动设置 Content-Type 为 json
    if (!isFormData) {
      options.headers = { 'Content-Type': 'application/json' };
    }
    
    const response = await fetch(`${API_BASE}/certificates`, options);
    return response.json();
  },

  // 更新证书 (支持传入 JSON 或 FormData)
  async updateCertificate(certificateId: string, data: any) {
    const isFormData = data instanceof FormData;
    const options: RequestInit = {
      method: 'PUT',
      body: isFormData ? data : JSON.stringify(data),
    };
    if (!isFormData) {
      options.headers = { 'Content-Type': 'application/json' };
    }

    const response = await fetch(`${API_BASE}/certificates/${certificateId}`, options);
    return response.json();
  },

  // 删除证书
  async deleteCertificate(certificateId: string) {
    const response = await fetch(`${API_BASE}/certificates/${certificateId}`, {
      method: 'DELETE',
    });
    return response.json();
  },

  // ==================== 报价单 API ====================

  // 获取所有报价单
  async getQuotations() {
    const response = await fetch(`${API_BASE}/quotations`);
    return response.json();
  },

  // 获取单个报价单
  async getQuotation(quotationId: string) {
    const response = await fetch(`${API_BASE}/quotations/${quotationId}`);
    return response.json();
  },

  // 创建报价单
  async createQuotation(data: {
    customerName: string;
    standard: string;
    standardRate: number;
    items: any[];
    totalAmount: number;
    status: string;
    notes?: string;
  }) {
    const response = await fetch(`${API_BASE}/quotations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // 更新报价单
  async updateQuotation(quotationId: string, data: {
    customerName?: string;
    standard?: string;
    standardRate?: number;
    items?: any[];
    totalAmount?: number;
    status?: string;
    notes?: string;
  }) {
    const response = await fetch(`${API_BASE}/quotations/${quotationId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // 删除报价单
  async deleteQuotation(quotationId: string) {
    const response = await fetch(`${API_BASE}/quotations/${quotationId}`, {
      method: 'DELETE',
    });
    return response.json();
  },

  // ==================== 客户管理 API ====================

  // 1. 获取所有客户
  async getCustomers() {
    const response = await fetch(`${API_BASE}/customers`);
    return response.json();
  },

  // 2. 添加客户 (增加了 requirement 和 completionDate 字段定义)
  async addCustomer(data: {
    level: string;
    name: string;
    region: string;
    buildingType: string;
    productType: string;
    status: string;
    manager: string;
    date: string;
    phone?: string;            // 【新增】
    requirement?: string;      // 【新增】
    completionDate?: string;   // 【新增】
  }) {
    const response = await fetch(`${API_BASE}/customers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // 3. 【新增：修改客户接口】解决 TS2551 报错
  async updateCustomer(id: string, data: {
    level: string;
    name: string;
    region: string;
    buildingType: string;
    productType: string;
    status: string;
    manager: string;
    date: string;
    phone?: string;
    requirement?: string;
    completionDate?: string;
  }) {
    const response = await fetch(`${API_BASE}/customers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // 4. 【新增：删除客户接口】解决 TS2339 报错
  async deleteCustomer(id: string) {
    const response = await fetch(`${API_BASE}/customers/${id}`, {
      method: 'DELETE'
    });
    return response.json();
  },

  // ==================== 管理员监控 API ====================
  async getAdminChatSessions() {
    const response = await fetch(`${API_BASE}/admin/chat-sessions`);
    return response.json();
  },

  async getAdminChatMessages(sessionId: string) {
    const response = await fetch(`${API_BASE}/admin/chat-messages/${sessionId}`);
    return response.json();
  }
};



