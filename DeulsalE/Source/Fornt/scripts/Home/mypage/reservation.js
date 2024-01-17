function decision(index,status) {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    xhr.open('GET', `/entrepreneur/reservation/decision?index=${index}&status= ${status}`);
    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status >= 200 && xhr.status < 300) {
                if (xhr.responseText === 'true') {
                    dialogCover.show();
                    dialogComplete.show({
                        title: '예약취소',
                        content: '해당 예약을 취소하였습니다.',
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

function moveDetail(index){
    location.href = `/member/detail?index=${index}`
}
