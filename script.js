// ----- script.js -----

// 1) Paste イベントを横取りして、text/html を優先して貼り付け
const editable = document.getElementById('inputText');
editable.addEventListener('paste', e => {
  e.preventDefault();
  const clip = e.clipboardData || window.clipboardData;
  const html = clip.getData('text/html');
  const txt  = clip.getData('text/plain');
  document.execCommand('insertHTML', false, html || txt);
});

// 2) 分類ボタンのクリックで、内容をレベルごとに抽出
document.getElementById('processButton').addEventListener('click', () => {
  const spans = editable.querySelectorAll('span');
  if (spans.length === 0) {
    document.getElementById('result').textContent = 'No color-coded text found.';
    return;
  }

  // レベル別に格納するオブジェクト
  const levels = {
    A1: [], A2: [],
    B1: [], B2: [],
    C1: [], C2: [],
    'NA content words': [],
    'NA others': []
  };

  // rgb(...) → "#rrggbb" 変換ユーティリティ
  function toHex(color) {
    color = color.trim();
    const m = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (m) {
      return '#' + [1,2,3].map(i => {
        let h = parseInt(m[i]).toString(16);
        return h.length===1 ? '0'+h : h;
      }).join('');
    }
    // 短縮 #0f0 を #00ff00
    if (/^#[0-9a-f]{3}$/i.test(color)) {
      return '#' + color[1]+color[1] + color[2]+color[2] + color[3]+color[3];
    }
    return color.toLowerCase(); // 既に #rrggbb か色名
  }

  // 各 span をチェック
  spans.forEach(sp => {
    const text = sp.textContent.trim();
    if (!text) return;

    const cs    = window.getComputedStyle(sp);
    const col   = toHex(cs.color);
    const bold  = cs.fontWeight === 'bold' || parseInt(cs.fontWeight) >= 600;

    let level = 'NA others';
    if (col === '#32cd32')           level = bold ? 'A2' : 'A1';
    else if (col === '#0000ff')      level = bold ? 'B2' : 'B1';
    else if (col === '#ff0000')      level = bold ? 'C2' : 'C1';
    else if (col === '#ffa500')      level = 'NA content words';

    // 重複を除外してプッシュ
    if (!levels[level].includes(text)) {
      levels[level].push(text);
    }
  });

  // テーブルを組み立てて表示
  const order = ['A1','A2','B1','B2','C1','C2','NA content words','NA others'];
  let html = '<table><tr><th>Level</th><th>Words</th></tr>';
  order.forEach(lv => {
    html += `<tr><td>${lv}</td><td>${levels[lv].join(' / ')}</td></tr>`;
  });
  html += '</table>';
  document.getElementById('result').innerHTML = html;
});
