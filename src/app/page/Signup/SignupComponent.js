import React, {useContext, useEffect, useRef, useState} from 'react';
import { Button, Checkbox, Flex, Form, Input, Row, Col, DatePicker, Upload, Image, message } from 'antd';
import { useNavigate, Link } from 'react-router-dom'
import { PlusOutlined } from '@ant-design/icons';
import {AuthContext} from '../../core/AuthProvider';
import { SignUp } from '../../services/AccountService';

export const SignupComponent = () => {
    const navigate = useNavigate();
    const [avatarFile, setAvatarFile] = useState(null)
    const fileInputRef = useRef(null)

    useEffect(() => {
        return () => {
            if (avatarFile !== null) {
                URL.revokeObjectURL(avatarFile.url)
            }
        }
    }, [avatarFile])

    const signupSuccess = () => {
        message.success('Create a new account successfully!')
    }

    const signupExistedUserName = () => {
        message.warning('Username is existed!')
    }

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

    const onFinish = async (values) => {
        const username = values.username;
        const password = values.password;
        const confirmPassword = values.confirmPassword;
        const nickname = values.nickname;
        const dob = values.dateOfBirth.format('YYYY-MM-DD');
        const avatar = avatarFile !== null ? avatarFile.file : null;

        SignUp(username, password, confirmPassword, nickname, dob, avatar)
        .then(response => {
            if (response.status === 200) {
                signupSuccess()
                navigate('/login'); // Chuyển người dùng tới trang home
            }
        })
        .catch(err => {
            if (err.response && err.response.data.code === 1002) {
                signupExistedUserName()
            }
        })
    };

    const onFinishFailed = (errorInfo) => {
      console.log('Signup failed:', errorInfo);
    };

    const formItemLayout = {
    labelCol: {
        xs: {
        span: 24,
        },
        sm: {
        span: 8,
        },
    },
    wrapperCol: {
        xs: {
        span: 24,
        },
        sm: {
        span: 16,
        },
    },
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
                {...formItemLayout}
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
                <h1 style={{textAlign: 'center', color: '#1677ff'}}>SIGN UP</h1>
                <Form.Item
                label="Username: "
                name="username"
                labelAlign={'left'}
                style={{marginBottom: '5px'}}
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
                label="Password"
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

                <Form.Item
                label="Confirm password"
                name="confirmPassword"
                labelAlign={'left'}
                rules={[
                    {
                        required: true,
                        message: 'Please input your confirm password!',
                    },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                            return Promise.resolve();
                        }
                        return Promise.reject(new Error('The new password that you entered do not match!'));
                        },
                    }),
                ]}
                style={{marginBottom: '5px'}}
                >
                <Input.Password 
                    placeholder='Confirm password ...'
                />
                </Form.Item>

                <Form.Item
                label="Nickname: "
                name="nickname"
                labelAlign={'left'}
                style={{marginBottom: '5px'}}
                rules={[
                    {
                        required: true,
                        message: 'Please input your nickname!',
                    },
                ]}
                >
                <Input 
                    placeholder='Nickname ...'
                />
                </Form.Item>

                <Form.Item 
                name="dateOfBirth" 
                label="Date of birth" 
                labelAlign={'left'}
                style={{marginBottom: '5px'}}
                rules={[{
                    required: true,
                    message: 'Please input your date of birth!',
                }]}>
                    <DatePicker />
                </Form.Item>

                <Form.Item 
                    label="Avatar" 
                    valuePropName="fileList" 
                    labelAlign='left' 
                    style={{marginBottom: '10px', height: '80px'}}
                >
                    <Flex vertical={false} gap={'small'}>
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
                                border: '1px #1677ff solid'
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
                    </Flex>
                </Form.Item>

                <Form.Item
                wrapperCol={{
                    span: 24,
                }}
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginBottom: '0'
                }}  
                >
                <Button 
                    type="primary" 
                    htmlType="submit"
                >
                    SIGN UP
                </Button>
                </Form.Item>

                <div style={{textAlign: 'right'}}>Go to <Link to='/login'>Sign in</Link> page</div>
            </Form>
        </Flex>
    )
}