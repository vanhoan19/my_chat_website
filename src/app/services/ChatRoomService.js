import axios from "axios";
import { PREFIX_API_URL } from "./constant";

export const getAllMessageByChatRoomId = (chatRoomId) => {
    if (chatRoomId != null) {
        return axios.post(PREFIX_API_URL + `/api/v1/message/get-messages/${chatRoomId}`)
    }
}

export const getAllChatRoomNotificationsByUserId = (userId) => {
    return axios.post(PREFIX_API_URL + `/api/v1/chatroom/get-all-chatroom-notification/${userId}`);
}

export const getAllChatRoomsByUserId = (userId) => {
    return axios.post(PREFIX_API_URL + `/api/v1/chatroom/get-all-chatroom/${userId}`);
}

export const createIndividualChatRoom = (createdBy, otherId) => {
    const request = {
        createdBy: createdBy,
        otherId: otherId,
    }
    return axios.post(PREFIX_API_URL + "/api/v1/chatroom/create-individual-chatroom", request)
}

export const createGroupChatRoom = (createdBy, memberIds, roomName, roomAvatar) => {
    const formData = new FormData()

    formData.append('createdBy', createdBy)
    formData.append('memberIds', memberIds)
    formData.append('roomName', roomName)
    roomAvatar !== null && formData.append('roomAvatar', roomAvatar)

    return axios.post(PREFIX_API_URL + "/api/v1/chatroom/create-group-chatroom", formData)
}