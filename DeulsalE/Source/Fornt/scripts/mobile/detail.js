const contents = document.getElementById('contents');

if (contents.querySelector('.content') !== null) {

    if (contents.querySelector('#glampingFacility') !== null && contents.querySelector('#glampingFacility > ul > li') === null){
        contents.querySelector('#glampingFacility').classList.add('invisible');
    }


// 지도 로드
    function roadMap() {
        let mapContainer = document.getElementById('map'),
            mapOption = {
                center: new kakao.maps.LatLng(
                    mapContainer.querySelector('.lat').value,
                    mapContainer.querySelector('.lng').value),
                draggable: false,
                level: 3
            };

        let map = new kakao.maps.Map(mapContainer, mapOption);

        let marker = new kakao.maps.Marker({
            position: mapOption.center
        });
        //
        marker.setMap(map);

    }

    roadMap();

    // 카테고리
    const categoryK = ['일반야영장', '자동차야영장', '카라반', '글램핑'];
    let catList = '';
    let indexCat = 0;
    ['.generalCnt', '.autoCnt', '.caravanCnt', '.glampingCnt'].forEach(cat => {
        if (contents.querySelector(cat).value !== '0') {
            catList = catList === '' ? categoryK
                [indexCat] : catList + '/' + categoryK[indexCat];
        }
        indexCat++;
    });
    contents.querySelector('.campsiteCat').value = catList;

// 운영계절
    const seasonK = ['봄', '여름', '가을', '겨울'];
    let seasonList = '';
    let indexSeason = 0;
    ['.isSpring', '.isSummer', '.isFall', '.isWinter'].forEach(season => {
        if (contents.querySelector(season).value === 'true') {
            seasonList = seasonList === '' ? seasonK[indexSeason] : seasonList + '/' + seasonK[indexSeason];
        }
        indexSeason++;
    });
    contents.querySelector('.season').value = seasonList;

// 이미지 로드
    if (document.querySelector(".images") !== null) {
        let currentIndex = 0;//현재 인덱스
        let imgIndex = 0;//현제 이미지 인덱스
        const IMAGE_WIDTH = document.querySelector('.images > img').width;

        const backBtn = document.querySelector(".backBtn");
        const nextBtn = document.querySelector(".nextBtn");

        const images = document.querySelector(".images");
        const imageSelected = images.querySelectorAll('img');

        imageSelected[0].classList.add('selected');

        function next() {
            if (currentIndex <= imageSelected.length - 5) {
                backBtn.classList.remove('disabled');
                imgIndex -= IMAGE_WIDTH;
                images.style.transform = `translateX(${imgIndex}px)`;
                currentIndex += 1;
            }
            if (currentIndex === imageSelected.length - 5) {
                nextBtn.classList.add('disabled');
            }

            let preSelectedImg = getIndex();

            if (preSelectedImg < currentIndex || preSelectedImg > currentIndex + 5) {
                selectedImg(currentIndex);
            }
        }


        function back() {
            nextBtn.classList.remove('disabled');
            if (currentIndex > 0) {
                backBtn.classList.remove('disabled');
                imgIndex += IMAGE_WIDTH;
                images.style.transform = `translateX(${imgIndex}px)`;
                currentIndex -= 1; //이전 페이지로 이동해서 pages를 1감소 시킨다.

            }
            if (currentIndex === 0) {
                backBtn.classList.add('disabled');
            }

            let preSelectedImg = getIndex();

            if (preSelectedImg < currentIndex || preSelectedImg >= currentIndex + 5) {
                selectedImg(currentIndex + 4);
            }
        }

        function selectedImg(select) {
            imageSelected.forEach(function (e) {
                e.classList.remove('selected');
            });
            imageSelected.item(select).classList.add('selected');

            contents.querySelector('.imgChecked > .img').src = imageSelected.item(select).src;
        }

        function getIndex() {
            // selected 된 이미지 인덱스
            return [...contents.querySelector('.images').children].indexOf(contents.querySelector('.images > .selected'));
        }


        imageSelected.forEach((e, index) => {
            e.addEventListener('click', function () {

                imageSelected.forEach(function (e) {
                    e.classList.remove('selected');
                });
                e.classList.add('selected');

                contents.querySelector('.imgChecked > .img').src = e.src;
            });
        });

        // 초기 이미지 설정
        if (imageSelected.length <= 5) {
            nextBtn.classList.add('disabled');
        } else {
            backBtn.addEventListener("click", back);
            nextBtn.addEventListener("click", next);
        }
    }

// 요금안내 로드
    if (contents.querySelector('#price > input') != null) {
        const costListJson = JSON.parse(contents.querySelector('#price > input').value);
        const costList = document.getElementById('costList');

        for (let list in costListJson) {
            const tr = document.createElement('tr');
            const room = document.createElement('td');
            const cost = document.createElement('td');
            const person = document.createElement('td');
            const costAdd = document.createElement('td');
            room.innerText = list;
            cost.innerText = `${costListJson[list]['cost']}원`;
            let maxPerson = parseInt(costListJson[list]['allowPerson']) + parseInt(costListJson[list]['addPerson']);
            person.innerText = `${costListJson[list]['allowPerson']}~${maxPerson}명`;
            costAdd.innerText = `${costListJson[list]['addPersonCost']}원`;


            tr.append(room, cost, person, costAdd);
            costList.append(tr);
        }
    }


// 이벤트_즐겨찾기
    contents.querySelector('.bookmark').addEventListener('click',
        function () {
            const book = 'https://img.icons8.com/small/32/28CB5B/filled-bookmark-ribbon.png';
            const unBook = 'https://img.icons8.com/small/32/000000/bookmark-ribbon.png';
            if (document.querySelector('.userId') !== null) {
                const userId = document.querySelector('.userId').value;
                const campsiteIndex = contents.querySelector('.campsiteIndex').value;
                const xhr = new XMLHttpRequest();
                const formData = new FormData();
                formData.append('userId', userId);
                formData.append('campsiteIndex', campsiteIndex);
                if (contents.querySelector('.bookmark').classList.contains('unBook')) {
                    xhr.open('DELETE', '/member/bookmark');
                    xhr.onreadystatechange = () => {
                        if (xhr.readyState === XMLHttpRequest.DONE) {
                            if (xhr.status >= 200 && xhr.status < 300) {
                                const response = xhr.responseText;

                                if (response === 'true') {
                                    console.log('즐겨찾기 해제 성공');
                                    contents.querySelector('.bookmark').src = unBook;
                                    contents.querySelector('.bookmark').classList.remove('unBook');
                                } else {
                                    console.log('즐겨찾기 해제 실패');
                                    contents.querySelector('.bookmark').src = book;
                                }

                            } else {
                                console.log('알 수 없는 오류');
                                contents.querySelector('.bookmark').src = book;
                                contents.querySelector('.bookmark').classList.remove('unBook');
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
                                    contents.querySelector('.bookmark').src = book;
                                    contents.querySelector('.bookmark').classList.add('unBook');
                                } else {
                                    console.log('즐겨찾기 실패');
                                    contents.querySelector('.bookmark').src = unBook;
                                }

                            } else {
                                console.log('알 수 없는 오류');
                                contents.querySelector('.bookmark').src = unBook;
                                contents.querySelector('.bookmark').classList.remove('unBook');
                            }
                        }
                    }
                    xhr.send(formData);
                }
            } else {
                window.location.href = '/mobile/login';
            }
        });


// 탭 전환
    contents.querySelectorAll('.tabMenu > .banner > label').forEach(e => {
        e.addEventListener('click', function () {
            if (e.getAttribute('for') === 'tab1') {
                contents.querySelector('.tabMenu > .content > .tabContent1').style.display = 'block';
                contents.querySelector('.tabMenu > .content > .tabContent2').style.display = 'none';
            } else {
                contents.querySelector('.tabMenu > .content > .tabContent1').style.display = 'none';
                contents.querySelector('.tabMenu > .content > .tabContent2').style.display = 'block';
                roadMap();
            }
        });
    });
} else {
    contents.querySelector('.backBtn').addEventListener('click', function (e) {
        history.back();
    });
    contents.querySelector('.homeBtn').addEventListener('click', function (e) {
        window.location.href = '/';
    });
}