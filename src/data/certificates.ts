// 证书数据 - 由采购部分类管理
export interface Certificate {
  id: string;
  companyName: string;
  name: string;
  standard: string; // 标准类型：国标、澳标、港标等
  issueDate: string;
  expiryDate: string;
  issuingAuthority: string;
  imageUrl: string;
  description: string;
  category: string; // 证书分类
  status: 'valid' | 'expired' | 'pending';
}

export const certificates: Certificate[] = [
  {
    id: '1',
    companyName: '佛山市筑建集成房屋科技有限公司',
    name: 'ISO9001质量管理体系认证',
    standard: '国标',
    issueDate: '2023-01-15',
    expiryDate: '2026-01-14',
    issuingAuthority: '中国质量认证中心',
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=ISO9001%20certificate%20quality%20management%20system%20certification%20document&image_size=square',
    description: '国际质量管理体系认证，确保产品质量符合国际标准',
    category: '质量管理',
    status: 'valid'
  },
  {
    id: '2',
    companyName: '佛山市筑建集成房屋科技有限公司',
    name: '欧盟CE认证',
    standard: '欧标',
    issueDate: '2023-03-20',
    expiryDate: '2026-03-19',
    issuingAuthority: 'TUV Rheinland',
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=CE%20certificate%20European%20Union%20conformity%20certification&image_size=square',
    description: '欧盟市场准入认证，符合欧洲建筑产品标准',
    category: '国际认证',
    status: 'valid'
  },
  {
    id: '3',
    companyName: '佛山市筑建集成房屋科技有限公司',
    name: '澳洲AS/NZS认证',
    standard: '澳标',
    issueDate: '2023-05-10',
    expiryDate: '2026-05-09',
    issuingAuthority: 'SAI Global',
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=AS%20NZS%20certificate%20Australian%20standard%20certification&image_size=square',
    description: '澳大利亚和新西兰标准认证，符合当地建筑法规',
    category: '国际认证',
    status: 'valid'
  },
  {
    id: '4',
    companyName: '佛山市筑建集成房屋科技有限公司',
    name: '香港屋宇署认证',
    standard: '港标',
    issueDate: '2023-07-05',
    expiryDate: '2026-07-04',
    issuingAuthority: '香港屋宇署',
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Hong%20Kong%20Building%20Department%20certificate&image_size=square',
    description: '香港屋宇署认证，符合香港建筑标准',
    category: '区域认证',
    status: 'valid'
  },
  {
    id: '5',
    companyName: '金龙鱼',
    name: 'ISO22000食品安全管理体系认证',
    standard: '国标',
    issueDate: '2023-02-10',
    expiryDate: '2026-02-09',
    issuingAuthority: '中国质量认证中心',
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=ISO22000%20food%20safety%20management%20certificate&image_size=square',
    description: '食品安全管理体系认证，确保产品安全',
    category: '食品安全',
    status: 'valid'
  },
  {
    id: '6',
    companyName: '金龙鱼',
    name: '澳洲有机认证',
    standard: '澳标',
    issueDate: '2023-04-15',
    expiryDate: '2026-04-14',
    issuingAuthority: 'Australian Certified Organic',
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Australian%20organic%20certificate&image_size=square',
    description: '澳大利亚有机产品认证',
    category: '有机认证',
    status: 'valid'
  },
  {
    id: '7',
    companyName: '金龙鱼',
    name: '香港食品安全认证',
    standard: '港标',
    issueDate: '2023-06-20',
    expiryDate: '2026-06-19',
    issuingAuthority: '香港食物安全中心',
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Hong%20Kong%20food%20safety%20certificate&image_size=square',
    description: '香港食品安全认证，符合香港食品标准',
    category: '食品安全',
    status: 'valid'
  },
  {
    id: '8',
    companyName: '佛山市筑建集成房屋科技有限公司',
    name: '旧版ISO9001认证',
    standard: '国标',
    issueDate: '2020-01-15',
    expiryDate: '2023-01-14',
    issuingAuthority: '中国质量认证中心',
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=ISO9001%20certificate%20quality%20management%20system%20certification%20document&image_size=square',
    description: '已过期的质量管理体系认证',
    category: '质量管理',
    status: 'expired'
  }
];

// 标准类型列表
export const standards = ['国标', '澳标', '港标', '欧标', '美标'];

// 证书分类列表
export const categories = ['质量管理', '国际认证', '区域认证', '食品安全', '有机认证', '环境认证'];
