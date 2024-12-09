import React, { useContext } from 'react';
import { Avatar, Flex, Divider } from "antd";
import './NotificationDetail.css';
import { ChatRoomContext } from '../../core/ChatRoomProvider';
import axios from 'axios';
import { AuthContext } from '../../core/AuthProvider';
import { ReadNotification } from '../../services/NotificationService';

export const NotificationDetail = (props) => {
    const {setActiveRoom} = useContext(ChatRoomContext)
    const {user} = useContext(AuthContext)

    let {
        notificationId,
        chatRoomId,
        avatar,
        username,
        content,
        time,
        isActive = true,
        isRead,
        isFocus
    } = props;

    const notificationClick = () => {
        if (!isRead) {
            ReadNotification(notificationId, user.id)
        }
        setActiveRoom(chatRoomId)
    }
    
    return (
        <Flex 
            vertical 
            style={{ cursor: 'pointer', borderRadius: '10px', margin: '0 10px' }}
            className={isFocus ? 'active' : ''}
            onClick={notificationClick}
        >
            <Flex vertical={false} style={{ padding: '10px' }} align="center" justify="space-between">
                <div style={{ position: 'relative' }}>
                    <Avatar 
                        src={avatar} 
                        size={45} 
                        style={{ flexShrink: 0 }} 
                        className={isActive ? 'chatroom-active' : ''} 
                    />
                    {!isActive && (
                        <div className="active-indicator" style={{
                            position: 'absolute',
                            bottom: '-0',
                            right: '-2px',
                            transform: 'translateX(-50%)',
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            backgroundColor: 'green'
                        }}></div>
                    )}
                </div>
                <Flex vertical style={{ flexGrow: 1, fontSize: '1rem', padding: '0 5px', minWidth: 0 }}>
                    <div style={{
                        fontWeight: '650',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    }}>
                        {username}
                    </div>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        color: isRead ? 'var(--msg-message)' : 'var(--msg-message-unread)'
                    }}>
                        <span style={{ flexShrink: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>{content}</span>
                        <span style={{ flexShrink: 0 }}> &nbsp;•&nbsp; </span>
                        <span style={{ flexShrink: 0, fontSize: '0.85rem' }}>{time}</span>
                    </div>
                </Flex>
                {!isRead && <span className="notification-dot" style={{ flexShrink: 0 }}></span>}
            </Flex>
            <Divider style={{ margin: '0' }} />
        </Flex>
    );
};
