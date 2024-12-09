import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import SockJS from 'sockjs-client'
import {Client} from '@stomp/stompjs'
import { AuthContext } from './AuthProvider';
import { ReadNotification } from '../services/NotificationService';
import { getAllChatRoomNotificationsByUserId, getAllChatRoomsByUserId, getAllMessageByChatRoomId } from '../services/ChatRoomService';

const ChatRoomContext = createContext();

const ChatRoomProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [chatRooms, setChatRooms] = useState([]) // danh sách các phòng chat
    const [isGetConversationData, setIsGetConversationData] = useState(false)
    const [conversationData, setConversationData] = useState([]);
    const [conversationMap, setConversationMap] = useState(new Map()); // không quan tâm đến content mới nhất
    const [activeChatRoomId, setActiveChatRoomId] = useState(null);
    const [messages, setMessages] = useState([]); // danh sách các tin nhắn mà người dùng đang focus hiện tại
    const stompClientRef = useRef(null);
    const pendingSubscriptions = useRef([]);
    // Ref to track the current activeChatRoomId
    const activeChatRoomIdRef = useRef(activeChatRoomId);

    useEffect(() => {
        activeChatRoomIdRef.current = activeChatRoomId
    }, [activeChatRoomId])
    
    useEffect(() => {
        // lấy danh sách các thông báo mới nhất ứng với mỗi phòng
        const fetchData = async () => {
            if (!user) return; // Kiểm tra xem user có hợp lệ hay không

            try {
                const response = await getAllChatRoomNotificationsByUserId(user.id)
                setIsGetConversationData(true)

                const data = response.data.data;
                setConversationData(data)

                const map = new Map(data.map((room) => [room.chatRoomId, room]))
                console.log(map);
                setConversationMap(map); // Cập nhật state với dữ liệu nhận được

                if (data.length > 0 && !activeChatRoomId) {
                    setActiveChatRoomId(data[0].chatRoomId)
                }

            } catch (err) {
                console.log("Error getting all chatroom notification: ", err);
            }
        };
        fetchData()
    }, [])

    useEffect(() => {
        // Lấy danh sách các phòng chat
        const fetchChatRooms = async () => {
            if (!user) return; // Kiểm tra xem user có hợp lệ hay không
            try {
                const response = await getAllChatRoomsByUserId(user.id)
                console.log("Get all chat rooms: ", response.data.data)
                setChatRooms(response.data.data)
            } catch (err) {
                console.log("Error fetch chat rooms: ", err)
            }
        }
        fetchChatRooms()
    }, [])

    useEffect(() => {
        if (!stompClientRef.current) {
            try {
                // Initialize WebSocket
                const socket = new SockJS('http://localhost:8081/api/v1/ws');
                const client = new Client({
                    webSocketFactory: () => socket,
                    reconnectDelay: 5000
                });
    
                client.onConnect = () => {
                    stompClientRef.current = client; // Lưu stompClient vào ref

                    // Đăng ký để nhận thông báo tạo phòng chat mới
                    client.subscribe(`/chat/${user.id}/queue/new-chatroom`, onNewChatRoomNotificationRecieved)
    
                    // Đăng ký để nhận thông báo tin nhắn
                    chatRooms.forEach(chatRoomId => {
                        console.log(chatRoomId)
                        client.subscribe(`/chat/chat-room/${chatRoomId}`, onNotificationRecieved)
                        console.log("Connected to websocket ", chatRoomId)
                    })
    
                    // Kiểm tra danh sách subscriptions
                    console.log("All Subscriptions: ", Object.keys(client.subscriptions));
                }
    
                client.onStompError = () => {
                    console.log("OnError to connect to websocket")
                }
    
                client.activate()
            } catch (err) {
                console.log("Error fetch chat rooms: ", err)
            }
        }

        return () => {
            if (stompClientRef.current) {
                stompClientRef.current.deactivate();
                console.log('WebSocket disconnected on user logout.');
                stompClientRef.current = null; // Đảm bảo reset ref
            }
        }
    }, [chatRooms])

    useEffect(() => {
        if (stompClientRef.current) {
            pendingSubscriptions.current.forEach((chatRoomId) => {
                stompClientRef.current.subscribe(`/chat/chat-room/${chatRoomId}`, onNotificationRecieved);
                console.log(`Subscribed to chat room: /chat/chat-room/${chatRoomId}`);
            });
            pendingSubscriptions.current = []; // Clear pending queue
        }
    }, [stompClientRef.current]);

    useEffect(() => {
        const fetchData = async () => {
          try {
            // Lấy các messages trong phòng chat đó
            const allMessagesByChatRoomId = await getAllMessageByChatRoomId(activeChatRoomId)
            console.log(allMessagesByChatRoomId)
            setMessages(allMessagesByChatRoomId.data.data)

            // Cập nhật lại isRead
            setConversationData(prevData => {
                const chatRoom = prevData.find(chatroom => chatroom.chatRoomId === activeChatRoomId);
            
                // Chỉ cập nhật nếu cần thiết
                if (chatRoom && !chatRoom.isRead) {
                    return prevData.map(chatroom => 
                        chatroom.chatRoomId === activeChatRoomId
                            ? { ...chatroom, isRead: true } // Chỉ cập nhật khi cần
                            : chatroom
                    );
                }
            
                // Nếu không có gì thay đổi, trả về prevData để tránh re-render
                return prevData;
            });            
          } catch (err) {
            console.log("Error: Get all messages by chat room id: ", err)
          }
    
        }
        fetchData()
      }, [activeChatRoomId])

    const onNotificationRecieved = (payload) => {
        const messageResponse = JSON.parse(payload.body)
        
        // thêm notification vào danh sách notification
        setConversationData((prevData) => {
            const updatedData = [...prevData]
            const chatRoomIndex = updatedData.findIndex(chatRoom => chatRoom.chatRoomId === messageResponse.chatRoomId)
            const contentNotification = messageResponse.contentNotification
            
            if (chatRoomIndex !== -1) {
                const chatRoom = updatedData[chatRoomIndex]
                const updatedChatRoom = {
                    ...chatRoom,
                    notificationId: messageResponse.notificationId,
                    content: messageResponse.senderId === user.id ? `Bạn: ${contentNotification}` : `${messageResponse.nickname}: ${contentNotification}`,
                    lastModifiedDate: messageResponse.lastModifiedDate,
                    isRead: messageResponse.chatRoomId === activeChatRoomIdRef.current
                }
                updatedData.splice(chatRoomIndex, 1)
                updatedData.unshift(updatedChatRoom)
            }
            return updatedData
        })

        if (messageResponse.chatRoomId === activeChatRoomIdRef.current) {
            ReadNotification(messageResponse.notificationId, user.id)

            // thêm message vào danh sách messages hiện tại
            setMessages((prev) => [messageResponse, ...prev])
        }
    } 

    const onNewChatRoomNotificationRecieved = (payload) => {
        let notification = JSON.parse(payload.body).data
        console.log("NEW_CHATROOM: ", notification)
        setConversationData((prev) => {
            // Kiểm tra nếu thông báo đã tồn tại thì không thêm nữa
            if (prev.find((chatRoom) => chatRoom.chatRoomId === notification.chatRoomId)) {
                return prev;
            }
            if (stompClientRef.current) {
                stompClientRef.current.subscribe(`/chat/chat-room/${notification.chatRoomId}`, onNotificationRecieved);
            } else {
                pendingSubscriptions.current.push(notification.chatRoomId); // Lưu phòng chờ đăng ký sau
            }
            if (notification.chatRoomType === "INDIVIDUAL") {
                const [createdBy, createdByNickname, otherNickName] = notification.roomName.split("|")
                const [createdAvatar, otherAvatar] = notification.roomAvatar.split("|")
                const content = notification.content
                // Cập nhật lại roomName, roomAvatar và content
                notification = {
                    ...notification,
                    roomName: (createdBy === user.id ? otherNickName : createdByNickname),
                    roomAvatar: (createdBy === user.id ? otherAvatar : createdAvatar),
                    content: (createdBy === user.id ? `Bạn: ${content}` : `${createdByNickname}: ${content}`)
                }
            }
            else if (notification.chatRoomType === "GROUP") {
                // Cập nhật lại content
                const [createdBy, createdByNickname, content] = notification.content.split("|")
                notification = {
                    ...notification,
                    content: createdBy === user.id ? `Bạn: ${content}` : `${createdByNickname}: ${content}`
                }
            }
            return [notification, ...prev];
        })
        setConversationMap((prevMap) => {
            if (prevMap.has(notification.chatRoomId)) return prevMap;
            return new Map(prevMap).set(notification.chatRoomId, notification);
        });
    }

    const setActiveRoom = (chatRoomId) => {
        setActiveChatRoomId(chatRoomId)
    }

    return (
        <ChatRoomContext.Provider value={{ 
            isGetConversationData,
            conversationData, 
            activeRoom: conversationMap.get(activeChatRoomId), 
            messages,
            setActiveRoom
        }}>
            {children}
        </ChatRoomContext.Provider>
    );
};

export { ChatRoomProvider, ChatRoomContext };
