import axios from "axios";
import { PREFIX_API_URL } from "./constant";

export const ReadNotification = (notificationId, userId) => {
    const readNotificationRequest = {
        notificationId: notificationId,
        accountId: userId
    }
    return axios.post(PREFIX_API_URL + '/api/v1/notification/mark-read-notification', readNotificationRequest)
}