const deleteButtons = newForm.querySelectorAll('[rel="delete"]');
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


deleteButtons.forEach(deleteButton => {
    deleteButton.addEventListener('click', e => {
        e.preventDefault(); // 클릭했을때 발생

        const index = deleteButton.dataset.index; // th:data-이름 가져오기 rel

        dialogCover.show();
        dialogLayer.show({
            title: '문의글 삭제',
            content: '해당 문의글을 삭제하시겠습니까?',
            onConfirm: () => {
                const xhr = new XMLHttpRequest();
                xhr.open('DELETE', `/mobile/qna/view?index=${index}`);
                xhr.onreadystatechange = () => {
                    if (xhr.readyState === XMLHttpRequest.DONE) {
                        if (xhr.status >= 200 && xhr.status < 300) {
                            const responseText = xhr.responseText; // true | false
                            if (responseText === 'true') {
                                dialogLayer.hide();
                                dialogComplete.show({
                                    title: '삭제완료',
                                    content: '해당 문의글이 삭제 되었습니다.',
                                    onConfirm: e => {
                                        dialogCover.hide();
                                        dialogComplete.hide();
                                        location.href = '/mobile/qna/list';
                                    }
                                });
                                // 삭제 했을때 원하고 싶은 페이지 주소 설정 location.href += (+) 있을시에 해당 페이지 이어 붙인다.
                            }
                        } else {
                            dialogCover.show();
                            dialogLayer.show({
                                title: '서버오류',
                                content: '서버와 통신하지 못하였습니다.',
                                onConfirm: e => {
                                    dialogCover.hide();
                                    dialogLayer.hide();
                                }
                            });
                        }
                    }
                };
                xhr.send();
            },
            onCancel: () => {
                dialogCover.hide();
                dialogLayer.hide();
            }
        });
    });
});

// 첨부 파일 다운로드 링크 클릭 이벤트 핸들러
const downloadLinks = document.querySelectorAll('.view_footer ul li a');
if (downloadLinks) {
    downloadLinks.forEach(function (downloadLink) {
        downloadLink.addEventListener('click', function (event) {
            event.preventDefault(); // 기본 동작 중지

            const downloadUrl = this.getAttribute('href'); // 다운로드 URL 가져오기
            const fileName = this.innerText; // 파일 이름 가져오기

            // AJAX 요청 생성
            const xhr = new XMLHttpRequest();
            xhr.open('GET', downloadUrl, true);
            xhr.responseType = 'blob';

            xhr.onload = function () {
                if (xhr.status === 200) {
                    // 응답에서 파일 데이터 가져오기
                    const blob = new Blob([xhr.response], { type: 'application/octet-stream' });

                    // 파일 다운로드 링크 생성
                    const downloadLink = document.createElement('a');
                    downloadLink.href = window.URL.createObjectURL(blob);
                    downloadLink.download = fileName;
                    downloadLink.click();

                    // 리소스 해제
                    window.URL.revokeObjectURL(downloadLink.href);
                }
            };

            // AJAX 요청 전송
            xhr.send();
        });
    });
}