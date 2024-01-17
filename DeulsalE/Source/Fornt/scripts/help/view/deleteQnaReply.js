const contents = document.getElementById('contents');
const deleteAnswer = contents.querySelectorAll('[rel="deleteAnswer"]');

deleteAnswer.forEach(deleteAnswer => {
    deleteAnswer.addEventListener('click', e => {
        e.preventDefault(); // 클릭했을때 발생

        const index = deleteAnswer.dataset.index; // th:data-이름 가져오기 rel

        dialogCover.show();
        dialogLayer.show({
            title: '답변글 삭제',
            content: '답변을 삭제하시겠습니까?',
            onConfirm: () => {
                const xhr = new XMLHttpRequest();
                xhr.open('DELETE', `/help/qna/view/answer?index=${index}`);
                xhr.onreadystatechange = () => {
                    if (xhr.readyState === XMLHttpRequest.DONE) {
                        if (xhr.status >= 200 && xhr.status < 300) {
                            const responseText = xhr.responseText; // true | false
                            if (responseText === 'true') {
                                dialogCover.show();
                                dialogComplete.show({
                                    title: '삭제완료',
                                    content: '답변이 삭제 되었습니다.',
                                    onConfirm: e => {
                                        dialogCover.hide();
                                        dialogComplete.hide();
                                        location.href = '/help/qna/list';
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