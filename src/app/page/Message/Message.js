import React from 'react';
import { Row, Tooltip, Col, Avatar, Image, Flex } from 'antd';

export const Message = (props) => {
  const { chatRoomId, avatar, username, nickname, content, time, isCurrentUser, attachments = [] } = props;
  return (
      <div
        style={{
          display: 'flex',
          flexShrink: 1,
          flexDirection: isCurrentUser ? 'row-reverse' : 'row',  // Căn chỉnh tin nhắn theo người gửi
          marginBottom: '6px',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
        }}
      >
        {/* Avatar */}
        <Tooltip title={username}>
          <Avatar src={avatar} size={40} style={{ margin: '0 10px', display: isCurrentUser ? 'none' : 'inline-flex' }} />
        </Tooltip>

        <Flex style={{maxWidth: '70%', alignItems: isCurrentUser ? 'flex-end' : 'flex-start',}}>
          <Row gutter={[8, 8]} >
            {content !== "" && 
              <Col span={24} 
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px',
                  justifyContent: isCurrentUser ? 'flex-end' : 'flex-start'
                }}>
                <Tooltip title={time} placement={isCurrentUser ? 'left' : 'right'}>
                  <div
                    style={{
                      display: 'inline-block', // Chỉ bao phủ đúng phần nội dung
                      backgroundColor: isCurrentUser ? '#1890ff' : '#f0f0f0', // Màu nền khác nhau cho người gửi
                      color: isCurrentUser ? '#fff' : '#000',
                      padding: '8px 12px',
                      borderRadius: '10px',
                      wordWrap: 'break-word', // Gói nội dung dài
                      position: 'relative',
                      maxWidth: '100%',
                    }}
                  >
                    {content}
                  </div>
                </Tooltip>
              </Col>
            }

            {/* Hình ảnh đính kèm */}
            {attachments.length > 0 && (
              <Col span={24}
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px',
                  justifyContent: isCurrentUser ? 'flex-end' : 'flex-start'
                }}>
                <div
                  style={{
                    display: 'flex', // Sử dụng flex để các ảnh nằm ngang
                    flexWrap: 'wrap', // Tự động xuống dòng nếu quá rộng
                    gap: '4px', // Khoảng cách giữa các ảnh
                    maxWidth: '100%',
                  }}
                >
                  {attachments.map((src, index) => (
                    <Image
                      key={`attachment_${chatRoomId}_${index}`}
                      src={src}
                      style={{
                        height: '80px', // Chiều cao cố định
                        width: 'auto', // Chiều rộng tự động theo tỉ lệ gốc
                        maxWidth: '100%', // Đảm bảo không vượt quá 70% tổng chiều rộng
                        objectFit: 'cover', // Giữ tỉ lệ gốc và cắt ảnh nếu cần
                        borderRadius: '8px',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
                      }}
                    />
                  ))}
                </div>
              </Col>
            )}
          </Row>
        </Flex>

      </div>
  );
};
