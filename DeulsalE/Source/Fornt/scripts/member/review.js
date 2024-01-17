const reviewList = document.getElementById('reviewList');


reviewList.deleteBtn = reviewList.querySelectorAll('.deleteBtn');
reviewList.deleteBtn.forEach(btn => {
    btn.addEventListener('click', function (){
        const xhr = new XMLHttpRequest();
        const formData = new FormData();
        formData.append('index', btn.nextElementSibling.value);
        xhr.open('DELETE', '/member/review');
        xhr.onreadystatechange = () => {
            if(xhr.readyState === XMLHttpRequest.DONE) {
                if(xhr.status >= 200 && xhr.status < 300){
                    console.log('아 성공');
                } else {
                    console.log('으악');

                }
            }
            console.log('아');
        }
        xhr.send(formData);
    });

});
