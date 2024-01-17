const fileInput = document.getElementById('upload'); // 파일 입력 필드 요소를 가져옵니다.
const uploadedImgs = document.querySelector('.uploaded_imgs'); // 파일명을 표시할 요소를 가져옵니다.

const dialogCover = document.getElementById('dialogCover');
const dialogLayer = document.getElementById('dialogLayer');
const dialogComplete = document.getElementById('dialogComplete');

dialogCover.show = () => {
    document.body.setAttribute('style', 'overflow:hidden');
    dialogCover.classList.add('visible');
};

dialogCover.blind = () => {
    dialogCover.classList.add('blind');
};

dialogCover.hide = () => {
    document.body.removeAttribute('style');
    dialogCover.classList.remove('visible')
    dialogCover.classList.remove('blind');
};

if (dialogLayer !== null) {
    dialogLayer.show = (params) => {
        dialogLayer.querySelector('[rel="title"]').innerText = params.title;
        dialogLayer.querySelector('[rel="content"]').innerHTML = params.content;
        const cancelButton = dialogLayer.querySelector('[rel="cancel"]');
        if (typeof params['onCancel'] === 'function') {
            cancelButton.style.display = 'inline-block';
            cancelButton.onclick = params['onCancel'];
        } else {
            cancelButton.style.display = 'none';
        }
        dialogLayer.querySelector('[rel="confirm"]').onclick = params['onConfirm'];
        dialogLayer.classList.add('visible');
    };

    dialogLayer.hide = () => {
        dialogLayer.classList.remove('visible')
    };
}

if (dialogComplete !== null) {
    dialogComplete.show = (params) => {
        dialogComplete.querySelector('[rel="title"]').innerText = params.title;
        dialogComplete.querySelector('[rel="content"]').innerHTML = params.content;
        const cancelButton = dialogComplete.querySelector('[rel="cancel"]');
        if (typeof params['onCancel'] === 'function') {
            cancelButton.style.display = 'inline-block';
            cancelButton.onclick = params['oncancel'];
        } else {
            cancelButton.style.display = 'none';
        }
        dialogComplete.querySelector('[rel="confirm"]').onclick = params['onConfirm'];
        dialogComplete.classList.add('visible');
    };

    dialogComplete.hide = () => {
        dialogComplete.classList.remove('visible')
    };
}

fileInput.addEventListener('change', function () {
    uploadedImgs.innerHTML = ''; // 파일명을 표시하는 요소를 초기화합니다.
    const fileCount = fileInput.files.length; // 선택된 파일의 개수를 가져옵니다.

    const fileCountText = document.createElement('p'); // 파일 개수를 표시할 <p> 요소를 생성합니다.
    fileCountText.textContent = fileCount + '개의 파일이 선택되었습니다.'; // 파일 개수를 텍스트로 설정합니다.
    if (fileCount > 5) {
        dialogCover.show();
        dialogLayer.show({
            title: '경고',
            content: '최대 5개까지만 업로드할 수 있습니다.',
            onConfirm: e => {
                e.preventDefault();
                dialogCover.hide();
                dialogLayer.hide();
                // 선택한 파일들 초기화
                fileInput.value = "";
            }
        });
        return;
    }
    uploadedImgs.appendChild(fileCountText); // 파일 개수를 표시하는 요소에 추가합니다.

    console.log(fileCount + '파일 선택되었습니다.'); // 선택된 파일의 개수를 콘솔에 출력합니다.
});

const qnaForm = document.getElementById('qnaForm');

qnaForm.onsubmit = e => {
    e.preventDefault();
    if (qnaForm['subject'].value === '') {
        dialogCover.show();
        dialogLayer.show({
            title: '경고',
            content: '제목을 입력해 주세요',
            onConfirm: e => {
                e.preventDefault();
                dialogCover.hide();
                dialogLayer.hide();
                document.getElementById('qnaForm').toView();
                qnaForm['subject'].focus();
            }
        });
        return;
    }

    if (qnaForm['content'].value === '') {
        dialogCover.show();
        dialogLayer.show({
            title: '경고',
            content: '내용을 입력해 주세요',
            onConfirm: e => {
                e.preventDefault();
                dialogCover.hide();
                dialogLayer.hide();
                document.getElementById('qnaForm').toView();
                qnaForm['content'].focus();
            }
        });
        return;
    }

    if (qnaForm['agreeIndividual'].checked === false) {
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


    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('userId', qnaForm['userId'].value);
    formData.append('title', qnaForm['subject'].value);
    formData.append('content', qnaForm['content'].value);
    for (let i = 0; i < qnaForm['files'].files.length; i++) {
        formData.append('files', qnaForm['files'].files[i]);
    }

    // formData.append('files', contents.newForm['files'].files[0]);

    xhr.open('POST', '/mobile/qna');
    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status >= 200 && xhr.status < 300) {
                dialogCover.show();
                dialogComplete.show({
                    title: '작성완료',
                    content: '작성이 완료되었습니다.',
                    onConfirm: e => {
                        dialogCover.hide();
                        dialogComplete.hide();
                        location.href = '/mobile/qna/list'
                    }
                });
            } else {

            }

        }
    };
    xhr.send(formData);
}

