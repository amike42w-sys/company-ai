import { companyInfo, companyQA } from '../data/companyInfo'

// 上下文消息类型（保留这个类型定义，以免外部调用该函数时传参报错）
interface ContextMessage {
  role: 'user' | 'assistant'
  content: string
}

// 模拟AI服务 - 纯一问一答（去除了伪上下文联想）
export class AIService {
  static async askCompanyQuestion(
    question: string, 
    context?: ContextMessage[] // 保留参数定义，但内部不再使用它
  ): Promise<string> {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 检测语言：检查是否包含中文字符
    const isChinese = /[\u4e00-\u9fa5]/.test(question)
    
    const lowerQuestion = question.toLowerCase()
    
    // 【已删除】原本在这里的“上下文理解”和 detectTopicFromContext 相关代码
    
    // 匹配预设问题
    for (const qa of companyQA) {
      if (lowerQuestion.includes(qa.question.toLowerCase()) || 
          qa.question.toLowerCase().includes(lowerQuestion)) {
        return qa.answer
      }
    }
    
    // 灵活的关键词匹配 - 处理同义词
    // 创始人/老板/负责人/法人相关
    if (lowerQuestion.includes('创始人') || lowerQuestion.includes('老板') || 
        lowerQuestion.includes('负责人') || lowerQuestion.includes('法人代表') ||
        lowerQuestion.includes('老总') || lowerQuestion.includes('公司谁是老大') ||
        lowerQuestion.includes('总经理') || lowerQuestion.includes('董事长') ||
        lowerQuestion.includes('公司老大') || (lowerQuestion.includes('公司') && lowerQuestion.includes('谁是'))) {
      return '我们的创始人是甘湛锋先生，他是公司的法定代表人，负责公司的整体运营与发展。'
    }
    
    // 匹配"公司老总是谁"这类问题
    if (lowerQuestion.includes('公司') && (lowerQuestion.includes('老总') || lowerQuestion.includes('是谁') || lowerQuestion.includes('管的'))) {
      return '我们的创始人是甘湛锋先生，他是公司的法定代表人，负责公司的整体运营与发展。'
    }
    
    // 注册资本相关
    if (lowerQuestion.includes('注册资本') || lowerQuestion.includes('注册资金')) {
      return '公司注册资本为1,000万元人民币。'
    }
    
    // 公司规模相关
    if (lowerQuestion.includes('规模') || lowerQuestion.includes('多大') || lowerQuestion.includes('多少人')) {
      return '公司成立于2012年，注册资本1,000万元，现有员工100余人，厂房面积达40000平方米，是华南地区知名的集成房屋制造商。'
    }
    
    // 地址相关
    if (lowerQuestion.includes('总部') && lowerQuestion.includes('在哪')) {
      return '公司总部位于广东省佛山市顺德区北滘镇新城怡和路怡和中心12楼3号。生产基地位于佛山市高明区荷城街道恒良路7号。'
    }
    
    if ((lowerQuestion.includes('生产基地') || lowerQuestion.includes('工厂在哪')) && 
        !lowerQuestion.includes('总部')) {
      return '我们的生产基地位于佛山市高明区荷城街道恒良路7号厂房3号车间。'
    }
    
    // 统一社会信用代码
    if (lowerQuestion.includes('信用代码') || lowerQuestion.includes('统一社会')) {
      return '我们的统一社会信用代码是：914406060553797836'
    }
    
    // 企业类型
    if (lowerQuestion.includes('企业类型') || lowerQuestion.includes('公司类型')) {
      return '我们公司是企业类型为有限责任公司(自然人投资或控股)。'
    }
    
    // 成立时间
    if (lowerQuestion.includes('成立') && (lowerQuestion.includes('时间') || lowerQuestion.includes('日期') || lowerQuestion.includes('时候'))) {
      return '公司成立于2012年10月17日，至今已有十余年发展历史。'
    }
    
    // 员工人数相关问题
    if (lowerQuestion.includes('员工人数') || lowerQuestion.includes('多少人') || 
        lowerQuestion.includes('员工规模') || lowerQuestion.includes('有多少员工')) {
      return `我们公司现有员工${companyInfo.employees.zh}人。`
    }
    
    // 市场相关问题
    if (lowerQuestion.includes('市场') || lowerQuestion.includes('主要市场') || 
        lowerQuestion.includes('销售市场') || lowerQuestion.includes('目标市场')) {
      return `大陆, 北美, 南美, 西欧, 东欧, 东亚, 中亚, 东南亚, 中东, 非洲, 大洋洲`
    }
    
    // 产值/销售额相关问题
    if (lowerQuestion.includes('产值') || lowerQuestion.includes('销售额') || 
        lowerQuestion.includes('年收入') || lowerQuestion.includes('年营收') ||
        lowerQuestion.includes('年销售') || lowerQuestion.includes('年营业额') ||
        lowerQuestion.includes('产值多少') || lowerQuestion.includes('销售额多少')) {
      return `人民币 3001 万元/年 - 5000 万元/年`
    }
    
    // 出口额相关问题
    if (lowerQuestion.includes('出口额') || lowerQuestion.includes('年出口额')) {
      return `人民币 2001 万元/年 - 3000 万元/年`
    }
    
    // 进口额相关问题
    if (lowerQuestion.includes('进口额') || lowerQuestion.includes('年进口额')) {
      return `人民币 10 万元/年以下`
    }
    
    // 厂房面积相关问题
    if (lowerQuestion.includes('厂房面积') || lowerQuestion.includes('工厂面积') ||
        lowerQuestion.includes('厂房多大') || lowerQuestion.includes('工厂多大')) {
      return `40000平方米`
    }
    
    // 关键词匹配
    if (lowerQuestion.includes('产品') || lowerQuestion.includes('服务')) {
      if (isChinese) {
        return `我们提供以下核心产品和配套定制服务：

**核心产品**：
${companyInfo.products.map(p => `• ${p.name.zh}：${p.slogan?.zh || ''}`).join('\n')}

**配套与定制服务**：
${companyInfo.supportingServices?.map(s => `• ${s.name.zh}：${s.description?.zh || ''}`).join('\n')}

以及${companyInfo.services.join('、')}等服务。

想了解更多具体产品的信息吗？比如集装箱房屋、钢结构别墅等。`
      } else {
        return `We provide the following core products and customized supporting services:

**Core Products**:
• Container House: Modular integration, 7-day quick delivery
• Prefabricated House: Flexible combination, economical and practical
• Steel Structure Villa: Light steel structure luxury, earthquake-resistant and livable, customizable
• Mobile岗亭: Customized design, flexible and efficient deployment

**Supporting and Customized Services**:
• Industrial Equipment Case: Customized cabinets, distribution boxes, inverter boxes, etc.
• Steel Structure Processing and Full-chain Services: Customized steel structure parts, production of ultra-wide boxes/special size modules

And services such as ${companyInfo.services.join(', ')}.

Would you like to know more about specific products? For example, Container House, Steel Structure Villa, etc.`
      }
    }
    
    if (lowerQuestion.includes('集装箱')) {
      const product = companyInfo.products.find(p => (p.name as any).zh.includes('集装箱'))
      if (product) {
        if (isChinese) {
          return `**${(product.name as any).zh}** - ${(product.slogan as any)?.zh || ''}

${(product.description as any)?.zh || ''}

**适用场景**：临时宿舍、办公、民宿等
**优势**：工厂预制率高，交付周期短，7天即可快速交付

您是想了解集装箱房屋的价格、定制选项，还是应用案例呢？`
        } else {
          return `**Container House** - Modular integration, 7-day quick delivery

Modular design, quick construction, sturdy and durable, can be used for temporary dormitories, offices, homestays and other scenarios, with high factory prefabrication rate and short delivery cycle.

**Applicable scenarios**: Temporary dormitories, offices, homestays, etc.
**Advantages**: High factory prefabrication rate, short delivery cycle, 7-day quick delivery

Would you like to know about Container House prices, customization options, or application cases?`
        }
      }
    }
    
    if (lowerQuestion.includes('钢结构') || lowerQuestion.includes('别墅')) {
      const product = companyInfo.products.find(p => (p.name as any).zh.includes('钢结构'))
      if (product) {
        if (isChinese) {
          return `**${(product.name as any).zh}** - ${(product.slogan as any)?.zh || ''}

${(product.description as any)?.zh || ''}

**优势**：
• 轻钢结构主体，抗震防风
• 符合欧洲建筑标准
• 可定制化设计
• 适合高端住宅、度假民宿

您对钢结构别墅的哪个方面感兴趣？设计、价格还是施工周期？`
        } else {
          return `**Steel Structure Villa** - Light steel structure luxury, earthquake-resistant and livable, customizable

Light steel structure main body, earthquake-resistant and wind-resistant, comfortable and livable, meets European building standards, can be customized as high-end residential, vacation homestay.

**Advantages**:
• Light steel structure main body, earthquake-resistant and wind-resistant
• Meets European building standards
• Customizable design
• Suitable for high-end residential, vacation homestay

Which aspect of Steel Structure Villa are you interested in? Design, price, or construction cycle?`
        }
      }
    }
    
    // 注册地址
    if (lowerQuestion.includes('注册地址') || lowerQuestion.includes('注册地')) {
      if (isChinese) {
        return `我们的注册地址是：${companyInfo.contact.address}`
      } else {
        return `Our registered address is: ${companyInfo.contact.address}`
      }
    }
    
    if (lowerQuestion.includes('联系') || lowerQuestion.includes('电话') || lowerQuestion.includes('地址')) {
      if (isChinese) {
        return `联系方式：
📞 电话：${companyInfo.contact.phone}
📧 邮箱：${companyInfo.contact.email}
📍 地址：${companyInfo.contact.address}

欢迎随时联系我们咨询！`
      } else {
        return `Contact Information:
📞 Phone: ${companyInfo.contact.phone}
📧 Email: ${companyInfo.contact.email}
📍 Address: ${companyInfo.contact.address}

Welcome to contact us for consultation at any time!`
      }
    }
    
    // 公司名称相关问题
    if (lowerQuestion.includes('公司') && (lowerQuestion.includes('叫啥') || lowerQuestion.includes('叫什么') || lowerQuestion.includes('名字') || lowerQuestion.includes('名称'))) {
      if (isChinese) {
        return `我们公司的名称是${companyInfo.name.zh}。`
      } else {
        return `Our company name is Matrix Living (Foshan) Modular House Co., Ltd.`
      }
    }
    
    if (lowerQuestion.includes('公司') || lowerQuestion.includes('介绍') || lowerQuestion.includes('关于')) {
      if (isChinese) {
        return `${companyInfo.name.zh} - ${companyInfo.slogan.zh}

${companyInfo.description.zh}

**公司概况**：
• 成立时间：${companyInfo.founded.zh}
• 员工规模：${companyInfo.employees.zh}
• 总部地址：${companyInfo.contact.address}

我们已为超过1000家企业和个人客户提供优质的集成房屋解决方案。

您想了解我们的哪方面信息？产品、服务还是成功案例？`
      } else {
        return `Matrix Living (Foshan) Modular House Co., Ltd. - Building the Future, Smart Space Choice

We are a professional international company engaged in the design and production of modular houses, with products exported to markets in Europe, Australia, America, etc. Our factory covers an area of 40,000 square meters.

**Company Overview**:
• Founded: ${companyInfo.founded}
• Employees: ${companyInfo.employees}
• Headquarters: ${companyInfo.contact.address}

We have provided high-quality integrated housing solutions for more than 1,000 corporate and individual clients.

What would you like to know about us? Products, services, or success cases?`
      }
    }
    
    if (lowerQuestion.includes('价格') || lowerQuestion.includes('多少钱') || lowerQuestion.includes('费用')) {
      if (isChinese) {
        return `关于价格，需要根据您的具体需求来定制报价：

**影响价格的因素**：
• 产品类型（集装箱房屋、钢结构别墅等）
• 规格尺寸
• 定制要求
• 数量
• 运输距离

建议您直接联系我们的销售团队获取详细报价：
📞 电话：${companyInfo.contact.phone}
📧 邮箱：${companyInfo.contact.email}

或者告诉我您的具体需求，我可以为您介绍适合的产品方案。`
      } else {
        return `Regarding pricing, it needs to be customized based on your specific requirements:

**Factors affecting price**:
• Product type (Container House, Steel Structure, etc.)
• Specifications and dimensions
• Customization requirements
• Quantity
• Transportation distance

We recommend contacting our sales team directly for detailed pricing:
📞 Phone: ${companyInfo.contact.phone}
📧 Email: ${companyInfo.contact.email}

Or tell me your specific needs, and I can introduce suitable product solutions for you.`
      }
    }
    
    if (lowerQuestion.includes('定制') || lowerQuestion.includes('定做')) {
      if (isChinese) {
        return `我们提供全面的定制服务：

**工业级设备箱定制**：
• 机柜、配电箱、逆变箱等
• 适用于野外营地、赛事保障、工业设备场景

**钢结构加工与全链条服务**：
• 钢结构件定制
• 超宽箱/特殊尺寸模块生产
• 可配套家具、跑步板等一体化交付

请告诉我您的具体需求，我们会为您提供专业的定制方案。`
      } else {
        return `We provide comprehensive customization services:

**Industrial Equipment Case Customization**:
• Cabinets, distribution boxes, inverter boxes, etc.
• Suitable for field camps, event support, industrial equipment scenarios

**Steel Structure Processing and Full-chain Services**:
• Steel structure parts customization
• Ultra-wide box/special size module production
• Integrated delivery with furniture, running boards, etc.

Please tell me your specific needs, and we will provide you with professional customization solutions.`
      }
    }
    
    // 建筑/项目咨询
    if (lowerQuestion.includes('建筑') || lowerQuestion.includes('项目') || 
        lowerQuestion.includes('面积') || lowerQuestion.includes('配置') ||
        lowerQuestion.includes('平米') || lowerQuestion.includes('平方') ||
        lowerQuestion.includes('米') || lowerQuestion.includes('尺寸')) {
      return `您好！

有相关的项目图纸吗？`
    }
    
    // 经营项目/经营范围相关问题
    if (lowerQuestion.includes('经营项目') || lowerQuestion.includes('经营范围') || 
        lowerQuestion.includes('经营什么') || lowerQuestion.includes('营业执照')) {
      return `我们的经营项目包括：

**一般项目**：
技术服务、技术开发、技术咨询、技术交流、技术转让、技术推广；金属结构制造；金属结构销售；金属制品研发；金属材料制造；金属材料销售；体育用品及器材制造；体育用品及器材批发；体育用品设备出租；门窗制造加工；门窗销售；金属门窗工程施工；家具制造；家具零配件生产；家具销售；家具零配件销售；家具安装和维修服务；砼结构构件制造；砼结构构件销售；建筑材料销售；建筑用钢筋产品销售；非居住房地产租赁；机械设备租赁；集装箱租赁服务；企业管理；信息咨询服务（不含许可类信息咨询服务）；货物进出口；技术进出口；销售代理；国内贸易代理。（除依法须经批准的项目外，凭营业执照依法自主开展经营活动）

**许可项目**：
建设工程施工；住宅室内装饰装修。（以上涉及制造业的，制造场地另设。）（依法须经批准的项目，经相关部门批准后方可开展经营活动，具体经营项目以相关部门批准文件或许可证件为准。）`
    }
    
    // 兜底默认回复
    if (isChinese) {
      return `感谢您对${companyInfo.name.zh}的关注！

我可以为您介绍：
• 我们的核心产品（集装箱房屋、钢结构别墅等）
• 配套定制服务
• 公司信息和联系方式
• 产品价格和定制方案

请问您对哪方面感兴趣？`
    } else {
      return `Thank you for your interest in Matrix Living (Foshan) Modular House Co., Ltd.!

I can introduce to you:
• Our core products (MIC - Modular Integrated Construction, Container House, Steel Structure, etc.)
• Customized supporting services
• Company information and contact details
• Product prices and customized solutions

What are you interested in learning more about?`
    }
  }
  
  // 【已删除】 private static detectTopicFromContext() 
  // 【已删除】 private static generateContextualResponse()
  
  // ================= 往下是对内的分析逻辑，保持原封不动 =================
  
  // 对内：分析物品成分
  static async analyzeItem(itemName: string, itemDescription?: string): Promise<string> {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 1500))
    const mockAnalysis = this.generateMockAnalysis(itemName, itemDescription)
    return mockAnalysis
  }
  
  // 对内：分析图片中的物品成分
  static async analyzeImage(_imageBase64: string): Promise<string> {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 1500))
    const mockAnalysis = this.generateMockImageAnalysis()
    return mockAnalysis
  }
  
  private static generateMockImageAnalysis(): string {
    const weightedItems =['手机', '手机', '手机', '手机', '手机', '手机', '电脑', '电路板']
    const randomItem = weightedItems[Math.floor(Math.random() * weightedItems.length)]
    return this.generateMockAnalysis(randomItem)
  }
  
  private static generateMockAnalysis(name: string, description?: string): string {
    const analyses: Record<string, string> = {
      '手机': `## 📱 ${name} 成分分析报告\n\n### 主要组成\n| 组件 | 材料 | 占比 |\n|------|------|------|\n| 屏幕 | 强化玻璃 + OLED | 25% |\n| 机身 | 铝合金 + 玻璃 | 20% |\n| 电池 | 锂离子 | 15% |\n| 芯片 | 硅基半导体 | 12% |\n| 摄像头 | 光学玻璃 + 传感器 | 10% |\n| 其他 | 塑料、稀土元素等 | 18% |\n\n### 关键材料\n- **稀土元素**：钕、镝（用于扬声器、振动马达）\n- **贵金属**：金、银、铜（电路连接）\n- **稀有金属**：钴、锂（电池）\n\n### 可回收性\n♻️ 可回收率约 75%，建议通过正规渠道回收处理。`,
      '电脑': `## 💻 ${name} 成分分析报告\n\n### 主要组成\n| 组件 | 材料 | 占比 |\n|------|------|------|\n| 主板 | FR4基板 + 铜 | 30% |\n| 处理器 | 硅 + 金属 | 8% |\n| 内存 | 硅芯片 | 5% |\n| 硬盘 | 铝/玻璃 + 磁性材料 | 15% |\n| 外壳 | 铝合金/塑料 | 20% |\n| 电源 | 铜 + 铁 | 12% |\n| 其他 | 线缆、散热器等 | 10% |\n\n### 关键材料\n- **半导体材料**：高纯硅、砷化镓\n- **磁性材料**：钕铁硼磁铁\n- **导电材料**：铜、金、银\n\n### 安全提示\n⚠️ 含少量有害物质（铅、汞），需专业拆解处理。`,
      '塑料瓶': `## 🥤 ${name} 成分分析报告\n\n### 材料组成\n| 材料 | 类型 | 占比 |\n|------|------|------|\n| PET | 聚对苯二甲酸乙二醇酯 | 95% |\n| 添加剂 | 稳定剂、着色剂 | 4% |\n| 标签 | PP/纸 | 1% |\n\n### 化学结构\n- **单体**：对苯二甲酸 + 乙二醇\n- **聚合度**：100-200\n- **分子量**：20,000-40,000 g/mol\n\n### 环保信息\n♻️ **可回收等级**：1号（PET）\n🔄 **降解时间**：450年\n💡 **回收用途**：再生纤维、新塑料瓶\n\n### 安全说明\n✅ 食品级PET无毒，但避免高温（>70°C）使用。`,
    }
    
    if (name.toLowerCase().includes('苹果') || name.toLowerCase().includes('iphone') || 
        name.toLowerCase().includes('华为') || name.toLowerCase().includes('小米') ||
        name.toLowerCase().includes('oppo') || name.toLowerCase().includes('vivo')) {
      return analyses['手机']
    }
    
    const priorityKeywords =['手机', '电脑', '塑料瓶', '锂电池', '电路板', '铝合金门窗']
    for (const keyword of priorityKeywords) {
      if (analyses[keyword] && name.toLowerCase().includes(keyword.toLowerCase())) {
        return analyses[keyword]
      }
    }
    
    return `## 🔬 ${name} 成分分析报告\n\n### 基本信息\n${description ? `描述：${description}` : '暂无详细描述'}\n\n### 建议检测项目\n1. **光谱分析** - 确定元素组成\n2. **色谱分析** - 检测有机成分\n3. **质谱分析** - 精确分子量测定\n4. **热分析** - 材料热性能\n\n### 分析说明\n⚠️ 此为AI辅助分析结果，仅供参考。\n如需精确成分数据，建议送检至专业实验室进行仪器分析。\n\n### 联系方式\n如需进一步分析，请联系实验室：lab@company.com`
  }
}