import React, { useEffect, useState, useRef } from 'react';
import './Music.css';
import { List, Pagination, Card, Input, Flex, Button } from 'antd';
import { instance } from "../utils/api";
import { SearchOutlined } from '@ant-design/icons'
function Music() {
    const [pageNum, setPageNum] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);
    const audioRef = useRef(null); // 用于音频播放
    const [title, setTitle] = useState('');
    const [artist, setArtist] = useState('');

    useEffect(() => {
        getMusicDatas();
    }, [pageNum, pageSize]);

    const getMusicDatas = async () => {
        instance.post('/getMusicList', {
            pageNum: pageNum,
            pageSize: pageSize,
            title: title,
            artist: artist
        }).then(res => {
            setData(res.data.datas);
            setTotal(res.data.total);
        });
    };

    const playMusic = (url) => {
        if (audioRef.current) {
            audioRef.current.src = url;
            audioRef.current.play();
        }
    }
    return (
        <div className='music-container'>
            <div className="music-search-box">
                <Flex gap="large" >
                    <Input
                        placeholder="输入曲名"
                        prefix="曲名:"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <Input placeholder="输入歌手" prefix="歌手:" value={artist} onChange={(e) => setArtist(e.target.value)} />
                    <Button type="primary" icon={<SearchOutlined />} onClick={() => { getMusicDatas() }}>搜索</Button>
                    {/* <Button type="primary" icon={<SearchOutlined />} onClick={() => { getMusicDatas() }}></Button> */}

                </Flex>

            </div>
            <div className='music-list-box'>
                <List
                    grid={{ gutter: 16, column: 5 }}
                    dataSource={data}
                    renderItem={(item) => (
                        <List.Item>
                            <Card
                                hoverable
                                style={{ width: "100%" }} // 设置卡片宽度
                                cover={<img alt={item.title} src={item.cover} style={{ height: "10%", objectFit: 'cover' }} />}
                                onClick={() => playMusic(item.url)} // 点击卡片播放音乐
                            >
                                <Card.Meta
                                    title={item.title}
                                    description={<span>{item.artist}</span>}
                                />
                            </Card>
                        </List.Item>
                    )}
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
                        setPageNum(1);
                    }}
                    showSizeChanger
                />
            </div>
            <audio ref={audioRef} style={{ display: 'none' }} controls />
        </div>
    );
}

export default Music;
