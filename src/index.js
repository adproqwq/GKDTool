var initTable = `
<table id="appListTable">
    <thead>
        <tr>
            <th>应用名</th>
            <th>包名</th>
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
var script, fullScript;
const codeVer = '1.2.0';

function changeSwitch(index,job){
    if(index != 'all'){
        let location = index.split('.');
        let i = location[0], j = location[1];
        if(job == 'on'){
            if(document.getElementById(index).style.color == 'red'){
                delete script[i].groups[j].enable;
                document.getElementById(index).style.color = 'green';
                alert('已开启');
            }
            else alert('该规则已经开启了');
        }
        else if(job == 'off'){
            if(document.getElementById(index).style.color == 'red') alert('该规则已经关闭了');
            else{
                script[i].groups[j]['enable'] = false;
                document.getElementById(index).style.color = 'red';
                alert('已关闭');
            }
        }
    }
    else{
        for(let i in script){
            for(let j in script[i].groups){
                if(document.getElementById(String(i) + '.' + String(j)).style.color == 'red'){
                    if(job == 'on'){
                        delete script[i].groups[j].enable;
                        document.getElementById(String(i) + '.' + String(j)).style.color = 'green';
                    }
                }
                else{
                    if(job == 'off'){
                        script[i].groups[j]['enable'] = 'false';
                        document.getElementById(String(i) + '.' + String(j)).style.color = 'red';
                    }
                }
            }
        }
        if(job == 'on') alert('已全部开启！');
        else alert('已全部关闭！');
    }
};

function search(){
    var target = document.getElementById('name').value;
    var same, include = 0;
    var preferences = [];
    var secondaryOptions = [];
    if(target == '') writeTable(fullScript);
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
                                if(script[i].groups[j].hasOwnProperty('enable') == true){
                                    if(script[i].groups[j]['enable'] == false) style = 'color: red;';
                                    else style = 'color: green;';
                                }
                                else style = 'color: green;';
                                if(script[i].groups[j].hasOwnProperty('desc') == true) desc = script[i].groups[j].desc;
                                else desc = '该规则暂无描述';
                                eachAppRules += tableInfo(appName, packageName, String(i) + '.' + String(j), style, ruleName, desc);
                            }
                        }
                    }
                }
                let ruleList = document.querySelector('tbody');
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
                            if(script[i].groups[j].hasOwnProperty('enable') == true){
                                if(script[i].groups[j]['enable'] == false) style = 'color: red;';
                                else style = 'color: green;';
                            }
                            else style = 'color: green;';
                            if(script[i].groups[j].hasOwnProperty('desc') == true) desc = script[i].groups[j].desc;
                            else desc = '该规则暂无描述';
                            eachAppRules += tableInfo(appName, packageName, String(i) + '.' + String(j), style, ruleName, desc);
                        }
                    }
                }
                let ruleList = document.querySelector('tbody');
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
                    if(script[preferences[i]].groups[j].hasOwnProperty('enable') == true){
                        if(script[preferences[i]].groups[j]['enable'] == false) style = 'color: red;';
                        else style = 'color: green;';
                    }
                    else style = 'color: green;';
                    if(script[preferences[i]].groups[j].hasOwnProperty('desc') == true) desc = script[preferences[i]].groups[j].desc;
                    else desc = '该规则暂无描述';
                    eachAppRules += tableInfo(appName, packageName, String(preferences[i]) + '.' + String(j), style, ruleName, desc);
                };
            }
            for(let i in secondaryOptions){
                packageName = script[secondaryOptions[i]].id;
                appName = script[secondaryOptions[i]].name;
                for(let j in script[secondaryOptions[i]].groups){
                    ruleName = script[secondaryOptions[i]].groups[j].name;
                    if(script[secondaryOptions[i]].groups[j].hasOwnProperty('enable') == true){
                        if(script[secondaryOptions[i]].groups[j]['enable'] == false) style = 'color: red;';
                        else style = 'color: green;';
                    }
                    else style = 'color: green;';
                    if(script[secondaryOptions[i]].groups[j].hasOwnProperty('desc') == true) desc = script[secondaryOptions[i]].groups[j].desc;
                    else desc = '该规则暂无描述';
                    eachAppRules += tableInfo(appName, packageName, String(secondaryOptions[i]) + '.' + String(j), style, ruleName, desc);
                };
            }
            let ruleList = document.querySelector('tbody');
            ruleList.innerHTML = eachAppRules;
        }
    }
};

function output(type){
    if(type == 'all'){
        let userSelect = document.getElementById('outputMode');
        let index = userSelect.selectedIndex;
        let blob;
        if(userSelect.options[index].value == 'json'){
            blob = new Blob([JSON.stringify(fullScript)],{
                type: 'application/json'
            });
        }
        else if(userSelect.options[index].value == 'json5'){
            blob = new Blob([JSON5.stringify(fullScript)],{
                type: 'application/json'
            });
        }
        const downloadURL = URL.createObjectURL(blob);
        const aTag = document.createElement('a');
        aTag.href = downloadURL;
        if(userSelect.options[index].value == 'json') aTag.download = `${fullScript.id}.json`;
        else if(userSelect.options[index].value == 'json5') aTag.download = `${fullScript.id}.json5`;
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
        writeTable(data);
    });
};

function readFile(){
    const objFile = document.getElementById('upload');
    if(objFile.value === ''){
        alert('请选择文件');
        return
    }
    const subFile = objFile.files;
    let type = objFile.value.substring(objFile.value.lastIndexOf('.')+1);
    const reader = new FileReader();
    reader.readAsText(subFile[0],'UTF-8');
    reader.onload = function(e){
        let data = e.target.result;
        if(type == 'json') data = JSON.parse(data);
        else if(type == 'json5') data = JSON5.parse(data);
        writeTable(data);
    };
};

function edit(location){
    let i = location.split('.')[0];
    let j = location.split('.')[1];
    document.getElementById('content').value = JSON5.stringify(script[i].groups[j],null,2);
    document.getElementById('edit').style.display = 'block';
    document.querySelector('.close').onclick = function(){
        document.getElementById('edit').style.display = 'none';
    };
    document.getElementById('save').onclick = function(){
        script[i].groups[j] = JSON5.parse(document.getElementById('content').value);
        alert('保存成功！请不要刷新网页，否则会导致修改丢失');
        document.getElementById('edit').style.display = 'none';
    };
};

function copyPackageName(location){
    let i = location.split('.')[0];
    navigator.clipboard.writeText(JSON5.stringify(script[i].id).slice(1,-1)).then(() => {
        alert('已复制到剪切板');
    });
};

function switchStatus(type){
    if(type == 'memorize'){
        localStorage.setItem(String(fullScript.id), JSON5.stringify(script));
        alert('全部都记下来了！');
    }
    else if(type == 'read'){
        try{
            let result = localStorage.getItem(String(fullScript.id));
            throw result;
        } catch (error){
            if(error == null){
                alert('我的脑子里似乎没有这方面的记忆');
                return
            }
        }
        alert('一字不落地还原了！');
        script = JSON5.parse(localStorage.getItem(String(fullScript.id)));
        fullScript.apps = script;
        document.getElementById('subVer').innerHTML = '<span>订阅版本：' + fullScript.version + '</span>';
        document.getElementById('codeVer').innerHTML = '<span>当前程序版本：' + codeVer + '</span>';
        document.getElementById('appList').innerHTML = initTable;
        var eachAppRules = '';
        for(let i in script){
            var packageName, appName, ruleName, desc, style;
            packageName = script[i].id;
            appName = script[i].name;
            for(let j in script[i].groups){
                ruleName = script[i].groups[j].name;
                if(script[i].groups[j].hasOwnProperty('enable') == true){
                    if(script[i].groups[j]['enable'] == false) style = 'color: red;';
                    else style = 'color: green;';
                }
                else style = 'color: green;';
                if(script[i].groups[j].hasOwnProperty('desc') == true) desc = script[i].groups[j].desc;
                else desc = '该规则暂无描述';
                eachAppRules += tableInfo(appName, packageName, String(i) + '.' + String(j), style, ruleName, desc);
            };
        };
        let ruleList = document.querySelector('tbody');
        ruleList.innerHTML = eachAppRules;
    }
};

function getThirdPartySub(){
    let userselect = document.getElementById("thirdParty");
    let index = userselect.selectedIndex;
    if(userselect.options[index].value == 'Adpro'){
        axios.get('/adpro/cdn/gh/Adpro-Team/GKD_subscription@main/dist/Adpro_gkd.json5').then((data)=>{
            data = JSON5.parse(data.data);
            writeTable(data);
            alert('导入成功！');
        });
    }
    else if(userselect.options[index].value == 'AIsouler'){
        axios.get('/adpro/cdn/gh/AIsouler/subscription@main/dist/AIsouler_gkd.json5').then((data)=>{
            data = JSON5.parse(data.data);
            writeTable(data);
            alert('导入成功！');
        });
    }
    else if(userselect.options[index].value == 'aoguai'){
        axios.get('/adpro/cdn/gh/aoguai/subscription@custom/dist/aoguai_gkd.json5').then((data)=>{
            data = JSON5.parse(data.data);
            writeTable(data);
            alert('导入成功！');
        });
    }
    else if(userselect.options[index].value == 'ganlinte'){
        axios.get('/adpro/cdn/gh/ganlinte/GKD-subscription@main/dist/ganlin_gkd.json5').then((data)=>{
            data = JSON5.parse(data.data);
            writeTable(data);
            alert('导入成功！');
        });
    }
};

function launch_GKD(){
    const options = {
        scheme: {
            protocol: 'gkd',
            host: 'import',
        },
        intent: {
            package: 'li.songe.gkd',
            scheme: 'gkd',
        },
        fallback: 'https://gkd.li/guide/#%E4%B8%8B%E8%BD%BD%E5%AE%89%E8%A3%85',
    };
    const callLib = new CallApp(options);
    callLib.open({
        path: 'import',
    });
};

//复用代码
function tableInfo(appName, packageName, id, style, ruleName, desc){
    let result = `
    <tr>
        <td>${appName}</td>
        <td>
            ${packageName}
            <button onclick="copyPackageName('${id}');">复制</button>
        </td>
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

function writeTable(data){
    fullScript = data;
    script = data.apps;
    document.getElementById('subVer').innerHTML = '<span>订阅版本：' + data.version + '</span>';
    document.getElementById('codeVer').innerHTML = '<span>当前程序版本：' + codeVer + '</span>';
    document.getElementById('appList').innerHTML = initTable;
    var eachAppRules = '';
    for(let i in data.apps){
        var packageName, appName, ruleName, desc, style;
        packageName = data.apps[i].id;
        appName = data.apps[i].name;
        for(let j in data.apps[i].groups){
            ruleName = data.apps[i].groups[j].name;
            if(data.apps[i].groups[j].hasOwnProperty('enable') == true){
                if(data.apps[i].groups[j]['enable'] == false) style = 'color: red;';
                else style = 'color: green;';
            }
            else style = 'color: green;';
            if(data.apps[i].groups[j].hasOwnProperty('desc') == true) desc = data.apps[i].groups[j].desc;
            else desc = '该规则暂无描述';
            eachAppRules += tableInfo(appName, packageName, String(i) + '.' + String(j), style, ruleName, desc);
        };
    };
    let ruleList = document.querySelector('tbody');
    ruleList.innerHTML = eachAppRules;
};