import { useEffect, useRef, useState } from "react";
import styles from "./App.module.css";

import playSVG from "./assets/images/play-button.svg";
import pauseSVG from "./assets/images/pause-button.svg";
import getCurrentSong from "./API/getCurrentSong";


function App() {
  const [trackDetail, setTrackDetail] = useState(null);
  const [liveLyrics, setLiveLyrics] = useState(null);
  const [timeToPlay, setTimeToPlay] = useState(0);
  const [paused, setPaused] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const [liveLyricTxt, setLiveLyricTxt] = useState("");
  const [lastInterval, setLastInterval] = useState(null);

  const audioRef = useRef(null);
  const progressRef = useRef(null);

  const playHandler = () => {
    setPaused(false);
    const result = getCurrentSong();
    if (result.track) {
      setTrackDetail(result.track);
      setLiveLyrics(result.track.live_lyrics);
      setTimeToPlay(result.timeToPlay);
    } else {
      setPaused(true);
      alert("an error accured!!");
    }
  };

  useEffect(()=>{
    if(audioRef.current && timeToPlay) audioRef.current.currentTime = timeToPlay/10;
  },[timeToPlay])

  useEffect(()=>{
    if(lastInterval) clearInterval(lastInterval);
    const interval = setInterval(() => {
      if(audioRef && progressRef && audioRef.current && progressRef.current && !audioRef.current.paused){
        progressRef.current.style.width = `${audioRef.current.currentTime/audioRef.current.duration*100}%`;
      }

      if(liveLyrics && audioRef && audioRef.current) {
        let condition = true,
          lyricsArray = [...liveLyrics];
        for(let i = 0; condition&&i<lyricsArray.length-1;i++) {
          const curLyr = lyricsArray[i],
            nextLyr = lyricsArray[i+1],
            audioTime = audioRef.current.currentTime
          ;
          if(curLyr.time <= audioTime && nextLyr.time > audioTime) {
            setLiveLyricTxt(curLyr.text);
            condition=false;
          } else if(i === liveLyrics.length) {
            setLiveLyricTxt(nextLyr.text);
          }
        }
      }
    }, 500);
    setLastInterval(interval);
    // eslint-disable-next-line
  },[liveLyrics])

  const pauseHandler = () => {
    setPaused(true);
    setTrackDetail(null);
  };

  const volumeHandler = (e) => {
    const value = e.target.value;
    setVolume(value);
    if(audioRef&&audioRef.current) audioRef.current.volume = value;
  }

  return (
    <div className={styles.App}>
      <h1 className={styles.header}>Online Radio Station</h1>
      {paused ? (
        <div className={styles.starterContainer}>
          <h3>Tap to play</h3>
          <img
            src={playSVG}
            className={styles.playBtn}
            onClick={playHandler}
            alt="|>"
          />
        </div>
      ) : trackDetail ? (
        <div className={styles.player}>
          <audio onEnded={playHandler} ref={audioRef} src={trackDetail.streamlink} autoPlay />
          <div className={styles.coverProgressContainer}>
            <img src={trackDetail.cover} className={styles.coverImage} alt={trackDetail.titleEN} />
            <div>
              <h2 className={styles.songTitle}>{trackDetail.titleEN}</h2>
              <h3>Artist: {trackDetail.artistEN}</h3>
              <div className={styles.progressBar}>
                <div ref={progressRef} style={{width: `${audioRef.current && audioRef.current.currentTime/audioRef.current.duration*100}%`}}/>
              </div>
            </div>
          </div>
          <div className={styles.titleLyricContainer}>
            <img
              src={pauseSVG}
              className={styles.pauseBtn}
              onClick={pauseHandler}
              alt="||"
            />
            <input className={styles.volume} value={volume} onChange={volumeHandler} type="range" max="1" step="0.01"/>
            <div className={styles.lyricContainer}>
              <h3>متن آهنگ</h3>
              <p className={styles.currentLyric}>{liveLyricTxt}</p>
            </div>
          </div>
        </div>
      ) : (
        <h1>loading...</h1>
      )}
    </div>
  );
}

export default App;
