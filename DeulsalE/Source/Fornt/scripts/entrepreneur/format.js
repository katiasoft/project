
let prevCostList = {};
function readCostList(list, isSubmit) {
    prevCostList = {};
    const trList = list.querySelectorAll('tr');
    for (const tr of trList) {
        let siteName = tr.querySelector('[rel="siteName"]').value;
        let cost = tr.querySelector('[rel="cost"]').value;
        let allowPerson = tr.querySelector('[rel="allowPerson"]').value;
        let addPerson = tr.querySelector('[rel="addPerson"]').value;
        let addPersonCost = tr.querySelector('[rel="addPersonCost"]').value;
        if (isSubmit && !(siteName !== '' && cost !== '' && allowPerson !== '' && addPerson !== '' && addPersonCost !== '')) {
            alert('객실 정보를 빠짐없이 입력해 주세요.');
            return;
        }
        if(siteName !== ''){
            let object = {"cost" : cost, "allowPerson" : allowPerson, "addPerson" : addPerson, "addPersonCost" : addPersonCost};
            prevCostList[siteName] = object;
        }
    }
    console.log(prevCostList);
    // return Object.keys(prevCostList).length;
}
function addCostList(list) {
    readCostList(list, false)
    let length = Object.keys(prevCostList).length;
    let keys = Object.keys(prevCostList);
    list.innerHTML = '';
    for (let i = 0; i < length; i++) {
        list.innerHTML += `<tr>
                            <td>
                                <input class="_object-input" type="text" rel="siteName" value="${keys[i]}">
                            </td>
                            <td>
                                <input class="_object-input" type="number" rel="cost" value="${prevCostList[keys[i]]['cost']}">
                            </td>
                            <td>
                                <input class="_object-input small" type="number" rel="allowPerson" value="${prevCostList[keys[i]]['allowPerson']}">
                            </td>
                            <td>
                                <input class="_object-input small" type="number" rel="addPerson" value="${prevCostList[keys[i]]['addPerson']}">
                            </td>
                            <td>
                                <input class="_object-input" type="number" rel="addPersonCost" value="${prevCostList[keys[i]]['addPersonCost']}">
                            </td>
                        </tr>`;
    }
    list.innerHTML += `<tr>
                            <td>
                                <input class="_object-input" type="text" rel="siteName">
                            </td>
                            <td>
                                <input class="_object-input" type="number" rel="cost">
                            </td>
                            <td>
                                <input class="_object-input small" type="number" rel="allowPerson">
                            </td>
                            <td>
                                <input class="_object-input small" type="number" rel="addPerson">
                            </td>
                            <td>
                                <input class="_object-input" type="number" rel="addPersonCost">
                            </td>
                        </tr>`;
}

function deleteCostList(list) {
    const trList = list.querySelectorAll('tr');
    if (trList.length <= 1) {
        alert("더이상 삭제할 수 없습니다.");
        return;
    }
    trList[trList.length - 1].remove();
}

function fileUpload(form, fileId) {
    const fileInput = document.getElementById(fileId);
    if (fileInput.files.length === 0) {
        form.querySelector('[rel="imageName"]').innerText = '파일을 업로드 하여 주세요.'
        return;
    } else if(fileInput.files.length > 5){
        dialogCover.show();
        dialogLayer.show({
            title: '경고',
            content: '최대 5개까지만 업로드할 수 있습니다.',
            onConfirm: e => {
                e.preventDefault();
                dialogCover.hide();
                dialogLayer.hide();
                // 선택한 파일들 초기화
                form.querySelector('[rel="imageName"]').innerText = '파일을 업로드 하여 주세요.'
            }
        });
        return;
    }
    else {
        form.querySelector('[rel="imageName"]').innerText = `${fileInput.files[0].name} 외 ${fileInput.files.length - 1}개`;
    }
}


function moveRegistration(){
    window.location.href = `/entrepreneur/registration`;
}