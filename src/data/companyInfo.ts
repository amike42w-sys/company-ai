// 公司信息配置 - 对外展示的内容
export const companyInfo = {
  name: '佛山市筑建集成房屋科技有限公司',
  slogan: '筑建未来，智选空间',
  description: '我们是一家专业从事集装箱房屋设计及生产的国际化企业，产品远销欧洲、澳洲、美洲等市场，厂房面积达40000平方米。',
  
  founded: '2012年',
  employees: '100+',
  headquarters: '佛山市顺德区',
  
  contact: {
    phone: '0757-6684-1598',
    email: 'contact@zhujian.com',
    address: '佛山市顺德区北滘镇新城怡和路怡和中心12楼3号（邮编：528311）',
  },
  
  products: [
    {
      id: 'mic-school',
      name: '集装箱房屋 / MIC建筑',
      details: {
        title: '福田博园小学 / Futian Expo Garden Primary School',
        // 修改点：改为 .png 且匹配中划线命名
        images: [
          '/images/products/school-01.jpg?v=0423',
          '/images/products/school-02.png?v=0423',
          '/images/products/school-03.png?v=0423',
          '/images/products/school-04.png?v=0423',
          '/images/products/school-05.png?v=0423'
        ],
        specs: [
          { label: 'MiC数量', value: '145个' },
          { label: '设计层数', value: '3层' },
          { label: '总建筑占地面积', value: '3066㎡' }
        ],
        introZh: '学校配备有标准教室、专业教室、办公室、阅览室、卫生间、舞蹈室、会议室、楼梯等。',
        introEn: 'The school is equipped with standard classrooms, specialized classrooms, offices, a library, bathrooms, dance studios, meeting rooms, stairs, and more.'
      }
    },
    {
      id: 'mic-hospital',
      name: '集成模块化医院',
      details: {
        title: '湛江医院 / Zhanjiang Hospital',
        // 修改点：改为 .png 且匹配中划线命名
        images: [
          '/images/products/hospital-01.png?v=0423',
          '/images/products/hospital-02.png?v=0423',
          '/images/products/hospital-03.png?v=0423',
          '/images/products/hospital-04.png?v=0423',
          '/images/products/hospital-05.png?v=0423'
        ],
        specs: [
          { label: 'MiC数量', value: '60个' },
          { label: '模块尺寸', value: '7*3.6*4 m' },
          { label: '建造时间', value: '23天' }
        ],
        introZh: '该医院设备和功能室都一应俱全，里面包含了值班室、会议室、休息室、更衣室、厕所、抢救室、门诊室、候诊室、采样室、抽血室、治疗室和隔离室，还区分了成人和儿童诊室。',
        introEn: 'The hospital is fully equipped with facilities, including a duty room, conference room, lounge, changing room, bathroom, emergency room, outpatient room, waiting room, sampling room, blood collection room, treatment room, and isolation room, and it also differentiates between adult and pediatric consultation rooms.'
      }
    },
    {
      id: 'steel-structure-villa',
      name: '钢结构别墅',
      slogan: '轻钢结构豪宅，抗震宜居可定制',
      description: '轻钢结构主体，抗震防风，舒适宜居，符合欧洲建筑标准，可定制化设计为高端住宅、度假民宿。',
      icon: '🏡',
      detailInfo: {
        title: '高端度假别墅 / High-end Holiday Villa',
        images: ['/images/products/villa1.jpg', '/images/products/villa2.jpg'],
        stats: [
          { label: '建筑面积', value: '350㎡' },
          { label: '抗震等级', value: '8级' },
          { label: '节能标准', value: 'A+级' }
        ],
        descZh: '采用轻钢结构主体，抗震防风，舒适宜居，符合欧洲建筑标准，可定制化设计为高端住宅、度假民宿，美观大方，节能环保。',
        descEn: 'Using light steel structure main body, earthquake-resistant and wind-resistant, comfortable and livable, in line with European building standards, can be customized as high-end residential, holiday homestay, beautiful and generous, energy-saving and environmental protection.'
      }
    },
    {
      id: 'mobile-sentry-box',
      name: '移动岗亭',
      slogan: '定制化设计，部署灵活高效',
      description: '定制化设计，功能齐全，移动便捷，可作为保安岗、收费亭、便民服务站等，部署灵活高效。',
      icon: '🚧',
      detailInfo: {
        title: '智能安防岗亭 / Intelligent Security Sentry Box',
        images: ['/images/products/sentry1.jpg', '/images/products/sentry2.jpg'],
        stats: [
          { label: '尺寸', value: '2.5m×2.5m' },
          { label: '重量', value: '1.2吨' },
          { label: '部署时间', value: '2小时' }
        ],
        descZh: '定制化设计，功能齐全，移动便捷，可作为保安岗、收费亭、便民服务站等，部署灵活高效，满足多种场景需求。',
        descEn: 'Customized design, full-featured, mobile and convenient, can be used as security posts, toll booths, convenient service stations, etc., flexible and efficient deployment to meet a variety of scene needs.'
      }
    },
  ],
  
  supportingServices: [
    {
      name: '工业级设备箱',
      description: '提供机柜、配电箱、逆变箱等定制化箱体，适用于野外营地、赛事保障、工业设备场景。',
      icon: '⚡',
    },
    {
      name: '钢结构加工与全链条服务',
      description: '支持钢结构件定制、超宽箱/特殊尺寸模块生产，可配套家具、跑步板等一体化交付。',
      icon: '🔧',
    },
  ],
  
  services: [
    '方案设计',
    '生产制造',
    '运输安装',
    '售后维护',
    '定制开发',
  ],
  
  about: `
佛山市筑建集成房屋科技有限公司成立于2012年，是一家专业从事集装箱房屋设计及生产的国际化企业。

公司发展迅速，至今厂房面积已达40000平方米，产品远销欧洲、澳洲、美洲等国际市场。公司总部办事处位于广东省佛山市顺德区北滘怡和中心，毗邻香港、广州，地理位置优越，交通便利。生产基地位于佛山市高明区富湾工业区恒昌路35号。

我们可以生产二十尺柜集装箱、四十尺柜集装箱、超宽箱和配套产品跑步板及定制家具。客户可以根据集装箱使用类型定制有关的尺寸或材质等，如学生公寓、汽车旅馆、公共建筑、住宅别墅等。

拥有专业的设计团体和具备多年经验的施工团体，我们能更好地完成由设计开发到生产出口的整个生产链，使产品质量得以保证，让客户安心满意。为了能与时俱进，公司不仅不定时安排员工出国观展学习，更好地了解客户需求和行业趋势；而且统一安排培训学习，加强集装箱房屋行业的知识运用。

公司网址：www.9415.com/company/31898.html
更新时间：2021年1月15日 11:38
  `,
}

// 预设的公司信息问答
export const companyQA = [
  {
    question: '你们公司是做什么的',
    answer: '我们是一家专注于集成房屋研发与制造的高新技术企业，主要提供集装箱房屋、活动板房、钢结构别墅、移动岗亭等核心产品，以及工业级设备箱、钢结构加工等配套定制服务。',
  },
  {
    question: '公司成立多久了',
    answer: '公司成立于2012年，至今已有12年发展历程，是专注于集成房屋领域的高新技术企业。',
  },
  {
    question: '怎么联系你们',
    answer: '您可以通过以下方式联系我们：\n电话：0757-6684-1598\n邮箱：contact@zhujian.com\n地址：佛山市顺德区北滘镇新城怡和路怡和中心12楼3号（邮编：528311）',
  },
  {
    question: '你们有什么产品',
    answer: '我们的核心产品包括：\n1. 集装箱房屋 - 模块化集成，7天快速交付，可用于临时宿舍、办公、民宿等场景\n2. 活动板房 - 灵活组合，经济实用，适用于工地临建、临时展厅、应急安置等\n3. 钢结构别墅 - 轻钢结构豪宅，抗震宜居可定制，符合欧洲建筑标准\n4. 移动岗亭 - 定制化设计，部署灵活高效，可作为保安岗、收费亭、便民服务站等\n\n配套与定制服务：\n• 工业级设备箱：机柜、配电箱、逆变箱等，适用于野外营地、赛事保障、工业设备场景\n• 钢结构加工与全链条服务：支持钢结构件定制、超宽箱/特殊尺寸模块生产，可配套家具、跑步板等一体化交付',
  },
  {
    question: '集装箱房屋有什么特点',
    answer: '我们的集装箱房屋采用模块化设计，快速搭建，坚固耐用。工厂预制率高，交付周期短，7天即可快速交付。可用于临时宿舍、办公、民宿等多种场景。',
  },
  {
    question: '钢结构别墅有什么优势',
    answer: '我们的钢结构别墅采用轻钢结构主体，具有抗震防风、舒适宜居的特点，符合欧洲建筑标准。支持定制化设计，可作为高端住宅、度假民宿使用。',
  },
  {
    question: '你们能做定制吗',
    answer: '可以的。我们提供全面的定制服务，包括：\n• 工业级设备箱定制：机柜、配电箱、逆变箱等\n• 钢结构加工：支持钢结构件定制、超宽箱/特殊尺寸模块生产\n• 一体化交付：可配套家具、跑步板等\n适用于野外营地、赛事保障、工业设备等各种特殊场景。',
  },
  {    question: '创始人是谁',    answer: '我们的创始人是李进先生，负责公司的整体战略规划与发展。',  },  {    question: '老板是谁',    answer: '我们的老板是李进先生，负责公司的整体运营与发展。',  },  {    question: '负责人是谁',    answer: '公司的负责人是李进先生，负责公司的日常运营管理。',  },  {    question: '法人代表是谁',    answer: '公司的法人代表是甘湛锋先生。',  },  {    question: '董事长是谁',    answer: '我们的董事长是李进先生，也是公司的创始人，负责公司的整体战略规划与发展。',  },
  {
    question: '你们公司在哪里',
    answer: '我们的公司位于广东省佛山市。\n• 总部办事处：佛山市顺德区北滘镇新城怡和路怡和中心12楼3号\n• 生产基地：佛山市高明区荷城街道恒良路7号厂房3号车间',
  },
  {
    question: '公司总部在哪',
    answer: '公司总部位于广东省佛山市顺德区北滘镇新城怡和路怡和中心12楼3号。生产基地位于佛山市高明区荷城街道恒良路7号。',
  },
  {
    question: '生产基地在哪里',
    answer: '我们的生产基地位于佛山市高明区荷城街道恒良路7号厂房3号车间。',
  },
  {
    question: '公司什么时候成立的',
    answer: '公司成立于2012年10月17日，至今已有十余年发展历史。',
  },
  {
    question: '注册资本多少',
    answer: '公司注册资本为1,000万元人民币。',
  },
  {
    question: '你们公司规模多大',
    answer: '公司成立于2012年，注册资本1,000万元，现有员工100余人，厂房面积达40000平方米，是华南地区知名的集成房屋制造商。',
  },
  {
    question: '主营产品是什么',
    answer: '我们的主营产品是集装箱房屋，同时生产活动板房、钢结构别墅、移动岗亭等集成房屋产品，以及工业级设备箱、钢结构件等配套产品。',
  },
  {
    question: '你们公司做什么的',
    answer: '我们是专业从事集成房屋研发与制造的高新技术企业，主营集装箱房屋、活动板房、钢结构别墅、移动岗亭等产品的设计、生产与销售，同时提供工业级设备箱定制和钢结构加工等配套服务。产品远销欧洲、澳洲、美洲等国际市场。',
  },
  {
    question: '统一社会信用代码',
    answer: '我们的统一社会信用代码是：914406060553797836',
  },
  {
    question: '企业类型',
    answer: '我们公司是企业类型为有限责任公司(自然人投资或控股)。',
  },
  {
    question: '你们公司全称是什么',
    answer: '我们公司的全称是佛山市筑建集成房屋科技有限公司。',
  },
  {
    question: '公司名称',
    answer: '我们公司的名称是佛山市筑建集成房屋科技有限公司，简称筑建集成房屋。',
  },
  {
    question: '你们做集装箱吗',
    answer: '做的！我们的主营产品就是集装箱房屋，专业从事集装箱房屋的设计、生产与销售。产品远销欧洲、澳洲、美洲等国际市场。',
  },
  {
    question: '集成房屋是什么',
    answer: '集成房屋是一种模块化建筑方式，主要包括集装箱房屋、活动板房、钢结构别墅等。我们的集成房屋采用模块化设计，快速搭建，坚固耐用，可用于临时宿舍、办公、民宿、工地临建等多种场景。',
  },
  {
    question: '公司有多少人',
    answer: '公司现有员工100余人，厂房面积达40000平方米，是华南地区知名的集成房屋制造商。',
  },
  {
    question: '厂房有多大',
    answer: '我们的厂房面积达到40000平方米，位于佛山市高明区生产基地，拥有完整的生产设备和流水线。',
  },
  {
    question: '产品出口吗',
    answer: '是的，我们的产品远销欧洲、澳洲、美洲等国际市场。公司主要技术来源于欧洲，有稳定的欧洲团队长期提供技术指导和支持，所生产的产品完全符合并达到严苛的欧洲技术标准。',
  },
  {
    question: '欧洲技术标准',
    answer: '我们的产品完全符合并达到严苛的欧洲技术标准。公司主要技术来源于欧洲，有稳定的欧洲团队长期提供技术指导和支持，已为北欧提供了上千套标准化模块式住宅。',
  },
]
