const MONTHS = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
const MS_IN_DAY = 86400000;

const formatDateTime = (time) => {
    const date = new Date(time);
    let value = `${leadingZero(date.getHours())}:${leadingZero(date.getMinutes())}`;
    const todayTime = new Date().setHours(0, 0, 0, 0);
    if (time < todayTime) {
        value = `${getDate(date, todayTime)} ` + value;
    }
    return value;
}

const getDate = (date, todayTime) => {
    const dateStartTime = new Date(date.getTime()).setHours(0, 0, 0, 0);
    const dayDiff = (todayTime - dateStartTime) / MS_IN_DAY;
    const value = (() => {
        switch (dayDiff) {
            case 0:
                return '';
            case 1:
                return `вчера `;
            default:
                return `${date.getDate()} ${MONTHS[date.getMonth()]} `;
        }
    })()
    return value;
}

const leadingZero = (value) => {
    const newValue = value.toString();
    return newValue.length === 1 ? `0${newValue}` : newValue;
}

export {
    formatDateTime
}