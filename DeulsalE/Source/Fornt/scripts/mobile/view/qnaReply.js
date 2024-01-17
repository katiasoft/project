const newForm = document.getElementById('newForm');


$(document).ready(function () {
    // 답변이 작성되지 않은 경우에는 form-container를 처음에 숨깁니다.
    if ('${result}' === 'failure') {
        $('.form-container').hide();
    }

    // 회신 버튼의 클릭 이벤트를 처리합니다.
    $('#replyButton').click(function () {
        // form-container의 현재 가시성에 따라 보이거나 숨깁니다.
        $('.form-container').toggle();
    });
});


const dialogAnswerComplete = document.getElementById('dialogAnswerComplete');

if (dialogAnswerComplete !== null) {
    dialogAnswerComplete.show = (params) => {
        dialogAnswerComplete.querySelector('[rel="title"]').innerText = params.title;
        dialogAnswerComplete.querySelector('[rel="content"]').innerHTML = params.content;
        const cancelButton = dialogAnswerComplete.querySelector('[rel="cancel"]');
        if (typeof params['onCancel'] === 'function') {
            cancelButton.style.display = 'inline-block';
            cancelButton.onclick = params['onCancel'];
        } else {
            cancelButton.style.display = 'none';
        }
        dialogAnswerComplete.querySelector('[rel="confirm"]').onclick = params['onConfirm'];
        dialogAnswerComplete.classList.add('visible');
    };

    dialogAnswerComplete.hide = () => {
        dialogAnswerComplete.classList.remove('visible')
    };
}

newForm.answerForm = newForm.querySelector('[rel="answerForm"]');

newForm.answerForm.onsubmit = e => {
    e.preventDefault();
    if (newForm.answerForm['content'].value === '') {
        dialogCover.show();
        dialogLayer.show({
            title: '경고',
            content: '내용을 입력해 주세요',
            onConfirm: e => {
                e.preventDefault();
                dialogCover.hide();
                dialogLayer.hide();
                document.getElementById('answerForm').toView();
                newForm.qnaForm['content'].focus();
            }
        });
        return;
    }

    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('content', newForm.answerForm['content'].value);
    formData.append('qnaIndex', newForm.answerForm['qnaIndex'].value);

    xhr.open('POST', `/mobile/qna/view?index=${newForm.answerForm['qnaIndex'].value}`);
    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status >= 200 && xhr.status < 300) {
                dialogCover.show();
                dialogAnswerComplete.show({
                    title: '답변완료',
                    content: '작성이 완료되었습니다.',
                    onConfirm: e => {
                        dialogCover.hide();
                        dialogAnswerComplete.hide();
                    }
                });
            } else {

            }

        }
    };
    xhr.send(formData);
}


