window.onload = function () {
    buildCalendar();
}    // 웹 페이지가 로드되면 buildCalendar 실행

let nowMonth = new Date();  // 현재 달을 페이지를 로드한 날의 달로 초기화
let today = new Date();     // 페이지를 로드한 날짜를 저장
let limitDay = new Date(today.getFullYear(), today.getMonth() + 3, today.getDate());
today.setHours(0, 0, 0, 0);    // 비교 편의를 위해 today의 시간을 초기화

let count = 0;
let selectDay = [0, 0];
let resultDays = [];
let reservationList;
const reservationForm = document.getElementById('reservationForm');
const allCost = document.getElementById("allCost");
let costNow = 0;


// 달력 생성 : 해당 달에 맞춰 테이블을 만들고, 날짜를 채워 넣는다.
function buildCalendar() {

    let firstDate = new Date(nowMonth.getFullYear(), nowMonth.getMonth(), 1);     // 이번달 1일
    let lastDate = new Date(nowMonth.getFullYear(), nowMonth.getMonth() + 1, 0);  // 이번달 마지막날

    let tbody_Calendar = document.querySelector(".Calendar > tbody");
    document.getElementById("calYear").innerText = nowMonth.getFullYear();             // 연도 숫자 갱신
    document.getElementById("calMonth").innerText = leftPad(nowMonth.getMonth() + 1);  // 월 숫자 갱신

    while (tbody_Calendar.rows.length > 0) {                        // 이전 출력결과가 남아있는 경우 초기화
        tbody_Calendar.deleteRow(tbody_Calendar.rows.length - 1);
    }

    let nowRow = tbody_Calendar.insertRow();        // 첫번째 행 추가

    for (let j = 0; j < firstDate.getDay(); j++) {  // 이번달 1일의 요일만큼
        let nowColumn = nowRow.insertCell();        // 열 추가
    }

    for (let nowDay = firstDate; nowDay <= lastDate; nowDay.setDate(nowDay.getDate() + 1)) {   // day는 날짜를 저장하는 변수, 이번달 마지막날까지 증가시키며 반복

        let nowColumn = nowRow.insertCell();        // 새 열을 추가하고
        nowColumn.innerText = leftPad(nowDay.getDate());      // 추가한 열에 날짜 입력


        if (nowDay.getDay() == 0) {                 // 일요일인 경우 글자색 빨강으로
            nowColumn.style.color = "#DC143C";
        }
        if (nowDay.getDay() == 6) {                 // 토요일인 경우 글자색 파랑으로 하고
            nowColumn.style.color = "#0000CD";
            nowRow = tbody_Calendar.insertRow();    // 새로운 행 추가
        }

        function makeId(day) {
            return '' + day.getFullYear() + '-' + (day.getMonth() + 1 < 10 ? '0' : '') + (day.getMonth() + 1) + '-' + (day.getDate() < 10 ? '0' : '') + day.getDate()
        }


        if (nowDay < today) {                       // 지난날인 경우
            nowColumn.className = "pastDay";
        } else if (nowDay.getFullYear() == today.getFullYear() && nowDay.getMonth() == today.getMonth() && nowDay.getDate() == today.getDate()) { // 오늘인 경우
            nowColumn.className = "pastDay";
            // nowColumn.id = makeId(nowDay);
            // nowColumn.onclick = function () {
            //     choiceDate(this);
            // }
        } else if (nowDay > limitDay) {
            nowColumn.className = "pastDay";
        } else {                                      // 미래인 경우
            nowColumn.className = "futureDay";
            nowColumn.id = makeId(nowDay);
            nowColumn.onclick = function () {
                choiceDate(this);
            }
        }
    }
}

// 날짜 선택
function choiceDate(nowColumn) {
    // if (document.getElementsByClassName("choiceDay")[0]) {                              // 기존에 선택한 날짜가 있으면
    //     document.getElementsByClassName("choiceDay")[0].classList.remove("choiceDay");  // 해당 날짜의 "choiceDay" class 제거
    // }
    if (reservationForm['site'].value === '') {
        dialogCover.show();
        dialogLayer.show({
            title: '경고',
            content: '객실을 선택 해주세요.',
            onConfirm: e => {
                e.preventDefault();
                dialogCover.hide();
                dialogLayer.hide();
            }
        });
        return;
    }
    if (count === 0) {
        selectDay[0] = nowColumn.id;
        nowColumn.classList.add("choiceDay");
        reservationForm['start'].value = selectDay[0];
        count++;
    } else if (count === 1) {
        if (!isCheckPreviousDate(selectDay[0], nowColumn.id)) {
            dialogCover.show();
            dialogLayer.show({
                title: '경고',
                content: '시작일자 보다 빠르게 설정할 수 없습니다.<br><br>다시 선택 해주세요.',
                onConfirm: e => {
                    e.preventDefault();
                    dialogCover.hide();
                    dialogLayer.hide();
                }
            });
            return;
        }
        resultDays = getDatesStartToLast(selectDay[0], nowColumn.id);
        console.log(resultDays);
        if (resultDays.length > 7) {
            dialogCover.show();
            dialogLayer.show({
                title: '경고',
                content: '예약 가능한 최대 일자수(7일)를 넘었습니다.<br><br>다시 선택 해주세요.',
                onConfirm: e => {
                    e.preventDefault();
                    dialogCover.hide();
                    dialogLayer.hide();
                }
            });
            return;
        }
        selectDay[1] = nowColumn.id;
        nowColumn.classList.add("choiceDay");
        reservationForm['end'].value = selectDay[1];
        for (let i = 1; i < resultDays.length - 1; i++) {
            document.getElementById(resultDays[i]).classList.add("choiceDay");
        }
        reservationForm["addPerson"].value = 0;
        let cost = costData[reservationForm["site"].value]["cost"];
        cost *= (resultDays.length - 1);
        costNow = cost;
        allCost.innerText = "" + cost;
        reservationForm["addPerson"].removeAttribute('disabled');
        count++;
    } else {
        for (let i = 0; i < resultDays.length; i++) {
            document.getElementById(resultDays[i]).classList.remove("choiceDay");
        }
        reservationForm["addPerson"].value = 0;
        let cost = costData[reservationForm["site"].value]["cost"];
        costNow = cost;
        allCost.innerText = "" + cost;
        reservationForm['start'].value = '';
        reservationForm['end'].value = '';
        reservationForm["addPerson"].setAttribute('disabled', 'disabled');
        count = 0;
    }
}

// 이전달 버튼 클릭
function prevCalendar() {
    nowMonth = new Date(nowMonth.getFullYear(), nowMonth.getMonth() - 1, nowMonth.getDate());   // 현재 달을 1 감소
    buildCalendar();    // 달력 다시 생성
    for (const reservation of reservationList) {
        setReservationDay(reservation['startDay'], reservation['endDay']);
    }
}

// 다음달 버튼 클릭
function nextCalendar() {
    nowMonth = new Date(nowMonth.getFullYear(), nowMonth.getMonth() + 1, nowMonth.getDate());   // 현재 달을 1 증가
    buildCalendar();    // 달력 다시 생성
    for (const reservation of reservationList) {
        setReservationDay(reservation['startDay'], reservation['endDay']);
    }
}

function setReservationDay(sDay, eDay) {
    console.log(sDay);
    console.log(eDay);
    let reservationDays = getDatesStartToLast(sDay, eDay);
    console.log(reservationDays);
    for (let i = 0; i < reservationDays.length; i++) {
        const day = document.getElementById(reservationDays[i]);
        if (day !== null) {
            day.classList.remove("futureDay");
            day.classList.remove("pastDay");
            day.classList.add("pastDay");
            day.onclick = function () {
            };
        }
    }
}

// input값이 한자리 숫자인 경우 앞에 '0' 붙혀주는 함수
function leftPad(value) {
    if (value < 10) {
        value = "0" + value;
        return value;
    }
    return value;
}

function getDatesStartToLast(startDate, lastDate) {
    // let regex = RegExp(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/);
    // if (!(regex.test(startDate) && regex.test(lastDate))) return "Not Date Format";
    let result = [];
    let curDate = new Date(startDate);
    while (curDate <= new Date(lastDate)) {
        result.push(curDate.toISOString().split("T")[0]);
        curDate.setDate(curDate.getDate() + 1);
    }
    return result;
}

function isCheckPreviousDate(startDate, lastDate) {
    return new Date(startDate) < new Date(lastDate) ? true : false;
}


reservationForm["site"].onchange = () => {
    buildCalendar();
    if (reservationForm["site"].value === "") {
        reservationForm["addPerson"].setAttribute('disabled', 'disabled');
        return;
    }

    const xhr = new XMLHttpRequest();
    const formData = new FormData();

    console.log(typeof (campsiteData['index']));
    formData.append("campsiteIndex", campsiteData['index']);
    formData.append("site", reservationForm["site"].value);

    xhr.open("POST", `/member/reservation/list`);
    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status >= 200 && xhr.status < 300) {
                const responseObject = JSON.parse(xhr.responseText);
                reservationList = responseObject['dayLists'];
                console.log(reservationList);

                for (const reservation of reservationList) {
                    setReservationDay(reservation['startDay'], reservation['endDay']);
                }

                // reservationForm["addPerson"].removeAttribute('disabled');
                let addPerson = costData[reservationForm["site"].value]["addPerson"];
                let cost = costData[reservationForm["site"].value]["cost"];
                reservationForm["addPerson"].value = 0;
                reservationForm["addPerson"].max = addPerson;
                allCost.innerText = "" + cost;
            } else {
                dialogCover.show();
                dialogLayer.show({
                    title: '경고',
                    content: '서버 통신에 문제가 발생하였습니다.<br><br>잠시후 다시시도해 주세요.',
                    onConfirm: e => {
                        e.preventDefault();
                        dialogCover.hide();
                        dialogLayer.hide();
                    }
                });
            }
        }
    };
    xhr.send(formData);
}

reservationForm["addPerson"].onchange = () => {
    if (reservationForm["site"].value === "")
        return;
    let cost = costNow;
    console.log(cost);
    cost += parseInt(reservationForm["addPerson"].value) * costData[reservationForm["site"].value]["addPersonCost"];
    console.log(cost);
    allCost.innerText = "" + cost;
}


reservationForm.onsubmit = e => {
    e.preventDefault();
    if (reservationForm['site'].value === '') {
        dialogCover.show();
        dialogLayer.show({
            title: '경고',
            content: '객실을 선택 해주세요.',
            onConfirm: e => {
                e.preventDefault();
                dialogCover.hide();
                dialogLayer.hide();
            }
        });
        return;
    }

    if (reservationForm['start'].value === '') {
        dialogCover.show();
        dialogLayer.show({
            title: '경고',
            content: '입실일자를 선택 해주세요.',
            onConfirm: e => {
                e.preventDefault();
                dialogCover.hide();
                dialogLayer.hide();
            }
        });
        return;
    }

    if (reservationForm['end'].value === '') {
        dialogCover.show();
        dialogLayer.show({
            title: '경고',
            content: '퇴실일자를 선택 해주세요.',
            onConfirm: e => {
                e.preventDefault();
                dialogCover.hide();
                dialogLayer.hide();
            }
        });
        return;
    }
    const xhr = new XMLHttpRequest();
    const formData = new FormData();

    formData.append("campsiteIndex", campsiteData['index']);
    formData.append("site", reservationForm["site"].value);
    formData.append("strStartDay", reservationForm["start"].value);
    formData.append("strEndDay", reservationForm["end"].value);
    formData.append("cost", allCost.innerText);
    formData.append("person", reservationForm["addPerson"].value);

    xhr.open('POST', `/member/reservation`);
    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status >= 200 && xhr.status < 300) {
                const responseObject = JSON.parse(xhr.responseText);
                switch (responseObject.result) {
                    case 'failure':
                        dialogCover.show();
                        dialogLayer.show({
                            title: '경고',
                            content: '오류가 발생하였습니다.<br><br>잠시후 다시 시도해 주세요.',
                            onConfirm: e => {
                                e.preventDefault();
                                dialogCover.hide();
                                dialogLayer.hide();
                            }
                        });
                        break;
                    case 'failure_processing':
                        dialogCover.show();
                        dialogLayer.show({
                            title: '경고',
                            content: '이미 해당일자에 예약있습니다.<br><br>확인 후 다시 시도 해주세요.',
                            onConfirm: e => {
                                e.preventDefault();
                                dialogCover.hide();
                                dialogLayer.hide();
                            }
                        });
                        break;
                    case 'success':
                        dialogCover.show();
                        dialogComplete.show({
                            title: '예약',
                            content: '야영장이 예약되었습니다.',
                            onConfirm: e => {
                                e.preventDefault();
                                dialogCover.hide();
                                dialogComplete.hide();
                                location.href += '';
                            }
                        });
                        break;
                    default:
                        dialogCover.show();
                        dialogLayer.show({
                            title: '경고',
                            content: '서버가 알 수 없는 응답을 반환했습니다.<br><br>관리자에게 문의해 주세요.',
                            onConfirm: e => {
                                e.preventDefault();
                                dialogCover.hide();
                                dialogLayer.hide();
                            }
                        });
                }
            } else {
                dialogCover.show();
                dialogLayer.show({
                    title: '경고',
                    content: '서버 통신에 문제가 발생하였습니다.<br><br>잠시후 다시시도해 주세요.',
                    onConfirm: e => {
                        e.preventDefault();
                        dialogCover.hide();
                        dialogLayer.hide();
                    }
                });
            }
        }
    };
    xhr.send(formData);
}