contents.searchForm = contents.querySelector('[rel="searchForm"]');

// contents.searchForm['btnSearch'].addEventListener('click', () => {
//     location.href = `?p=1&c=${contents.searchForm['c'].value.toLowerCase().trim()}`;
//     console.log('btnSearch');
// });
//
//
//
//
contents.searchForm['search'].addEventListener('keydown', (event) => {
    if(event.key === 'Enter'){
        contents.searchForm['btnSearch'].click();
    }
    // console.log('searchCriterion');
});

document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
    };
});