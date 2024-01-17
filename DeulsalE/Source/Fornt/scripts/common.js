const dialogCover = document.getElementById('dialogCover');
const dialogLayer = document.getElementById('dialogLayer');

const dialogYesNo = document.getElementById('dialogYesNo');

const dialogComplete = document.getElementById('dialogComplete');

if(dialogCover !== null){
    dialogCover.show = () => {
        document.body.setAttribute('style', 'overflow:hidden');
        dialogCover.classList.add('visible');
    };

    dialogCover.blind = () => {
        dialogCover.classList.add('blind');
    };

    dialogCover.hide = () => {
        document.body.removeAttribute('style');
        dialogCover.classList.remove('visible')
        dialogCover.classList.remove('blind');
    };
}

if (dialogLayer !== null) {
    dialogLayer.show = (params) => {
        dialogLayer.querySelector('[rel="title"]').innerText = params.title;
        dialogLayer.querySelector('[rel="content"]').innerHTML = params.content;
        const cancelButton = dialogLayer.querySelector('[rel="cancel"]');
        if (typeof params['onCancel'] === 'function') {
            cancelButton.style.display = 'inline-block';
            cancelButton.onclick = params['onCancel'];
        } else {
            cancelButton.style.display = 'none';
        }
        dialogLayer.querySelector('[rel="confirm"]').onclick = params['onConfirm'];
        dialogLayer.classList.add('visible');
    };

    dialogLayer.hide = () => {
        dialogLayer.classList.remove('visible')
    };
}

if (dialogComplete !== null) {
    dialogComplete.show = (params) => {
        dialogComplete.querySelector('[rel="title"]').innerText = params.title;
        dialogComplete.querySelector('[rel="content"]').innerHTML = params.content;
        const cancelButton = dialogComplete.querySelector('[rel="cancel"]');
        if (typeof params['onCancel'] === 'function') {
            cancelButton.style.display = 'inline-block';
            cancelButton.onclick = params['oncancel'];
        } else {
            cancelButton.style.display = 'none';
        }
        dialogComplete.querySelector('[rel="confirm"]').onclick = params['onConfirm'];
        dialogComplete.classList.add('visible');
    };

    dialogComplete.hide = () => {
        dialogComplete.classList.remove('visible')
    };
}

HTMLElement.prototype.toView = function () {
    this.scrollIntoView({block: "center", inline: "nearest"});
};

if (dialogYesNo !== null) {
    dialogYesNo.show = (params) => {
        dialogYesNo.querySelector('[rel="title"]').innerText = params.title;
        dialogYesNo.querySelector('[rel="content"]').innerHTML = params.content;
        const cancelButton = dialogYesNo.querySelector('[rel="cancel"]');
        if (typeof params['onCancel'] === 'function') {
            cancelButton.style.display = 'inline-block';
            cancelButton.onclick = params['onCancel'];
        } else {
            cancelButton.style.display = 'none';
        }
        dialogYesNo.querySelector('[rel="confirm"]').onclick = params['onConfirm'];
        dialogYesNo.classList.add('visible');
    };

    dialogYesNo.hide = () => {
        dialogYesNo.classList.remove('visible')
    };
}

const logoutLink = document.querySelector('.logout');

if (logoutLink !== null) {
    logoutLink.addEventListener('click', function (e) {
        e.preventDefault(); // 기본 동작인 링크 이동을 막기 위해 호출됩니다.

        dialogCover.show();
        dialogYesNo.show({
                title: '로그아웃',
                content: '정말로 로그아웃 하시겠습니까?',
                onConfirm: e => {
                    e.preventDefault();
                    const xhr = new XMLHttpRequest();
                    xhr.open('GET', '/user/logout');
                    xhr.onreadystatechange = () => {
                        if (xhr.readyState === XMLHttpRequest.DONE) {
                            if (xhr.status >= 200 && xhr.status < 300) {
                                // 로그아웃이 성공한 경우에 수행할 동작
                                window.location.href = '/'; // 홈 페이지로 리다이렉션
                            } else {
                                // 로그아웃이 실패한 경우에 수행할 동작
                                console.error('로그아웃에 실패했습니다.');
                            }
                        }
                    };
                    xhr.send();
                    dialogCover.hide();
                    dialogYesNo.hide();
                },
                onCancel: e => {
                    e.preventDefault();
                    dialogCover.hide();
                    dialogYesNo.hide();
                }
            }
        );
        return;
    });
}

const searchContent = document.getElementById('searchContent');
if (searchContent !== null) {
    searchContent.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            location.href = `/integratedSearch?query=${searchContent.value}`;
        }
    });
}

const infoType = document.getElementById("info_type");
infoType.user = infoType.querySelector('[rel="user"]');
infoType.entrepreneur = infoType.querySelector('[rel="entrepreneur"]')

infoType.user.addEventListener('click', () => {
    window.location.href = '/';
});

infoType.entrepreneur.addEventListener('click', () => {
    window.location.href = '/entrepreneur';
});


const bodyDataNot = document.querySelector('[data-not-allowed="notEntrepreneur"]');

if(bodyDataNot !== null){
    dialogCover.show();
    dialogLayer.show({
        title:"계정",
        content:"사업자 계정이 아닙니다.<br><br>사업자로 로그인 후 다시시도 해주세요.",
        onConfirm: e => {
            e.preventDefault();
            window.location.href = '/';
        }
    });
}

const bodyGmDataNot = document.querySelector('[data-not-allowed="notGmEntrepreneur"]');

if(bodyGmDataNot !== null){
    dialogCover.blind();
    dialogCover.show();
    dialogLayer.show({
        title:"계정",
        content:"관리자 계정이 아닙니다.<br><br>관리자로 로그인 후 다시시도 해주세요.",
        onConfirm: e => {
            e.preventDefault();
            window.location.href = '/';
        }
    });
}
