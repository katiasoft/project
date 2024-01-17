const registerForm = document.getElementById('registerForm');

const checkboxes = document.querySelectorAll('input[type="checkbox"]');
const agreeAllCheckbox = document.querySelector('.allAgreeBtn input');

// "전체 동의하기" 체크박스를 클릭했을 때 실행되는 함수.
function toggleCheckboxes() {
    const isChecked = this.checked;

    // 나머지 체크박스들을 선택 또는 해제합니다.
    checkboxes.forEach(function (checkbox) {
        checkbox.checked = isChecked;

        const noneBtn = checkbox.parentNode.querySelector('.noneBtn');
        const agreeBtn = checkbox.parentNode.querySelector('.agreeBtn');

        if (isChecked) {
            noneBtn.style.display = 'none';
            agreeBtn.style.display = 'inline';
        } else {
            noneBtn.style.display = 'inline';
            agreeBtn.style.display = 'none';
        }
    });
}

// "전체 동의하기" 체크박스에 클릭 이벤트를 추가.
if (agreeAllCheckbox) {
    agreeAllCheckbox.addEventListener('click', toggleCheckboxes);
}

// 각 체크박스 요소에 대해 이벤트 핸들러를 등록.
checkboxes.forEach(function (checkbox) {
    checkbox.addEventListener('change', function () {
        const noneBtn = this.parentNode.querySelector('.noneBtn');
        const agreeBtn = this.parentNode.querySelector('.agreeBtn');

        if (this.checked) {
            noneBtn.style.display = 'none';
            agreeBtn.style.display = 'inline';
        } else {
            noneBtn.style.display = 'inline';
            agreeBtn.style.display = 'none';
        }

        // 선택사항 체크박스의 체크 여부를 확인하고 "전체 동의하기" 체크박스를 업데이트합니다.
        const optionalCheckbox = document.querySelector('[data-optional-checkbox]');
        if (optionalCheckbox) {
            const isOptionalChecked = optionalCheckbox.checked;

            if (!isOptionalChecked) {
                agreeAllCheckbox.checked = false;
            } else {
                let isAllChecked = true;
                checkboxes.forEach(function (checkbox) {
                    if (!checkbox.checked) {
                        isAllChecked = false;
                    }
                });

                agreeAllCheckbox.checked = isAllChecked;
            }
        }
    });
});

const cancelButton = document.getElementsByName('cancel')[0];

registerForm.termWarning = registerForm.querySelector('.term-warning');
registerForm.warningContainer = registerForm.querySelectorAll('.warning-container');

registerForm.termWarning.show = (text) => {
    registerForm.termWarning.innerText = text;
    registerForm.termWarning.classList.add('visible');
    registerForm.warningContainer[0].classList.add('invalid');
};
registerForm.termWarning.hide = () => {
    registerForm.termWarning.classList.remove('visible');
    registerForm.warningContainer[0].classList.remove('invalid');
}

registerForm.idWarning = registerForm.querySelector('[rel="idWarning"]');
registerForm.idWarning.show = (text) => {
    registerForm.idWarning.innerText = text;
    registerForm.idWarning.classList.add('visible');
    registerForm.warningContainer[1].classList.add('invalid');
};
registerForm.idWarning.hide = () => {
    registerForm.idWarning.innerText = '';
    registerForm.idWarning.classList.remove('visible');
    registerForm.warningContainer[1].classList.remove('invalid');
}

registerForm.passwordWarning = registerForm.querySelector('[rel="passwordWarning"]');
registerForm.passwordWarning.show = (text) => {
    registerForm.passwordWarning.innerText = text;
    registerForm.passwordWarning.classList.add('visible');
    registerForm.warningContainer[2].classList.add('invalid');
};
registerForm.passwordWarning.hide = () => {
    registerForm.passwordWarning.innerText = '';
    registerForm.passwordWarning.classList.remove('visible');
    registerForm.warningContainer[2].classList.remove('invalid');
}

registerForm.emailWarning = registerForm.querySelector('[rel="emailWarning"]');
registerForm.emailWarning.show = (text) => {
    registerForm.emailWarning.innerText = text;
    registerForm.emailWarning.classList.add('visible');
    registerForm.warningContainer[3].classList.add('invalid');
};
registerForm.emailWarning.hide = () => {
    registerForm.emailWarning.innerText = '';
    registerForm.emailWarning.classList.remove('visible');
    registerForm.warningContainer[3].classList.remove('invalid');
}

registerForm.nameWarning = registerForm.querySelector('[rel="nameWarning"]');
registerForm.nameWarning.show = (text) => {
    registerForm.nameWarning.innerText = text;
    registerForm.nameWarning.classList.add('visible');
    registerForm.warningContainer[4].classList.add('invalid');
};
registerForm.nameWarning.hide = () => {
    registerForm.nameWarning.innerText = '';
    registerForm.nameWarning.classList.remove('visible');
    registerForm.warningContainer[4].classList.remove('invalid');
}

registerForm.nicknameWarning = registerForm.querySelector('[rel="nicknameWarning"]');
registerForm.nicknameWarning.show = (text) => {
    registerForm.nicknameWarning.innerText = text;
    registerForm.nicknameWarning.classList.add('visible');
    registerForm.warningContainer[5].classList.add('invalid');
};
registerForm.nicknameWarning.hide = () => {
    registerForm.nicknameWarning.innerText = '';
    registerForm.nicknameWarning.classList.remove('visible');
    registerForm.warningContainer[5].classList.remove('invalid');
}

registerForm.birthWarning = registerForm.querySelector('[rel="birthWarning"]');
registerForm.birthWarning.show = (text) => {
    registerForm.birthWarning.innerText = text;
    registerForm.birthWarning.classList.add('visible');
    registerForm.warningContainer[6].classList.add('invalid');
};
registerForm.birthWarning.hide = () => {
    registerForm.birthWarning.innerText = '';
    registerForm.birthWarning.classList.remove('visible');
    registerForm.warningContainer[6].classList.remove('invalid');
}

registerForm.contactWarning = registerForm.querySelector('[rel="contactWarning"]');
registerForm.contactWarning.show = (text) => {
    registerForm.contactWarning.innerText = text;
    registerForm.contactWarning.classList.add('visible');
    registerForm.warningContainer[7].classList.add('invalid');
};
registerForm.contactWarning.hide = () => {
    registerForm.contactWarning.innerText = '';
    registerForm.contactWarning.classList.remove('visible');
    registerForm.warningContainer[7].classList.remove('invalid');
}

registerForm.show = () => {
    registerForm['agreeServiceTerm'].checked = false;
    registerForm['agreePrivacyTerm'].checked = false;
    registerForm.termWarning.hide();

    registerForm['email'].value = '';
    registerForm.emailWarning.hide();

    registerForm['password'].value = '';
    registerForm['passwordCheck'].value = '';
    registerForm.passwordWarning.hide();

    registerForm['nickname'].value = '';
    registerForm.nicknameWarning.hide();

    registerForm['contact'].value = '';
    registerForm['contact'].removeAttribute('disabled');
    registerForm['contactSend'].removeAttribute('disabled');
    registerForm['contactCode'].value = '';
    registerForm['contactCode'].setAttribute('disabled', 'disabled');
    registerForm['contactVerify'].setAttribute('disabled', 'disabled');
    registerForm['contactSalt'].value = '';

    registerForm.classList.remove('step-1', 'step-2', 'step-3');
    registerForm.classList.add('step-1', 'visible');
};


registerForm.onsubmit = e => {
    e.preventDefault();
    registerForm.termWarning.hide();
    if (registerForm.querySelector('.step-1').classList.contains('visible')) {
        if (!registerForm['agreeServiceTerm'].checked) {
            registerForm.termWarning.show('서비스 이용약관을 읽고 동의해 주세요.');
            return false;
        }
        if (!registerForm['agreePrivacyTerm'].checked) {
            registerForm.termWarning.show('개인정보 처리방침을 읽고 동의해 주세요.');
            return false;
        }
        registerForm.querySelector('.step-1').classList.remove('visible');
        registerForm.querySelector('.step-2').classList.add('visible');
        // registerForm['userId'].focus();
    }
    if (registerForm.querySelector('.step-2').classList.contains('visible')) {
        // 입력값 유효성 검사
        if (registerForm['userId'].value === '') {
            registerForm.idWarning.show('아이디를 입력해 주세요.');
            registerForm['userId'].focus();
            return;
        }
        else {
            registerForm.idWarning.hide('');
        }
        if (registerForm['password'].value === '') {
            registerForm.passwordWarning.show('비밀번호를 입력해 주세요.');
            registerForm['password'].focus();
            return;
        }
        if (!new RegExp('^([\\da-zA-Z`~!@#$%^&*()\\-_=+\\[{\\]};:\'",<.>/?]{8,50})$').test(registerForm['password'].value)) {
            registerForm.passwordWarning.show('올바른 비밀번호를 입력해 주세요.');
            registerForm['password'].focus();
            registerForm['password'].select();
            return;
        }
        if (registerForm['passwordCheck'] === '') {
            registerForm.passwordWarning.show('비밀번호를 다시 한번 더 입력해 주세요.');
            registerForm['passwordCheck'].focus();
            return;
        }
        if (registerForm['password'].value !== registerForm['passwordCheck'].value) {
            registerForm.passwordWarning.show('비밀번호가 서로 일치하지 않습니다. 다시 한번 더 확인해 주세요.');
            registerForm['passwordCheck'].focus();
            registerForm['passwordCheck'].select();
            return;
        }
        if (registerForm['password'].value === registerForm['passwordCheck'].value) {
            registerForm.passwordWarning.show('비밀번호가 서로 일치합니다.');
            registerForm.passwordWarning.style.color = 'forestgreen';
        }
        if (registerForm['email'].value === '') {
            registerForm.emailWarning.show('이메일을 입력해 주세요.');
            registerForm['email'].focus();
            return;
        }
        if (!new RegExp('^(?=.{10,50}$)([\\da-zA-Z\\-_]{5,25})@([\\da-z][\\da-z\\-]*[\\da-z]\\.)?([\\da-z][\\da-z\\-]*[\\da-z])\\.([a-z]{2,15})(\\.[a-z]{2})?$').test(registerForm['email'].value)) {
            registerForm.emailWarning.show('올바른 이메일을 입력해 주세요.');
            registerForm['email'].focus();
            registerForm['email'].select();
            return;
        }
        else {
            registerForm.emailWarning.hide('');
        }
        if (registerForm['name'] === '') {
            registerForm.nameWarning.show('이름을 입력해 주세요.');
            registerForm['name'].focus();
            return;
        }
        else {
            registerForm.nameWarning.hide('');
        }
        if (registerForm['nickname'].value === '') {
            registerForm.nicknameWarning.show('별명을 입력해 주세요.');
            registerForm['nickname'].focus();
            return;
        }
        if (!new RegExp('^([가-힣a-zA-Z0-9_-]{2,20})$').test(registerForm['nickname'].value)) {
            registerForm.nicknameWarning.show('별명은 2~20자의 한글, 영문, 숫자, 특수문자(-, _)만 사용할 수 있습니다.');
            registerForm['nickname'].focus();
            registerForm['nickname'].select();
            return;
        }
        else {
            registerForm.nicknameWarning.hide('');
        }
        if (registerForm['contactCode'].value === '') {
            registerForm.contactWarning.show('연락처 인증을 완료해 주세요.');
            return;
        }
        const xhr = new XMLHttpRequest();
        const formData = new FormData();
        formData.append('authority', registerForm['authority'].value);
        formData.append('userId', registerForm['userId'].value);
        formData.append('password', registerForm['password'].value);
        formData.append('email', registerForm['email'].value);
        formData.append('name', registerForm['name'].value);
        formData.append('nickname', registerForm['nickname'].value);
        formData.append('birth', registerForm['birth'].value);
        formData.append('contact', registerForm['contact'].value);
        formData.append('code', registerForm['contactCode'].value);
        formData.append('salt', registerForm['contactSalt'].value);
        xhr.open('POST', '/user/register');
        xhr.onreadystatechange = () => {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    const responseObject = JSON.parse(xhr.responseText);
                    console.log(responseObject.result);
                    switch (responseObject.result) {
                        case 'failure':
                            registerForm.contactWarning.show('알 수 없는 이유로 가입하지 못하였습니다. 잠시 후 다시 시도해 주세요.');
                            break;
                        case 'failure_duplicate_id':
                            registerForm.idWarning.show('해당 아이디는 이미 사용 중입니다.');
                            registerForm['userId'].focus();
                            registerForm['userId'].select();
                            break;
                        case 'failure_duplicate_email':
                            registerForm.emailWarning.show('해당 이메일은 이미 사용 중입니다.');
                            registerForm['email'].focus();
                            registerForm['email'].select();
                            break;
                        case 'failure_duplicate_nickname':
                            registerForm.nicknameWarning.show('해당 별명은 이미 사용 중입니다.');
                            registerForm['nickname'].focus();
                            registerForm['nickname'].select();
                            break;
                        case 'failure_duplicate_contact':
                            registerForm.contactWarning.show('해당 연락처는 이미 사용 중입니다.');
                            registerForm['contact'].focus();
                            registerForm['contact'].select();
                            break;
                        case 'success':
                            registerForm.querySelector('.section.step-2').classList.remove('visible');
                            registerForm.querySelector('.section.step-3').classList.add('visible');
                            break;
                        default:
                            registerForm.contactWarning.show('서버가 알 수 없는 응답을 반환하였습니다. 잠시 후 다시 시도해 주세요.');
                    }
                }
            }
        };
        xhr.send(formData);
    }

};

// 연락처 확인
registerForm['contactSend'].addEventListener('click', () => {
    registerForm.contactWarning.hide();
    if (registerForm['contact'].value === '') {
        registerForm.contactWarning.show('연락처를 입력해 주세요.');
        registerForm['contact'].focus();
        return;
    }
    if (!new RegExp('^(010)(\\d{8})$').test(registerForm['contact'].value)) {
        registerForm.contactWarning.show('올바른 연락처를 입력해 주세요.');
        registerForm['contact'].focus();
        registerForm['contact'].select();
        return;
    }
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `/user/contactCode?contact=${registerForm['contact'].value}`);
    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status >= 200 && xhr.status < 300) {
                const responseObject = JSON.parse(xhr.responseText);
                switch (responseObject.result) {
                    case 'failure_duplicate':
                        registerForm.contactWarning.show('해당 연락처는 이미 사용 중입니다.');
                        registerForm['contact'].focus();
                        registerForm['contact'].select();
                        break;
                    case 'success':
                        registerForm['contact'].setAttribute('disabled', 'disabled');
                        registerForm['contactSend'].setAttribute('disabled', 'disabled');
                        registerForm['contactCode'].removeAttribute('disabled');
                        registerForm['contactVerify'].removeAttribute('disabled');
                        registerForm['contactCode'].focus();
                        registerForm['contactSalt'].value = responseObject.salt;
                        registerForm.contactWarning.show('입력하신 연락처로 인증번호를 전송하였습니다. 5분 이내로 입력해 주세요.');
                        break;
                    default:
                        registerForm.contactWarning.show('서버가 알 수 없는 응답을 반환했습니다. 잠시 후 다시 시도해 주세요.');
                }
            } else {
                registerForm.contactWarning.show('서버와 통신하지 못하였습니다. 잠시 후 다시 시도해 주세요.');
            }
        }
    };
    xhr.send();
});
// 휴대폰 인증 확인
registerForm['contactVerify'].addEventListener('click', () => {
    registerForm.contactWarning.hide();
    if (registerForm['contactCode'].value === '') {
        registerForm.contactWarning.show('인증번호를 입력해 주세요.');
        registerForm['contactCode'].focus();
        return;
    }
    if (!new RegExp('^(\\d{6})$').test(registerForm['contactCode'].value)) {
        registerForm.contactWarning.show('올바른 인증번호를 입력해 주세요.');
        registerForm['contactCode'].focus();
        registerForm['contactCode'].select();
        return;
    }
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('contact', registerForm['contact'].value);
    formData.append('salt', registerForm['contactSalt'].value);
    formData.append('code', registerForm['contactCode'].value);
    xhr.open('PATCH', '/user/contactCode');
    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status >= 200 && xhr.status < 300) {
                const responseObject = JSON.parse(xhr.responseText);
                switch (responseObject.result) {
                    case 'failure_expired':
                        registerForm.contactWarning.show('해당 인증번호는 만료되었습니다. 처음부터 다시 진행해 주세요.');
                        break;
                    case 'success':
                        registerForm['contactCode'].setAttribute('disabled', 'disabled');
                        registerForm['contactVerify'].setAttribute('disabled', 'disabled');
                        registerForm.contactWarning.show('인증이 완료되었습니다.');
                        registerForm.contactWarning.style.color = 'forestgreen';
                        break;
                    default:
                        registerForm['contactCode'].focus();
                        registerForm['contactCode'].select();
                        registerForm.contactWarning.show('인증번호가 올바르지 않습니다. 다시 확인해 주세요.');
                }
            } else {
                registerForm.contactWarning.show('서버와 통신하지 못하였습니다. 잠시 후 다시 시도해 주세요.');
            }
        }
    };
    xhr.send(formData);
});


// 아이디 확인
registerForm['idCheck'].addEventListener('click', () => {
    registerForm.idWarning.hide();
    if (registerForm['userId'].value === '') {
        registerForm.idWarning.show('아이디를 입력해 주세요.');
        registerForm['userId'].focus();
        return;
    }
    if(!new RegExp('^([\\da-zA-Z]{4,16})$').test(registerForm['userId'].value)){
        registerForm.idWarning.style.color = '#ef5350';
        registerForm.idWarning.show('올바른 아이디를 입력해 주세요.');
        return;
    }
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `/user/userIdCount?userId=${registerForm['userId'].value}`);
    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status >= 200 && xhr.status < 300) {
                const responseObject = JSON.parse(xhr.responseText);
                console.log(responseObject);
                switch (responseObject.result) {
                    case 'duplicate':
                        registerForm.idWarning.show('해당 아이디는 이미 사용 중입니다.');
                        break;
                    case 'okay':
                        registerForm.idWarning.show('해당 아이디는 사용할 수 있습니다.');
                        registerForm.idWarning.style.color = 'forestgreen';
                        break;
                    default:
                        registerForm.idWarning.show('서버가 알 수 없는 응답을 반환하였습니다. 잠시 후 다시 시도해 주세요.');
                }
            } else {
                registerForm.idWarning.show('서버와 통신하지 못하였습니다. 잠시 후 다시 시도해 주세요.');
            }
        }
    };
    xhr.send();
});

// 아이디 변경시마다 정규식 확인
registerForm['userId'].oninput = () =>{
    if(registerForm['userId'].value === ''){
        registerForm.idWarning.style.color = '#ef5350';
        registerForm.idWarning.show('아이디를 입력해 주세요.');
    }
    else if(!new RegExp('^([\\da-zA-Z]{4,16})$').test(registerForm['userId'].value)){
        registerForm.idWarning.style.color = '#ef5350';
        registerForm.idWarning.show('올바른 아이디를 입력해 주세요.');
    }
    else {
        registerForm.idWarning.hide();
    }
};

// 비밀번호 체크
['password', 'passwordCheck'].forEach(name => {
    registerForm[name].addEventListener('focusout', () => {
        if (registerForm['password'].value === '') {
            registerForm.passwordWarning.show('비밀번호를 입력해 주세요.');
            registerForm.passwordWarning.style.color = 'red';
            return;
        }
        if (!new RegExp('^([\\da-zA-Z`~!@#$%^&*()\\-_=+\\[{\\]};:\'",<.>/?]{8,50})$').test(registerForm['password'].value)) {
            registerForm.passwordWarning.show('올바른 비밀번호를 입력해 주세요.');
            registerForm['password'].focus();
            registerForm['password'].select();
            return;
        }
        if (registerForm['passwordCheck'].value === '') {
            registerForm.passwordWarning.show('비밀번호를 다시 한번 더 입력해 주세요.');
            registerForm.passwordWarning.style.color = 'red';
            return;
        }
        if (registerForm['password'].value !== registerForm['passwordCheck'].value) {
            registerForm.passwordWarning.show('비밀번호가 서로 일치하지 않습니다.');
            registerForm.passwordWarning.style.color = 'red';
            return;
        }
        if (registerForm['password'].value === registerForm['passwordCheck'].value) {
            registerForm.passwordWarning.show('비밀번호가 일치합니다.');
            registerForm.passwordWarning.style.color = 'forestgreen';
        } else {
            registerForm.passwordWarning.hide();
        }
    });
});

// 이메일 변경시마다 확인
['email'].forEach(email => {
    registerForm[email].addEventListener('focusout', () => {
        if (registerForm['email'].value === '') {
            registerForm.emailWarning.show('이메일을 입력해 주세요.');
            registerForm.emailWarning.style.color = 'red';
        } else if (!new RegExp('^(?=.{10,50}$)([\\da-zA-Z\\-_]{5,25})@([\\da-z][\\da-z\\-]*[\\da-z]\\.)?([\\da-z][\\da-z\\-]*[\\da-z])\\.([a-z]{2,15})(\\.[a-z]{2})?$').test(registerForm['email'].value)) {
            registerForm.emailWarning.show('올바른 이메일을 입력해 주세요.');
            registerForm['email'].focus();
            registerForm['email'].select();
        } else {
            registerForm.emailWarning.hide();
        }
    });
});

// 이메일 변경시마다 확인
['name'].forEach(name => {
    registerForm[name].addEventListener('focusout', () => {
        if (registerForm['name'].value === '') {
            registerForm.nameWarning.show('이름을 입력해 주세요.');
            registerForm.nameWarning.style.color = 'red';
        } else {
            registerForm.nameWarning.hide();
        }
    });
});

// 닉네임 확인
registerForm['nicknameCheck'].addEventListener('click', () => {
    if (registerForm['nickname'].value === '') {
        registerForm.nicknameWarning.show('닉네임을 입력해 주세요.');
        registerForm['nickname'].focus();
        return;
    }
    if (!new RegExp('^([가-힣a-zA-Z0-9_-]{2,20})$').test(registerForm['nickname'].value)) {
        registerForm.nicknameWarning.show('별명은 2~20자의 한글, 영문, 숫자, 특수문자(-, _)만 사용할 수 있습니다.');
        registerForm['nickname'].focus();
        registerForm['nickname'].select();
        return;
    }
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `/user/userNicknameCount?nickname=${registerForm['nickname'].value}`);
    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status >= 200 && xhr.status < 300) {
                const responseObject = JSON.parse(xhr.responseText);
                console.log(responseObject);
                switch (responseObject.result) {
                    case 'duplicate':
                        registerForm.nicknameWarning.show('해당 닉네임은 이미 사용 중입니다.');
                        break;
                    case 'okay':
                        registerForm.nicknameWarning.show('해당 닉네임은 사용할 수 있습니다.');
                        registerForm.nicknameWarning.style.color = 'forestgreen';
                        break;
                    default:
                        registerForm.nicknameWarning.show('서버가 알 수 없는 응답을 반환하였습니다. 잠시 후 다시 시도해 주세요.');
                }
            } else {
                registerForm.nicknameWarning.show('서버와 통신하지 못하였습니다. 잠시 후 다시 시도해 주세요.');
            }
        }
    };
    xhr.send();
});

// 닉네임 변경시마다 확인
['nickname'].forEach(nickname => {
    registerForm[nickname].addEventListener('focusout', () => {
        if (registerForm['nickname'].value === '') {
            registerForm.nicknameWarning.show('별명을 입력해 주세요.');
            registerForm.nicknameWarning.style.color = 'red';
        } else if (!new RegExp('^([가-힣a-zA-Z0-9_-]{2,20})$').test(registerForm['nickname'].value)) {
            registerForm.nicknameWarning.show('별명은 2~20자의 한글, 영문, 숫자, 특수문자(-, _)만 사용할 수 있습니다.');
            registerForm['nickname'].focus();
            registerForm['nickname'].select();
        } else {
            registerForm.nicknameWarning.hide();
        }
    });
});

// 취소 버튼 클릭 시 이벤트 처리
cancelButton.addEventListener('click', function() {
    registerForm.querySelector('.step-1').classList.add('visible');
    registerForm.querySelector('.step-2').classList.remove('visible');
});








