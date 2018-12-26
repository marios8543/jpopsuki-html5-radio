function timeformat(time){   
    var hrs = ~~(time / 3600);
    var mins = ~~((time % 3600) / 60);
    var secs = ~~time % 60;
    var ret = "";
    if(hrs > 0){
        ret+=""+ hrs+":"+(mins<10?"0":"");
    }
    ret+=""+mins+":"+(secs<10?"0":"");
    ret+=""+secs;
    return ret;
}

var recenttracks = [];
var nowPlaying = {
    'title':'',
    'artist':'',
    'album':''
}
var player = document.getElementById("mainPlayer");
player.src = "http://213.239.204.252:8000/stream";
player.onended = function(){
    console.log("finished")
    loadStream();
}
function playpause(){
    $("#play-icon").toggleClass("invisible");
    $("#pause-icon").toggleClass("invisible");
}
player.onplay = function(){ playpause() };
player.onpause = function(){ playpause() };
player.ontimeupdate = function(){
    $(".runing_time").html(`Time elapsed: ${timeformat(player.currentTime)}`);
}

$(document).ready(function(){
    $("#btnPlay").click(function(){
        player.paused ? player.play() : player.pause();
    })
    loadRecent = function loadRecent(){
        $.getJSON("http://jpopsuki.fm:2199/external/rpc.php?m=recenttracks.get&username=jpopsuki",function(data){
            recenttracks = data.data[0];
            for(let i=0;i<recenttracks.length;i++){
                if(i%2==0){
                    $("#songListDom").append(`
                    <div class="title overme" title="${recenttracks[i].artist} - ${recenttracks[i].title}">${recenttracks[i].artist} - ${recenttracks[i].title}</div>
                    `)
                }
                else{
                    $("#songListDom").append(`
                    <div class="title dark overme" title="${recenttracks[i].artist} - ${recenttracks[i].title}">${recenttracks[i].artist} - ${recenttracks[i].title}</div>
                    `) 
                }
            }
        });
    }
    loadStream = function loadStream(){
        loadRecent();
        $.getJSON("http://jpopsuki.fm:2199/external/rpc.php?m=streaminfo.get&username=jpopsuki",function(data){
            nowPlaying.title = data.data[0].track.title;
            nowPlaying.artist = data.data[0].track.artist;
            nowPlaying.album = data.data[0].track.album;
            player.src = data.data[0].tuneinurl;
            $("title").html(`${nowPlaying.artist} - ${nowPlaying.title}`);
            $("#npArtist").html(nowPlaying.artist);
            $("#npTitle").html(nowPlaying.title);
            $("#npAlbum").html(nowPlaying.album);
        });
    }
    function streamfetch(){
        loadStream();
        setTimeout(streamfetch,60000);
    }
    streamfetch();
});