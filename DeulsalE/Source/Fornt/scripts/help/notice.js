contents.searchForm = contents.querySelector('[rel="searchForm"]');

// contents.searchForm['btnSearch'].addEventListener('click', () => {
//     location.href = `?page=1&search=${contents.searchForm['search'].value.toLowerCase().trim()}`;
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





// var radioButtons = document.getElementsByName('radio');
//
// function handleRadioClick(event) {
//     var target = event.target;
//     var label = target.tagName.toLowerCase() === 'span' ? target.parentNode : target;
//     var input = label.previousElementSibling;
//     input.checked = true;
//
//     var selectedValue = input.value;
//     switch (selectedValue) {
//         case "1":
//             console.log("전체 카테고리 선택됨");
//             // 전체 카테고리에 대한 동작 수행
//             break;
//         case "2":
//             console.log("공지 카테고리 선택됨");
//             break;
//         case "3":
//             console.log("점검 카테고리 선택됨");
//             // 점검 카테고리에 대한 동작 수행
//             break;
//         case "4":
//             console.log("업데이트 카테고리 선택됨");
//             // 업데이트 카테고리에 대한 동작 수행
//             break;
//         default:
//             console.log("선택된 카테고리 없음");
//         // 선택된 카테고리가 없을 때의 동작 수행
//     }
// }




// function ArticleList (obj, n4PageNo, idAppendObj, strSearch, emSearchType, n4ArticleCategorySN, n4ArticleCategory2SN, strPath) {
//     if ($(obj).attr("id") == "btnSearch")
//     {
//         if (Article.SearchArticle(strSearch))
//         {
//             if (IsAjaxIng) return false;
//             IsAjaxIng = true;
//
//             if (n4PageNo == null || n4PageNo == '') n4PageNo = 1;
//             if (strSearch == null) strSearch = '';
//             if (emSearchType == null || emSearchType == '') emSearchType = 'Title';
//             if (n4ArticleCategorySN == null) n4ArticleCategorySN = 0;
//             if (n4ArticleCategory2SN == null) n4ArticleCategory2SN = 0;
//             setTimeout(function () {
//                 $.ajax({
//                     url: strPath + '/ListPart?n4PageNo=' + n4PageNo + '&strSearch=' + encodeURIComponent(strSearch) + '&emSearchType=' + emSearchType + '&n4ArticleCategorySN=' + n4ArticleCategorySN + '&n4ArticleCategory2SN=' + n4ArticleCategory2SN,
//                     cache: false,
//                     success: function (data, textStatus, xhr) {
//                         $(idAppendObj).html(data);
//
//                         IsAjaxIng = false;
//                     },
//                     error: function (xhr, status, exception) {
//                         alert(exception);
//                         IsAjaxIng = false;
//                     }
//                 });
//
//             }, 500);
//         }
//     } else {
//         if (IsAjaxIng) return false;
//         IsAjaxIng = true;
//
//         if (n4PageNo == null || n4PageNo == '') n4PageNo = 1;
//         if (strSearch == null) strSearch = '';
//         if (emSearchType == null || emSearchType == '') emSearchType = 'Title';
//         if (n4ArticleCategorySN == null) n4ArticleCategorySN = 0;
//         if (n4ArticleCategory2SN == null) n4ArticleCategory2SN = 0;
//
//         setTimeout(function () {
//             $.ajax({
//                 url: strPath + '/ListPart?n4PageNo=' + n4PageNo + '&strSearch=' + encodeURIComponent(strSearch) + '&emSearchType=' + emSearchType + '&n4ArticleCategorySN=' + n4ArticleCategorySN + '&n4ArticleCategory2SN=' + n4ArticleCategory2SN,
//                 cache: false,
//                 success: function (data, textStatus, xhr) {
//                     $(idAppendObj).html(data);
//
//                     IsAjaxIng = false;
//                 },
//                 error: function (xhr, status, exception) {
//                     alert(exception);
//                     IsAjaxIng = false;
//                 }
//             });
//
//         }, 500);
//     }
// }



