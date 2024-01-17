const searchForm = document.getElementById('searchForm');
const contents = document.getElementById('contents');
const campsites = document.getElementById('campsites');

function createCampsites(responseObject) {
    for (let obj in responseObject.campsites){
        const campsiteObj = responseObject.campsites[obj];
        const categoryObj = responseObject.campsiteCat;

        const campsite = document.createElement('div');
        campsite.classList.add('campsite');
        // campsite.setAttribute('onclick', `location.href='/member/detail?index=${campsiteObj['index']}'`);

        const containerImg = document.createElement('div');
        containerImg.classList.add('containerImg');

        const campsiteImg = document.createElement('a');
        campsiteImg.classList.add('campsiteImg');
        // campsiteImg.setAttribute('th:href', '@{/member/detail?index=15}');

        const img =  document.createElement('img');
        img.classList.add('img');
        img.setAttribute('src', `/member/image/campsiteMain?campsiteIndex=${campsiteObj['index']}`);
        img.setAttribute('onerror', `this.src='/resources/images/member/noImage.jpg'; this.classList.add('not_found')`);

        campsiteImg.append(img);
        containerImg.append(campsiteImg);

        const contentIcon = document.createElement('div');
        contentIcon.classList.add('contentIcon');

        const iconStar = document.createElement('label');
        iconStar.classList.add('icon');

        const imgStar = document.createElement('img');
        imgStar.classList.add('img');
        imgStar.src = 'https://img.icons8.com/small/32/F7DE5A/filled-star.png';

        const inputStar = document.createElement('input');
        inputStar.setAttribute('type', 'text');
        if (campsiteObj['star']%1 ===0){
            inputStar.value = `${campsiteObj['star']}.0`;
        } else {
            inputStar.value = `${campsiteObj['star']}`;
        }
        inputStar.name = 'rating';
        inputStar.readOnly = true;

        iconStar.append(imgStar, inputStar);

        const iconReview = document.createElement('label');
        iconReview.classList.add('icon');

        const imgReview = document.createElement('img');
        imgReview.classList.add('img');
        imgReview.src = 'https://img.icons8.com/small/32/000000/comments.png';

        const inputReview = document.createElement('input');
        inputReview.setAttribute('type', 'text');
        inputReview.value = `${campsiteObj['reviewCnt']}`;
        inputReview.name = 'reviewCnt';
        inputReview.readOnly = true;

        iconReview.append(imgReview, inputReview);

        const campsiteBookmark = document.createElement('div');
        campsiteBookmark.classList.add('campsiteBookmark');

        // if (responseObject.user === undefined || responseObject.campsites === undefined || responseObject.campsiteIsBook.get(responseObject.user['id']) === 0){
        //     const unBook = document.createElement('img');
        //     unBook.classList.add('bookmark', 'unBook');
        //     unBook.setAttribute('th:if', `${responseObject.user} != undefined`);
        //     unBook.src = 'https://img.icons8.com/small/32/28CB5B/filled-bookmark-ribbon.png';
        //     unBook.alt = '즐겨찾기';
        //     unBook.setAttribute('onerror', `this.src='https://img.icons8.com/small/32/000000/bookmark-ribbon.png'`);
        // }

        if (responseObject.user !== undefined && responseObject.campsiteIsBook[campsiteObj['index']] !== 0){
            const unBook = document.createElement('img');
            unBook.classList.add('bookmark', 'unBook');
            unBook.setAttribute('th:if', `${responseObject.user} != undefined`);
            unBook.src = 'https://img.icons8.com/small/32/28CB5B/filled-bookmark-ribbon.png';
            unBook.alt = '즐겨찾기';
            unBook.setAttribute('onerror', `this.src='https://img.icons8.com/small/32/000000/bookmark-ribbon.png'`);

            campsiteBookmark.append(unBook);
        } else {
            const book = document.createElement('img');
            book.classList.add('bookmark', 'book');
            book.setAttribute('th:if', `${responseObject.user} == undefined`);
            book.src = 'https://img.icons8.com/small/32/28CB5B/bookmark-ribbon.png';
            book.alt = '즐겨찾기';
            book.setAttribute('onerror', `this.src='https://img.icons8.com/small/32/000000/bookmark-ribbon.png'`);

            campsiteBookmark.append(book);
        }

        const campsiteIndex = document.createElement('input');
        campsiteIndex.classList.add('campsiteIndex');
        campsiteIndex.setAttribute('type', 'hidden');
        campsiteIndex.value = `${campsiteObj['index']}`;
        campsiteIndex.name = 'index';
        campsiteIndex.readOnly = true;

        contentIcon.append(iconStar, iconReview, campsiteBookmark, campsiteIndex);

        const content = document.createElement('div');
        content.classList.add('content');

        const contentData = document.createElement('div');
        contentData.classList.add('contentData');

        const data = document.createElement('label');
        data.classList.add('data');

        const name = document.createElement('input');
        name.setAttribute('type', 'text');
        name.value = `${campsiteObj['name']}`;
        name.name = 'name';
        name.readOnly = true;

        const category = document.createElement('input');
        category.setAttribute('type', 'text');
        category.value = `${categoryObj[campsiteObj['index']]}`;
        category.name = 'category';
        category.readOnly = true;

        const address = document.createElement('input');
        address.setAttribute('type', 'text');
        address.value = `${campsiteObj['numberAd']}`;
        address.name = 'address';
        address.readOnly = true;

        data.append(name, category, address);
        contentData.append(data);
        content.append(contentData);
        campsite.append(containerImg,contentIcon, content);


        campsites.append(campsite);

    }

}

function loadCampsites() {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('code', searchForm['code'].value);
    formData.append('sort', searchForm['sort'].value);
    formData.append('query', searchForm['query'].value);
    xhr.open('POST', '/mobile/campsite');
    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status >= 200 && xhr.status < 300) {
                const responseObject = JSON.parse(xhr.responseText);
                console.log(responseObject);

                if (responseObject.user === undefined){
                    console.log('성공이다');
                }

                if (responseObject.campsites.length === 0){
                    contents.querySelector('.empty').classList.remove('invisible');
                } else {
                    createCampsites(responseObject);
                }




            } else {
                console.log('으악');

            }
        }

        console.log('으으악');
    }
    xhr.send(formData);
}

// loadCampsites();

// campsites.querySelectorAll('.campsite').forEach(el => {
//     el.addEventListener('click', function (e){
//         alert('버블링 발생');
//     });
// });

if(campsites.querySelector('.campsite.empty') == null){
    const campsiteBookmark = campsites.querySelectorAll('.campsiteBookmark');

    campsiteBookmark.forEach(bookmark => {


        bookmark.querySelector('.bookmark').addEventListener('click',
            function (e){
                e.stopPropagation();
                const book = 'https://img.icons8.com/small/32/28CB5B/filled-bookmark-ribbon.png';
                const unBook = 'https://img.icons8.com/small/32/000000/bookmark-ribbon.png';

                const campsiteIndex = bookmark.querySelector('.campsiteIndex').value;

                const xhr = new XMLHttpRequest();
                const formData = new FormData();
                formData.append('campsiteIndex', campsiteIndex);

                if(bookmark.querySelector('.bookmark').classList.contains('unBook')){
                    xhr.open('DELETE', '/mobile/bookmark');
                    xhr.onreadystatechange = () => {
                        if (xhr.readyState === XMLHttpRequest.DONE) {
                            if (xhr.status >= 200 && xhr.status < 300) {
                                const response = xhr.responseText;

                                if (response === 'user_null'){
                                    window.location.href = '/mobile/login';
                                    return;
                                }

                                if (response === 'true') {
                                    console.log('즐겨찾기 해제 성공');
                                    bookmark.querySelector('.bookmark').src = unBook;
                                    bookmark.querySelector('.bookmark').classList.remove('unBook');
                                    location.reload();
                                } else {
                                    console.log('즐겨찾기 해제 실패');
                                    bookmark.querySelector('.bookmark').src = book;
                                }

                            } else {
                                console.log('알 수 없는 오류');
                                bookmark.querySelector('.bookmark').src = book;
                                bookmark.querySelector('.bookmark').classList.remove('unBook');
                                alert('캠핑장 테이블에 유저 정보가 없습니다.');
                            }
                        }
                    }
                } else {
                    xhr.open('POST', '/mobile/bookmark');
                    xhr.onreadystatechange = () => {
                        if (xhr.readyState === XMLHttpRequest.DONE) {
                            if (xhr.status >= 200 && xhr.status < 300) {
                                const response = xhr.responseText;

                                if (response === 'user_null'){
                                    window.location.href = '/mobile/login';
                                    return;s
                                }

                                if (response === 'true') {
                                    // console.log('즐겨찾기 설정');
                                    bookmark.querySelector('.bookmark').src = book;
                                    bookmark.querySelector('.bookmark').classList.add('unBook');
                                    location.reload();
                                } else {
                                    // console.log('즐겨찾기 실패');
                                    bookmark.querySelector('.bookmark').src = unBook;
                                }

                            } else {
                                // console.log('알 수 없는 오류');
                                bookmark.querySelector('.bookmark').src = unBook;
                                bookmark.querySelector('.bookmark').classList.remove('unBook');
                            }
                        }
                    }
                }
                xhr.send(formData);

            });

    });
}

