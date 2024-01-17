// const infoType = document.getElementById("info_type");
// infoType.user = infoType.querySelector('[rel="user"]');
// infoType.entrepreneur = infoType.querySelector('[rel="entrepreneur"]')
//
// infoType.user.addEventListener('click', () => {
//     location.href = '/';
// });
//
// infoType.entrepreneur.addEventListener('click', () => {
//     location.href = '/';
// });
//
// const contents = document.getElementById('contents');
// contents.myInfoBtn = contents.querySelector('[rel="myInfoBtn"]');
// contents.reservationBtn = contents.querySelector('[rel="reservationBtn"]');
// contents.bookmarkBtn = contents.querySelector('[rel="bookmarkBtn"]');
// contents.helpBtn = contents.querySelector('[rel="helpBtn"]');
//
// const myInfoList = document.getElementById('myInfoList');
// const reservationList = document.getElementById('reservationList');
// const bookmarkList = document.getElementById('bookmarkList');
// const helpList = document.getElementById('helpList');
//
// function resetBtnClass() {
//     contents.myInfoBtn.classList.remove('selected');
//     contents.reservationBtn.classList.remove('selected');
//     contents.bookmarkBtn.classList.remove('selected');
//     contents.helpBtn.classList.remove('selected');
// }
//
// function resetListClass() {
//     myInfoList.classList.remove('visible');
//     reservationList.classList.remove('visible');
//     bookmarkList.classList.remove('visible');
//     helpList.classList.remove('visible');
//
//     myInfoList.classList.add('visible');
//     reservationList.classList.add('visible');
//     bookmarkList.classList.add('visible');
//     helpList.classList.add('visible');
// }
//
// contents.myInfoBtn.addEventListener('click', () => {
//     resetBtnClass();
//     resetListClass();
//     myInfoList.classList.remove('visible');
//     contents.myInfoBtn.classList.add('selected');
// });
//
// if (contents.reservationBtn !== null) {
//     contents.reservationBtn.addEventListener('click', () => {
//         resetBtnClass();
//         resetListClass();
//         reservationList.classList.remove('visible');
//         contents.reservationBtn.classList.add('selected');
//     });
// }
//
// if (contents.bookmarkBtn !== null) {
//     contents.bookmarkBtn.addEventListener('click', () => {
//         resetBtnClass();
//         resetListClass();
//         bookmarkList.classList.remove('visible');
//         contents.bookmarkBtn.classList.add('selected');
//     });
// }
//
// contents.helpBtn.addEventListener('click', () => {
//     resetBtnClass();
//     resetListClass();
//     helpList.classList.remove('visible');
//     contents.helpBtn.classList.add('selected');
// });
//
// myInfoList.nameModify = myInfoList.querySelector('[rel="nameModify"]');
// myInfoList.nicknameModify = myInfoList.querySelector('[rel="nicknameModify"]');
// myInfoList.passwordModify = myInfoList.querySelector('[rel="passwordModify"]');
// myInfoList.emailModify = myInfoList.querySelector('[rel="emailModify"]');
// myInfoList.phoneModify = myInfoList.querySelector('[rel="phoneModify"]');
//
// const dialogCover = document.getElementById('dialogCover');
// const emailCertifiedLayer = document.getElementById('emailCertifiedLayer');
// const contactCertifiedLayer = document.getElementById('contactCertifiedLayer');
//
// passwordForm = document.getElementById('passwordForm');
// contactForm = document.getElementById('contactForm');
// nameForm = document.getElementById('nameForm');
// emailForm = document.getElementById('emailForm');
//
// dialogCover.show = () => {
//     dialogCover.classList.add('visible');
// };
// dialogCover.hide = () => {
//     dialogCover.classList.remove('visible');
// };
//
// emailCertifiedLayer.show = () => {
//     emailCertifiedLayer.classList.add('visible');
// };
// emailCertifiedLayer.hide = () => {
//     emailCertifiedLayer.classList.remove('visible');
//     contactForm.classList.remove('visible');
//     passwordForm.classList.remove('visible');
// };
//
// contactCertifiedLayer.show = (mode) => {
//     contactForm.classList.remove('visible');
//     passwordForm.classList.remove('visible');
//     nameForm.classList.remove('visible')
//
//     if (mode === 'password') {
//         contactForm.classList.add('visible');
//         nameForm.classList.add('visible')
//     } else if (mode === 'contact') {
//         passwordForm.classList.add('visible');
//         nameForm.classList.add('visible')
//     } else {
//         contactForm.classList.add('visible');
//         passwordForm.classList.add('visible');
//     }
//     contactCertifiedLayer.classList.add('visible');
// };
// contactCertifiedLayer.hide = () => {
//     contactCertifiedLayer.classList.remove('visible');
// };
//
// emailCertifiedLayer.cancel = emailCertifiedLayer.querySelector('[rel="cancel"]');
// contactCertifiedLayer.contactCancel = contactCertifiedLayer.querySelector('[rel="contactCancel"]');
// contactCertifiedLayer.passwordCancel = contactCertifiedLayer.querySelector('[rel="passwordCancel"]');
// contactCertifiedLayer.nameCancel = contactCertifiedLayer.querySelector('[rel="nameCancel"]');
//
// emailCertifiedLayer.close = emailCertifiedLayer.querySelector('[rel="close"]');
// contactCertifiedLayer.contactClose = contactCertifiedLayer.querySelector('[rel="contactClose"]');
// contactCertifiedLayer.passwordClose = contactCertifiedLayer.querySelector('[rel="passwordClose"]');
// contactCertifiedLayer.nameClose = contactCertifiedLayer.querySelector('[rel="nameClose"]');
//
// emailCertifiedLayer.cancel.addEventListener('click', () => {
//     dialogCover.hide();
//     emailCertifiedLayer.hide();
// });
//
// contactCertifiedLayer.contactCancel.addEventListener('click', () => {
//     dialogCover.hide();
//     contactCertifiedLayer.hide();
// });
//
// contactCertifiedLayer.passwordCancel.addEventListener('click', () => {
//     dialogCover.hide();
//     contactCertifiedLayer.hide();
// });
//
// contactCertifiedLayer.nameCancel.addEventListener('click', () => {
//     dialogCover.hide();
//     contactCertifiedLayer.hide();
// });
//
// emailCertifiedLayer.close.addEventListener('click', () => {
//     dialogCover.hide();
//     emailCertifiedLayer.hide();
// });
//
// contactCertifiedLayer.contactClose.addEventListener('click', () => {
//     dialogCover.hide();
//     contactCertifiedLayer.hide();
// });
// contactCertifiedLayer.passwordClose.addEventListener('click', () => {
//     dialogCover.hide();
//     contactCertifiedLayer.hide();
// });
// contactCertifiedLayer.nameClose.addEventListener('click', () => {
//     dialogCover.hide();
//     contactCertifiedLayer.hide();
// });
//
// myInfoList.nameModify.addEventListener('click', () => {
//     dialogCover.show();
//     contactCertifiedLayer.show('name');
// });
//
// myInfoList.passwordModify.addEventListener('click', () => {
//     dialogCover.show();
//     contactCertifiedLayer.show('password');
// });
//
// myInfoList.phoneModify.addEventListener('click', () => {
//     dialogCover.show();
//     contactCertifiedLayer.show('contact');
// });
//
// myInfoList.emailModify.addEventListener('click', () => {
//     dialogCover.show();
//     emailCertifiedLayer.show();
// });
//
// const nameModify = myInfoList.querySelector('.name');
// nameModify.querySelector('._object-input').addEventListener('click', function () {
//     dialogCover.show();
//     contactCertifiedLayer.show('name');
// });
// nameForm.querySelector('.codeSendBtn').addEventListener('click', function () {
//     if (nameForm['newName'].value === '') {
//         alert('이름이 없고');
//         return;
//     }
//     if (nameForm['contact'][0].value === '') {
//         alert('첫번째가 빈거고');
//         return;
//     }
//     if (nameForm['contact'][1].value === '') {
//         alert('두번째가 빈거야');
//         return;
//     }
//
//     const xhr = new XMLHttpRequest();
//     const formData = new FormData();
//     formData.append('contact', '010'+nameForm['contact'][0].value + nameForm['contact'][1].value);
//     xhr.open('POST', '/sendContactCodeByUserId');
//     xhr.onreadystatechange = () => {
//         if (xhr.readyState === XMLHttpRequest.DONE) {
//             if (xhr.status >= 200 && xhr.status < 300) {
//                 const responseObject = JSON.parse(xhr.responseText);
//
//                 switch (responseObject.result) {
//                     case 'true':
//                         console.log('성고오옹');
//                         nameForm['newName'].setAttribute('disabled', 'disabled');
//                         nameForm['contact'][0].setAttribute('disabled', 'disabled');
//                         nameForm['contact'][1].setAttribute('disabled', 'disabled');
//                         nameForm.querySelector('.codeSendBtn').setAttribute('disabled', 'disabled');
//
//                         nameForm['salt'].value = responseObject.salt;
//                         nameForm['code'].removeAttribute('disabled');
//                         nameForm.querySelector('.verifyBtn').removeAttribute('disabled');
//
//                         // 다이얼로그
//
//                         break;
//                     case 'false':
//                         console.log('싪애');
//                         break;
//                     default:
//                         alert('서버가 알 수 없는 응답을 반환하였습니다.\n 잠시후 다시 시도해주세요.');
//
//                 }
//
//             } else {
//
//                 alert('서버오류!');
//             }
//         }
//     }
//     xhr.send(formData);
// });
// nameForm.querySelector('.verifyBtn').addEventListener('click', function () {
//     if (nameForm['salt'].value === '') {
//         alert('이건 없으면 사고임 ㅇㅇ');
//         return;
//     }
//     if (nameForm['code'].value === '') {
//         alert('코드가 읎댜');
//         return;
//     }
//
//     const xhr = new XMLHttpRequest();
//     const formData = new FormData();
//     formData.append('contact', '010'+nameForm['contact'][0].value + nameForm['contact'][1].value);
//     formData.append('code', nameForm['code'].value);
//     formData.append('salt', nameForm['salt'].value);
//     xhr.open('POST', '/verifyContact');
//     xhr.onreadystatechange = () => {
//         if (xhr.readyState === XMLHttpRequest.DONE) {
//             if (xhr.status >= 200 && xhr.status < 300) {
//                 const responseObject = JSON.parse(xhr.responseText);
//
//                 switch (responseObject.result) {
//                     case 'success':
//                         console.log('성고오옹');
//                         nameForm['code'].setAttribute('disabled', 'disabled');
//                         nameForm.querySelector('.verifyBtn').setAttribute('disabled', 'disabled');
//                         nameForm.querySelector('.confirm').removeAttribute('disabled');
//
//                         // 다이얼로그
//
//                         break;
//                     case 'failure':
//                         console.log('ㅎ어어어어어');
//                         break;
//                     case 'failure_expired':
//                         console.log('삭제실패');
//                         break;
//                     default:
//                         alert('서버가 알 수 없는 응답을 반환하였습니다.\n 잠시후 다시 시도해주세요.');
//
//                 }
//
//             } else {
//
//                 alert('서버오류!');
//             }
//         }
//     }
//     xhr.send(formData);
// });
// nameForm.addEventListener('submit', function () {
//     const xhr = new XMLHttpRequest();
//     const formData = new FormData();
//     formData.append('contact', '010'+nameForm['contact'][0].value + nameForm['contact'][1].value);
//     formData.append('name', nameForm['newName'].value);
//     xhr.open('POST', '/modify/name');
//     xhr.onreadystatechange = () => {
//         if (xhr.readyState === XMLHttpRequest.DONE) {
//             if (xhr.status >= 200 && xhr.status < 300) {
//                 const responseObject = JSON.parse(xhr.responseText);
//
//                 switch (responseObject.result) {
//                     case 'success':
//                         console.log('성고오옹');
//
//
//                         window.location.reload();
//
//                         // 다이얼로그
//
//                         break;
//                     case 'failure':
//                         console.log('ㅎ어어어어어');
//                         break;
//                     default:
//                         alert('서버가 알 수 없는 응답을 반환하였습니다.\n 잠시후 다시 시도해주세요.');
//
//                 }
//
//             } else {
//
//                 alert('서버오류!');
//             }
//         }
//     }
//     xhr.send(formData);
// });
//
// const nickNameModify = myInfoList.querySelector('.nickname');
// nickNameModify.querySelector('._object-button').addEventListener('click', function (){
//     if (nickNameModify.querySelector('._object-input').value === ''){
//         alert('닉네임을 입력 한하아앙ㅁ');
//         return;
//     }
//
//     const xhr = new XMLHttpRequest();
//     const formData = new FormData();
//     formData.append('preNickname', nickNameModify.querySelector('._object-input').placeholder);
//     formData.append('nickname', nickNameModify.querySelector('._object-input').value);
//     xhr.open('POST', '/modify/nickname');
//     xhr.onreadystatechange = () => {
//         if(xhr.readyState === XMLHttpRequest.DONE) {
//             if(xhr.status >= 200 && xhr.status < 300){
//                 const responseObject = JSON.parse(xhr.responseText);
//
//                 switch (responseObject.result){
//                     case 'success':
//                         console.log('이거지이잉');
//                         window.location.reload();
//                         // 다이얼로그
//                         break;
//                     case 'failure':
//                         console.log('업뎃 실패');
//                         break;
//                     case 'failure_not_found_user':
//                         console.log('없는사람');
//                         break;
//                     default:
//
//                         alert('서버가 알 수 없는 응답을 반환하였습니다.\n 잠시후 다시 시도해주세요.');
//                 }
//
//             } else {
//
//                 alert('서버오류!');
//             }
//         }
//     }
//     xhr.send(formData);
//
//
// });
//
//
//
// const contactModify = myInfoList.querySelector('.phone');
// contactModify.querySelectorAll('._object-input').forEach(element => {
//     element.addEventListener('click', function () {
//         dialogCover.show();
//         contactCertifiedLayer.show('contact');
//     });
// });
// contactForm.querySelector('.codeSendBtn').addEventListener('click', function () {
//
//     if (contactForm['contact'][0].value === '') {
//         alert('첫번째가 빈거고');
//         return;
//     }
//     if (contactForm['contact'][1].value === '') {
//         alert('두번째가 빈거야');
//         return;
//     }
//
//     const xhr = new XMLHttpRequest();
//     const formData = new FormData();
//     formData.append('contact', '010'+contactForm['contact'][0].value + contactForm['contact'][1].value);
//
//     xhr.open('POST', '/sendContactCode');
//     xhr.onreadystatechange = () => {
//         if (xhr.readyState === XMLHttpRequest.DONE) {
//             if (xhr.status >= 200 && xhr.status < 300) {
//                 const responseObject = JSON.parse(xhr.responseText);
//
//                 switch (responseObject.result) {
//                     case 'true':
//                         console.log('성고오옹');
//                         contactForm['contact'][0].setAttribute('disabled', 'disabled');
//                         contactForm['contact'][1].setAttribute('disabled', 'disabled');
//                         contactForm.querySelector('.codeSendBtn').setAttribute('disabled', 'disabled');
//
//                         contactForm['salt'].value = responseObject.salt;
//                         contactForm['code'].removeAttribute('disabled');
//                         contactForm.querySelector('.verifyBtn').removeAttribute('disabled');
//
//                         // 다이얼로그
//
//                         break;
//                     case 'false':
//                         console.log('싪애');
//                         break;
//                     default:
//                         alert('서버가 알 수 없는 응답을 반환하였습니다.\n 잠시후 다시 시도해주세요.');
//
//                 }
//
//             } else {
//
//                 alert('서버오류!');
//             }
//         }
//     }
//     xhr.send(formData);
// });
// contactForm.querySelector('.verifyBtn').addEventListener('click', function () {
//     if (contactForm['salt'].value === '') {
//         alert('이건 없으면 사고임 ㅇㅇ');
//         return;
//     }
//     if (contactForm['code'].value === '') {
//         alert('코드가 읎댜');
//         return;
//     }
//
//     const xhr = new XMLHttpRequest();
//     const formData = new FormData();
//     formData.append('contact', '010'+contactForm['contact'][0].value + contactForm['contact'][1].value);
//     formData.append('code', contactForm['code'].value);
//     formData.append('salt', contactForm['salt'].value);
//     xhr.open('POST', '/verifyContact');
//     xhr.onreadystatechange = () => {
//         if (xhr.readyState === XMLHttpRequest.DONE) {
//             if (xhr.status >= 200 && xhr.status < 300) {
//                 const responseObject = JSON.parse(xhr.responseText);
//
//                 switch (responseObject.result) {
//                     case 'success':
//                         console.log('성고오옹');
//                         contactForm['code'].setAttribute('disabled', 'disabled');
//                         contactForm.querySelector('.verifyBtn').setAttribute('disabled', 'disabled');
//                         contactForm.querySelector('.confirm').removeAttribute('disabled');
//
//                         // 다이얼로그
//
//                         break;
//                     case 'failure':
//                         console.log('ㅎ어어어어어');
//                         break;
//                     case 'failure_expired':
//                         console.log('삭제실패');
//                         break;
//                     default:
//                         alert('서버가 알 수 없는 응답을 반환하였습니다.\n 잠시후 다시 시도해주세요.');
//
//                 }
//
//             } else {
//
//                 alert('서버오류!');
//             }
//         }
//     }
//     xhr.send(formData);
// });
// contactForm.addEventListener('submit', function () {
//     const xhr = new XMLHttpRequest();
//     const formData = new FormData();
//     formData.append('contact', '010'+contactForm['contact'][0].value + contactForm['contact'][1].value);
//     formData.append('preContact', '010'+contactModify.querySelectorAll('._object-input')[1].placeholder + contactModify.querySelectorAll('._object-input')[2].placeholder);
//
//     xhr.open('POST', '/modify/contact');
//     xhr.onreadystatechange = () => {
//         if (xhr.readyState === XMLHttpRequest.DONE) {
//             if (xhr.status >= 200 && xhr.status < 300) {
//                 const responseObject = JSON.parse(xhr.responseText);
//
//                 switch (responseObject.result) {
//                     case 'success':
//                         console.log('성고오옹');
//
//
//                         window.location.reload();
//
//                         // 다이얼로그
//
//                         break;
//                     case 'failure':
//                         console.log('ㅎ어어어어어');
//                         break;
//                     default:
//                         alert('서버가 알 수 없는 응답을 반환하였습니다.\n 잠시후 다시 시도해주세요.');
//
//                 }
//
//             } else {
//
//                 alert('서버오류!');
//             }
//         }
//     }
//     xhr.send(formData);
// });
//
//
//
//
// const emailModify = myInfoList.querySelector('.email');
// emailModify.querySelectorAll('._object-input').forEach(element => {
//     element.addEventListener('click', function () {
//         dialogCover.show();
//         emailCertifiedLayer.show();
//     });
// });
// emailForm.querySelector('.codeSendBtn').addEventListener('click', function () {
//
//     if (emailForm['email'].value === '') {
//         alert('이메일 빈거고');
//         return;
//     }
//
//     const xhr = new XMLHttpRequest();
//     const formData = new FormData();
//     formData.append('email', emailForm['email'].value);
//
//     xhr.open('POST', '/sendEmailCode');
//     xhr.onreadystatechange = () => {
//         if (xhr.readyState === XMLHttpRequest.DONE) {
//             if (xhr.status >= 200 && xhr.status < 300) {
//                 const responseObject = JSON.parse(xhr.responseText);
//
//                 switch (responseObject.result) {
//                     case 'true':
//                         console.log('성고오옹');
//                         emailForm['email'].setAttribute('disabled', 'disabled');
//                         emailForm.querySelector('.codeSendBtn').setAttribute('disabled', 'disabled');
//
//                         emailForm['salt'].value = responseObject.salt;
//                         emailForm['code'].removeAttribute('disabled');
//                         emailForm.querySelector('.verifyBtn').removeAttribute('disabled');
//
//                         // 다이얼로그
//
//                         break;
//                     case 'false':
//                         console.log('싪애');
//                         break;
//                     default:
//                         alert('서버가 알 수 없는 응답을 반환하였습니다.\n 잠시후 다시 시도해주세요.');
//
//                 }
//
//             } else {
//
//                 alert('서버오류!');
//             }
//         }
//     }
//     xhr.send(formData);
// });
// emailForm.querySelector('.verifyBtn').addEventListener('click', function () {
//     if (emailForm['salt'].value === '') {
//         alert('이건 없으면 사고임 ㅇㅇ');
//         return;
//     }
//     if (emailForm['code'].value === '') {
//         alert('코드가 읎댜');
//         return;
//     }
//
//     const xhr = new XMLHttpRequest();
//     const formData = new FormData();
//     formData.append('email', emailForm['email'].value);
//     formData.append('code', emailForm['code'].value);
//     formData.append('salt', emailForm['salt'].value);
//     xhr.open('POST', '/verifyEmail');
//     xhr.onreadystatechange = () => {
//         if (xhr.readyState === XMLHttpRequest.DONE) {
//             if (xhr.status >= 200 && xhr.status < 300) {
//                 const responseObject = JSON.parse(xhr.responseText);
//
//                 switch (responseObject.result) {
//                     case 'success':
//                         console.log('성고오옹');
//                         emailForm['code'].setAttribute('disabled', 'disabled');
//                         emailForm.querySelector('.verifyBtn').setAttribute('disabled', 'disabled');
//                         emailForm.querySelector('.confirm').removeAttribute('disabled');
//
//                         // 다이얼로그
//
//                         break;
//                     case 'failure':
//                         console.log('ㅎ어어어어어');
//                         break;
//                     case 'failure_expired':
//                         console.log('삭제실패');
//                         break;
//                     default:
//                         alert('서버가 알 수 없는 응답을 반환하였습니다.\n 잠시후 다시 시도해주세요.');
//
//                 }
//
//             } else {
//
//                 alert('서버오류!');
//             }
//         }
//     }
//     xhr.send(formData);
// });
// emailForm.addEventListener('submit', function () {
//     const xhr = new XMLHttpRequest();
//     const formData = new FormData();
//     formData.append('email', emailForm['email'].value);
//     formData.append('preEmail', emailModify.querySelectorAll('._object-input')[0].value + '@' + emailModify.querySelectorAll('._object-input')[1].value);
//
//     xhr.open('POST', '/modify/email');
//     xhr.onreadystatechange = () => {
//         if (xhr.readyState === XMLHttpRequest.DONE) {
//             if (xhr.status >= 200 && xhr.status < 300) {
//                 const responseObject = JSON.parse(xhr.responseText);
//
//                 switch (responseObject.result) {
//                     case 'success':
//                         console.log('성고오옹');
//
//
//                         window.location.reload();
//
//                         // 다이얼로그
//
//                         break;
//                     case 'failure':
//                         console.log('ㅎ어어어어어');
//                         break;
//                     default:
//                         alert('서버가 알 수 없는 응답을 반환하였습니다.\n 잠시후 다시 시도해주세요.');
//
//                 }
//
//             } else {
//
//                 alert('서버오류!');
//             }
//         }
//     }
//     xhr.send(formData);
// });
//
//
//
//
// const passwordModify = myInfoList.querySelector('.password');
// passwordModify.querySelectorAll('._object-input').forEach(element => {
//     element.addEventListener('click', function () {
//         dialogCover.show();
//         contactCertifiedLayer.show('password');
//
//     });
// });
// passwordForm.querySelector('.codeSendBtn').addEventListener('click', function () {
//     if (passwordForm['password'].value === '') {
//         alert('첫번째 빈거고');
//         return;
//     }
//     if (passwordForm['passwordCheck'].value === '') {
//         alert('두번째 빈거고');
//         return;
//     }
//     if (passwordForm['password'].value !== passwordForm['passwordCheck'].value) {
//         alert('같지 않음');
//         return;
//     }
//     if (passwordForm['contact'][0].value === '') {
//         alert('첫번재 빔');
//         return;
//     }
//     if (passwordForm['contact'][1].value === '') {
//         alert('두번째 빔');
//         return;
//     }
//
//     const xhr = new XMLHttpRequest();
//     const formData = new FormData();
//     formData.append('contact', `010${passwordForm['contact'][0].value+passwordForm['contact'][1].value}`);
//
//     xhr.open('POST', '/sendContactCodeByUserId');
//     xhr.onreadystatechange = () => {
//         if (xhr.readyState === XMLHttpRequest.DONE) {
//             if (xhr.status >= 200 && xhr.status < 300) {
//                 const responseObject = JSON.parse(xhr.responseText);
//
//                 switch (responseObject.result) {
//                     case 'true':
//                         console.log('성고오옹');
//
//                         passwordForm['password'].setAttribute('disabled', 'disabled');
//                         passwordForm['passwordCheck'].setAttribute('disabled', 'disabled');
//                         passwordForm['contact'][0].setAttribute('disabled', 'disabled');
//                         passwordForm['contact'][1].setAttribute('disabled', 'disabled');
//                         passwordForm.querySelector('.codeSendBtn').setAttribute('disabled', 'disabled');
//
//                         passwordForm['salt'].value = responseObject.salt;
//                         passwordForm['code'].removeAttribute('disabled');
//                         passwordForm.querySelector('.verifyBtn').removeAttribute('disabled');
//
//                         // 다이얼로그
//
//                         break;
//                     case 'false':
//                         console.log('싪애');
//                         break;
//                     default:
//                         alert('서버가 알 수 없는 응답을 반환하였습니다.\n 잠시후 다시 시도해주세요.');
//
//                 }
//
//             } else {
//
//                 alert('서버오류!');
//             }
//         }
//     }
//     xhr.send(formData);
// });
// passwordForm.querySelector('.verifyBtn').addEventListener('click', function () {
//     if (passwordForm['salt'].value === '') {
//         alert('이건 없으면 사고임 ㅇㅇ');
//         return;
//     }
//     if (passwordForm['code'].value === '') {
//         alert('코드가 읎댜');
//         return;
//     }
//
//     const xhr = new XMLHttpRequest();
//     const formData = new FormData();
//     formData.append('contact', `010${passwordForm['contact'][0].value+passwordForm['contact'][1].value}`);
//     formData.append('code', passwordForm['code'].value);
//     formData.append('salt', passwordForm['salt'].value);
//     xhr.open('POST', '/verifyContact');
//     xhr.onreadystatechange = () => {
//         if (xhr.readyState === XMLHttpRequest.DONE) {
//             if (xhr.status >= 200 && xhr.status < 300) {
//                 const responseObject = JSON.parse(xhr.responseText);
//
//                 switch (responseObject.result) {
//                     case 'success':
//                         console.log('성고오옹');
//                         passwordForm['code'].setAttribute('disabled', 'disabled');
//                         passwordForm.querySelector('.verifyBtn').setAttribute('disabled', 'disabled');
//                         passwordForm.querySelector('.confirm').removeAttribute('disabled');
//
//                         // 다이얼로그
//
//                         break;
//                     case 'failure':
//                         console.log('ㅎ어어어어어');
//                         break;
//                     case 'failure_expired':
//                         console.log('삭제실패');
//                         break;
//                     default:
//                         alert('서버가 알 수 없는 응답을 반환하였습니다.\n 잠시후 다시 시도해주세요.');
//
//                 }
//
//             } else {
//
//                 alert('서버오류!');
//             }
//         }
//     }
//     xhr.send(formData);
// });
// passwordForm.addEventListener('submit', function () {
//     const xhr = new XMLHttpRequest();
//     const formData = new FormData();
//     formData.append('email', passwordForm['email'].value);
//     formData.append('preEmail', passwordModify.querySelectorAll('._object-input')[0].value + '@' + passwordForm.querySelectorAll('._object-input')[1].value);
//
//     xhr.open('POST', '/modify/email');
//     xhr.onreadystatechange = () => {
//         if (xhr.readyState === XMLHttpRequest.DONE) {
//             if (xhr.status >= 200 && xhr.status < 300) {
//                 const responseObject = JSON.parse(xhr.responseText);
//
//                 switch (responseObject.result) {
//                     case 'success':
//                         console.log('성고오옹');
//
//
//                         window.location.reload();
//
//                         // 다이얼로그
//
//                         break;
//                     case 'failure':
//                         console.log('ㅎ어어어어어');
//                         break;
//                     default:
//                         alert('서버가 알 수 없는 응답을 반환하였습니다.\n 잠시후 다시 시도해주세요.');
//
//                 }
//
//             } else {
//
//                 alert('서버오류!');
//             }
//         }
//     }
//     xhr.send(formData);
// });
//
//
//
// // document.addEventListener('DOMContentLoaded', () => {
// //     const newEmailSend = emailCertifiedLayer.querySelector('[name="newEmailSend"]');
// //     const newEmail = emailCertifiedLayer.querySelector('[name="newEmail"]')
// //     const newEmailCode = emailCertifiedLayer.querySelector('[name="newEmailCode"]');
// //     const newEmailCodeVerify = emailCertifiedLayer.querySelector('[name="newEmailCodeVerify"]');
// //
// //     // 이메일 변경 이메일 인증번호 보내기
// //     newEmailSend.onclick = () => {
// //         if (newEmail.value === '') {
// //             alert("변경하고자 하는 이메일을 입력해주세요.");
// //             newEmail.focus();
// //             return;
// //         }
// //         if (!new RegExp('^(?=.{10,50}$)([\\da-zA-Z\\-_]{5,25})@([\\da-z][\\da-z\\-]*[\\da-z]\\.)?([\\da-z][\\da-z\\-]*[\\da-z])\\.([a-z]{2,15})(\\.[a-z]{2})?$').test(newEmail.value)) {
// //             alert("올바른 이메일을 입력해주세요.")
// //             newEmail.focus();
// //             return;
// //         }
// //         const xhr = new XMLHttpRequest();
// //         xhr.open('GET', `/newEmail?email=${newEmail.value}`);
// //         xhr.onreadystatechange = () => {
// //             if (xhr.readyState === XMLHttpRequest.DONE) {
// //                 if (xhr.status >= 200 && xhr.status < 300) {
// //                     const responseObject = JSON.parse(xhr.responseText);
// //                     switch (responseObject.result) {
// //                         case 'failure':
// //                             alert('일단 안됨');
// //                             newEmail.focus();
// //                             break;
// //                         case 'success' :
// //                             alert('입력하신 이메일로 인증번호를 전송하였습니다. \n 5분이내에 인증을 완료해주세요.');
// //                             newEmail.setAttribute('disabled', 'disabled');
// //                             emailCertifiedLayer.querySelector('[name="newEmailSend"]').setAttribute('disabled', 'disabled');
// //                             emailCertifiedLayer.querySelector('[name="newEmailCode"]').removeAttribute('disabled');
// //                             emailCertifiedLayer.querySelector('[name="newEmailCodeVerify"]').removeAttribute('disabled');
// //                             emailCertifiedLayer.querySelector('[name="newEmailCode"]').focus();
// //                             emailCertifiedLayer.querySelector('[name="newEmailAuthCodeSalt"]').value = responseObject.salt;
// //                             break;
// //                         default:
// //                             alert('서버가 알 수 없는 응답을 반환하였습니다.\n 잠시후 다시 시도해주세요.');
// //                     }
// //                 } else {
// //                     alert('서버와 통신하지 못하였습니다.\n 잠시 후 다시 시도해주세요.')
// //                 }
// //             }
// //         };
// //         xhr.send();
// //     }
// //     // 이메일 변경 이메일 인증번호 확인
// //     newEmailCodeVerify.onclick = () => {
// //         if (newEmailCode.value === '') {
// //             alert('인증번호를 입력해 주세요.');
// //             newEmailCode.focus();
// //             return;
// //         }
// //         if (!new RegExp('^(\\d{6})$').test(newEmailCode.value)) {
// //             alert('올바른 인증번호를 입력해 주세요.');
// //             newEmailCode.focus();
// //             return;
// //         }
// //         const xhr = new XMLHttpRequest();
// //         const formData = new FormData();
// //         formData.append('email', newEmail.value);
// //         formData.append('code', newEmailCode.value);
// //         formData.append('salt', emailCertifiedLayer.querySelector('[name="newEmailAuthCodeSalt"]').value );
// //         xhr.open('PATCH', '/newEmail');
// //         xhr.onreadystatechange = () => {
// //             if (xhr.readyState === XMLHttpRequest.DONE) {
// //                 if (xhr.status >= 200 && xhr.status < 300) {
// //                     const responseObject = JSON.parse(xhr.responseText);
// //                     switch (responseObject.result) {
// //                         case 'failure':
// //                             alert('인증번호가 올바르지 않습니다. 다시 한번 확인해 주세요.');
// //                             newEmailCode.focus();
// //                             break;
// //                         case 'failure_expired':
// //                             alert('해당 인증번호가 만료되었습니다. 처음부터 다시 시도해 주세요.');
// //                             break;
// //                         case 'success':
// //                             newEmailCode.setAttribute('disabled', 'disabled');
// //                             newEmailCodeVerify.setAttribute('disabled', 'disabled');
// //                             // 이메일 업데이트된 경우
// //                             if (responseObject.email) {
// //                                 console.log("성공");
// //                                 // 서버 응답으로 받은 이메일을 사용하여 화면에 표시
// //                                 newEmail.value = responseObject.email;
// //                             }
// //                             alert('인증이 완료되었습니다.');
// //                             break;
// //                         default:
// //                             alert('서버가 알 수 없는 응답을 반환하였습니다. 잠시 후 다시 시도해 주세요.');
// //                     }
// //                 } else {
// //                     alert('서버와 통신하지 못하였습니다. 잠시 후 다시 시도해 주세요.');
// //                 }
// //             }
// //         };
// //         xhr.send(formData);
// //     };
// // });
//
//
// // // 이메일 변경 이메일 인증번호 보내기
// // emailCertifiedLayer['newEmailSend'].onclick = () => {
// //     if (emailCertifiedLayer['newEmail'].value === '') {
// //         alert("변경하고자 하는 이메일을 입력해주세요.");
// //         emailCertifiedLayer['newEmail'].focus();
// //         return;
// //     }
// //     if (!new RegExp('^(?=.{10,50}$)([\\da-zA-Z\\-_]{5,25})@([\\da-z][\\da-z\\-]*[\\da-z]\\.)?([\\da-z][\\da-z\\-]*[\\da-z])\\.([a-z]{2,15})(\\.[a-z]{2})?$').test(emailCertifiedLayer['newEmail'].value)) {
// //         alert("올바른 이메일을 입력해주세요.")
// //         emailCertifiedLayer['newEmail'].focus();
// //         return;
// //     }
// //     const xhr = new XMLHttpRequest();
// //     xhr.open('GET', `/newEmail?email=${emailCertifiedLayer['newEmail'].value}`);
// //     xhr.onreadystatechange = () => {
// //         if (xhr.readyState === XMLHttpRequest.DONE) {
// //             if (xhr.status >= 200 && xhr.status < 300) {
// //                 const responseObject = JSON.parse(xhr.responseText);
// //                 switch (responseObject.result) {
// //                     case 'failure':
// //                         alert('일단 안됨');
// //                         emailCertifiedLayer['newEmail'].focus();
// //                         break;
// //                     case 'success' :
// //                         alert('입력하신 이메일로 인증번호를 전송하였습니다. \n 5분이내에 인증을 완료해주세요.');
// //                         emailCertifiedLayer['newEmail'].setAttribute('disabled', 'disabled');
// //                         emailCertifiedLayer.querySelector('[name="newEmailSend"]').setAttribute('disabled', 'disabled');
// //                         emailCertifiedLayer.querySelector('[name="newEmailCode"]').removeAttribute('disabled');
// //                         emailCertifiedLayer.querySelector('[name="newEmailCodeVerify"]').removeAttribute('disabled');
// //                         emailCertifiedLayer.querySelector('[name="newEmailCode"]').focus();
// //                         emailCertifiedLayer.querySelector('[name="newEmailAuthCodeSalt"]').value = responseObject.salt;
// //                         break;
// //                     default:
// //                         alert('서버가 알 수 없는 응답을 반환하였습니다.\n 잠시후 다시 시도해주세요.');
// //                 }
// //             } else {
// //                 alert('서버와 통신하지 못하였습니다.\n 잠시 후 다시 시도해주세요.')
// //             }
// //         }
// //     };
// //     xhr.send();
// // }
// // // 이메일 변경 이메일 인증번호 확인
// // emailCertifiedLayer['newEmailCodeVerify'].onclick = () => {
// //     if (emailCertifiedLayer['newEmailCode'].value === '') {
// //         alert('인증번호를 입력해 주세요.');
// //         emailCertifiedLayer['newEmailCode'].focus();
// //         return;
// //     }
// //     if (!new RegExp('^(\\d{6})$').test(emailCertifiedLayer['newEmailCode'].value)) {
// //         alert('올바른 인증번호를 입력해 주세요.');
// //         emailCertifiedLayer['newEmailCode'].focus();
// //         return;
// //     }
// //     const xhr = new XMLHttpRequest();
// //     const formData = new FormData();
// //     formData.append('email', emailCertifiedLayer['newEmail'].value);
// //     formData.append('code', emailCertifiedLayer['newEmailCode'].value);
// //     formData.append('salt', emailCertifiedLayer['newEmailAuthCodeSalt'].value);
// //     xhr.open('PATCH', '/newEmail');
// //     xhr.onreadystatechange = () => {
// //         if (xhr.readyState === XMLHttpRequest.DONE) {
// //             if (xhr.status >= 200 && xhr.status < 300) {
// //                 const responseObject = JSON.parse(xhr.responseText);
// //                 switch (responseObject.result) {
// //                     case 'failure':
// //                         alert('인증번호가 올바르지 않습니다. 다시 한번 확인해 주세요.');
// //                         emailCertifiedLayer['newEmailCode'].focus();
// //                         break;
// //                     case 'failure_expired':
// //                         alert('해당 인증번호가 만료되었습니다. 처음부터 다시 시도해 주세요.');
// //                         break;
// //                     case 'success':
// //                         emailCertifiedLayer['newEmailCode'].setAttribute('disabled', 'disabled');
// //                         emailCertifiedLayer['newEmailCodeVerify'].setAttribute('disabled', 'disabled');
// //                         alert('인증이 완료되었습니다.');
// //                         recoverContainer.warning.style.color = 'forestgreen';
// //                         break;
// //                     default:
// //                         alert('서버가 알 수 없는 응답을 반환하였습니다. 잠시 후 다시 시도해 주세요.');
// //                 }
// //             } else {
// //                 alert('서버와 통신하지 못하였습니다. 잠시 후 다시 시도해 주세요.');
// //             }
// //         }
// //     };
// //     xhr.send(formData);
// // };
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
