var nodesSorted = {};
var path = [];

function readFile(){
    const objFile = document.getElementById('upload');
    if(objFile.value === ''){
        alert('请选择文件');
        return
    }
    const zipFile = JSZip.loadAsync(objFile.files[0]).then((zip) => {
        let jsonName = zip.file(/(.*).json/)[0].name;
        zip.file(jsonName).async('blob').then((jsonBlob) => {
            const reader = new FileReader();
            reader.readAsText(jsonBlob,'UTF-8');
            reader.onload = function(e){
                let data = e.target.result;
                data = JSON.parse(data);
                let nodes = data.nodes;
                for(let i in nodes){
                    let ul = document.getElementById(nodes[i].pid);
                    if(nodes[i].attr.childCount == 0){
                        let li = `<li><button id="single" class="caret">${nodes[i].attr.name.replace(/(.*)\./,'')}</button></li>`;
                        ul.insertAdjacentHTML('beforeend',li);
                    }
                    else{
                        if(nodes[i].attr.childCount == 1){
                            let li = `
                            <li><button id="mul" class="caret">${nodes[i].attr.name.replace(/(.*)\./,'')}</button>
                                <ul id="${nodes[i].id}" class="nested"></ul>
                            </li>`;
                            ul.insertAdjacentHTML('beforeend',li);
                        }
                        else{
                            let li = `
                            <li><button id="mul" class="caret">${nodes[i].attr.name.replace(/(.*)\./,'')}[${nodes[i].attr.childCount}]</button>
                                <ul id="${nodes[i].id}" class="nested"></ul>
                            </li>`;
                            ul.insertAdjacentHTML('beforeend',li);
                        }
                    }
                }
                let toggler = document.getElementsByClassName("caret");
                let btn = -1;
                for(let i = 0;i < toggler.length;i++){
                    toggler[i].addEventListener("click", function(e) {
                        if(e.target.id != 'single'){
                            this.parentElement.querySelector(".nested").classList.toggle("active");
                            this.classList.toggle("caret-down");
                        }
                        if(btn != i){
                            e.target.style = 'background: dodgerblue; opacity: 0.5;';
                            if(btn != -1){
                                toggler[btn].style.background = 'none';
                                toggler[btn].style.opacity = '1';
                            }
                        }
                        document.getElementById('id').innerText = String(nodes[i].attr.id);
                        document.getElementById('vid').innerText = String(nodes[i].attr.vid);
                        document.getElementById('name').innerText = String(nodes[i].attr.name);
                        document.getElementById('text').innerText = String(nodes[i].attr.text);
                        document.getElementById('desc').innerText = String(nodes[i].attr.desc);
                        document.getElementById('clickable').innerText = String(nodes[i].attr.clickable);
                        document.getElementById('focusable').innerText = String(nodes[i].attr.focusable);
                        document.getElementById('checkable').innerText = String(nodes[i].attr.checkable);
                        document.getElementById('checked').innerText = String(nodes[i].attr.checked);
                        document.getElementById('editable').innerText = String(nodes[i].attr.editable);
                        document.getElementById('longClickable').innerText = String(nodes[i].attr.longClickable);
                        document.getElementById('visibleToUser').innerText = String(nodes[i].attr.visibleToUser);
                        document.getElementById('childCount').innerText = String(nodes[i].attr.childCount);
                        document.getElementById('index').innerText = String(nodes[i].attr.index);
                        btn = i;
                    });
                }
                /*const blob = new Blob([JSON.stringify(nodesSorted)],{
                    type: 'application/json'
                });
                const downloadURL = URL.createObjectURL(blob);
                const aTag = document.createElement('a');
                aTag.href = downloadURL;
                aTag.download = 'nodesSorted.json';
                aTag.click();
                URL.revokeObjectURL(downloadURL);*/
            };
        });
    });
    alert('导入完成！');
};