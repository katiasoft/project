contents.faqSearchForm = contents.querySelector('[rel="faqSearchForm"]');

// contents.faqSearchForm['btnSearch'].addEventListener('click', () => {
//     location.href = `?p=1&c=${contents.faqSearchForm['c'].value.toLowerCase().trim()}`;
//     console.log('btnSearch');
// });
//
contents.faqSearchForm['search'].addEventListener('keydown', (event) => {
    if(event.key === 'Enter'){
        contents.faqSearchForm['btnSearch'].click();
    }
    // console.log('searchCriterion');
});

document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
    };
});

var radioButtons = document.getElementsByName('radio');

function handleRadioClick(category) {
    for (var i = 0; i < radioButtons.length; i++) {
        if (radioButtons[i].checked) {
            var selectedCategory = category;
            Article.ArticleList(radioButtons[i], 1, '#divListPart', '', 'Title', selectedCategory, 0, '/help/faq');
        }
    }
}

for (var i = 0; i < radioButtons.length; i++) {
    radioButtons[i].addEventListener('click', function() {
        var category = this.value;
        handleRadioClick(category);
    });
}
