var initTable = `
<table id="appListTable">
    <thead>
        <tr>
            <th>应用名</th>
            <th>包名</th>
            <th>规则组名称</th>
            <th>规则描述</th>
            <th>操作</th>
        </tr>
    </thead>
    <tbody></tbody>
</table>`;
var script, fullScript;
const codeVer = 'beta-0.7.1';

function changeSwitch(index,job){
    var location = index.split('.');
    var i = location[0], j = location[1];
    if(job == 'on'){
        if(script[i].groups[j].hasOwnProperty('enable') == true){
            delete script[i].groups[j].enable;
            document.getElementById(index).style.color = 'green';
            alert('已打开');
        }
        else alert('该规则已经打开了');
    }
    else if(job == 'off'){
        if(script[i].groups[j].hasOwnProperty('enable') == true) alert('该规则已经关闭了');
        else{
            script[i].groups[j]['enable'] = 'false';
            document.getElementById(index).style.color = 'red';
            alert('已关闭');
        }
    }
};

function search(){
    var target = document.getElementById('name').value;
    var same, include = 0;
    var preferences = [];
    var secondaryOptions = [];
    if(target == ''){
        var eachAppRules = '';
        for(let i in script){
            var packageName, appName, ruleName, desc, style;
            packageName = script[i].id;
            appName = script[i].name;
            for(let j in script[i].groups){
                ruleName = script[i].groups[j].name;
                if(script[i].groups[j].hasOwnProperty('enable') == true) style = 'color: red;';
                else style = 'color: green;';
                if(script[i].groups[j].hasOwnProperty('desc') == true) desc = script[i].groups[j].desc;
                else desc = '该规则暂无描述';
                eachAppRules += tableInfo(appName, packageName, String(i) + '.' + String(j), style, ruleName);
            };
        };
        var ruleList = document.querySelector('tbody');
        ruleList.innerHTML = eachAppRules;
    }
    else{
        if(target.split(' ').indexOf('rules') != -1){
            if(target.split(' ').length == 3){
                document.getElementById('appList').innerHTML = initTable;
                eachAppRules = '';
                for(let i in script){
                    if(script[i].name == target.split(' ')[2] || script[i].id == target.split(' ')[2]){
                        for(let j in script[i].groups){
                            if(script[i].groups[j].name.includes(target.split(' ')[1]) == true){
                                packageName = script[i].id;
                                appName = script[i].name;
                                ruleName = script[i].groups[j].name;
                                if(script[i].groups[j].hasOwnProperty('enable') == true) style = 'color: red;';
                                else style = 'color: green;';
                                if(script[i].groups[j].hasOwnProperty('desc') == true) desc = script[i].groups[j].desc;
                                else desc = '该规则暂无描述';
                                eachAppRules += tableInfo(appName, packageName, String(i) + '.' + String(j), style, ruleName);
                            }
                        }
                    }
                }
                var ruleList = document.querySelector('tbody');
                ruleList.innerHTML = eachAppRules;
            }
            else if(target.split(' ').length == 2){
                document.getElementById('appList').innerHTML = initTable;
                eachAppRules = '';
                for(let i in script){
                    for(let j in script[i].groups){
                        if(script[i].groups[j].name.includes(target.split(' ')[1]) == true){
                            packageName = script[i].id;
                            appName = script[i].name;
                            ruleName = script[i].groups[j].name;
                            if(script[i].groups[j].hasOwnProperty('enable') == true) style = 'color: red;';
                            else style = 'color: green;';
                            if(script[i].groups[j].hasOwnProperty('desc') == true) desc = script[i].groups[j].desc;
                            else desc = '该规则暂无描述';
                            eachAppRules += tableInfo(appName, packageName, String(i) + '.' + String(j), style, ruleName);
                        }
                    }
                }
                var ruleList = document.querySelector('tbody');
                ruleList.innerHTML = eachAppRules;
            }
            else if(target.split(' ').length == 1) alert('命令非法！');
        }
        else{
            document.getElementById('appList').innerHTML = initTable;
            eachAppRules = '';
            for(let i in script){
                if(script[i].name.includes(target) == true || script[i].id.includes(target) == true){
                    if(script[i].name == target || script[i].id == target){
                        preferences.push(i);
                        same += 1;
                    }
                    else{
                        secondaryOptions.push(i);
                        include += 1;
                    }
                }
            }
            var packageName, appName, ruleName, desc;
            for(let i in preferences){
                packageName = script[preferences[i]].id;
                appName = script[preferences[i]].name;
                for(let j in script[preferences[i]].groups){
                    ruleName = script[preferences[i]].groups[j].name;
                    if(script[preferences[i]].groups[j].hasOwnProperty('enable') == true) style = 'color: red;';
                    else style = 'color: green;';
                    if(script[preferences[i]].groups[j].hasOwnProperty('desc') == true) desc = script[preferences[i]].groups[j].desc;
                    else desc = '该规则暂无描述';
                    eachAppRules += tableInfo(appName, packageName, String(preferences[i]) + '.' + String(j), style, ruleName);
                };
            }
            for(let i in secondaryOptions){
                packageName = script[secondaryOptions[i]].id;
                appName = script[secondaryOptions[i]].name;
                for(let j in script[secondaryOptions[i]].groups){
                    ruleName = script[secondaryOptions[i]].groups[j].name;
                    if(script[secondaryOptions[i]].groups[j].hasOwnProperty('enable') == true) style = 'color: red;';
                    else style = 'color: green;';
                    if(script[secondaryOptions[i]].groups[j].hasOwnProperty('desc') == true) desc = script[secondaryOptions[i]].groups[j].desc;
                    else desc = '该规则暂无描述';
                    eachAppRules += tableInfo(appName, packageName, String(secondaryOptions[i]) + '.' + String(j), style, ruleName);
                };
            }
            var ruleList = document.querySelector('tbody');
            ruleList.innerHTML = eachAppRules;
        }
    }
};

function output(type){
    if(type == 'all'){
        delete fullScript.supportUri;
        delete fullScript.checkUpdateUrl;
        fullScript['id'] = '9999';
        fullScript['name'] = '默认订阅-改';
        fullScript['author'] = 'Adpro';
        fullScript['version'] = '1';
        fullScript['desc'] = '由Adpro开发的“GKD默认订阅自定义规则开关工具”生成'
        const blob = new Blob([JSON5.stringify(fullScript)],{
            type: 'application/json'
        });
        const downloadURL = URL.createObjectURL(blob);
        const aTag = document.createElement('a');
        aTag.href = downloadURL;
        aTag.download = '默认订阅-改.json5';
        aTag.click();
        URL.revokeObjectURL(downloadURL);
    }
    else{
        var location = type.split('.');
        var i = location[0], j = location[1];
        navigator.clipboard.writeText(JSON5.stringify(script[i].groups[j])).then(() => {
            alert('已复制到剪切板');
        });
    }
};

function getDetails(){
    axios.get('../gkd.json5').then(function(data){
        data = JSON5.parse(data.data);
        fullScript = data;
        script = data.apps;
        document.getElementById('subVer').innerHTML = '<span>订阅版本：' + data.version + '</span>';
        document.getElementById('codeVer').innerHTML = '当前程序版本：' + codeVer;
        document.getElementById('appList').innerHTML = initTable;
        var eachAppRules = '';
        for(let i in data.apps){
            var packageName, appName, ruleName, desc, style;
            packageName = data.apps[i].id;
            appName = data.apps[i].name;
            for(let j in data.apps[i].groups){
                ruleName = data.apps[i].groups[j].name;
                if(data.apps[i].groups[j].hasOwnProperty('enable') == true) style = 'color: red;';
                else style = 'color: green;';
                if(data.apps[i].groups[j].hasOwnProperty('desc') == true) desc = data.apps[i].groups[j].desc;
                else desc = '该规则暂无描述';
                eachAppRules += tableInfo(appName, packageName, String(i) + '.' + String(j), style, ruleName);
            };
        };
        var ruleList = document.querySelector('tbody');
        ruleList.innerHTML = eachAppRules;
    });
};

function readFile(){
    const objFile = document.getElementById('upload');
    if(objFile.value === ''){
        alert('请选择文件');
        return
    }
    const subFile = objFile.files;
    const reader = new FileReader();
    reader.readAsText(subFile[0],'UTF-8');
    reader.onload = function(e){
        let data = e.target.result;
        data = JSON5.parse(data);
        fullScript = data;
        script = data.apps;
        document.getElementById('subVer').innerHTML = '<span>订阅版本：' + data.version + '</span>';
        document.getElementById('codeVer').innerHTML = '当前程序版本：' + codeVer;
        document.getElementById('appList').innerHTML = initTable;
        var eachAppRules = '';
        for(let i in data.apps){
            var packageName, appName, ruleName, desc, style;
            packageName = data.apps[i].id;
            appName = data.apps[i].name;
            for(let j in data.apps[i].groups){
                ruleName = data.apps[i].groups[j].name;
                if(script[i].groups[j].hasOwnProperty('enable') == true) style = 'color: red;';
                else style = 'color: green;';
                if(data.apps[i].groups[j].hasOwnProperty('desc') == true) desc = data.apps[i].groups[j].desc;
                else desc = '该规则暂无描述';
                eachAppRules += tableInfo(appName, packageName, String(i) + '.' + String(j), style, ruleName);
            };
        };
        var ruleList = document.querySelector('tbody');
        ruleList.innerHTML = eachAppRules;
    }
};

function edit(location){
    var i = location.split('.')[0];
    var j = location.split('.')[1];
    document.getElementById('content').value = JSON5.stringify(script[i].groups[j],null,2);
    document.getElementById('edit').style.display = 'block';
    document.querySelector('.close').onclick = function(){
        document.getElementById('edit').style.display = 'none';
    };
    document.getElementById('save').onclick = function(){
        script[i].groups[j] = JSON5.parse(document.getElementById('content').value);
        alert('保存成功！请不要刷新网页');
        document.getElementById('edit').style.display = 'none';
    };
};

function tableInfo(appName, packageName, id, style, ruleName){
    let result = `
    <tr>
        <td>${appName}</td>
        <td>${packageName}</td>
        <td id="${id}" style="${style}">${ruleName}</td>
        <td>${desc}</td>
        <td>
            <button onclick="changeSwitch('${id}','on');">打开</button>
            <button onclick="changeSwitch('${id}','off');">关闭</button>
            <button onclick="edit('${id}');">编辑</button>
            <button onclick="output('${id}')">导出该规则</button>
        </td>
    </tr>`;
    return result;
};