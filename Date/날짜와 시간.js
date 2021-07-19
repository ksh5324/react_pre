// getFullYear() -> 연도 불러오기
const date = new Date();
const year = date.getFullYear();

// getMonth() -> 월 가져오기
// getDate() -> 일 가져오기
// 월은 0부터 반환 -> 1월은 0 ,2월은 1

// getHours() -> 시간 가져오기
// getMinutes() -> 분 가져오기
// getSeconds() -> 초 가져오기
// getMilliseconds() -> 밀리초 가져오기
const date = new Date();
const hour = date.getHours();
const minute = date.getMinutes();
const second = date.getSeconds();

// getDay() -> 요일 가져오기
// 0번이 일요일 ~
const date = new Date();
const day = date.getDay();
const dayList = ["일", "월", "화", "수", "목", "금", "토"];
const label = dayList[day];
document.querySelector("#log").innerHTML = `오늘은 ${label}요일입니다.`;

// toLocaleDateString() -> 현재날짜를 문자열로 가져오기
// toLocaleTimeString() -> 현재시간을 문자열로 가져오기
const date = new Date();
const locale = date.toLocaleString();
const localeDate = date.toLocaleDateString();
const localeTime = date.toLocaleTimeString();

// 날짜설정하기
const date1 = new Date("2020/12/28 20:01:10");
const date2 = new Date("Mon Dec 28 2020 20:01:10");
const date3 = new Date(2020, 12, 28, 20, 1, 10);
// setFullYear()
// setMonth()
// setDate()
// setHours()
// setMinutes()
// setSeconds
// setMilliseconds()
