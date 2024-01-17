const surveyForm = document.getElementById('surveyContainer');
surveyForm.subKid = surveyForm.querySelector('[rel="subKid"]');
surveyForm.subLeisure = surveyForm.querySelector('[rel="subLeisure"]');

surveyForm['isKid'].forEach(function (isKid) {
    isKid.onclick = () => {
        if (surveyForm['isKid'].value === '1') {
            if (surveyForm.subKid.classList.contains('visible')) {
                surveyForm.subKid.classList.remove('visible');
            }
        } else {
            if (!surveyForm.subKid.classList.contains('visible')) {
                surveyForm.subKid.classList.add('visible');
            }
        }
    }
});

surveyForm['isLeisure'].forEach(function (isLeisure) {
    isLeisure.onclick = () => {
        if (surveyForm['isLeisure'].value === '1') {
            if (surveyForm.subLeisure.classList.contains('visible')) {
                surveyForm.subLeisure.classList.remove('visible');
            }
        } else {
            if (!surveyForm.subLeisure.classList.contains('visible')) {
                surveyForm.subLeisure.classList.add('visible');
            }
        }
    }
});
surveyForm['answerSend'].onclick = e => {
    // e.preventDefault();
    if (surveyForm['area'].value === '') {
        dialogCover.show();
        dialogLayer.show({
            title: "경고",
            content: "1번 항목이 선택 되지 않았습니다.<br><br>확인후 다시시도 해주세요.",
            onConfirm: e => {
                e.preventDefault();
                surveyForm['area'][0].toView();
                dialogCover.hide();
                dialogLayer.hide();
            }
        });
        return;
    }

    if (surveyForm['space'].value === '') {
        dialogCover.show();
        dialogLayer.show({
            title: "경고",
            content: "2번 항목이 선택 되지 않았습니다.<br><br>확인후 다시시도 해주세요.",
            onConfirm: e => {
                e.preventDefault();
                surveyForm['space'][0].toView();
                dialogCover.hide();
                dialogLayer.hide();
            }
        });
        return;
    }

    if (surveyForm['isKid'].value === '') {
        dialogCover.show();
        dialogLayer.show({
            title: "경고",
            content: "3번 항목이 선택 되지 않았습니다.<br><br>확인후 다시시도 해주세요.",
            onConfirm: e => {
                e.preventDefault();
                surveyForm['isKid'][0].toView();
                dialogCover.hide();
                dialogLayer.hide();
            }
        });
        return;
    }

    if (surveyForm['isKid'].value === '1' && surveyForm['kid'].value === '') {
        dialogCover.show();
        dialogLayer.show({
            title: "경고",
            content: "3-1번 항목이 선택 되지 않았습니다.<br><br>확인후 다시시도 해주세요.",
            onConfirm: e => {
                e.preventDefault();
                surveyForm['kid'][0].toView();
                dialogCover.hide();
                dialogLayer.hide();
            }
        });
        return;
    }

    if (surveyForm['isDog'].value === '') {
        dialogCover.show();
        dialogLayer.show({
            title: "경고",
            content: "4번 항목이 선택 되지 않았습니다.<br><br>확인후 다시시도 해주세요.",
            onConfirm: e => {
                e.preventDefault();
                surveyForm['isDog'][0].toView();
                dialogCover.hide();
                dialogLayer.hide();
            }
        });
        return;
    }

    if (surveyForm['type'].value === '') {
        dialogCover.show();
        dialogLayer.show({
            title: "경고",
            content: "5번 항목이 선택 되지 않았습니다.<br><br>확인후 다시시도 해주세요.",
            onConfirm: e => {
                e.preventDefault();
                surveyForm['type'][0].toView();
                dialogCover.hide();
                dialogLayer.hide();
            }
        });
        return;
    }

    if (surveyForm['isLeisure'].value === '') {
        dialogCover.show();
        dialogLayer.show({
            title: "경고",
            content: "6번 항목이 선택 되지 않았습니다.<br><br>확인후 다시시도 해주세요.",
            onConfirm: e => {
                e.preventDefault();
                surveyForm['isLeisure'][0].toView();
                dialogCover.hide();
                dialogLayer.hide();
            }
        });
        return;
    }

    if (surveyForm['isLeisure'].value === '1' && surveyForm['leisure'].value === '') {
        dialogCover.show();
        dialogLayer.show({
            title: "경고",
            content: "6-1번 항목이 선택 되지 않았습니다.<br><br>확인후 다시시도 해주세요.",
            onConfirm: e => {
                e.preventDefault();
                surveyForm['leisure'][0].toView();
                dialogCover.hide();
                dialogLayer.hide();
            }
        });
        return;
    }

    if (surveyForm['fireStand'].value === '') {
        dialogCover.show();
        dialogLayer.show({
            title: "경고",
            content: "7번 항목이 선택 되지 않았습니다.<br><br>확인후 다시시도 해주세요.",
            onConfirm: e => {
                e.preventDefault();
                surveyForm['fireStand'][0].toView();
                dialogCover.hide();
                dialogLayer.hide();
            }
        });
        return;
    }

    if (surveyForm['mart'].value === '') {
        dialogCover.show();
        dialogLayer.show({
            title: "경고",
            content: "8번 항목이 선택 되지 않았습니다.<br><br>확인후 다시시도 해주세요.",
            onConfirm: e => {
                e.preventDefault();
                surveyForm['mart'][0].toView();
                dialogCover.hide();
                dialogLayer.hide();
            }
        });
        return;
    }

    let area = surveyForm['area'].value;
    let space = surveyForm['space'].value;
    let kid;
    if (surveyForm['isKid'].value === '1') {
        kid = surveyForm['kid'].value;
    } else {
        kid = '0';
    }
    let isDog = surveyForm['isDog'].value;
    let type = surveyForm['type'].value;
    let leisure;
    if (surveyForm['isLeisure'].value === '1') {
        leisure = surveyForm['leisure'].value;
    } else {
        leisure = '0';
    }
    let fireStand = surveyForm['fireStand'].value;
    let mart = surveyForm['mart'].value;

    window.location.href = `/member/recommendation/list?areaName=${area}&space=${space}&kid=${kid}&isDog=${isDog}&type=${type}&leisure=${leisure}&fireStand=${fireStand}&mart=${mart}`;
}