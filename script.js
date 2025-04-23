// ---------- script.js ----------
function normalizeColor(c){
  c = c.trim().toLowerCase();
  // rgb -> hex 変換
  const rgbMatch = c.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (rgbMatch){
    const h = x => ('0'+parseInt(x).toString(16)).slice(-2);
    return '#' + h(rgbMatch[1]) + h(rgbMatch[2]) + h(rgbMatch[3]);
  }
  // short hex (#0f0) を #00ff00 へ
  if (/^#([0-9a-f]{3})$/i.test(c)){
    return '#' + c[1]+c[1]+c[2]+c[2]+c[3]+c[3];
  }
  return c;               // 既に hex か色名
}

document.getElementById('processButton').addEventListener('click', () => {
  const html = document.getElementById('inputText').innerHTML;
  if(!html){document.getElementById('result').textContent='Nothing pasted';return;}

  const doc = new DOMParser().parseFromString(html,'text/html');

  const pocket = {
    A1:[],A2:[],B1:[],B2:[],C1:[],C2:[],
    naContent:[],naOthers:[]
  };

  const spans = doc.querySelectorAll('span');
  spans.forEach(sp=>{
    const style = sp.getAttribute('style')||'';
    const text  = sp.textContent.trim();
    if(!text) return;

    let color = '';                   // 抽出した color
    style.split(';').forEach(s=>{
      if(s.includes('color') && !s.includes('background')) color=s.split(':')[1]||'';
    });
    color = normalizeColor(color);

    const bold = /font-weight\s*:\s*(bold|[6-9]\d\d)/i.test(style);

    let level='naOthers';             // デフォルト
    if (color==='#32cd32'){ level = bold ? 'A2':'A1';}
    else if (color==='#0000ff'){ level = bold ? 'B2':'B1';}
    else if (color==='#ff0000'){ level = bold ? 'C2':'C1';}
    else if (color==='#ffa500'){ level = 'naContent';}

    if(!pocket[level].includes(text)) pocket[level].push(text);
  });

  // テーブル生成
  const row = l => `<tr><td>${l}</td><td>${pocket[l].join(' / ')}</td></tr>`;
  document.getElementById('result').innerHTML =
    `<table><tr><th>Level</th><th>Words</th></tr>`+
    ['A1','A2','B1','B2','C1','C2','naContent','naOthers'].map(row).join('')+
    `</table>`;
});
