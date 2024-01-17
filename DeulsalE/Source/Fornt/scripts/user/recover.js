const recoverContainer = document.getElementById('recoverContainer');
const recoverPage = document.getElementById('recoverPage');

const rememberEmail = document.querySelector('.option-email');
const resetPassword = document.querySelector('.option-password');


const emailContainer = document.getElementById('emailContainer');
const passwordContainer = document.getElementById('passwordContainer');
const emailPhoneCert = emailContainer.querySelector('.phone-certification');
const emailEmailCert = emailContainer.querySelector('.email-certification');
const passwordPhoneCert = passwordContainer.querySelector('.phone-certification');
const passwordEmailCert = passwordContainer.querySelector('.email-certification');

rememberEmail.addEventListener('click', handleOptionEmailClick);
resetPassword.addEventListener('click', handleOptionPasswordClick);

// 아아디 찾기 버튼 클릭
function handleOptionEmailClick() {
    emailContainer.style.display = 'block';
    passwordContainer.style.display = 'none';
    emailPhoneCert.style.display = 'block';
    emailEmailCert.style.display = 'none';
}

// 이메일 재설정 버튼 클릭
function handleOptionPasswordClick() {
    emailContainer.style.display = 'none';
    passwordContainer.style.display = 'block';
    passwordPhoneCert.style.display = 'block';
    passwordEmailCert.style.display = 'none';
}

emailContainer.querySelector('[rel="phone"]').addEventListener('click', () => {
    emailPhoneCert.style.display = 'block';
    emailEmailCert.style.display = 'none';
});
emailContainer.querySelector('[rel="email"]').addEventListener('click', () => {
    emailPhoneCert.style.display = 'none';
    emailEmailCert.style.display = 'block';
});
passwordContainer.querySelector('[rel="phone"]').addEventListener('click', () => {
    passwordPhoneCert.style.display = 'block';
    passwordEmailCert.style.display = 'none';
});
passwordContainer.querySelector('[rel="email"]').addEventListener('click', () => {
    passwordPhoneCert.style.display = 'none';
    passwordEmailCert.style.display = 'block';
});

recoverContainer.warning = recoverContainer.querySelector('[rel="warning"]');

recoverContainer.warning.show = (text) => {
    recoverContainer.warning.innerText = text;
    recoverContainer.warning.classList.add('visible');
}
recoverContainer.warning.hide = () => {
    recoverContainer.warning.innerText = '';
    recoverContainer.warning.classList.remove('visible');
}
recoverPage.remember = recoverPage.querySelector('.remember');
recoverPage.remember.show = (text) => {
    recoverPage.remember.innerText = text;
}

// 아이디 찾기

// 아이디 찾기 휴대폰 번호 확인 및 인증번호 전송
recoverContainer['emailPhoneAuthCodeInputSend'].onclick = () => {
    if (recoverContainer['emailFindPhoneAuthInput'].value === '') {
        recoverContainer.warning.show('이름을 입력해 주세요.');
        recoverContainer['emailFindPhoneAuthInput'].focus();
        return;
    }
    if (recoverContainer['emailFindPhoneInput'].value === '') {
        recoverContainer.warning.show('연락처를 입력해 주세요.');
        recoverContainer['emailFindPhoneInput'].focus();
        return;
    }
    if (!new RegExp('^(010\\d{8})$').test(recoverContainer['emailFindPhoneInput'].value)) {
        recoverContainer.warning.show("'-'를 제외한 8자리 번호를 입력해주세요.");
        recoverContainer['emailFindPhoneInput'].focus();
        return;
    }
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `/user/contactCodeRec/id?name=${recoverContainer['emailFindPhoneAuthInput'].value}&contact=${recoverContainer['emailFindPhoneInput'].value}`);
    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status >= 200 && xhr.status < 300) {
                const responseObject = JSON.parse(xhr.responseText);
                switch (responseObject.result) {
                    case 'failure':
                        recoverContainer.warning.show('일치하는 회원을 찾을 수 없습니다.');
                        recoverContainer['emailFindPhoneInput'].focus();
                        break;
                    case 'failure_users' :
                        recoverContainer.warning.show('해당 이름의 회원을 찾을 수 없습니다.');
                        recoverContainer['emailFindPhoneAuthInput'].focus();
                        break;
                    case 'success':
                        recoverContainer.warning.show('입력하신 연락처로 인증번호를 전송하였습니다. \n5분 이내에 인증을 완료해 주세요.');
                        recoverContainer['emailFindPhoneInput'].setAttribute('disabled', 'disabled');
                        recoverContainer['emailPhoneAuthCodeInputSend'].setAttribute('disabled', 'disabled');
                        recoverContainer['emailPhoneAuthCodeInput'].removeAttribute('disabled');
                        recoverContainer['emailPhoneAuthCodeInputVerify'].removeAttribute('disabled');
                        recoverContainer['emailPhoneAuthCodeInput'].focus();
                        recoverContainer['emailPhoneAuthCodeSalt'].value = responseObject.salt;
                        break;
                    default:
                        recoverContainer.warning.show('서버가 알 수 없는 응답을 반환하였습니다. 잠시 후 다시 시도해 주세요.');
                }
            } else {
                recoverContainer.warning.show('서버와 통신하지 못하였습니다. 잠시 후 다시 시도해 주세요.');
            }
        }
    };
    xhr.send();
};
// 아이디 찾기 휴대폰 인증번호 확인
recoverContainer['emailPhoneAuthCodeInputVerify'].onclick = () => {
    recoverContainer.warning.hide();
    if (recoverContainer['emailPhoneAuthCodeInput'].value === '') {
        recoverContainer.warning.show('인증번호를 입력해 주세요.');
        recoverContainer['emailPhoneAuthCodeInput'].focus();
        return;
    }
    if (!new RegExp('^(\\d{6})$').test(recoverContainer['emailPhoneAuthCodeInput'].value)) {
        recoverContainer.warning.show('올바른 인증번호를 입력해 주세요.');
        recoverContainer['emailPhoneAuthCodeInput'].focus();
        return;
    }
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('contact', recoverContainer['emailFindPhoneInput'].value);
    formData.append('code', recoverContainer['emailPhoneAuthCodeInput'].value);
    formData.append('salt', recoverContainer['emailPhoneAuthCodeSalt'].value);
    xhr.open('PATCH', '/user/contactCodeRec');
    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status >= 200 && xhr.status < 300) {
                const responseObject = JSON.parse(xhr.responseText);
                switch (responseObject.result) {
                    case 'failure':
                        recoverContainer.warning.show('인증번호가 올바르지 않습니다. 다시 한번 확인해 주세요.');
                        recoverContainer['emailPhoneAuthCodeInput'].focus();
                        break;
                    case 'failure_expired':
                        recoverContainer.warning.show('해당 인증번호가 만료되었습니다. 처음부터 다시 시도해 주세요.');
                        break;
                    case 'success':
                        recoverContainer['emailPhoneAuthCodeInput'].setAttribute('disabled', 'disabled');
                        recoverContainer['emailPhoneAuthCodeInputVerify'].setAttribute('disabled', 'disabled');
                        recoverContainer.warning.show('인증이 완료되었습니다.');
                        recoverContainer.warning.style.color = 'forestgreen';
                        break;
                    default:
                        recoverContainer.warning.show('서버가 알 수 없는 응답을 반환하였습니다. 잠시 후 다시 시도해 주세요.');
                }
            } else {
                recoverContainer.warning.show('서버와 통신하지 못하였습니다. 잠시 후 다시 시도해 주세요.');
            }
        }
    };
    xhr.send(formData);
};
// 아이디 찾기 이메일 주소 확인 및 인증번호 전송
recoverContainer['emailEmailAuthCodeInputSend'].onclick = () => {
    if (recoverContainer['emailFindEmailAuthInput'].value === '') {
        recoverContainer.warning.show('이름을 입력해 주세요.');
        recoverContainer['emailFindEmailAuthInput'].focus();
        return;
    }
    if (recoverContainer['emailFindEmailInput'].value === '') {
        recoverContainer.warning.show('이메일을 입력해 주세요.');
        recoverContainer['emailFindEmailInput'].focus();
        return;
    }
    if (!new RegExp('^(?=.{10,50}$)([\\da-zA-Z\\-_]{5,25})@([\\da-z][\\da-z\\-]*[\\da-z]\\.)?([\\da-z][\\da-z\\-]*[\\da-z])\\.([a-z]{2,15})(\\.[a-z]{2})?$').test(recoverContainer['emailFindEmailInput'].value)) {
        recoverContainer.warning.show("올바른 이메일을 입력해주세요.");
        recoverContainer['emailFindEmailInput'].focus();
        return;
    }
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `/user/emailCodeRec/id?name=${recoverContainer['emailFindEmailAuthInput'].value}&email=${recoverContainer['emailFindEmailInput'].value}`);
    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status >= 200 && xhr.status < 300) {
                const responseObject = JSON.parse(xhr.responseText);
                switch (responseObject.result) {
                    case 'failure':
                        recoverContainer.warning.show('일치하는 회원을 찾을 수 없습니다.');
                        recoverContainer['emailFindEmailAuthInput'].focus();
                        break;
                    case 'failure_users' :
                        recoverContainer.warning.show('해당 이름의 회원을 찾을 수 없습니다.');
                        recoverContainer['emailFindEmailAuthInput'].focus();
                        break;
                    case 'success':
                        recoverContainer.warning.show('입력하신 이메일로 인증번호를 전송하였습니다. \n5분 이내에 인증을 완료해 주세요.');
                        recoverContainer['emailFindEmailInput'].setAttribute('disabled', 'disabled');
                        recoverContainer['emailEmailAuthCodeInputSend'].setAttribute('disabled', 'disabled');
                        recoverContainer['emailAuthCodeInput'].removeAttribute('disabled');
                        recoverContainer['emailEmailAuthCodeInputVerify'].removeAttribute('disabled');
                        recoverContainer['emailAuthCodeInput'].focus();
                        recoverContainer['emailEmailAuthCodeSalt'].value = responseObject.salt;
                        break;
                    default:
                        recoverContainer.warning.show('서버가 알 수 없는 응답을 반환하였습니다. 잠시 후 다시 시도해 주세요.');
                }
            } else {
                recoverContainer.warning.show('서버와 통신하지 못하였습니다. 잠시 후 다시 시도해 주세요.');
            }
        }
    };
    xhr.send();
};
// 아이디 찾기 이메일 인증번호 확인
recoverContainer['emailEmailAuthCodeInputVerify'].onclick = () => {
    recoverContainer.warning.hide();
    if (recoverContainer['emailAuthCodeInput'].value === '') {
        recoverContainer.warning.show('인증번호를 입력해 주세요.');
        recoverContainer['emailAuthCodeInput'].focus();
        return;
    }
    if (!new RegExp('^(\\d{6})$').test(recoverContainer['emailAuthCodeInput'].value)) {
        recoverContainer.warning.show('올바른 인증번호를 입력해 주세요.');
        recoverContainer['emailAuthCodeInput'].focus();
        return;
    }
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('email', recoverContainer['emailFindEmailInput'].value);
    formData.append('code', recoverContainer['emailAuthCodeInput'].value);
    formData.append('salt', recoverContainer['emailEmailAuthCodeSalt'].value);
    xhr.open('PATCH', '/user/emailCodeRec');
    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status >= 200 && xhr.status < 300) {
                const responseObject = JSON.parse(xhr.responseText);
                switch (responseObject.result) {
                    case 'failure':
                        recoverContainer.warning.show('인증번호가 올바르지 않습니다. 다시 한번 확인해 주세요.');
                        recoverContainer['emailAuthCodeInput'].focus();
                        break;
                    case 'failure_expired':
                        recoverContainer.warning.show('해당 인증번호가 만료되었습니다. 처음부터 다시 시도해 주세요.');
                        break;
                    case 'success':
                        recoverContainer['emailAuthCodeInput'].setAttribute('disabled', 'disabled');
                        recoverContainer['emailPhoneAuthCodeInputVerify'].setAttribute('disabled', 'disabled');
                        recoverContainer.warning.show('인증이 완료되었습니다.');
                        recoverContainer.warning.style.color = 'forestgreen';
                        break;
                    default:
                        recoverContainer.warning.show('서버가 알 수 없는 응답을 반환하였습니다. 잠시 후 다시 시도해 주세요.');
                }
            } else {
                recoverContainer.warning.show('서버와 통신하지 못하였습니다. 잠시 후 다시 시도해 주세요.');
            }
        }
    };
    xhr.send(formData);
};

// 비밀번호 재설정

// 비밀번호 재설정 휴대폰 번호 확인 및 인증번호 전송
recoverContainer['passwordFindPhoneInputSend'].onclick = () => {
    if (recoverContainer['passwordFindPhoneAuthInput'].value === '') {
        recoverContainer.warning.show('아이디를 입력해 주세요.');
        recoverContainer['passwordFindPhoneAuthInput'].focus();
        return;
    }
    if (recoverContainer['passwordFindPhoneInput'].value === '') {
        recoverContainer.warning.show('연락처를 입력해 주세요.');
        recoverContainer['passwordFindPhoneInput'].focus();
        return;
    }
    if (!new RegExp('^(010\\d{8})$').test(recoverContainer['passwordFindPhoneInput'].value)) {
        recoverContainer.warning.show("'-'를 제외한 8자리 번호를 입력해주세요.");
        recoverContainer['passwordFindPhoneInput'].focus();
        return;
    }
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `/user/contactCodeRec?userId=${recoverContainer['passwordFindPhoneAuthInput'].value}&contact=${recoverContainer['passwordFindPhoneInput'].value}`);
    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status >= 200 && xhr.status < 300) {
                const responseObject = JSON.parse(xhr.responseText);
                switch (responseObject.result) {
                    case 'failure':
                        recoverContainer.warning.show('일치하는 정보가 없습니다. 확인 후 다시 시도해주세요.');
                        recoverContainer['passwordFindPhoneInput'].focus();
                        break;
                    case 'failure_no_users':
                        recoverContainer.warning.show('해당 아이디의 유저를 찾을 수 없습니다.');
                        recoverContainer['passwordFindPhoneAuthInput'].focus();
                        break;
                    case 'success':
                        recoverContainer.warning.show('입력하신 연락처로 인증번호를 전송하였습니다. \n5분 이내에 인증을 완료해 주세요.');
                        recoverContainer['passwordFindPhoneInput'].setAttribute('disabled', 'disabled');
                        recoverContainer['passwordFindPhoneInputSend'].setAttribute('disabled', 'disabled');
                        recoverContainer['passwordPhoneAuthCodeInput'].removeAttribute('disabled');
                        recoverContainer['passwordPhoneAuthCodeInputVerify'].removeAttribute('disabled');
                        recoverContainer['passwordPhoneAuthCodeInput'].focus();
                        recoverContainer['passwordPhoneAuthCodeSalt'].value = responseObject.salt;
                        break;
                    default:
                        recoverContainer.warning.show('서버가 알 수 없는 응답을 반환하였습니다. 잠시 후 다시 시도해 주세요.');
                }
            } else {
                recoverContainer.warning.show('서버와 통신하지 못하였습니다. 잠시 후 다시 시도해 주세요.');
            }
        }
    };
    xhr.send();
};
// 비밀번호 재설정 휴대폰 인증번호 확인
recoverContainer['passwordPhoneAuthCodeInputVerify'].onclick = () => {
    recoverContainer.warning.hide();
    if (recoverContainer['passwordPhoneAuthCodeInput'].value === '') {
        recoverContainer.warning.show('인증번호를 입력해 주세요.');
        recoverContainer['passwordPhoneAuthCodeInput'].focus();
        return;
    }
    if (!new RegExp('^(\\d{6})$').test(recoverContainer['passwordPhoneAuthCodeInput'].value)) {
        recoverContainer.warning.show('올바른 인증번호를 입력해 주세요.');
        recoverContainer['passwordPhoneAuthCodeInput'].focus();
        return;
    }
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('contact', recoverContainer['passwordFindPhoneInput'].value);
    formData.append('code', recoverContainer['passwordPhoneAuthCodeInput'].value);
    formData.append('salt', recoverContainer['passwordPhoneAuthCodeSalt'].value);
    xhr.open('PATCH', '/user/contactCodeRec');
    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status >= 200 && xhr.status < 300) {
                const responseObject = JSON.parse(xhr.responseText);
                switch (responseObject.result) {
                    case 'failure':
                        recoverContainer.warning.show('인증번호가 올바르지 않습니다. 다시 한번 확인해 주세요.');
                        recoverContainer['passwordPhoneAuthCodeInput'].focus();
                        break;
                    case 'failure_expired':
                        recoverContainer.warning.show('해당 인증번호가 만료되었습니다. 처음부터 다시 시도해 주세요.');
                        break;
                    case 'success':
                        recoverContainer['passwordPhoneAuthCodeInput'].setAttribute('disabled', 'disabled');
                        recoverContainer['passwordPhoneAuthCodeInputVerify'].setAttribute('disabled', 'disabled');
                        recoverContainer.warning.show('인증이 완료되었습니다.');
                        recoverContainer.warning.style.color = 'forestgreen';
                        break;
                    default:
                        recoverContainer.warning.show('서버가 알 수 없는 응답을 반환하였습니다. 잠시 후 다시 시도해 주세요.');
                }
            } else {
                recoverContainer.warning.show('서버와 통신하지 못하였습니다. 잠시 후 다시 시도해 주세요.');
            }
        }
    };
    xhr.send(formData);
};
// 비밀번호 재설정 이메일 주소 확인 및 인증번호 전송
recoverContainer['passwordFindEmailInputSend'].onclick = () => {
    if (recoverContainer['passwordFindEmailAuthInput'].value === '') {
        recoverContainer.warning.show('아이디를 입력해 주세요.');
        recoverContainer['passwordFindEmailAuthInput'].focus();
        return;
    }
    if (recoverContainer['passwordFindEmailInput'].value === '') {
        recoverContainer.warning.show('이메일을 입력해 주세요.');
        recoverContainer['passwordFindEmailInput'].focus();
        return;
    }
    if (!new RegExp('^(?=.{10,50}$)([\\da-zA-Z\\-_]{5,25})@([\\da-z][\\da-z\\-]*[\\da-z]\\.)?([\\da-z][\\da-z\\-]*[\\da-z])\\.([a-z]{2,15})(\\.[a-z]{2})?$').test(recoverContainer['passwordFindEmailInput'].value)) {
        recoverContainer.warning.show("올바른 이메일을 입력해주세요.");
        recoverContainer['passwordFindEmailInput'].focus();
        return;
    }
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `/user/emailCodeRec?userId=${recoverContainer['passwordFindEmailAuthInput'].value}&email=${recoverContainer['passwordFindEmailInput'].value}`);
    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status >= 200 && xhr.status < 300) {
                const responseObject = JSON.parse(xhr.responseText);
                switch (responseObject.result) {
                    case 'failure':
                        recoverContainer.warning.show('일치하는 정보가 없습니다. 확인 후 다시 시도해주세요.');
                        recoverContainer['passwordFindEmailAuthInput'].focus();
                        break;
                    case 'failure_no_users':
                        recoverContainer.warning.show('해당 아이디의 유저를 찾을 수 없습니다.');
                        recoverContainer['passwordFindEmailAuthInput'].focus();
                        break;
                    case 'success':
                        recoverContainer.warning.show('입력하신 이메일로 인증번호를 전송하였습니다. \n5분 이내에 인증을 완료해 주세요.');
                        recoverContainer['passwordFindEmailInput'].setAttribute('disabled', 'disabled');
                        recoverContainer['passwordFindEmailInputSend'].setAttribute('disabled', 'disabled');
                        recoverContainer['passwordEmailAuthCodeInput'].removeAttribute('disabled');
                        recoverContainer['passwordEmailAuthCodeInputVerify'].removeAttribute('disabled');
                        recoverContainer['passwordEmailAuthCodeInput'].focus();
                        recoverContainer['passwordEmailAuthCodeSalt'].value = responseObject.salt;
                        break;
                    default:
                        recoverContainer.warning.show('서버가 알 수 없는 응답을 반환하였습니다. 잠시 후 다시 시도해 주세요.');
                }
            } else {
                recoverContainer.warning.show('서버와 통신하지 못하였습니다. 잠시 후 다시 시도해 주세요.');
            }
        }
    };
    xhr.send();
};
// 비밀번호 재설정 이메일 인증번호 확인
recoverContainer['passwordEmailAuthCodeInputVerify'].onclick = () => {
    recoverContainer.warning.hide();
    if (recoverContainer['passwordEmailAuthCodeInput'].value === '') {
        recoverContainer.warning.show('인증번호를 입력해 주세요.');
        recoverContainer['passwordEmailAuthCodeInput'].focus();
        return;
    }
    if (!new RegExp('^(\\d{6})$').test(recoverContainer['passwordEmailAuthCodeInput'].value)) {
        recoverContainer.warning.show('올바른 인증번호를 입력해 주세요.');
        recoverContainer['passwordEmailAuthCodeInput'].focus();
        return;
    }
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('email', recoverContainer['passwordFindEmailInput'].value);
    formData.append('code', recoverContainer['passwordEmailAuthCodeInput'].value);
    formData.append('salt', recoverContainer['passwordEmailAuthCodeSalt'].value);
    xhr.open('PATCH', '/user/emailCodeRec');
    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status >= 200 && xhr.status < 300) {
                const responseObject = JSON.parse(xhr.responseText);
                switch (responseObject.result) {
                    case 'failure':
                        recoverContainer.warning.show('인증번호가 올바르지 않습니다. 다시 한번 확인해 주세요.');
                        recoverContainer['passwordEmailAuthCodeInput'].focus();
                        break;
                    case 'failure_expired':
                        recoverContainer.warning.show('해당 인증번호가 만료되었습니다. 처음부터 다시 시도해 주세요.');
                        break;
                    case 'success':
                        recoverContainer['passwordEmailAuthCodeInput'].setAttribute('disabled', 'disabled');
                        recoverContainer['passwordEmailAuthCodeInputVerify'].setAttribute('disabled', 'disabled');
                        recoverContainer.warning.show('인증이 완료되었습니다.');
                        recoverContainer.warning.style.color = 'forestgreen';
                        break;
                    default:
                        recoverContainer.warning.show('서버가 알 수 없는 응답을 반환하였습니다. 잠시 후 다시 시도해 주세요.');
                }
            } else {
                recoverContainer.warning.show('서버와 통신하지 못하였습니다. 잠시 후 다시 시도해 주세요.');
            }
        }
    };
    xhr.send(formData);
};

const emailPhone = emailContainer.querySelector('[rel="phone"]');
const emailEmail = emailContainer.querySelector('[rel="email"]');
const phonePhone = passwordContainer.querySelector('[rel="phone"]');
const phoneEmail = passwordContainer.querySelector('[rel="email"]')

emailPhone.onclick = () => {
    recoverContainer.warning.hide();
};
emailEmail.onclick = () => {
    recoverContainer.warning.hide();
};
phonePhone.onclick = () => {
    recoverContainer.warning.hide();
};
phoneEmail.onclick = () => {
    recoverContainer.warning.hide();
};
rememberEmail.onclick = () => {
    recoverContainer.warning.hide();
};
resetPassword.onclick = () => {
    recoverContainer.warning.hide();
};

recoverContainer.onsubmit = e => {
    e.preventDefault();
    // 아이디찾기
    if (rememberEmail.checked) {
        // 휴대폰인증
        if (emailPhone.checked) {
            if (recoverContainer['emailFindPhoneAuthInput'].value === '') {
                recoverContainer.warning.show('이름을 입력해 주세요.');
                recoverContainer['emailFindPhoneAuthInput'].focus();
                return;
            }
            if (recoverContainer['emailFindPhoneInput'].value === '') {
                recoverContainer.warning.show('연락처를 입력해 주세요.');
                recoverContainer['emailFindPhoneInput'].focus();
                return;
            }
            if (recoverContainer['emailPhoneAuthCodeInputVerify'].disabled && recoverContainer['emailPhoneAuthCodeInput'].value === '') {
                recoverContainer.warning.show('인증을 완료해주세요.');
                recoverContainer['emailPhoneAuthCodeInputVerify'].focus();
                return;
            }
            const xhr = new XMLHttpRequest();
            const formData = new FormData();
            formData.append('contact', recoverContainer['emailFindPhoneInput'].value);
            formData.append('code', recoverContainer['emailPhoneAuthCodeInput'].value);
            formData.append('salt', recoverContainer['emailPhoneAuthCodeSalt'].value);
            xhr.open('PATCH', '/user/contactCodeRec');
            xhr.onreadystatechange = () => {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        const responseObject = JSON.parse(xhr.responseText);
                        switch (responseObject.result) {
                            case 'failure':
                                recoverContainer.warning.show('인증번호가 올바르지 않습니다. \n다시 한번 확인해 주세요.');
                                recoverContainer['emailPhoneAuthCodeInput'].focus();
                                break;
                            case 'failure_expired':
                                recoverContainer.warning.show('해당 인증번호가 만료되었습니다. \n처음부터 다시 시도해 주세요.');
                                break;
                            case 'success':
                                recoverContainer['emailPhoneAuthCodeInput'].setAttribute('disabled', 'disabled');
                                recoverContainer['emailPhoneAuthCodeInputVerify'].setAttribute('disabled', 'disabled');
                                recoverContainer.warning.show('인증이 완료되었습니다.');
                                recoverContainer.warning.style.color = 'forestgreen';
                                break;
                            default:
                                recoverContainer.warning.show('서버가 알 수 없는 응답을 반환하였습니다. 잠시 후 다시 시도해 주세요.');
                        }
                    } else {
                        recoverContainer.warning.show('서버와 통신하지 못하였습니다. 잠시 후 다시 시도해 주세요.');
                    }
                }
            };
            xhr.send(formData);
            if (recoverContainer['emailPhoneAuthCodeInputVerify'].disabled && recoverContainer['emailPhoneAuthCodeInputSend'].disabled) {
                const xhr = new XMLHttpRequest();
                xhr.open("GET", `/user/selectPhoneCertId?name=${recoverContainer['emailFindPhoneAuthInput'].value}&contact=${recoverContainer['emailFindPhoneInput'].value}`);
                xhr.onreadystatechange = () => {
                    if (xhr.readyState === XMLHttpRequest.DONE) {
                        if (xhr.status >= 200 && xhr.status < 300) {
                            const responseObject = JSON.parse(xhr.responseText);
                            switch (responseObject.result) {
                                case 'failure':
                                    recoverPage.remember.show('입력하신 정보와 일치하는 정보가 없습니다.')
                                    break;
                                case 'success':
                                    recoverPage.remember.show(`회원님의 아이디는 '${responseObject.userId}'입니다. \n로그인 후 이용해주시기 바랍니다.`)
                                    break;
                                default:
                                    recoverPage.remember.show('서버가 알 수 없는 응답을 반환하였습니다. 잠시 후 다시 시도해 주세요.');
                            }
                        } else {
                            recoverPage.remember.show('서버와 통신하지 못하였습니다. 잠시 후 다시 시도해 주세요.');
                        }
                    }
                };
                xhr.send();

                recoverContainer.classList.add('visible');
                document.getElementById('recoverPage').classList.remove('visible');
                document.getElementById('passwordDiv').classList.add('visible');
            }

        }
        // 이메일인증
        if (emailEmail.checked) {
            if (recoverContainer['emailFindEmailAuthInput'].value === '') {
                recoverContainer.warning.show('이름을 입력해 주세요.');
                recoverContainer['emailFindEmailAuthInput'].focus();
                return;
            }
            if (recoverContainer['emailFindEmailInput'].value === '') {
                recoverContainer.warning.show('이메일을 입력해 주세요.');
                recoverContainer['emailFindEmailInput'].focus();
                return;
            }
            if (recoverContainer['emailEmailAuthCodeInputVerify'].disabled && recoverContainer['emailAuthCodeInput'].value === '') {
                recoverContainer.warning.show('인증을 완료해주세요.');
                recoverContainer['emailAuthCodeInput'].focus();
                return;
            }
            const xhr = new XMLHttpRequest();
            const formData = new FormData();
            formData.append('email', recoverContainer['emailFindEmailInput'].value);
            formData.append('code', recoverContainer['emailAuthCodeInput'].value);
            formData.append('salt', recoverContainer['emailEmailAuthCodeSalt'].value);
            xhr.open('PATCH', '/user/emailCodeRec');
            xhr.onreadystatechange = () => {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        const responseObject = JSON.parse(xhr.responseText);
                        switch (responseObject.result) {
                            case 'failure':
                                recoverContainer.warning.show('인증번호가 올바르지 않습니다. \n다시 한번 확인해 주세요.');
                                recoverContainer['emailAuthCodeInput'].focus();
                                break;
                            case 'failure_expired':
                                recoverContainer.warning.show('해당 인증번호가 만료되었습니다. \n처음부터 다시 시도해 주세요.');
                                break;
                            case 'success':
                                recoverContainer['emailAuthCodeInput'].setAttribute('disabled', 'disabled');
                                recoverContainer['emailEmailAuthCodeInputVerify'].setAttribute('disabled', 'disabled');
                                recoverContainer.warning.show('인증이 완료되었습니다.');
                                recoverContainer.warning.style.color = 'forestgreen';
                                break;
                            default:
                                recoverContainer.warning.show('서버가 알 수 없는 응답을 반환하였습니다. 잠시 후 다시 시도해 주세요.');
                        }
                    } else {
                        recoverContainer.warning.show('서버와 통신하지 못하였습니다. 잠시 후 다시 시도해 주세요.');
                    }
                }
            };
            xhr.send(formData);
            if (recoverContainer['emailEmailAuthCodeInputSend'].disabled && recoverContainer['emailEmailAuthCodeInputVerify'].disabled) {
                const xhr = new XMLHttpRequest();
                xhr.open("GET", `/user/selectEmailCertId?name=${recoverContainer['emailFindEmailAuthInput'].value}&email=${recoverContainer['emailFindEmailInput'].value}`);
                xhr.onreadystatechange = () => {
                    if (xhr.readyState === XMLHttpRequest.DONE) {
                        if (xhr.status >= 200 && xhr.status < 300) {
                            const responseObject = JSON.parse(xhr.responseText);
                            switch (responseObject.result) {
                                case 'failure':
                                    recoverPage.remember.show('입력하신 정보와 일치하는 정보가 없습니다.')
                                    break;
                                case 'success':
                                    recoverPage.remember.show(`회원님의 아이디는 '${responseObject.userId}'입니다. \n로그인 후 이용해주시기 바랍니다.`)
                                    break;
                                default:
                                    recoverPage.remember.show('서버가 알 수 없는 응답을 반환하였습니다. 잠시 후 다시 시도해 주세요.');
                            }
                        } else {
                            recoverPage.remember.show('서버와 통신하지 못하였습니다. 잠시 후 다시 시도해 주세요.');
                        }
                    }
                };
                xhr.send();
                recoverContainer.classList.add('visible');
                document.getElementById('recoverPage').classList.remove('visible');
                document.getElementById('passwordDiv').classList.add('visible');
            }
        }
    }
    // 비밀번호 재설정
    if (resetPassword.checked) {
        // 휴대폰 인증
        if (phonePhone.checked) {
            if (recoverContainer['passwordFindPhoneAuthInput'].value === '') {
                recoverContainer.warning.show('아이디를 입력해 주세요.');
                recoverContainer['passwordFindPhoneAuthInput'].focus();
                return;
            }
            if (recoverContainer['passwordFindPhoneInput'].value === '') {
                recoverContainer.warning.show('연락처를 입력해 주세요.');
                recoverContainer['passwordFindPhoneInput'].focus();
                return;
            }
            if (recoverContainer['passwordPhoneAuthCodeInputVerify'].disabled && recoverContainer['passwordPhoneAuthCodeInput'].value === '') {
                recoverContainer.warning.show('인증을 완료해주세요.');
                recoverContainer['passwordPhoneAuthCodeInputVerify'].focus();
                return;
            }
            const xhr = new XMLHttpRequest();
            const formData = new FormData();
            formData.append('contact', recoverContainer['passwordFindPhoneInput'].value);
            formData.append('code', recoverContainer['passwordPhoneAuthCodeInput'].value);
            formData.append('salt', recoverContainer['passwordPhoneAuthCodeSalt'].value);
            xhr.open('PATCH', '/user/contactCodeRec');
            xhr.onreadystatechange = () => {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        const responseObject = JSON.parse(xhr.responseText);
                        switch (responseObject.result) {
                            case 'failure':
                                recoverContainer.warning.show('인증번호가 올바르지 않습니다. \n다시 한번 확인해 주세요.');
                                recoverContainer['passwordPhoneAuthCodeInput'].focus();
                                break;
                            case 'failure_expired':
                                recoverContainer.warning.show('해당 인증번호가 만료되었습니다. \n처음부터 다시 시도해 주세요.');
                                break;
                            case 'success':
                                recoverContainer['passwordPhoneAuthCodeInput'].setAttribute('disabled', 'disabled');
                                recoverContainer['passwordPhoneAuthCodeInputVerify'].setAttribute('disabled', 'disabled');
                                recoverContainer.warning.show('인증이 완료되었습니다.');
                                recoverContainer.warning.style.color = 'forestgreen';
                                break;
                            default:
                                recoverContainer.warning.show('서버가 알 수 없는 응답을 반환하였습니다. 잠시 후 다시 시도해 주세요.');
                        }
                    } else {
                        recoverContainer.warning.show('서버와 통신하지 못하였습니다. 잠시 후 다시 시도해 주세요.');
                    }
                }
            };
            xhr.send(formData);
            if (recoverContainer['passwordPhoneAuthCodeInputVerify'].disabled && recoverContainer['passwordFindPhoneInputSend'].disabled) {
                recoverContainer.classList.add('visible');
                document.getElementById('recoverPage').classList.remove('visible');
                document.getElementById('emailDiv').classList.add('visible');
            }
        }
        // 이메일 인증
        if (phoneEmail.checked) {
            if (recoverContainer['passwordFindEmailAuthInput'].value === '') {
                recoverContainer.warning.show('아이디를 입력해 주세요.');
                recoverContainer['passwordFindEmailAuthInput'].focus();
                return;
            }
            if (recoverContainer['passwordFindEmailInput'].value === '') {
                recoverContainer.warning.show('이메일을 입력해 주세요.');
                recoverContainer['passwordFindEmailInput'].focus();
                return;
            }
            if (recoverContainer['passwordEmailAuthCodeInputVerify'].disabled && recoverContainer['passwordEmailAuthCodeInput'].value === '') {
                recoverContainer.warning.show('인증을 완료해주세요.');
                recoverContainer['passwordEmailAuthCodeInputVerify'].focus();
                return;
            }
            const xhr = new XMLHttpRequest();
            const formData = new FormData();
            formData.append('email', recoverContainer['passwordFindEmailInput'].value);
            formData.append('code', recoverContainer['passwordEmailAuthCodeInput'].value);
            formData.append('salt', recoverContainer['passwordEmailAuthCodeSalt'].value);
            xhr.open('PATCH', '/user/emailCodeRec');
            xhr.onreadystatechange = () => {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        const responseObject = JSON.parse(xhr.responseText);
                        switch (responseObject.result) {
                            case 'failure':
                                recoverContainer.warning.show('인증번호가 올바르지 않습니다. \n다시 한번 확인해 주세요.');
                                recoverContainer['passwordEmailAuthCodeInput'].focus();
                                break;
                            case 'failure_expired':
                                recoverContainer.warning.show('해당 인증번호가 만료되었습니다. \n처음부터 다시 시도해 주세요.');
                                break;
                            case 'success':
                                recoverContainer['passwordEmailAuthCodeInput'].setAttribute('disabled', 'disabled');
                                recoverContainer['passwordEmailAuthCodeInputVerify'].setAttribute('disabled', 'disabled');
                                recoverContainer.warning.show('인증이 완료되었습니다.');
                                recoverContainer.warning.style.color = 'forestgreen';
                                break;
                            default:
                                recoverContainer.warning.show('서버가 알 수 없는 응답을 반환하였습니다. 잠시 후 다시 시도해 주세요.');
                        }
                    } else {
                        recoverContainer.warning.show('서버와 통신하지 못하였습니다. 잠시 후 다시 시도해 주세요.');
                    }
                }
            };
            xhr.send(formData);
            if (recoverContainer['passwordEmailAuthCodeInputVerify'].disabled && recoverContainer['passwordFindEmailInputSend'].disabled) {
                recoverContainer.classList.add('visible');
                document.getElementById('recoverPage').classList.remove('visible');
                document.getElementById('emailDiv').classList.add('visible');
            }
        }
    }
}

const resetPage = document.getElementById('recoverPage');
resetPage.resetWarning = resetPage.querySelector('[rel="resetWarning"]');
resetPage.resetWarning.show = (text) => {
    resetPage.resetWarning.innerText = text;
    resetPage.resetWarning.classList.add('visible');
}
resetPage.resetWarning.hide = () => {
    resetPage.resetWarning.innerText = '';
    resetPage.resetWarning.classList.remove('visible');
}

const resetNextBtn = resetPage.querySelector('.resetNextButton');

resetNextBtn.onclick = e => {
    e.preventDefault();
    if (resetPage['resetPassword'].value === '') {
        resetPage.resetWarning.show('비밀번호를 입력해 주세요.');
        resetPage['resetPassword'].focus();
        return;
    }
    if (resetPage['resetPasswordCheck'].value === '') {
        resetPage.resetWarning.show('비밀번호를 한번 더 입력해 주세요.')
        resetPage['resetPasswordCheck'].focus();
        resetPage['resetPasswordCheck'].select();
        return;
    }
    if (resetPage['resetPassword'].value !== resetPage['resetPasswordCheck'].value) {
        resetPage.resetWarning.show('비밀번호가 서로 일치하지 않습니다. 다시 한번 더 확인해 주세요.');
        resetPage['resetPassword'].focus();
        resetPage['resetPassword'].select();
        return;
    }
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('userId', recoverContainer['passwordFindPhoneAuthInput'].value);
    formData.append('Password', resetPage['resetPassword'].value);
    xhr.open('PATCH', '/user/resetPassword');
    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status >= 200 && xhr.status < 300) {
                const responseObject = JSON.parse(xhr.responseText);
                console.log(responseObject.result);
                switch (responseObject.result) {
                    case 'failure':
                        resetPage.resetWarning.show('올바르지 않은 접근입니다.');
                        break;
                    case 'failure_no_users':
                        resetPage.resetWarning.show('해당 유저가 존재하지 않습니다.');
                        break;
                    case 'success':
                        recoverPage.querySelector('.step-1').classList.add('visible');
                        recoverPage.querySelector('.step-2').classList.remove('visible');
                        break;
                    default:
                        resetPage.resetWarning.show('서버가 알 수 없는 응답을 반환하였습니다. 잠시 후 다시 시도해 주세요.');
                }
            } else {
                resetPage.resetWarning.show('서버와 통신하지 못하였습니다. 잠시 후 다시 시도해 주세요.');
            }
        }
    };
    xhr.send(formData);
};


