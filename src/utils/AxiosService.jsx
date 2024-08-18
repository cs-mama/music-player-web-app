import axios from "axios";

let AxiosService = axios.create({
  baseURL: "https://music-player-benew.onrender.com/",
  headers: {
    "Content-Type": "application/json",
  },
});

export default AxiosService;
