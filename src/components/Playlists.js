import AxiosService from "../utils/AxiosService";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";

import {
  SetSelectedPlaylist,
  SetSelectedPlaylistForEdit,
  SetUser,
} from "../redux/userSlice";

function Playlists() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, allSongs, selectedPlaylist } = useSelector(
    (state) => state.user
  );
  const allPlylists = [
    {
      name: "All Songs",
      songs: allSongs,
    },
    ...user.playlists,
  ];

  const onDelete = async (name) => {
    try {
      dispatch(ShowLoading());
      const response = await AxiosService.post(
        "/api/songs/delete-playlist",
        {
          name,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(HideLoading());
      if (response.data.success) {
        toast.success("Playlist deleted successfully");
        dispatch(
          SetSelectedPlaylist({
            name: "All Songs",
            songs: allSongs,
          })
        );
        dispatch(SetUser(response.data.data));
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    if (!selectedPlaylist && allSongs.length > 0) {
      dispatch(SetSelectedPlaylist(allPlylists[0]));
    }
  }, [selectedPlaylist, allSongs]);

  return (
    <div className=" shadow py-5 px-3 rounded">
      <div className="d-flex justify-content-between w-100 ">
        <h1 className="fs-4">Your Playlists</h1>
        <h1
          className="underline custom-cursor fs-6 btn btn-success"
          onClick={() => {
            navigate("/create-edit-playlist");
          }}
        >
          Create Playlist
        </h1>
      </div>

      <div className="d-flex justify-content-between mt-5">
        {allPlylists?.map((playlist, index) => {
          const isSelected = playlist?.name === selectedPlaylist?.name;
          return (
            <div
              className={`d-flex flex-column gap-1 shadow p-2 custom-cursor w-50 ${
                isSelected && "selected rounded"
              }`}
              onClick={() => {
                dispatch(SetSelectedPlaylist(playlist));
              }}
            >
              <h1 className="fs-5">{playlist?.name}</h1>
              <h1 className="fs-5">{playlist?.songs?.length} Songs</h1>
              <hr />
              <div className="d-flex gap-3 justify-content-between">
                <FontAwesomeIcon
                  icon={faTrash}
                  className="text-danger"
                  onClick={() => {
                    onDelete(playlist.name);
                  }}
                />

                <FontAwesomeIcon
                  icon={faPenToSquare}
                  className="text-success"
                  onClick={() => {
                    dispatch(SetSelectedPlaylistForEdit(playlist));
                    navigate("/create-edit-playlist");
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Playlists;
