const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'data');

if (!fs.existsSync(dataPath)) {
  fs.mkdirSync(dataPath, { recursive: true });
}

const usersPath = path.join(dataPath, 'users.json');
const sessionsPath = path.join(dataPath, 'sessions.json');
const messagesPath = path.join(dataPath, 'messages.json');
const certificatesPath = path.join(dataPath, 'certificates.json');
const companiesPath = path.join(dataPath, 'companies.json');
const quotationsPath = path.join(dataPath, 'quotations.json');

// 上传文件存储路径
const rootDir = path.resolve(__dirname, '..'); // 向上退一级
const uploadsPath = path.join(rootDir, 'uploads');
const certificatesUploadPath = path.join(uploadsPath, 'certificates');

// 确保上传目录存在
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}
if (!fs.existsSync(certificatesUploadPath)) {
  fs.mkdirSync(certificatesUploadPath, { recursive: true });
}

function readJSON(filePath, defaultValue = []) {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error(`读取 ${filePath} 错误:`, error);
  }
  return defaultValue;
}

function writeJSON(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error(`写入 ${filePath} 错误:`, error);
    return false;
  }
}

function initDatabase() {
  const users = readJSON(usersPath, []);
  
  if (users.length === 0) {
    const now = Date.now();
    const internalUsers = [
      { username: 'admin', password: 'admin123', id: '1', role: 'internal' },
      { username: 'analyst', password: 'analyst123', id: '2', role: 'internal' },
      { username: 'engineer', password: 'engineer123', id: '3', role: 'internal' },
      { username: 'cert_admin', password: 'admin123', id: '4', role: 'certificate_admin' },
      { username: 'cert_viewer', password: 'viewer123', id: '5', role: 'certificate_viewer' },
    ];
    
    internalUsers.forEach(user => {
      users.push({
        id: user.id,
        username: user.username,
        password: user.password,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`,
        role: user.role,
        email: null,
        phone: null,
        emailVerified: false,
        phoneVerified: false,
        createdAt: now,
        updatedAt: now
      });
    });
    
    writeJSON(usersPath, users);
  }
  
  if (!fs.existsSync(sessionsPath)) {
    writeJSON(sessionsPath, []);
  }
  
  if (!fs.existsSync(messagesPath)) {
    writeJSON(messagesPath, []);
  }
  
  if (!fs.existsSync(certificatesPath)) {
    writeJSON(certificatesPath, []);
  }
  
  if (!fs.existsSync(companiesPath)) {
    writeJSON(companiesPath, []);
  }
  
  if (!fs.existsSync(quotationsPath)) {
    writeJSON(quotationsPath, []);
  }
  
  console.log('数据库初始化完成');
}

module.exports = {
  readJSON,
  writeJSON,
  usersPath,
  sessionsPath,
  messagesPath,
  certificatesPath,
  companiesPath,
  quotationsPath,
  certificatesUploadPath,
  initDatabase
};
