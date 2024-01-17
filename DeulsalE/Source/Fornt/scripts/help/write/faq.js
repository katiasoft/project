const newForm = document.getElementById('newForm');
const eventList = document.getElementById('eventList');
const contents = document.getElementById('contents');
const modifyForm = document.getElementById('modifyForm');
const catSelectElement = document.querySelector('select[name="cat"]');
const contentTextAreaElement = document.querySelector('textarea[name="content"]');

contents.newForm = contents.querySelector('[rel="newForm"]');

ClassicEditor.create(newForm['content'], {
    simpleUpload: {
        uploadUrl : '/help/uploadFaqImage'
    }
});



contents.newForm.onsubmit = e => {
    e.preventDefault();
    if (contents.newForm['cat'].value === '') {
        dialogCover.show();
        dialogLayer.show({
            title: '경고',
            content: '유형을 선택해 주세요',
            onConfirm: e => {
                e.preventDefault();
                dialogCover.hide();
                dialogLayer.hide();
                document.getElementById('newForm').toView();
                contents.newForm['cat'].focus();
            }
        });
        return;
    }

    if (contents.newForm['subject'].value === '') {
        dialogCover.show();
        dialogLayer.show({
            title: '경고',
            content: '제목을 입력해 주세요',
            onConfirm: e => {
                e.preventDefault();
                dialogCover.hide();
                dialogLayer.hide();
                document.getElementById('newForm').toView();
                contents.newForm['subject'].focus();
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


    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('cat', contents.newForm['cat'].value);
    formData.append('subject', contents.newForm['subject'].value);
    formData.append('content', contents.newForm['content'].value);


    xhr.open('POST', '/help/faq/write');
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
                    }
                });
            }
        } else {


        }
    };
    xhr.send(formData);
}






