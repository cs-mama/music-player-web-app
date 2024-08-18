import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";

function DefaultLayout({ children }) {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  return (
    <div className="main bg-warning">
      <div className="header d-flex justify-content-between mt-0 p-3 shadow align-items-center bg-dark text-warning">
        <h1
          className="fs-4  fw-bold custom-cursor"
          onClick={() => {
            navigate("/");
          }}
        >
          <b className="logo fst-italic">Rhythm World</b>
        </h1>
        <div className="d-flex align-items-center gap-2">
          <h1 className="fs-4">{user?.name.toUpperCase()}</h1>
          <FontAwesomeIcon
            icon={faRightFromBracket}
            className="fs-4"
            onClick={() => {
              localStorage.removeItem("token");
              window.location.reload();
            }}
          />
        </div>
      </div>
      <div className="content m-3 bg-dark text-secondary">{children}</div>
    </div>
  );
}

export default DefaultLayout;
