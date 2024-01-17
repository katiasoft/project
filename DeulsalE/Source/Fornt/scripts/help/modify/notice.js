const newForm = document.getElementById('newForm');
const eventList = document.getElementById('eventList');
const contents = document.getElementById('contents');
const cancelButtons = contents.querySelectorAll('[rel="cancel"]');
const modifyButtons = contents.querySelectorAll('[rel="modify"]');

if (newForm !== null) {
    ClassicEditor.create(newForm['content'], {
        simpleUpload: {
            uploadUrl: '/help/uploadNoticeImage'
        }
    });

    contents.newForm = contents.querySelector('[rel="newForm"]');
    contents.fileButton = contents.querySelector('[rel="fileButton"]');
    contents.fileButton.onclick = (e) => {
        // e.preventDefault(); 이거 안해주면 파일 선택 팝업 창 두번 뜬다
        e.preventDefault();
        document.getElementById('uploadNewFiles').click();
    }

    let addFileMode = 0;
    contents.newForm.onsubmit = e => {
        e.preventDefault();
        if (contents.newForm['title'].value === '') {
            dialogCover.show();
            dialogLayer.show({
                title: '경고',
                content: '제목을 입력해 주세요',
                onConfirm: e => {
                    e.preventDefault();
                    dialogCover.hide();
                    dialogLayer.hide();
                    document.getElementById('newForm').toView();
                    contents.newForm['title'].focus();
                }
            });
            return;
        }
        if (contents.newForm['content'].value === '') {
            dialogCover.show();
            dialogLayer.show({
                title: '경고',
                content: '내용을 입력해 주세요',
                onConfirm: e => {
                    e.preventDefault();
                    dialogCover.hide();
                    dialogLayer.hide();
                    document.getElementById('newForm').toView();
                    contents.newForm['content'].focus();
                }
            });
            return;
        }
        let files = contents.newForm['files'].files;

        if (files.length === 0) {
            dialogCover.show();
            dialogYesNo.show({
                title: '경고',
                content: '추가된 첨부파일이 없습니다.<br><br>수정을 완료하시겠습니까?',
                onConfirm: e => {
                    e.preventDefault();
                    dialogCover.hide();
                    dialogYesNo.hide();
                    submitNoticeForm();
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
                    submitNoticeForm();
                },
                onCancel: e => {
                    addFileMode = 4;
                    e.preventDefault();
                    dialogCover.hide();
                    dialogYesNo.hide();
                    submitNoticeForm();
                }
            });
            return;
        }

        function submitNoticeForm() {
            const xhr = new XMLHttpRequest();
            const formData = new FormData();
            formData.append('index', newForm['index'].value);
            formData.append('sort', newForm['sort'].value);
            formData.append('content', newForm['content'].value);
            formData.append('subject', newForm['subject'].value);

            if (files.length > 0) {
                for (const file of files) {
                    formData.append('files', file);
                }
            }
            formData.append('addFileMode', addFileMode);
            xhr.open('PATCH', `/help/notice/modify?index=${contents.newForm['index'].value}`);
            xhr.onreadystatechange = () => {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        if (xhr.responseText === 'true') {
                            dialogCover.show();
                            dialogComplete.show({
                                title: '수정성공',
                                content: '해당 게시물이 수정이 완료 되었습니다.',
                                onConfirm: e => {
                                    dialogCover.hide();
                                    dialogComplete.hide();

                                }
                            });
                        } else {
                            dialogCover.show();
                            dialogLayer.show({
                                title: '오류',
                                content: '오류가 발생하였습니다.',
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

    document.getElementById("uploadNewFiles").addEventListener("change", function () {
        const fileInput = document.getElementById("uploadNewFiles");
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


        const fileUploadText = document.getElementById("fileUploadText");
        fileUploadText.textContent = fileCount + "개가 선택되었습니다";

        // Log the selected files
        console.log('Selected Files:', fileInput.files);
    });
}

// Add additional console.log() statements as needed for other parts of the code
