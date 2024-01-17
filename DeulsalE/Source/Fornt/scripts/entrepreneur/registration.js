const contents = document.getElementById("contents");
contents.existingBtn = contents.querySelector('[rel="existingBtn"]');
contents.newCampingBtn = contents.querySelector('[rel="newCampingBtn"]');

contents.existingForm = contents.querySelector('[rel="existingForm"]');
contents.newCampingForm = contents.querySelector('[rel="newCampingForm"]');

contents.existing = contents.getElementsByClassName('existing');

contents.newCamping = contents.getElementsByClassName('newCamping');

contents.costAddBtn = contents.querySelector('[rel="costAddBtn"]');

contents.costDeleteBtn = contents.querySelector('[rel="costDeleteBtn"]');

contents.newCostAddBtn = contents.querySelector('[rel="newCostAddBtn"]');

contents.newCostDeleteBtn = contents.querySelector('[rel="newCostDeleteBtn"]');

const costList = document.getElementById('costList');
const newCostList = document.getElementById('newCostList');


contents.existingBtn.addEventListener('click', () => {
    contents.classList.remove('existing');
    contents.classList.remove('newCamping');
    contents.classList.add('existing');

    contents.existingBtn.classList.remove('selected');
    contents.newCampingBtn.classList.remove('selected');

    contents.existingBtn.classList.add('selected');

    contents.existingForm.classList.remove('visible');
    contents.newCampingForm.classList.remove('visible');
    contents.newCampingForm.classList.add('visible');
});

contents.newCampingBtn.addEventListener('click', () => {
    contents.classList.remove('existing');
    contents.classList.remove('newCamping');
    contents.classList.add('newCamping');

    contents.existingBtn.classList.remove('selected');
    contents.newCampingBtn.classList.remove('selected');

    contents.newCampingBtn.classList.add('selected');

    contents.existingForm.classList.remove('visible');
    contents.newCampingForm.classList.remove('visible');
    contents.existingForm.classList.add('visible');

    mapReset();
});

// let prevCostList = {};
//
// function readCostList(list) {
//     prevCostList = {};
//     const trList = list.querySelectorAll('tr');
//     for (const tr of trList) {
//         let category = tr.querySelector('[rel="category"]').value;
//         let cost = tr.querySelector('[rel="cost"]').value;
//         if (category !== '' && cost === '') {
//             alert('항목은 기재 하였으나 비용을 기재하지 않았습니다.');
//             return;
//         }
//         if (category === '' && cost !== '') {
//             alert('비용은 기재 하였으나 항목을 기재하지 않았습니다.');
//             return;
//         }
//         if (category !== '' && cost !== '')
//             prevCostList[category] = cost;
//     }
//     console.log(prevCostList);
// }

// function addCostList(list) {
//     readCostList(list)
//     let length = Object.keys(prevCostList).length;
//     let keys = Object.keys(prevCostList);
//     let values = Object.values(prevCostList);
//     list.innerHTML = '';
//     for (let i = 0; i < length; i++) {
//         list.innerHTML += `<tr>
//                             <td>
//                                 <input class="_object-input" type="text" rel="category"
//                                 value="${keys[i]}">
//                             </td>
//                             <td>
//                                 <input class="_object-input" type="number" rel="cost" value="${values[i]}">
//                             </td>
//                         </tr>`;
//     }
//     list.innerHTML += `<tr>
//                             <td>
//                                 <input class="_object-input" type="text" rel="category">
//                             </td>
//                             <td>
//                                 <input class="_object-input" type="number" rel="cost">
//                             </td>
//                         </tr>`;
// }
//
// function deleteCostList(list) {
//     const trList = list.querySelectorAll('tr');
//     if (trList.length <= 1) {
//         alert("더이상 삭제할 수 없습니다.");
//         return;
//     }
//     trList[trList.length - 1].remove();
// }

contents.existingForm.fileButton = contents.existingForm.querySelector('[rel="fileButton"]');

contents.existingForm.fileButton.addEventListener('click', () => {
    document.getElementById("uploadFiles").click();
});

function fileUpload(form, fileId) {
    const fileInput = document.getElementById(fileId);
    if (fileInput.files.length === 0) {
        form.querySelector('[rel="fileName"]').innerText = '파일을 업로드 하여 주세요.'
        return;
    } else {
        form.querySelector('[rel="fileName"]').innerText = fileInput.files[0].name;
    }
}

function insertCampsiteIndex(index) {
    const trList = document.getElementById('commentContainer').querySelectorAll('tr');
    for (const tr of trList) {
        tr.classList.remove('click');
    }
    document.getElementById(index).classList.add('click');
    contents.existingForm['campsiteIndex'].value = index;
    console.log(contents.existingForm['campsiteIndex'].value);
}

contents.existingForm['existingSearch'].addEventListener('click', () => {
    location.href = `?page=1&sName=${contents.existingForm['searchCriterion'].value.toLowerCase().trim()}`;
});

contents.existingForm['searchCriterion'].addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        contents.existingForm['existingSearch'].click();
    }
});

document.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
    };
});

// 기존 사업장 등록
contents.existingForm.onsubmit = e => {
    e.preventDefault();
    let files = contents.existingForm['file'].files;
    if (contents.existingForm['campsiteIndex'].value === '') {
        dialogCover.show();
        dialogLayer.show({
            title: '경고',
            content: '야영장을 선택 해주세요!',
            onConfirm: e => {
                e.preventDefault();
                dialogCover.hide();
                dialogLayer.hide();
                document.getElementById('campsitesSelect').toView();
            }
        });
        return;
    }
    if (contents.existingForm['agreeIndividual'].checked === false) {
        dialogCover.show();
        dialogLayer.show({
            title: '경고',
            content: '개인정보 동의를 해주세요!',
            onConfirm: e => {
                e.preventDefault();
                dialogCover.hide();
                dialogLayer.hide();
                document.getElementById('individualContainer').toView();
            }
        });
        return;
    }

    if (contents.existingForm['agreeBusiness'].checked === false) {
        dialogCover.show();
        dialogLayer.show({
            title: '경고',
            content: '사업자등록증 동의를 해주세요!',
            onConfirm: e => {
                e.preventDefault();
                dialogCover.hide();
                dialogLayer.hide();
                document.getElementById('businessContainer').toView();
            }
        });
        return;
    }

    if (files.length === 0) {
        dialogCover.show();
        dialogLayer.show({
            title: '경고',
            content: '사업자등록증을 첨부 해주세요!',
            onConfirm: e => {
                e.preventDefault();
                dialogCover.hide();
                dialogLayer.hide();
                document.getElementById('fileContainer').toView();
            }
        });
        return;
    }
    if (contents.existingForm['isReservation'].value === 'true') {
        readCostList(costList, true);
        console.log(Object.keys(prevCostList).length);
        if (Object.keys(prevCostList).length === 0) {
            dialogCover.show();
            dialogLayer.show({
                title: '경고',
                content: '비용 리스트를 작성 해주세요!',
                onConfirm: e => {
                    e.preventDefault();
                    dialogCover.hide();
                    dialogLayer.hide();
                    document.getElementById('reservationContainer').toView();
                }
            });
            return;
        }
    }
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('index', contents.existingForm['campsiteIndex'].value);
    formData.append('files', files[0]);
    formData.append('isReservation', contents.existingForm['isReservation'].value);
    if (Object.keys(prevCostList).length !== 0) {
        formData.append('costList', JSON.stringify(prevCostList));
    }
    xhr.open('POST', `./registration/register`);
    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status >= 200 && xhr.status < 300) {
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
                            content: '이미 사업자가 등록된 사업장입니다.<br><br>확인 후 다시 시도 해주세요.',
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
                            title: '사업자등록',
                            content: '사업자 등록이 되었습니다.',
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
                            content: '서버가 알 수 없는 응답을 반환했습니다.<br><br>관리자에게 문의해 주세요.',
                            onConfirm: e => {
                                e.preventDefault();
                                dialogCover.hide();
                                dialogLayer.hide();
                            }
                        });
                }
            } else {
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
};

// 주소창 출력 구문
const addressLayer = document.getElementById('addressLayer');

addressLayer.show = () => {
    new daum.Postcode({
        oncomplete: (data) => {
            console.log(data);
            contents.newCampingForm['roadAddress'].value = data.roadAddress;
            contents.newCampingForm['addressPostal'].value = data.zonecode;
            contents.newCampingForm['addressSecondary'].value = '';
            contents.newCampingForm['addressSecondary'].focus();
            dialogCover.hide();
            addressLayer.hide();
            if (data.autoJibunAddress !== '') {
                contents.newCampingForm['addressPrimary'].value = data.autoJibunAddress;
                mapAddressSearch(data.autoJibunAddress);
            } else {
                contents.newCampingForm['addressPrimary'].value = data.jibunAddress;
                mapAddressSearch(data.jibunAddress);
            }
        }
    }).embed(addressLayer);
    addressLayer.classList.add('visible');
}

addressLayer.hide = () => addressLayer.classList.remove('visible');

contents.newCampingForm['addressFind'].onclick = () => {
    dialogCover.show();
    addressLayer.show();
}


// 해당 버튼 클릭시 해당 개수 변경
function changeCnt(chk, cnt) {
    if (contents.newCampingForm[chk].checked === true) {
        contents.newCampingForm[cnt].removeAttribute('disabled');
        contents.newCampingForm[cnt].value = 1;
    } else {
        contents.newCampingForm[cnt].setAttribute('disabled', 'disabled');
        contents.newCampingForm[cnt].value = 0;
    }
}

contents.newCampingForm['glampingChk'].onchange = () => {
    const glampingClass = contents.newCampingForm.querySelectorAll(".gramping");
    if (contents.newCampingForm['glampingChk'].checked === true) {
        contents.newCampingForm['glampingCnt'].value = 1;
        contents.newCampingForm['glampingCnt'].removeAttribute('disabled');
        for (let glamping of glampingClass) {
            glamping.classList.remove('visible');
        }
    } else {
        contents.newCampingForm['glampingCnt'].value = 0;
        contents.newCampingForm['glampingCnt'].setAttribute('disabled','disabled');
        for (let glamping of glampingClass) {
            glamping.classList.add('visible');
        }
    }
}
contents.newCampingForm['generalChk'].onchange = () => {
    changeCnt('generalChk', 'generalCnt');
};
contents.newCampingForm['autoChk'].onchange = () => {
    changeCnt('autoChk', 'autoCnt');
};
contents.newCampingForm['caravanChk'].onchange = () => {
    changeCnt('caravanChk', 'caravanCnt');
};
// contents.newCampingForm['glampingChk'].onchange = () => {
//     changeCnt('glampingChk', 'glampingCnt');
// };

contents.newCampingForm['toiletChk'].onchange = () => {
    changeCnt('toiletChk', 'toilet');
};
contents.newCampingForm['bathChk'].onchange = () => {
    changeCnt('bathChk', 'bath');
};
contents.newCampingForm['sinkChk'].onchange = () => {
    changeCnt('sinkChk', 'sink');
};
contents.newCampingForm['extinguishChk'].onchange = () => {
    changeCnt('extinguishChk', 'extinguish');
};


contents.newCampingForm.fileButton = contents.newCampingForm.querySelector('[rel="fileButton"]');

contents.newCampingForm.fileButton.addEventListener('click', () => {
    document.getElementById("newUploadFiles").click();
});

function imgUpload(form, fileId) {
    const imgInput = document.getElementById(fileId);
    if (imgInput.files.length === 0 || imgInput.files.length > 10) {
        if (imgInput.files.length > 10) {
            dialogCover.show();
            dialogLayer.show({
                title: '경고',
                content: '사진 첨부는 10개까지만 가능합니다!',
                onConfirm: e => {
                    e.preventDefault();
                    dialogCover.hide();
                    dialogLayer.hide();
                }
            });
        }
        form.querySelector('[rel="imageName"]').innerText = '파일을 업로드 하여 주세요.(10개까지 가능)'
        return;
    } else {
        form.querySelector('[rel="imageName"]').innerText = `${imgInput.files[0].name} 외 ${imgInput.files.length - 1}개`;
    }
}

contents.newCampingForm.imageButton = contents.newCampingForm.querySelector('[rel="imageButton"]');

contents.newCampingForm.imageButton.addEventListener('click', () => {
    document.getElementById("uploadImages").click();
});

contents.newCampingForm['addressPostal'].onclick = () =>{
    contents.newCampingForm['addressFind'].click();
}

// 새로운 사업장등록

contents.newCampingForm['generalCnt'].value = 0;
contents.newCampingForm['autoCnt'].value = 0;
contents.newCampingForm['caravanCnt'].value = 0;
contents.newCampingForm['glampingCnt'].value = 0;
contents.newCampingForm['toilet'].value = 0;
contents.newCampingForm['bath'].value = 0;
contents.newCampingForm['sink'].value = 0;
contents.newCampingForm['extinguish'].value = 0;

contents.newCampingForm.onsubmit = e => {
    e.preventDefault();

    let files = contents.newCampingForm['file'].files;

    if (contents.newCampingForm['agreeIndividual'].checked === false) {
        dialogCover.show();
        dialogLayer.show({
            title: '경고',
            content: '개인정보 동의를 해주세요!',
            onConfirm: e => {
                e.preventDefault();
                dialogCover.hide();
                dialogLayer.hide();
                document.getElementById('newIndividualContainer').toView();
            }
        });
        return;
    }

    if (contents.newCampingForm['agreeBusiness'].checked === false) {
        dialogCover.show();
        dialogLayer.show({
            title: '경고',
            content: '사업자등록증 동의를 해주세요!',
            onConfirm: e => {
                e.preventDefault();
                dialogCover.hide();
                dialogLayer.hide();
                contents.newCampingForm['agreeBusiness'].focus();
                document.getElementById('newBusinessContainer').toView();
            }
        });
        return;
    }

    if (files.length === 0) {
        dialogCover.show();
        dialogLayer.show({
            title: '경고',
            content: '사업자등록증을 첨부 해주세요!',
            onConfirm: e => {
                e.preventDefault();
                dialogCover.hide();
                dialogLayer.hide();
                document.getElementById('newFileContainer').toView();
            }
        });
        return;
    }

    if (contents.newCampingForm['name'].value === '') {
        dialogCover.show();
        dialogLayer.show({
            title: '경고',
            content: '사업장명을 입력 해주세요!',
            onConfirm: e => {
                e.preventDefault();
                dialogCover.hide();
                dialogLayer.hide();
                document.getElementById('basicsContainer').toView();
                contents.newCampingForm['name'].focus()
            }
        });
        return;
    }

    if (contents.newCampingForm['business'].value === '') {
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

    if (contents.newCampingForm['contactFirst'].value === '') {
        dialogCover.show();
        dialogLayer.show({
            title: '경고',
            content: '전화번호를 입력 해주세요!',
            onConfirm: e => {
                e.preventDefault();
                dialogCover.hide();
                dialogLayer.hide();
                document.getElementById('basicsContainer').toView();
                contents.newCampingForm['contactFirst'].focus()
            }
        });
        return;
    }

    if (contents.newCampingForm['contactSecond'].value === '') {
        dialogCover.show();
        dialogLayer.show({
            title: '경고',
            content: '전화번호를 입력 해주세요!',
            onConfirm: e => {
                e.preventDefault();
                dialogCover.hide();
                dialogLayer.hide();
                document.getElementById('basicsContainer').toView();
                contents.newCampingForm['contactSecond'].focus()
            }
        });
        return;
    }

    if (contents.newCampingForm['contactThird'].value === '') {
        dialogCover.show();
        dialogLayer.show({
            title: '경고',
            content: '전화번호를 입력 해주세요!',
            onConfirm: e => {
                e.preventDefault();
                dialogCover.hide();
                dialogLayer.hide();
                document.getElementById('basicsContainer').toView();
                contents.newCampingForm['contactThird'].focus()
            }
        });
        return;
    }

    if (contents.newCampingForm['url'].value === '') {
        dialogCover.show();
        dialogLayer.show({
            title: '경고',
            content: '홈페이지를 입력 해주세요!',
            onConfirm: e => {
                e.preventDefault();
                dialogCover.hide();
                dialogLayer.hide();
                document.getElementById('basicsContainer').toView();
                contents.newCampingForm['url'].focus()
            }
        });
        return;
    }

    if (contents.newCampingForm['isWeekday'].value === '') {
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

    if (contents.newCampingForm['isWeekend'].value === '') {
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

    if (contents.newCampingForm['spring'].checked === false &&
        contents.newCampingForm['summer'].checked === false &&
        contents.newCampingForm['fall'].checked === false &&
        contents.newCampingForm['winter'].checked === false) {
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

    if (contents.newCampingForm['generalChk'].checked === false &&
        contents.newCampingForm['autoChk'].checked === false &&
        contents.newCampingForm['glampingChk'].checked === false &&
        contents.newCampingForm['caravanChk'].checked === false) {
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

    if (contents.newCampingForm['additionalChk'].checked === false &&
        contents.newCampingForm['elt'].checked === false &&
        contents.newCampingForm['boil'].checked === false &&
        contents.newCampingForm['wifi'].checked === false &&
        contents.newCampingForm['firewood'].checked === false &&
        contents.newCampingForm['trailsIn'].checked === false &&
        contents.newCampingForm['market'].checked === false &&
        contents.newCampingForm['toiletChk'].checked === false &&
        contents.newCampingForm['bathChk'].checked === false &&
        contents.newCampingForm['sinkChk'].checked === false &&
        contents.newCampingForm['extinguishChk'].checked === false) {
        dialogCover.show();
        dialogLayer.show({
            title: '경고',
            content: '부대 시설을 하나도 선택하지 않았습니다.<br><br>선택하지 않을 시 사업장 정보에 표기 되지 않습니다.<br><br>그대로 진행하시겠습니까?',
            onConfirm: e => {
                e.preventDefault();
                dialogCover.hide();
                dialogLayer.hide();
                contents.newCampingForm['additionalChk'].checked = true;
                contents.newCampingForm.onsubmit(e);
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

    if (contents.newCampingForm['peripheralChk'].checked == false &&
        contents.newCampingForm['fishing'].checked === false &&
        contents.newCampingForm['trailsOut'].checked === false &&
        contents.newCampingForm['seaBath'].checked === false &&
        contents.newCampingForm['leisure'].checked === false &&
        contents.newCampingForm['valley'].checked === false &&
        contents.newCampingForm['river'].checked === false &&
        contents.newCampingForm['poll'].checked === false &&
        contents.newCampingForm['exTeen'].checked === false &&
        contents.newCampingForm['exCountry'].checked === false &&
        contents.newCampingForm['amuseKid'].checked === false) {
        dialogCover.show();
        dialogLayer.show({
            title: '경고',
            content: '주변 시설을 하나도 선택하지 않았습니다.<br><br>선택하지 않을 시 사업장 정보에 표기 되지 않습니다.<br><br>그대로 진행하시겠습니까?',
            onConfirm: e => {
                e.preventDefault();
                dialogCover.hide();
                dialogLayer.hide();
                contents.newCampingForm['peripheralChk'].checked = true;
                contents.newCampingForm.onsubmit(e);
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

    if (contents.newCampingForm['grampingFacilityChk'].checked == false &&
        contents.newCampingForm['glampingChk'].checked === true &&
        contents.newCampingForm['bed'].checked === false &&
        contents.newCampingForm['television'].checked === false &&
        contents.newCampingForm['refrigerator'].checked === false &&
        contents.newCampingForm['internet'].checked === false &&
        contents.newCampingForm['grampingToilet'].checked === false &&
        contents.newCampingForm['airConditioner'].checked === false &&
        contents.newCampingForm['heater'].checked === false &&
        contents.newCampingForm['utensil'].checked === false) {
        dialogCover.show();
        dialogLayer.show({
            title: '경고',
            content: '글램핑 시설을 하나도 선택하지 않았습니다.<br><br>선택하지 않을 시 사업장 정보에 표기 되지 않습니다.<br><br>그대로 진행하시겠습니까?',
            onConfirm: e => {
                e.preventDefault();
                dialogCover.hide();
                dialogLayer.hide();
                contents.newCampingForm['grampingFacilityChk'].checked = true;
                contents.newCampingForm.onsubmit(e);
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

    if (contents.newCampingForm['characteristicsChk'].checked == false && contents.newCampingForm['characteristics'].value === '') {
        dialogCover.show();
        dialogLayer.show({
            title: '경고',
            content: '시설 특징을 입력 하지 않았습니다.<br><br>입력하지 않을 시 사업장 정보에 표기되지 않습니다.<br><br>그대로 진행하시겠습니까?',
            onConfirm: e => {
                e.preventDefault();
                dialogCover.hide();
                dialogLayer.hide();
                contents.newCampingForm['characteristicsChk'].checked = true;
                contents.newCampingForm.onsubmit(e);
            },
            onCancel: e => {
                e.preventDefault();
                dialogCover.hide();
                dialogLayer.hide();
                document.getElementById('facilityContainer').toView();
                contents.newCampingForm['characteristics'].focus();
            }
        });
        return;
    }


    if (contents.newCampingForm['introductionChk'].checked == false &&
        contents.newCampingForm['introduction'].value === '') {
        dialogCover.show();
        dialogLayer.show({
            title: '경고',
            content: '시설 소개글을 입력 하지 않았습니다.<br><br>입력하지 않을 시 사업장 정보에 표기되지 않습니다.<br><br>그대로 진행하시겠습니까?',
            onConfirm: e => {
                e.preventDefault();
                dialogCover.hide();
                dialogLayer.hide();
                contents.newCampingForm['introductionChk'].checked = true;
                contents.newCampingForm.onsubmit(e);
            },
            onCancel: e => {
                e.preventDefault();
                dialogCover.hide();
                dialogLayer.hide();
                document.getElementById('facilityContainer').toView();
                contents.newCampingForm['introduction'].focus();
            }
        });
        return;

    }

    if (contents.newCampingForm['addressPostal'].value === '') {
        dialogCover.show();
        dialogLayer.show({
            title: '경고',
            content: '우편번호 찾기를 눌러서 우편번호를 입력해주세요!',
            onConfirm: e => {
                e.preventDefault();
                dialogCover.hide();
                dialogLayer.hide();
                document.getElementById('locationContainer').toView();
            }
        });
        return;
    }

    let images = contents.newCampingForm['image'].files;

    if (contents.newCampingForm['imageChk'].checked == false &&
        images.length === 0) {
        dialogCover.show();
        dialogLayer.show({
            title: '경고',
            content: '사진을 첨부하지 않았습니다.<br><br>첨부하지 않을 시 사업장 정보에 표기되지 않습니다.<br><br>그대로 진행하시겠습니까?',
            onConfirm: e => {
                e.preventDefault();
                dialogCover.hide();
                dialogLayer.hide();
                contents.newCampingForm['imageChk'].checked = true;
                contents.newCampingForm.onsubmit(e);
            },
            onCancel: e => {
                e.preventDefault();
                dialogCover.hide();
                dialogLayer.hide();
                document.getElementById('attachmentContainer').toView();
            }
        });
        return;
    }

    if (contents.newCampingForm['isReservation'].value === 'true') {
        readCostList(newCostList, true);
        // console.log(Object.keys(prevCostList).length);
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

    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    // 캠핑장 정보
    formData.append('name', contents.newCampingForm['name'].value);
    formData.append('url', contents.newCampingForm['url'].value);
    formData.append('business', contents.newCampingForm['business'].value);
    formData.append('generalCnt', contents.newCampingForm['generalCnt'].value);
    formData.append('autoCnt', contents.newCampingForm['autoCnt'].value);
    formData.append('caravanCnt', contents.newCampingForm['caravanCnt'].value);
    formData.append('glampingCnt', contents.newCampingForm['glampingCnt'].value);
    formData.append('contact', '' + contents.newCampingForm['contactFirst'].value + '-' + contents.newCampingForm['contactSecond'].value + '-' + contents.newCampingForm['contactThird'].value);
    formData.append('characteristics', contents.newCampingForm['characteristics'].value);
    formData.append('introduction', contents.newCampingForm['introduction'].value);
    formData.append('spring', contents.newCampingForm['spring'].checked);
    formData.append('summer', contents.newCampingForm['summer'].checked);
    formData.append('fall', contents.newCampingForm['fall'].checked);
    formData.append('winter', contents.newCampingForm['winter'].checked);
    formData.append('weekday', contents.newCampingForm['isWeekday'].value);
    formData.append('weekend', contents.newCampingForm['isWeekend'].value);
    formData.append('isReservation', contents.newCampingForm['isReservation'].value);
    if (Object.keys(prevCostList).length !== 0) {
        formData.append('costList', JSON.stringify(prevCostList));
    }
    formData.append('latitude', contents.newCampingForm['latitude'].value);
    formData.append('longitude', contents.newCampingForm['longitude'].value);
    formData.append('numberAd', contents.newCampingForm['addressPrimary'].value + ' ' + contents.newCampingForm['addressSecondary'].value);
    formData.append('roadAd', contents.newCampingForm['roadAddress'].value + ' ' + contents.newCampingForm['addressSecondary'].value);

    // 부대 시설
    formData.append('elt', contents.newCampingForm['elt'].checked);
    formData.append('boil', contents.newCampingForm['boil'].checked);
    formData.append('wifi', contents.newCampingForm['wifi'].checked);
    formData.append('firewood', contents.newCampingForm['firewood'].checked);
    formData.append('trailsIn', contents.newCampingForm['trailsIn'].checked);
    formData.append('market', contents.newCampingForm['market'].checked);
    formData.append('toilet', contents.newCampingForm['toilet'].value);
    formData.append('bath', contents.newCampingForm['bath'].value);
    formData.append('sink', contents.newCampingForm['sink'].value);
    formData.append('extinguish', contents.newCampingForm['extinguish'].value);

    // 주변 시설
    formData.append('fishing', contents.newCampingForm['fishing'].checked);
    formData.append('trailsOut', contents.newCampingForm['trailsOut'].checked);
    formData.append('seaBath', contents.newCampingForm['seaBath'].checked);
    formData.append('leisure', contents.newCampingForm['leisure'].checked);
    formData.append('valley', contents.newCampingForm['valley'].checked);
    formData.append('river', contents.newCampingForm['river'].checked);
    formData.append('poll', contents.newCampingForm['poll'].checked);
    formData.append('exTeen', contents.newCampingForm['exTeen'].checked);
    formData.append('exCountry', contents.newCampingForm['exCountry'].checked);
    formData.append('amuseKid', contents.newCampingForm['amuseKid'].checked);

    // 글램핑 시설
    formData.append('bed', contents.newCampingForm['bed'].checked);
    formData.append('television', contents.newCampingForm['television'].checked);
    formData.append('refrigerator', contents.newCampingForm['refrigerator'].checked);
    formData.append('internet', contents.newCampingForm['internet'].checked);
    formData.append('grampingToilet', contents.newCampingForm['grampingToilet'].checked);
    formData.append('airConditioner', contents.newCampingForm['airConditioner'].checked);
    formData.append('heater', contents.newCampingForm['heater'].checked);
    formData.append('utensil', contents.newCampingForm['utensil'].checked);

    formData.append('files',files[0]);
    for (const image of images) {
        formData.append('files',image);
    }

    // console.log(formData);

    xhr.open('POST', `./registration/newRegister`);
    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            dialogCover.show();
            if (xhr.status >= 200 && xhr.status < 300) {
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
                            content: '이미 등록된 사업장입니다.<br><br>확인 후 다시 시도 해주세요.',
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
                            title: '사업자등록',
                            content: '사업자 등록이 되었습니다.',
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
            } else {
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
