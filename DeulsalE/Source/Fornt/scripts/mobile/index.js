const bene = document.getElementById("bene");
const benerImg = document.getElementById("benerImg");
let beneCount = 2;
let nIntervId;

function changeBene() {
    benerImg.src = '/resources/images/bener0' + beneCount + '.jpg';
    beneCount += 1;
    if (beneCount > 4) {
        beneCount = 1;
    }
}

window.onload = function () {
    nIntervId = setInterval(changeBene, 2000);
    bene.className = 'go';
}

bene.addEventListener("mouseover", () => {
    clearInterval(nIntervId);
    bene.className = 'stop';
    nIntervId = null;
});

bene.addEventListener("mouseout", () => {
    if(bene.className !== 'go') {
        nIntervId = setInterval(changeBene, 2000);
        bene.className = 'go';
    }
});

function moveEvent(index){
    location.href = `/mobile/event/view?index=${index}`;
}

function moveNotice(index){
    location.href = `/mobile/notice/view?index=${index}`;
}