(() => {
  'use strict';

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  /* =====================================================
     물건 목록 — 이름, 가격, 한 줄 소개는 여기서 고치면 된다
     ===================================================== */
  const ITEMS = [
    { id: 'cutlery', name: '흡혈 식기', price: 14999999, desc: '피를 먹을수록 크고 날카로워지는 포크와 나이프.' },
    { id: 'radio', name: '더넓은 무전기', price: 4999999, desc: '괴담 속에서도 통하는 장난감 무전기.' },
    { id: 'button', name: '우리가 도움!', price: 66666666, desc: "옆면에 작게 '긴급 탈출'이라고 적혀 있다." },
    { id: 'picnic', name: '앨리스 피크닉 세트', price: 11999999, desc: '효과를 2배로 키우는 음료, 절반으로 줄이는 쿠키.' },
    { id: 'snake', name: '은화 뱀', price: 4999999, was: 19999999, desc: '꼬리를 문 뱀이 새겨진 묵직한 은색 동전.' },
    // 여기부터는 가격이 알려지지 않아 임의로 붙인 값이다
    { id: 'bath', name: '혈욕조', price: 49999999, desc: '피를 부으면 향기로운 입욕제가 된다. 10년 무상 A/S.' },
    { id: 'candle', name: '신비한 양초 키트', price: 2999999, desc: '카드 세 장을 태워 만드는 능력 양초. 권장 인원 3인.' },
    { id: 'apple', name: '백설공주의 사과', price: 999999, desc: '한 알을 다 먹으면 다음 날 해가 뜰 때까지 죽은 듯이 잔다.' },
    { id: 'happy', name: '해피 메이커 ★', price: 7999999, star: true, desc: '누르면 들어가는 스틱 주사. 한동안 고통이 사라진다.' },
    { id: 'wrap', name: '포장지 12B357나', price: 1999999, desc: '바코드만 찍힌 친환경 완충 포장지. 방어구.' },
    { id: 'necro', name: '네크로노미콘', price: 33333333, desc: '밀랍으로 봉한 죽음의 서. 속은 한국어 개정판.' },
    { id: 'candy', name: '노스텔지어 캔디 ★', price: 3999999, star: true, desc: '녹는 동안 가장 건강했던 때의 모습으로. 한 번에 석 알까지.' },
  ];
  const BY_ID = Object.fromEntries(ITEMS.map((it) => [it.id, it]));
  const PER_PAGE = 6; // 한 쪽에 보여 줄 물건 수 (12종이면 1, 2쪽)
  const PAGE_COUNT = Math.max(1, Math.ceil(ITEMS.length / PER_PAGE));
  const MAX_QTY = 99;
  const VIP_MIN = 100000000; // 1억 이상 사면 VIP 카드가 온다
  const won = (n) => '₩' + n.toLocaleString('ko-KR');

  /* =====================================================
     픽셀 스프라이트 (글자 하나 = 한 칸, '.' = 투명)
     ===================================================== */
  const FORK = [
    'K.K.K.K', 'KSKSKSK', 'KSKSKSK', 'KSKSKSK', 'KSKSKSK', 'KSSSSSK', 'KSSSSSK', '.KSSSK.', '..KSK..', '..KSK..',
    '..KSK..', '.KSSSK.', '.KSWSK.', '.KSWSK.', '.KSSSK.', '.KSSSK.', '.KSMSK.', '.KSSSK.', '.KMMMK.', '..KKK..',
  ];
  const KNIFE = [
    '...KK.', '..KSWK', '..KSWK', '.KSSWK', '.KSSWK', '.KSSWK', '.KSSWK', '.KSSWK', '.KSSWK', '.KSSK.',
    '..KSK.', '.KMMMK', '.KSSSK', '.KSWSK', '.KSWSK', '.KSSSK', '.KSSSK', '.KSMSK', '.KMMMK', '..KKK.',
  ];
  const BOTTLE = [
    '..KKKK..', '..KCCK..', '..KCCK..', '..KBLK..', '..KBLK..', '.KBBLBK.', 'KBBBLBBK', 'KBWWWWBK', 'KBWXXWBK',
    'KBWWWWBK', 'KBBBBLBK', 'KBBBBLBK', 'KBBBBLBK', 'KBBBBBBK', 'KBBBBBBK', 'KBBBBBBK', 'KBBBBBBK', '.KKKKKK.',
  ];
  const BASKET = [
    '...........', '...........', '...........', '...........', '...KKKKK...', '..KUUUUUK..', '.KUKKKKKUK.',
    '.KUK...KUK.', '.KUK...KUK.', 'KRPRPRPRPRK', 'KPRPRPRPRPK', 'KKKKKKKKKKK', 'KUTUTUTUTUK', 'KTUTUTUTUTK',
    'KUTUTUTUTUK', '.KTUTUTUTK.', '.KUTUTUTUK.', '.KKKKKKKKK.',
  ];

  const SPRITES = {
    alien: {
      pal: { K: '#1b2a66', G: '#5ad66c', L: '#b4f7a8', D: '#2f9e4c', E: '#10101e', W: '#ffffff', M: '#1f6a36' },
      map: [
        '......KKKKKK......',
        '....KKGGGGGGKK....',
        '...KGGLLLGGGGGK...',
        '..KGLLLGGGGGGGGK..',
        '.KGLLGGGGGGGGGGGK.',
        '.KGLGGGGGGGGGGGGK.',
        'KGGGGGGGGGGGGGGGGK',
        'KGEEEGGGGGGGGEEEGK',
        'KGEEEEEGGGGEEEEEGK',
        'KGEWWEEGGGGEEWWEGK',
        'KGGEEEEGGGGEEEEGGK',
        '.KGGEEGGGGGGEEGGK.',
        '.KGGGGGGGGGGGGGGK.',
        '..KGGGGGMMGGGGGK..',
        '...KDGGGGGGGGDK...',
        '....KKDGGGGDKK....',
        '......KKKKKK......',
      ],
    },
    ufo: {
      pal: { K: '#1d4a1a', L: '#e6ffd9', G: '#6fe85a', S: '#f4fff0', A: '#b6e3ab', Y: '#2fe04e' },
      map: [
        '......KKKK......',
        '.....KLLGGK.....',
        '....KLGGGGGK....',
        '..KKKKKKKKKKKK..',
        '.KSSSSSSSSSSSSK.',
        'KAAYAAYAAYAAYAAK',
        '.KAAAAAAAAAAAAK.',
        '..KKKKKKKKKKKK..',
      ],
    },
    astro: {
      pal: { K: '#0a1a5e', W: '#ffffff', S: '#a9bcff', V: '#2350ff', H: '#9bbcff', R: '#ff4d6d' },
      map: [
        '.....KKKKK......',
        '....KWWWWWK.....',
        '...KWWWWWWWK....',
        '...KWVVVVVWK....',
        '...KVHVVVVVK....',
        '...KVVVVVVVK....',
        '...KWVVVVVWK....',
        '..KKWWWWWWWKK...',
        '.KWWSWWRWWSWWK..',
        '.KWKSWWWWWSKWK..',
        '.KK.KWWWWWK.KK..',
        '....KWWSWWK.....',
        '....KWK.KWK.....',
        '....KSK.KSK.....',
        '....KKK.KKK.....',
      ],
    },
    star: {
      pal: { K: '#8a3300', O: '#ff8a1c', Y: '#ffcf3a', L: '#fff4b0' },
      map: [
        '.......K.......',
        '......KOK......',
        '......KOK......',
        '.....KOYOK.....',
        'KKKKKKOYOKKKKKK',
        'KOOOOOYYYOOOOOK',
        '.KOOYYYLYYYOOK.',
        '..KOOYYLYYOOK..',
        '...KOOYYYOOK...',
        '...KOOOYOOOK...',
        '..KOOOOKOOOOK..',
        '..KOOOK.KOOOK..',
        '.KOOK.....KOOK.',
        '.KKK.......KKK.',
      ],
    },
    cutlery: {
      pal: { K: '#24242b', S: '#d5d9df', M: '#8d949e', W: '#ffffff' },
      map: FORK.map((row, i) => row + '..' + KNIFE[i] + '.'),
    },
    radio: {
      pal: { K: '#0c0c10', B: '#2b2b33', D: '#454552', R: '#ff3a3a', L: '#cfe0c6', G: '#8fa58a', M: '#5b5b68' },
      map: [
        '..KK........',
        '..KBK.......',
        '..KBK.......',
        '..KBK.......',
        '..KBK..KK...',
        '..KBK..KBK..',
        '.KKKKKKKKKK.',
        '.KDDDDDDDRK.',
        '.KBBBBBBBBK.',
        '.KBKKKKKKBK.',
        '.KBKLLLLKBK.',
        '.KBKGGGGKBK.',
        '.KBKKKKKKBK.',
        '.KBBBBBBBBK.',
        '.KBMMMMMMBK.',
        '.KBBBBBBBBK.',
        '.KBMMMMMMBK.',
        '.KBBBBBBBBK.',
        '.KBMMMMMMBK.',
        '.KBBBBBBBBK.',
        '..KKKKKKKK..',
      ],
    },
    button: {
      pal: { K: '#151515', R: '#e8302a', L: '#ff9c8f', D: '#9e1a14', H: '#c4c4c4', G: '#8e8e8e', S: '#5c5c5c' },
      map: [
        '......KKKKKKKK......',
        '....KKLLRRRRRRKK....',
        '...KRLRRRRRRRRRRK...',
        '...KRRRRRRRRRRRDK...',
        '..KKDDDDDDDDDDDDKK..',
        'KKHHHHHHHHHHHHHHHHKK',
        'KHHGGGGGGGGGGGGGGHHK',
        'KGGGGGGGGGGGGGGGGGGK',
        'KSGGGGGGGGGGGGGGGGSK',
        'KSSSSSSSSSSSSSSSSSSK',
        'KKKKKKKKKKKKKKKKKKKK',
      ],
    },
    picnic: {
      pal: {
        K: '#1a1420', C: '#c9a46b', B: '#3a6fd8', L: '#9cc0ff', W: '#f5efe0', X: '#c23a3a',
        T: '#7a4f2a', U: '#b07a40', R: '#e23b3b', P: '#ffffff',
      },
      map: BOTTLE.map((row, i) => row + BASKET[i]),
    },
    snake: {
      pal: { K: '#0d0e10', M: '#4a4e53', L: '#6d7379', D: '#34373b' },
      map: [
        '...KKKKKKKKKK...',
        '.KKMMMMMMMMMMKK.',
        '.KMMLLLLLLLLMMK.',
        'KMMLDDDDDDDDDMMK',
        ...Array(11).fill('KMDDDDDDDDDDDDMK'),
        '.KMDDDDDDDDDDMK.',
        '.KKMMMMMMMMMMKK.',
        '...KKKKKKKKKK...',
      ],
    },
    bath: {
      pal: { K: '#1a1a22', W: '#f6f6f8', S: '#c5c9d4', R: '#c4161c', L: '#ff6b6b', D: '#8a0d12', G: '#d4a017' },
      map: [
        '.KKKKKKKKKKKKKKKKKK.',
        'KWWWWWWWWWWWWWWWWWWK',
        'KWRRRRRRRRRRRRRRRRWK',
        'KWRRLRRRRRRRRRDRRRWK',
        '.KKKKKKKKKKKKKKKKKK.',
        '.KWRWWWWWWWWWWWWSSK.',
        '.KWRWWWWWWWWWWWWSSK.',
        '..KRWWWWWWWWWWWSSK..',
        '..KWWWWWWWWWWWWSSK..',
        '...KWWWWWWWWWSSSK...',
        '....KKKKKKKKKKKK....',
        '...KGK........KGK...',
        '...KKK........KKK...',
      ],
    },
    candle: {
      pal: { K: '#1a1420', F: '#ff9d1c', Y: '#fff3a0', A: '#ff5a7a', B: '#4fb7ff', C: '#ffd84a', T: '#7c5cd6', U: '#a58bf0' },
      map: [
        '........F........',
        '.......FYF.......',
        '..F....FYF....F..',
        '.FYF....K....FYF.',
        '..K...KKKKK...K..',
        '.KKK..KCCCK..KKK.',
        '.KAK..KCCCK..KBK.',
        '.KAK..KCCCK..KBK.',
        '.KAK..KCCCK..KBK.',
        '.KAK..KCCCK..KBK.',
        '.KAK..KCCCK..KBK.',
        'KKKKKKKKKKKKKKKKK',
        'KUUUUUUUUUUUUUUUK',
        'KTTTTTTTTTTTTTTTK',
        '.KKKKKKKKKKKKKKK.',
      ],
    },
    apple: {
      pal: { K: '#2a0a0a', R: '#e0202a', L: '#ff8a90', D: '#a3101a', S: '#6b3d16', G: '#3fae3a' },
      map: [
        '........KK....',
        '.......KSKGGK.',
        '..KKKK.KSKGK..',
        '.KRRRRKKSKKKK.',
        'KRLLRRRRRRRRRK',
        'KRLRRRRRRRRRDK',
        'KRLRRRRRRRRRDK',
        'KRRRRRRRRRRRDK',
        'KRRRRRRRRRRDDK',
        'KRRRRRRRRRRDDK',
        '.KRRRRRRRRDDK.',
        '.KRRRRRRRDDDK.',
        '..KRRRRDDDDK..',
        '...KKKKKKKK...',
      ],
    },
    happy: {
      pal: { K: '#1a1420', N: '#b6ff3a', L: '#f4ffc0', P: '#ff9fd8', Q: '#d660a8', M: '#c8ccd4', C: '#7fe0ff' },
      map: [
        '....M....',
        '....M....',
        '...KMK...',
        '..KKKKK..',
        '..KPPPK..',
        '..KQQQK..',
        '..KKKKK..',
        '..KNLNK..',
        '..KNLNK..',
        '..KNLNK..',
        '..KNLNK..',
        '..KNLNK..',
        '..KNLNK..',
        '..KNNNK..',
        '..KKKKK..',
        '..KCCCK..',
        '..KCCCK..',
        '...KKK...',
      ],
    },
    wrap: {
      pal: { K: '#2a2018', P: '#d9c39a', L: '#efe0bf', D: '#b89d6e', W: '#ffffff' },
      map: [
        '..KKKKKKKKKKKKKK..',
        '.KLLLLLLLLLLLLLLK.',
        'KPLPDPLPDPLPDPLPPK',
        'KPDPLPDPLPDPLPDPPK',
        'KPLPDPLPDPLPDPLPPK',
        'KPDPLPDPLPDPLPDPPK',
        'KPLPDPLPDPLPDPLPPK',
        'KPPPPPPPPPPPPPPPPK',
        'KPWWWWWWWWWPPPPPPK',
        'KPWKWKKWKWKPPPPPPK',
        'KPWKWKKWKWKPPPPPPK',
        'KPWWWWWWWWWPPPPPPK',
        'KDDDDDDDDDDDDDDDDK',
        '.KKKKKKKKKKKKKKKK.',
      ],
    },
    necro: {
      pal: { K: '#12090a', R: '#641616', D: '#3a0b0b', L: '#93302a', G: '#c9a227', P: '#e8dcc0' },
      map: [
        '.KKKKKKKKKKKK.',
        'KGLLLLLLLLLGPK',
        'KLRRRRRRRRRRPK',
        'KLRRRRRRRRRRPK',
        'KLRKKRRRRKKRPK',
        'KLRKKRRRRKKRPK',
        'KLRRRRRRRRRRPK',
        'KLRRRRKKRRRRPK',
        'KLRRRRRRRRRRPK',
        'KLRRKKKKKKRRPK',
        'KLRRKDDDDKRRPK',
        'KLRRKDDDDKRRPK',
        'KLRRRKKKKRRRPK',
        'KLRRRRRRRRRRPK',
        'KGRRRRRRRRRGPK',
        'KDDDDDDDDDDDPK',
        '.KKKKKKKKKKKK.',
      ],
    },
    candy: {
      pal: { K: '#2a1418', R: '#e8323c', Y: '#ffd23f', W: '#ffffff', C: '#f6e9ff', V: '#cdb8ea' },
      map: [
        '......KKKKKKKK......',
        'KK..KKRRWWYYRRKK..KK',
        'KCKKRRRWWYYRRWWKKKCK',
        'KCCKRRWWYYRRWWYYKCCK',
        'KVCKRWWYYRRWWYYRKCVK',
        'KCCKWWYYRRWWYYRRKCCK',
        'KCKKWYYRRWWYYRRWKKCK',
        'KK..KKYRRWWYYRKK..KK',
        '......KKKKKKKK......',
      ],
    },
    vip: {
      pal: { K: '#3a2a00', G: '#f5c518', L: '#fff0a0', D: '#c9960a', C: '#8a8f98', S: '#d7dbe2' },
      map: [
        '.KKKKKKKKKKKKKKKKKK.',
        'KLLLLLLLLLLLLLLLLLLK',
        'KLGGGGGGGGGGGGGGGGGK',
        'KGGKKKKGGGGGGGGGGGGK',
        'KGGKSSKGGGGGGGGGGGGK',
        'KGGKCCKGGGGGGGGGGGGK',
        'KGGKKKKGGGGGGGGGGGGK',
        'KGGGGGGGGGGGGGGGGGGK',
        'KGGDDDDDDDDDDDDGGGGK',
        'KGGGGGGGGGGGGGGGGGGK',
        'KGGDDDDDDGGGGGGGGGGK',
        'KDDDDDDDDDDDDDDDDDDK',
        '.KKKKKKKKKKKKKKKKKK.',
      ],
    },
  };

  const spriteCache = {};
  function spriteData(name) {
    if (spriteCache[name]) return spriteCache[name];
    const { map, pal } = SPRITES[name];
    const h = map.length;
    const w = Math.max(...map.map((r) => r.length));
    const cv = document.createElement('canvas');
    cv.width = w;
    cv.height = h;
    const g = cv.getContext('2d');
    map.forEach((row, y) => {
      for (let x = 0; x < row.length; x++) {
        const color = pal[row[x]];
        if (color) {
          g.fillStyle = color;
          g.fillRect(x, y, 1, 1);
        }
      }
    });
    return (spriteCache[name] = { url: cv.toDataURL(), w, h });
  }
  function spriteImg(name) {
    const s = spriteData(name);
    return `<img class="px" src="${s.url}" style="--w:${s.w}" width="${s.w}" height="${s.h}" alt="" draggable="false">`;
  }

  /* =====================================================
     배경: 별, 폭발 말풍선
     ===================================================== */
  function rng(seed) {
    return () => {
      seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const dprNow = () => Math.min(window.devicePixelRatio || 1, 2);

  function drawSky() {
    const hero = $('#hero');
    const cv = $('#sky');
    if (!hero || !cv) return;
    const w = hero.clientWidth;
    const h = hero.clientHeight;
    if (!w || !h) return;
    const dpr = dprNow();
    cv.width = Math.round(w * dpr);
    cv.height = Math.round(h * dpr);
    const g = cv.getContext('2d');
    g.scale(dpr, dpr);
    const R = rng(20261112);

    const bg = g.createRadialGradient(w * 0.55, h * 0.4, 0, w * 0.55, h * 0.4, w * 0.9);
    bg.addColorStop(0, '#0b0b15');
    bg.addColorStop(1, '#020205');
    g.fillStyle = bg;
    g.fillRect(0, 0, w, h);

    const dust = Math.round((w * h) / 55);
    for (let i = 0; i < dust; i++) {
      const x = R() * w;
      const y = R() * h;
      const s = R();
      const r = s < 0.8 ? 0.35 + R() * 0.35 : s < 0.96 ? 0.7 + R() * 0.5 : 1.1 + R() * 0.7;
      const a = s < 0.8 ? 0.25 + R() * 0.5 : 0.6 + R() * 0.4;
      const tint = R();
      g.fillStyle = tint < 0.15 ? `rgba(190,210,255,${a})` : tint < 0.25 ? `rgba(255,236,200,${a})` : `rgba(255,255,255,${a})`;
      g.beginPath();
      g.arc(x, y, r, 0, Math.PI * 2);
      g.fill();
    }

    const glows = Math.round((w * h) / 16000);
    for (let i = 0; i < glows; i++) {
      const x = R() * w;
      const y = R() * h;
      const r = (1 + R() * 1.6) * 2.2;
      const gr = g.createRadialGradient(x, y, 0, x, y, r);
      gr.addColorStop(0, 'rgba(255,255,255,.95)');
      gr.addColorStop(0.25, 'rgba(220,230,255,.5)');
      gr.addColorStop(1, 'rgba(200,220,255,0)');
      g.fillStyle = gr;
      g.beginPath();
      g.arc(x, y, r, 0, Math.PI * 2);
      g.fill();
    }
  }

  function drawBg() {
    const cv = $('#bg');
    if (!cv) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const dpr = dprNow();
    cv.width = Math.round(w * dpr);
    cv.height = Math.round(h * dpr);
    const g = cv.getContext('2d');
    g.scale(dpr, dpr);
    const R = rng(42);
    const n = Math.round((w * h) / 2600);
    for (let i = 0; i < n; i++) {
      const pick = R();
      const s = pick < 0.78 ? 2 : pick < 0.95 ? 3 : 4;
      g.fillStyle = `rgba(255,255,255,${0.45 + R() * 0.55})`;
      g.fillRect(Math.round(R() * w), Math.round(R() * h), s, s);
    }
  }

  function buildBurst() {
    const poly = $('#burstPoly');
    if (!poly) return;
    const cx = 320, cy = 165, rx = 300, ry = 155, inner = 0.66;
    const spikes = [1, 0.8, 0.95, 0.74, 1.05, 0.82, 0.92, 0.72, 1, 0.84, 0.97, 0.76, 1.04, 0.86, 0.9, 0.78, 0.98, 0.8];
    const R = rng(7);
    const n = spikes.length;
    const pts = [];
    for (let i = 0; i < n; i++) {
      const a0 = (i / n) * Math.PI * 2 - Math.PI / 2 + (R() - 0.5) * 0.1;
      const a1 = ((i + 0.5) / n) * Math.PI * 2 - Math.PI / 2;
      pts.push([cx + Math.cos(a0) * rx * spikes[i], cy + Math.sin(a0) * ry * spikes[i]]);
      pts.push([cx + Math.cos(a1) * rx * inner, cy + Math.sin(a1) * ry * inner]);
    }
    poly.setAttribute('points', pts.map((p) => p.map((v) => v.toFixed(1)).join(',')).join(' '));
  }

  function buildTwinkles() {
    const box = $('#twinkles');
    if (!box) return;
    const R = rng(99);
    let html = '';
    for (let i = 0; i < 44; i++) {
      html += `<i class="tw" style="left:${(R() * 100).toFixed(1)}%;top:${(R() * 94).toFixed(1)}%;animation-delay:${(-R() * 3.2).toFixed(2)}s;animation-duration:${(2.2 + R() * 2.6).toFixed(2)}s"></i>`;
    }
    box.innerHTML = html;
  }

  /* =====================================================
     두 페이지가 같이 쓰는 창들 (장바구니, 상세, 주문 완료)
     ===================================================== */
  const OVERLAYS = `
<button class="cart-btn" id="cartBtn" type="button" aria-haspopup="dialog">장바구니 <b id="cartCount">0</b></button>

<div class="modal" id="detail" hidden>
  <div class="dlg" role="dialog" aria-modal="true" aria-labelledby="dName">
    <div class="dlg-bar"><span>물건</span><button class="x" type="button" data-close aria-label="닫기">×</button></div>
    <div class="dlg-body">
      <div class="dlg-ico" id="dIco"></div>
      <div class="dlg-info">
        <span class="tag" id="dTag" hidden>※할인!※</span>
        <span class="star-note" id="dStar" hidden>★ 이전에 샀던 물건 비슷한!</span>
        <h3 id="dName"></h3>
        <p class="dlg-desc" id="dDesc"></p>
        <div class="dlg-price" id="dPrice"></div>
        <div class="stepper" id="dStep">
          <button type="button" data-step="-1" aria-label="하나 빼기">−</button>
          <output id="dQty" aria-live="polite">1</output>
          <button type="button" data-step="1" aria-label="하나 더">+</button>
        </div>
        <button class="buy" id="dBuy" type="button">장바구니에 담기</button>
      </div>
    </div>
  </div>
</div>

<div class="scrim" id="scrim" hidden></div>
<aside class="drawer" id="drawer" role="dialog" aria-modal="true" aria-labelledby="cartTitle" aria-hidden="true">
  <div class="dlg-bar"><span id="cartTitle">장바구니</span><button class="x" type="button" id="cartClose" aria-label="닫기">×</button></div>
  <ul class="cart-list" id="cartList"></ul>
  <p class="cart-empty" id="cartEmpty">텅 비었다</p>
  <div class="cart-foot">
    <div class="total"><span>합계</span><b id="cartTotal">₩0</b></div>
    <button class="buy" id="orderBtn" type="button">주문하기</button>
  </div>
</aside>

<div class="modal" id="done" hidden>
  <div class="dlg dlg-done" role="dialog" aria-modal="true" aria-labelledby="doneTitle">
    <div class="dlg-bar"><span id="doneTitle">주문 완료</span><button class="x" type="button" data-close aria-label="닫기">×</button></div>
    <div class="done-body">
      <div class="done-sky"><div class="done-ufo" data-sprite="ufo"></div></div>
      <p class="done-msg">외계에서 출발했다!</p>
      <p class="done-sum" id="doneSum"></p>
      <div class="done-vip" id="doneVip" hidden><span data-sprite="vip"></span><b>VIP 카드가 배달됐다!</b></div>
      <button class="buy" type="button" data-close>확인</button>
    </div>
  </div>
</div>

<div class="toast" id="toast" role="status" aria-live="polite"></div>`;

  /* =====================================================
     장바구니 상태
     ===================================================== */
  const KEY = 'space-shop-cart-v1';
  let cart = {};
  try {
    const saved = JSON.parse(localStorage.getItem(KEY)) || {};
    for (const [id, q] of Object.entries(saved)) {
      if (BY_ID[id] && Number.isInteger(q) && q > 0) cart[id] = Math.min(q, MAX_QTY);
    }
  } catch {
    cart = {};
  }
  function saveCart() {
    try {
      localStorage.setItem(KEY, JSON.stringify(cart));
    } catch { /* 저장이 막혀 있어도 화면은 그대로 동작 */ }
  }
  const VIP_KEY = 'space-shop-vip-v1';
  let vip = false;
  try {
    vip = localStorage.getItem(VIP_KEY) === '1';
  } catch {
    vip = false;
  }
  function saveVip() {
    try {
      localStorage.setItem(VIP_KEY, '1');
    } catch { /* 저장이 막혀 있어도 이번 화면에서는 VIP */ }
  }
  function renderVip() {
    $('#cartBtn').classList.toggle('vip', vip);
  }

  const cartCount = () => Object.values(cart).reduce((a, b) => a + b, 0);
  const cartTotal = () => Object.entries(cart).reduce((sum, [id, q]) => sum + BY_ID[id].price * q, 0);

  /* =====================================================
     화면 그리기
     ===================================================== */
  function priceLine(it) {
    return it.was ? `<s>${won(it.was)}</s><span class="now">${won(it.price)}</span>` : won(it.price);
  }

  // 지금 보고 있는 쪽. 주소 끝의 #2 같은 표시로 기억해 새로고침해도 그대로다
  let page = 1;
  function pageFromHash() {
    const n = parseInt(window.location.hash.slice(1), 10);
    return Number.isInteger(n) ? Math.min(PAGE_COUNT, Math.max(1, n)) : 1;
  }

  function renderItems() {
    const list = $('#items');
    if (!list) return;
    const start = (page - 1) * PER_PAGE;
    list.innerHTML = ITEMS.slice(start, start + PER_PAGE).map((it) => {
      const text = it.was
        ? `<span class="tag">※할인!※</span><span class="nm plain">${it.name} <s>${won(it.was)}</s></span><span class="now">${won(it.price)}</span>`
        : `<span class="nm">${it.name} ${won(it.price)}</span>`;
      return `<li><button class="item" type="button" data-id="${it.id}"><span class="ico">${spriteImg(it.id)}</span><span class="txt">${text}</span></button></li>`;
    }).join('');

    const pager = $('#pager');
    if (!pager) return;
    let html = '';
    for (let n = 1; n <= PAGE_COUNT; n++) {
      const on = n === page;
      html += `<button class="pg${on ? ' on' : ''}" type="button" data-page="${n}" aria-label="${n}쪽"${on ? ' aria-current="page"' : ''}>${n}</button>`;
    }
    pager.innerHTML = html;
    pager.hidden = PAGE_COUNT < 2;
  }

  function goPage(n, keepFocus) {
    const next = Math.min(PAGE_COUNT, Math.max(1, n));
    if (next === page) return;
    const list = $('#items');
    if (!list) return;
    list.style.setProperty('--dir', next > page ? '14px' : '-14px');
    page = next;
    renderItems();
    list.classList.remove('flip');
    void list.offsetWidth;
    list.classList.add('flip');
    try {
      window.history.replaceState(null, '', '#' + page);
    } catch { /* 주소를 못 바꿔도 쪽 넘김은 그대로 된다 */ }
    if (keepFocus) {
      const cur = $('#pager .pg.on');
      if (cur) cur.focus();
    }
  }

  function renderCart() {
    const ids = Object.keys(cart);
    $('#cartCount').textContent = cartCount();
    $('#cartTotal').textContent = won(cartTotal());
    $('#orderBtn').disabled = ids.length === 0;
    $('#cartList').innerHTML = ids.map((id) => {
      const it = BY_ID[id];
      return `<li class="ci" data-id="${id}">
        <span class="ci-ico">${spriteImg(id)}</span>
        <span><span class="ci-name">${it.name}</span><br><span class="ci-price">${won(it.price * cart[id])}</span></span>
        <span class="stepper sm">
          <button type="button" data-cstep="-1" aria-label="${it.name} 하나 빼기">−</button>
          <output>${cart[id]}</output>
          <button type="button" data-cstep="1" aria-label="${it.name} 하나 더">+</button>
        </span>
        <button class="ci-del" type="button" data-del aria-label="${it.name} 빼기">×</button>
      </li>`;
    }).join('');
  }

  /* =====================================================
     창 열고 닫기
     ===================================================== */
  let lastFocus = null;
  let detailId = null;
  let detailQty = 1;
  let toastTimer = 0;

  function toast(msg) {
    const el = $('#toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 1500);
  }

  function openModal(el, focusEl) {
    lastFocus = document.activeElement;
    el.hidden = false;
    (focusEl || $('.x', el)).focus();
  }
  function closeModal(el) {
    if (el.hidden) return;
    el.hidden = true;
    if (lastFocus && document.contains(lastFocus)) lastFocus.focus();
  }

  function openDetail(id) {
    const it = BY_ID[id];
    if (!it) return;
    detailId = id;
    detailQty = 1;
    $('#dIco').innerHTML = spriteImg(id);
    $('#dName').textContent = it.name;
    $('#dDesc').textContent = it.desc || '';
    $('#dDesc').hidden = !it.desc;
    $('#dTag').hidden = !it.was;
    $('#dStar').hidden = !it.star;
    $('#dPrice').innerHTML = priceLine(it);
    $('#dQty').textContent = detailQty;
    openModal($('#detail'), $('#dBuy'));
  }

  function openDrawer() {
    lastFocus = document.activeElement;
    renderCart();
    $('#scrim').hidden = false;
    const d = $('#drawer');
    d.classList.add('open');
    d.setAttribute('aria-hidden', 'false');
    $('#cartClose').focus();
  }
  function closeDrawer() {
    const d = $('#drawer');
    if (!d.classList.contains('open')) return;
    d.classList.remove('open');
    d.setAttribute('aria-hidden', 'true');
    $('#scrim').hidden = true;
    if (lastFocus && document.contains(lastFocus)) lastFocus.focus();
  }

  /* =====================================================
     이벤트
     ===================================================== */
  function bind() {
    // 페이지 넘어가기: 살짝 빨려 들어가듯 사라진 뒤 이동
    $$('a.look, a.back').forEach((a) => {
      a.addEventListener('click', (e) => {
        if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        e.preventDefault();
        document.body.classList.add('leaving');
        setTimeout(() => {
          window.location.href = a.href;
        }, 260);
      });
    });
    window.addEventListener('pageshow', () => document.body.classList.remove('leaving'));

    const list = $('#items');
    if (list) {
      list.addEventListener('click', (e) => {
        const btn = e.target.closest('.item');
        if (btn) openDetail(btn.dataset.id);
      });
    }

    const pager = $('#pager');
    if (pager) {
      pager.addEventListener('click', (e) => {
        const b = e.target.closest('[data-page]');
        if (b) goPage(Number(b.dataset.page), true);
      });
      window.addEventListener('hashchange', () => goPage(pageFromHash(), false));
    }

    $('#dStep').addEventListener('click', (e) => {
      const b = e.target.closest('[data-step]');
      if (!b) return;
      detailQty = Math.max(1, Math.min(MAX_QTY, detailQty + Number(b.dataset.step)));
      $('#dQty').textContent = detailQty;
    });

    $('#dBuy').addEventListener('click', () => {
      if (!detailId) return;
      cart[detailId] = Math.min(MAX_QTY, (cart[detailId] || 0) + detailQty);
      saveCart();
      renderCart();
      closeModal($('#detail'));
      toast(`${BY_ID[detailId].name} 담았다!`);
      const cb = $('#cartBtn');
      cb.classList.remove('bump');
      void cb.offsetWidth;
      cb.classList.add('bump');
    });

    $$('.modal').forEach((m) => {
      m.addEventListener('click', (e) => {
        if (e.target === m || e.target.closest('[data-close]')) closeModal(m);
      });
    });

    $('#cartBtn').addEventListener('click', openDrawer);
    $('#cartClose').addEventListener('click', closeDrawer);
    $('#scrim').addEventListener('click', closeDrawer);

    $('#cartList').addEventListener('click', (e) => {
      const row = e.target.closest('.ci');
      if (!row) return;
      const id = row.dataset.id;
      const step = e.target.closest('[data-cstep]');
      if (step) {
        const q = (cart[id] || 0) + Number(step.dataset.cstep);
        if (q <= 0) delete cart[id];
        else cart[id] = Math.min(MAX_QTY, q);
      } else if (e.target.closest('[data-del]')) {
        delete cart[id];
      } else {
        return;
      }
      saveCart();
      renderCart();
    });

    $('#orderBtn').addEventListener('click', () => {
      const count = cartCount();
      if (!count) return;
      const total = cartTotal();
      const gotVip = total >= VIP_MIN && !vip;
      if (gotVip) {
        vip = true;
        saveVip();
        renderVip();
      }
      $('#doneSum').textContent = `물건 ${count}개 / ${won(total)}`;
      $('#doneVip').hidden = !gotVip;
      cart = {};
      saveCart();
      renderCart();
      closeDrawer();
      openModal($('#done'), $('#done .buy'));
    });

    document.addEventListener('keydown', (e) => {
      const open = $$('.modal').find((m) => !m.hidden);
      const drawerOpen = $('#drawer').classList.contains('open');
      if (e.key === 'Escape') {
        if (open) closeModal(open);
        else closeDrawer();
        return;
      }
      // 물건 화면에서는 좌우 화살표로도 쪽을 넘긴다
      if (!open && !drawerOpen && $('#pager') && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
        goPage(page + (e.key === 'ArrowRight' ? 1 : -1), false);
      }
    });

    let resizeTimer = 0;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        drawBg();
        drawSky();
      }, 120);
    });
  }

  /* =====================================================
     시작
     ===================================================== */
  document.body.insertAdjacentHTML('beforeend', OVERLAYS);
  $$('[data-sprite]').forEach((el) => {
    el.innerHTML = spriteImg(el.dataset.sprite);
  });
  buildBurst();
  buildTwinkles();
  page = pageFromHash();
  renderItems();
  renderCart();
  renderVip();
  bind();
  drawBg();
  drawSky();
})();
