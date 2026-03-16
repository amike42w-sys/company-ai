const express = require('express');
const fs = require('fs');
const path = require('path');
const { readJSON, writeJSON, usersPath, sessionsPath, messagesPath, certificatesPath, companiesPath, quotationsPath, certificatesUploadPath, initDatabase } = require('./database');

// 【第二步修改】打印后端使用的文件存储目录
console.log("后端使用的文件存储目录是:", certificatesUploadPath);

// 简单的ID生成函数
function generateId() {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

const app = express();
const PORT = 3001;

// 简单的CORS头部设置
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

app.use(express.json({ limit: '150mb' }));

// 自定义静态文件服务 - 确保正确设置Content-Type
app.get('/uploads/certificates/:filename', (req, res) => {
  const filename = req.params.filename;
  
  // 【关键修改】强制使用 path.resolve 向上回退一级目录，确保定位到根目录下的 uploads
  // 假设你的 index.js 在 server 文件夹里，uploads 在根目录下，这里使用 '..' 返回上一级
  const rootDir = path.resolve(__dirname, '..');
  const filePath = path.join(rootDir, 'uploads', 'certificates', filename);
  
  console.log("后端正在寻找文件路径:", filePath); // 这里会打印出真实的绝对路径
  
  // 检查文件是否存在
  if (!fs.existsSync(filePath)) {
    console.error("文件未找到:", filePath); // 报错时把路径打印出来
    return res.status(404).json({ success: false, message: '文件不存在' });
  }
  
  // 根据文件扩展名设置正确的Content-Type
  const ext = path.extname(filename).toLowerCase();
  let contentType = 'application/octet-stream';
  
  if (ext === '.png') contentType = 'image/png';
  else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
  else if (ext === '.gif') contentType = 'image/gif';
  else if (ext === '.pdf') contentType = 'application/pdf';

  res.setHeader('Content-Type', contentType);
  res.setHeader('Content-Disposition', 'inline');
  
  res.sendFile(filePath);
});

initDatabase();

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const users = readJSON(usersPath);
    const user = users.find(u => u.username === username);
    
    if (!user) {
      return res.json({ success: false, message: '用户名或密码错误' });
    }
    
    // 暂时使用明文密码验证，方便测试
    const isValid = user.password === password;
    
    if (!isValid) {
      return res.json({ success: false, message: '用户名或密码错误' });
    }
    
    const { password: _, ...userWithoutPassword } = user;
    res.json({ 
      success: true, 
      user: userWithoutPassword 
    });
  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

app.post('/api/register', async (req, res) => {
  const { username, password, email, phone } = req.body;
  
  try {
    const users = readJSON(usersPath);
    
    const existingUser = users.find(u => u.username === username);
    
    if (existingUser) {
      return res.json({ success: false, message: '用户名已存在' });
    }
    
    const id = generateId();
    const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;
    const now = Date.now();
    
    const newUser = {
      id,
      username,
      password: password,
      email: email || null,
      phone: phone || null,
      avatar,
      role: 'external',
      emailVerified: false,
      phoneVerified: false,
      createdAt: now,
      updatedAt: now
    };
    
    users.push(newUser);
    writeJSON(usersPath, users);
    
    const { password: _, ...userWithoutPassword } = newUser;
    
    res.json({ 
      success: true, 
      user: userWithoutPassword 
    });
  } catch (error) {
    console.error('注册错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

app.get('/api/user/:id', (req, res) => {
  try {
    const users = readJSON(usersPath);
    const user = users.find(u => u.id === req.params.id);
    
    if (!user) {
      return res.json({ success: false, message: '用户不存在' });
    }
    
    const { password: _, ...userWithoutPassword } = user;
    res.json({ success: true, user: userWithoutPassword });
  } catch (error) {
    console.error('获取用户错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

app.put('/api/user/:id', (req, res) => {
  const { email, phone, password } = req.body;
  const userId = req.params.id;
  
  try {
    const users = readJSON(usersPath);
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return res.json({ success: false, message: '用户不存在' });
    }
    
    if (email) users[userIndex].email = email;
    if (phone) users[userIndex].phone = phone;
    if (password) {
      users[userIndex].password = password;
    }
    
    users[userIndex].updatedAt = Date.now();
    writeJSON(usersPath, users);
    
    const { password: _, ...userWithoutPassword } = users[userIndex];
    
    res.json({ success: true, user: userWithoutPassword });
  } catch (error) {
    console.error('更新用户错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

app.post('/api/sessions', (req, res) => {
  const { userId, type, title } = req.body;
  
  try {
    const sessions = readJSON(sessionsPath);
    const id = generateId();
    const now = Date.now();
    
    const newSession = {
      id,
      userId,
      title: title || '新对话',
      type,
      createdAt: now,
      updatedAt: now,
      messageCount: 0
    };
    
    sessions.push(newSession);
    writeJSON(sessionsPath, sessions);
    
    res.json({ success: true, sessionId: id });
  } catch (error) {
    console.error('创建会话错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

app.get('/api/sessions/:userId', (req, res) => {
  const { userId } = req.params;
  const { type } = req.query;
  
  try {
    let sessions = readJSON(sessionsPath);
    sessions = sessions.filter(s => s.userId === userId);
    
    if (type) {
      sessions = sessions.filter(s => s.type === type);
    }
    
    sessions.sort((a, b) => b.updatedAt - a.updatedAt);
    
    res.json({ success: true, sessions });
  } catch (error) {
    console.error('获取会话列表错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

app.delete('/api/sessions/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  
  try {
    let sessions = readJSON(sessionsPath);
    let messages = readJSON(messagesPath);
    
    sessions = sessions.filter(s => s.id !== sessionId);
    messages = messages.filter(m => m.sessionId !== sessionId);
    
    writeJSON(sessionsPath, sessions);
    writeJSON(messagesPath, messages);
    
    res.json({ success: true });
  } catch (error) {
    console.error('删除会话错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

app.delete('/api/sessions/user/:userId', (req, res) => {
  const { userId } = req.params;
  const { type } = req.query;
  
  try {
    let sessions = readJSON(sessionsPath);
    let messages = readJSON(messagesPath);
    
    let userSessions = sessions.filter(s => s.userId === userId);
    if (type) {
      userSessions = userSessions.filter(s => s.type === type);
    }
    
    const sessionIds = userSessions.map(s => s.id);
    
    sessions = sessions.filter(s => !sessionIds.includes(s.id));
    messages = messages.filter(m => !sessionIds.includes(m.sessionId));
    
    writeJSON(sessionsPath, sessions);
    writeJSON(messagesPath, messages);
    
    res.json({ success: true });
  } catch (error) {
    console.error('清空会话错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

app.post('/api/messages', (req, res) => {
  const { sessionId, userId, role, content, type } = req.body;
  
  try {
    const messages = readJSON(messagesPath);
    const sessions = readJSON(sessionsPath);
    
    const id = generateId();
    const timestamp = Date.now();
    
    const newMessage = {
      id,
      sessionId,
      userId,
      role,
      content,
      type,
      timestamp
    };
    
    messages.push(newMessage);
    writeJSON(messagesPath, messages);
    
    if (sessionId) {
      const sessionIndex = sessions.findIndex(s => s.id === sessionId);
      if (sessionIndex !== -1) {
        const sessionMessages = messages.filter(m => m.sessionId === sessionId);
        sessions[sessionIndex].messageCount = sessionMessages.length;
        sessions[sessionIndex].updatedAt = timestamp;
        writeJSON(sessionsPath, sessions);
      }
    }
    
    res.json({ success: true, messageId: id });
  } catch (error) {
    console.error('保存消息错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

app.get('/api/messages/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  
  try {
    const messages = readJSON(messagesPath);
    const sessionMessages = messages
      .filter(m => m.sessionId === sessionId)
      .sort((a, b) => a.timestamp - b.timestamp);
    
    res.json({ success: true, messages: sessionMessages });
  } catch (error) {
    console.error('获取消息错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

app.get('/api/messages/user/:userId', (req, res) => {
  const { userId } = req.params;
  const { type } = req.query;
  
  try {
    const messages = readJSON(messagesPath);
    const sessions = readJSON(sessionsPath);
    
    let userSessions = sessions.filter(s => s.userId === userId);
    if (type) {
      userSessions = userSessions.filter(s => s.type === type);
    }
    
    const sessionIds = userSessions.map(s => s.id);
    
    const userMessages = messages
      .filter(m => sessionIds.includes(m.sessionId))
      .sort((a, b) => a.timestamp - b.timestamp);
    
    res.json({ success: true, messages: userMessages });
  } catch (error) {
    console.error('获取用户消息错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// ==================== 证书管理 API ====================

// 获取所有公司列表
app.get('/api/companies', (req, res) => {
  try {
    const companies = readJSON(companiesPath, []);
    res.json({ success: true, companies });
  } catch (error) {
    console.error('获取公司列表错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// 添加新公司
app.post('/api/companies', (req, res) => {
  const { name, description } = req.body;
  
  try {
    const companies = readJSON(companiesPath, []);
    
    // 检查公司是否已存在
    const existingCompany = companies.find(c => c.name === name);
    if (existingCompany) {
      return res.json({ success: false, message: '公司已存在' });
    }
    
    const newCompany = {
      id: generateId(),
      name,
      description: description || '',
      createdAt: Date.now()
    };
    
    companies.push(newCompany);
    writeJSON(companiesPath, companies);
    
    res.json({ success: true, company: newCompany });
  } catch (error) {
    console.error('添加公司错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// 更新公司
app.put('/api/companies/:id', (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  
  try {
    let companies = readJSON(companiesPath, []);
    const index = companies.findIndex(c => c.id === id);
    
    if (index === -1) {
      return res.json({ success: false, message: '公司不存在' });
    }
    
    // 检查新名称是否与其他公司重复
    if (name && name !== companies[index].name) {
      const existingCompany = companies.find(c => c.name === name && c.id !== id);
      if (existingCompany) {
        return res.json({ success: false, message: '公司名称已存在' });
      }
    }
    
    // 更新公司信息
    if (name) companies[index].name = name;
    if (description !== undefined) companies[index].description = description;
    companies[index].updatedAt = Date.now();
    
    writeJSON(companiesPath, companies);
    
    res.json({ success: true, company: companies[index] });
  } catch (error) {
    console.error('更新公司错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// 删除公司
app.delete('/api/companies/:id', (req, res) => {
  const { id } = req.params;
  
  try {
    let companies = readJSON(companiesPath, []);
    let certificates = readJSON(certificatesPath, []);
    
    // 删除公司
    companies = companies.filter(c => c.id !== id);
    
    // 删除该公司相关的所有证书
    const companyCertificates = certificates.filter(c => c.companyId === id);
    certificates = certificates.filter(c => c.companyId !== id);
    
    // 删除证书图片文件
    companyCertificates.forEach(cert => {
      if (cert.imagePath && fs.existsSync(cert.imagePath)) {
        fs.unlinkSync(cert.imagePath);
      }
    });
    
    writeJSON(companiesPath, companies);
    writeJSON(certificatesPath, certificates);
    
    res.json({ success: true });
  } catch (error) {
    console.error('删除公司错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// 获取所有证书列表
app.get('/api/certificates', (req, res) => {
  try {
    const certificates = readJSON(certificatesPath, []);
    const companies = readJSON(companiesPath, []);
    
    // 添加公司信息到证书数据
    const certificatesWithCompany = certificates.map(cert => {
      const company = companies.find(c => c.id === cert.companyId);
      return {
        ...cert,
        companyName: company ? company.name : '未知公司'
      };
    });
    
    res.json({ success: true, certificates: certificatesWithCompany });
  } catch (error) {
    console.error('获取证书列表错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// 获取单个证书详情
app.get('/api/certificates/:id', (req, res) => {
  const { id } = req.params;
  
  try {
    const certificates = readJSON(certificatesPath, []);
    const companies = readJSON(companiesPath, []);
    
    const certificate = certificates.find(c => c.id === id);
    if (!certificate) {
      return res.json({ success: false, message: '证书不存在' });
    }
    
    const company = companies.find(c => c.id === certificate.companyId);
    
    res.json({ 
      success: true, 
      certificate: {
        ...certificate,
        companyName: company ? company.name : '未知公司'
      }
    });
  } catch (error) {
    console.error('获取证书详情错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// 添加证书（支持Base64图片）
app.post('/api/certificates', (req, res) => {
  const { companyId, name, standard, issueDate, expiryDate, issuingAuthority, description, category, status, imageBase64, originalName } = req.body;
  
  try {
    const certificates = readJSON(certificatesPath, []);
    const companies = readJSON(companiesPath, []);
    
    // 验证公司是否存在
    const company = companies.find(c => c.id === companyId);
    if (!company) {
      return res.json({ success: false, message: '公司不存在' });
    }
    
    let imagePath = null;
    let imageUrl = null;
    
    // 处理Base64图片
    console.log("---------------------------------------");
    console.log("POST 添加证书 - imageBase64 是否有值:", !!imageBase64);
    
    if (imageBase64) {
      console.log("进入文件处理逻辑");
      
      // 【第一步修改】确保文件夹一定存在
      const dir = certificatesUploadPath;
      if (!fs.existsSync(dir)) {
        console.log("文件夹不存在，正在创建:", dir);
        fs.mkdirSync(dir, { recursive: true });
      }
      
      // 1. 获取 MIME 类型 (比如 image/png 或 application/pdf)
      const matches = imageBase64.match(/^data:([A-Za-z-+\/]+);base64,/);
      const mimeType = matches ? matches[1] : 'image/png';
      console.log("检测到的文件类型:", mimeType);
      
      // 2. 根据 MIME 类型动态决定后缀名
      let ext = '.png'; // 默认
      if (mimeType === 'application/pdf') {
        ext = '.pdf';
      } else if (mimeType === 'image/jpeg') {
        ext = '.jpg';
      } else if (mimeType === 'image/gif') {
        ext = '.gif';
      }
      console.log("文件后缀:", ext);

      // 3. 使用正确的后缀名
      const base64Data = imageBase64.replace(/^data:([A-Za-z-+\/]+);base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');
      const fileName = `cert_${generateId()}${ext}`; // 动态扩展名
      const filePath = path.join(certificatesUploadPath, fileName);
      
      console.log("certificatesUploadPath:", certificatesUploadPath);
      console.log("准备保存的完整路径:", filePath);
      console.log("Buffer大小:", buffer.length, "字节");
      
      // 【第一步修改】写入文件，带完整错误处理
      try {
        fs.writeFileSync(filePath, buffer);
        console.log("文件物理写入成功，路径:", filePath);
        imagePath = filePath;
        imageUrl = `/uploads/certificates/${fileName}`;
        console.log("设置 imageUrl 为:", imageUrl);
      } catch (err) {
        console.error("文件写入硬盘失败:", err);
        return res.status(500).json({ success: false, message: '文件保存到服务器失败' });
      }
    } else {
      console.log("没有上传文件");
    }
    console.log("---------------------------------------");
    
    const newCertificate = {
      id: generateId(),
      companyId,
      name,
      standard,
      issueDate,
      expiryDate,
      issuingAuthority,
      description: description || '',
      category,
      status: status || 'valid',
      imagePath,
      imageUrl,
      originalName: originalName || '未知文件',
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    certificates.push(newCertificate);
    writeJSON(certificatesPath, certificates);
    
    res.json({ 
      success: true, 
      certificate: {
        ...newCertificate,
        companyName: company.name
      }
    });
  } catch (error) {
    console.error('添加证书错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// 更新证书
app.put('/api/certificates/:id', (req, res) => {
  const { id } = req.params;
  const { name, standard, issueDate, expiryDate, issuingAuthority, description, category, status, imageBase64, originalName } = req.body;
  
  try {
    const certificates = readJSON(certificatesPath, []);
    const companies = readJSON(companiesPath, []);
    
    const index = certificates.findIndex(c => c.id === id);
    if (index === -1) {
      return res.json({ success: false, message: '证书不存在' });
    }
    
    console.log("正在更新证书，原始数据:", certificates[index]);
    
    // 处理新图片
    console.log("---------------------------------------");
    console.log("PUT 更新开始 - imageBase64 是否有值:", !!imageBase64);
    
    if (imageBase64) {
      console.log("进入文件处理逻辑");
      
      // 【第一步修改】确保文件夹一定存在
      const dir = certificatesUploadPath;
      if (!fs.existsSync(dir)) {
        console.log("文件夹不存在，正在创建:", dir);
        fs.mkdirSync(dir, { recursive: true });
      }
      
      // 删除旧图片
      if (certificates[index].imagePath && fs.existsSync(certificates[index].imagePath)) {
        console.log("删除旧文件:", certificates[index].imagePath);
        try {
          fs.unlinkSync(certificates[index].imagePath);
          console.log("旧文件删除成功");
        } catch (err) {
          console.error("删除旧文件失败:", err);
        }
      }
      
      // 1. 获取 MIME 类型 (比如 image/png 或 application/pdf)
      const matches = imageBase64.match(/^data:([A-Za-z-+\/]+);base64,/);
      const mimeType = matches ? matches[1] : 'image/png';
      console.log("检测到的文件类型:", mimeType);
      
      // 2. 根据 MIME 类型动态决定后缀名
      let ext = '.png'; // 默认
      if (mimeType === 'application/pdf') {
        ext = '.pdf';
      } else if (mimeType === 'image/jpeg') {
        ext = '.jpg';
      } else if (mimeType === 'image/gif') {
        ext = '.gif';
      }
      console.log("文件后缀:", ext);

      // 3. 使用正确的后缀名
      const base64Data = imageBase64.replace(/^data:([A-Za-z-+\/]+);base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');
      const fileName = `cert_${generateId()}${ext}`; // 动态扩展名
      const filePath = path.join(certificatesUploadPath, fileName);
      
      console.log("certificatesUploadPath:", certificatesUploadPath);
      console.log("准备保存的完整路径:", filePath);
      console.log("Buffer大小:", buffer.length, "字节");
      
      // 【第一步修改】写入文件，带完整错误处理
      try {
        fs.writeFileSync(filePath, buffer);
        console.log("文件物理写入成功，路径:", filePath);
        
        certificates[index].imagePath = filePath;
        certificates[index].imageUrl = `/uploads/certificates/${fileName}`;
        console.log("更新 imageUrl 为:", certificates[index].imageUrl);
      } catch (err) {
        console.error("文件写入硬盘失败:", err);
        return res.status(500).json({ success: false, message: '文件保存到服务器失败' });
      }
    } else {
      console.log("没有上传新文件，保持原文件");
    }
    console.log("---------------------------------------");
    
    // 更新其他字段
    if (name) certificates[index].name = name;
    if (standard) certificates[index].standard = standard;
    if (issueDate) certificates[index].issueDate = issueDate;
    if (expiryDate) certificates[index].expiryDate = expiryDate;
    if (issuingAuthority) certificates[index].issuingAuthority = issuingAuthority;
    if (description !== undefined) certificates[index].description = description;
    if (category) certificates[index].category = category;
    if (status) certificates[index].status = status;
    if (originalName) certificates[index].originalName = originalName;
    
    certificates[index].updatedAt = Date.now();
    
    console.log("更新后的证书数据:", certificates[index]);
    
    writeJSON(certificatesPath, certificates);
    
    const company = companies.find(c => c.id === certificates[index].companyId);
    
    res.json({ 
      success: true, 
      certificate: {
        ...certificates[index],
        companyName: company ? company.name : '未知公司'
      }
    });
  } catch (error) {
    console.error('更新证书错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// 删除证书
app.delete('/api/certificates/:id', (req, res) => {
  const { id } = req.params;
  
  try {
    let certificates = readJSON(certificatesPath, []);
    
    const certificate = certificates.find(c => c.id === id);
    if (!certificate) {
      return res.json({ success: false, message: '证书不存在' });
    }
    
    // 删除图片文件
    if (certificate.imagePath && fs.existsSync(certificate.imagePath)) {
      fs.unlinkSync(certificate.imagePath);
    }
    
    certificates = certificates.filter(c => c.id !== id);
    writeJSON(certificatesPath, certificates);
    
    res.json({ success: true });
  } catch (error) {
    console.error('删除证书错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});



// ==================== 报价单 API ====================

// 获取所有报价单
app.get('/api/quotations', (req, res) => {
  try {
    const quotations = readJSON(quotationsPath, []);
    res.json({ success: true, quotations });
  } catch (error) {
    console.error('获取报价单错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// 获取单个报价单
app.get('/api/quotations/:id', (req, res) => {
  const { id } = req.params;
  try {
    const quotations = readJSON(quotationsPath, []);
    const quotation = quotations.find(q => q.id === id);
    if (!quotation) {
      return res.json({ success: false, message: '报价单不存在' });
    }
    res.json({ success: true, quotation });
  } catch (error) {
    console.error('获取报价单错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// 创建报价单
app.post('/api/quotations', (req, res) => {
  const { customerName, standard, standardRate, items, totalAmount, status, notes } = req.body;
  
  try {
    const quotations = readJSON(quotationsPath, []);
    
    const newQuotation = {
      id: generateId(),
      customerName,
      standard: standard || '国标',
      standardRate: standardRate || 1.0,
      items: items || [],
      totalAmount: totalAmount || 0,
      status: status || 'draft',
      notes: notes || '',
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    quotations.push(newQuotation);
    writeJSON(quotationsPath, quotations);
    
    res.json({ success: true, quotation: newQuotation });
  } catch (error) {
    console.error('创建报价单错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// 更新报价单
app.put('/api/quotations/:id', (req, res) => {
  const { id } = req.params;
  const { customerName, standard, standardRate, items, totalAmount, status, notes } = req.body;
  
  try {
    const quotations = readJSON(quotationsPath, []);
    const index = quotations.findIndex(q => q.id === id);
    
    if (index === -1) {
      return res.json({ success: false, message: '报价单不存在' });
    }
    
    if (customerName !== undefined) quotations[index].customerName = customerName;
    if (standard !== undefined) quotations[index].standard = standard;
    if (standardRate !== undefined) quotations[index].standardRate = standardRate;
    if (items !== undefined) quotations[index].items = items;
    if (totalAmount !== undefined) quotations[index].totalAmount = totalAmount;
    if (status !== undefined) quotations[index].status = status;
    if (notes !== undefined) quotations[index].notes = notes;
    quotations[index].updatedAt = Date.now();
    
    writeJSON(quotationsPath, quotations);
    
    res.json({ success: true, quotation: quotations[index] });
  } catch (error) {
    console.error('更新报价单错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// 删除报价单
app.delete('/api/quotations/:id', (req, res) => {
  const { id } = req.params;
  
  try {
    let quotations = readJSON(quotationsPath, []);
    quotations = quotations.filter(q => q.id !== id);
    writeJSON(quotationsPath, quotations);
    
    res.json({ success: true });
  } catch (error) {
    console.error('删除报价单错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

app.listen(PORT, () => {
  console.log(`后端服务器运行在 http://localhost:${PORT}`);
});
