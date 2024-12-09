import { Avatar, Button, Flex, Image, Input, Skeleton } from "antd"
import Link from "antd/es/typography/Link"
import { ChatRoomContext } from "../../core/ChatRoomProvider"
import { useContext } from "react"

export const DetailAreaComponent = () => {
    const {activeRoom, messages, isGetConversationData } = useContext(ChatRoomContext)
    return (
        isGetConversationData ? (
            activeRoom !== null && activeRoom !== undefined ? 
            <Flex style={{minWidth: '150px', width: '25%'}} justify={'center'}>
                <div className="detail-area">
                    <div className="detail-area-header" style={{textAlign: 'center'}}>
                        <div className="msg-profile group">
                            <Avatar src={activeRoom.roomAvatar} style={{width: '100%', height: '100%'}} />
                        </div>
                        <div className="detail-title">{activeRoom.roomName}</div>
                        {/* <div className="detail-subtitle">Created by Aysenur, 1 May 2020</div> */}
                    </div>
                </div>
            </Flex>
            : <></>
        )
        : <Skeleton active />
    )
}