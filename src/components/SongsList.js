import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  SetCurrentSong,
  SetCurrentSongIndex,
  SetSelectedPlaylist,
} from "../redux/userSlice";

function SongsList() {
  const { currentSong, selectedPlaylist, allSongs } = useSelector(
    (state) => state.user
  );
  const [songsToPlay, setSongsToPlay] = React.useState([]);

  const dispatch = useDispatch();
  const [searchKey, setSearchKey] = React.useState("");

  useEffect(() => {
    if (selectedPlaylist) {
      if (
        selectedPlaylist &&
        selectedPlaylist.name === "All Songs" &&
        searchKey !== ""
      ) {
        const tempSongs = [];

        selectedPlaylist.songs.forEach((song) => {
          if (JSON.stringify(song).toLowerCase().includes(searchKey)) {
            tempSongs.push(song);
          }
        });
        console.log(tempSongs);
        setSongsToPlay(tempSongs);
      } else {
        setSongsToPlay(selectedPlaylist?.songs);
      }
    }
  }, [selectedPlaylist, searchKey]);

  return (
    <div className="d-flex flex-column gap-3 shadow p-3 rounded">
      <div className="p-2">
        <input
          type="text"
          placeholder="Song , Artist , Album"
          className="rounded w-100 p-2"
          onFocus={() =>
            dispatch(
              SetSelectedPlaylist({
                name: "All Songs",
                songs: allSongs,
              })
            )
          }
          value={searchKey}
          onChange={(e) => setSearchKey(e.target.value)}
        />
      </div>
      <div className="overflow-auto " style={{ height: "380px" }}>
        {songsToPlay.map((song, index) => {
          const isPlaying = currentSong?._id === song._id;
          return (
            <div
              className={`p-2 fs-6 songlist d-flex align-items-center justify-content-between custom-cursor ${
                isPlaying && "shadow rounded selected fw-bold "
              }`}
              onClick={() => {
                dispatch(SetCurrentSong(song));
                dispatch(SetCurrentSongIndex(index));
              }}
            >
              <div>
                <h1 className="fs-4">{song.title}</h1>
                <h1 className="fs-4">
                  {song.artist} {song.album} {song.year}
                </h1>
              </div>
              <div>
                <h1 className="fs-4">{song.duration}</h1>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SongsList;
