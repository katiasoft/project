const myInfoList = document.getElementById('myInfoList');
myInfoList.nameModify = myInfoList.querySelector('[rel="nameModify"]');
myInfoList.nicknameModify = myInfoList.querySelector('[rel="nicknameModify"]');
myInfoList.passwordModify = myInfoList.querySelector('[rel="passwordModify"]');
myInfoList.emailModify = myInfoList.querySelector('[rel="emailModify"]');
myInfoList.phoneModify = myInfoList.querySelector('[rel="phoneModify"]');

const blurCover = document.getElementById('blurCover');
const dialogCover = document.getElementById('dialogCover');
const dialogLayer = document.getElementById('dialogLayer');
const emailCertifiedLayer = document.getElementById('emailCertifiedLayer');
const contactCertifiedLayer = document.getElementById('contactCertifiedLayer');

passwordForm = document.getElementById('passwordForm');
contactForm = document.getElementById('contactForm');
nameForm = document.getElementById('nameForm');
emailForm = document.getElementById('emailForm');


blurCover.show = () => {
    blurCover.classList.add('visible');
};
blurCover.hide = () => {
    blurCover.classList.remove('visible');
};
dialogCover.show = () => {
    dialogCover.classList.add('visible');
};
dialogCover.hide = () => {
    dialogCover.classList.remove('visible');
};

dialogLayer.show = (title, content) => {
    dialogLayer.classList.add('visible');
    dialogLayer.querySelector('[rel = title]').innerHTML = title;
    dialogLayer.querySelector('[rel = content]').innerHTML = content;
};
dialogLayer.hide = () => {
    dialogLayer.classList.remove('visible');
    dialogLayer.querySelector('[rel = title]').value = '';
    dialogLayer.querySelector('[rel = content]').value = '';
};
dialogLayer.querySelector('[rel = confirm]').onclick = e => {
    e.preventDefault();
    dialogCover.hide();
    dialogLayer.hide();
    location.reload();
}

emailCertifiedLayer.show = () => {
    emailCertifiedLayer.classList.add('visible');
};
emailCertifiedLayer.hide = () => {
    emailCertifiedLayer.classList.remove('visible');
    emailForm.classList.remove('visible');
    contactForm.classList.remove('visible');
    passwordForm.classList.remove('visible');

};

contactCertifiedLayer.show = (mode) => {
    contactForm.classList.remove('visible');
    passwordForm.classList.remove('visible');
    nameForm.classList.remove('visible')

    if (mode === 'password') {
        contactForm.classList.add('visible');
        nameForm.classList.add('visible')
    } else if (mode === 'contact') {
        passwordForm.classList.add('visible');
        nameForm.classList.add('visible')
    } else {
        contactForm.classList.add('visible');
        passwordForm.classList.add('visible');
    }
    contactCertifiedLayer.classList.add('visible');
};
contactCertifiedLayer.hide = () => {
    contactCertifiedLayer.classList.remove('visible');
};

emailCertifiedLayer.cancel = emailCertifiedLayer.querySelector('[rel="cancel"]');
contactCertifiedLayer.contactCancel = contactCertifiedLayer.querySelector('[rel="contactCancel"]');
contactCertifiedLayer.passwordCancel = contactCertifiedLayer.querySelector('[rel="passwordCancel"]');
contactCertifiedLayer.nameCancel = contactCertifiedLayer.querySelector('[rel="nameCancel"]');

emailCertifiedLayer.close = emailCertifiedLayer.querySelector('[rel="close"]');
contactCertifiedLayer.contactClose = contactCertifiedLayer.querySelector('[rel="contactClose"]');
contactCertifiedLayer.passwordClose = contactCertifiedLayer.querySelector('[rel="passwordClose"]');
contactCertifiedLayer.nameClose = contactCertifiedLayer.querySelector('[rel="nameClose"]');

emailCertifiedLayer.cancel.addEventListener('click', () => {
    dialogCover.hide();
    emailCertifiedLayer.hide();
    emailForm['email'].value = '';
    emailForm['salt'].value = '';
    emailForm['code'].value = '';
});

contactCertifiedLayer.contactCancel.addEventListener('click', () => {
    dialogCover.hide();
    contactCertifiedLayer.hide();
    contactForm['contact'][0].value = '';
    contactForm['contact'][1].value = '';
    contactForm['salt'].value = '';
    contactForm['code'].value = '';
});

contactCertifiedLayer.passwordCancel.addEventListener('click', () => {
    dialogCover.hide();
    contactCertifiedLayer.hide();
    passwordForm['password'].value = '';
    passwordForm['passwordCheck'].value = '';
    passwordForm['contact'][0].value = '';
    passwordForm['contact'][1].value = '';
    passwordForm['salt'].value = '';
    passwordForm['code'].value = '';
});

contactCertifiedLayer.nameCancel.addEventListener('click', () => {
    dialogCover.hide();
    contactCertifiedLayer.hide();
    nameForm['newName'].value = '';
    nameForm['contact'][0].value = '';
    nameForm['contact'][1].value = '';
    nameForm['salt'].value = '';
    nameForm['code'].value = '';
});

emailCertifiedLayer.close.addEventListener('click', () => {
    dialogCover.hide();
    emailCertifiedLayer.hide();
});

contactCertifiedLayer.contactClose.addEventListener('click', () => {
    dialogCover.hide();
    contactCertifiedLayer.hide();
});
contactCertifiedLayer.passwordClose.addEventListener('click', () => {
    dialogCover.hide();
    contactCertifiedLayer.hide();
});
contactCertifiedLayer.nameClose.addEventListener('click', () => {
    dialogCover.hide();
    contactCertifiedLayer.hide();
});

myInfoList.nameModify.addEventListener('click', () => {
    dialogCover.show();
    contactCertifiedLayer.show('name');
});

myInfoList.passwordModify.addEventListener('click', () => {
    dialogCover.show();
    contactCertifiedLayer.show('password');
});

myInfoList.phoneModify.addEventListener('click', () => {
    dialogCover.show();
    contactCertifiedLayer.show('contact');
});

myInfoList.emailModify.addEventListener('click', () => {
    dialogCover.show();
    emailCertifiedLayer.show();
});

const nameModify = myInfoList.querySelector('.name');
nameModify.querySelector('._object-input').addEventListener('click', function () {
    dialogCover.show();
    contactCertifiedLayer.show('name');
});

nameForm.querySelector('.codeSendBtn').addEventListener('click', function () {
    nameForm.querySelector('.warning').classList.remove('visible');
    if (nameForm['newName'].value === '' || !new RegExp('^[가-힣]{2,10}$').test(nameForm['newName'].value)) {
        nameForm.querySelector('.warning').value = '이름 형식을 확인해주세요.';
        nameForm.querySelector('.warning').classList.add('visible');
        nameForm['newName'].focus();
        nameForm['newName'].select();

        return;
    }

    if (nameForm['contact'][0].value === '' || !new RegExp('^[0-9]{4}$').test(nameForm['contact'][0].value)) {
        nameForm.querySelector('.warning').value = '전화번호 형식을 확인해주세요.';
        nameForm.querySelector('.warning').classList.add('visible');
        nameForm['contact'][0].focus();
        nameForm['contact'][0].select();
        return;
    }
    if (nameForm['contact'][1].value === '' || !new RegExp('^[0-9]{4}$').test(nameForm['contact'][1].value)) {
        nameForm.querySelector('.warning').value = '전화번호 형식을 확인해주세요.';
        nameForm.querySelector('.warning').classList.add('visible');
        nameForm['contact'][1].focus();
        nameForm['contact'][1].select();
        return;
    }

    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('contact', '010'+nameForm['contact'][0].value + nameForm['contact'][1].value);
    xhr.open('POST', '/mobile/sendContactCodeByUserId');
    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status >= 200 && xhr.status < 300) {
                const responseObject = JSON.parse(xhr.responseText);

                switch (responseObject.result) {
                    case 'true':
                        nameForm['newName'].setAttribute('disabled', 'disabled');
                        nameForm['contact'][0].setAttribute('disabled', 'disabled');
                        nameForm['contact'][1].setAttribute('disabled', 'disabled');
                        nameForm.querySelector('.codeSendBtn').setAttribute('disabled', 'disabled');

                        nameForm['salt'].value = responseObject.salt;
                        nameForm['code'].removeAttribute('disabled');
                        nameForm.querySelector('.verifyBtn').removeAttribute('disabled');

                        nameForm.querySelector('.warning').value = '인증번호가 전송되었습니다.';
                        nameForm.querySelector('.warning').classList.add('visible');

                        break;
                    case 'false':
                        nameForm.querySelector('.warning').value = '인증번호 전송에 실패하였습니다.';
                        nameForm.querySelector('.warning').classList.add('visible');
                        nameForm['contact'][0].focus();
                        nameForm['contact'][0].select();
                        break;
                    default:
                        nameForm.querySelector('.warning').value = '서버 오류, 잠시후 다시 시도해주세요.';
                        nameForm.querySelector('.warning').classList.add('visible');

                }

            } else {
                nameForm.querySelector('.warning').value = '서버 오류, 잠시후 다시 시도해주세요.';
                nameForm.querySelector('.warning').classList.add('visible');
            }
        }
    }
    xhr.send(formData);
});
nameForm.querySelector('.verifyBtn').addEventListener('click', function () {
    if (nameForm['salt'].value === '' || nameForm['code'].value === '') {
        nameForm.querySelector('.warning').value = '인증번호를 확인해주세요.';
        nameForm.querySelector('.warning').classList.add('visible');
        nameForm['code'].focus();
        nameForm['code'].select();
        return;
    }

    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('contact', '010'+nameForm['contact'][0].value + nameForm['contact'][1].value);
    formData.append('code', nameForm['code'].value);
    formData.append('salt', nameForm['salt'].value);
    xhr.open('POST', '/mobile/verifyContact');
    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status >= 200 && xhr.status < 300) {
                const responseObject = JSON.parse(xhr.responseText);

                switch (responseObject.result) {
                    case 'success':
                        nameForm['code'].setAttribute('disabled', 'disabled');
                        nameForm.querySelector('.verifyBtn').setAttribute('disabled', 'disabled');
                        nameForm.querySelector('.confirm').removeAttribute('disabled');
                        nameForm.querySelector('.warning').value = '인증이 완료되었습니다.';
                        nameForm.querySelector('.warning').classList.add('visible');
                        break;
                    case 'failure':
                        nameForm.querySelector('.warning').value = '인증을 실패하였습니다.';
                        nameForm.querySelector('.warning').classList.add('visible');

                        nameForm['code'].focus();
                        nameForm['code'].select();

                        break;
                    case 'failure_expired':
                        nameForm.querySelector('.warning').value = '인증번호가 만료되었습니다.';
                        nameForm.querySelector('.warning').classList.add('visible');
                        break;
                    default:
                        nameForm.querySelector('.warning').value = '서버 오류, 잠시 후 다시 시도해주세요.';
                        nameForm.querySelector('.warning').classList.add('visible');
                }

            } else {
                nameForm['warning'].value = '서버오류, 잠시 후 다시 시도해주세요.';
                nameForm['warning'].classList.add('visible');
            }
        }
    }
    xhr.send(formData);
});

nameForm.onsubmit = e => {
    e.preventDefault();

    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('contact', '010'+nameForm['contact'][0].value + nameForm['contact'][1].value);
    formData.append('name', nameForm['newName'].value);
    xhr.open('POST', '/mobile/name');
    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            contactCertifiedLayer.hide('name');
            if (xhr.status >= 200 && xhr.status < 300) {
                const responseObject = JSON.parse(xhr.responseText);

                switch (responseObject.result) {
                    case 'success':

                        dialogCover.show();
                        dialogLayer.show('이름 변경 완료', '이름이 성공적으로 변경되었습니다.');
                        break;
                    case 'failure':
                        dialogCover.show();
                        dialogLayer.show('이름 변경 실패', '이름 변경에 실패하였습니다.');
                        break;
                    default:
                        dialogCover.show();
                        dialogLayer.show('서버 오류', '서버가 알 수 없는 응답을 반환하였습니다.<br><br>잠시후 다시 시도해주세요.');
                        break;
                }

            } else {
                dialogCover.show();
                dialogLayer.show('서버 오류', '서버가 알 수 없는 응답을 반환하였습니다.<br><br> 잠시후 다시 시도해주세요.');
            }
        }
    }
    xhr.send(formData);
}



const nickNameModify = myInfoList.querySelector('.nickname');
nickNameModify.querySelector('._object-button').addEventListener('click', function (){
    if (nickNameModify.querySelector('._object-input').value === '' || !new RegExp('^([가-힣a-zA-Z0-9_-]{2,20})$').test(nickNameModify.querySelector('._object-input').value)){
        dialogCover.show();
        dialogLayer.show('형식 오류', '별명 형식을 확인해주세요.');
        return;
    }

    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('preNickname', nickNameModify.querySelector('._object-input').placeholder);
    formData.append('nickname', nickNameModify.querySelector('._object-input').value);
    xhr.open('POST', '/mobile/nickname');
    xhr.onreadystatechange = () => {
        if(xhr.readyState === XMLHttpRequest.DONE) {
            if(xhr.status >= 200 && xhr.status < 300){
                const responseObject = JSON.parse(xhr.responseText);

                switch (responseObject.result){
                    case 'success':
                        dialogCover.show();
                        dialogLayer.show('별명 변경 완료', '별명이 성공적으로 변경되었습니다.');
                        break;
                    case 'failure':
                        dialogCover.show();
                        dialogLayer.show('별명 중복', '중복된 별명입니다.<br><br>다른 별명을 입력해주세요.');
                        break;
                    case 'failure_not_found_user':
                        dialogCover.show();
                        dialogLayer.show('잘못된 접근', '해당 사용자가 없습니다.<br><br>다시 시도해주세요.');
                        break;
                    default:
                        dialogCover.show();
                        dialogLayer.show('서버 오류', '서버가 알 수 없는 응답을 반환하였습니다.<br><br>잠시후 다시 시도해주세요.');
                }

            } else {
                dialogCover.show();
                dialogLayer.show('서버 오류', '서버가 알 수 없는 응답을 반환하였습니다.<br><br>잠시후 다시 시도해주세요.');
            }
        }
    }
    xhr.send(formData);


});

const contactModify = myInfoList.querySelector('.phone');
contactModify.querySelectorAll('._object-input').forEach(element => {
    element.addEventListener('click', function () {
        dialogCover.show();
        contactCertifiedLayer.show('contact');
    });
});
contactForm.querySelector('.codeSendBtn').addEventListener('click', function () {

    if (contactForm['contact'][0].value === '' || !new RegExp('^[0-9]{4}$').test(contactForm['contact'][0].value)) {
        contactForm.querySelector('.warning').value = '전화번호 형식을 확인해주세요.';
        contactForm.querySelector('.warning').classList.add('visible');
        contactForm['contact'][0].focus();
        contactForm['contact'][0].select();
        return;
    }
    if (contactForm['contact'][1].value === '' || !new RegExp('^[0-9]{4}$').test(contactForm['contact'][1].value)) {
        contactForm.querySelector('.warning').value = '전화번호 형식을 확인해주세요.';
        contactForm.querySelector('.warning').classList.add('visible');
        contactForm['contact'][1].focus();
        contactForm['contact'][1].select();
        return;
    }

    blurCover.show();

    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('contact', '010'+contactForm['contact'][0].value + contactForm['contact'][1].value);

    xhr.open('POST', '/mobile/sendContactCode');
    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            blurCover.hide();
            if (xhr.status >= 200 && xhr.status < 300) {
                const responseObject = JSON.parse(xhr.responseText);

                switch (responseObject.result) {
                    case 'true':
                        contactForm['contact'][0].setAttribute('disabled', 'disabled');
                        contactForm['contact'][1].setAttribute('disabled', 'disabled');
                        contactForm.querySelector('.codeSendBtn').setAttribute('disabled', 'disabled');

                        contactForm['salt'].value = responseObject.salt;
                        contactForm['code'].removeAttribute('disabled');
                        contactForm.querySelector('.verifyBtn').removeAttribute('disabled');

                        contactForm.querySelector('.warning').value = '인증번호가 전송되었습니다.';
                        contactForm.querySelector('.warning').classList.add('visible');
                        contactForm['code'].focus();
                        contactForm['code'].select();

                        break;
                    case 'false':
                        contactForm.querySelector('.warning').value = '인증번호 전송이 실패하였습니다.';
                        contactForm.querySelector('.warning').classList.add('visible');
                        contactForm['contact'][0].focus();
                        contactForm['contact'][0].select();
                        break;

                    default:
                        contactForm.querySelector('.warning').value = '서버 오류, 잠시후 다시 시도해주세요.';
                        contactForm.querySelector('.warning').classList.add('visible');
                        contactForm['contact'][0].focus();
                        contactForm['contact'][0].select();
                }
            } else {
                contactForm.querySelector('.warning').value = '서버 오류, 잠시후 다시 시도해주세요.';
                contactForm.querySelector('.warning').classList.add('visible');
                contactForm['contact'][0].focus();
                contactForm['contact'][0].select();
            }
        }
    }
    xhr.send(formData);
});
contactForm.querySelector('.verifyBtn').addEventListener('click', function () {
    if (contactForm['salt'].value === '' || contactForm['code'].value === '') {
        contactForm.querySelector('.warning').value = '인증번호를 확인해주세요.';
        contactForm.querySelector('.warning').classList.add('visible');
        contactForm['code'].focus();
        contactForm['code'].select();
        return;
    }

    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('contact', '010'+contactForm['contact'][0].value + contactForm['contact'][1].value);
    formData.append('code', contactForm['code'].value);
    formData.append('salt', contactForm['salt'].value);
    xhr.open('POST', '/mobile/verifyContact');
    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status >= 200 && xhr.status < 300) {
                const responseObject = JSON.parse(xhr.responseText);

                switch (responseObject.result) {
                    case 'success':
                        contactForm['code'].setAttribute('disabled', 'disabled');
                        contactForm.querySelector('.verifyBtn').setAttribute('disabled', 'disabled');
                        contactForm.querySelector('.confirm').removeAttribute('disabled');

                        contactForm.querySelector('.warning').value = '인증이 완료되었습니다.';
                        contactForm.querySelector('.warning').classList.add('visible');

                        break;
                    case 'failure':
                        contactForm['warning'].value = '인증 실패하였습니다.';
                        contactForm['warning'].classList.add('visible');
                        contactForm['code'].focus();
                        contactForm['code'].select();
                        break;
                    case 'failure_expired':

                        contactForm['contact'][0].removeAttribute('disabled');
                        contactForm['contact'][1].removeAttribute('disabled');
                        contactForm.querySelector('.codeSendBtn').removeAttribute('disabled');
                        contactForm['contact'][0].focus();
                        contactForm['contact'][0].select();

                        contactForm['salt'].value = '';
                        contactForm['code'].value = '';
                        contactForm['code'].setAttribute('disabled', 'disabled');
                        contactForm.querySelector('.verifyBtn').setAttribute('disabled', 'disabled');

                        contactForm.querySelector('.warning').value = '인증번호가 만료되었습니다.';
                        contactForm.querySelector('.warning').classList.add('visible');
                        break;
                    default:

                        contactForm['contact'][0].removeAttribute('disabled');
                        contactForm['contact'][1].removeAttribute('disabled');
                        contactForm.querySelector('.codeSendBtn').removeAttribute('disabled');
                        contactForm['contact'][0].focus();
                        contactForm['contact'][0].select();

                        contactForm['salt'].value = '';
                        contactForm['code'].value = '';
                        contactForm['code'].setAttribute('disabled', 'disabled');
                        contactForm.querySelector('.verifyBtn').setAttribute('disabled', 'disabled');

                        contactForm.querySelector('.warning').value = '서버 오류, 잠시후 다시 시도해주세요.';
                        contactForm.querySelector('.warning').classList.add('visible');

                }

            } else {
                contactForm.querySelector('.warning').value = '서버 오류, 잠시후 다시 시도해주세요.';
                contactForm.querySelector('.warning').classList.add('visible');
            }
        }
    }
    xhr.send(formData);
});
contactForm.onsubmit = e => {
    e.preventDefault();
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('contact', '010'+contactForm['contact'][0].value + contactForm['contact'][1].value);
    formData.append('preContact', '010'+contactModify.querySelectorAll('._object-input')[1].placeholder + contactModify.querySelectorAll('._object-input')[2].placeholder);

    xhr.open('POST', '/mobile/contact');
    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            contactCertifiedLayer.hide('contact');
            if (xhr.status >= 200 && xhr.status < 300) {
                const responseObject = JSON.parse(xhr.responseText);

                switch (responseObject.result) {
                    case 'success':
                        dialogCover.show();
                        dialogLayer.show('전화번호 변경 완료', '전화번호를 성공적으로 변경하였습니다.');
                        break;
                    case 'failure':
                        dialogCover.show();
                        dialogLayer.show('전화번호 변경 실패', '전화번호 변경에 실패하였습니다.');
                        break;
                    default:
                        dialogCover.show();
                        dialogLayer.show('서버 오류', '서버가 알 수 없는 응답을 반환하였습니다.<br><br>잠시후 다시 시도해주세요.');

                }

            } else {
                dialogCover.show();
                dialogLayer.show('서버 오류', '서버가 알 수 없는 응답을 반환하였습니다.<br><br>잠시후 다시 시도해주세요.');
            }
        }
    }
    xhr.send(formData);
}

const emailModify = myInfoList.querySelector('.email');
emailModify.querySelectorAll('._object-input').forEach(element => {
    element.addEventListener('click', function () {
        dialogCover.show();
        emailCertifiedLayer.show();
    });
});
emailForm.querySelector('.codeSendBtn').addEventListener('click', function () {
    if (emailForm['email'].value === '' || !new RegExp('^(?=.{10,50}$)([\\da-zA-Z\\-_]{5,25})@([\\da-z][\\da-z\\-]*[\\da-z]\\.)?([\\da-z][\\da-z\\-]*[\\da-z])\\.([a-z]{2,15})(\\.[a-z]{2})?$').test(emailForm['email'].value)) {
        emailForm.querySelector('.warning').value = '이메일 형식을 확인해주세요.';
        emailForm.querySelector('.warning').classList.add('visible');
        return;
    }

    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('email', emailForm['email'].value);

    xhr.open('POST', '/mobile/sendEmailCode');
    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status >= 200 && xhr.status < 300) {
                const responseObject = JSON.parse(xhr.responseText);

                switch (responseObject.result) {
                    case 'true':

                        emailForm.querySelector('.warning').value = '인증번호가 전송되었습니다.';
                        emailForm.querySelector('.warning').classList.add('visible');

                        emailForm['email'].setAttribute('disabled', 'disabled');
                        emailForm.querySelector('.codeSendBtn').setAttribute('disabled', 'disabled');

                        emailForm['salt'].value = responseObject.salt;
                        emailForm['code'].removeAttribute('disabled');
                        emailForm.querySelector('.verifyBtn').removeAttribute('disabled');


                        break;
                    case 'false':

                        emailForm.querySelector('.warning').value = '인증번호 전송이 실패하였습니다.';
                        emailForm.querySelector('.warning').classList.add('visible');
                        break;
                    default:
                        emailForm.querySelector('.warning').value = '서버 오류, 잠시 후 다시 시도해주세요.';
                        emailForm.querySelector('.warning').classList.add('visible');
                }

            } else {
                emailForm.querySelector('.warning').value = '서버 오류, 잠시 후 다시 시도해주세요.';
                emailForm.querySelector('.warning').classList.add('visible');
            }
        }
    }
    xhr.send(formData);
});
emailForm.querySelector('.verifyBtn').addEventListener('click', function () {
    if (emailForm['salt'].value === '' || emailForm['code'].value === '') {
        emailForm.querySelector('.warning').value = '인증번호를 확인해주세요.';
        emailForm.querySelector('.warning').classList.add('visible');
        return;
    }

    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('email', emailForm['email'].value);
    formData.append('code', emailForm['code'].value);
    formData.append('salt', emailForm['salt'].value);
    xhr.open('POST', '/mobile/verifyEmail');
    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status >= 200 && xhr.status < 300) {
                const responseObject = JSON.parse(xhr.responseText);

                switch (responseObject.result) {
                    case 'success':
                        emailForm.querySelector('.warning').value = '인증이 완료되었습니다.';
                        emailForm.querySelector('.warning').classList.add('visible');

                        emailForm['code'].setAttribute('disabled', 'disabled');
                        emailForm.querySelector('.verifyBtn').setAttribute('disabled', 'disabled');
                        emailForm.querySelector('.confirm').removeAttribute('disabled');

                        break;
                    case 'failure':

                        emailForm.querySelector('.warning').value = '인증 실패하였습니다.';
                        emailForm.querySelector('.warning').classList.add('visible');

                        emailForm['code'].focus();
                        emailForm['code'].select();

                        break;
                    case 'failure_expired':

                        emailForm.querySelector('.warning').value = '인증번호가 만료되었습니다.';
                        emailForm.querySelector('.warning').classList.add('visible');

                        emailForm['code'].value = '';
                        emailForm['salt'].value = '';

                        emailForm['email'].removeAttribute('disabled');
                        emailForm.querySelector('.codeSendBtn').removeAttribute('disabled');

                        emailForm['code'].setAttribute('disabled', 'disabled');
                        emailForm.querySelector('.verifyBtn').setAttribute('disabled', 'disabled');

                        break;
                    default:
                        emailForm.querySelector('.warning').value = '서버 오류, 잠시후 다시 시도해주세요.';
                        emailForm.querySelector('.warning').classList.add('visible');
                }

            } else {
                emailForm.querySelector('.warning').value = '서버 오류, 잠시후 다시 시도해주세요.';
                emailForm.querySelector('.warning').classList.add('visible');
            }
        }
    }
    xhr.send(formData);
});
emailForm.onsubmit = e => {
    e.preventDefault();
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('email', emailForm['email'].value);
    formData.append('preEmail', emailModify.querySelectorAll('._object-input')[0].value + '@' + emailModify.querySelectorAll('._object-input')[1].value);

    xhr.open('POST', '/mobile/email');
    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            emailCertifiedLayer.hide();
            if (xhr.status >= 200 && xhr.status < 300) {
                const responseObject = JSON.parse(xhr.responseText);

                switch (responseObject.result) {
                    case 'success':
                        dialogCover.show();
                        dialogLayer.show('이메일 변경 완료', '이메일을 성공적으로 변경하였습니다.');
                        break;
                    case 'failure':
                        dialogCover.show();
                        dialogLayer.show('이메일 변경 실패', '이메일 변경에 실패하였습니다.');
                        break;
                    default:
                        dialogCover.show();
                        dialogLayer.show('서버 오류', '서버가 알 수 없는 응답을 반환하였습니다.<br><br>잠시후 다시 시도해주세요.');
                        break;

                }

            } else {
                dialogCover.show();
                dialogLayer.show('서버 오류', '서버가 알 수 없는 응답을 반환하였습니다.<br><br>잠시후 다시 시도해주세요.');
            }
        }
    }
    xhr.send(formData);
};




const passwordModify = myInfoList.querySelector('.password');
passwordModify.querySelectorAll('._object-input').forEach(element => {
    element.addEventListener('click', function () {
        dialogCover.show();
        contactCertifiedLayer.show('password');

    });
});
passwordForm.querySelector('.codeSendBtn').addEventListener('click', function () {

    if (passwordForm['password'].value === '' || !new RegExp('^([\\da-zA-Z`~!@#$%^&*()\\-_=+\\[{\\]};:\'",<.>/?]{8,50})$').test(passwordForm['password'].value)) {
        passwordForm.querySelector('.warning').value = '비밀번호는 8 ~ 50자 입니다.';
        passwordForm.querySelector('.warning').classList.add('visible');
        passwordForm['password'].focus();
        passwordForm['password'].select();
        return;
    }

    if (passwordForm['passwordCheck'].value === '') {
        passwordForm.querySelector('.warning').value = '비밀번호 확인을 입력해주세요.';
        passwordForm.querySelector('.warning').classList.add('visible');
        passwordForm['passwordCheck'].focus();
        passwordForm['passwordCheck'].select();
        return;
    }
    if (passwordForm['password'].value !== passwordForm['passwordCheck'].value) {
        passwordForm.querySelector('.warning').value = '비밀번호가 일치하지 않습니다.';
        passwordForm.querySelector('.warning').classList.add('visible');
        passwordForm['passwordCheck'].focus();
        passwordForm['passwordCheck'].select();
        return;
    }
    if (passwordForm['contact'][0].value === '' || !new RegExp('^[0-9]{4}$').test(passwordForm['contact'][0].value)) {
        passwordForm.querySelector('.warning').value = '전화번호 형식을 확인해주세요.';
        passwordForm.querySelector('.warning').classList.add('visible');
        passwordForm['contact'][0].focus();
        passwordForm['contact'][0].select();
        return;
    }
    if (passwordForm['contact'][1].value === ''  || !new RegExp('^[0-9]{4}$').test(passwordForm['contact'][0].value)) {
        passwordForm.querySelector('.warning').value = '전화번호 형식을 확인해주세요.';
        passwordForm.querySelector('.warning').classList.add('visible');
        passwordForm['contact'][1].focus();
        passwordForm['contact'][1].select();
        return;
    }

    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('contact', `010${passwordForm['contact'][0].value+passwordForm['contact'][1].value}`);

    xhr.open('POST', '/mobile/sendContactCodeByUserId');
    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status >= 200 && xhr.status < 300) {
                const responseObject = JSON.parse(xhr.responseText);

                switch (responseObject.result) {
                    case 'true':
                        passwordForm['password'].setAttribute('disabled', 'disabled');
                        passwordForm['passwordCheck'].setAttribute('disabled', 'disabled');
                        passwordForm['contact'][0].setAttribute('disabled', 'disabled');
                        passwordForm['contact'][1].setAttribute('disabled', 'disabled');
                        passwordForm.querySelector('.codeSendBtn').setAttribute('disabled', 'disabled');

                        passwordForm['salt'].value = responseObject.salt;
                        passwordForm['code'].removeAttribute('disabled');
                        passwordForm.querySelector('.verifyBtn').removeAttribute('disabled');

                        passwordForm.querySelector('.warning').value = '인증번호가 전송되었습니다.';
                        passwordForm.querySelector('.warning').classList.add('visible');
                        passwordForm['code'].focus();
                        passwordForm['code'].select();

                        break;
                    case 'false':

                        passwordForm.querySelector('.warning').value = '인증번호 전송에 실패했습니다.';
                        passwordForm.querySelector('.warning').classList.add('visible');
                        passwordForm['contact'][0].focus();
                        passwordForm['contact'][0].select();

                        break;
                    default:
                        passwordForm.querySelector('.warning').value = '서버 오류, 잠시후 다시 시도해주세요.';
                        passwordForm.querySelector('.warning').classList.add('visible');
                        passwordForm['contact'][0].focus();
                        passwordForm['contact'][0].select();

                }

            } else {
                passwordForm.querySelector('.warning').value = '서버 오류, 잠시후 다시 시도해주세요.';
                passwordForm.querySelector('.warning').classList.add('visible');
                passwordForm['contact'][0].focus();
                passwordForm['contact'][0].select();
            }
        }
    }
    xhr.send(formData);
});
passwordForm.querySelector('.verifyBtn').addEventListener('click', function () {
    if (passwordForm['salt'].value === '' || passwordForm['code'].value === '') {
        passwordForm.querySelector('.warning').value = '인증번호를 확인해주세요.';
        passwordForm.querySelector('.warning').classList.add('visible');
        passwordForm['code'].focus();
        passwordForm['code'].select();
        return;
    }

    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('contact', `010${passwordForm['contact'][0].value+passwordForm['contact'][1].value}`);
    formData.append('code', passwordForm['code'].value);
    formData.append('salt', passwordForm['salt'].value);
    xhr.open('POST', '/mobile/verifyContact');
    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status >= 200 && xhr.status < 300) {
                const responseObject = JSON.parse(xhr.responseText);

                switch (responseObject.result) {
                    case 'success':
                        passwordForm['code'].setAttribute('disabled', 'disabled');
                        passwordForm.querySelector('.verifyBtn').setAttribute('disabled', 'disabled');
                        passwordForm.querySelector('.confirm').removeAttribute('disabled');

                        passwordForm.querySelector('.warning').value = '인증이 완료되었습니다.';
                        passwordForm.querySelector('.warning').classList.add('visible');

                        break;
                    case 'failure':
                        passwordForm.querySelector('.warning').value = '인증이 실패하였습니다.';
                        passwordForm.querySelector('.warning').classList.add('visible');
                        passwordForm['code'].focus();
                        passwordForm['code'].select();
                        break;
                    case 'failure_expired':
                        passwordForm.querySelector('.warning').value = '인증번호 만료시간이 지났습니다.';
                        passwordForm.querySelector('.warning').classList.add('visible');
                        passwordForm['code'].value = '';
                        passwordForm['salt'].value = '';

                        passwordForm['password'].removeAttribute('disabled');
                        passwordForm['passwordCheck'].removeAttribute('disabled');
                        passwordForm['contact'][0].removeAttribute('disabled');
                        passwordForm['contact'][1].removeAttribute('disabled');
                        passwordForm.querySelector('.codeSendBtn').removeAttribute('disabled');

                        passwordForm['code'].setAttribute('disabled', 'disabled');
                        passwordForm.querySelector('.verifyBtn').setAttribute('disabled', 'disabled');


                        passwordForm['contact'][0].focus();
                        passwordForm['contact'][0].select();


                        break;
                    default:
                        passwordForm.querySelector('.warning').value = '서버 오류, 잠시후 다시 시도해주세요.';
                        passwordForm.querySelector('.warning').classList.add('visible');

                }

            } else {
                passwordForm.querySelector('.warning').value = '서버 오류, 잠시후 다시 시도해주세요.';
                passwordForm.querySelector('.warning').classList.add('visible');

            }
        }
    }
    xhr.send(formData);
});
passwordForm.onsubmit = e => {
    {
        e.preventDefault();
        const xhr = new XMLHttpRequest();
        const formData = new FormData();
        formData.append('password', passwordForm['password'].value);

        xhr.open('POST', '/mobile/password');
        xhr.onreadystatechange = () => {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                contactCertifiedLayer.hide('password');
                if (xhr.status >= 200 && xhr.status < 300) {
                    const responseObject = JSON.parse(xhr.responseText);

                    switch (responseObject.result) {
                        case 'success':
                            dialogCover.show();
                            dialogLayer.show('비밀번호 변경 성공', '비밀번호를 성공적으로 변경하였습니다.');
                            break;
                        case 'failure':
                            dialogCover.show();
                            dialogLayer.show('비밀번호 변경 실패', '비밀번호 변경에 실패하였습니다.');
                            break;
                        default:
                            dialogCover.show();
                            dialogLayer.show('서버 오류', '서버가 알 수 없는 응답을 반환하였습니다.<br><br>잠시후 다시 시도해주세요.');
                            break;

                    }

                } else {
                    dialogCover.show();
                    dialogLayer.show('서버 오류', '서버가 알 수 없는 응답을 반환하였습니다.<br><br>잠시후 다시 시도해주세요.');
                }
            }
        }
        xhr.send(formData);
    }
}