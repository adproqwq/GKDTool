function changeSwitch(index,job){
    var location = index.split('.');
    var i = location[0], j = location[1];
    if(job == 'on'){
        if(script[i].groups[j].hasOwnProperty('enable') == true){
            delete script[i].groups[j].enable;
            alert('已打开');
        }
        else alert('该规则已经打开了');
    }
    else if(job == 'off'){
        if(script[i].groups[j].hasOwnProperty('enable') == true) alert('该规则已经关闭了');
        else{
            script[i].groups[j]['enable'] = 'false';
            alert('已关闭');
        }
    }
};

function search(){
    var target = document.getElementById('name').value;
    var initTable = `
    <table border="1">
        <thead>
            <tr>
                <th>应用名</th>
                <th>包名</th>
                <th>规则名</th>
                <th>规则描述</th>
                <th>操作</th>
            </tr>
        </thead>
        <tbody></tbody>
    </table>`;
    document.getElementById('appList').innerHTML = initTable;
    eachAppRules = '';
    for(var i in script){
        if(script[i].name == target){
            var packageName, appName, ruleName, desc;
            packageName = script[i].id;
            appName = script[i].name;
            for(var j in script[i].groups){
                ruleName = script[i].groups[j].name;
                if(script[i].groups[j].hasOwnProperty('desc') == true) desc = script[i].groups[j].desc;
                else desc = '该规则暂无描述';
                eachAppRules += `
                <tr>
                    <td>${appName}</td>
                    <td>${packageName}</td>
                    <td>${ruleName}</td>
                    <td>${desc}</td>
                    <td>
                        <button onclick="changeSwitch('${String(i) + '.' + String(j)}','on');">打开</button>
                        <button onclick="changeSwitch('${String(i) + '.' + String(j)}','off');">关闭</button>
                    </td>
                </tr>`;
            };
        }
    }
    var ruleList = document.querySelector('tbody');
    ruleList.innerHTML = eachAppRules;
};

function output(){
    navigator.clipboard.writeText(JSON5.stringify(script).slice(1,-1)).then(() => {
        alert('已复制到剪切板');
    });
};

var script;
axios.get('../gkd.json5').then(function(data){
    data = JSON5.parse(data.data);
    script = data.apps;
    var initTable = `
    <table border="1">
        <thead>
            <tr>
                <th>应用名</th>
                <th>包名</th>
                <th>规则名</th>
                <th>规则描述</th>
                <th>操作</th>
            </tr>
        </thead>
        <tbody></tbody>
    </table>`;
    document.getElementById('subVer').innerHTML = '<span>订阅版本：' + data.version + '</span>';
    document.getElementById('appList').innerHTML = initTable;
    var eachAppRules = '';
    for(var i in data.apps){
        var packageName, appName, ruleName, desc;
        packageName = data.apps[i].id;
        appName = data.apps[i].name;
        for(var j in data.apps[i].groups){
            ruleName = data.apps[i].groups[j].name;
            if(data.apps[i].groups[j].hasOwnProperty('desc') == true) desc = data.apps[i].groups[j].desc;
            else desc = '该规则暂无描述';
            eachAppRules += `
            <tr>
                <td>${appName}</td>
                <td>${packageName}</td>
                <td>${ruleName}</td>
                <td>${desc}</td>
                <td>
                    <button onclick="changeSwitch('${String(i) + '.' + String(j)}','on');">打开</button>
                    <button onclick="changeSwitch('${String(i) + '.' + String(j)}','off');">关闭</button>
                </td>
            </tr>`;
        };
    };
    var ruleList = document.querySelector('tbody');
    ruleList.innerHTML = eachAppRules;
});