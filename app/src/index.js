const layer = layui.layer;

function getJSONArrayLength(JSONArray){
  let length = 0;
  for(let i in JSONArray){
    length++;
  }
  return length;
};

function readFile(){
  const objFile = document.getElementById('upload');
  if(objFile.value === ''){
      alert('请选择文件');
      return
  }
  const zipFile = JSZip.loadAsync(objFile.files[0]).then((zip) => {
      zip.file('appList.json').async('blob').then((jsonBlob) => {
          const reader = new FileReader();
          reader.readAsText(jsonBlob,'UTF-8');
          reader.onload = function(e){
              let data = e.target.result;
              window.localStorage.setItem('appList',data);
              data = JSON.parse(data);
              document.getElementById('uploadDiv').style.display = 'none';
              document.getElementById('name').style.display = 'block';
              layer.msg('导入成功！',{icon: 1});
              document.getElementById('head').innerText = `读取到 ${getJSONArrayLength(data)} 个应用`;
              const fullTable =
              `
              <table class="layui-table" lay-even>
                <thead>
                  <tr>
                    <th>包名</th>
                    <th>应用名称</th>
                    <th>版本号</th>
                    <th>版本名</th>
                    <th>是否系统应用</th>
                    <th>最后更新时间</th>
                    <th>是否隐藏应用</th>
                  </tr>
                </thead>
                <tbody>
                  ${genTable(data)}
                </tbody>
              </table>
              `;
              document.getElementById('app').innerHTML = fullTable;
          };
      });
  });
};

function genTable(data){
  var totalApp = '';
  data.forEach((a) => {
    const eachApp =
    `
    <tr>
      <td>${a.id}</td>
      <td>${a.name}</td>
      <td>${a.versionCode}</td>
      <td>${a.versionName}</td>
      <td>${a.isSystem ? '是' : '否'}</td>
      <td>${timestampToTime(a.mtime)}</td>
      <td>${a.hidden ? '是' : '否'}</td>
    </tr>
    `;
    totalApp += eachApp;
  });
  return totalApp;
};

function search(){
  var data = JSON.parse(window.localStorage.getItem('appList'));
  var searchContent = document.getElementById('name').value;
  if(searchContent == ''){
    document.getElementById('head').innerText = `读取到 ${getJSONArrayLength(data)} 个应用`;
    const fullTable =
    `
    <table class="layui-table" lay-even>
      <thead>
        <tr>
          <th>包名</th>
          <th>应用名称</th>
          <th>版本号</th>
          <th>版本名</th>
          <th>是否系统应用</th>
          <th>最后更新时间</th>
          <th>是否隐藏应用</th>
        </tr>
      </thead>
      <tbody>
        ${genTable(data)}
      </tbody>
    </table>
    `;
    document.getElementById('app').innerHTML = fullTable;
    return;
  }
  var tMatch = [], pMatch = [];
  data.forEach((a) => {
    if(a.name.includes(searchContent) || a.id.includes(searchContent)){
      if(a.name == searchContent || a.id == searchContent) tMatch.push(a);
      else pMatch.push(a);
    }
  });
  var result = tMatch.concat(pMatch);
  document.getElementById('head').innerText = `搜索到 ${result.length} 个应用`;
  const fullTable =
  `
  <table class="layui-table" lay-even>
    <thead>
      <tr>
        <th>包名</th>
        <th>应用名称</th>
        <th>版本号</th>
        <th>版本名</th>
        <th>是否系统应用</th>
        <th>最后更新时间</th>
        <th>是否隐藏应用</th>
      </tr>
    </thead>
    <tbody>
      ${genTable(result)}
    </tbody>
  </table>
  `;
  document.getElementById('app').innerHTML = fullTable;
};

/* 时间戳转换为时间 */
function timestampToTime(timestamp){
  timestamp = timestamp ? timestamp : null;
  let date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
  let Y = date.getFullYear() + '-';
  let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  let D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
  let h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
  let m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
  let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
  return Y + M + D + h + m + s;
};