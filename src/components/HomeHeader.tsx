import React from 'react';
import LocalStorageUtil from '../utils/LocalStorageUtil';
import { Avatar, Button, Tooltip } from 'antd';
import { LoginOutlined } from '@ant-design/icons';

import './HomeHeader.css';
function HomeHeader({ handleLogOut }) {
    const userinfo = LocalStorageUtil.getItem('userinfo');

    return (
        <div className='home-header-box'>
            <span>{userinfo.nickname}</span>
            <Avatar shape="circle" size={50} src={userinfo.cover} style={{ marginLeft: "10px" }} />
            <Button type="primary" icon={<LoginOutlined />} style={{ marginLeft: "10px" }} onClick={() => { LocalStorageUtil.removeItem("userinfo"); handleLogOut() }} size='small'>注销</Button>
        </div >

    );
}

export default HomeHeader;