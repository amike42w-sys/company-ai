const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
// 导入你的数据库模型和同步函数
const { User, Company, Certificate, Quotation, Message, Session, syncDatabase } = require('./models');
const { Op } = require('sequelize');
const { certificatesUploadPath } = require('./database');

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
    console.error('登录数据库错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// 注册接口重构
app.post('/api/register', async (req, res) => {
  const { username, password, email, phone } = req.body;
  try {
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.json({ success: false, message: '用户名已存在' });
    }

    const newUser = await User.create({
      id: Date.now().toString(), // 简单的ID生成
      username,
      password,
      email,
      phone,
      role: 'external'
    });

    res.json({ success: true, user: newUser });
  } catch (error) {
    console.error('注册数据库错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

app.get('/api/user/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.json({ success: false, message: '用户不存在' });
    }

    const userData = user.toJSON();
    delete userData.password;

    res.json({ success: true, user: userData });
  } catch (error) {
    console.error('获取用户错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

app.put('/api/user/:id', async (req, res) => {
  const { email, phone, password } = req.body;
  const userId = req.params.id;

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.json({ success: false, message: '用户不存在' });
    }

    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (password) {
      user.password = password;
    }

    await user.save();

    const userData = user.toJSON();
    delete userData.password;

    res.json({ success: true, user: userData });
  } catch (error) {
    console.error('更新用户错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// ==================== 会话 API ====================

app.post('/api/sessions', async (req, res) => {
  const { userId, type, title } = req.body;

  try {
    const id = generateId();
    const now = Date.now();

    const newSession = await Session.create({
      id,
      userId,
      token: generateId(),
      createdAt: new Date(now),
      expiresAt: new Date(now + 7 * 24 * 60 * 60 * 1000) // 7天过期
    });

    res.json({ success: true, sessionId: id });
  } catch (error) {
    console.error('创建会话错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

app.get('/api/sessions/:userId', async (req, res) => {
  const { userId } = req.params;
  const { type } = req.query;

  try {
    let sessions = await Session.findAll({ where: { userId } });

    if (type) {
      sessions = sessions.filter(s => s.type === type);
    }

    sessions.sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));

    res.json({ success: true, sessions });
  } catch (error) {
    console.error('获取会话列表错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

app.delete('/api/sessions/:sessionId', async (req, res) => {
  const { sessionId } = req.params;

  try {
    await Session.destroy({ where: { id: sessionId } });
    await Message.destroy({ where: { sessionId } });

    res.json({ success: true });
  } catch (error) {
    console.error('删除会话错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

app.delete('/api/sessions/user/:userId', async (req, res) => {
  const { userId } = req.params;
  const { type } = req.query;

  try {
    let sessions = await Session.findAll({ where: { userId } });
    if (type) {
      sessions = sessions.filter(s => s.type === type);
    }

    const sessionIds = sessions.map(s => s.id);

    await Session.destroy({ where: { id: sessionIds } });
    await Message.destroy({ where: { sessionId: sessionIds } });

    res.json({ success: true });
  } catch (error) {
    console.error('清空会话错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// ==================== 消息 API ====================

app.post('/api/messages', async (req, res) => {
  const { sessionId, userId, role, content, type } = req.body;

  try {
    const id = generateId();
    const timestamp = Date.now();

    const newMessage = await Message.create({
      id,
      userId,
      content,
      type,
      createdAt: new Date(timestamp)
    });

    if (sessionId) {
      const session = await Session.findByPk(sessionId);
      if (session) {
        session.updatedAt = new Date(timestamp);
        await session.save();
      }
    }

    res.json({ success: true, messageId: id });
  } catch (error) {
    console.error('保存消息错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

app.get('/api/messages/:sessionId', async (req, res) => {
  const { sessionId } = req.params;

  try {
    const messages = await Message.findAll({
      where: { sessionId },
      order: [['createdAt', 'ASC']]
    });

    res.json({ success: true, messages });
  } catch (error) {
    console.error('获取消息错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

app.get('/api/messages/user/:userId', async (req, res) => {
  const { userId } = req.params;
  const { type } = req.query;

  try {
    const sessions = await Session.findAll({ where: { userId } });

    if (type) {
      sessions = sessions.filter(s => s.type === type);
    }

    const sessionIds = sessions.map(s => s.id);

    const messages = await Message.findAll({
      where: { sessionId: sessionIds },
      order: [['createdAt', 'ASC']]
    });

    res.json({ success: true, messages });
  } catch (error) {
    console.error('获取用户消息错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// ==================== 公司 API ====================

// 获取所有公司列表
app.get('/api/companies', async (req, res) => {
  try {
    const companies = await Company.findAll();
    res.json({ success: true, companies });
  } catch (error) {
    console.error('获取公司列表错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// 添加新公司
app.post('/api/companies', async (req, res) => {
  const { name, description } = req.body;

  try {
    const existingCompany = await Company.findOne({ where: { name } });
    if (existingCompany) {
      return res.json({ success: false, message: '公司已存在' });
    }

    const newCompany = await Company.create({
      id: generateId(),
      name,
      description: description || ''
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
  const { name, description } = req.body;

  try {
    const company = await Company.findByPk(id);
    if (!company) {
      return res.json({ success: false, message: '公司不存在' });
    }

    // 检查新名称是否与其他公司重复
    if (name && name !== company.name) {
      const existingCompany = await Company.findOne({ where: { name, id: { [Op.ne]: id } } });
      if (existingCompany) {
        return res.json({ success: false, message: '公司名称已存在' });
      }
    }

    // 更新公司信息
    if (name) company.name = name;
    if (description !== undefined) company.description = description;

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
    // 删除公司相关的所有证书
    const certificates = await Certificate.findAll({ where: { companyId: id } });

    // 删除证书图片文件
    certificates.forEach(cert => {
      if (cert.imagePath && fs.existsSync(cert.imagePath)) {
        fs.unlinkSync(cert.imagePath);
      }
    });

    // 删除证书
    await Certificate.destroy({ where: { companyId: id } });

    // 删除公司
    await Company.destroy({ where: { id } });

    res.json({ success: true });
  } catch (error) {
    console.error('删除公司错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// ==================== 证书 API ====================

// 获取所有证书列表
app.get('/api/certificates', async (req, res) => {
  try {
    const certificates = await Certificate.findAll();
    const companies = await Company.findAll();

    // 添加公司信息到证书数据
    const certificatesWithCompany = certificates.map(cert => {
      const company = companies.find(c => c.id === cert.companyId);
      return {
        ...cert.toJSON(),
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
  // 从 req.body 获取表单数据（FormData）或 req.body 获取 JSON 数据
  const companyId = req.body.companyId;
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
    // 验证公司是否存在
    const company = await Company.findByPk(companyId);
    if (!company) {
      return res.json({ success: false, message: '公司不存在' });
    }

    let imagePath = null;
    let imageUrl = null;

    console.log("---------------------------------------");
    console.log("POST 添加证书");

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
    console.log("---------------------------------------");

    // 使用安全的日期转换逻辑
    const safeIssueDate = (issueDate && !isNaN(new Date(issueDate).getTime())) ? new Date(issueDate) : null;
    const safeExpiryDate = (expiryDate && !isNaN(new Date(expiryDate).getTime())) ? new Date(expiryDate) : null;
    
    const newCertificate = await Certificate.create({
      id: generateId(),
      companyId,
      name,
      type: category,
      issueDate: safeIssueDate,
      expiryDate: safeExpiryDate,
      imageUrl,
      imagePath,
      imageBase64: null, // 【关键】不要把这几百万个字符存入数据库！设为 null
      status: status || 'valid',
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

    // 更新其他字段
    if (name) certificate.name = name;
    if (standard) certificate.standard = standard;
    
    // 使用这个安全的日期转换逻辑
    certificate.issueDate = (issueDate && !isNaN(new Date(issueDate).getTime())) ? new Date(issueDate) : null;
    certificate.expiryDate = (expiryDate && !isNaN(new Date(expiryDate).getTime())) ? new Date(expiryDate) : null;
    
    if (issuingAuthority) certificate.issuingAuthority = issuingAuthority;
    if (description !== undefined) certificate.notes = description;
    if (category) certificate.type = category;
    if (status) certificate.status = status;
    if (originalName) certificate.originalName = originalName;

    certificate.updatedAt = new Date();

    console.log("更新后的证书数据:", certificate.toJSON());

    await certificate.save();

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

    // 删除图片文件
    if (certificate.imagePath && fs.existsSync(certificate.imagePath)) {
      fs.unlinkSync(certificate.imagePath);
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
    console.error('获取报价单错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// 获取单个报价单
app.get('/api/quotations/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const quotation = await Quotation.findByPk(id);
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
app.post('/api/quotations', async (req, res) => {
  const { customerName, standard, standardRate, items, totalAmount, status, notes } = req.body;

  try {
    const newQuotation = await Quotation.create({
      id: generateId(),
      customerName,
      standard: standard || '国标',
      standardRate: standardRate || 1.0,
      items: items || [],
      totalAmount: totalAmount || 0,
      status: status || 'draft',
      notes: notes || '',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    res.json({ success: true, quotation: newQuotation });
  } catch (error) {
    console.error('创建报价单错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// 更新报价单
app.put('/api/quotations/:id', async (req, res) => {
  const { id } = req.params;
  const { customerName, standard, standardRate, items, totalAmount, status, notes } = req.body;

  try {
    const quotation = await Quotation.findByPk(id);
    if (!quotation) {
      return res.json({ success: false, message: '报价单不存在' });
    }

    if (customerName !== undefined) quotation.customerName = customerName;
    if (standard !== undefined) quotation.standard = standard;
    if (standardRate !== undefined) quotation.standardRate = standardRate;
    if (items !== undefined) quotation.items = items;
    if (totalAmount !== undefined) quotation.totalAmount = totalAmount;
    if (status !== undefined) quotation.status = status;
    if (notes !== undefined) quotation.notes = notes;
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
    await Quotation.destroy({ where: { id } });

    res.json({ success: true });
  } catch (error) {
    console.error('删除报价单错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// 3. 让所有其他的路径都指向 index.html (支持 React 路由)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`后端服务器运行在 http://localhost:${PORT}`);
});