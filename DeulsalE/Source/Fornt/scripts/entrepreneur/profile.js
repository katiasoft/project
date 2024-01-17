const contents = document.getElementById('contents');
const mapCostList = document.getElementById('mapCostList');
const costList = document.getElementById('costList');

// let index;
let addPlaceIndex = 0;
let deleteIndex = [];
let imagePlaceCount = 10;
let isFileLoad = false;
let interval;

function initImageClass(){
    if(isFileLoad === true){
        // console.log("끝")
        setClose();
        setPlus();
        clearInterval(interval);
    }
}

function setThumbnail(event) {
    if (event.target.files[0] == null)
        return;
    // console.log("시작");
    interval = setInterval(initImageClass, 100);
    let reader = new FileReader();
    reader.onload = function (event) {
        let img = document.createElement('img');
        img.setAttribute("src", event.target.result);
        document.querySelector("div#imagePlace" + (addPlaceIndex)).appendChild(img);
    };
    reader.readAsDataURL(event.target.files[0]);
    const icon = document.querySelector("div#imagePlace" + (addPlaceIndex) + ">div");
    icon.classList.remove('plus');
    icon.classList.add('close');

    isFileLoad = true;
    // console.log("로드 종료");
}

function addImage(i) {
    const imagePlace = document.getElementById('imagePlace' + i);
    imagePlace.querySelector('input').click();
}

function setPlus() {
    let count = 0;
    for (let plus of document.getElementsByClassName('plus')) {
        if (count === 0) {
            addPlaceIndex = Number.parseInt(plus.getAttribute('rel'));
            console.log(addPlaceIndex);
            count++;
        }
        plus.onclick = () => {
            if (!plus.classList.contains('plus')) {
                return;
            }
            addImage(addPlaceIndex);
        };
    }
}

function setClose() {
    for (let close of document.getElementsByClassName('close')) {
        close.onclick = () => {
            if (!close.classList.contains('close')) {
                return;
            }
            deleteImg(close.getAttribute('rel'));
        };
    }
}

function deleteImg(i) {
    const imagePlace = document.querySelector("div#imagePlace" + i);
    let alt = imagePlace.querySelector('img').getAttribute('alt');
    deleteIndex.push(alt);
    imagePlace.remove();
    document.getElementById('imageContainer').innerHTML += `<div class="image" id="imagePlace${imagePlaceCount}">
                        <input hidden="hidden" type="file"  onchange="setThumbnail(event)">
                        <div class="plus" rel="${imagePlaceCount}"></div>
                    </div>`
    const icon = document.querySelector("div#imagePlace" + imagePlaceCount + ">div");
    icon.onclick = () => {
        addImage(icon.getAttribute('rel'));
    }
    setClose();
    setPlus();
}

window.onload = () => {
    setClose();
    setPlus();
}

contents.profileForm = contents.querySelector('[rel="profileForm"]');

if(contents.profileForm !== null){
    function changeCnt(chk, cnt) {
        if (contents.profileForm[chk].checked === true) {
            contents.newCampingForm[cnt].removeAttribute('disabled');
            contents.profileForm[cnt].value = 1;
        } else {
            contents.newCampingForm[cnt].setAttribute('disabled', 'disabled');
            contents.profileForm[cnt].value = 0;
        }
    }

    contents.profileForm['generalChk'].onchange = () => {
        changeCnt('generalChk', 'generalCnt');
    };
    contents.profileForm['autoChk'].onchange = () => {
        changeCnt('autoChk', 'autoCnt');
    };
    contents.profileForm['caravanChk'].onchange = () => {
        changeCnt('caravanChk', 'caravanCnt');
    };
    contents.profileForm['glampingChk'].onchange = () => {
        changeCnt('glampingChk', 'glampingCnt');
    };

    contents.profileForm['toiletChk'].onchange = () => {
        changeCnt('toiletChk', 'toilet');
    };
    contents.profileForm['bathChk'].onchange = () => {
        changeCnt('bathChk', 'bath');
    };
    contents.profileForm['sinkChk'].onchange = () => {
        changeCnt('sinkChk', 'sink');
    };
    contents.profileForm['extinguishChk'].onchange = () => {
        changeCnt('extinguishChk', 'extinguish');
    };

// 사업장 수정
    contents.profileForm.onsubmit = e => {
        e.preventDefault();

        if (contents.profileForm['name'].value === '') {
            dialogCover.show();
            dialogLayer.show({
                title: '경고',
                content: '사업장명을 입력 해주세요!',
                onConfirm: e => {
                    e.preventDefault();
                    dialogCover.hide();
                    dialogLayer.hide();
                    document.getElementById('basicsContainer').toView();
                    contents.profileForm['name'].focus()
                }
            });
            return;
        }
        if (contents.profileForm['business'].value === '') {
            dialogCover.show();
            dialogLayer.show({
                title: '경고',
                content: '사업주체를 선택 해주세요!',
                onConfirm: e => {
                    e.preventDefault();
                    dialogCover.hide();
                    dialogLayer.hide();
                    document.getElementById('basicsContainer').toView();
                }
            });
            return;
        }

        if (contents.profileForm['contactFirst'].value === '') {
            dialogCover.show();
            dialogLayer.show({
                title: '경고',
                content: '전화번호를 입력 해주세요!',
                onConfirm: e => {
                    e.preventDefault();
                    dialogCover.hide();
                    dialogLayer.hide();
                    document.getElementById('basicsContainer').toView();
                    contents.profileForm['contactFirst'].focus()
                }
            });
            return;
        }

        if (contents.profileForm['contactSecond'].value === '') {
            dialogCover.show();
            dialogLayer.show({
                title: '경고',
                content: '전화번호를 입력 해주세요!',
                onConfirm: e => {
                    e.preventDefault();
                    dialogCover.hide();
                    dialogLayer.hide();
                    document.getElementById('basicsContainer').toView();
                    contents.profileForm['contactSecond'].focus()
                }
            });
            return;
        }

        if (contents.profileForm['contactThird'].value === '') {
            dialogCover.show();
            dialogLayer.show({
                title: '경고',
                content: '전화번호를 입력 해주세요!',
                onConfirm: e => {
                    e.preventDefault();
                    dialogCover.hide();
                    dialogLayer.hide();
                    document.getElementById('basicsContainer').toView();
                    contents.profileForm['contactThird'].focus()
                }
            });
            return;
        }

        if (contents.profileForm['url'].value === '') {
            dialogCover.show();
            dialogLayer.show({
                title: '경고',
                content: '홈페이지를 입력 해주세요!',
                onConfirm: e => {
                    e.preventDefault();
                    dialogCover.hide();
                    dialogLayer.hide();
                    document.getElementById('basicsContainer').toView();
                    contents.profileForm['url'].focus()
                }
            });
            return;
        }

        if (contents.profileForm['isWeekday'].value === '') {
            dialogCover.show();
            dialogLayer.show({
                title: '경고',
                content: '평일 운영을 선택 해주세요!',
                onConfirm: e => {
                    e.preventDefault();
                    dialogCover.hide();
                    dialogLayer.hide();
                    document.getElementById('operationContainer').toView();
                }
            });
            return;
        }

        if (contents.profileForm['isWeekend'].value === '') {
            dialogCover.show();
            dialogLayer.show({
                title: '경고',
                content: '주말 운영을 선택 해주세요!',
                onConfirm: e => {
                    e.preventDefault();
                    dialogCover.hide();
                    dialogLayer.hide();
                    document.getElementById('operationContainer').toView();
                }
            });
            return;
        }

        if (contents.profileForm['spring'].checked === false &&
            contents.profileForm['summer'].checked === false &&
            contents.profileForm['fall'].checked === false &&
            contents.profileForm['winter'].checked === false) {
            dialogCover.show();
            dialogLayer.show({
                title: '경고',
                content: '계절 운영을 최소한 하나 이상 선택 해주세요!',
                onConfirm: e => {
                    e.preventDefault();
                    dialogCover.hide();
                    dialogLayer.hide();
                    document.getElementById('operationContainer').toView();
                }
            });
            return;
        }

        if (contents.profileForm['generalChk'].checked === false &&
            contents.profileForm['autoChk'].checked === false &&
            contents.profileForm['glampingChk'].checked === false &&
            contents.profileForm['caravanChk'].checked === false) {
            dialogCover.show();
            dialogLayer.show({
                title: '경고',
                content: '시설 정보을 최소한 하나 이상 선택 해주세요!',
                onConfirm: e => {
                    e.preventDefault();
                    dialogCover.hide();
                    dialogLayer.hide();
                    document.getElementById('facilityContainer').toView();
                }
            });
            return;
        }

        if (contents.profileForm['peripheralChk'].checked == false &&
            contents.profileForm['fishing'].checked === false &&
            contents.profileForm['trailsOut'].checked === false &&
            contents.profileForm['seaBath'].checked === false &&
            contents.profileForm['leisure'].checked === false &&
            contents.profileForm['valley'].checked === false &&
            contents.profileForm['river'].checked === false &&
            contents.profileForm['poll'].checked === false &&
            contents.profileForm['exTeen'].checked === false &&
            contents.profileForm['exCountry'].checked === false &&
            contents.profileForm['amuseKid'].checked === false) {
            dialogCover.show();
            dialogLayer.show({
                title: '경고',
                content: '주변 시설을 하나도 선택하지 않았습니다.<br><br>선택하지 않을 시 사업장 정보에 표기 되지 않습니다.<br><br>그대로 진행하시겠습니까?',
                onConfirm: e => {
                    e.preventDefault();
                    dialogCover.hide();
                    dialogLayer.hide();
                    contents.profileForm['peripheralChk'].checked = true;
                    contents.profileForm.onsubmit(e);
                },
                onCancel: e => {
                    e.preventDefault();
                    dialogCover.hide();
                    dialogLayer.hide();
                    document.getElementById('facilityContainer').toView();
                }
            });
            return;
        }

        if (contents.profileForm['grampingFacilityChk'].checked == false &&
            contents.profileForm['glampingChk'].checked === true &&
            contents.profileForm['bed'].checked === false &&
            contents.profileForm['television'].checked === false &&
            contents.profileForm['refrigerator'].checked === false &&
            contents.profileForm['internet'].checked === false &&
            contents.profileForm['grampingToilet'].checked === false &&
            contents.profileForm['airConditioner'].checked === false &&
            contents.profileForm['heater'].checked === false &&
            contents.profileForm['utensil'].checked === false) {
            dialogCover.show();
            dialogLayer.show({
                title: '경고',
                content: '글램핑 시설을 하나도 선택하지 않았습니다.<br><br>선택하지 않을 시 사업장 정보에 표기 되지 않습니다.<br><br>그대로 진행하시겠습니까?',
                onConfirm: e => {
                    e.preventDefault();
                    dialogCover.hide();
                    dialogLayer.hide();
                    contents.profileForm['grampingFacilityChk'].checked = true;
                    contents.profileForm.onsubmit(e);
                },
                onCancel: e => {
                    e.preventDefault();
                    dialogCover.hide();
                    dialogLayer.hide();
                    document.getElementById('facilityContainer').toView();
                }
            });
            return;
        }

        if (contents.profileForm['characteristicsChk'].checked == false && contents.profileForm['characteristics'].value === '') {
            dialogCover.show();
            dialogLayer.show({
                title: '경고',
                content: '시설 특징을 입력 하지 않았습니다.<br><br>입력하지 않을 시 사업장 정보에 표기되지 않습니다.<br><br>그대로 진행하시겠습니까?',
                onConfirm: e => {
                    e.preventDefault();
                    dialogCover.hide();
                    dialogLayer.hide();
                    contents.profileForm['characteristicsChk'].checked = true;
                    contents.profileForm.onsubmit(e);
                },
                onCancel: e => {
                    e.preventDefault();
                    dialogCover.hide();
                    dialogLayer.hide();
                    document.getElementById('facilityContainer').toView();
                    contents.profileForm['characteristics'].focus();
                }
            });
            return;
        }


        if (contents.profileForm['introductionChk'].checked == false &&
            contents.profileForm['introduction'].value === '') {
            dialogCover.show();
            dialogLayer.show({
                title: '경고',
                content: '시설 소개글을 입력 하지 않았습니다.<br><br>입력하지 않을 시 사업장 정보에 표기되지 않습니다.<br><br>그대로 진행하시겠습니까?',
                onConfirm: e => {
                    e.preventDefault();
                    dialogCover.hide();
                    dialogLayer.hide();
                    contents.profileForm['introductionChk'].checked = true;
                    contents.profileForm.onsubmit(e);
                },
                onCancel: e => {
                    e.preventDefault();
                    dialogCover.hide();
                    dialogLayer.hide();
                    document.getElementById('facilityContainer').toView();
                    contents.profileForm['introduction'].focus();
                }
            });
            return;
        }

        if (contents.profileForm['isReservation'].value === 'true') {
            // let costListLen;
            if(mapCostList !== null)
                readCostList(mapCostList, true);
            else
                readCostList(costList, true);
            // console.log(costListLen);
            if (Object.keys(prevCostList).length === 0) {
                dialogCover.show();
                dialogLayer.show({
                    title: '경고',
                    content: '비용 리스트를 작성 해주세요!',
                    onConfirm: e => {
                        e.preventDefault();
                        dialogCover.hide();
                        dialogLayer.hide();
                        document.getElementById('newReservationContainer').toView();
                    }
                });
                return;
            }
        }

        // console.log(deleteIndex);

        const xhr = new XMLHttpRequest();
        const formData = new FormData();
        formData.append('campsiteIndex', contents.profileForm['index'].value);
        formData.append('name', contents.profileForm['name'].value);
        formData.append('business', contents.profileForm['business'].value);
        formData.append('contact', '' + contents.profileForm['contactFirst'].value + '-' + contents.profileForm['contactSecond'].value + '-' + contents.profileForm['contactThird'].value);
        formData.append('url', contents.profileForm['url'].value);

        formData.append('weekday', contents.profileForm['isWeekday'].value);
        formData.append('weekend', contents.profileForm['isWeekend'].value);
        formData.append('spring', contents.profileForm['spring'].checked);
        formData.append('summer', contents.profileForm['summer'].checked);
        formData.append('fall', contents.profileForm['fall'].checked);
        formData.append('winter', contents.profileForm['winter'].checked);

        formData.append('generalCnt', contents.profileForm['generalCnt'].value);
        formData.append('autoCnt', contents.profileForm['autoCnt'].value);
        formData.append('caravanCnt', contents.profileForm['caravanCnt'].value);
        formData.append('glampingCnt', contents.profileForm['glampingCnt'].value);

        // 부대 시설
        formData.append('elt', contents.profileForm['elt'].checked);
        formData.append('boil', contents.profileForm['boil'].checked);
        formData.append('wifi', contents.profileForm['wifi'].checked);
        formData.append('firewood', contents.profileForm['firewood'].checked);
        formData.append('trailsIn', contents.profileForm['trailsIn'].checked);
        formData.append('market', contents.profileForm['market'].checked);
        formData.append('toilet', contents.profileForm['toilet'].value);
        formData.append('bath', contents.profileForm['bath'].value);
        formData.append('sink', contents.profileForm['sink'].value);
        formData.append('extinguish', contents.profileForm['extinguish'].value);

        // 주변 시설
        formData.append('fishing', contents.profileForm['fishing'].checked);
        formData.append('trailsOut', contents.profileForm['trailsOut'].checked);
        formData.append('seaBath', contents.profileForm['seaBath'].checked);
        formData.append('leisure', contents.profileForm['leisure'].checked);
        formData.append('valley', contents.profileForm['valley'].checked);
        formData.append('river', contents.profileForm['river'].checked);
        formData.append('poll', contents.profileForm['poll'].checked);
        formData.append('exTeen', contents.profileForm['exTeen'].checked);
        formData.append('exCountry', contents.profileForm['exCountry'].checked);
        formData.append('amuseKid', contents.profileForm['amuseKid'].checked);

        // 글램핑 시설
        formData.append('bed', contents.profileForm['bed'].checked);
        formData.append('television', contents.profileForm['television'].checked);
        formData.append('refrigerator', contents.profileForm['refrigerator'].checked);
        formData.append('internet', contents.profileForm['internet'].checked);
        formData.append('grampingToilet', contents.profileForm['grampingToilet'].checked);
        formData.append('airConditioner', contents.profileForm['airConditioner'].checked);
        formData.append('heater', contents.profileForm['heater'].checked);
        formData.append('utensil', contents.profileForm['utensil'].checked);

        formData.append('characteristics', contents.profileForm['characteristics'].value);
        formData.append('introduction', contents.profileForm['introduction'].value);

        formData.append('isReservation', contents.profileForm['isReservation'].value);
        if (Object.keys(prevCostList).length !== 0) {
            formData.append('costList', JSON.stringify(prevCostList));
        }

        for (let close of document.getElementsByClassName('image')) {
            let input = close.querySelector('input');
            if(input !== null){
                if(input.files[0] !== undefined) {
                    formData.append('files', input.files[0]);
                }
            }
        }

        if(deleteIndex.length > 0){
            for (const index of deleteIndex) {
                formData.append('deleteIndex', index);
            }
        }else {
            formData.append('deleteIndex', '0');
        }


        xhr.open('POST', `./profile/modify`);
        xhr.onreadystatechange = () =>{
            dialogCover.show();
            if(xhr.readyState === XMLHttpRequest.DONE){
                if(xhr.status >= 200 && xhr.status < 300){
                    const responseObject = JSON.parse(xhr.responseText);
                    switch (responseObject.result) {
                        case 'failure':
                            dialogCover.show();
                            dialogLayer.show({
                                title: '경고',
                                content: '오류가 발생하였습니다.<br><br>잠시후 다시 시도해 주세요.',
                                onConfirm: e => {
                                    e.preventDefault();
                                    dialogCover.hide();
                                    dialogLayer.hide();
                                }
                            });
                            break;
                        case 'failure_processing':
                            dialogCover.show();
                            dialogLayer.show({
                                title: '경고',
                                content: '이미 삭제된 사업장입니다.<br><br>확인 후 다시 시도 해주세요.',
                                onConfirm: e => {
                                    e.preventDefault();
                                    dialogCover.hide();
                                    dialogLayer.hide();
                                }
                            });
                            break;
                        case 'success':
                            dialogCover.show();
                            dialogComplete.show({
                                title: '프로필',
                                content: '사업장이 수정되었습니다.',
                                onConfirm: e => {
                                    e.preventDefault();
                                    dialogCover.hide();
                                    dialogComplete.hide();
                                    location.href += '';
                                }
                            });
                            break;
                        default:
                            dialogCover.show();
                            dialogLayer.show({
                                title: '경고',
                                content: '서버에서 알 수 없는 결과를 반환하였습니다.<br><br>잠시후 다시시도해 주세요.',
                                onConfirm: e => {
                                    e.preventDefault();
                                    dialogCover.hide();
                                    dialogLayer.hide();
                                }
                            });
                    }
                }else{
                    dialogCover.show();
                    dialogLayer.show({
                        title: '경고',
                        content: '서버 통신에 문제가 발생하였습니다.<br><br>잠시후 다시시도해 주세요.',
                        onConfirm: e => {
                            e.preventDefault();
                            dialogCover.hide();
                            dialogLayer.hide();
                        }
                    });
                }
            }
        };
        xhr.send(formData);
        dialogCover.hide();
    }
}