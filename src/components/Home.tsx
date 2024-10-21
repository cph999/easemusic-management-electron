import React from 'react';
import { UserOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import { Menu, Layout } from 'antd';
import { useNavigate, Routes, Route } from 'react-router-dom';
import Music from './Music.tsx';
import User from './User.tsx';
import Settings from './Settings.tsx';
import HomeHeader from './HomeHeader.tsx'
import "./Home.css"

const { Header, Footer, Sider, Content } = Layout;


const contentStyle = {
    textAlign: 'center',
    minHeight: 120,
    lineHeight: '120px',
    color: '#333',
    backgroundColor: '#F7F9FC',
};

const items = [
    {
        key: '/home/music',
        label: '音乐',
        icon: <MailOutlined />,
    },
    {
        key: '/home/user',
        label: '用户',
        icon: <UserOutlined />,
    },
    {
        key: '/home/settings',
        label: '设置',
        icon: <SettingOutlined />,
    },
];

function Home({ handleLogOut }) {
    const navigate = useNavigate();

    const onClick = (e) => {
        navigate(e.key);
    };

    return (
        <Layout className='layout-box'>
            <Header className='home-header' >
                <HomeHeader handleLogOut={handleLogOut} />
            </Header>
            <Layout>
                <Sider width="15%" className='slider-bar-box'>
                    <Menu
                        onClick={onClick}
                        defaultSelectedKeys={['/home/music']}
                        mode="inline"
                        items={items}
                    />
                </Sider>
                <Content style={contentStyle}>
                    <Routes>
                        <Route path="music" element={<Music />} />
                        <Route path="user" element={<User />} />
                        <Route path="settings" element={<Settings />} />
                    </Routes>
                </Content>
            </Layout>
        </Layout>
    );
}

export default Home;
