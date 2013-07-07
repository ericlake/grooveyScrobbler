var grooveyRunning = false;
var fs = null;
var grooveyFileName = 'grooveyTrack.json';

$(document).ready(
                  function() {
  //Init file system
  window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;

  // Initiate filesystem on page load.
  if (window.requestFileSystem) {
    FSInit();
  }
  //Bind to node insertion for our event
  jQuery('#now-playing-metadata').bind('DOMNodeInserted', grooveyEventHandler)

  console.log("Groovey Meta Getta Loaded!");
});

function grooveyEventHandler(e){

  if(!grooveyRunning){
    grooveyRunning = true;
    setTimeout(grooveyGetTrackMeta, 3000);
  }
}

function grooveyGetTrackMeta(){
  meta = $('#now-playing-metadata').find('.now-playing-link.song-link.song, .now-playing-link.artist')
  console.log
  for(i=0; i<=meta.length; i++){
    if($(meta[i]).hasClass('song')){
      songName = $(meta[i]).attr('title');
    }
    else if($(meta[i]).hasClass('artist')){
      songArtist = $(meta[i]).attr('title');
    }
    }
  grooveySaveJsonLocal('{"grooveyJson":{"artist":"'+songArtist+'","title":"'+songName+'"}}')
  grooveyRunning = false;
  // TODO: Save groovey metadata
}

function grooveySaveJsonLocal(string){
    FSGetFile(string)
}

//////////////// FS Specific functions

function FSErrorHandler(e) {
  var msg = '';
  switch (e.code) {
    case FileError.QUOTA_EXCEEDED_ERR:
      msg = 'QUOTA_EXCEEDED_ERR';
      break;
    case FileError.NOT_FOUND_ERR:
      msg = 'NOT_FOUND_ERR';
      break;
    case FileError.SECURITY_ERR:
      msg = 'SECURITY_ERR';
      break;
    case FileError.INVALID_MODIFICATION_ERR:
      msg = 'INVALID_MODIFICATION_ERR';
      break;
    case FileError.INVALID_STATE_ERR:
      msg = 'INVALID_STATE_ERR';
      break;
    default:
      msg = 'Unknown Error';
      break;
  };
  console.log('Error: ' + msg);
}

function FSInit() {
  window.requestFileSystem(window.TEMPORARY, 1024*1024, function(filesystem) {
    fs = filesystem;

  }, FSErrorHandler);
}

function FSGetFile(data) {
  fs.root.getFile(grooveyFileName, {create: true}, function(fileEntry){

    // Create a FileWriter object for our FileEntry
    fileEntry.createWriter(function(fileWriter) {
      var truncated = false;
      fileWriter.onwriteend = function(e) {
        if(!truncated){
          this.truncate(this.position);
          truncated = true;
          return; // truncate the file, return and log write completed
        }
        console.log('Write completed.');
      };

      fileWriter.onerror = function(e) {
        console.log('Write failed: ' + e.toString());
      };

      var blob = new Blob(new Array(data), {type: 'application/json'});
      fileWriter.write(blob);

    }, FSErrorHandler)}, FSErrorHandler);

}

/* Dir list
 *    var dirReader = fs.root.createReader();
    dirReader.readEntries(function(entries) {
      for (var i = 0, entry; entry = entries[i]; ++i) {
        if (entry.isDirectory) {
          entry.removeRecursively(function() {}, errorHandler);
        } else {
          entry.remove(function() {}, errorHandler);
        }
      }
      filelist.innerHTML = 'Directory emptied.';
    }, errorHandler);
    */
