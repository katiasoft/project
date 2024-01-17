const reviewForm = document.getElementById('reviewForm');
function isFileImage(file){
    let pathPoint = file.value.lastIndexOf('.');
    let filePoint = file.value.substring(pathPoint+1, file.length);
    let fileType = filePoint.toLowerCase();

    if (fileType !== 'jpg' && fileType !== 'gif' && fileType !== 'png' && fileType !== 'jpeg' && fileType !== 'bmp'){
        alert('이미지 파일만 선택할 수 있습니다.');
        file.value = '';
        return false;
    }

    if (file.files.length >5){
        alert('이미지 파일은 최대 5개 선택해주세요.');
        file.value = '';
        return false;
    }

    return true;
}

reviewForm['file-cancel'].onclick = e => {
    e.preventDefault();
    reviewForm['someFile'].value = '';
    alert('초기화시킨다')
}


reviewForm.stars = reviewForm.querySelectorAll('.star');
reviewForm.stars.forEach(star => {
    star.addEventListener('click', function (){
        reviewForm['ratingValue'].value = `${star.value}.0 점`;
        for(let i = 0; i<5; i++){
            reviewForm.stars[i].nextElementSibling.querySelector('img').src = 'https://img.icons8.com/metro/26/star.png';
        }

        for(let i = 0; i<star.value; i++){
            reviewForm.stars[i].nextElementSibling.querySelector('img').src = 'https://img.icons8.com/metro/26/F7DE5A/filled-star.png';
        }
    });

});

reviewForm.onsubmit = e => {
    e.preventDefault();
    if (reviewForm['review'].value ===''){
        alert('리뷰를 작성해주세요.');
        return;
    }
    console.log(reviewForm['review'].value.length);
    if (reviewForm['review'].value.length < 10){
        alert('최소 10자 이상 작성해주세요.');
        return;
    }
    if (reviewForm['review'].value.length > 100){
        alert('최대 100자 이하로 작성해주세요.');
        return;
    }
    alert('리뷰를 작성합니다.');

    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('reservationIndex', reviewForm['reservationIndex'].value);
    formData.append('campsiteIndex', reviewForm['campsiteIndex'].value);
    formData.append('comment', reviewForm['review'].value);
    formData.append('rating', reviewForm['ratingValue'].value.split('.')[0]);

    for (const file of reviewForm['someFile'].files){
        formData.append('files', file);
    }

    xhr.open('POST', '/member/review');
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

}