var player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '480',
    width: '640',
    videoId: 'iXAbte4QXKs',
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

function onPlayerReady(event) {
  event.target.playVideo();
  document.getElementById('button').addEventListener('click', playFullscreen);
}

var done = false;
function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.PLAYING && !done) {
    // setTimeout(stopVideo, 3000);
    setTimeout(playFullscreen, 3000);
    done = true;
  }
}

function stopVideo() {
  player.stopVideo();
}


function playFullscreen() {

  console.log('button pressed')
  player.playVideo();

  // fullscreen(player);
  // player.requestFullScreen;
  // player.mozRequestFullScreen;
  var iframe = document.getElementById('player');
  iframe.webkitRequestFullScreen();
}
