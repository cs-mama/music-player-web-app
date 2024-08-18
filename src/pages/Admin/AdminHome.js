import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";

function AdminHome() {
  const [selectedSongForEdit, setSelectedSongForEdit] = React.useState(null);
  const { allSongs, user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if(user)
    {
      if ((user?.isAdmin && !user.isAdmin) || !user?.isAdmin) {
        navigate("/");
      }
    }
  }, [user]);

  return (
    <div className="d-flex flex-column p-2 m-5 bg-dark">
    <div className="d-flex justify-content-between p-2">
    <h1 className="fs-3 text-gray">All Songs</h1>
    <button
      className="text-white bg-warning py-2 px-5"
      onClick={() => {
        navigate("/admin/add-edit-song");
      }}
    >
      Add Song
    </button>
    </div>
    <table className="table table-hover mt-5 mb-5">
    <thead className="w-full">
      <tr>
        <th>Title</th>
        <th>Artist</th>
        <th>Album</th>
        <th>Year</th>
        <th>Duration</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {allSongs.map((song) => (
        <tr key={song.id}>
          <td>{song.title}</td>
          <td>{song.artist}</td>
          <td>{song.album}</td>
          <td>{song.year}</td>
          <td>{song.duration}</td>
          <td>
          <FontAwesomeIcon
                icon={faPenToSquare}
              className=" fs-6 text-gray"
              onClick={() => {
                navigate("/admin/add-edit-song/?id=" + song._id);
              }}
            />
          </td>
        </tr>
      ))}
    </tbody>
  </table>
  </div>

  );
}

export default AdminHome;
