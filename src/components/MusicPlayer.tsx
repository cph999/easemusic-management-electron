import React, { useEffect, useRef, useState } from "react";
import { Progress } from 'antd';
import ReactAudioPlayer from 'react-audio-player';
import "./MusicPlayer.css";
import { StepForwardOutlined, StepBackwardOutlined, PlayCircleOutlined, PauseOutlined } from "@ant-design/icons";

const MusicPlayer = ({ currentSong, onNextSong, onPrevSong }) => {
    const playerRef = useRef(null); // 用于音频播放
    const [playProgress, setPlayProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [playState, setPlayState] = useState(false);

    useEffect(() => {
        const audio = playerRef.current.audioEl.current;
        if (currentSong) {
            audio.pause();
            audio.src = currentSong.url; // 更新音频源
            audio.play(); // 播放新音频
            setPlayProgress(0); // 重置播放进度
            setPlayState(true); // 设置播放状态为播放
            const interval = setInterval(() => {
                if (audio && !isNaN(duration) && duration > 0) {
                    setPlayProgress((audio.currentTime / duration) * 100);
                }
            }, 1000);
            return () => {
                clearInterval(interval);
                if (audio) {
                    audio.pause(); // 清理时暂停音频
                }
            };
        }

    }, [currentSong, duration]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const handleProgressClick = (e) => {
        const audio = playerRef.current.audioEl.current;
        const { clientWidth } = e.target;
        const clickX = e.clientX - e.target.getBoundingClientRect().left;
        const newTime = (clickX / clientWidth) * duration;
        audio.currentTime = newTime; // 设置新的播放时间
    };

    const handlePlay = () => {
        setPlayState(!playState);
        if (playState) {
            playerRef.current.audioEl.current.play();
        } else {
            playerRef.current.audioEl.current.pause();
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <StepBackwardOutlined className="music-player-icon" onClick={onPrevSong} />
                {playState ? (
                    <PauseOutlined className="music-player-icon" onClick={handlePlay} />
                ) : (
                    <PlayCircleOutlined className="music-player-icon" onClick={handlePlay} style={{ color: "#FFB6C1" }} />
                )}
                <StepForwardOutlined className="music-player-icon" onClick={onNextSong} />
            </div>
            <div className="music-player">
                {currentSong && <span style={{ marginRight: "0.5%" }}>{currentSong.title}</span>}
                {duration > 0 && <span style={{ marginRight: "0.5%" }}>{formatTime((playProgress / 100) * duration)}</span>}
                <div onClick={handleProgressClick} style={{ cursor: 'pointer', width: "80%" }}>
                    <Progress strokeLinecap="round" percent={playProgress} status="active" showInfo={false} strokeColor="#FFB6C1" />
                </div>
                {duration > 0 && <span style={{ marginLeft: "0.5%" }}>{formatTime(duration)}</span>}
            </div>

            <ReactAudioPlayer
                ref={playerRef}
                style={{ display: 'none' }}
                onLoadedMetadata={(e) => {
                    const target = e.target;
                    setDuration(target.duration); // 设置持续时间
                }}
                controls
            />
        </div>
    );
}

export default MusicPlayer;
