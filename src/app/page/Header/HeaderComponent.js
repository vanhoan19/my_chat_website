import {React, useContext} from 'react';
import { Input, Avatar, Image, Flex, Divider, Dropdown, Button } from 'antd';
import { SearchOutlined, SettingOutlined, MoonOutlined } from '@ant-design/icons';
import { AuthContext } from "../../core/AuthProvider";

import axios from 'axios';

export const HeaderComponent = () => {
    const {user, logout} = useContext(AuthContext);
    const logoutOnClick = async () => {
        try {
            await axios.post(`http://localhost:8081/api/v1/account/logout/${user.id}`);
            logout();
        }
        catch (error) {
            console.log("Error logging out: ", error);
        }
    }
    const items = [{
        key: 'logout',
        label: (
            <Button onClick={logoutOnClick}>Log out</Button>
        )
    }]
    return (
        <Flex vertical>
            <Flex vertical={false} justify={'space-between'} style={{padding: '20px', backgroundColor: ''}} >
                <Image width={50} src='/assets/images/logo/manchester.png' preview={false} />
                <Input placeholder="Search..." variant="borderless" style={{marginLeft: '50px', maxWidth: '300px', fontSize: '16px'}} prefix={<SearchOutlined style={{fontSize: '16px', padding: '10px'}} />} />
                <div className="user-settings">
                    <MoonOutlined style={{fontSize: '20px'}} />
                    <SettingOutlined style={{fontSize: '20px'}} />
                    <Dropdown 
                        menu = {{items}}
                        placement='bottomLeft'
                    >
                        <Avatar src={user.avatar} alt={user.nickname} fontSize='50px' />
                    </Dropdown>
                </div>
            </Flex>
            <Divider style={{margin: '0'}} />
        </Flex>
    );
}
