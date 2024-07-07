import tracks from "./tracksList";

const server = () => {
  let playlistLength = 0;
  tracks.map(track=>playlistLength += track.length)
  const currentSec = Math.floor(Date.now()/100);
  let timeToPlay = currentSec % playlistLength;
  for(let i=0; i < tracks.length; i++) {
    if(timeToPlay > tracks[i].length) {
      timeToPlay -= tracks[i].length;
    } else {
      const response = {
        track:tracks[i],
        timeToPlay
      };
      return response;
    }
  };
};

export default server;