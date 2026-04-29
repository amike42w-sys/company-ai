export const companyInfo = {
  name: {
    zh: '佛山市筑建集成房屋科技有限公司',
    en: 'Foshan Zhujian Integrated Housing Technology Co., Ltd.',
  },
  slogan: { zh: '筑建未来，智选空间', en: 'Building the Future, Smart Space Solutions' },
  founded: { zh: '2012年', en: 'Since 2012' },
  employees: { zh: '100+', en: '100+' },
  description: {
    zh: '专业从事集装箱房屋设计及生产的国际化企业，产品远销欧洲、澳洲、美洲等国际市场。',
    en: 'Professional international enterprise specializing in container house design and production, with products exported to Europe, Australia, America and other international markets.',
  },
  logo: '/logo.svg',
  coverImage: '/images/hero.jpg',
  categories: [
    {
      id: 'school-cat',
      name: { zh: '集装箱房屋 / MIC建筑', en: 'Container House / MIC Building' },
      icon: '🏗️',
      description: {
        zh: '创新模块化建筑解决方案，适用于教育、医疗等多元场景',
        en: 'Innovative modular building solutions for education, healthcare and diverse scenarios'
      },
      projects: [
        // 1. 福田博园小学
        {
          id: 'mic-school-01',
          name: { zh: '福田博园小学', en: 'Futian Expo Garden Primary School' },
          details: {
            title: { zh: '福田博园小学', en: 'Futian Expo Garden Primary School' },
            images: [
              '/images/products/school-01.png', '/images/products/school-02.png',
              '/images/products/school-03.png', '/images/products/school-04.png',
              '/images/products/school-05.png'
            ],
            specs: [
              { label: { zh: 'MiC数量', en: 'MiC Units' }, value: { zh: '145个', en: '145 Units' } },
              { label: { zh: '设计层数', en: 'Floors' }, value: { zh: '3层', en: '3 Floors' } },
              { label: { zh: '总建筑占地面积', en: 'Total Area' }, value: { zh: '3066㎡', en: '3066㎡' } }
            ],
            intro: {
              zh: '学校配备有标准教室、专业教室、办公室、阅览室、卫生间、舞蹈室、会议室、楼梯等。',
              en: 'The school is equipped with standard classrooms, specialized classrooms, offices, a library, bathrooms, dance studios, meeting rooms, stairs, and more.'
            }
          }
        },
        // 2. 荔园外国语小学深南校区
        {
          id: 'mic-school-liyuan',
          name: { zh: '荔园外国语小学深南校区', en: 'Liyuan Foreign Language Primary School' },
          details: {
            title: { zh: '荔园外国语小学深南校区', en: 'Liyuan Foreign Language Primary School Shennan Campus' },
            images: [
              '/images/products/liyuan-01.png', '/images/products/liyuan-02.png',
              '/images/products/liyuan-03.png', '/images/products/liyuan-04.png',
              '/images/products/liyuan-05.png'
            ],
            specs: [
              { label: { zh: 'MiC数量', en: 'MiC Units' }, value: { zh: '160个', en: '160 Units' } },
              { label: { zh: '设计层数', en: 'Floors' }, value: { zh: '3层', en: '3 Floors' } },
              { label: { zh: '总建筑占地面积', en: 'Total Area' }, value: { zh: '3420㎡', en: '3420㎡' } }
            ],
            intro: {
              zh: '学校配备有标准教室、专业教室、办公室、阅览室、卫生间、舞蹈室、会议室、楼梯等。',
              en: 'The school is equipped with standard classrooms, specialized classrooms, offices, a library, bathrooms, dance studios, meeting rooms, stairs, and more.'
            }
          }
        },
        // 3. 翠北实验小学愉贝校区
        {
          id: 'mic-school-cuibei',
          name: { zh: '翠北实验小学愉贝校区', en: 'Cuibei Experimental Primary School' },
          details: {
            title: { zh: '翠北实验小学愉贝校区', en: 'Cuibei Experimental Primary School Yubei Campus' },
            images: [
              '/images/products/cuibei-01.png', '/images/products/cuibei-02.png',
              '/images/products/cuibei-03.png', '/images/products/cuibei-04.png',
              '/images/products/cuibei-05.png'
            ],
            specs: [
              { label: { zh: 'MiC数量', en: 'MiC Units' }, value: { zh: '79个', en: '79 Units' } },
              { label: { zh: '设计层数', en: 'Floors' }, value: { zh: '2层', en: '2 Floors' } },
              { label: { zh: '总建筑占地面积', en: 'Total Area' }, value: { zh: '3498㎡', en: '3498㎡' } }
            ],
            intro: {
              zh: '学校配备有标准教室、专业教室、办公室、阅览室、卫生间、舞蹈室、会议室、楼梯等。',
              en: 'The school is equipped with standard classrooms, specialized classrooms, offices, a library, bathrooms, dance studios, meeting rooms, stairs, and more.'
            }
          }
        },
        // 4. 翠园中学东晓校区
        {
          id: 'mic-school-cuiyuan',
          name: { zh: '翠园中学东晓校区', en: 'Cuiyuan High School' },
          details: {
            title: { zh: '翠园中学东晓校区', en: 'Cuiyuan High School Dongxiao Campus' },
            images: [
              '/images/products/cuiyuan-01.png', '/images/products/cuiyuan-02.png',
              '/images/products/cuiyuan-03.png', '/images/products/cuiyuan-04.png',
              '/images/products/cuiyuan-05.png'
            ],
            specs: [
              { label: { zh: 'MiC数量', en: 'MiC Units' }, value: { zh: '74个', en: '74 Units' } },
              { label: { zh: '设计层数', en: 'Floors' }, value: { zh: '2层', en: '2 Floors' } },
              { label: { zh: '总建筑占地面积', en: 'Total Area' }, value: { zh: '3253㎡', en: '3253㎡' } }
            ],
            intro: {
              zh: '学校配备有标准教室、专业教室、办公室、阅览室、卫生间、舞蹈室、会议室、楼梯等。',
              en: 'The school is equipped with standard classrooms, specialized classrooms, offices, a library, bathrooms, dance studios, meeting rooms, stairs, and more.'
            }
          }
        }
      ]
    },
    {
      id: 'hospital-cat',
      name: { zh: '集成模块化医院', en: 'Integrated Modular Hospital' },
      icon: '🏥',
      description: {
        zh: '快速部署的高标准医疗建筑系统',
        en: 'High-standard rapidly deployable medical buildings'
      },
      projects: [
        // 1. 原有的湛江医院 (保持不变)
        {
          id: 'mic-hospital-zhanjiang',
          name: { zh: '湛江医院', en: 'Zhanjiang Hospital' },
          details: {
            title: { zh: '湛江医院', en: 'Zhanjiang Hospital' },
            images: [
              '/images/products/hospital-01.png', '/images/products/hospital-02.png',
              '/images/products/hospital-03.png', '/images/products/hospital-04.png',
              '/images/products/hospital-05.png'
            ],
            specs: [
              { label: { zh: 'MiC数量', en: 'MiC Units' }, value: { zh: '60个', en: '60 Units' } },
              { label: { zh: '模块尺寸', en: 'Module Size' }, value: { zh: '7*3.6*4 m', en: '7*3.6*4 m' } },
              { label: { zh: '建造时间', en: 'Construction Time' }, value: { zh: '23天', en: '23 Days' } }
            ],
            intro: {
              zh: '该医院设备和功能室都一应俱全，里面包含了值班室、会议室、休息室、更衣室、厕所、抢救室、门诊室、候诊室、采样室、抽血室、治疗室和隔离室，还区分了成人和儿童诊室。',
              en: 'The hospital is fully equipped with facilities, including a duty room, conference room, lounge, emergency room, treatment room, and isolation room, differentiating between adult and pediatric consultation rooms.'
            }
          }
        },
        // 2. 新增：珠海医院 (Zhuhai Hospital)
        {
          id: 'mic-hospital-zhuhai',
          name: { zh: '珠海医院', en: 'Zhuhai Hospital' },
          details: {
            title: { zh: '珠海医院', en: 'Zhuhai Hospital' },
            images: [
              '/images/products/zhuhai-01.png', '/images/products/zhuhai-02.png',
              '/images/products/zhuhai-03.png', '/images/products/zhuhai-04.png',
              '/images/products/zhuhai-05.png'
            ],
            specs: [
              { label: { zh: 'MiC数量', en: 'MiC Units' }, value: { zh: '129个', en: '129 Units' } },
              { label: { zh: '设计层数', en: 'Floors' }, value: { zh: '3层', en: '3 Floors' } },
              { label: { zh: '总建筑占地面积', en: 'Total Construction Area' }, value: { zh: '33900㎡', en: '33900㎡' } },
              { label: { zh: '住院部面积', en: 'Inpatient Dept. Area' }, value: { zh: '4000㎡', en: '4000㎡' } }
            ],
            intro: {
              zh: '该模块化医院仅仅用10天时间完成搭建，配置有接诊区、负压病房楼、ICU、医技楼、网络机房、中心供应库房、垃圾处理暂存间、救护车洗消间都有，ICU（极重症加强护理病房）设置两个病区；另外，还有两个重症护理病区。',
              en: 'This modular hospital was completed in just 10 days and is equipped with a reception area, negative pressure ward building, ICU, medical technology building, network room, central supply warehouse, temporary garbage storage room, and ambulance disinfection area. The ICU has two patient areas; in addition, there are two critical care units.'
            }
          }
        },
        // 3. 新增：深圳发热门诊 (Shenzhen Fever Clinic)
        {
          id: 'mic-hospital-shenzhen',
          name: { zh: '深圳发热门诊', en: 'Shenzhen Fever Clinic' },
          details: {
            title: { zh: '深圳发热门诊', en: 'Shenzhen Fever Clinic' },
            images: [
              '/images/products/sz-fever-01.png', '/images/products/sz-fever-02.png',
              '/images/products/sz-fever-03.png', '/images/products/sz-fever-04.png',
              '/images/products/sz-fever-05.png'
            ],
            specs: [
              { label: { zh: 'MiC数量', en: 'MiC Units' }, value: { zh: '60个', en: '60 Units' } },
              { label: { zh: '模块尺寸', en: 'Module Size' }, value: { zh: '7*3.6*4 m', en: '7*3.6*4 m' } },
              { label: { zh: '建造时间', en: 'Construction Time' }, value: { zh: '23天', en: '23 Days' } }
            ],
            intro: {
              zh: '该医院设备和功能室都一应俱全，里面包含了值班室、会议室、休息室、更衣室、厕所、抢救室、门诊室、候诊室、采样室、抽血室、治疗室和隔离室，还区分了成人和儿童诊室。',
              en: 'The hospital is fully equipped with facilities, including a duty room, conference room, lounge, changing room, bathroom, emergency room, outpatient room, waiting room, sampling room, blood collection room, treatment room, and isolation room, and it also differentiates between adult and pediatric consultation rooms.'
            }
          }
        }
      ]
    },
    {
      id: 'hk-cat',
      name: { zh: '香港MiC项目', en: 'Hong Kong MiC Projects' },
      icon: '�️',
      description: {
        zh: '由香港政府及知名承建商合作的标杆性模块化建筑工程',
        en: 'Landmark MiC projects collaborated with HK Government and top contractors'
      },
      projects: [
        // 1. 天秀街市
        {
          id: 'hk-tianxiu',
          name: { zh: '天秀街市', en: 'Tianxiu Street Market' },
          details: {
            title: { zh: '天秀街市', en: 'Tianxiu Street Market' },
            images: [
              '/images/products/hk-tianxiu-01.png', '/images/products/hk-tianxiu-02.png',
              '/images/products/hk-tianxiu-03.png', '/images/products/hk-tianxiu-04.png',
              '/images/products/hk-tianxiu-05.png'
            ],
            specs: [
              { label: { zh: '总建筑面积', en: 'Total Area' }, value: { zh: '1734㎡', en: '1734㎡' } },
              { label: { zh: '模块组成', en: 'Modules' }, value: { zh: '22个模块商铺', en: '22 Module Shops' } },
              { label: { zh: '特种箱', en: 'Special Units' }, value: { zh: '垃圾房、泵房各1个', en: '1 Garbage room, 1 Pump room' } }
            ],
            intro: {
              zh: '天秀街市是由6个4.9米装箱和6个9米集装箱构建而成。采取"组装合成 MiC"的方式建造，大大缩短了工程时间。',
              en: 'Tianxiu Street Market is constructed from 6 4.9m and 6 9m containers. Adopted the "Modular Integrated Construction (MiC)" method to significantly shorten engineering time.'
            }
          }
        },
        // 2. 香港仔警署大楼项目
        {
          id: 'hk-police',
          name: { zh: '香港仔警署大楼项目', en: 'Aberdeen Police Station Project' },
          details: {
            title: { zh: '香港仔警署大楼项目', en: 'Aberdeen Police Station Project' },
            images: [
              '/images/products/hk-police-01.png', '/images/products/hk-police-02.png',
              '/images/products/hk-police-03.png', '/images/products/hk-police-04.png',
              '/images/products/hk-police-05.png'
            ],
            specs: [
              { label: { zh: '总包单位', en: 'General Contractor' }, value: { zh: '香港瑞安公司', en: 'HK Shui On Land' } },
              { label: { zh: 'MiC数量', en: 'MiC Units' }, value: { zh: '42个', en: '42 Units' } },
              { label: { zh: '设计层数', en: 'Design Layers' }, value: { zh: '3-4层', en: '3-4 Layers' } }
            ],
            intro: {
              zh: '该项目作为市政警务建筑，采用了高效的MiC组装技术，实现了高标准的安全防护与办公空间布局。',
              en: 'As a municipal police building, this project uses efficient MiC assembly technology to achieve high standards of security and office layout.'
            }
          }
        },
        // 3. 长顺街过渡性房屋项目
        {
          id: 'hk-shunting',
          name: { zh: '长顺街过渡性房屋 (舜庭居)', en: 'Shun Ting Terraced Home' },
          details: {
            title: { zh: '香港长沙湾长顺街过渡性房屋项目', en: 'Cheung Shun Street Transitional Housing' },
            images: [
              '/images/products/hk-shunting-01.png', '/images/products/hk-shunting-02.png',
              '/images/products/hk-shunting-03.png', '/images/products/hk-shunting-04.png',
              '/images/products/hk-shunting-05.png'
            ],
            specs: [
              { label: { zh: '总包单位', en: 'General Contractor' }, value: { zh: '香港德材建筑公司', en: 'HK Tech Materials Construction' } },
              { label: { zh: 'MiC数量', en: 'MiC Units' }, value: { zh: '156个', en: '156 Units' } },
              { label: { zh: '设计层数', en: 'Design Layers' }, value: { zh: '4层', en: '4 Layers' } }
            ],
            intro: {
              zh: '该项目位于长沙湾，旨在为有迫切住屋需要的家庭提供过渡性居所。户型包含1人、2人、4人及5人单位。',
              en: 'Located in Cheung Sha Wan, providing transitional housing for families in need. Unit types include 1, 2, 4, and 5-person units.'
            }
          }
        },
        // 4. 海兴路过渡性房屋项目
        {
          id: 'hk-yanchai',
          name: { zh: '海兴路过渡性房屋 (仁济安置所)', en: 'Yan Chai Residence' },
          details: {
            title: { zh: '香港荃湾海兴路过渡性房屋项目', en: 'Hoi Hing Road Transitional Housing' },
            images: [
              '/images/products/hk-yanchai-01.png', '/images/products/hk-yanchai-02.png',
              '/images/products/hk-yanchai-03.png', '/images/products/hk-yanchai-04.png',
              '/images/products/hk-yanchai-05.png'
            ],
            specs: [
              { label: { zh: '总包单位', en: 'General Contractor' }, value: { zh: '香港建业公司', en: 'HK Construction Company' } },
              { label: { zh: 'MiC数量', en: 'MiC Units' }, value: { zh: '237个', en: '237 Units' } },
              { label: { zh: '建筑面积', en: 'Floor Area' }, value: { zh: '2286㎡', en: '2286㎡' } }
            ],
            intro: {
              zh: '项目分为南北两栋，每栋两层。共有两种不同箱体规格：3135*7500*2800mm 及 3135*5000*2800mm。包含楼梯箱与设备箱。',
              en: 'Divided into North and South buildings, two floors each. Uses two container sizes: 3135*7500*2800mm and 3135*5000*2800mm. Includes staircase and equipment enclosures.'
            }
          }
        },
        // 5. 牛潭尾北过渡性房屋项目
        {
          id: 'hk-thestep',
          name: { zh: '牛潭尾北过渡性房屋 (THE STEP)', en: 'THE STEP - Ngau Tam Mei North' },
          details: {
            title: { zh: '香港牛潭尾北过渡性房屋项目', en: 'Ngau Tam Mei North Transitional Housing' },
            images: [
              '/images/products/hk-thestep-01.png', '/images/products/hk-thestep-02.png',
              '/images/products/hk-thestep-03.png', '/images/products/hk-thestep-04.png',
              '/images/products/hk-thestep-05.png'
            ],
            specs: [
              { label: { zh: '总包单位', en: 'General Contractor' }, value: { zh: '香港新福港公司', en: 'HK Xinfu Port Company' } },
              { label: { zh: 'MiC数量', en: 'MiC Units' }, value: { zh: '1400+个', en: '1400+ Units' } },
              { label: { zh: '设计层数', en: 'Number of Floors' }, value: { zh: '4层', en: '4 Floors' } }
            ],
            intro: {
              zh: '项目兴建4幢分层住宅，涉及楼面约310,440平方呎，提供1,208个过渡性房屋单位，料可容纳2,772人。',
              en: 'Constructs four 4-story buildings (~310,440 sq ft), providing 1,208 housing units accommodating approximately 2,772 people.'
            }
          }
        }
      ]
    },
    // 4. 酒店分类 (Hotel Buildings)
    {
      id: 'hotel-cat',
      name: { zh: '酒店建筑', en: 'Hotel Buildings' },
      icon: '🏨',
      description: { zh: '高品质模块化酒店，实现快速开业与卓越性能', en: 'High-quality modular hotels for rapid opening and superior performance' },
      projects: [
        {
          id: 'hotel-djibouti',
          name: { zh: '吉布提酒店', en: 'Djibouti Hotel' },
          details: {
            title: { zh: '吉布提酒店项目', en: 'Djibouti Hotel Project' },
            images: ['/images/products/hotel-djibouti-01.png', '/images/products/hotel-djibouti-02.png', '/images/products/hotel-djibouti-03.png', '/images/products/hotel-djibouti-04.png', '/images/products/hotel-djibouti-05.png'],
            specs: [
              { label: { zh: '集装箱数量', en: 'Container Qty' }, value: { zh: '203个', en: '203 Units' } },
              { label: { zh: '总面积', en: 'Total Area' }, value: { zh: '6625.7㎡', en: '6625.7 sqm' } },
              { label: { zh: '设计层数', en: 'Floors' }, value: { zh: '4层', en: '4 Stories' } }
            ],
            intro: {
              zh: '由203个非标集装箱拼接而成的五星级酒店。一层为餐厅、办公室等功能室，二至四层为住宿公寓及套房。',
              en: 'A 5-star hotel made of 203 non-standard containers. 1st floor features functional areas like canteen and offices; 2nd-4th floors are residential suites.'
            }
          }
        },
        {
          id: 'hotel-bayarea',
          name: { zh: '湾区会展国际酒店', en: 'Bay Area Convention Hotel' },
          details: {
            title: { zh: '湾区会展国际酒店', en: 'Bay Area Convention International Hotel' },
            images: ['/images/products/hotel-bayarea-01.png', '/images/products/hotel-bayarea-02.png', '/images/products/hotel-bayarea-03.png', '/images/products/hotel-bayarea-04.png', '/images/products/hotel-bayarea-05.png'],
            specs: [
              { label: { zh: '总包单位', en: 'Contractor' }, value: { zh: '中国建筑', en: 'China Construction' } },
              { label: { zh: 'MiC数量', en: 'MiC Qty' }, value: { zh: '1026个', en: '1026 Units' } },
              { label: { zh: '层数', en: 'Floors' }, value: { zh: '7层', en: '7 Stories' } }
            ],
            intro: { zh: '大规模现代化会展配套酒店，采用高效MiC技术建造。', en: 'Large-scale modern convention supporting hotel, built with high-efficiency MiC technology.' }
          }
        },
        {
          id: 'hotel-au-3star',
          name: { zh: '三星级澳洲酒店', en: '3-Star Australia Hotel' },
          details: {
            title: { zh: '三星级澳洲酒店', en: 'Three-star Australia Hotel' },
            images: ['/images/products/hotel-au3-01.png', '/images/products/hotel-au3-02.png', '/images/products/hotel-au3-03.png', '/images/products/hotel-au3-04.png', '/images/products/hotel-au3-05.png'],
            specs: [
              { label: { zh: '隔音性能', en: 'Sound Insulation' }, value: { zh: '55分贝', en: '55 Decibels' } },
              { label: { zh: '防火等级', en: 'Fire Resistance' }, value: { zh: '1小时', en: '1 Hour' } },
              { label: { zh: '单元总数', en: 'Total Units' }, value: { zh: '160个', en: '160 Units' } }
            ],
            intro: {
              zh: '外围墙体由饰面板+双层12.5mm耐火石膏板+岩棉+防水布组成，包含一房、二房、三房及楼梯阳台模块。',
              en: 'Exterior walls feature double 12.5mm fire-resistant gypsum board and rock wool. Includes 1-3 bedroom units and staircase modules.'
            }
          }
        },
        {
          id: 'hotel-au-4star',
          name: { zh: '四星级澳洲酒店', en: '4-Star Australia Hotel' },
          details: {
            title: { zh: '四星级澳洲酒店', en: 'Four-star Australia Hotel' },
            images: ['/images/products/hotel-au4-01.png', '/images/products/hotel-au4-02.png', '/images/products/hotel-au4-03.png', '/images/products/hotel-au4-04.png', '/images/products/hotel-au4-05.png'],
            specs: [
              { label: { zh: '功能分区', en: 'Functions' }, value: { zh: '四大功能区', en: '4 Major Areas' } },
              { label: { zh: '标准', en: 'Standard' }, value: { zh: '遵循澳洲标准', en: 'Australian Standard' } }
            ],
            intro: {
              zh: '模块化单元集成卧室、小会客区、独立浴室及独立厕所。严格遵循澳标及相关规范，可快速部署使用。',
              en: 'Integrated bedroom, sitting area, separate bathroom and toilet. Strictly adhering to Australian standards for rapid deployment.'
            }
          }
        },
        {
          id: 'hotel-fiji',
          name: { zh: '斐济索菲特酒店', en: 'Sofitel Fiji Hotel' },
          details: {
            title: { zh: '五星级斐济索菲特酒店', en: 'Five-star Sofitel Fiji Hotel' },
            images: ['/images/products/hotel-fiji-01.png', '/images/products/hotel-fiji-02.png', '/images/products/hotel-fiji-03.png', '/images/products/hotel-fiji-04.png', '/images/products/hotel-fiji-05.png'],
            specs: [
              { label: { zh: '建筑形态', en: 'Shape' }, value: { zh: '扇形', en: 'Fan-shaped' } },
              { label: { zh: '楼栋数', en: 'Buildings' }, value: { zh: '3栋', en: '3 Buildings' } }
            ],
            intro: {
              zh: '本项目是斐济酒店项目模块，分为2个大小模块，3栋楼，总项目模块形状整体为扇形。',
              en: 'This project involves 3 buildings with fan-shaped layouts, divided into two module sizes.'
            }
          }
        }
      ]
    },
    // 5. 公寓分类 (Apartments)
    {
      id: 'apartment-cat',
      name: { zh: '公寓建筑 / 宿舍', en: 'Apartment / Dormitory' },
      icon: '🏢',
      description: { zh: '针对人才公寓、学生及员工宿舍的高效居住空间解决方案', en: 'Efficient living space solutions for talent apartments, student and staff dormitories' },
      projects: [
        // 1. 美国公寓 (Unicorn模型)
        {
          id: 'apt-american-unicorn',
          name: { zh: '美国"独角兽"公寓', en: 'American "Unicorn" Apartment' },
          details: {
            title: { zh: '美国"独角兽"公寓项目', en: 'American "Unicorn" Apartment Project' },
            images: [
              '/images/products/apt-usa-01.png', '/images/products/apt-usa-02.png',
              '/images/products/apt-usa-03.png', '/images/products/apt-usa-04.png',
              '/images/products/apt-usa-05.png'
            ],
            specs: [
              { label: { zh: '建筑规范', en: 'Code' }, value: { zh: '遵循国际住宅规范', en: 'IRC Compliant' } },
              { label: { zh: '抗风等级', en: 'Wind Speed' }, value: { zh: '170英里/小时', en: '170 mph' } },
              { label: { zh: '模块尺寸', en: 'Module Size' }, value: { zh: '8290*2930*3330mm', en: '8290x2930x3330mm' } }
            ],
            intro: {
              zh: '640平方英尺的"Unicorn"模型，结合了两个320平方英尺的预制模块。包括全尺寸浴室、厨房、客厅、饭厅、办公区，可舒适地容纳四个人。',
              en: 'The 640 sq ft "Unicorn" model combines two 320 SF pre-manufactured modules. Includes a full-size bathroom, kitchen, living, and dining areas, comfortably sleeping four.'
            }
          }
        },
        // 2. 西欧标准公寓 (Western Europe Apartment)
        {
          id: 'apt-europe-standard',
          name: { zh: '西欧标准公寓', en: 'Western Europe Apartment' },
          details: {
            title: { zh: '西欧模块化公寓', en: 'Western Europe Modular Apartment' },
            images: [
              '/images/products/apt-we-01.png', '/images/products/apt-we-02.png',
              '/images/products/apt-we-03.png', '/images/products/apt-we-04.png',
              '/images/products/apt-we-05.png'
            ],
            specs: [
              { label: { zh: '规格尺寸', en: 'Size' }, value: { zh: '13870×3870×3650mm', en: '13870×3870×3650mm' } },
              { label: { zh: '墙体材料', en: 'Wall' }, value: { zh: '轻钢龙骨+岩棉+100mm夹芯板', en: 'Light Steel Stud+Rock Wool' } },
              { label: { zh: '地面材料', en: 'Floor' }, value: { zh: '20mm FC板+PVC地板', en: '20mm FC Board+PVC Flooring' } }
            ],
            intro: {
              zh: '采用欧洲标准设计的模块化公寓，墙面采用轻钢龙骨加岩棉保温，天花板为波纹钢板加石膏板，地面为FC板加PVC地板，提供舒适的居住环境。',
              en: 'European standard modular apartment with light steel stud walls, rock wool insulation, corrugated steel ceiling, and FC board with PVC flooring for comfortable living.'
            }
          }
        },
        // 3. NDU 学生公寓项目 (NDU Student Apartments)
        {
          id: 'apt-ndu-student',
          name: { zh: 'NDU 学生公寓', en: 'NDU Student Apartments' },
          details: {
            title: { zh: 'NDU 学生公寓项目', en: 'NDU Student Apartments Project' },
            images: [
              '/images/products/apt-ndu-01.png', '/images/products/apt-ndu-02.png',
              '/images/products/apt-ndu-03.png', '/images/products/apt-ndu-04.png',
              '/images/products/apt-ndu-05.png'
            ],
            specs: [
              { label: { zh: '规格尺寸', en: 'Size' }, value: { zh: '12192×3836×3100mm', en: '12192×3836×3100mm' } },
              { label: { zh: '材料标准', en: 'Material Standard' }, value: { zh: '插座美标/其他国标', en: 'US Standard Socket' } },
              { label: { zh: '箱体类型', en: 'Type' }, value: { zh: '公寓箱型', en: 'Apartment Container' } }
            ],
            intro: {
              zh: '专为学生宿舍设计的模块化公寓单元，采用标准化生产工艺，可快速组装部署，为校园提供舒适的居住空间。',
              en: 'Modular apartment units designed specifically for student dormitories, featuring standardized production processes for rapid assembly and deployment.'
            }
          }
        },
        // 4. 美国纽约公寓 (New York Apartment)
        {
          id: 'apt-newyork',
          name: { zh: '美国纽约公寓', en: 'New York Apartment' },
          details: {
            title: { zh: '美国纽约模块化公寓', en: 'New York Modular Apartment' },
            images: [
              '/images/products/apt-ny-01.png', '/images/products/apt-ny-02.png',
              '/images/products/apt-ny-03.png', '/images/products/apt-ny-04.png',
              '/images/products/apt-ny-05.png'
            ],
            specs: [
              { label: { zh: '容纳人数', en: 'Capacity' }, value: { zh: '2人', en: '2 Persons' } },
              { label: { zh: '材料标准', en: 'Standard' }, value: { zh: '美标', en: 'US Standard' } },
              { label: { zh: '主结构', en: 'Structure' }, value: { zh: '钢结构', en: 'Steel Structure' } }
            ],
            intro: {
              zh: '美式高端模块化公寓，包含浴室卧室模块和客厅厨房模块，采用轻钢龙骨、岩棉、石膏板等优质材料，打造舒适居住体验。',
              en: 'American high-end modular apartment featuring bathroom/bedroom and living room/kitchen modules, constructed with light steel studs, rock wool, and gypsum board.'
            }
          }
        },
        // 5. 爱尔兰公寓 (Ireland Apartment)
        {
          id: 'apt-ireland',
          name: { zh: '爱尔兰公寓', en: 'Ireland Apartment' },
          details: {
            title: { zh: '爱尔兰模块化公寓', en: 'Ireland Modular Apartment' },
            images: [
              '/images/products/apt-ireland-01.png', '/images/products/apt-ireland-02.png',
              '/images/products/apt-ireland-03.png', '/images/products/apt-ireland-04.png',
              '/images/products/apt-ireland-05.png'
            ],
            specs: [
              { label: { zh: '规格尺寸', en: 'Size' }, value: { zh: '12192×2438×2896mm', en: '12192×2438×2896mm' } },
              { label: { zh: '重量', en: 'Weight' }, value: { zh: '9.5吨', en: '9.5 Tons' } },
              { label: { zh: '材料标准', en: 'Standard' }, value: { zh: 'CE欧洲标准', en: 'CE European Standard' } }
            ],
            intro: {
              zh: '符合欧洲CE标准的模块化集装箱公寓，采用标准化设计，适合欧洲市场需求，可快速运输和组装。',
              en: 'CE-certified modular container apartment designed for the European market, featuring standardized design for rapid transportation and assembly.'
            }
          }
        },
        // 6. 塞浦路斯公寓 (Cyprus Apartment)
        {
          id: 'apt-cyprus',
          name: { zh: '塞浦路斯公寓', en: 'Cyprus Apartment' },
          details: {
            title: { zh: '塞浦路斯模块化公寓', en: 'Cyprus Modular Apartment' },
            images: [
              '/images/products/apt-cyprus-01.png', '/images/products/apt-cyprus-02.png',
              '/images/products/apt-cyprus-03.png', '/images/products/apt-cyprus-04.png',
              '/images/products/apt-cyprus-05.png'
            ],
            specs: [
              { label: { zh: '规格尺寸', en: 'Size' }, value: { zh: '7600×2990×3100mm', en: '7600×2990×3100mm' } },
              { label: { zh: '材料标准', en: 'Standard' }, value: { zh: 'CE欧洲标准', en: 'CE European Standard' } },
              { label: { zh: '设计特点', en: 'Feature' }, value: { zh: '地中海风格', en: 'Mediterranean Style' } }
            ],
            intro: {
              zh: '为塞浦路斯市场定制的模块化公寓，采用地中海风格设计，符合欧洲CE认证标准，适合度假和长期居住。',
              en: 'Custom modular apartment for the Cyprus market, featuring Mediterranean style design with CE certification, ideal for vacation and long-term living.'
            }
          }
        }
      ]
    },
    // 6. 文旅分类 (Tourism)
    {
      id: 'tourism-cat',
      name: { zh: '文旅项目 / 民宿', en: 'Tourism / Homestays' },
      icon: '🏕️',
      description: { zh: '融合自然的景观民宿与旅游配套', en: 'Landscape homestays integrated with nature' },
      projects: [
        {
          id: 'tour-apple-single',
          name: { zh: '苹果舱单箱', en: 'Apple Cabin Single' },
          details: {
            title: { zh: '苹果舱单箱', en: 'Apple Cabin Single' },
            images: ['/images/products/apple-s-01.png', '/images/products/apple-s-02.png', '/images/products/apple-s-03.png', '/images/products/apple-s-04.png', '/images/products/apple-s-05.png'],
            specs: [
              { label: { zh: '外墙材料', en: 'Exterior Wall' }, value: { zh: '铝单板', en: 'Aluminum panel' } },
              { label: { zh: '玻璃配置', en: 'Glass' }, value: { zh: '单向镜面玻璃', en: 'One-way mirror' } }
            ],
            intro: { zh: '钢结构热镀锌，岩棉保温，美标给排水系统。', en: 'Hot-dip galvanized steel, rock wool insulation, US standard plumbing.' }
          }
        },
        {
          id: 'tour-apple-double',
          name: { zh: '苹果舱二拼箱', en: 'Apple Cabin Double' },
          details: {
            title: { zh: '苹果舱二拼箱', en: 'Apple Cabin Double' },
            images: ['/images/products/apple-d-01.png', '/images/products/apple-d-02.png', '/images/products/apple-d-03.png', '/images/products/apple-d-04.png', '/images/products/apple-d-05.png'],
            specs: [
              { label: { zh: '内饰面', en: 'Interior' }, value: { zh: '集成快装饰面板', en: 'Integrated panel' } },
              { label: { zh: '防腐', en: 'Anticorrosion' }, value: { zh: '热镀锌', en: 'Hot-dip galvanized' } }
            ],
            intro: { zh: '两箱横向拼接，空间更宽敞，适合高端民宿。', en: 'Double cabin splicing for spacious living, ideal for high-end homestays.' }
          }
        },
        {
          id: 'tour-japan',
          name: { zh: '日本公寓', en: 'Japan Apartment' },
          details: {
            title: { zh: '日本定制模块化建筑', en: 'Japan Apartment' },
            images: ['/images/products/tour-jp-01.png', '/images/products/tour-jp-02.png', '/images/products/tour-jp-03.png', '/images/products/tour-jp-04.png', '/images/products/tour-jp-05.png'],
            specs: [
              { label: { zh: '功能模块', en: 'Modules' }, value: { zh: '一厅一室一卫两露台', en: '1L, 1B, 1Bath, 2Terraces' } },
              { label: { zh: '特点', en: 'Feature' }, value: { zh: '自带钢结构支撑', en: 'Built-in steel support' } }
            ],
            intro: { zh: '针对日本多雪气候定制。自带钢结构支撑防止积雪堆积，提升空间感且便于海运。', en: 'Designed for snowy Japan. Built-in supports prevent snow accumulation and aid shipping.' }
          }
        }
      ]
    }
  ],
  
  supportingServices: [
    {
      name: { zh: '工业级设备箱', en: 'Industrial Equipment Container' },
      description: {
        zh: '提供机柜、配电箱、逆变箱等定制化箱体，适用于野外营地、赛事保障、工业设备场景。',
        en: 'Provides customized containers for cabinets, power distribution boxes, inverter boxes, etc., suitable for field camps, event support, and industrial equipment scenarios.'
      },
      icon: '⚡',
    },
    {
      name: { zh: '钢结构加工与全链条服务', en: 'Steel Structure Processing & Full-Chain Service' },
      description: {
        zh: '支持钢结构件定制、超宽箱/特殊尺寸模块生产，可配套家具、跑步板等一体化交付。',
        en: 'Supports customized steel structure components, ultra-wide containers/special-sized module production, with integrated delivery of furniture, running boards, etc.'
      },
      icon: '🔧',
    },
  ],

  services: [
    { zh: '方案设计', en: 'Design' },
    { zh: '生产制造', en: 'Manufacturing' },
    { zh: '运输安装', en: 'Installation' },
    { zh: '售后维护', en: 'Maintenance' },
    { zh: '定制开发', en: 'Custom Development' },
  ],
  
  about: `
佛山市筑建集成房屋科技有限公司成立于2012年，是一家专业从事集装箱房屋设计及生产的国际化企业。

公司发展迅速，至今厂房面积已达40000平方米，产品远销欧洲、澳洲、美洲等国际市场。公司总部办事处位于广东省佛山市顺德区北滘怡和中心，毗邻香港、广州，地理位置优越，交通便利。生产基地位于佛山市高明区富湾工业区恒昌路35号。

我们可以生产二十尺柜集装箱、四十尺柜集装箱、超宽箱和配套产品跑步板及定制家具。客户可以根据集装箱使用类型定制有关的尺寸或材质等，如学生公寓、汽车旅馆、公共建筑、住宅别墅等。

拥有专业的设计团体和具备多年经验的施工团体，我们能更好地完成由设计开发到生产出口的整个生产链，使产品质量得以保证，让客户安心满意。为了能与时俱进，公司不仅不定时安排员工出国观展学习，更好地了解客户需求和行业趋势；而且统一安排培训学习，加强集装箱房屋行业的知识运用。

展望未来，公司将继续保持创新、发展、团结、诚信的理念，不断提升产品质量和服务水平，为客户提供更加优质、安全、环保的集装箱房屋解决方案。`,

  contact: {
    address: {
      zh: '广东省佛山市顺德区北滘怡和中心12楼',
      en: '12th Floor, Yihe Center, Beijiao, Shunde District, Foshan City, Guangdong Province, China',
    },
    phone: '86-757-12345678',
    email: 'info@zhujian-container.com',
    productionAddress: {
      zh: '广东省佛山市高明区富湾工业区恒昌路35号',
      en: 'No. 35, Hengchang Road, Fuwan Industrial Zone, Gaoming District, Foshan City, Guangdong Province, China',
    },
  },
} as const;

export const companyQA = [
  { question: '公司全称是什么？', answer: '佛山市筑建集成房屋科技有限公司' },
  { question: '公司成立时间？', answer: '2012年10月17日' },
  { question: '公司地址在哪里？', answer: '广东省佛山市顺德区北滘怡和中心12楼' },
  { question: '公司电话是多少？', answer: '86-757-12345678' },
  { question: '公司邮箱？', answer: 'info@zhujian-container.com' },
  { question: '主要产品是什么？', answer: '集装箱房屋、模块化集成房屋（MIC）、钢结构别墅等' },
  { question: '公司规模多大？', answer: '厂房面积40000平方米，员工100余人' },
  { question: '产品出口哪些国家？', answer: '欧洲、澳洲、美洲等国际市场' },
];
