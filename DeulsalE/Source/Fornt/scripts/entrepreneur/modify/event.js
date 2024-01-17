const eventList = document.getElementById('eventList');
const modifyForm = document.getElementById('modifyForm');

if (modifyForm !== null) {

    ClassicEditor.create(modifyForm['content'], {
        simpleUpload: {
            uploadUrl: '/entrepreneur/event/uploadImage'
        }
    });


    contents.modifyForm = contents.querySelector('[rel="modifyForm"]');

    contents.modifyFileButton = contents.querySelector('[rel="modifyFileButton"]');

    contents.modifyFileButton.onclick = () => {
        document.getElementById('uploadModifyFiles').click();
    }

    let addFileMode = 0;

    contents.modifyForm.onsubmit = e => {
        e.preventDefault();

        if (contents.modifyForm['title'].value === '') {
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

        if (contents.modifyForm['start'].value === '') {
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

        if (contents.modifyForm['end'].value === '') {
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

        if (contents.modifyForm['start'].value > contents.modifyForm['end'].value) {
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

        if (contents.modifyForm['content'].value === '') {
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
        let files = contents.modifyForm['modifyFiles'].files;
        if (addFileMode === 0) {
            if (files.length === 0) {
                dialogCover.show();
                dialogYesNo.show({
                    title: '경고',
                    content: '첨부파일이 없습니다.<br><br>기존의 첨부파일을 유지하시겠습니까?',
                    onConfirm: e => {
                        e.preventDefault();
                        dialogCover.hide();
                        dialogYesNo.hide();
                        addFileMode = 1;
                        contents.modifyForm.onsubmit(e);
                    },
                    onCancel: e => {
                        e.preventDefault();
                        dialogCover.hide();
                        dialogYesNo.hide();
                        addFileMode = 2;
                        contents.modifyForm.onsubmit(e);
                    }
                });
                return;
            } else {
                dialogCover.show();
                dialogYesNo.show({
                    title: '경고',
                    content: '첨부파일이 있습니다.<br><br>기존의 첨부파일을 삭제후 추가하시겠습니까?',
                    onConfirm: e => {
                        e.preventDefault();
                        dialogCover.hide();
                        dialogYesNo.hide();
                        addFileMode = 3;
                        contents.modifyForm.onsubmit(e);
                    },
                    onCancel: e => {
                        e.preventDefault();
                        dialogCover.hide();
                        dialogYesNo.hide();
                        addFileMode = 4;
                        contents.modifyForm.onsubmit(e);
                    }
                });
                return;
            }
        }
        const xhr = new XMLHttpRequest();
        const formData = new FormData();
        formData.append('index', contents.modifyForm['eventIndex'].value)
        formData.append("title", contents.modifyForm['title'].value);
        formData.append("strStartDay", contents.modifyForm['start'].value);
        formData.append('strEndDay', contents.modifyForm['end'].value);
        formData.append('content', contents.modifyForm['content'].value);

        for (const file of files) {
            formData.append('files', file);
        }

        const str = contents.modifyForm['content'].value;
        const parser = new DOMParser();
        const doc = parser.parseFromString(str, 'text/html');
        if (doc.getElementsByTagName('img').length > 0) {
            const url = doc.getElementsByTagName('img')[0].src;
            formData.append('src', url);
        }
        formData.append("addFileMode", addFileMode);

        xhr.open('POST', `./modify`);
        xhr.onreadystatechange = () => {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    if (xhr.responseText === 'true') {
                        dialogCover.show();
                        dialogComplete.show({
                            title: '이벤트',
                            content: '이벤트가 수정 되었습니다.',
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
                                addFileMode = 0;
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
                            addFileMode = 0;
                        }
                    });
                }
            }
        };
        xhr.send(formData);
    }

    let isDeleted = false;
    contents.modifyForm['delete'].onclick = e => {
        e.preventDefault();
        if (!isDeleted) {
            dialogCover.show();
            dialogYesNo.show({
                title: '경고',
                content: '해당 이벤트를 정말로 삭제하시겠습니까?',
                onConfirm: e => {
                    e.preventDefault();
                    dialogCover.hide();
                    dialogYesNo.hide();
                    isDeleted = true;
                    contents.modifyForm['delete'].onclick(e);
                },
                onCancel: e => {
                    e.preventDefault();
                    dialogCover.hide();
                    dialogYesNo.hide();
                }
            });
            return;
        }
        const xhr = new XMLHttpRequest();
        const formData = new FormData();
        formData.append('eventIndex', contents.modifyForm['eventIndex'].value)
        xhr.open('POST', `./delete`);
        xhr.onreadystatechange = () => {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    if (xhr.responseText === 'true') {
                        dialogCover.show();
                        dialogComplete.show({
                            title: '이벤트',
                            content: '이벤트가 삭제 되었습니다.',
                            onConfirm: e => {
                                e.preventDefault();
                                dialogCover.hide();
                                dialogComplete.hide();
                                location.href = '';
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
                                isDeleted = false;
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
                            isDeleted = false;
                        }
                    });
                }
            }
        };
        xhr.send(formData);
    }
}