var board;

// Størrelsen af selve en celle
var squireSize = 50;

// Offset ekstra størrelse til canvaset
var offset = squireSize;

// Størrelsen af banen i x aksen
var mapsizeX;

// Størrelsen af banen i y aksen
var mapsizeY;

// Antal bomber der skal genereres
var bombgen;


// Setup sker først!
function setup() {
	//Fjerner lige wintexten
	$( "#wintext" ).hide();

	// Laver et nyt board
	board = new Board( $( "#x" ).val(), $( "#y" ).val() );

	// Laver canvas størrelse udfra det board
	mapsizeX = ( offset * 2 ) + squireSize * board.x;
	mapsizeY = ( offset * 2 ) + squireSize * board.y;

	// Laver canvaset
	createCanvas( mapsizeX, mapsizeY );

	// Sætter canvas baggrund til at være 200?
	background( 200 );

	// Kalder funktionen i board objektet til at lave selve boarded
	board.board = board.createBoard();


	// Cheker på forskellige værdier til at finde ud af hvor mange bomber der skal være med
	if ( $( "#bombs" ).val() == "0" ) {
		bombgen = Math.floor( board.x * board.y / 7 );
	} else {
		console.log( board.x * board.y );
		if ( parseInt( $( "#bombs" ).val() ) >= board.x * board.y ) {
			bombgen = Math.floor( board.x * board.y / 7 );
		} else {
			bombgen = parseInt( $( "#bombs" ).val() );
		}
	}

	// Genere bomberne
	board.genBombs( bombgen );
	// Checker hvert felt for antal bomber rundt om
	board.getNums();

	// Skriver nogle ting ud
	$( "#gridx" ).text( board.x + "" );
	$( "#gridy" ).text( board.y + "" );
	$( "#bomber" ).text( bombgen );

	// Sender bare lige boarded med??
	console.log( board.board );
}

function draw() {
	for ( var i = 0; i < board.board.length; i++ ) {
		for ( var j = 0; j < board.board[ i ].length; j++ ) {
			textSize( 12 );
			if ( board.board[ i ][ j ].shown ) {
				if ( board.board[ i ][ j ].hasbomb ) {
					fill( 0, 0, 0, 1 );
					stroke( 0, 0, 0 );
					rect( offset + ( i * squireSize ), offset + ( j * squireSize ), squireSize, squireSize );
				} else {
					fill( 204, 101, 192, 127 );
					stroke( 127, 63, 120 );
					rect( offset + ( i * squireSize ), offset + ( j * squireSize ), squireSize, squireSize );
					if ( board.board[ i ][ j ].bombs > 0 ) {
						stroke( 255, 255, 255 );
						fill( 255, 255, 255, 255 );
						text( board.board[ i ][ j ].bombs, offset + ( i * squireSize ) + ( squireSize / 2 ), offset + ( j * squireSize ) + ( squireSize / 2 ) );
					}
				}

			} else {
				fill( 255, 255, 255, 255 );
				stroke( 0, 0, 0 );
				rect( offset + ( i * squireSize ), offset + ( j * squireSize ), squireSize, squireSize );
			}

			if ( board.board[ i ][ j ].flag ) {
				fill( 255, 0, 0 );
				stroke( 178, 34, 34 );
				triangle( offset + ( squireSize * i ), offset + ( ( squireSize / 4 ) + squireSize * j ), offset + ( ( squireSize / 2 ) + squireSize * i ), offset + ( ( squireSize / 2 ) + squireSize * j ), offset + ( ( squireSize / 2 ) + squireSize * i ), offset + ( squireSize * j ) );
				fill( 78, 91, 49 );
				stroke( 0, 0, 0 );
				rect( offset + ( i * squireSize ) + ( squireSize / 2 ) - 1, offset + ( j * squireSize ), 1, squireSize - 5 );
				//rect(offset + (i * squireSize) + (squireSize / 4), offset + (j * squireSize) + (squireSize / 4), squireSize/2, squireSize/2);
			}

      if(checkWinCondition())
      {
        WinGameShow();
      }
		}
	}
}

$( document ).ready( function () {
	var ctrlPressed = false;
	$( window ).keydown( function ( evt ) {
		if ( evt.which == 17 ) { // ctrl
			ctrlPressed = true;
		}
	} ).keyup( function ( evt ) {
		if ( evt.which == 17 ) { // ctrl
			ctrlPressed = false;
		}
	} );

	$( "#defaultCanvas0" ).mousedown( function ( e ) {
		e.preventDefault();
		console.log( "evt: " + e.which );

		if ( e.which === 1 && ctrlPressed ) {
			flag( e.offsetX, e.offsetY );
		} else if ( e.which === 1 ) {
			choose( e.offsetX, e.offsetY );
		}
	} );


	$( "#reset" ).click( function () {
		console.log( "yes" );
		setup();
	} );
} );

function flag( x, y ) {
	// Checker om den er inde i canvas
	if ( x < mapsizeX && y < mapsizeY && x > 0 && y > 0 ) {
		if ( x > offset && y > offset && x < ( mapsizeX - offset ) && y < ( mapsizeY - offset ) ) {
			var newY = Math.floor( y / squireSize ) - 1;
			var newX = Math.floor( x / squireSize ) - 1;
			if ( !board.board[ newX ][ newY ].shown ) {
				board.board[ newX ][ newY ].toggleFlag();
			}
		} else {
			console.log( "Inden for canvas men i offsettet" );
		}
	} else {
		console.log( "Helt uden for canvas makker!" )
	}
}

function choose( x, y ) {
	// Checker om den er inde i canvas
	if ( x < mapsizeX && y < mapsizeY && x > 0 && y > 0 ) {
		if ( x > offset && y > offset && x < ( mapsizeX - offset ) && y < ( mapsizeY - offset ) ) {
			var newY = Math.floor( y / squireSize ) - 1;
			var newX = Math.floor( x / squireSize ) - 1;
			if ( !board.board[ newX ][ newY ].flag ) {
				board.board[ newX ][ newY ].reveal( newX, newY );
				console.log( "Is won? " + checkWinCondition() );
				if ( checkWinCondition() ) {
					endGame( false );
				} else if ( board.board[ newX ][ newY ].hasbomb == true ) {
					endGame( true );
				} else {
					console.log( "( " + newX + ", " + newY + ")" );
					return board.board[ newX ][ newY ];
				}
			}
		} else {
			console.log( "Inden for canvas men i offsettet" );
		}
	} else {
		console.log( "Helt uden for canvas makker!" )
	}
}

function checkWinCondition() {
	for ( var i = 0; i < board.x; i++ ) {
		for ( var j = 0; j < board.y; j++ ) {
			if ( !board.board[ i ][ j ].shown && !board.board[ i ][ j ].hasbomb ) {
				return false;
			}
		}
	}
	return true;
}

function CheckBombsAround( x, y ) {
	var bombs = 0;


	if ( ( x - 1 ) >= 0 && ( y - 1 ) >= 0 ) //typeof board.board[x-1][y-1] !== 'undefined' && board.board[x-1][y-1] !== null)
	{
		if ( board.board[ x - 1 ][ y - 1 ].hasbomb ) bombs++;
	}

	if ( x >= 0 && ( y - 1 ) >= 0 ) //typeof board.board[x][y-1] !== 'undefined' && board.board[x][y-1] !== null)
	{
		if ( board.board[ x ][ y - 1 ].hasbomb ) bombs++;
	}

	if ( ( x + 1 ) < board.x && ( y - 1 ) >= 0 ) //typeof board.board[x+1][y-1] !== 'undefined' && board.board[x+1][y-1] !== null)
	{
		if ( board.board[ x + 1 ][ y - 1 ].hasbomb ) bombs++;
	}



	if ( ( x - 1 ) >= 0 ) //typeof board.board[x-1][y] !== 'undefined' && board.board[x-1][y] !== null)
	{
		if ( board.board[ x - 1 ][ y ].hasbomb ) bombs++;
	}

	if ( ( x + 1 ) < board.x ) //typeof board.board[x+1][y] !== 'undefined' && board.board[x+1][y] !== null)
	{
		if ( board.board[ x + 1 ][ y ].hasbomb ) bombs++;
	}


	if ( ( x - 1 ) >= 0 && ( y + 1 ) < board.y ) //typeof board.board[x-1][y+1] !== 'undefined' && board.board[x-1][y+1] !== null)
	{
		if ( board.board[ x - 1 ][ y + 1 ].hasbomb ) bombs++;
	}

	if ( ( y + 1 ) < board.y ) //typeof board.board[x][y+1] !== 'undefined' && board.board[x][y+1] !== null)
	{
		if ( board.board[ x ][ y + 1 ].hasbomb ) bombs++;
	}

	if ( ( x + 1 ) < board.x && ( y + 1 ) < board.y ) //typeof board.board[x+1][y+1] !== 'undefined' && board.board[x+1][y+1] !== null)
	{
		if ( board.board[ x + 1 ][ y + 1 ].hasbomb ) bombs++;
	}

	/*
	  // Øverste 3 linjer
	  if(board.board[x-1][y-1].hasbomb) bombs++;
	  if(board.board[x][y-1].hasbomb) bombs++;
	  if(board.board[x+1][y-1].hasbomb) bombs++;

	  // 2 miderste linjer
	  if(board.board[x-1][y].hasbomb) bombs++;
	  if(board.board[x+1][y].hasbomb) bombs++;

	  // 3 bund linjer
	  if(board.board[x-1][y+1].hasbomb) bombs++;
	  if(board.board[x][y+1].hasbomb) bombs++;
	  if(board.board[x+1][y+1].hasbomb) bombs++;*/

	return bombs;

}

function endGame( cond ) {
	if ( cond ) {
		for ( var i = 0; i < board.x; i++ ) {
			for ( var j = 0; j < board.y; j++ ) {
				board.board[ i ][ j ].shown = true;
			}
		}
	} else {
		console.log( "Yes call show" );
		WinGameShow();
	}
}


function WinGameShow() {
	textAlign( CENTER );
	textSize( 60 );
  fill(0, 255, 0);
	text( "You WON!", width / 2, height / 2 );
}
