// グリーンベイ ソーシャルギフト特集
(function () {
  'use strict';

  var ITEM_BASE = 'https://item.rakuten.co.jp/manuka/';
  var GIFT_QUERY = '/?gift=social'; // ソーシャルギフト購入への導線

  // いずれも isSocialGift:true を確認済み(2026/11/5)。店舗の対応商品はこの4点のみ
  var ITEMS = [
    { id: 'pm08', say: '最近どう？<br>元気にしてる？', who: 'はじめて贈るなら', name: 'マヌカハニー', umf: '8', mgo: 'MG180+', price: '3,980' },
    { id: 'gb10', say: 'いつもありがとう。<br>体に気をつけてね', who: '離れて暮らす家族に', name: 'プレミアムマヌカハニー', umf: '10', mgo: 'MGO261+', price: '4,930' },
    { id: 'gb15', say: 'お世話になりました。<br>どうぞお元気で', who: 'お世話になった方に', name: 'プレミアムマヌカハニー', umf: '15', mgo: 'MGO512+', price: '5,980' },
    { id: 'gb20', say: 'いつまでも<br>元気でいてね', who: '特別な節目に', name: 'プレミアムマヌカハニー', umf: '20', mgo: 'MGO826+', price: '9,480' }
  ];

  // FVのスマホ内で流す会話
  var CHATS = [
    { to: 'お母さん', time: '19:30', say: '寒くなってきたね。<br>元気にしてる？<br>体に気をつけてね😊', img: 'gb10', reply: 'ありがとう！<br>毎朝ひとさじ食べるね😊' },
    { to: '佐藤先輩', time: '20:15', say: '先日はありがとうございました。<br>お忙しそうですが<br>お元気ですか？', img: 'gb15', reply: 'わざわざありがとう！<br>これ気になってたやつ😊' },
    { to: 'ゆか', time: '21:05', say: '誕生日おめでとう🎂<br>最近どう？元気？<br>いいはちみつ見つけたよ🍯', img: 'pm08', reply: 'うれしい！<br>さっそく朝ごはんに😂' }
  ];

  var TIMING = { typing: 900, gift: 900, reply: 1100, hold: 2800 };

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.add('js');

  function el(tag, cls, html) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (html) node.innerHTML = html;
    return node;
  }

  function itemCard(item) {
    var a = el('a', 'item reveal');
    a.href = ITEM_BASE + item.id + GIFT_QUERY;
    a.innerHTML =
      '<p class="item-say">' + item.say + '</p>' +
      '<div class="item-img"><img src="img/' + item.id + '.jpg" alt="' + item.name + ' UMF' + item.umf + '+" width="640" height="640" loading="lazy"></div>' +
      '<div class="item-body">' +
        '<p class="item-who">' + item.who + '</p>' +
        '<p class="item-umf"><span>UMF</span><b>' + item.umf + '+</b></p>' +
        '<p class="item-name">' + item.name + '<br>' + item.mgo + ' 250g</p>' +
        '<p class="item-price"><b>' + item.price + '</b>円</p>' +
      '</div>';
    return a;
  }

  function renderItems() {
    var list = document.getElementById('itemList');
    ITEMS.forEach(function (item) { list.appendChild(itemCard(item)); });
  }

  function giftBubble(c) {
    return el('div', 'msg-gift',
      '<img src="img/' + c.img + '.jpg" alt="">' +
      '<p>マヌカハニーのギフトが届きました</p><span>ギフトを受け取る</span>');
  }

  function showChatStatic(chat, c) {
    chat.appendChild(el('div', 'msg msg-me', c.say));
    chat.appendChild(giftBubble(c));
    chat.appendChild(el('div', 'msg msg-you', c.reply));
  }

  function startChat() {
    var chat = document.getElementById('chat');
    var name = document.getElementById('chatName');
    var time = document.getElementById('chatTime');
    var index = 0;

    if (reduceMotion) { showChatStatic(chat, CHATS[0]); return; }

    function play() {
      var c = CHATS[index];
      index = (index + 1) % CHATS.length;
      chat.innerHTML = '';
      name.textContent = c.to;
      time.textContent = c.time;
      var typing = el('div', 'typing', '<i></i><i></i><i></i>');
      chat.appendChild(typing);
      setTimeout(function () {
        chat.removeChild(typing);
        chat.appendChild(el('div', 'msg msg-me', c.say));
      }, TIMING.typing);
      setTimeout(function () { chat.appendChild(giftBubble(c)); }, TIMING.typing + TIMING.gift);
      setTimeout(function () { chat.appendChild(el('div', 'msg msg-you', c.reply)); },
        TIMING.typing + TIMING.gift + TIMING.reply);
      setTimeout(play, TIMING.typing + TIMING.gift + TIMING.reply + TIMING.hold);
    }
    play();
  }

  function startReveal() {
    var nodes = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      nodes.forEach(function (n) { n.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        io.unobserve(e.target);
      });
    }, { threshold: 0.12 });
    nodes.forEach(function (n) { io.observe(n); });
  }

  function startFloatCta() {
    var cta = document.getElementById('floatCta');
    var fv = document.querySelector('.fv');
    var foot = document.querySelector('.foot');
    function update() {
      var pastFv = window.scrollY > fv.offsetHeight * 0.6;
      var atFoot = foot.getBoundingClientRect().top < window.innerHeight;
      cta.classList.toggle('show', pastFv && !atFoot);
    }
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  var CAMPAIGN_END = new Date('2026-12-01T09:59:00+09:00');
  var DAY_MS = 86400000;
  var HOUR_MS = 3600000;
  var MINUTE_MS = 60000;
  var SECOND_MS = 1000;

  function pad(n) { return (n < 10 ? '0' : '') + n; }

  function countdownHtml(remain) {
    var days = Math.floor(remain / DAY_MS);
    var hours = Math.floor((remain % DAY_MS) / HOUR_MS);
    var minutes = Math.floor((remain % HOUR_MS) / MINUTE_MS);
    var seconds = Math.floor((remain % MINUTE_MS) / SECOND_MS);
    return '<span class="cd-label">終了まで</span>' +
      (days > 0 ? '<b>' + days + '</b>日' : '') +
      '<b>' + pad(hours) + '</b>時間<b>' + pad(minutes) + '</b>分<b>' + pad(seconds) + '</b>秒';
  }

  function startEventCountdown() {
    var left = document.getElementById('eventLeft');
    var timer;
    function tick() {
      var remain = CAMPAIGN_END - new Date();
      if (remain <= 0) {
        left.hidden = true;
        clearInterval(timer);
        return;
      }
      left.innerHTML = countdownHtml(remain);
      left.hidden = false;
    }
    tick();
    timer = setInterval(tick, SECOND_MS);
  }

  renderItems();
  startChat();
  startReveal();
  startFloatCta();
  startEventCountdown();
})();
