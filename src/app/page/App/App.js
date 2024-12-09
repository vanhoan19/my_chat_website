import React from 'react';
import { Flex, Layout } from 'antd';
import {HeaderComponent} from '../Header/HeaderComponent';
import {ConversationAreaComponent} from '../ConversationArea/ConversationArea';
import {ChatAreaComponent} from '../ChatArea/ChatAreaComponent';
import {DetailAreaComponent} from '../DetailArea/DetailAreaComponent';
import { useNavigate } from 'react-router-dom';
import { ChatRoomContext, ChatRoomProvider } from "../../core/ChatRoomProvider";
import { AuthContext } from "../../core/AuthProvider";
import { useContext, useEffect } from "react";
import axios from 'axios';

const { Content } = Layout;

export const App = () => {
    const {user} = useContext(AuthContext)

    return (
        <Layout className="app">
            <HeaderComponent />
            <ChatRoomProvider>
                <Flex vertical={false} >
                    <ConversationAreaComponent />
                    <ChatAreaComponent />   
                    <DetailAreaComponent />
                </Flex>
            </ChatRoomProvider>
        </Layout>
    );
}