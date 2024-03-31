const initAppTable = `
<table id="appListTable" class="listTable">
    <thead>
        <tr>
            <th>应用名</th>
            <th>包名</th>
            <th>规则组分类</th>
            <th>规则组名称</th>
            <th>规则描述</th>
            <th>
                <div>操作<div>
                <button onclick="changeSwitch('all','on');">全部开启</button>
                <button onclick="changeSwitch('all','off');">全部关闭</button>
            </th>
        </tr>
    </thead>
    <tbody></tbody>
</table>`;
var script, fullScript, categories, originSub;
const codeVer = '1.2.4';

function changeSwitch(index, job) {
  if (index != 'all') {
    let location = index.split('.');
    let i = location[0], j = location[1];
    if (job == 'on') {
      if (document.getElementById(index).style.color == 'red') {
        delete script[i].groups[j].enable;
        document.getElementById(index).style.color = 'green';
        alert('已开启');
      }
      else alert('该规则已经开启了');
    }
    else if (job == 'off') {
      if (document.getElementById(index).style.color == 'red') alert('该规则已经关闭了');
      else {
        script[i].groups[j]['enable'] = false;
        document.getElementById(index).style.color = 'red';
        alert('已关闭');
      }
    }
  }
  else {
    for (let i in script) {
      for (let j in script[i].groups) {
        if (document.getElementById(String(i) + '.' + String(j)).style.color == 'red') {
          if (job == 'on') {
            delete script[i].groups[j].enable;
            document.getElementById(String(i) + '.' + String(j)).style.color = 'green';
          }
        }
        else {
          if (job == 'off') {
            script[i].groups[j]['enable'] = 'false';
            document.getElementById(String(i) + '.' + String(j)).style.color = 'red';
          }
        }
      }
    }
    if (job == 'on') alert('已全部开启！');
    else alert('已全部关闭！');
  }
};

function search() {
  const target = document.getElementById('name').value;
  if(target != ''){
    let result = JSON5.parse(JSON5.stringify(fullScript));
    result.apps = [];
    for(let i of script){
      if(i.name.includes(target) || i.id.includes(target)){
        result.apps.push(i);
      }
    }
    writeTable(result);
  }
  else writeTable(originSub);
};

function output(type) {
  if (type == 'all') {
    let userSelect = document.getElementById('outputMode');
    let index = userSelect.selectedIndex;
    let blob;
    if (userSelect.options[index].value == 'json') {
      blob = new Blob([JSON.stringify(fullScript)], {
        type: 'application/json'
      });
    }
    else if (userSelect.options[index].value == 'json5') {
      blob = new Blob([JSON5.stringify(fullScript)], {
        type: 'application/json'
      });
    }
    const downloadURL = URL.createObjectURL(blob);
    const aTag = document.createElement('a');
    aTag.href = downloadURL;
    if (userSelect.options[index].value == 'json') aTag.download = `${fullScript.id}.json`;
    else if (userSelect.options[index].value == 'json5') aTag.download = `${fullScript.id}.json5`;
    aTag.click();
    URL.revokeObjectURL(downloadURL);
  }
  else {
    var location = type.split('.');
    var i = location[0], j = location[1];
    navigator.clipboard.writeText(JSON5.stringify(script[i].groups[j])).then(() => {
      alert('已复制到剪切板');
    });
  }
};

function getDetails() {
  $.get('https://fastly.jsdelivr.net/npm/@gkd-kit/subscription', (data) => {
    originSub = JSON5.parse(data);
    writeTable(originSub);
  });
};

function readFile() {
  const objFile = document.getElementById('upload');
  if (objFile.value === '') {
    alert('请选择文件');
    return
  }
  const subFile = objFile.files;
  let type = objFile.value.substring(objFile.value.lastIndexOf('.') + 1);
  const reader = new FileReader();
  reader.readAsText(subFile[0], 'UTF-8');
  reader.onload = function (e) {
    let data = e.target.result;
    if (type == 'json') data = JSON.parse(data);
    else if (type == 'json5') data = JSON5.parse(data);
    writeTable(data);
  };
};

function edit(location) {
  let i = location.split('.')[0];
  let j = location.split('.')[1];
  document.getElementById('content').value = JSON5.stringify(script[i].groups[j], null, 2);
  document.getElementById('edit').style.display = 'block';
  document.querySelector('.close').onclick = function () {
    document.getElementById('edit').style.display = 'none';
  };
  document.getElementById('save').onclick = function () {
    script[i].groups[j] = JSON5.parse(document.getElementById('content').value);
    alert('保存成功！请不要刷新网页，否则会导致修改丢失');
    document.getElementById('edit').style.display = 'none';
  };
};

function copyPackageName(location) {
  let i = location.split('.')[0];
  navigator.clipboard.writeText(JSON5.stringify(script[i].id).slice(1, -1)).then(() => {
    alert('已复制到剪切板');
  });
};

function switchStatus(type) {
  if (type == 'memorize') {
    localStorage.setItem(String(fullScript.id), JSON5.stringify(script));
    alert('全部都记下来了！');
  }
  else if (type == 'read') {
    try {
      let result = localStorage.getItem(String(fullScript.id));
      throw result;
    } catch (error) {
      if (error == null) {
        alert('我的脑子里似乎没有这方面的记忆');
        return
      }
    }
    alert('一字不落地还原了！');
    script = JSON5.parse(localStorage.getItem(String(fullScript.id)));
    fullScript.apps = script;
    writeTable(fullScript);
  }
};

function getThirdPartySub() {
  let userselect = document.getElementById("thirdParty");
  let index = userselect.selectedIndex;
  if (userselect.options[index].value == 'Adpro') {
    $.get('https://raw.gitmirror.com/Adpro-Team/GKD_subscription/main/dist/Adpro_gkd.json5', (data) => {
      originSub = JSON5.parse(data);
      writeTable(originSub);
      alert('导入成功！');
    });
  }
  else if (userselect.options[index].value == 'AIsouler') {
    $.get('https://raw.gitmirror.com/AIsouler/GKD_subscription/main/dist/AIsouler_gkd.json5', (data) => {
      originSub = JSON5.parse(data);
      writeTable(originSub);
      alert('导入成功！');
    });
  }
  else if (userselect.options[index].value == 'aoguai') {
    $.get('https://raw.gitmirror.com/aoguai/subscription/custom/dist/aoguai_gkd.json5', (data) => {
      originSub = JSON5.parse(data);
      writeTable(originSub);
      alert('导入成功！');
    });
  }
  else if (userselect.options[index].value == 'ganlinte') {
    $.get('https://raw.gitmirror.com/ganlinte/GKD-subscription/main/dist/ganlin_gkd.json5', (data) => {
      originSub = JSON5.parse(data);
      writeTable(originSub);
      alert('导入成功！');
    });
  }
  else if (userselect.options[index].value == '114514') {
    $.get('https://raw.gitmirror.com/gkd-sub-repo/114514_subscription/main/dist/114514_gkd.json5', (data) => {
      originSub = JSON5.parse(data);
      writeTable(originSub);
      alert('导入成功！');
    });
  }
  else if (userselect.options[index].value == 'MengNianxiaoyao') {
    $.get('https://registry.npmmirror.com/gkd-subscription/latest/files', (data) => {
      originSub = JSON5.parse(data);
      writeTable(originSub);
      alert('导入成功！');
    });
  }
};

function quickStart(app) {
  if(app == 'GKD'){
    const options = {
      scheme: {
        protocol: 'gkd',
        host: 'import',
      },
      intent: {
        package: 'li.songe.gkd',
        scheme: 'gkd',
      },
      fallback: 'https://gkd.li/guide/#install',
    };
    const callLib = new CallApp(options);
    callLib.open({
      path: 'import',
    });
  }
  else if(app == 'GKDTool'){
    const options = {
      scheme: {
        protocol: 'gkdtool',
      },
      intent: {
        package: 'xyz.adproqwq.GKDTool',
        scheme: 'gkdtool',
      },
      fallback: 'https://www.magicalapk.com/appview?id=1711811784193',
    };
    const callLib = new CallApp(options);
    callLib.open({
      path: '',
    });
  }
};

//复用代码
function tableInfo(appName, packageName, category, id, style, ruleName, desc) {
  let result = `
    <tr>
        <td>${appName}</td>
        <td>
            ${packageName}
            <button onclick="copyPackageName('${id}');">复制</button>
        </td>
        <td>${category}</td>
        <td id="${id}" style="${style}">${ruleName}</td>
        <td>${desc}</td>
        <td>
            <button onclick="changeSwitch('${id}','on');">开启</button>
            <button onclick="changeSwitch('${id}','off');">关闭</button>
            <button onclick="edit('${id}');">编辑</button>
            <button onclick="output('${id}')">导出该规则</button>
        </td>
    </tr>`;
  return result;
};

function writeTable(data) {
  fullScript = data;
  script = data.apps;
  categories = data.categories;
  document.getElementById('subVer').innerHTML = '<span>订阅版本：' + fullScript.version + '</span>';
  document.getElementById('codeVer').innerHTML = '<span>当前程序版本：' + codeVer + '</span>';
  document.getElementById('appList').innerHTML = initAppTable;
  var eachAppRule = '';
  for (let i in script) {
    var packageName, appName, category, ruleName, desc, style;
    packageName = script[i].id;
    appName = script[i].name;
    for (let j in script[i].groups) {
      ruleName = script[i].groups[j].name;
      for(let z of categories){
        if(ruleName.split('-')[0] === z.name){
          category = ruleName.split('-')[0];
          break;
        }
        else category = '';
      }
      if (script[i].groups[j].hasOwnProperty('enable') == true) {
        if (script[i].groups[j].enable == false) style = 'color: red;';
        else style = 'color: green;';
      }
      else style = 'color: green;';
      if (script[i].groups[j].hasOwnProperty('desc') == true) desc = script[i].groups[j].desc;
      else desc = '该规则暂无描述';
      eachAppRule += tableInfo(appName, packageName, category, String(i) + '.' + String(j), style, ruleName, desc);
    };
  };
  document.querySelector('tbody').innerHTML = eachAppRule;
};