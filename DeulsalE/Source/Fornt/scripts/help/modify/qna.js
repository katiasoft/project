const qnaForm = document.getElementById('qnaForm');
const contents = document.getElementById('contents');

if (qnaForm !== null) {
    contents.qnaForm = contents.querySelector('[rel="qnaForm"]');
    contents.fileButton = contents.querySelector('[rel="fileButton"]');
    contents.fileButton.onclick = (e) => {
        // e.preventDefault(); 이거 안해주면 파일 선택 팝업 창 두번 뜬다
        e.preventDefault();
        document.getElementById('upload').click();
    }

    let addFileMode = 0;


    contents.qnaForm.onsubmit = e => {
        e.preventDefault();
        if (contents.qnaForm['title'].value === '') {
            dialogCover.show();
            dialogLayer.show({
                title: '경고',
                content: '제목을 입력해 주세요',
                onConfirm: e => {
                    e.preventDefault();
                    dialogCover.hide();
                    dialogLayer.hide();
                    document.getElementById('qnaForm').toView();
                    contents.qnaForm['title'].focus();
                }
            });
            return;
        }

        if (contents.qnaForm['content'].value === '') {
            dialogCover.show();
            dialogLayer.show({
                title: '경고',
                content: '내용을 입력해 주세요',
                onConfirm: e => {
                    e.preventDefault();
                    dialogCover.hide();
                    dialogLayer.hide();
                    document.getElementById('qnaForm').toView();
                    contents.qnaForm['content'].focus();
                }
            });
            return;
        }

        if (contents.qnaForm['agreeIndividual'].checked === false) {
            dialogCover.show();
            dialogLayer.show({
                title: '경고',
                content: '개인 정보 수집 및 이용에 동의를 해주세요!',
                onConfirm: e => {
                    e.preventDefault();
                    dialogCover.hide();
                    dialogLayer.hide();
                    document.getElementById('individualContainer').toView();
                }
            });
            return;
        }

        let files = contents.qnaForm['files'].files;

        if (files.length === 0) {
            dialogCover.show();
            dialogYesNo.show({
                title: '경고',
                content: '추가된 첨부파일이 없습니다.<br><br>수정을 완료하시겠습니까?',
                onConfirm: e => {
                    e.preventDefault();
                    dialogCover.hide();
                    dialogYesNo.hide();
                    submitQnaForm();
                },
                onCancel: e => {
                    e.preventDefault();
                    dialogCover.hide();
                    dialogYesNo.hide();
                }
            });
            return;
        } else {
            dialogCover.show();
            dialogYesNo.show({
                title: '경고',
                content: '새로운 파일이 첨부되었습니다.<br><br>기존의 파일을 삭제후 추가하시겠습니까?',
                onConfirm: e => {
                    addFileMode = 3;
                    e.preventDefault();
                    dialogCover.hide();
                    dialogYesNo.hide();
                    submitQnaForm();
                },
                onCancel: e => {
                    addFileMode = 4;
                    e.preventDefault();
                    dialogCover.hide();
                    dialogYesNo.hide();
                    submitQnaForm();
                }
            });
            return;
        }

        function submitQnaForm() {
            const xhr = new XMLHttpRequest();
            const formData = new FormData();

            formData.append('title', contents.qnaForm['title'].value);
            formData.append('content', contents.qnaForm['content'].value);

            if (files.length > 0) {
                for (const file of files) {
                    formData.append('files', file);
                }
            }
            formData.append('addFileMode', addFileMode);
            xhr.open('PATCH', `/help/qna/modify?index=${contents.qnaForm['index'].value}`);
            xhr.onreadystatechange = () => {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        if (xhr.responseText === 'true') {
                            dialogCover.show();
                            dialogComplete.show({
                                title: '수정성공',
                                content: '해당 문의글의 수정이 완료 되었습니다.',
                                onConfirm: e => {
                                    dialogCover.hide();
                                    dialogComplete.hide();


                                }
                            });
                        } else {
                            dialogCover.show();
                            dialogCover.show({
                                title: '서버오류',
                                content: '오류가 발생하였습니다.',
                                onConfirm: e => {
                                    dialogCover.hide();
                                    dialogLayer.hide();
                                    addFileMode = 0;
                                }
                            });
                        }
                    } else {
                        dialogCover.show();
                        dialogLayer.show({
                            title: '서버통신',
                            content: '서버와 통신에 문제가 발생하였습니다.',
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
    }

    document.getElementById("upload").addEventListener("change", function () {
        const fileInput = document.getElementById("upload");
        const fileCount = fileInput.files.length;

        if (fileCount > 5) {
            dialogCover.show();
            dialogLayer.show({
                title: '경고',
                content: '최대 5개까지만 선택할 수 있습니다.',
                onConfirm: e => {
                    e.preventDefault();
                    dialogCover.hide();
                    dialogLayer.hide();
                    fileInput.value = ""; // 선택한 파일 초기화
                }
            });
            return;
        }



        const fileUploadText = document.querySelector("label[for='upload'] span");
        fileUploadText.textContent = fileCount + "개가 선택되었습니다";

        // 선택된 파일들을 로그에 출력합니다
        console.log('선택된 파일들:', fileInput.files);
    });

}




