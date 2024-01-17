const newForm = document.getElementById('newForm');
const eventList = document.getElementById('eventList');
const contents = document.getElementById('contents');
const modifyForm = document.getElementById('modifyForm');


contents.newForm = contents.querySelector('[rel="newForm"]');

ClassicEditor.create(newForm['content'], {
    simpleUpload: {
        uploadUrl: '/help/uploadNoticeImage'
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
    for (let i = 0; i < contents.newForm['files'].files.length; i++) {
        formData.append('files', contents.newForm['files'].files[i]);
    }

    // formData.append('files', contents.newForm['files'].files[0]);

    xhr.open('POST', '/help/notice/write');
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
            } else {

            }

        }
    };
    xhr.send(formData);
}



// document.getElementById("upload").addEventListener("click", function () {
//     document.getElementById("uploadNewFiles").click(); // 파일 업로드 input 요소 클릭
// });
//
// document.getElementById("uploadNewFiles").addEventListener("change", function () {
//     const fileInput = document.getElementById("uploadNewFiles");
//     const fileCount = fileInput.files.length;
//
//     if (fileCount > 5) {
//         alert("최대 5개까지만 업로드할 수 있습니다.");
//         // 더 많은 파일 선택을 막기 위해 선택한 파일들을 초기화합니다.
//         fileInput.value = "";
//         return;
//     }
//
//     const fileUploadText = document.getElementById("fileUploadText");
//     fileUploadText.textContent = fileCount + "개가 선택되었습니다";
// });


document.getElementById("upload").addEventListener("click", function () {
    document.getElementById("uploadNewFiles").click(); // 파일 업로드 input 요소 클릭
});

document.getElementById("uploadNewFiles").addEventListener("change", function () {
    const fileInput = document.getElementById("uploadNewFiles");
    const fileCount = fileInput.files.length;

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

    const fileUploadText = document.getElementById("fileUploadText");
    fileUploadText.textContent = fileCount + "개가 선택되었습니다";
});


