import React, { useEffect, useState } from 'react';
import instance from '../utils/api';
import { Table, Pagination, Input, Button, Popconfirm, message, Drawer, Form, Input as AntInput } from 'antd';

function User() {
    const [users, setUsers] = useState([]);
    const [pageNum, setPageNum] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [search, setSearch] = useState('');
    const [total, setTotal] = useState(0);
    const [open, setOpen] = useState(false);
    const [editUser, setEditUser] = useState({});
    const [form] = Form.useForm();

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
        form.resetFields(); // 关闭时重置表单
    };

    const fetchData = async () => {
        const res = await instance.post('/getFriendsList', {
            pageNum: pageNum,
            pageSize: pageSize,
            search: search
        });
        setUsers(res.data.datas);
        setTotal(res.data.total);
    };

    useEffect(() => {
        fetchData();
    }, [pageNum, pageSize, search]);

    const handleDelete = async (id) => {
        try {
            await instance.post('/deleteUser', { id });
            message.success('用户已删除');
            fetchData();
        } catch (error) {
            message.error('删除失败');
        }
    };

    const handleEdit = (record) => {
        setEditUser(record);
        form.setFieldsValue(record); // 将用户信息填入表单
        showDrawer();
    };

    const handleUpdate = async (values) => {
        try {
            await instance.post('/updateUser', { ...editUser, ...values });
            message.success('用户信息已更新');
            fetchData();
            onClose();
        } catch (error) {
            message.error('更新失败');
        }
    };

    const columns = [
        {
            title: '头像',
            dataIndex: 'cover',
            render: (text) => <img src={text} alt="avatar" style={{ width: 40, height: 40, borderRadius: '50%' }} />,
        },
        {
            title: '昵称',
            dataIndex: 'nickname',
        },
        {
            title: '用户名',
            dataIndex: 'username',
        },
        {
            title: '年龄',
            dataIndex: 'age',
        },
        {
            title: '电话',
            dataIndex: 'phone',
        },
        {
            title: '地址',
            dataIndex: 'address',
        },
        {
            title: '超级管理员',
            dataIndex: 'isSuper',
            render: (isS) => <div>{isS ? '是' : '否'}</div>,
        },
        {
            title: '操作',
            render: (text, record) => (
                <span>
                    <Button type="link" onClick={() => handleEdit(record)}>编辑</Button>
                    <Popconfirm
                        title="确定要删除吗?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="是"
                        cancelText="否"
                    >
                        <Button type="link" danger>删除</Button>
                    </Popconfirm>
                </span>
            ),
        },
    ];

    return (
        <div className='user-container' style={{ padding: '20px' }}>
            <Input
                placeholder="搜索用户"
                value={search}
                onChange={(e) => {
                    setSearch(e.target.value);
                    setPageNum(1); // 搜索时重置页码
                }}
                style={{ marginBottom: '20px' }}
            />

            <Table
                columns={columns}
                dataSource={users}
                pagination={false}
                rowKey="id"
            />

            <Drawer title="编辑用户" onClose={onClose} open={open}>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleUpdate}
                >
                    <Form.Item name="nickname" label="昵称" rules={[{ required: true, message: '请输入昵称' }]}>
                        <AntInput />
                    </Form.Item>
                    <Form.Item name="username" label="用户名" rules={[{ required: true, message: '请输入用户名' }]}>
                        <AntInput />
                    </Form.Item>
                    <Form.Item name="age" label="年龄" rules={[{ required: true, message: '请输入年龄' }]}>
                        <AntInput type="number" />
                    </Form.Item>
                    <Form.Item name="phone" label="电话" rules={[{ required: true, message: '请输入电话' }]}>
                        <AntInput />
                    </Form.Item>
                    <Form.Item name="address" label="地址">
                        <AntInput.TextArea />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            修改
                        </Button>
                    </Form.Item>
                </Form>
            </Drawer>

            <Pagination
                current={pageNum}
                total={total}
                pageSize={pageSize}
                onChange={(page) => {
                    setPageNum(page);
                }}
                onShowSizeChange={(current, size) => {
                    setPageSize(size);
                    setPageNum(1);
                }}
                showSizeChanger
                style={{ textAlign: 'center', marginTop: '20px' }}
            />
        </div>
    );
}

export default User;
