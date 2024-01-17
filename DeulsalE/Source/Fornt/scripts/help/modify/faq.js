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
    // ck 에디터 이미지 불러오기 Url 경로 잘 확인 할것!

    contents.newForm = contents.querySelector('[rel="newForm"]');
    contents.newForm.onsubmit = e => {
        e.preventDefault();
        if (contents.newForm['subject'].value === '') {
            dialogCover.show();
            dialogLayer.show({
                title: '경고',
                content: '제목을 작성 해 주세요!',
                onConfirm: e => {
                    e.preventDefault();
                    dialogCover.hide();
                    dialogLayer.hide();
                    contents.newForm['subject'].focus();
                }
            });
            return;
        }
        if (contents.newForm['content'].value === '') {
            dialogCover.show();
            dialogLayer.show({
                title: '경고',
                content: '내용을 작성 해 주세요!',
                onConfirm: e => {
                    e.preventDefault();
                    dialogCover.hide();
                    dialogLayer.hide();
                    contents.newForm['content'].focus();

                }
            });
            return;
        }

        contents.onsubmit = e => {
            e.preventDefault();
            const xhr = new XMLHttpRequest();
            const formData = new FormData();
            formData.append('index', newForm['index'].value);
            formData.append('sort', newForm['sort'].value);
            formData.append('content', newForm['content'].value);
            formData.append('subject', newForm['subject'].value);


            xhr.open('PATCH', `/help/faq/modify`);
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
                                    location.href = '/help/faq/';
                                }
                            });
                        } else {
                            dialogCover.show();
                            dialogCover.show({
                                title: '서버오류',
                                content: '서버와 통신하지 못하였습니다.',
                                onConfirm: e => {
                                    dialogCover.hide();
                                    dialogLayer.hide();
                                }
                            });
                        }
                    }
                }
            };
            xhr.send(formData);
            // 여기 부터
            // 요청 방식은 PATCH
            // 여기 까지
        };
    }
}




