const infoType = document.getElementById("info_type");
infoType.user = infoType.querySelector('[rel="user"]');
infoType.entrepreneur = infoType.querySelector('[rel="entrepreneur"]')

const nav = document.getElementById("nav");
const subBene = document.getElementById("subBene");

infoType.user.addEventListener('click', () => {
    location.href = '/';
});

infoType.entrepreneur.addEventListener('click', () => {
    location.href = '/';
});