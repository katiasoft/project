const modifyForm = document.getElementById('modifyForm');

modifyForm['file-cancel'].onclick = e => {
    e.preventDefault();
    modifyForm['someFile'].value = '';
    alert('초기화시킨다')
}


modifyForm.stars = modifyForm.querySelectorAll('.star');
modifyForm.stars.forEach(star => {

    star.addEventListener('click', function (){
        modifyForm['ratingValue'].value = `${star.value}.0 점`;
        for(let i = 0; i<5; i++){
            modifyForm.stars[i].nextElementSibling.querySelector('img').src = 'https://img.icons8.com/metro/26/star.png';
        }

        for(let i = 0; i<star.value; i++){
            modifyForm.stars[i].nextElementSibling.querySelector('img').src = 'https://img.icons8.com/metro/26/F7DE5A/filled-star.png';
        }
    });

});

modifyForm.onsubmit = e => {
    e.preventDefault();
    if (modifyForm['review'].value ===''){
        alert('리뷰를 작성해주세요.');
        return;
    }
    console.log(modifyForm['review'].value.length);
    if (modifyForm['review'].value.length < 10){
        alert('최소 10자 이상 작성해주세요.');
        return;
    }
    if (modifyForm['review'].value.length > 100){
        alert('최대 100자 이하로 작성해주세요.');
        return;
    }
    alert('리뷰를 수정합니다.');

    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('index', modifyForm['reviewIndex'].value);
    formData.append('comment', modifyForm['review'].value);
    formData.append('rating', modifyForm['ratingValue'].value.split('.')[0]);
    xhr.open('PATCH', '/member/review');
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