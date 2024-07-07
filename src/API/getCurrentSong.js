import server from "../Helper/server";

const getCurrentSong = () => {
  //simulating fetch API
  let result = server();
  return result;
};

export default getCurrentSong;