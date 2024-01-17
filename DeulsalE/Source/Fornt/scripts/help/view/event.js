const content = document.getElementById('content');
const contents = document.getElementById('contents');



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


