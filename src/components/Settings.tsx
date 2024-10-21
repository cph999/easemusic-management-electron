import React, { useEffect, useState } from 'react';
import instance from '../utils/api';
import { Table, Pagination, Input, Button, Popconfirm, message, Drawer, Form, Input as AntdInput } from 'antd';
import LocalStorageUtil from '../utils/LocalStorageUtil';
import "./Settings.css"

function Settings() {
    const [tasks, setTasks] = useState([]);
    const [pageNum, setPageNum] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState('');
    const [open, setOpen] = useState(false);
    const [form] = Form.useForm();

    const userinfo = LocalStorageUtil.getItem("userinfo");

    const fetchData = async () => {
        try {
            const res = await instance.post("/upSavedMusics", {
                pageNum: pageNum,
                pageSize: pageSize,
                search: search
            });
            setTasks(res.data.datas);
            setTotal(res.data.total);
        } catch (error) {
            message.error('获取数据失败');
        }
    };

    useEffect(() => {
        fetchData();
    }, [pageNum, pageSize, search]);

    const handleDelete = async (id) => {
        try {
            await instance.post('/deleteMusic', { id });
            message.success('歌曲已删除');
            fetchData(); // 刷新数据
        } catch (error) {
            message.error('删除失败');
        }
    };

    const handleAdd = async (values) => {
        try {
            // 在添加时将用户ID添加到请求中
            await instance.post('/add', { ...values, triggerId: userinfo.id });
            message.success('歌曲已添加');
            fetchData(); // 刷新数据
            setOpen(false); // 关闭弹窗
            form.resetFields(); // 重置表单
        } catch (error) {
            message.error('添加失败，可能是网络问题或数据格式错误');
        }
    };

    const columns = [
        {
            title: '封面',
            dataIndex: 'cover',
            render: (text) => <img src={text} alt="cover" style={{ width: 40, height: 40 }} />,
        },
        {
            title: '歌曲标题',
            dataIndex: 'title',
        },
        {
            title: '艺术家',
            dataIndex: 'artist',
        },
        {
            title: '发起人id',
            dataIndex: 'triggerId'
        },
        {
            title: '下载进度',
            dataIndex: 'is_save',
            render: (text) => text === 1 ? <div>已完成</div> : <div>未完成</div>,
        },
        {
            title: '操作',
            render: (text, record) => (
                <span>
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
        <div className='settings-container' style={{ padding: '20px' }}>
            <div className='search-bar'>
                <Input
                    placeholder="搜索任务"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPageNum(1); // 搜索时重置页码
                    }}
                    style={{ marginBottom: '20px', width: '20%' }}
                />

                <Button
                    type="primary"
                    style={{ marginBottom: '20px', marginLeft: "5%" }}
                    onClick={() => setOpen(true)}

                >
                    新增下载任务
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={tasks}
                pagination={false}
                rowKey="id"
            />

            <Pagination
                current={pageNum}
                total={total}
                pageSize={pageSize}
                onChange={(page) => {
                    setPageNum(page);
                }}
                onShowSizeChange={(current, size) => {
                    setPageSize(size);
                    setPageNum(1); // 改变页大小时重置页码
                }}
                showSizeChanger
                style={{ textAlign: 'center', marginTop: '20px' }}
            />

            <Drawer
                title="新增任务"
                placement="right"
                closable={false}
                onClose={() => setOpen(false)}
                open={open}
                width={400}
            >
                <Form form={form} onFinish={handleAdd}>
                    <Form.Item
                        label="歌曲标题"
                        name="title"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 18 }}
                        rules={[{ required: true, message: '请输入歌曲标题' }]}
                    >
                        <AntdInput />
                    </Form.Item>
                    <Form.Item
                        label="艺术家"
                        name="artist"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 18 }}
                        // rules={[{ required: true, message: '请输入艺术家名' }]}
                    >
                        <AntdInput />
                    </Form.Item>
                    <Form.Item
                        label="封面链接"
                        name="cover"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 18 }}
                        // rules={[{ required: true, message: '请输入封面链接' }]}
                    >
                        <AntdInput />
                    </Form.Item>
                    <Form.Item
                        label="发起人ID"
                        name="triggerId"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 18 }}
                    >
                        <AntdInput disabled />
                    </Form.Item>
                    <Form.Item wrapperCol={{ span: 16, offset: 14 }}> {/* 设置按钮的对齐 */}
                        <Button type="primary" htmlType="submit">
                            提交下载任务
                        </Button>
                    </Form.Item>
                </Form>
            </Drawer>

        </div>
    );
}

export default Settings;
