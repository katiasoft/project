const campsites = document.getElementById('campsites');
window.addEventListener('scroll', function () {
    const subBenPosition = document.getElementById('subBene').getBoundingClientRect().top;
    if (subBenPosition <= 0) {
        document.getElementById('recommendBtn').style.display = 'block';
    } else {
        document.getElementById('recommendBtn').style.display = 'none';
    }
});

// dialogLayer.onsubmit= e =>{
//     e.preventDefault();
//     dialogLayer.hide();
//     dialogCover.hide();
// }

const cancelBtn = document.querySelector('.cancelBtn');
const searchForm = document.getElementById('searchForm');
searchForm.addEventListener('submit', function (e) {

    if (searchForm.querySelector('.searchInput').value.trim() === '') {
        e.preventDefault();
        alert('검색어를 입력해주세요');
        return;
    }

});
if (searchForm.querySelector('.searchInput').value === '') {
    cancelBtn.classList.add('invisible');
} else {
    cancelBtn.classList.remove('invisible');
}
cancelBtn.addEventListener('click', function () {
    document.querySelector('.searchInput').value = '';
    cancelBtn.classList.add('invisible');

});


if (campsites) {


    const campsiteBookmark = campsites.querySelectorAll('.campsiteBookmark');

    campsiteBookmark.forEach(bookmark => {


        bookmark.querySelector('.bookmark').addEventListener('click',
            function (e) {
                e.stopPropagation();
                const book = 'https://img.icons8.com/small/32/28CB5B/filled-bookmark-ribbon.png';
                const unBook = 'https://img.icons8.com/small/32/000000/bookmark-ribbon.png';

                if (document.querySelector('.userId') !== null) {
                    const userId = document.querySelector('.userId').value;
                    const campsiteIndex = bookmark.querySelector('.campsiteIndex').value;

                    const xhr = new XMLHttpRequest();
                    const formData = new FormData();
                    formData.append('userId', userId);
                    formData.append('campsiteIndex', campsiteIndex);


                    if (bookmark.querySelector('.bookmark').classList.contains('unBook')) {
                        xhr.open('DELETE', '/member/bookmark');
                        xhr.onreadystatechange = () => {
                            if (xhr.readyState === XMLHttpRequest.DONE) {
                                if (xhr.status >= 200 && xhr.status < 300) {
                                    const response = xhr.responseText;

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
                        xhr.send(formData);
                    } else {
                        xhr.open('POST', '/member/bookmark');
                        xhr.onreadystatechange = () => {
                            if (xhr.readyState === XMLHttpRequest.DONE) {
                                if (xhr.status >= 200 && xhr.status < 300) {
                                    const response = xhr.responseText;

                                    if (response === 'true') {
                                        console.log('즐겨찾기 설정');
                                        bookmark.querySelector('.bookmark').src = book;
                                        bookmark.querySelector('.bookmark').classList.add('unBook');
                                        location.reload();
                                    } else {
                                        console.log('즐겨찾기 실패');
                                        bookmark.querySelector('.bookmark').src = unBook;
                                        alert('캠핑장 테이블에 유저 정보가 없습니다.');
                                    }

                                } else {
                                    console.log('알 수 없는 오류');
                                    bookmark.querySelector('.bookmark').src = unBook;
                                    bookmark.querySelector('.bookmark').classList.remove('unBook');
                                    alert('캠핑장 테이블에 유저 정보가 없습니다.');
                                }
                            }
                        }
                        xhr.send(formData);
                    }


                } else {
                    window.location.href = '/user/login';
                }

            });

    });
}

