import React, { useEffect, useState } from 'react';
import './Music.css';
import { List, Pagination, Card, Input, Flex, Button } from 'antd';
import { instance } from "../utils/api";
import { SearchOutlined } from '@ant-design/icons'
import MusicPlayer from "./MusicPlayer.tsx";

function Music() {
    const [pageNum, setPageNum] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);
    const [title, setTitle] = useState('');
    const [artist, setArtist] = useState('');
    const [currentSong, setCurrentSong] = useState(null);
    const [currentSongIndex, setCurrentSongIndex] = useState(-1); // 添加索引状态

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
            // Reset current song index when new data is fetched
            setCurrentSongIndex(-1);
            setCurrentSong(null);
        });
    };

    const onNextSong = () => {
        if (data.length === 0) return; // 如果没有音乐数据，直接返回
        const nextIndex = (currentSongIndex + 1) % data.length;
        setCurrentSong(data[nextIndex]);
        setCurrentSongIndex(nextIndex);
    };

    const onPrevSong = () => {
        if (data.length === 0) return; // 如果没有音乐数据，直接返回
        const prevIndex = (currentSongIndex - 1 + data.length) % data.length;
        setCurrentSong(data[prevIndex]);
        setCurrentSongIndex(prevIndex);
    };

    const playMusic = (item, index) => {
        setCurrentSong(item);
        setCurrentSongIndex(index); // 更新当前播放歌曲索引
    }

    return (
        <div className='music-container'>
            <Flex gap="large">
                <Input
                    placeholder="输入曲名"
                    prefix="曲名:"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={{ flex: '1 1 auto', minWidth: '150px' }}
                />
                <Input
                    placeholder="输入歌手"
                    prefix="歌手:"
                    value={artist}
                    onChange={(e) => setArtist(e.target.value)}
                    style={{ flex: '1 1 auto', minWidth: '150px' }}
                />
                <Button type="primary" icon={<SearchOutlined />} onClick={getMusicDatas}>搜索</Button>
                <Pagination
                    current={pageNum}
                    total={total}
                    align="end"
                    pageSize={pageSize}
                    onChange={(page) => setPageNum(page)}
                    onShowSizeChange={(current, size) => {
                        setPageSize(size);
                        setPageNum(1);
                    }}
                    showSizeChanger
                />
            </Flex>

            <div className='music-list-box'>
                <List
                    grid={{
                        gutter: 16,
                        xs: 3,
                        sm: 4,
                        md: 4,
                        lg: 5,
                        xl: 5,
                        xxl: 5,
                    }}
                    dataSource={data}
                    renderItem={(item, index) => (
                        <List.Item>
                            <Card
                                hoverable
                                style={{ width: "100%", display: 'flex', flexDirection: 'column' }}
                                cover={
                                    <div style={{ height: '0', paddingBottom: '100%', position: 'relative' }}>
                                        <img
                                            alt={item.title}
                                            src={item.cover}
                                            style={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                            }}
                                        />
                                    </div>
                                }
                                onClick={() => playMusic(item, index)} // 点击卡片播放音乐
                            >
                                <Card.Meta
                                    title={item.title}
                                    description={<span>{item.artist}</span>}
                                />
                            </Card>
                        </List.Item>
                    )}
                />

                <div>
                    <MusicPlayer
                        currentSong={currentSong}
                        onNextSong={onNextSong} // 传递下首歌的功能
                        onPrevSong={onPrevSong} // 传递上一首歌的功能
                    />
                </div>
            </div>
        </div>
    );
}

export default Music;
