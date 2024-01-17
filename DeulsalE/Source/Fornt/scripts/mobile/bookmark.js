const dialogCover = document.getElementById('dialogCover');
const dialogLayer = document.getElementById('dialogLayer');

dialogCover.show = () => {
    dialogCover.classList.add('visible');
};
dialogCover.hide = () => {
    dialogCover.classList.remove('visible');
};


dialogLayer.show = (params) => {
    dialogLayer.querySelector('[rel="title"]').innerText = params.title;
    dialogLayer.querySelector('[rel="content"]').innerHTML = params.content;
    // const cancelButton = dialogLayer.querySelector('[rel="cancel"]');
    // if (typeof params['onCancel'] === 'function') {
    //     cancelButton.style.display = 'inline-block';
    //     cancelButton.onclick = params['onCancel'];
    // } else {
    //     cancelButton.style.display = 'none';
    // }
    dialogLayer.querySelector('[rel="confirm"]').onclick = params['onConfirm'];
    dialogLayer.classList.add('visible');
};

dialogLayer.hide = () => {
    dialogLayer.classList.remove('visible')
};


function moveDetail(index) {
    location.href = `/mobile/detail?index=${index}`
}

function undoBookmark(index) {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('campsiteIndex', index);


    xhr.open('DELETE', '/member/bookmark');
    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status >= 200 && xhr.status < 300) {
                const response = xhr.responseText;
                if (response === 'true') {
                    dialogCover.show();
                    dialogLayer.show({
                        title: '즐겨찾기',
                        content: '즐겨찾기가 해제 되었습니다.',
                        onConfirm: e => {
                            dialogCover.hide();
                            dialogLayer.hide();
                            location.href = '';
                        }
                    });
                } else {
                    dialogCover.show();
                    dialogLayer.show({
                        title: '즐겨찾기',
                        content: '즐겨찾기 해제가 실패했습니다.<br><br>잠시후 다시시도해 주세요.',
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
                    title: '즐겨찾기',
                    content: '서버 통신에 문제가 발생하였습니다.<br><br>잠시후 다시시도해 주세요.',
                    onConfirm: e => {
                        e.preventDefault();
                        dialogCover.hide();
                        dialogLayer.hide();
                    }
                });
            }
        }
    }
    xhr.send(formData);
}