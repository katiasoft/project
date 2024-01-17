const loginForm = document.getElementById('loginForm');
const warning = loginForm.querySelector('.warning');
const loginBtn = loginForm.querySelector('.login-button');

function handleLogin() {
    const userId = loginForm.querySelector('[name="userId"]');
    const password = loginForm.querySelector('[name="password"]');
    const authority = loginForm.querySelector('[name="authority"]:checked');
    if (userId.value === '') {
        userId.focus();
        warning.textContent = '아이디를 입력해 주세요.';
        warning.classList.add('invalid')
        return false;
    }
    if (password.value === '') {
        password.focus();
        warning.textContent = '비밀번호를 입력해 주세요.';
        warning.classList.add('invalid');
        return false;
    }
    if (!new RegExp('^([\\da-zA-Z`~!@#$%^&*()\\-_=+\\[{\\]};:\'",<.>/?]{8,50})$').test(password.value)) {
        password.focus();
        password.select();
        warning.textContent = '올바른 비밀번호를 입력해 주세요.';
        warning.classList.add('invalid');
        return false;
    }
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('userId', userId.value);
    formData.append('password', password.value);
    formData.append('authority', authority.value);
    xhr.open('POST', '/user/login');
    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status >= 200 && xhr.status < 300) {
                let referrer = document.referrer;
                const responseObject = JSON.parse(xhr.responseText);
                switch (responseObject.result) {
                    case 'failure':
                        warning.textContent = '아이디 혹은 비밀번호가 올바르지 않습니다.';
                        warning.classList.add('invalid');
                        userId.focus();
                        userId.select();
                        break;
                    case 'failure_dormant' :
                        warning.textContent = '해당 계정은 휴면 계정입니다. 비밀번호 재설정 후 이용해주시기 바랍니다.';
                        warning.classList.add('invalid');
                        break;
                    case 'failure_authority' :
                        warning.textContent = '존재하지 않는 계정입니다.';
                        warning.classList.add('invalid');
                        break;
                    case 'success_business' :
                        if(location.href.toString().search('login') >= 0){
                            if(referrer === ''){
                                window.location.href = '/entrepreneur';
                            }
                            else{
                                window.location.href = referrer;
                            }
                        }
                        else{
                            window.location.href = '';
                        }
                        break;
                    case 'success' :
                        if(location.href.toString().search('login') >= 0){
                            if(referrer === ''){
                                window.location.href = '/';
                            }
                            else{
                                window.location.href = referrer;
                            }
                        }
                        else{
                            window.location.href = '';
                        }
                        break;
                    default :
                        warning.textContent = '서버가 알 수 없는 응답을 반환했습니다. 고객센터로 문의해주시기 바랍니다.';
                        warning.classList.add('invalid');
                }
            } else {
                warning.textContent = '서버와 통신하지 못하였습니다. 잠시 후 다시 시도해 주세요.';
                warning.classList.add('invalid');
            }
        }
    };
    xhr.send(formData);
}

loginForm.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        handleLogin();
    }
});

loginBtn.addEventListener('click', function (e) {
    e.preventDefault();
    handleLogin();
});
