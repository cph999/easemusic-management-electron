import './Login.css';
import React, { useState } from 'react';
import { Button, Form, Input, Card, message } from 'antd';
import { instance } from "../utils/api";
import { useNavigate } from 'react-router-dom';
import LocalStorageUtil from '../utils/LocalStorageUtil';

const Login = function ({ onLoginSuccess }) {
    const [loginOrRegister, setLoginOrRegister] = useState(true); // true: login, false: register
    const [loginState, setLoginState] = useState(false);
    const navigate = useNavigate();

    const onFinish = async (values) => {
        await handleLogin(values);
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const handleLogin = async (values) => {
        if (loginOrRegister) {
            try {
                const res = await instance.post("/slogin", values);
                console.log(res);
                if (res.data.code === 200) {
                    setLoginState(true);
                    message.success("登录成功");
                    LocalStorageUtil.setItem("userinfo", res.data.data)
                    onLoginSuccess(); // 通知App登录成功
                    navigate('/home/music'); // 重定向到首页
                } else {
                    message.error(res.data.message || "登录失败");
                }
            } catch (error) {
                message.error("请求出错，请稍后再试");
            }
        } else {
            instance.post("/register", values).then(res => {
                if (res.data.code === 200) {
                    setLoginState(false);
                    setLoginOrRegister(true);
                    message.success("注册成功");
                } else {
                    message.error(res.data.message || "注册失败");
                }
            })
        }
    };

    return (
        <div className="App">
            {loginState && <p>Login Success</p>}
            {!loginState && (
                <div className="login-main-box">
                    <div className="login-left-box">
                        <Card
                            style={{
                                width: "45vh",
                                height: "auto",
                                padding: "20px",
                            }}
                        >
                            <div className="login-image">
                                <img
                                    alt="登录icon"
                                    src="https://app102.acapp.acwing.com.cn/media/download.png"
                                    style={{ borderRadius: "50%", width: "45%", height: "45%" }}
                                />
                            </div>
                            <Form
                                name="basic"
                                labelCol={{ span: 8 }}
                                wrapperCol={{ span: 16 }}
                                style={{ width: "80%", marginTop: "10px" }}
                                initialValues={{ remember: true }}
                                onFinish={onFinish}
                                onFinishFailed={onFinishFailed}
                                autoComplete="off"
                            >
                                <Form.Item
                                    label="用户名"
                                    name="username"
                                    rules={[{ required: true, message: '请输入用户名!' }]}
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    label="密码"
                                    name="password"
                                    rules={[{ required: true, message: '请输入密码!' }]}
                                >
                                    <Input.Password />
                                </Form.Item>
                                {!loginOrRegister && (
                                    <Form.Item
                                        label="确认密码"
                                        name="confirmPassword"
                                        rules={[{ required: true, message: '请确认密码!' }]}
                                    >
                                        <Input.Password />
                                    </Form.Item>
                                )}
                                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                                    <Button type="primary" htmlType="submit">
                                        {loginOrRegister ? '登录' : '注册'}
                                    </Button>
                                    <Button
                                        type="link"
                                        onClick={() => setLoginOrRegister(!loginOrRegister)}
                                        style={{ marginLeft: '25%' }}
                                    >
                                        {loginOrRegister ? '没有账号？注册' : '已有账号？登录'}
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Card>
                    </div>
                    <video autoPlay loop muted className="background-video">
                        <source src="/video/videoplayback.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>
            )}
        </div>
    );
};

export default Login;