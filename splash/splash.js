/*
 * 毒舌教练开屏（每天一次）——炸裂版
 * 用法：在 index.html 的 </body> 前引入：
 *   <script src="./splash/splash.js?v=3"></script>
 * 逻辑：localStorage 记录最近展示日期，每天首次访问弹出；
 *       石头人砸入落地 → 白闪 + 冲击波 + 集中线 + 粒子爆发 + 屏幕震动。
 * 更新文案/样式后把 ?v= 数字加一。
 */
(function () {
  'use strict';

  var LAST_KEY = 'zhSplash.last';
  var DAYS_KEY = 'zhSplash.days';

  // ── 每天只展示一次（URL 带 ?splash=1 可强制弹出预览）──
  var force = /[?&]splash=1/.test(location.search);
  var d = new Date();
  var today = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
  var last = null, days = 0;
  try {
    last = localStorage.getItem(LAST_KEY);
    days = parseInt(localStorage.getItem(DAYS_KEY), 10) || 0;
  } catch (e) { /* 隐私模式等不可用时：每次都展示 */ }
  if (last === today && !force) return;
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

  // 特效无条件全开：系统"减弱动态效果"不再降级（用户要求炸裂效果）

  // ── 样式 ──
  var CSS = ''
    + '.zh-splash{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;'
    + 'background:radial-gradient(120% 90% at 50% 10%,rgba(20,20,28,.94),rgba(8,8,12,.98));'
    + '-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);opacity:1;transition:opacity .3s;}'
    + '.zh-splash.closing{opacity:0;}'
    /* 漫画集中线：落地时点亮 */
    + '.zh-splash-lines{position:absolute;inset:-20%;pointer-events:none;opacity:0;transition:opacity .12s;'
    + 'background:repeating-conic-gradient(from 0deg at 50% 42%,rgba(255,255,255,.07) 0deg 2.5deg,transparent 2.5deg 8deg);}'
    + '.zh-splash-lines.on{opacity:1;transition:opacity .06s;}'
    + '.zh-splash-lines.dim{opacity:.45;transition:opacity .5s;}'
    + '.zh-splash-inner{position:relative;display:flex;flex-direction:column;align-items:center;text-align:center;'
    + 'padding:28px 24px calc(28px + env(safe-area-inset-bottom));max-width:560px;width:100%;}'
    + '.zh-splash.shaking .zh-splash-inner{animation:zhShake .42s linear;}'
    /* 石头人：远处呼啸砸入，落地压扁回弹 */
    + '.zh-splash-img{width:min(64vw,340px);max-height:44vh;object-fit:contain;border-radius:18px;'
    + 'box-shadow:0 24px 60px rgba(0,0,0,.55),0 0 0 1px rgba(255,255,255,.08);'
    + 'animation:zhSlam .5s cubic-bezier(.3,.7,.4,1) both;}'
    + '.zh-splash.img-in .zh-splash-img{animation:zhSlam .5s cubic-bezier(.3,.7,.4,1) both,zhRep 1.8s ease-in-out 1.3s infinite;}'
    + '.zh-splash-title{margin:26px 0 10px;color:#fff;font-size:clamp(24px,6.5vw,40px);'
    + 'font-weight:900;letter-spacing:.02em;line-height:1.25;'
    + 'animation:zhPunch .35s cubic-bezier(.2,1.6,.4,1) .55s both;}'
    + '.zh-splash-sub{margin:0 0 30px;color:rgba(255,255,255,.72);'
    + 'font-size:clamp(15px,4vw,19px);line-height:1.7;max-width:24em;'
    + 'animation:zhPunch .35s cubic-bezier(.2,1.6,.4,1) .68s both;}'
    + '.zh-splash-btn{appearance:none;border:none;cursor:pointer;color:#fff;'
    + 'background:#f97316;font-size:clamp(17px,4.5vw,20px);font-weight:800;'
    + 'padding:15px 44px;border-radius:999px;letter-spacing:.04em;'
    + 'box-shadow:0 10px 30px rgba(249,115,22,.4),inset 0 1px 0 rgba(255,255,255,.25);'
    + 'animation:zhPunch .35s cubic-bezier(.2,1.6,.4,1) .8s both,zhPulse 2s ease-in-out 1.4s infinite;}'
    + '.zh-splash-btn:active{transform:scale(.95);}'
    + '.zh-splash-foot{margin-top:18px;color:rgba(255,255,255,.35);font-size:12px;'
    + 'animation:zhPunch .3s ease .9s both;}'
    + '.zh-splash-flash{position:absolute;inset:0;background:#fff;pointer-events:none;opacity:0;}'
    + '.zh-splash-ring{position:absolute;pointer-events:none;border-radius:50%;'
    + 'border:4px solid rgba(249,115,22,.9);width:60px;height:60px;}'
    + '.zh-splash-particle{position:absolute;pointer-events:none;font-weight:900;line-height:1;}'
    + '@keyframes zhSlam{0%{transform:scale(2.8) rotate(-16deg);opacity:0;}'
    + '55%{opacity:1;}70%{transform:scale(.94) rotate(2deg);}'
    + '85%{transform:scale(1.06) rotate(-1deg);}100%{transform:scale(1) rotate(0);}}'
    + '@keyframes zhShake{0%,100%{transform:translate(0,0);}10%{transform:translate(-9px,5px);}'
    + '20%{transform:translate(8px,-6px);}30%{transform:translate(-7px,-4px);}'
    + '40%{transform:translate(6px,5px);}50%{transform:translate(-5px,2px);}'
    + '60%{transform:translate(4px,-3px);}70%{transform:translate(-3px,2px);}'
    + '80%{transform:translate(2px,-2px);}90%{transform:translate(-1px,1px);}}'
    + '@keyframes zhRep{0%,100%{transform:scale(1,1) translateY(0);}'
    + '35%{transform:scale(.985,1.02) translateY(-7px);}'
    + '65%{transform:scale(1.015,.975) translateY(1px);}}'
    + '@keyframes zhPunch{from{transform:translateY(16px) scale(.7);opacity:0;}'
    + 'to{transform:translateY(0) scale(1);opacity:1;}}'
    + '@keyframes zhPulse{0%,100%{box-shadow:0 10px 30px rgba(249,115,22,.4),inset 0 1px 0 rgba(255,255,255,.25);}'
    + '50%{box-shadow:0 10px 38px rgba(249,115,22,.65),inset 0 1px 0 rgba(255,255,255,.25);}}'
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
    + '<div class="zh-splash-lines"></div>'
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

  // ── 落地爆炸：白闪 + 冲击波环 + 粒子发散弹射 + 屏幕震动 + 集中线 ──
  var IMPACT_AT = 340; // zhSlam 0.5s 里 70% 处落地
  function impact() {
    var img = overlay.querySelector('.zh-splash-img');
    var r = img.getBoundingClientRect();
    var cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    var vw = window.innerWidth, vh = window.innerHeight;
    var dist = Math.min(vw, vh);

    // 白闪
    var flash = document.createElement('div');
    flash.className = 'zh-splash-flash';
    overlay.appendChild(flash);
    var fa = flash.animate([{ opacity: .85 }, { opacity: 0 }], { duration: 220, easing: 'ease-out' });
    if (fa && fa.onfinish !== undefined) fa.onfinish = function () { flash.remove(); };
    else setTimeout(function () { flash.remove(); }, 240);

    // 冲击波环 ×2（橙 + 白，错开）
    [0, 90].forEach(function (delay, i) {
      setTimeout(function () {
        var ring = document.createElement('div');
        ring.className = 'zh-splash-ring';
        if (i === 1) ring.style.borderColor = 'rgba(255,255,255,.8)';
        ring.style.left = cx + 'px'; ring.style.top = cy + 'px';
        overlay.appendChild(ring);
        var ra = ring.animate(
          [{ transform: 'translate(-50%,-50%) scale(.2)', opacity: 1 },
           { transform: 'translate(-50%,-50%) scale(' + (dist / 26) + ')', opacity: 0 }],
          { duration: 620, easing: 'cubic-bezier(.1,.6,.3,1)' });
        if (ra && ra.onfinish !== undefined) ra.onfinish = function () { ring.remove(); };
        else setTimeout(function () { ring.remove(); }, 660);
      }, delay);
    });

    // 粒子发散弹射：emoji + 色点，从图片中心向四周炸开
    var EMOJI = ['💪', '🔥', '⚡', '💥', '🏋️', '😤', '✨'];
    var COLORS = ['#f97316', '#ffffff', '#ec4899', '#facc15'];
    var count = vw < 480 ? 22 : 30;
    for (var i = 0; i < count; i++) {
      var p = document.createElement('span');
      p.className = 'zh-splash-particle';
      var isEmoji = i % 3 !== 2;
      if (isEmoji) { p.textContent = pick(EMOJI); p.style.fontSize = (14 + Math.random() * 18) + 'px'; }
      else {
        p.textContent = '●';
        p.style.color = pick(COLORS);
        p.style.fontSize = (8 + Math.random() * 10) + 'px';
      }
      p.style.left = cx + 'px'; p.style.top = cy + 'px';
      overlay.appendChild(p);
      var ang = Math.random() * Math.PI * 2;
      var radius = dist * (0.28 + Math.random() * 0.45);
      var dx = Math.cos(ang) * radius, dy = Math.sin(ang) * radius - dist * 0.06;
      var rot = (Math.random() * 520 - 260);
      var pa = p.animate(
        [{ transform: 'translate(-50%,-50%) scale(.4)', opacity: 1 },
         { transform: 'translate(-50%,-50%) translate(' + dx + 'px,' + dy + 'px) rotate(' + rot + 'deg) scale(' + (0.8 + Math.random()) + ')', opacity: 0 }],
        { duration: 750 + Math.random() * 650, easing: 'cubic-bezier(.1,.65,.3,1)', delay: Math.random() * 90 });
      if (pa && pa.onfinish !== undefined) (function (node, anim) { anim.onfinish = function () { node.remove(); }; })(p, pa);
      else (function (node) { setTimeout(function () { node.remove(); }, 1500); })(p);
    }

    // 屏幕震动
    overlay.classList.add('shaking');
    setTimeout(function () { overlay.classList.remove('shaking'); }, 450);

    // 集中线：点亮后收暗
    var lines = overlay.querySelector('.zh-splash-lines');
    lines.classList.add('on');
    setTimeout(function () { lines.classList.remove('on'); lines.classList.add('dim'); }, 480);
  }
  if (document.readyState === 'complete') setTimeout(impact, IMPACT_AT);
  else setTimeout(impact, IMPACT_AT + 250); // 图片还在解码时稍微延后，保证砸在已显示的图上

  // ── 关闭 ──
  function close() {
    overlay.classList.add('closing');
    document.body.style.overflow = prevOverflow;
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
  if (btn && btn.focus) setTimeout(function () { btn.focus({ preventScroll: true }); }, 900);
})();
