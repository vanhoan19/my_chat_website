import { Avatar, Flex, Skeleton, Tooltip, Drawer, Input, Tag, Button, List, Image, Row, Col, message } from "antd"
import {NotificationDetail} from '../Notification/NotificationDetail';
import { useContext, useEffect, useState, useRef } from "react";
import {PlusOutlined} from '@ant-design/icons';
import { TweenOneGroup } from 'rc-tween-one';
import { AuthContext } from "../../core/AuthProvider";
import { ChatRoomContext } from "../../core/ChatRoomProvider";
import { GetAllAccounts, GetAccountsByNickname } from "../../services/AccountService";
import { createGroupChatRoom, createIndividualChatRoom } from "../../services/ChatRoomService";
import { calculateLastModifiedToNow } from "../../utils/Utils";

export const ConversationAreaComponent = () => {
    const {user} = useContext(AuthContext)
    const { conversationData, activeRoom, isGetConversationData } = useContext(ChatRoomContext)
    const [roomName, setRoomName] = useState('');
    const [ openAddingNewChatRoom, setOpenAddingNewChatRoom ] = useState(false)
    const [ accounts, setAccounts ] = useState([])
    const [addedList, setAddedList] = useState([]);
    const [inputVisible, setInputVisible] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const inputRef = useRef(null);
    const fileInputRef = useRef(null);
    const [avatarFile, setAvatarFile] = useState(null);
    const {Search} = Input
    const [messageApi, contextHolder] = message.useMessage();
  
    useEffect(() => {
        if (inputVisible) {
        inputRef.current?.focus();
        }
    }, [inputVisible]);

    useEffect(() => {
        return () => {
            if (avatarFile !== null) {
                URL.revokeObjectURL(avatarFile.url)
            }
        }
    }, [avatarFile]);

    useEffect(() => {
        GetAllAccounts()
        .then(response => {
            if (response.data.code === 1000) {
                setAccounts(response.data.data)
            }
        })
        .catch(err => {
            setAccounts([])
        })
    }, [])

    const successCreateChatroom = () => {
        messageApi.open({
            type: 'success',
            content: 'Create chat room successfully!',
        });
    };
    const existedChatRoom = () => {
        messageApi.open({
            type: 'warning',
            content: 'This chat room is existed!',
        });
    };

    const handleClose = (removedAccount) => {
        const newAddedList = addedList.filter((account) => account.username !== removedAccount.username);
        setAddedList(newAddedList);
    };

    const showInput = () => {
        setInputVisible(true);
    };

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };
    const handleInputConfirm = () => {
        if (inputValue) {
            GetAccountsByNickname(inputValue)
            .then(response => {
                if (response.data.code === 1000) {
                    setAccounts(response.data.data)
                }
            })
            .catch(err => {
                setAccounts([])
            })
        }
        else {
            GetAllAccounts()
            .then(response => {
                if (response.data.code === 1000) {
                    setAccounts(response.data.data)
                }
            })
            .catch(err => {
                setAccounts([])
            })
        }
        // setInputVisible(false);
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0]
        setAvatarFile({
            url: URL.createObjectURL(file),
            file,
        })
    }

    const handleIconClick = () => {
        if (fileInputRef.current) {
          fileInputRef.current.click();
        }
    };

    const forMap = (account) => (
        <span
        key={"added_" + account.username}
        style={{
            display: 'inline-block',
        }}
        >
        <Tag
            closable
            onClose={(e) => {
            e.preventDefault();
            handleClose(account);
            }}
            style={{padding: '4px 8px', fontSize: '16px', marginBottom: '5px'}}
        >
            <Avatar src={account.avatar} size={36} />
            <span style={{marginLeft: '6px'}}>{account.nickname}</span>
        </Tag>
        </span>
    );
    const tagChild = addedList.map(forMap);
    const tagPlusStyle = {
        borderStyle: 'dashed',
        padding: '5px 10px',
    };

    const showDrawer = () => {
        setOpenAddingNewChatRoom(true);
    };
    const onClose = () => {
        setOpenAddingNewChatRoom(false);
    };

    const addNewChatRoom = () => {
        showDrawer()
    }

    const addToChatRoom = (addedAccount) => {
        setAddedList((prevList) => {
            if (!prevList.some((account) => account.username === addedAccount.username)) {
                return [...prevList, addedAccount];
            }
            return prevList; // Không cập nhật nếu đã tồn tại
        });
    };

    const createNewChatroom = () => {
        // Phòng chat 1vs1
        if (addedList.length === 1) {
            createIndividualChatRoom(user.id, addedList[0].id)
            .then(() => successCreateChatroom())
            .catch(err => {
                if (err.response && err.response.data.code === 1018) {
                    existedChatRoom()
                }
            })
            
            onClose()
        }
        // Phòng cha group
        else if (addedList.length > 1) {
            const memberIds = addedList.map(account => account.id).join('|')
            console.log("Tạo phòng chat group với các thành viên: ", memberIds, roomName, avatarFile.file)

            createGroupChatRoom(user.id, memberIds, roomName, avatarFile !== null ? avatarFile.file : null)
            .then(() => successCreateChatroom())
            .catch(err => {
                if (err.response && err.response.data.code === 1018) {
                    existedChatRoom()
                }
            })

            onClose()
        }
    }

    return (
        <>
            {contextHolder}
            {isGetConversationData ?
                <Flex 
                    style={{ 
                        minWidth: '150px', 
                        width: '25%', 
                        height: 'calc(100vh - 100px)', 
                        overflowY: 'scroll', 
                        padding: '8px 0',
                        position: 'relative',
                        flexGrow: 1
                    }} 
                    vertical>
                    {conversationData.map((notification, index) => (
                        <NotificationDetail
                            key={notification.chatRoomId}
                            notificationId={notification.notificationId}
                            chatRoomId={notification.chatRoomId}
                            avatar={notification.roomAvatar}
                            username={notification.roomName}
                            content={notification.content}
                            time={calculateLastModifiedToNow(notification.lastModifiedDate)}
                            isRead={notification.isRead}
                            isActive={notification.status}
                            isFocus={activeRoom !== null && activeRoom !== undefined ? (notification.chatRoomId === activeRoom.chatRoomId ? true : false) : true}
                        />
                    ))}
                    <Tooltip title='Tìm kiếm bạn bè'>
                        <span style={{
                            padding: '20px',
                            borderRadius: '50%',
                            border: '1px solid blue',
                            position: 'absolute',
                            bottom: 0,
                            left: '40%',
                            backgroundColor: "var(--theme-color)"
                        }}
                            onClick={addNewChatRoom}
                        >
                            <PlusOutlined style={{fontSize: '20px', color: 'var(--body-bg-color)'}} />
                        </span>
                    </Tooltip>
                    <Drawer
                        title="Create a new chatroom"
                        placement={'left'}
                        onClose={onClose}
                        open={openAddingNewChatRoom}
                        key={'AddingNewChatRoomDrawer'}
                        width={'400px'}
                        height={'100vh'}
                    >
                        <div
                            style={{
                            marginBottom: 16,
                            }}
                        >
                            <span>Members: </span>
                            {tagChild}
                        </div>
                        {addedList.length > 1 && (
                            <>
                                <Row gutter={16} style={{display: 'flex', alignItems: 'center'}}>
                                    <Col span={6}><div>RoomName: </div></Col>
                                    <Col span={18}>
                                        <Input 
                                            placeholder="Room name ..." 
                                            size={'middle'} 
                                            width={'100%'} 
                                            value={roomName} // Liên kết state với value của Input
                                            onChange={(e) => setRoomName(e.target.value)} // Cập nhật state khi người dùng nhập
                                        />
                                    </Col>
                                </Row>
                                <Row gutter={16} style={{display: 'flex', alignItems: 'center', margin: '8px 0'}}>
                                    <Col span={6} style={{padding: '0'}}><div>Avatar:</div></Col>
                                    <Col span={18} style={{display: 'flex'}}>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            style={{ display: 'none' }}
                                            onChange={handleFileChange}
                                        />
                                        <Image height={'80px'} src={avatarFile !== null ? avatarFile.url : '/assets/images/default-avatar.jpg'} width={'80px'} style={{borderRadius: '50%', objectFit: 'cover'}}>
                                        </Image>
                                        <button
                                            style={{
                                                background: 'none',
                                                width: '80px',
                                                height: '80px',
                                                borderRadius: '50%',
                                                border: '1px #1677ff solid',
                                                marginLeft: '8px'
                                            }}
                                            type="button"
                                            onClick={handleIconClick}
                                            >
                                            <PlusOutlined />
                                            <div
                                                style={{
                                                marginTop: 8,
                                                }}
                                            >
                                                Upload
                                            </div>
                                        </button>
                                    </Col>
                                </Row>
                            </>
                        )}
                        {inputVisible ? (
                            <Search
                            ref={inputRef}
                            type="text"
                            size={'middle'}
                            style={{
                                width: '100%',
                            }}
                            value={inputValue}
                            onChange={handleInputChange}
                            onBlur={handleInputConfirm}
                            onSearch={handleInputConfirm}
                            onPressEnter={handleInputConfirm}
                            />
                        ) : (
                            <Tag onClick={showInput} style={tagPlusStyle}>
                            <PlusOutlined /> Add member
                            </Tag>
                        )}
                        <List
                            itemLayout="horizontal"
                            dataSource={accounts}
                            renderItem={(item, index) => (
                            <List.Item 
                                key={item.username}
                                onClick={() => addToChatRoom(item)}
                                style={{cursor: 'pointer'}}
                            >
                                <List.Item.Meta
                                style={{alignItems: 'center'}}
                                avatar={<Avatar src={item.avatar} size={40} />}
                                title={item.nickname}
                                description={item.username}
                                />
                            </List.Item>
                            )}
                            style={{marginTop: '1rem', maxHeight: 'calc(100vh - 300px)', overflowY: 'scroll'}}
                        />
                        <Button 
                            style={{display: 'block', margin: '1rem auto 0', backgroundColor: 'var(--theme-color)', color: 'var(--theme-bg-color)', alignSelf: 'center'}}
                            onClick={() => createNewChatroom()}
                        >
                                Create new
                        </Button>
                    </Drawer>
                </Flex> :
                <Skeleton active />}
        </>
    )
}