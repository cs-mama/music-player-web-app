import React from "react";
import SongsList from "../components/SongsList";
import Playlists from "../components/Playlists";
import Player from "../components/Player";

function Home() {
  return (
    <>
      <div className="row fs-7 home">
        <div className="col-6">
          <SongsList />
        </div>
        <div className="col-6">
          <Playlists />
        </div>
      </div>
      <Player />
    </>
  );
}

export default Home;
