export const formatLocalDateTimeToDate = (timeArray) => {
    // timeArray: [year, month (1-based), day, hour, minute, second, nanosecond]

    // Lưu ý: tháng trong JavaScript `Date` là 0-based (0 = January), nên cần trừ đi 1 khi tạo Date.
    const date = new Date(
        timeArray[0],  // year
        timeArray[1] - 1,  // month
        timeArray[2],  // day
        timeArray[3],  // hour
        timeArray[4],  // minute
        timeArray[5],  // second
        Math.floor(timeArray[6] / 1000000) // convert nanoseconds to milliseconds
    );

    // Hàm để thêm số 0 trước các giá trị nhỏ hơn 10
    const padZero = (num) => (num < 10 ? '0' + num : num);

    // Định dạng theo `dd/MM/yyyy HH:mm:ss`
    const formattedDate = `${padZero(date.getDate())}-${padZero(date.getMonth() + 1)}-${date.getFullYear()} ` +
                          `${padZero(date.getHours())}:${padZero(date.getMinutes())}:${padZero(date.getSeconds())}`;

    return formattedDate;
}

export const calculateLastModifiedToNow = (lastModifiedDate) => {
    const now = new Date(); const lastModified = new Date( 
        lastModifiedDate[0], // year 
        lastModifiedDate[1] - 1, // month (0-based index) 
        lastModifiedDate[2], // day 
        lastModifiedDate[3], // hour 
        lastModifiedDate[4], // minute 
        lastModifiedDate[5], // second 
        Math.floor(lastModifiedDate[6] / 1000000) // millisecond 
    ); 
    const seconds = Math.floor((now - lastModified) / 1000); 
    let interval = Math.floor(seconds / 31536000); 
    if (interval >= 1) { 
        return interval + " năm trước"; 
    } 
    interval = Math.floor(seconds / 2592000); 
    if (interval >= 1) { 
        return interval + " tháng trước"; 
    } 
    interval = Math.floor(seconds / 86400); 
    if (interval >= 1) { 
        return interval + " ngày trước"; 
    } 
    interval = Math.floor(seconds / 3600); 
    if (interval >= 1) { 
        return interval + " giờ trước"; 
    } 
    interval = Math.floor(seconds / 60); 
    if (interval >= 1) { 
        return interval + " phút trước"; 
    } 
    return "vừa xong";
}
