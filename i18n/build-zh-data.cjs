// 生成 i18n/zh-data.js —— 汉化包数据（动作名 id→中文 + 界面/字段词典）
// 运行: node i18n/build-zh-data.cjs
'use strict';
const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'exercises.json'), 'utf8'));

// ── 枚举字段词典（分类 / 部位 / 器械 / 目标肌群 / 辅助肌群）──
const VALUES = {
  // category / body_part
  'waist': '腰腹', 'upper legs': '大腿', 'back': '背部', 'lower legs': '小腿',
  'chest': '胸部', 'upper arms': '手臂', 'cardio': '有氧', 'shoulders': '肩部',
  'lower arms': '前臂', 'neck': '颈部',
  // equipment
  'body weight': '自重', 'cable': '龙门架', 'leverage machine': '固定器械',
  'assisted': '辅助', 'medicine ball': '药球', 'stability ball': '瑞士球',
  'band': '弹力带', 'barbell': '杠铃', 'rope': '训练绳', 'dumbbell': '哑铃',
  'ez barbell': '曲杆', 'sled machine': '倒蹬机', 'upper body ergometer': '上肢功率车',
  'kettlebell': '壶铃', 'olympic barbell': '奥杆', 'weighted': '负重',
  'bosu ball': '波速球', 'resistance band': '弹力带', 'roller': '泡沫轴',
  'skierg machine': '滑雪机', 'hammer': '铁锤', 'smith machine': '史密斯机',
  'wheel roller': '健腹轮', 'stationary bike': '动感单车', 'tire': '轮胎',
  'trap bar': '六角杠', 'elliptical machine': '椭圆机', 'stepmill machine': '登山机',
  // target / muscles
  'abs': '腹肌', 'quads': '股四头肌', 'lats': '背阔肌', 'calves': '小腿肌',
  'pectorals': '胸大肌', 'glutes': '臀肌', 'hamstrings': '腘绳肌',
  'adductors': '内收肌群', 'triceps': '肱三头肌', 'cardiovascular system': '心肺',
  'spine': '竖脊肌', 'upper back': '上背', 'biceps': '肱二头肌', 'delts': '三角肌',
  'forearms': '前臂', 'traps': '斜方肌', 'serratus anterior': '前锯肌',
  'abductors': '外展肌群', 'levator scapulae': '肩胛提肌',
  'hip flexors': '髋屈肌', 'lower back': '下背', 'obliques': '腹斜肌',
  'rhomboids': '菱形肌', 'ankle stabilizers': '踝稳定肌', 'core': '核心',
  'quadriceps': '股四头肌', 'rear deltoids': '三角肌后束', 'trapezius': '斜方肌',
  'ankles': '脚踝', 'feet': '足部', 'deltoids': '三角肌', 'brachialis': '肱肌',
  'groin': '腹股沟', 'wrists': '手腕', 'rotator cuff': '肩袖', 'upper chest': '上胸',
  'latissimus dorsi': '背阔肌', 'wrist flexors': '腕屈肌', 'wrist extensors': '腕伸肌',
  'abdominals': '腹部', 'grip muscles': '握力肌', 'lower abs': '下腹',
  'inner thighs': '大腿内侧', 'soleus': '比目鱼肌', 'sternocleidomastoid': '胸锁乳突肌',
  'hands': '手部', 'shins': '胫前肌', 'shoulders': '肩部', 'triceps brachii': '肱三头肌',
};

// ── 动作短语词典：最长匹配、词边界敏感，顺序保留 ──
const PHRASES = {
  // 器械 / 工具
  'olympic barbell': '奥杆', 'cambered bar': '弧形杠', 'trap bar': '六角杠',
  'ez barbell': '曲杆', 'ez-bar': '曲杆', 'smith machine': '史密斯机',
  'leverage machine': '固定器械', 'sled machine': '倒蹬机', 'skierg machine': '滑雪机',
  'stepmill machine': '登山机', 'elliptical machine': '椭圆机',
  'stationary bike': '动感单车', 'upper body ergometer': '上肢功率车',
  'exercise ball': '健身球', 'stability ball': '瑞士球', 'medicine ball': '药球',
  'bosu ball': '波速球', 'wheel roller': '健腹轮', 'resistance band': '弹力带',
  'kettlebell': '壶铃', 'dumbbells': '哑铃', 'dumbbell': '哑铃', 'barbell': '杠铃',
  'cable': '龙门架', 'bodyweight': '自重', 'body weight': '自重', 'assisted': '辅助',
  'self assisted': '自我辅助', 'weighted': '负重', 'band': '弹力带', 'bands': '弹力带',
  'suspension': '悬挂带', 'suspended': '悬挂', 'roller': '泡沫轴', 'hammer': '铁锤',
  'tire': '轮胎', 'rope': '绳', 'ropes': '绳', 'battling ropes': '战绳',
  'battle rope': '战绳', 'sled': '雪橇', 'incline bench': '上斜凳', 'preacher': '牧师凳',
  'peacher': '牧师凳', 'machine': '器械', 'lever': '固定器械', 'bench': '凳',
  'benches': '凳', 'wrist roller': '腕滚轮', 'ab wheel': '健腹轮', 'wheel': '健腹轮',
  'chair': '椅子', 'captains chair': '船长椅', 'parallel bars': '双杠', 'ring': '吊环',
  'landmine': '地雷架', 'power cage': '力量架', 'pulley': '滑轮', 'trainer': '训练器',
  'treadmill': '跑步机', 'ergometer': '功率车', 'balance board': '平衡板',
  'smith': '史密斯机', 'gripper': '握力器', 'strap': '助力带', 'straps': '助力带',
  'pad': '垫',
  // 姿势 / 位置
  'seated': '坐姿', 'sitted': '坐姿', 'standing': '站姿', 'kneeling': '跪姿',
  'lying on floor': '俯卧', 'lying': '仰卧', 'prone': '俯卧', 'supine': '仰卧',
  'side lying': '侧卧', 'side-lying': '侧卧', 'reclining': '斜卧', 'bent over': '俯身',
  'bent-over': '俯身', 'incline': '上斜', 'decline': '下斜', 'squatting': '深蹲姿',
  'hanging': '悬垂', 'hang': '悬垂', 'split': '分腿', 'lateral': '侧', 'front': '前',
  'side': '侧', 'overhead': '过顶', 'behind neck': '颈后', 'behind back': '背后',
  'behind head': '脑后', 'behind': '后', 'back of the head': '后脑',
  'flat': '平', 'floor': '地面', 'ground': '地面', 'elevated': '垫高', 'on bench': '凳上',
  'on incline bench': '上斜凳上', 'on exercise ball': '健身球上',
  'on stability ball': '瑞士球上', 'on bosu ball': '波速球上', 'on floor': '地面',
  'incline bench press': '上斜卧推', 'straddle': '跨坐', 'astride': '跨立',
  // 握法 / 修饰
  'wide-grip': '宽握', 'wide grip': '宽握', 'close-grip': '窄握', 'close grip': '窄握',
  'narrow-grip': '窄握', 'narrow grip': '窄握', 'underhand': '反手', 'overhand': '正手',
  'reverse-grip': '反握', 'reverse grip': '反握', 'neutral grip': '对握',
  'pronated': '正握', 'supinated': '反握', 'pronate': '正握', 'pronation': '旋前',
  'supination': '旋后', 'mixed grip': '混合握', 'hook grip': '锁握', 'hook': '钩',
  'parallel grip': '平行握', 'palms up': '掌心向上', 'palms down': '掌心向下',
  'palms rotational': '旋腕', 'palm rotational': '旋腕', 'one arm': '单臂',
  'one-arm': '单臂', 'single arm': '单臂', 'two arm': '双臂', 'two-arm': '双臂',
  'one leg': '单腿', 'one legged': '单腿', 'single leg': '单腿', 'two legs': '双腿',
  'alternating': '交替', 'alternate': '交替', 'cross body': '交叉', 'cross-body': '交叉',
  'twisting': '转体', 'twisted': '转体', 'twist': '转体', 'rotational': '旋转',
  'rotary': '旋转', 'rear delt': '后束', 'straight back': '直背', 'straight leg': '直腿',
  'straight-arm': '直臂', 'straight arm': '直臂', 'stiff leg': '直腿', 'inner': '内侧',
  'outer': '外侧', 'outside': '外侧', 'inside': '内侧', 'upper': '上', 'lower': '下',
  'middle': '中', 'wide': '宽', 'narrow': '窄', 'close': '窄', 'reverse': '反向',
  'reversed': '反向', 'inverse': '反向', 'full range of motion': '全幅度',
  'range of motion': '动作幅度', 'stirrups': '马镫把手', 'v-bar': 'V把',
  'twin handle': '双柄', 'with rope attachment': '配绳索', 'with rope': '配绳索',
  'rope attachment': '绳索把手', 'pro lat bar': '专业拉背杆', 'arm blaster': '二头托板',
  'with towel': '配毛巾', 'towel': '毛巾', 'with straps': '配助力带',
  'external rotation': '外旋', 'internal rotation': '内旋', 'external': '外',
  'internal': '内', 'semi': '半', 'diagonal': '斜向', 'contralateral': '对侧',
  'unilateral': '单侧', 'anti rotation': '抗旋转', 'anti': '抗', 'modified': '简化',
  'basic': '基础', 'advanced': '进阶', 'intermediate': '中级', 'dynamic': '动态',
  'negative': '离心', 'isometric': '等长收缩', 'plyo': '爆发', 'power': '爆发',
  'quick': '快速', 'deep': '深', 'short': '短', 'partial': '半程', 'half': '半程',
  'quarter': '1/4程', 'three quarter': '3/4程', 'full': '全程', 'depth': '深度',
  'gripless': '无握把', 'grip': '握', 'stance': '站距', 'stork stance': '金鸡独立',
  'stork': '鹤立式', 'sumo': '相扑式', 'variation': '变式', 'style': '式',
  'bottoms up': '倒握', 'pointed': '绷直', 'point': '指向', 'pyramid': '金字塔式',
  // 动作（多词优先）
  'sit-up': '仰卧起坐', 'situp': '仰卧起坐', 'curl-up': '卷腹', 'curl up': '卷腹',
  'crunch': '卷腹', 'crunches': '卷腹', 'push-up': '俯卧撑', 'push up': '俯卧撑',
  'pushups': '俯卧撑', 'pushup': '俯卧撑', 'pull-up': '引体向上', 'pull up': '引体向上',
  'pullup': '引体向上', 'chin-up': '反手引体', 'chin up': '反手引体',
  'muscle-up': '双力臂', 'muscle up': '双力臂', 'kipping': '蝶式借力',
  'l-sit': 'L支撑', 'v-sit': 'V字坐', 'v sit': 'V字坐', 'dip': '臂屈伸', 'dips': '臂屈伸',
  'burpee': '波比跳', 'mountain climber': '登山跑', 'plank': '平板支撑',
  'side plank': '侧平板支撑', 'jumping jack': '开合跳', 'jump squat': '深蹲跳',
  'lunge': '弓步', 'walking lunge': '行进弓步', 'squat': '深蹲', 'squats': '深蹲',
  'deadlift': '硬拉', 'clean and jerk': '挺举', 'clean and press': '高翻推举',
  'push press': '借力推', 'push jerk': '借力挺', 'thruster': '深蹲推举', 'snatch': '抓举',
  'clean': '高翻', 'bench press': '卧推', 'shoulder press': '肩上推举',
  'military press': '军姿推举', 'lateral pulldown': '高位下拉', 'lat pulldown': '高位下拉',
  'pulldown': '下拉', 'pull down': '下拉', 'row': '划船', 'rowing': '划船',
  'upright row': '直立划船', 'inverted row': '反向划船', 'bent over row': '俯身划船',
  'renegade row': '平板支撑划船', 'leg curl': '腿弯举', 'lying leg curl': '俯卧腿弯举',
  'leg extension': '腿屈伸', 'back extension': '山羊挺身', 'hyperextension': '山羊挺身',
  'triceps extension': '三头屈伸', 'tricep extension': '三头屈伸',
  'lateral raise': '侧平举', 'front lateral raise': '前平举',
  'jack knife sit-up': '折刀卷腹', 'front raise': '前平举', 'calf raise': '提踵',
  'leg raise': '举腿', 'toe raise': '踮脚', 'heel raise': '提踵', 'y-raise': 'Y字平举',
  't-raise': 'T字平举', 'w-raise': 'W字平举', 'raise': '平举', 'raises': '平举',
  'fly': '飞鸟', 'flye': '飞鸟', 'flyes': '飞鸟', 'shrug': '耸肩', 'pullover': '仰卧上拉',
  'pull through': '过胯拉', 'pull-through': '过胯拉', 'hip thrust': '臀推',
  'thrusts': '臀推', 'glute bridge': '臀桥', 'bridge': '桥式', 'good morning': '早安式体前屈',
  'kickback': '后踢腿', 'kickbacks': '后踢腿', 'glute kickback': '臀踢',
  'donkey kick': '驴式后踢', 'v-up': 'V字两头起', 'jack knife': '折刀卷腹',
  'jackknife': '折刀卷腹', 'russian twist': '俄罗斯转体', 'pallof press': '帕洛夫推举',
  'pallof': '帕洛夫', 'turkish get-up': '土耳其起立', 'farmers walk': '农夫行走',
  'farmer walk': '农夫行走', 'farmer': '农夫', 'step-up': '登阶', 'step up': '登阶',
  'box jump': '跳箱', 'wall sit': '靠墙静蹲', 'superman': '超人式', 'bird dog': '鸟狗式',
  'dead bug': '死虫式', 'rollout': '健腹轮推出', 'rollerout': '健腹轮推出',
  'roll out': '滚动推出', 'nordic curl': '北欧腘绳弯举', 'nordic': '北欧式',
  'drag curl': '拖拽弯举', 'spider curl': '蜘蛛弯举', 'preacher curl': '牧师凳弯举',
  'concentration curl': '集中弯举', 'hammer curl': '锤式弯举', 'zottman': '佐特曼',
  'high curl': '高位弯举', 'face pull': '面拉', 'pull apart': '扩胸', 'kayak': '皮划艇',
  'scapula push-up': '肩胛俯卧撑', 'scapula push up': '肩胛俯卧撑',
  'scapula dips': '肩胛臂屈伸', 'scapular pull-up': '肩胛引体', 'scapula': '肩胛',
  'scapular': '肩胛', 'push sit-up': '推手仰卧起坐', 'rope climb': '爬绳',
  'climb': '攀爬', 'climber': '攀爬', 'sprint': '冲刺', 'sprints': '冲刺', 'run': '跑',
  'runners': '跑者', 'march': '踏步', 'walk': '行走', 'walking': '行走', 'jog': '慢跑',
  'hop': '单脚跳', 'hops': '跳', 'jump': '跳', 'jumps': '跳', 'skip': '跳绳',
  'stretch': '拉伸', 'mobility': '灵活性', 'hold': '静力保持', 'holds': '静力保持',
  'lower body rotation': '下肢旋转', 'handstand push-up': '倒立俯卧撑', 'handstand': '倒立',
  'pike push-up': '屈体俯卧撑', 'pike': '屈体', 'planche': '俄式挺身',
  'front lever': '前水平', 'back lever': '后水平', 'pistol squat': '手枪式深蹲',
  'bulgarian split squat': '保加利亚分腿蹲', 'split squat': '分腿蹲',
  'hack squat': '哈克深蹲', 'sissy squat': '西西里深蹲', 'jump rope': '跳绳',
  'hip abduction': '髋外展', 'hip adduction': '髋内收', 'hip flexor': '髋屈肌',
  'hip lift': '提臀', 'hip extension': '髋伸展', 'archer': '弓箭手式',
  'typewriter': '打字机式', 'hollow': '屈体收腹', 'finger curls': '指弯举',
  'finger': '手指', 'leg press': '蹬腿', 'side bend': '侧屈', 'bend': '屈',
  'bends': '屈', 'pushdown': '下压', 'push down': '下压', 'pull-in': '夹拉',
  'crossover': '绳索夹胸', 'crossovers': '绳索夹胸', 'slam': '砸',
  'skin the cat': '翻皮猫', 'stalder': '回环', 'curtsy lunge': '交叉侧弓步',
  'curtsey lunge': '交叉侧弓步', 'curtsy': '交叉侧', 'curtsey': '交叉侧',
  'bear crawl': '熊爬', 'crab walk': '蟹行', 'crab': '螃蟹式', 'bear': '熊式',
  'inchworm': '尺蠖爬行', 'cobra': '眼镜蛇式', 'sphinx': '狮身人面式',
  'cat': '猫式', 'cow': '牛式', 'downward dog': '下犬式', 'upward dog': '上犬式',
  'dog': '犬式', 'flutter kicks': '打水踢腿', 'flutter': '打水', 'scissor': '剪刀',
  'wipers': '雨刷式', 'janda': '扬达', 'cocoon': '茧式卷腹', 'cocoons': '茧式卷腹',
  'frog': '蛙式', 'windmill': '风车式', 'butterfly': '蝴蝶式', 'gorilla': '大猩猩式',
  'monster': '怪物式', 'pirate': '海盗式', 'maltese': '马耳他式', 'iron cross': '铁十字',
  'around the world': '环游世界', 'korean': '韩式', 'hindu': '印度式',
  'prisoner': '囚徒式', 'frankenstein': '科学怪人式', 'skater': '滑冰式',
  'swimmer': '游泳式', 'cossack squat': '哥萨克深蹲', 'cossack': '哥萨克式',
  'guillotine': '断头台式', 'zercher': '泽奇式', 'jefferson': '杰斐逊式',
  'pendlay': '潘德拉式', 'bradford': '布拉德福德式', 'arnold press': '阿诺德推举',
  'arnold': '阿诺德式', 'french press': '法式推举', 'tate press': '泰特推举',
  'tate': '泰特', 'svend press': '斯文德夹胸', 'svend': '斯文德', 'goblet': '高脚杯式',
  'cuban press': '古巴推举', 'cuban': '古巴式', 'otis press': '奥蒂斯推举',
  'jm press': 'JM推举', 'jm': 'JM', 'pin press': '钉压推举', 'pin': '钉式',
  'skull press': '仰卧臂屈伸', 'skullcrusher': '仰卧臂屈伸', 'skull crusher': '仰卧臂屈伸',
  'crusher': '臂屈伸', 'skull': '碎颅式', 'gironda': '吉龙达式', 'scott': '斯科特式',
  'rocky': '洛奇式', 'thibaudeau': '蒂博多式', 'impossible': '不可能式',
  'seesaw': '跷跷板式', 'elevator': '电梯式', 'cyclist': '骑行式', 'cycle': '骑行',
  'boxing': '拳击式', 'tennis': '网球式', 'judo': '柔道式', 'yoga': '瑜伽式',
  'ski': '滑雪式', 'skier': '滑雪式', 'human flag': '人体旗帜', 'flag': '旗帜',
  'gravity': '重力式', 'figure': '八字式', 'caster': '万向轮式', 'pirouette': '旋转',
  'staircase': '楼梯式', 'star': '星形式', 'spell': '拼写式', 'clock': '时钟式',
  'bowling': '保龄球式', 'stabilization': '稳定', 'stability': '稳定', 'squeeze': '挤压',
  'pass': '传递', 'catch': '接', 'release': '释放', 'drive': '蹬伸', 'flip': '翻转',
  'lift': '举', 'lifting': '提拉', 'carry': '行走', 'hug': '抱膝', 'kick': '踢',
  'kicks': '踢腿', 'tap': '点', 'reach': '够伸', 'reaches': '够伸', 'touch': '触',
  'touchers': '触地', 'circle': '绕环', 'circles': '绕环', 'circular': '绕环',
  'rocking': '摇摆', 'rotate': '旋转', 'slide': '滑动', 'crawl': '爬行',
  'lean away': '侧倾', 'lean': '倾斜', 'support': '支撑', 'supported': '托胸式',
  'chest supported': '托胸式', 'against': '靠', 'above': '上方', 'between': '之间',
  'potty': '如厕式', 'posterior': '后侧', 'pelvic tilt': '骨盆倾斜', 'pelvic': '骨盆',
  'tilt': '倾斜', 'flexion': '屈曲', 'extension': '屈伸', 'rotation': '旋转',
  'abduction': '外展', 'adduction': '内收', 'retractor': '后缩', 'depressor': '降肌',
  'sequen': '序列',
  // 部位兜底
  'hip': '髋', 'hips': '髋', 'wrist': '腕', 'wrists': '腕', 'neck': '颈', 'back': '背',
  'chest': '胸', 'pec': '胸肌', 'shoulder': '肩', 'shoulders': '肩', 'leg': '腿',
  'legs': '腿', 'arm': '臂', 'arms': '臂', 'thigh': '大腿', 'foot': '足', 'feet': '双足',
  'toe': '脚尖', 'toes': '脚尖', 'heel': '脚跟', 'heels': '脚跟', 'calf': '小腿',
  'calves': '小腿肌', 'shin': '胫前', 'tibialis': '胫前肌', 'peroneals': '腓骨肌',
  'glute': '臀', 'glutes': '臀肌', 'gluteus': '臀肌', 'piriformis': '梨状肌',
  'hamstring': '腘绳肌', 'hamstrings': '腘绳肌', 'quad': '股四头', 'quads': '股四头',
  'ab': '腹', 'abs': '腹', 'elbow': '肘', 'elbows': '肘', 'knee': '膝', 'keens': '膝',
  'knees': '膝', 'ankle': '踝', 'ankles': '踝', 'bicep': '二头', 'biceps': '二头',
  'tricep': '三头', 'triceps': '三头', 'delt': '三角肌', 'deltoid': '三角肌',
  'adductor': '内收肌', 'adductors': '内收肌', 'abductor': '外展肌',
  'abductors': '外展肌', 'oblique': '腹斜肌', 'obliques': '腹斜肌',
  'pectorals': '胸肌', 'pectoralis': '胸肌', 'rectus femoris': '股直肌',
  'groin': '腹股沟', 'body': '身体', 'lower body': '下肢', 'upper body': '上肢',
  'head': '头', 'buttock': '臀',
  // 位置 / 方位
  'low row': '低位划船', 'high row': '高位划船', 'lateral high row': '侧向高位划船',
  'vertical row': '垂直划船', 'high bar': '高杠位', 'low bar': '低杠位',
  'vertical bar': '竖杠', 'high parallel bars': '高位双杠', 'on parallel bars': '双杠上',
  'dip cage': '臂屈伸架', 'pull-up cage': '引体架', 'dip-pull-up': '臂屈伸引体',
  'straight bar': '直杠', 'on the wall': '靠墙', 'against wall': '扶墙',
  'with hands against wall': '双手扶墙', 'hands behind head': '双手抱头',
  'on box': '箱上', 'on knee': '膝上', 'on a': '置于', 'over a bench': '越过凳沿',
  'knees off ground': '膝离地', 'leg straight': '直腿', 'leg extended': '伸腿',
  'arms extended': '直臂', 'outstretched': '伸展', 'tennis ball': '网球',
  'staircase': '楼梯式', 'platform': '平台', 'upright': '直立',
  // 动作补充
  'rear lateral raise': '俯身侧平举', 'rear fly': '后束飞鸟', 'rear lunge': '后撤弓步',
  'rear pulldown': '颈后下拉', 'rear pull-up': '颈后引体向上', 'rear drive': '后蹬',
  'rear deltoid': '三角肌后束', 'sumo high pull': '相扑高位拉', 't-bar row': 'T杠划船',
  'reverse t-bar row': '反向T杠划船', 't bar': 'T杠', 't-bar': 'T杠',
  'one leg press': '单腿蹬腿', 'rack pull': '架上硬拉', 'drop jump': '跳深',
  'drop push up': '下落俯卧撑', 'russian twists': '俄罗斯转体', 'toe touch': '触脚尖',
  'turkish get up': '土耳其起立', 'get up': '起立', 'bent press': '弯身推举',
  'squat jerk': '下蹲挺', 'jerk': '挺举', 'chest push': '胸推', 'chest throw': '胸前抛',
  'pass through': '穿过', 'extended range': '超程', 'full can': '罐式',
  'around world': '绕环', 'w-press': 'W推举', 'flexion leg sit up': '屈腿仰卧起坐',
  'side bent': '侧屈', 'hip raise': '提髋', 'high knees': '高抬膝', 'high knee': '高抬膝',
  'cross trainer': '椭圆机', 'elliptical cross trainer': '椭圆机', 'body saw': '身体锯式',
  'saw': '锯式', 'cable rope': '龙门架绳索', 'bent arm': '屈臂', 'bent arms': '屈臂',
  'bent knee': '屈膝', 'bent knees': '屈膝', 'knees bent': '屈膝', 'knee bent': '屈膝',
  'one hand': '单手', 'palm in': '掌心相对', 'palms in': '掌心相对', 'palm-in': '掌心相对',
  'palm up': '掌心向上', 'sz': 'SZ', 'pectoralis major': '胸大肌', 'sternum': '胸骨',
  'lateral throw down': '侧甩落', 'throw down': '甩落', 'fixed back': '背后固定',
  'arms apart': '分臂', 'hands clasped': '双手合十', 'hands reversed clasped': '双手反合',
  'clasped': '合十', 'hands': '手', 'hand': '手',
  // 单词兜底
  'horizontal': '水平', 'vertical': '垂直', 'parallel': '平行', 'bicycle': '蹬车',
  'fixed': '固定', 'low': '低位', 'high': '高位', 'rear': '后', 'revers': '反向',
  'romanian': '罗马尼亚', 'speed': '速度', 'step': '踏步', 'stepbox': '跳箱',
  'bent': '屈', 'drop': '下落', 'clap': '击掌', 'diamond': '菱形', 'donkey': '驴式',
  'tuck': '团身', 'around': '绕环', 'motion': '摆动', 'can': '罐式', 'raised': '抬起',
  'single': '单', 'straight': '直', 'wall': '墙', 'extended': '伸展', 'pose': '式',
  'balance': '平衡', 'concentration': '集中', 'neutral': '对握', 'lat': '背阔肌',
  'pull-ups': '引体向上', 'chin-ups': '反手引体向上', 'chin': '反手引体',
  'side-to-side': '左右交替', 'swing': '摆动', 'janda': '扬达', 'reps': '次',
  'response': '反弹', 'multiple': '多次', 'spine': '脊柱', 'hack': '哈克式',
  'spider': '蜘蛛式', 'pistol': '手枪式', 'abdominal': '腹部', 'fallout': '展体',
  'equipment': '器械', 'sequence': '序列', 'big toe': '大脚趾', 'left': '左',
  'cross-over': '绳索交叉', 'ez bar': '曲杆', 'ez-bar': '曲杆', 'throw': '抛',
  'range': '幅度', 'upward facing dog': '上犬式', 'facing': '朝',
  'degrees': '度', '45 degrees': '45度', 'closer': '靠近', 'angled': '斜角',
  'stride': '步幅', 'sledge': '雪橇', 'world': '世界', 'greatest': '最伟大',
  'plus': '加强', 'into': '接', 'off': '离', 'upright row': '直立划船',
  'y': 'Y', 'w': 'W', 'v': 'V', 't': 'T', 'l': 'L', 'a': '',
  // 连接词 / 兜底
  'the': '', 'of': '', 'to': '至', 'and': '并', 'with': '配', 'in': '于', 'from': '自',
  'on': '上', 'up': '上', 'down': '下', 'over': '过', 'under': '下', 'both': '双',
  'double': '双', 'three': '三', 'two': '双', 'one': '单', 'backward': '后',
  'forward': '前', 'apart': '分开', 'away': '离', 'press': '推举', 'presses': '推举',
  'curl': '弯举', 'curls': '弯举', 'pull': '拉', 'push': '推', 'ball': '球',
  'bars': '杠', 'bar': '杠', 'muscle': '肌', 'positions': '姿', 'position': '姿',
  'sit': '坐起',
};

// ── 整名精确覆盖（规则译不好的特例）──
const OVERRIDES = {
  '3/4 sit-up': '3/4 仰卧起坐',
  'dumbbell lying on floor rear delt raise': '哑铃俯卧后束平举',
  'dumbbell lying rear delt row': '哑铃俯卧后束划船',
  'dumbbell lying extension (across face)': '哑铃仰卧过脸三头屈伸',
  'dumbbell waiter biceps curl': '哑铃托壶式二头弯举',
  'rocky pull-up pulldown': '洛奇式引体下拉',
  'cable thibaudeau kayak row': '龙门架皮划艇划船',
  'band assisted wheel rollerout': '弹力带辅助健腹轮',
  'band one arm single leg split squat': '弹力带单臂单腿分腿蹲',
  'band single leg reverse calf raise': '弹力带单腿反向提踵',
  'band two legs calf raise - (band under both legs) v. 2': '弹力带双腿提踵（双脚踩带）变式2',
  'band squat row': '弹力带深蹲划船',
  'bodyweight squatting row': '自重深蹲姿划船',
  'suspended row': '悬挂划船',
  'lower back curl': '下背卷屈',
  'scapula dips': '肩胛臂屈伸',
  'tire flip': '翻轮胎',
  'all fours squad stretch': '四点跪姿拉伸',
  'assisted prone lying quads stretch': '辅助俯卧股四头拉伸',
  'back extension on exercise ball': '健身球山羊挺身',
  'arm slingers hanging bent knee legs': '悬垂屈膝摆臂',
  'arm slingers hanging straight legs': '悬垂直腿摆臂',
  'arms apart circular toe touch (male)': '分臂绕环触脚尖(男)',
  'arms overhead full sit-up (male)': '过顶直臂仰卧起坐(男)',
  'assisted motion russian twist': '辅助摆动俄罗斯转体',
  'astride jumps (male)': '跨步跳(男)',
  'back and forth step': '前后来回踏步',
  'back pec stretch': '背部与胸部拉伸',
  'barbell lying back of the head tricep extension': '杠铃仰卧后脑三头屈伸',
  'barbell lying lifting (on hip)': '杠铃仰卧髋上提拉',
  'barbell clean-grip front squat': '杠铃高翻握前蹲',
  'barbell decline close grip to skull press': '杠铃下斜窄握接仰卧臂屈伸',
  'barbell front raise and pullover': '杠铃前平举接仰卧上拉',
  'barbell glute bridge two legs on bench (male)': '杠铃臀桥双脚上凳(男)',
  'barbell high bar squat': '杠铃高杠位深蹲',
  'barbell low bar squat': '杠铃低杠位深蹲',
  'barbell guillotine bench press': '杠铃断头台式卧推',
  'barbell jm bench press': '杠铃JM卧推',
  'barbell full zercher squat': '杠铃全程泽奇式深蹲',
  'barbell jefferson squat': '杠铃杰斐逊式深蹲',
  'air bike': '风阻单车',
  'balance board': '平衡板',
  // 第二批特例
  'ez-barbell standing wide grip biceps curl': '曲杆杠铃站姿宽握二头弯举',
  'ez barbell': '曲杆杠铃', 'ez-barbell': '曲杆杠铃',
  'butt-ups': '提臀卷腹', 'bottoms-up': '倒握',
  'bench pull-ups': '凳上引体向上', 'l-pull-up': 'L支撑引体向上',
  'dumbbell incline breeding': '哑铃上斜屈体',
  'dumbbell lying femoral': '哑铃仰卧腿弯举',
  'dumbbell lying one arm deltoid rear': '哑铃俯卧单臂后束平举',
  'dumbbell lying single extension': '哑铃仰卧单臂屈伸',
  'dumbbell around pullover': '哑铃绕环仰卧上拉',
  'exercise ball alternating arm ups': '健身球交替举臂',
  'ez bar lying bent arms pullover': '曲杆仰卧屈臂上拉',
  'ez barbell decline close grip face press': '曲杆下斜窄握面压推举',
  'front lever reps': '前水平',
  'gironda sternum chin': '吉龙达式胸骨引体',
  'glute-ham raise': '臀腘挺身',
  'hands bike': '手摇单车',
  'hands clasped circular toe touch (male)': '双手合十绕环触脚尖(男)',
  'hands reversed clasped circular toe touch (male)': '双手反合绕环触脚尖(男)',
  'hanging straight twisting leg hip raise': '悬垂直腿转体举髋',
  'high knee against wall': '扶墙高抬膝',
  'hyght dumbbell fly': '哑铃高位飞鸟',
  'incline push-up (on box)': '上斜俯卧撑(箱上)',
  'jack burpee': '开合波比跳', 'jack jump (male)': '开合跳(男)',
  'kick out sit': '踢腿坐起',
  'kettlebell pirate supper legs': '壶铃海盗式举腿',
  'kettlebell extended range one arm press on floor': '壶铃地面超程单臂推举',
  'kettlebell turkish get up (squat style)': '壶铃土耳其起立(深蹲式)',
  'left hook. boxing': '左摆拳(拳击)',
  'lever gripper hands': '固定器械握力训练',
  'london bridge': '伦敦桥式',
  'low glute bridge on floor': '地面低位臀桥',
  'march sit (wall)': '靠墙踏步静蹲',
  'medicine ball chest push multiple response': '药球胸推多次反弹',
  'medicine ball chest push single response': '药球胸推单次反弹',
  'otis up': '奥蒂斯式上举',
  'pelvic tilt into bridge': '骨盆倾斜接桥式',
  'posterior step to overhead reach': '后撤步过顶够伸',
  'push-up close-grip off dumbbell': '窄握哑铃俯卧撑',
  'push-up (wall)': '靠墙俯卧撑', 'push-up (wall) v. 2': '靠墙俯卧撑变式2',
  'rear decline bridge': '后侧下斜桥式',
  'reclining big toe pose with rope': '仰卧手抓大脚趾式(配绳索)',
  'reverse hyper extension (on stability ball)': '反向山羊挺身(瑞士球上)',
  'reverse hyper on flat bench': '平凳反向山羊挺身',
  'roller seated shoulder flexor depresor retractor': '泡沫轴坐姿肩部灵活激活',
  'roller seated single leg shoulder flexor depresor retractor': '泡沫轴坐姿单腿肩部灵活激活',
  'run (equipment)': '跑(器械)',
  'seated wide angle pose sequence': '坐姿宽角前屈序列',
  'single leg squat (pistol) male': '单腿深蹲(手枪式)(男)',
  'ski step': '滑雪式踏步',
  'sled closer hack squat': '雪橇窄距哈克深蹲',
  'sled forward angled calf raise': '雪橇前倾提踵',
  'sledge hammer': '大铁锤',
  'standing calf raise (on a staircase)': '站姿提踵(楼梯上)',
  'cable standing up straight crossovers': '龙门架站姿直臂绳索夹胸',
  'cable wide grip rear pulldown behind neck': '龙门架宽握颈后下拉',
  'chest dip on straight bar': '直杠胸臂屈伸',
  'chest dip (on dip-pull-up cage)': '胸臂屈伸(臂屈伸引体架上)',
  'weighted close grip chin-up on dip cage': '负重窄握引体向上(臂屈伸架上)',
  'weighted triceps dip on high parallel bars': '负重三头臂屈伸(高位双杠)',
  'wide-grip chest dip on high parallel bars': '宽握胸臂屈伸(高位双杠)',
  'weighted round arm': '负重臂绕环',
  'wind sprints': '变速冲刺跑',
  'world greatest stretch': '世界最伟大拉伸',
  'wrist rollerer': '腕滚轮',
  'barbell squat jump step rear lunge': '杠铃深蹲跳接后撤弓步',
  'cycle cross trainer': '椭圆骑行训练',
  'walk elliptical cross trainer': '椭圆机行走',
  'walking on stepmill': '登山机行走',
  'swing 360': '360度摆动',
  'bodyweight drop jump squat': '自重落地深蹲跳',
};

// ── 翻译实现 ──
function preprocess(name) {
  return name
    .replace(/ v\. (\d+)/g, ' 变式$1')
    .replace(/\((back|side|front) pov\)/g, (m, d) => `(${d === 'back' ? '背' : d === 'side' ? '侧' : '正'}视角)`)
    .replace(/\(female\)/g, '(女)')
    .replace(/\(male\)/g, '(男)');
}

const phraseList = Object.entries(PHRASES).sort((a, b) => b[0].length - a[0].length);

function translate(name) {
  const s = preprocess(name.toLowerCase());
  let out = '';
  let i = 0;
  while (i < s.length) {
    let matched = false;
    for (const [en, zh] of phraseList) {
      if (!s.startsWith(en, i)) continue;
      // 词边界：前一个字符不能是字母（避免匹配词中间），后一个字符同样
      const beforeOk = i === 0 || !/[a-z]/.test(s[i - 1]);
      const afterIdx = i + en.length;
      const afterOk = afterIdx >= s.length || !/[a-z]/.test(s[afterIdx]);
      if (!beforeOk || !afterOk) continue;
      out += zh;
      i += en.length;
      matched = true;
      break;
    }
    if (!matched) {
      out += s[i];
      i++;
    }
  }
  return out;
}

// 中文之间的空格折叠
function tidy(zh) {
  return zh
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/([\u4e00-\u9fff])\s+(?=[\u4e00-\u9fff])/g, '$1')
    .replace(/([\u4e00-\u9fff])\s+(?=[A-Z]字)/g, '$1')
    .replace(/([\u4e00-\u9fff])\s+(?=[（(])/g, '$1')
    .replace(/([)）])\s*(?=[\u4e00-\u9fff])/g, '$1');
}

// ── 生成动作名映射 ──
const names = {};
const problems = [];
for (const ex of data) {
  if (OVERRIDES[ex.name]) { names[ex.id] = OVERRIDES[ex.name]; continue; }
  const zh = tidy(translate(ex.name));
  names[ex.id] = zh;
  if (/[a-z]/.test(zh)) problems.push(`${ex.id}\t${ex.name}\t=>\t${zh}`);
}

// ── 输出 ──
const out = { values: VALUES, names };
const js = '// 本文件由 i18n/build-zh-data.cjs 生成，请勿手改；改词库后重新运行生成脚本。\n' +
  'window.__ZH_DATA__ = ' + JSON.stringify(out) + ';\n';
fs.writeFileSync(path.join(__dirname, 'zh-data.js'), js, 'utf8');

console.log(`translated: ${Object.keys(names).length}`);
console.log(`residual-english problems: ${problems.length}`);
if (problems.length) console.log(problems.join('\n'));
