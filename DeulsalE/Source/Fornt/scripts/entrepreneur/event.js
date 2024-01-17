const newForm = document.getElementById('newForm');
const contents = document.getElementById('contents');

ClassicEditor.create(newForm['content'], {
    simpleUpload: {
        uploadUrl: '/entrepreneur/event/uploadImage'
    }
});

contents.newForm = contents.querySelector('[rel="newForm"]');

contents.newFileButton = contents.querySelector('[rel="newFileButton"]');

function setCampsiteIndex(index) {
    contents.newForm['campsiteIndex'].value = index;
}

contents.newFileButton.onclick = () => {
    document.getElementById('uploadNewFiles').click();
}

contents.newForm.onsubmit = e => {
    e.preventDefault();
    if (contents.newForm['campsiteIndex'].value === '') {
        dialogCover.show();
        dialogLayer.show({
            title: '경고',
            content: '사업장을 선택 해주세요!',
            onConfirm: e => {
                e.preventDefault();
                dialogCover.hide();
                dialogLayer.hide();
                document.getElementById('campsiteList').toView();
            }
        });
        return;
    }
    if (contents.newForm['title'].value === '') {
        dialogCover.show();
        dialogLayer.show({
            title: '경고',
            content: '제목을 작성 해주세요!',
            onConfirm: e => {
                e.preventDefault();
                dialogCover.hide();
                dialogLayer.hide();
                contents.newForm['title'].focus();
            }
        });
        return;
    }

    if (contents.newForm['start'].value === '') {
        dialogCover.show();
        dialogLayer.show({
            title: '경고',
            content: '시작일을 작성 해주세요!',
            onConfirm: e => {
                e.preventDefault();
                dialogCover.hide();
                dialogLayer.hide();
                contents.newForm['start'].focus();
            }
        });
        return;
    }

    if (contents.newForm['end'].value === '') {
        dialogCover.show();
        dialogLayer.show({
            title: '경고',
            content: '마감일을 작성 해주세요!',
            onConfirm: e => {
                e.preventDefault();
                dialogCover.hide();
                dialogLayer.hide();
                contents.newForm['end'].focus();
            }
        });
        return;
    }

    if (contents.newForm['start'].value > contents.newForm['end'].value) {
        dialogCover.show();
        dialogLayer.show({
            title: '경고',
            content: '마감일은 시작일 이후로 작성 해주세요!',
            onConfirm: e => {
                e.preventDefault();
                dialogCover.hide();
                dialogLayer.hide();
                contents.newForm['end'].focus();
            }
        });
        return;
    }

    if (contents.newForm['content'].value === '') {
        dialogCover.show();
        dialogLayer.show({
            title: '경고',
            content: '내용을 작성 해주세요!',
            onConfirm: e => {
                e.preventDefault();
                dialogCover.hide();
                dialogLayer.hide();
                contents.newForm['content'].focus();
            }
        });
        return;
    }
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('campsiteIndex', contents.newForm['campsiteIndex'].value);
    formData.append('title', contents.newForm['title'].value);
    formData.append('strStartDay', contents.newForm['start'].value);
    formData.append('strEndDay', contents.newForm['end'].value);
    formData.append('content', contents.newForm['content'].value);

    let files = contents.newForm['newFiles'].files;
    for (const file of files) {
        formData.append('files', file);
    }

    const str = contents.newForm['content'].value;
    const parser = new DOMParser();
    const doc = parser.parseFromString(str, 'text/html');
    if (doc.getElementsByTagName('img').length > 0) {
        const url = doc.getElementsByTagName('img')[0].src;
        formData.append('src', url);
    }

    xhr.open('POST', `./event/registration`);
    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status >= 200 && xhr.status < 300) {
                if (xhr.responseText === 'true') {
                    dialogCover.show();
                    dialogComplete.show({
                        title: '이벤트',
                        content: '이벤트가 등록 되었습니다.',
                        onConfirm: e => {
                            e.preventDefault();
                            dialogCover.hide();
                            dialogComplete.hide();
                            location.href += '';
                        }
                    });
                } else {
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
}
