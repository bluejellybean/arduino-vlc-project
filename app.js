'use strict';
let SerialPort = require("serialport").SerialPort;
let serialport = new SerialPort("/dev/ttyACM0");
let spawn = require('child_process').spawn;

let showDirectory = '';


let switchStatus = 'off';
let vlc = '';


let setSwitchStatus = function ( status ) {
	return new Promise(function( resolve, reject ) {

		if ( status === 1 ) {
			switchStatus = 'on';
			resolve( switchStatus );
		} else if ( status === 0 ) {
			switchStatus = 'off';
			resolve( switchStatus );
		} else {
			reject( 'Status value is invalid' );
		}
	});
};

let handleVlc = function ( ) {
	return new Promise(function( resolve, reject ) {
		if ( switchStatus === 'on' && vlc === '' ) {
			//Start Vlc
			vlc = spawn('vlc', ['/media/alex/Movies1/Jelly Tv Shows/King of the Hill/', '--random']);
			resolve( 'Started playing show...' );
		} else if ( switchStatus == 'off' && vlc !== '' ) {
			//Stop Vlc
			vlc.kill();
			vlc = '';
			resolve( 'Killed show...' );
		}
	});
};

serialport.on('open', function( ) {
  serialport.on('data', function( data ) {
 	  setSwitchStatus( data[0] )
      .then(function( resolved ) {
        return handleVlc();
      }).then(function(resolved) {
        console.log( resolved );
      }).catch(function( rejected ) {
      	console.log( rejected );
      });
  
  });
});
