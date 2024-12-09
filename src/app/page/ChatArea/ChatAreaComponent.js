import React, { useState, useRef, useEffect, useContext } from 'react';
import { Avatar, Divider, Flex, Input, Button, Skeleton } from "antd";
import { PlusOutlined, SendOutlined, CloseOutlined } from '@ant-design/icons';
import { Message } from '../Message/Message';
import { ChatRoomContext } from '../../core/ChatRoomProvider';
import axios from 'axios';
import { AuthContext } from '../../core/AuthProvider';
import {formatLocalDateTimeToDate} from '../../utils/Utils'

const URL_SEND_MESSAGE = 'http://localhost:8081/api/v1/message/send-message'

export const ChatAreaComponent = () => {
  const enterMessageInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const messageContainerRef = useRef(null); // Để tham chiếu đến container chứa các file
  const [files, setFiles] = useState([]);
  const [sendMessage, setSendMessage] = useState('')
  const {activeRoom, messages, isGetConversationData } = useContext(ChatRoomContext)
  const {user} = useContext(AuthContext)

  useEffect(() => {
    return () => {
      // Cleanup tất cả URL blob khi component unmount hoặc files thay đổi
      files.forEach(file => URL.revokeObjectURL(file.url));
    };
  }, [files]);

  const handleIconClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handlePaste = (event) => {
    const items = event.clipboardData.items;
    const newFiles = []; 
    for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
            const blob = items[i].getAsFile();
            newFiles.push({
                url: URL.createObjectURL(blob),
                file: blob,
            });
        }
    }
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files).map((file) => ({
      url: URL.createObjectURL(file),
      file,
    }));
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    scrollToBottom(); // Cuộn xuống dưới sau khi thêm ảnh
  };

  const handleRemoveImage = (indexToRemove) => {
    setFiles((prevFiles) => prevFiles.filter((_, index) => index !== indexToRemove));
  };

  // Hàm cuộn xuống cuối container
  const scrollToBottom = () => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  };

  const sendMessageFunc = async (formData) => {
    try {
      await axios.post(URL_SEND_MESSAGE, formData)
    }
    catch (err) {
      console.log("send-message error: ", err)
    }
  }

  const handleSendMessageClick = () => {
    const enterMessage = sendMessage.trim()
    if (enterMessage === "" && files.length === 0) return
    setSendMessage("")
    const formData = new FormData()
    formData.append('chatRoomId', activeRoom.chatRoomId)
    formData.append('senderId', user.id)
    formData.append('avatar', user.avatar)  
    formData.append('username', user.username)
    formData.append('content', enterMessage)

    // Duyệt qua mảng files và thêm từng file vào FormData
    files.forEach((fileObj, index) => {
      formData.append(`fileAttachments`, fileObj.file);
    });
    
    sendMessageFunc(formData)

    setFiles([])
  }

  return (
    isGetConversationData ?
      ( activeRoom !== null && activeRoom !== undefined ? 
        <Flex vertical style={{ minWidth: '250px', width: '50%', height: 'calc(100vh - 100px)' }}>
          <Flex className="chat-area-header" style={{ flexShrink: 0, padding: '10px 20px' }} align="center">
          <Flex align="center" vertical={false}>
            <Avatar src={activeRoom ? activeRoom.roomAvatar : '/messenger_v1/public/assets/images/logo/manchester.png'} size={45} />
            <div style={{ marginLeft: '10px', fontSize: '1.2rem', fontWeight: '600' }}>{activeRoom ? activeRoom.roomName : 'User'}</div>
          </Flex>
        </Flex>

        <Divider style={{ margin: '0', flexShrink: 0,}} />

        {/* Phần nội dung chat, chiếm không gian còn lại */}
        <Flex
          className="chat-area-content"
          style={{
            flexGrow: 1,
            width: '100%',
            padding: '10px',
            overflowY: 'auto', // Thanh cuộn sẽ xuất hiện khi cần
            marginBottom: '10px',
            flexDirection: 'column-reverse'
          }}
          vertical
          ref={messageContainerRef} // Gắn ref để dễ dàng cuộn đến cuối
        >
          {messages.map((msg, index) => {

            return (
            <Message
              key={msg.messageId}
              chatRoomId={msg.chatRoomId}
              avatar={msg.avatar}
              username={msg.username}
              nickname={msg.nickname}
              content={msg.contentMessage}
              time={formatLocalDateTimeToDate(msg.lastModifiedDate)}
              isCurrentUser={msg.senderId === user.id}
              attachments={msg.fileAttachments} 
            />
          ) })}
        </Flex>

        <Divider style={{ margin: '0', flexShrink: 0 }} />

        {/* Phần footer, luôn cố định */}
        <Flex className="chat-area-footer" vertical={false} align={'end'} style={{ flexShrink: 0, padding: '0 10px' }}>
          <PlusOutlined
            onClick={handleIconClick}
            style={{ fontSize: '20px', cursor: 'pointer', marginBottom: '10px' }}
          />
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          <Flex vertical style={{ flexGrow: 1, margin: '6px 12px' }}>
            {/* Hiển thị các ảnh đã tải lên */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '10px',
                marginBottom: '8px',
              }}
            >
              {files.map((file, index) => (
                <div key={`attachment_${index}`} style={{ position: 'relative', display: 'inline-block' }}>
                  <img
                    src={file.url}
                    alt={`uploaded-${index}`}
                    style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '5px' }}
                  />
                  <CloseOutlined
                    onClick={() => handleRemoveImage(index)}
                    style={{
                      position: 'absolute',
                      top: '-2px',
                      right: '-2px',
                      color: 'white',
                      backgroundColor: 'red',
                      borderRadius: '50%',
                      padding: '2px',
                      cursor: 'pointer',
                      fontSize: '10px',
                    }}
                  />
                </div>
              ))}
            </div>
            <Input
              ref={enterMessageInputRef}
              name='enter_message'
              value={sendMessage}
              onChange={(e) => setSendMessage(e.target.value)}
              placeholder="Paste your image or type your message here..."
              onPaste={handlePaste}
              style={{ padding: '8px', fontSize: '1rem' }}
            />
          </Flex>
          <SendOutlined 
              style={{ fontSize: '20px', cursor: 'pointer', marginBottom: '10px' }}
              onClick={handleSendMessageClick}
          />
        </Flex>
        </Flex> 
        : <Flex vertical style={{ minWidth: '250px', width: '50%', height: 'calc(100vh - 100px)' }}>
        </Flex>
      )
     :
    <Skeleton active />
  );
};
