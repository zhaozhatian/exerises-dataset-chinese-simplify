/*
 * 毒舌教练开屏（每天一次）
 * 用法：在 index.html 的 </body> 前引入：
 *   <script src="./splash/splash.js?v=1"></script>
 * 逻辑：localStorage 记录最近展示日期，每天首次访问弹出；
 *       同时统计到访天数，部分文案会带上"第 N 天"。
 * 更新文案/样式后把 ?v= 数字加一。
 */
(function () {
  'use strict';

  var LAST_KEY = 'zhSplash.last';
  var DAYS_KEY = 'zhSplash.days';

  // ── 每天只展示一次 ──
  var d = new Date();
  var today = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
  var last = null, days = 0;
  try {
    last = localStorage.getItem(LAST_KEY);
    days = parseInt(localStorage.getItem(DAYS_KEY), 10) || 0;
  } catch (e) { /* 隐私模式等不可用时：每次都展示 */ }
  if (last === today) return;
  try {
    localStorage.setItem(LAST_KEY, today);
    localStorage.setItem(DAYS_KEY, String(last ? days + 1 : 1));
  } catch (e) { /* 忽略 */ }

  // ── 毒舌文案：标题 + 补刀，{n} 会替换成到访天数 ──
  var QUIPS = [
    { title: '你今天训练了没？', sub: '哟，这是又想起来练练了？这次看你能坚持几天，小趴菜。' },
    { title: '斜方肌天才发来问候', sub: '看看上面这块石头，人家练得比你还勤，你好意思躺着吗？' },
    { title: '杠铃不骗人', sub: '沙发才会骗人——它说"明天再练"，你信了几年了？' },
    { title: '又想放弃了？', sub: '肌肉就是在你想放弃的下一组里长出来的。' },
    { title: '日历都在替你脸红', sub: '昨天推今天，今天推明天，推脱动作倒是练得很熟练。' },
    { title: '今日份借口已拒收', sub: '太累、没时间、明天再说……理由收集完毕，请开始训练。' },
    { title: '变强的公式', sub: '少找一点借口，多流一身汗。今天的汗水，就是明天的腹肌。' },
    { title: '这是你第 {n} 天来', sub: '坚持是最稀缺的天赋——练了才算数，来了不算。' },
    { title: '别跟别人比', sub: '跟昨天的自己比。他躺了一天，你今天练不练？' },
    { title: '小趴菜检测仪已启动', sub: '据观测：你练前的雄心壮志，通常活不过三组。今天证明我错了。' },
  ];
  var FIRST_QUIP = { title: '第一次来？', sub: '欢迎！先把丑话说好：三天打鱼两天晒网的，都叫小趴菜。你打算当哪种？' };
  var BUTTONS = ['行吧，开练！', '今天必练 💪', '让我练给你看', '别拦我，练！', '这就去举铁'];

  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  var quip = last ? pick(QUIPS) : FIRST_QUIP;
  var shownDays = (last ? days + 1 : 1);
  var fill = function (s) { return s.replace('{n}', shownDays); };

  // ── 样式 ──
  var CSS = ''
    + '.zh-splash{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;'
    + 'background:radial-gradient(120% 90% at 50% 10%,rgba(20,20,28,.94),rgba(8,8,12,.98));'
    + '-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);opacity:1;transition:opacity .3s;}'
    + '.zh-splash.closing{opacity:0;}'
    + '.zh-splash-inner{display:flex;flex-direction:column;align-items:center;text-align:center;'
    + 'padding:28px 24px calc(28px + env(safe-area-inset-bottom));max-width:560px;width:100%;}'
    + '.zh-splash-img{width:min(64vw,340px);max-height:44vh;object-fit:contain;border-radius:18px;'
    + 'box-shadow:0 24px 60px rgba(0,0,0,.55),0 0 0 1px rgba(255,255,255,.08);'
    + 'animation:zhImgIn .55s cubic-bezier(.34,1.56,.64,1) both,zhRep 1.8s ease-in-out .6s infinite;}'
    + '.zh-splash-title{margin:26px 0 10px;color:#fff;font-size:clamp(24px,6.5vw,40px);'
    + 'font-weight:900;letter-spacing:.02em;line-height:1.25;'
    + 'animation:zhPop .4s cubic-bezier(.34,1.56,.64,1) .3s both;}'
    + '.zh-splash-sub{margin:0 0 30px;color:rgba(255,255,255,.72);'
    + 'font-size:clamp(15px,4vw,19px);line-height:1.7;max-width:24em;'
    + 'animation:zhPop .4s cubic-bezier(.34,1.56,.64,1) .45s both;}'
    + '.zh-splash-btn{appearance:none;border:none;cursor:pointer;color:#fff;'
    + 'background:#f97316;font-size:clamp(17px,4.5vw,20px);font-weight:800;'
    + 'padding:15px 44px;border-radius:999px;letter-spacing:.04em;'
    + 'box-shadow:0 10px 30px rgba(249,115,22,.4),inset 0 1px 0 rgba(255,255,255,.25);'
    + 'animation:zhPop .4s cubic-bezier(.34,1.56,.64,1) .6s both,zhPulse 2s ease-in-out 1.2s infinite;}'
    + '.zh-splash-btn:active{transform:scale(.95);}'
    + '.zh-splash-foot{margin-top:18px;color:rgba(255,255,255,.35);font-size:12px;'
    + 'animation:zhPop .4s ease .75s both;}'
    + '@keyframes zhImgIn{from{transform:scale(.5) rotate(-8deg);opacity:0;}'
    + 'to{transform:scale(1) rotate(0);opacity:1;}}'
    + '@keyframes zhRep{0%,100%{transform:scale(1,1) translateY(0);}'
    + '35%{transform:scale(.985,1.02) translateY(-7px);}'
    + '65%{transform:scale(1.015,.975) translateY(1px);}}'
    + '@keyframes zhPop{from{transform:translateY(14px) scale(.94);opacity:0;}'
    + 'to{transform:translateY(0) scale(1);opacity:1;}}'
    + '@keyframes zhPulse{0%,100%{box-shadow:0 10px 30px rgba(249,115,22,.4),inset 0 1px 0 rgba(255,255,255,.25);}'
    + '50%{box-shadow:0 10px 38px rgba(249,115,22,.65),inset 0 1px 0 rgba(255,255,255,.25);}}'
    + '@media (prefers-reduced-motion:reduce){.zh-splash-img,.zh-splash-title,.zh-splash-sub,'
    + '.zh-splash-btn,.zh-splash-foot{animation:none;}}'
    + '@media (max-width:480px){.zh-splash-img{width:min(72vw,300px);}'
    + '.zh-splash-title{margin-top:22px;}}';
  var style = document.createElement('style');
  style.textContent = CSS;
  document.head.appendChild(style);

  // ── DOM ──
  var overlay = document.createElement('div');
  overlay.className = 'zh-splash';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', '今日毒舌');
  overlay.innerHTML = ''
    + '<div class="zh-splash-inner">'
    + '  <img class="zh-splash-img" src="./splash/coach.jpg?v=2" alt="斜方肌天才教练" decoding="async">'
    + '  <h2 class="zh-splash-title"></h2>'
    + '  <p class="zh-splash-sub"></p>'
    + '  <button class="zh-splash-btn" type="button"></button>'
    + '  <div class="zh-splash-foot">每天只毒舌一次 · 明天再来挨骂</div>'
    + '</div>';
  overlay.querySelector('.zh-splash-title').textContent = fill(quip.title);
  overlay.querySelector('.zh-splash-sub').textContent = fill(quip.sub);
  overlay.querySelector('.zh-splash-btn').textContent = pick(BUTTONS);
  document.body.appendChild(overlay);

  var prevOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';

  function close() {
    overlay.classList.add('closing');
    document.body.style.overflow = prevOverflow;
    // 过渡结束立即移除；定时器只作兜底（后台标签页会节流定时器）
    overlay.addEventListener('transitionend', function () { overlay.remove(); }, { once: true });
    setTimeout(function () { overlay.remove(); }, 320);
    document.removeEventListener('keydown', onKey);
  }
  function onKey(e) { if (e.key === 'Escape' || e.key === 'Enter') close(); }

  overlay.addEventListener('click', function (e) {
    if (e.target === overlay || e.target.closest('.zh-splash-btn')) close();
  });
  document.addEventListener('keydown', onKey);
  var btn = overlay.querySelector('.zh-splash-btn');
  if (btn && btn.focus) setTimeout(function () { btn.focus({ preventScroll: true }); }, 400);
})();
