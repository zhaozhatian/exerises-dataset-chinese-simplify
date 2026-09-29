/*
 * 汉化包（zh-CN language pack）
 * 用法：在 index.html 的 </body> 前引入：
 *   <script src="./i18n/zh-data.js"></script>
 *   <script src="./i18n/zh-pack.js"></script>
 * 原理：渲染层翻译（MutationObserver 监听 DOM，文本命中词典即替换），
 *       不修改 data/exercises.json 原始数据，不影响 DB Setup 的 SQL 导出。
 * 词典再生成：node i18n/build-zh-data.cjs
 */
(function () {
  'use strict';
  if (!window.__ZH_DATA__) return;

  const VALUES = window.__ZH_DATA__.values || {};
  const NAMES = window.__ZH_DATA__.names || {};

  // ── 界面文字词典（精确匹配文本节点）──
  const UI = {
    'Exercise Library': '动作库',
    'Category': '分类',
    'Equipment': '器械',
    'Target Muscle': '目标肌群',
    'Clear all': '清除全部',
    'No exercises found': '没有找到动作',
    'Instructions': '动作说明',
    'Muscles': '目标肌群',
    'Primary': '主要发力',
    'Secondary': '辅助参与',
    'Body Part': '部位',
    'Target': '目标',
    // 数据库导入面板（开发者工具）
    'DB Setup': '数据库',
    'Database Setup': '数据库导入',
    'Import 1,324 exercises into your database in 3 steps.': '三步将 1,324 个动作导入数据库。',
    'Create Table': '创建数据表',
    'Run this in your database client (SSMS, DBeaver, pgAdmin, etc.)::': '在你的数据库客户端（SSMS、DBeaver、pgAdmin 等）中执行：',
    'Run this in your database client (SSMS, DBeaver, pgAdmin, etc.):': '在你的数据库客户端（SSMS、DBeaver、pgAdmin 等）中执行：',
    'Copy': '复制',
    'Import Data': '导入数据',
    'Generate INSERT SQL': '生成 INSERT SQL',
    'Media Files': '媒体文件',
    'your-server.com/\n├── images/   ← 1,324 JPG thumbnails\n└── videos/   ← 1,324 GIF animations':
      'your-server.com/\n├── images/   ← 1,324 张缩略图\n└── videos/   ← 1,324 张动图',
  };

  // ── 动作名 en→zh（借助页面内嵌的 EXERCISES 全局量建立映射）──
  const EN2ZH = {};
  try {
    if (typeof EXERCISES !== 'undefined') {
      EXERCISES.forEach(function (ex) {
        if (NAMES[ex.id]) EN2ZH[ex.name] = NAMES[ex.id];
      });
    }
  } catch (e) { /* EXERCISES 不可用时跳过，仅界面汉化 */ }

  const DICT = Object.assign({}, VALUES, UI, EN2ZH);

  // ── 动态文本的规则翻译 ──
  const RULES = [
    { re: /^([\d,]+)\s+of\s+([\d,]+)\s+exercises$/, fn: function (m) { return m[1] + ' / ' + m[2] + ' 个动作'; } },
    { re: /^([\d,]+)\s+exercises$/, fn: function (m) { return '共 ' + m[1] + ' 个动作'; } },
    { re: /^\+(\d+)\s+more$/, fn: function (m) { return '还有 ' + m[1] + ' 项'; } },
  ];

  function translateText(text) {
    const trimmed = text.trim();
    if (!trimmed) return null;
    if (Object.prototype.hasOwnProperty.call(DICT, trimmed)) {
      const zh = DICT[trimmed];
      return zh === trimmed ? null : zh;
    }
    for (const r of RULES) {
      const m = trimmed.match(r.re);
      if (m) return r.fn(m);
    }
    return null;
  }

  function translateTextNode(node) {
    const text = node.nodeValue;
    if (!text || !/[A-Za-z]/.test(text)) return; // 无英文直接跳过
    const zh = translateText(text);
    if (zh != null) {
      const lead = text.slice(0, text.length - text.trimStart().length);
      const trail = text.slice(text.trimEnd().length);
      node.nodeValue = lead + zh + trail;
    }
  }

  function walkText(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    // 先收集再处理，避免遍历中修改 DOM
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(translateTextNode);
  }

  // ── 详情弹窗：自动切换到简体中文步骤 ──
  function switchToZhSteps(root) {
    const tabs = root.querySelectorAll ? root.querySelectorAll('.lang-tab') : [];
    for (const btn of tabs) {
      if (btn.textContent === '简体中文') {
        // 已激活就不再点击：click 会触发 renderSteps 重渲染，
        // 重渲染又会被下方 MutationObserver 捕获再次点击，形成死循环卡死页面
        if (!btn.classList.contains('active')) {
          btn.click();
          // 只横向滚动页签条本身把中文页签居中；绝不能用 scrollIntoView——
          // 它会连弹窗面板一起滚，把顶部的动作 GIF 顶出视野
          const bar = btn.closest('.lang-tabs');
          if (bar) {
            const delta = btn.getBoundingClientRect().left - bar.getBoundingClientRect().left;
            const target = bar.scrollLeft + delta - (bar.clientWidth - btn.offsetWidth) / 2;
            bar.scrollLeft = Math.max(0, target);
          }
        }
        break;
      }
    }
  }

  // ── 一次性设置 ──
  document.title = '动作库 ExerciseDB';
  const searchEl = document.getElementById('search');
  if (searchEl) searchEl.placeholder = '搜索动作…';

  // 中文搜索支持：把中文动作名/字段并入搜索索引
  try {
    if (typeof EXERCISES !== 'undefined') {
      EXERCISES.forEach(function (ex) {
        const extra = [NAMES[ex.id], VALUES[ex.category], VALUES[ex.equipment], VALUES[ex.target], VALUES[ex.body_part]]
          .filter(Boolean).join(' ');
        if (extra && ex._idx) ex._idx += ' ' + extra.toLowerCase();
      });
    }
  } catch (e) { /* 忽略 */ }

  // ── MutationObserver：后续渲染的节点持续汉化 ──
  const observer = new MutationObserver(function (mutations) {
    for (const m of mutations) {
      for (const node of m.addedNodes) {
        if (node.nodeType === Node.TEXT_NODE) {
          translateTextNode(node);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          // 弹窗内出现语言标签时，自动切到中文
          if (node.id === 'modal-instructions' || (node.closest && node.closest('#modal-instructions'))) {
            switchToZhSteps(node.closest ? node.closest('#modal-instructions') : node);
          }
          if (node.querySelectorAll && node.querySelector('.lang-tab')) {
            switchToZhSteps(node);
          }
          walkText(node);
        }
      }
      if (m.type === 'characterData' && m.target.nodeType === Node.TEXT_NODE) {
        translateTextNode(m.target);
      }
    }
  });

  // 初始全量 + 开始监听
  walkText(document.body);
  observer.observe(document.body, { childList: true, subtree: true, characterData: true });
})();
