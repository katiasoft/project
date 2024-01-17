const dialogMenu = document.getElementById("dialogMenu");
const header = document.getElementById("header");

dialogMenu.show = () => {
    dialogMenu.classList.add('visible');
};

dialogMenu.hide = () => {
    dialogMenu.classList.remove('visible')
};

header.menuImg = header.querySelector('[rel="menu"]');

header.menuImg.onclick = () =>{
    dialogMenu.show();
    dialogMenu.querySelector('[rel="menuClose"]').onclick = () => {
        console.log('click');
        dialogMenu.hide();
    }
}

header.back = header.querySelector('[rel="back"]');

if (header.back !== null){
    header.back.onclick = () => {
        // location.href = document.referrer;
        history.back();
    }
}

header.home = header.querySelector('[rel="home"]');

if (header.home !== null){
    header.home.onclick = () => {
        location.href = '/mobile';
    }
}

const searchContent = document.getElementById('searchContent');
if (searchContent !== null) {
    searchContent.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            location.href = `/mobile/integratedSearch?query=${searchContent.value}`;
        }
    });
}

window.onpageshow = function(event) {
    if ( event.persisted || (window.performance && window.performance.navigation.type == 2)) {
        if(dialogMenu.classList.contains('visible')){
            dialogMenu.hide();
        }
    }
}