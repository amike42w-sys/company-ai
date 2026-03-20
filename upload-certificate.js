import axios from 'axios';

// API 基础 URL
const API_BASE = '/api';

// 证书信息
const certificateInfo = {
  companyName: 'Foshan Zhujian Modular House Co., Ltd.',
  certificate: {
    name: 'Welding Certificate',
    standard: '欧标',
    category: '国际认证',
    issueDate: '2019-12-19',
    expiryDate: '2021-10-25',
    issuingAuthority: 'TÜV Rheinland',
    description: 'EN 1090-2:2018 EXC2 according to EN 1090-2',
    status: 'expired'
  }
};

// 添加公司
async function addCompany(companyName) {
  try {
    const response = await axios.post(`${API_BASE}/companies`, {
      name: companyName,
      description: '模块化房屋制造商'
    });
    
    if (response.data.success) {
      console.log('公司添加成功:', response.data.company);
      return response.data.company.id;
    } else {
      console.error('公司添加失败:', response.data.message);
      throw new Error(response.data.message);
    }
  } catch (error) {
    console.error('添加公司时出错:', error);
    throw error;
  }
}

// 添加证书
async function addCertificate(companyId, certificateData) {
  try {
    const response = await axios.post(`${API_BASE}/certificates`, {
      companyId,
      ...certificateData
    });
    
    if (response.data.success) {
      console.log('证书添加成功:', response.data.certificate);
      return response.data.certificate;
    } else {
      console.error('证书添加失败:', response.data.message);
      throw new Error(response.data.message);
    }
  } catch (error) {
    console.error('添加证书时出错:', error);
    throw error;
  }
}

// 主函数
async function main() {
  try {
    console.log('开始处理证书上传...');
    
    // 添加公司
    const companyId = await addCompany(certificateInfo.companyName);
    
    // 添加证书
    const certificate = await addCertificate(companyId, certificateInfo.certificate);
    
    console.log('\n证书上传完成！');
    console.log('证书ID:', certificate.id);
    console.log('证书名称:', certificate.name);
    console.log('公司名称:', certificate.companyName);
    console.log('证书状态:', certificate.status);
    console.log('有效期至:', certificate.expiryDate);
    
  } catch (error) {
    console.error('处理过程中出错:', error);
  }
}

// 运行主函数
main();
