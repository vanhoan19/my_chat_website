import React, {useContext, useState} from 'react';
import axios from 'axios';
import { Button, Checkbox, Flex, Form, Input, Row, Col } from 'antd';
import { useNavigate, Link } from 'react-router-dom'
import {AuthContext} from '../../core/AuthProvider';
import { Login } from '../../services/AccountService';

export const LoginComponent = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const onFinish = async (values) => {
        const username = values.username;
        const password = values.password;

        Login(username, password)
        .then(response => {
            if (response.status === 200) {
                login(response.data.data); // response.data chứa thông tin chi tiết của user
                navigate('/'); // Chuyển người dùng tới trang home
            }
        })
        .catch(error => {
            console.error("Login failed: " + error);
        })
    };

    const onFinishFailed = (errorInfo) => {
      console.log('Failed:', errorInfo);
    };

    return (
        <Flex 
            style={{
                height: '100vh',
                backgroundImage: 'url("https://image.dienthoaivui.com.vn/x,webp,q90/https://dashboard.dienthoaivui.com.vn/uploads/dashboard/editor_upload/hinh-nen-bong-da-14.jpg")',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}
            justify={'center'}
            align={'center'}
        >
            <Form
                name="basic"
                wrapperCol={{
                    span: 24,
                }}
                size={'large'}
                style={{
                    width: '30vw',
                    minWidth: 250,
                    backgroundColor: 'var(--conversation-active)',
                    padding: '10px 20px',
                    borderRadius: '3%',
                    boxShadow: '2px 2px 5px #1677ff'
                }}
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <h1 style={{textAlign: 'center', color: '#1677ff'}}>Sign in</h1>
                <Form.Item
                name="username"
                labelAlign={'left'}
                rules={[
                    {
                        required: true,
                        message: 'Please input your username!',
                    },
                ]}
                >
                <Input 
                    placeholder='Username ...'
                />
                </Form.Item>

                <Form.Item
                name="password"
                labelAlign={'left'}
                rules={[
                    {
                        required: true,
                        message: 'Please input your password!',
                    },
                    {
                        min: 6,
                        message: 'Password length is at least 6 characters'
                    }
                ]}
                style={{marginBottom: '5px'}}
                >
                <Input.Password 
                    placeholder='Password ...'
                />
                </Form.Item>

                <Row gutter={16} style={{marginBottom: '20px', padding: '0 10px'}}>
                    <Col className="gutter-row" span={8}>
                        <Form.Item
                            name="remember"
                            valuePropName="checked"
                            style={{marginBottom: 0}}
                        >
                        <Checkbox>Remember me</Checkbox>
                        </Form.Item>
                    </Col>
                    <Col className="gutter-row" span={16} style={{textAlign: 'right', alignSelf: 'center'}}>
                        <span>Don't have an account <Link to='/sign-up'>Sign up</Link></span>
                    </Col>
                </Row>
                

                <Form.Item
                wrapperCol={{
                    span: 24,
                }}
                style={{
                    display: 'flex',
                    justifyContent: 'center'
                }}  
                >
                <Button 
                    type="primary" 
                    htmlType="submit"
                >
                    Submit
                </Button>
                </Form.Item>
            </Form>
        </Flex>
    );
}