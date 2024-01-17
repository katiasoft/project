const content = document.getElementById('content');
const contents = document.getElementById('contents');
const faqDeleteButtons = content.querySelectorAll('[rel="delete"]');

faqDeleteButtons.forEach(deleteButton => {
    deleteButton.addEventListener('click', e => {
        e.preventDefault(); // 클릭했을때 발생

        const index = deleteButton.dataset.index; // th:data-이름 가져오기 rel

        dialogCover.show();
        dialogLayer.show({
            title: '게시글 삭제',
            content: '해당 게시글을 삭제하시겠습니까?',
            onConfirm: () => {
                const xhr = new XMLHttpRequest();
                xhr.open('DELETE', `/help/faq/view?index=${index}`);
                xhr.onreadystatechange = () => {
                    if (xhr.readyState === XMLHttpRequest.DONE) {
                        if (xhr.status >= 200 && xhr.status < 300) {
                            const responseText = xhr.responseText; // true | false
                            if (responseText === 'true') {
                                dialogLayer.hide();
                                dialogComplete.show({
                                    title: '삭제완료',
                                    content: '해당 게시물이 삭제 되었습니다.',
                                    onConfirm: e => {
                                        dialogCover.hide();
                                        dialogComplete.hide();
                                        location.href = '/help/faq/';
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
                            })
                        }
                        // status 오류 잡아내는거
                    }
                    console.log(xhr.readyState); // 2 3 4
                }; // 준비가 변화가 생길때
                xhr.send(); // 준비 단계
            },
            onCancel: () => {
                dialogCover.hide();
                dialogLayer.hide();
            }
        })
    });
});