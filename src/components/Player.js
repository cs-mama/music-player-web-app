import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  SetCurrentSong,
  SetCurrentSongIndex,
  SetCurrentTime,
  SetIsPlaying,
} from "../redux/userSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faPause,
  faForwardStep,
  faBackwardStep,
  faVolumeLow,
  faVolumeXmark,
  faShuffle,
} from "@fortawesome/free-solid-svg-icons";

function Player() {
  const [volume, setVolume] = useState(0.5);
  const [shuffleOn, setShuffleOn] = useState(false);
  const dispatch = useDispatch();
  const audioRef = React.createRef();
  const { currentSong, currentSongIndex, allSongs, isPlaying, currentTime } =
    useSelector((state) => state.user);

  const onPlay = () => {
    audioRef.current.play();
    dispatch(SetIsPlaying(true));
  };

  const onPause = () => {
    audioRef.current.pause();
    dispatch(SetIsPlaying(false));
  };

  const onPrev = () => {
    if (currentSongIndex !== 0 && !shuffleOn) {
      dispatch(SetCurrentSongIndex(currentSongIndex - 1));
      dispatch(SetCurrentSong(allSongs[currentSongIndex - 1]));
    } else {
      const randomIndex = Math.floor(Math.random() * allSongs.length);
      dispatch(SetCurrentSongIndex(randomIndex));
      dispatch(SetCurrentSong(allSongs[randomIndex]));
    }
  };
  const onNext = () => {
    if (currentSongIndex !== allSongs.length - 1 && !shuffleOn) {
      dispatch(SetCurrentSongIndex(currentSongIndex + 1));
      dispatch(SetCurrentSong(allSongs[currentSongIndex + 1]));
    } else {
      const randomIndex = Math.floor(Math.random() * allSongs.length);
      dispatch(SetCurrentSongIndex(randomIndex));
      dispatch(SetCurrentSong(allSongs[randomIndex]));
    }
  };

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.pause();
      audioRef.current.load();
      audioRef.current.play();
    }
  }, [currentSong]);

  useEffect(() => {
    if (!currentSong && allSongs.length > 0) {
      dispatch(SetCurrentSong(allSongs[0]));
    }
  }, [allSongs]);

  useEffect(() => {
    if (currentTime) {
      audioRef.current.currentTime = currentTime;
    }
  }, []);

  return (
    <div className="fixed-bottom px-3 py-1 shadow player bg-light w-100 bg-dark text-gray">
      <div className="d-flex justify-content-between align-items-center ">
        <div className="d-flex align-items-center ps-2 song-details">
          <img src="https://play-lh.googleusercontent.com/aCTAc2CKkYvUqhkPJkJ_MLSDrJZeJKXPhNlbbnWOtbAo6OzPyjMY_bQAR09OgjFnxMwY" alt="player-image" className="player-image pe-2"/>
          <div>
            <h1 className="fs-5">{currentSong?.title}</h1>
            <h1 className="text-secondary fs-5">
              {currentSong?.artist} , {currentSong?.album} , {currentSong?.year}
            </h1>
          </div>
        </div>

        <div className="d-flex flex-column align-items-center player-controls">
          <audio
            src={currentSong?.src}
            ref={audioRef}
            onTimeUpdate={(e) => {
              dispatch(SetCurrentTime(e.target.currentTime));
            }}
          ></audio>
          <div className="d-flex gap-5 align-items-center fs-5 text-orange">
            <FontAwesomeIcon
              icon={faBackwardStep}
              onClick={onPrev}
              className="p-1"
            />
            {isPlaying ? (
              <FontAwesomeIcon
                icon={faPause}
                onClick={onPause}
                className="p-1"
              />
            ) : (
              <FontAwesomeIcon
                icon={faPlay}
                onClick={onPlay}
                className="p-1 text-orange"
              />
            )}

            <FontAwesomeIcon
              icon={faForwardStep}
              onClick={onNext}
              className="p-1"
            />
          </div>
          <div className="d-flex gap-3 align-items-center w-100 fs-5">
            <FontAwesomeIcon
              icon={faShuffle}
              className={`${shuffleOn && "text-orange"}`}
              onClick={() => {
                setShuffleOn(!shuffleOn);
              }}
            />
            <h1 className="fs-5">
              {Math.floor(currentTime / 60)}:{Math.floor(currentTime % 60)}
            </h1>
            <input
              type="range"
              className="p-0 w-100"
              min={0}
              max={Number(currentSong?.duration) * 60}
              value={currentTime}
              onChange={(e) => {
                audioRef.current.currentTime = e.target.value;
                dispatch(SetCurrentTime(e.target.value));
              }}
            />
            <h1 className="fs-5">{currentSong?.duration}</h1>
          </div>
        </div>

        <div className="d-flex gap-3 align-items-center volume-controls pe-2">
          <FontAwesomeIcon
            icon={faVolumeXmark}
            onClick={() => {
              setVolume(0);
              audioRef.current.volume = 0;
            }}
          />
          <input
            type="range"
            className="p-0"
            min={0}
            max={1}
            step={0.1}
            value={volume}
            onChange={(e) => {
              audioRef.current.volume = e.target.value;
              setVolume(e.target.value);
            }}
          />
          <FontAwesomeIcon
            icon={faVolumeLow}
            onClick={() => {
              setVolume(1);
              audioRef.current.volume = 1;
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Player;
