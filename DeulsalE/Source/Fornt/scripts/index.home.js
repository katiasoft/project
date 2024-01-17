const bene = document.getElementById("bene");
let beneCount = 2;
let nIntervId;
function changeBene() {
    bene.style.backgroundImage = 'url("/resources/images/bener0' + beneCount + '.jpg")';
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
    location.href = `/help/event/view?index=${index}`;
}

function moveNotice(index){
    location.href = `/help/notice/view?index=${index}`;
}


// document.getElementById('searchContent').addEventListener('keydown',(e)=>{
//     if(e.key==='Enter'){
//         location.href = `/integratedSearch?query=${document.getElementById('searchContent').value}`;
//     }
// });