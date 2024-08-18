// import axios from "axios";
import AxiosService from "../utils/AxiosService";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Player from "../components/Player";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";
import {
  SetSelectedPlaylist,
  SetSelectedPlaylistForEdit,
  SetUser,
} from "../redux/userSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

function CreateEditPlaylist() {
  const dispatch = useDispatch();
  const [name, setName] = React.useState("");
  const [selectedSongs, setSelectedSongs] = React.useState([]);
  const { allSongs, selectedPlaylistForEdit } = useSelector(
    (state) => state.user
  );
  const navigate = useNavigate();
  const selectUnselectSong = (song) => {
    if (selectedSongs.find((s) => s._id === song._id)) {
      setSelectedSongs(selectedSongs.filter((s) => s._id !== song._id));
    } else {
      setSelectedSongs([...selectedSongs, song]);
    }
  };

  const onAdd = async () => {
    if (name.trim().length === 0 || selectedSongs.length === 0) {
      toast.error("Please fill all fields");
    } else {
      try {
        dispatch(ShowLoading());
        const response = await AxiosService.post(
          "/api/songs/add-playlist",
          {
            name,
            songs: selectedSongs,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        dispatch(HideLoading());
        if (response.data.success) {
          toast.success("Playlist created successfully");
          dispatch(SetUser(response.data.data));
          setName("");
          setSelectedSongs([]);
          navigate("/");
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        dispatch(HideLoading());
        toast.error("Something went wrong");
      }
    }
  };

  const onEdit = async () => {
    if (name.trim().length === 0 || selectedSongs.length === 0) {
      toast.error("Please fill all fields");
    } else {
      try {
        dispatch(ShowLoading());
        const response = await AxiosService.post(
          "/api/songs/update-playlist",
          {
            name,
            songs: selectedSongs,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        dispatch(HideLoading());
        if (response.data.success) {
          toast.success("Playlist updated successfully");
          dispatch(SetUser(response.data.data));
          dispatch(SetSelectedPlaylistForEdit(null));
          dispatch(
            SetSelectedPlaylist({
              name: "All Songs",
              songs: allSongs,
            })
          );
          setName("");
          setSelectedSongs([]);
          navigate("/");
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        dispatch(HideLoading());
        toast.error("Something went wrong");
      }
    }
  };

  useEffect(() => {
    if (selectedPlaylistForEdit) {
      setName(selectedPlaylistForEdit.name);
      setSelectedSongs(selectedPlaylistForEdit.songs);
    }
  }, []);

  return (
    <div className="p-5">
      <div className="d-flex align-items-center gap-5 ">
        <FontAwesomeIcon
          icon={faArrowLeft}
          className="fs-3 mt-1"
          onClick={() => {
            navigate("/");
          }}
        />
        <h1 className="fs-3 mt-1">
          {selectedPlaylistForEdit ? "Edit" : "Add"} Playlist
        </h1>
      </div>
      <div className="d-flex justify-content-between gap-3 mt-2">
        <input
          className="rounded w-auto p-2 pe-5"
          type="text"
          placeholder="Playlist Name"
          value={name}
          disabled={selectedPlaylistForEdit}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
      </div>

      <h1 className="my-5 fs-5">Selected Songs - {selectedSongs.length}</h1>

      <div className="d-flex gap-3">
        {allSongs.map((song, index) => {
          const isSelected = selectedSongs.find((s) => s._id === song._id);
          return (
            <div
              className={`p-2 d-flex align-items-center shadow justify-content-between border custom-cursor rounded w-50 ${
                isSelected ? "selected" : "border-gray-300"
              }`}
              onClick={() => selectUnselectSong(song)}
            >
              <div>
                <h1 className="fs-4">{song.title} </h1>
                <h1 className="fs-4">
                  {song.artist} - {song.album} - {song.year}
                </h1>
              </div>
            </div>
          );
        })}
      </div>
      <button
        className="btn btn-success p-2 mt-5"
        onClick={() => {
          if (selectedPlaylistForEdit) {
            onEdit();
          } else {
            onAdd();
          }
        }}
      >
        SAVE
      </button>
      <Player />
    </div>
  );
}

export default CreateEditPlaylist;
