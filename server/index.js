const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
// 导入你的数据库模型和同步函数
const { User, Company, Certificate, Quotation, Message, Session, Customer, syncDatabase } = require('./models');
const { Op } = require('sequelize');
const { sequelize, certificatesUploadPath } = require('./config/database');

// 配置 multer 中间件
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = certificatesUploadPath;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const fileName = `cert_${Date.now().toString() + Math.random().toString(36).substr(2, 9)}${ext}`;
    cb(null, fileName);
  }
});

const upload = multer({ storage: storage });

// 打印后端使用的文件存储目录
console.log("后端使用的文件存储目录是:", certificatesUploadPath);

// 简单的ID生成函数
function generateId() {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

const app = express();
const PORT = 3001;

// 在 app 启动前先同步数据库
syncDatabase(); // 确保数据库表存在

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

// 1. 设置静态资源目录 (指向打包好的 dist 文件夹)
app.use(express.static(path.join(__dirname, '../dist')));

// 自定义静态文件服务 - 确保正确设置Content-Type
app.get('/uploads/certificates/:filename', (req, res) => {
  const filename = req.params.filename;

  // 强制使用 path.resolve 向上回退一级目录，确保定位到根目录下的 uploads
  const rootDir = path.resolve(__dirname, '..');
  const filePath = path.join(rootDir, 'uploads', 'certificates', filename);

  console.log("后端正在寻找文件路径:", filePath);

  // 检查文件是否存在
  if (!fs.existsSync(filePath)) {
    console.error("文件未找到:", filePath);
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

// ==================== 用户 API ====================

// 登录接口重构
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username } });
    if (!user || user.password !== password) {
      return res.json({ success: false, message: '用户名或密码错误' });
    }
    // 登录成功，返回用户信息
    res.json({ success: true, user: { id: user.id, username: user.username, role: user.role } });
  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// 注册接口
app.post('/api/register', async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.json({ success: false, message: '用户名已存在' });
    }
    const newUser = await User.create({
      id: generateId(),
      username,
      password,
      role: role || 'user'
    });
    res.json({ success: true, user: { id: newUser.id, username: newUser.username, role: newUser.role } });
  } catch (error) {
    console.error('注册错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// ==================== 公司 API ====================

// 获取所有公司
app.get('/api/companies', async (req, res) => {
  try {
    const companies = await Company.findAll();
    res.json({ success: true, companies });
  } catch (error) {
    console.error('获取公司列表错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// 添加公司
app.post('/api/companies', async (req, res) => {
  const { name, contact, phone, address, industry, notes } = req.body;
  try {
    const newCompany = await Company.create({
      id: generateId(),
      name,
      contact,
      phone,
      address,
      industry,
      notes,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    res.json({ success: true, company: newCompany });
  } catch (error) {
    console.error('添加公司错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// 更新公司
app.put('/api/companies/:id', async (req, res) => {
  const { id } = req.params;
  const { name, contact, phone, address, industry, notes } = req.body;
  try {
    const company = await Company.findByPk(id);
    if (!company) {
      return res.json({ success: false, message: '公司不存在' });
    }
    company.name = name;
    company.contact = contact;
    company.phone = phone;
    company.address = address;
    company.industry = industry;
    company.notes = notes;
    company.updatedAt = new Date();
    await company.save();
    res.json({ success: true, company });
  } catch (error) {
    console.error('更新公司错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// 删除公司
app.delete('/api/companies/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const company = await Company.findByPk(id);
    if (!company) {
      return res.json({ success: false, message: '公司不存在' });
    }
    await company.destroy();
    res.json({ success: true });
  } catch (error) {
    console.error('删除公司错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// ==================== 证书 API ====================

// 获取所有证书
app.get('/api/certificates', async (req, res) => {
  try {
    const certificates = await Certificate.findAll();
    // 获取所有公司信息用于关联
    const companies = await Company.findAll();
    const companyMap = {};
    companies.forEach(c => {
      companyMap[c.id] = c.name;
    });

    // 为每个证书添加公司名称
    const certificatesWithCompany = certificates.map(cert => ({
      ...cert.toJSON(),
      companyName: companyMap[cert.companyId] || '未知公司'
    }));

    res.json({ success: true, certificates: certificatesWithCompany });
  } catch (error) {
    console.error('获取证书列表错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// 获取单个证书详情
app.get('/api/certificates/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const certificate = await Certificate.findByPk(id);
    if (!certificate) {
      return res.json({ success: false, message: '证书不存在' });
    }

    const company = await Company.findByPk(certificate.companyId);

    res.json({
      success: true,
      certificate: {
        ...certificate.toJSON(),
        companyName: company ? company.name : '未知公司'
      }
    });
  } catch (error) {
    console.error('获取证书详情错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// 添加证书（支持FormData和Base64）
app.post('/api/certificates', upload.single('file'), async (req, res) => {
  // 打印所有接收到的东西
  console.log("=== 收到上传请求 ===");
  console.log("Body内容:", req.body);
  const rawId = req.body.companyId;
  const companyId = typeof rawId === 'string' ? rawId.trim() : rawId;
  
  // 用最原始的 SQL 查一下试试
  const [results] = await sequelize.query(`SELECT * FROM companies WHERE id = '${companyId}'`);
  console.log("原始SQL查询结果:", results.length > 0 ? "找到了公司" : "没找到公司");

  // 2. 打印诊断日志
  console.log("---------------------------------------");
  console.log("【诊断】收到的原始 ID:", `"${rawId}"`);
  console.log("【诊断】去空格后的 ID:", `"${companyId}"`);
  console.log("【诊断】ID 长度:", companyId ? companyId.length : 0);

  // 3. 执行查询
  const company = await Company.findByPk(companyId);
  console.log("【诊断】数据库查询结果:", company ? `✅ 成功：${company.name}` : "❌ 失败：返回 null");
  console.log("---------------------------------------");

  if (!company) {
    // 即使失败，也把 ID 传回去看看
    return res.json({ success: false, message: `公司不存在 (查询ID: ${companyId})` });
  }
  
  // 从 req.body 获取其他表单数据
  const name = req.body.name;
  const standard = req.body.standard;
  const issueDate = req.body.issueDate;
  const expiryDate = req.body.expiryDate;
  const issuingAuthority = req.body.issuingAuthority;
  const description = req.body.description;
  const category = req.body.category;
  const status = req.body.status;
  const imageBase64 = req.body.imageBase64;
  const originalName = req.body.originalName;

  try {

    let imagePath = null;
    let imageUrl = null;

    if (req.file) {
      console.log("使用 FormData 上传文件:", req.file.originalname);
      imagePath = req.file.path;
      imageUrl = `/uploads/certificates/${req.file.filename}`;
      console.log("文件已保存到:", imagePath);
      console.log("设置 imageUrl 为:", imageUrl);
    } else if (imageBase64) {
      console.log("使用 Base64 上传");
      
      // 确保文件夹一定存在
      const dir = certificatesUploadPath;
      if (!fs.existsSync(dir)) {
        console.log("文件夹不存在，正在创建:", dir);
        fs.mkdirSync(dir, { recursive: true });
      }

      // 1. 获取 MIME 类型
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
      const fileName = `cert_${generateId()}${ext}`;
      const filePath = path.join(certificatesUploadPath, fileName);

      console.log("certificatesUploadPath:", certificatesUploadPath);
      console.log("准备保存的完整路径:", filePath);
      console.log("Buffer大小:", buffer.length, "字节");

      // 写入文件，带完整错误处理
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

    const newCertificate = await Certificate.create({
      id: generateId(),
      companyId,
      name,
      standard: standard || '未分类',
      type: category || '其他',
      issuingAuthority: issuingAuthority || '',
      issueDate: issueDate || null,
      expiryDate: expiryDate || '长期有效',
      imageUrl: req.file ? `/uploads/certificates/${req.file.filename}` : null,
      imagePath: req.file ? req.file.path : null,
      status: 'valid',
      notes: description || '',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    res.json({
      success: true,
      certificate: {
        ...newCertificate.toJSON(),
        companyName: company.name
      }
    });
  } catch (error) {
    console.error('添加证书错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// 更新证书（支持FormData和Base64）
app.put('/api/certificates/:id', upload.single('file'), async (req, res) => {
  const { id } = req.params;
  const name = req.body.name;
  const standard = req.body.standard;
  const issueDate = req.body.issueDate;
  const expiryDate = req.body.expiryDate;
  const issuingAuthority = req.body.issuingAuthority;
  const description = req.body.description;
  const category = req.body.category;
  const status = req.body.status;
  const imageBase64 = req.body.imageBase64;
  const originalName = req.body.originalName;

  try {
    const certificate = await Certificate.findByPk(id);
    if (!certificate) {
      return res.json({ success: false, message: '证书不存在' });
    }

    console.log("正在更新证书，原始数据:", certificate.toJSON());

    // 处理新图片
    console.log("---------------------------------------");
    console.log("PUT 更新开始");

    if (req.file) {
      console.log("使用 FormData 上传文件:", req.file.originalname);
      
      // 删除旧图片
      if (certificate.imagePath && fs.existsSync(certificate.imagePath)) {
        console.log("删除旧文件:", certificate.imagePath);
        try {
          fs.unlinkSync(certificate.imagePath);
          console.log("旧文件删除成功");
        } catch (err) {
          console.error("删除旧文件失败:", err);
        }
      }
      
      certificate.imagePath = req.file.path;
      certificate.imageUrl = `/uploads/certificates/${req.file.filename}`;
      certificate.imageBase64 = null;
      console.log("文件已保存到:", req.file.path);
      console.log("设置 imageUrl 为:", certificate.imageUrl);
    } else if (imageBase64) {
      console.log("使用 Base64 上传");
      
      // 删除旧图片
      if (certificate.imagePath && fs.existsSync(certificate.imagePath)) {
        console.log("删除旧文件:", certificate.imagePath);
        try {
          fs.unlinkSync(certificate.imagePath);
          console.log("旧文件删除成功");
        } catch (err) {
          console.error("删除旧文件失败:", err);
        }
      }

      // 确保文件夹一定存在
      const dir = certificatesUploadPath;
      if (!fs.existsSync(dir)) {
        console.log("文件夹不存在，正在创建:", dir);
        fs.mkdirSync(dir, { recursive: true });
      }

      // 1. 获取 MIME 类型
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
      const fileName = `cert_${generateId()}${ext}`;
      const filePath = path.join(certificatesUploadPath, fileName);

      console.log("certificatesUploadPath:", certificatesUploadPath);
      console.log("准备保存的完整路径:", filePath);
      console.log("Buffer大小:", buffer.length, "字节");

      // 写入文件，带完整错误处理
      try {
        fs.writeFileSync(filePath, buffer);
        console.log("文件物理写入成功");
        
        certificate.imagePath = filePath;
        certificate.imageUrl = `/uploads/certificates/${fileName}`;
        
        // 【关键】不要把这几百万个字符存入数据库！设为 null
        certificate.imageBase64 = null;
      } catch (err) {
        console.error("文件写入硬盘失败:", err);
        return res.status(500).json({ success: false, message: '文件保存到服务器失败' });
      }
    } else {
      console.log("没有上传新文件，保持原文件");
    }
    console.log("---------------------------------------");

    // 使用 update 方法更新所有字段
    await certificate.update({
      name: name,
      standard: standard,
      type: category,
      issuingAuthority: issuingAuthority,
      issueDate: issueDate || null,
      expiryDate: expiryDate || null,
      status: status,
      notes: description,
      originalName: originalName,
      updatedAt: new Date()
    });

    console.log("更新后的证书数据:", certificate.toJSON());

    const company = await Company.findByPk(certificate.companyId);

    res.json({
      success: true,
      certificate: {
        ...certificate.toJSON(),
        companyName: company ? company.name : '未知公司'
      }
    });
  } catch (error) {
    console.error('更新证书错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// 删除证书
app.delete('/api/certificates/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const certificate = await Certificate.findByPk(id);
    if (!certificate) {
      return res.json({ success: false, message: '证书不存在' });
    }

    // 删除关联的文件
    if (certificate.imagePath && fs.existsSync(certificate.imagePath)) {
      try {
        fs.unlinkSync(certificate.imagePath);
        console.log("删除证书文件:", certificate.imagePath);
      } catch (err) {
        console.error("删除证书文件失败:", err);
      }
    }

    await certificate.destroy();
    res.json({ success: true });
  } catch (error) {
    console.error('删除证书错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// ==================== 报价单 API ====================

// 获取所有报价单
app.get('/api/quotations', async (req, res) => {
  try {
    const quotations = await Quotation.findAll();
    res.json({ success: true, quotations });
  } catch (error) {
    console.error('获取报价单列表错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// 添加报价单
app.post('/api/quotations', async (req, res) => {
  const { customerName, productName, quantity, price, notes } = req.body;
  try {
    const newQuotation = await Quotation.create({
      id: generateId(),
      customerName,
      productName,
      quantity,
      price,
      notes,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    res.json({ success: true, quotation: newQuotation });
  } catch (error) {
    console.error('添加报价单错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// 更新报价单
app.put('/api/quotations/:id', async (req, res) => {
  const { id } = req.params;
  const { customerName, productName, quantity, price, notes } = req.body;
  try {
    const quotation = await Quotation.findByPk(id);
    if (!quotation) {
      return res.json({ success: false, message: '报价单不存在' });
    }
    quotation.customerName = customerName;
    quotation.productName = productName;
    quotation.quantity = quantity;
    quotation.price = price;
    quotation.notes = notes;
    quotation.updatedAt = new Date();
    await quotation.save();
    res.json({ success: true, quotation });
  } catch (error) {
    console.error('更新报价单错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// 删除报价单
app.delete('/api/quotations/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const quotation = await Quotation.findByPk(id);
    if (!quotation) {
      return res.json({ success: false, message: '报价单不存在' });
    }
    await quotation.destroy();
    res.json({ success: true });
  } catch (error) {
    console.error('删除报价单错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// ==================== 客户 API ====================

// 1. 获取所有客户
app.get('/api/customers', async (req, res) => {
  try {
    const customers = await Customer.findAll({ order: [['createdAt', 'DESC']] });
    res.json({ success: true, customers });
  } catch (error) {
    console.error('获取客户列表错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// 2. 添加客户（完善了字段接收）
app.post('/api/customers', async (req, res) => {
  console.log("=== 收到添加客户请求 ===", req.body); // 加上这行日志，你能看到所有传来的数
  try {
    const newCustomer = await Customer.create({
      ...req.body, // 直接使用解构，可以接收前端传来的所有字段（包括 requirement 和 completionDate）
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    });
    res.json({ success: true, customer: newCustomer });
  } catch (error) {
    console.error('添加客户错误:', error);
    res.status(500).json({ success: false, message: '服务器错误', error: error.message });
  }
});

// 3. 修改客户（修复编辑无效的核心逻辑）
app.put('/api/customers/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const customer = await Customer.findByPk(id);
    if (!customer) {
      return res.json({ success: false, message: '找不到该客户记录' });
    }
    
    // 更新数据
    await customer.update(req.body);
    res.json({ success: true, customer });
  } catch (error) {
    console.error('更新客户错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// 4. 删除客户（修复删除无效的核心逻辑）
app.delete('/api/customers/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Customer.destroy({ where: { id } });
    if (result === 0) {
      return res.json({ success: false, message: '删除失败，记录不存在' });
    }
    res.json({ success: true });
  } catch (error) {
    console.error('删除客户错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// ==================== 聊天 API ====================

// 获取所有消息
app.get('/api/messages', async (req, res) => {
  try {
    const messages = await Message.findAll({
      order: [['createdAt', 'ASC']]
    });
    res.json({ success: true, messages });
  } catch (error) {
    console.error('获取消息列表错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// 获取指定会话的消息
app.get('/api/messages/:sessionId', async (req, res) => {
  const { sessionId } = req.params;
  try {
    const messages = await Message.findAll({
      where: { sessionId },
      order: [['createdAt', 'ASC']]
    });
    res.json({ success: true, messages });
  } catch (error) {
    console.error('获取会话消息错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// 获取用户的会话列表
app.get('/api/sessions/:userId', async (req, res) => {
  const { userId } = req.params;
  const { type } = req.query;
  try {
    const sessions = await Session.findAll({
      where: {
        userId,
        ...(type ? { type } : {})
      },
      order: [['updatedAt', 'DESC']]
    });
    res.json({ success: true, sessions });
  } catch (error) {
    console.error('获取会话列表错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// 添加消息
app.post('/api/messages', async (req, res) => {
  const { sessionId, content, userId } = req.body;

  try {
    // 1. 先保存用户刚发的消息
    await Message.create({ 
      id: generateId(), 
      sessionId, 
      content, 
      role: 'user', 
      userId: userId || null,
      type: 'company',
      createdAt: new Date()
    });

    // 2. 【核心：加载上下文】获取该会话最近的 10 条消息
    const history = await Message.findAll({ 
      where: { sessionId }, 
      order: [['createdAt', 'ASC']], 
      limit: 10 // 传送最近几轮对话，保证 AI 有记忆
    });

    // 3. 将历史记录格式化为 AI 认识的格式
    const aiMessages = history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content
    }));

    // 4. 调用 AI 接口（发送整个 aiMessages 数组，而不仅仅是 content）
    // 由于我们使用的是模拟 AI 服务，这里需要调用前端的 AI 服务
    // 但为了简化，我们直接返回一个模拟的 AI 响应
    // 这里可以根据 aiMessages 上下文来生成更智能的响应
    const aiResponse = `我收到了您的消息："${content}"。这是一个模拟的 AI 响应，我已经了解了之前的对话内容。`;

    // 5. 保存 AI 的回答并更新会话时间
    const assistantMsg = await Message.create({ 
      id: generateId(), 
      sessionId, 
      content: aiResponse, 
      role: 'assistant', 
      userId: userId || null,
      type: 'company',
      createdAt: new Date()
    });
    
    // 更新会话的 updatedAt，让它排在历史记录最前面
    await Session.update({ updatedAt: new Date() }, { where: { id: sessionId } });

    res.json({ success: true, content: aiResponse });
  } catch (error) {
    console.error('保存消息失败:', error);
    res.status(500).json({ success: false, message: '消息保存失败' });
  }
});

// ==================== 管理员监控 API ====================

// 1. 获取所有聊天会话摘要
app.get('/api/admin/chat-sessions', async (req, res) => {
  try {
    // 获取所有会话，按创建时间倒序
    const sessions = await Session.findAll({
      order: [['createdAt', 'DESC']]
    });

    // 格式化数据，处理用户名和最后一条消息
    const formattedSessions = await Promise.all(sessions.map(async (s) => {
      let displayName = `访客 ${s.id.slice(-4)}`;
      
      // 如果有 userId，尝试去 User 表查名字
      if (s.userId && !s.userId.startsWith('guest_')) {
        const user = await User.findByPk(s.userId);
        if (user) {
          displayName = user.phone || user.username;
        }
      } else if (s.userId && s.userId.startsWith('guest_')) {
        displayName = `匿名访客 (${s.userId.slice(-4)})`;
      }

      // 找最后一条消息
      const lastMsg = await Message.findOne({
        where: { sessionId: s.id },
        order: [['createdAt', 'DESC']]
      });

      // 统计消息数
      const msgCount = await Message.count({ where: { sessionId: s.id } });

      return {
        id: s.id,
        userName: displayName,
        lastMessage: lastMsg ? lastMsg.content : '暂无内容',
        updatedAt: s.createdAt,
        messageCount: msgCount
      };
    }));

    res.json({ success: true, sessions: formattedSessions });
  } catch (error) {
    console.error('监控列表获取失败:', error);
    res.status(500).json({ success: false, message: '服务器内部错误' });
  }
});

// 2. 获取具体对话记录
app.get('/api/admin/chat-messages/:sessionId', async (req, res) => {
  try {
    const messages = await Message.findAll({
      where: { sessionId: req.params.sessionId },
      order: [['createdAt', 'ASC']]
    });
    res.json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, message: '获取消息失败' });
  }
});

// ==================== 启动服务器 ====================

// 【关键修复】处理 React 路由刷新问题
// 必须放在所有 API 接口之后！
app.get('*', (req, res) => {
  // 确保路径指向你打包后的 index.html
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});
