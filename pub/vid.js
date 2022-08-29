// const io = require('socket.io')(server);

// const socket = io('/');
let myvidS
const vidgrid = document.getElementById('vidgrid')
const myvid = document.createElement('video') //adding an html element for video
myvid.muted = true; //initally the video is muted! 

navigator.mediaDevices.getUserMedia({
  video: true,
  audio: false
}).then(stream => {
  myvidS = stream;
  addVidS(myvid, stream);

  peer.on('call', function (call) {
    // Answer the call, providing our mediaStream
    call.answer(stream);
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      addVidS(video, userVideoStream)
    })
  });
  socket.on('user-connected', (userid) => {
    connectNewuser(userid, stream);
  })
})
//prompting the user for permissions!(a promise of Js)

var peer = new Peer(undefined, {
  path: '/peerjs',
  host: '/',
  port: '30000'
});
peer.on('open', id => {
  socket.emit('join-room', ROOM_ID, id);//calls that socket.on func from server.js
})

const connectNewuser = (userid, stream) => {
  console.log("new user connected jeez!", userid)
  //calling the newly connected user!
  const call = peer.call(userid, stream)
  const video = document.createElement('video')
  call.on('stream', userVideoStream => {
    addVidS(video, userVideoStream)
  })

}


const addVidS = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener('loadedmetadata', () => {
    video.play();
  })
  vidgrid.append(video)

} // a func to add a vid stream

const muteUnmute = () => {
  const enabled = myvidS.getAudioTracks()[0].enabled;
  if (enabled) {
    myvidS.getAudioTracks()[0].enabled = false;
    setUnmuteButton();
  } else {
    setMuteButton();
    myvidS.getAudioTracks()[0].enabled = true;
  }
}

const setMuteButton = () => {

  document.querySelector('.main_mute_button').innerHTML = `
  <i class = "fas fa-microphone-slash></i>
  <span>Mute</span>`
    ;
}



const setUnmuteButton=  () => {
  document.querySelector('.main_mute_button').innerHTML = `

      <i class="unmute fas fa-microphone-slash"></i>
      <span>Unmute</span>
    `;
}
const playStop = () => {
  console.log('object')
  let enabled = myVideoStream.getVideoTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    setPlayVideo()
  } else {
    setStopVideo()
    myVideoStream.getVideoTracks()[0].enabled = true;
  }
}

const setStopVideo = () => {
  const html = `
    <i class="fas fa-video"></i>
    <span>Stop Video</span> `
  document.querySelector('.main_video_button').innerHTML = html;
}

const setPlayVideo = () => {
  const html = `
  <i class="stop fas fa-video-slash"></i>
    <span>Play Video</span>
  `
  document.querySelector('.main_video_button').innerHTML = html;
}
