// Min mine Objekt
function Mine(x, y)
{
  // Position ( Bliver ikke brugt )
  this.x = 0;
  this.y = 0;

  // er det en bombe?
  this.isbomb = false;

  // er feltet blevet vendt?
  this.shown = false;

  // Hvor mange bomber ligger der rundt om?
  this.bombs;

  // Er den blevet flagged?
  this.flag = false;
}

Mine.prototype.reveal = function(x, y)
{
  // Sætter den til at blive vist
  this.shown = true;
  if(this.flag)
  {
    this.toggleFlag();
  }

  // Hvis der ikke er nogen bomber rundt om
  if( this.bombs == 0)
  {
    // Flood it!
    this.floodFill(x, y);
  }
};

Mine.prototype.floodFill = function(x, y)
{
  // Checker alle felter rundt om og sætter reveal igang hose dem (recursive!)

  // de 3 øvre felter
  if((x - 1) >= 0 && (y - 1) >= 0)
  {
    if(!board.board[x-1][y-1].hasbomb && !board.board[x-1][y-1].shown)  board.board[x-1][y-1].reveal(x-1, y-1);
  }

  if(x >= 0 && (y - 1) >= 0)
  {
    if(!board.board[x][y-1].hasbomb && !board.board[x][y-1].shown) board.board[x][y-1].reveal(x, y-1);
  }

  if( (x + 1) < board.x && (y - 1) >= 0)
  {
    if(!board.board[x+1][y-1].hasbomb && !board.board[x+1][y-1].shown) board.board[x+1][y-1].reveal(x+1, y-1);
  }


  // 2 midterste felter
  if((x - 1 ) >= 0)
  {
    if(!board.board[x-1][y].hasbomb && !board.board[x-1][y].shown) board.board[x-1][y].reveal(x-1, y);
  }

  if( (x + 1) < board.x)
  {
    if(!board.board[x+1][y].hasbomb && !board.board[x+1][y].shown) board.board[x+1][y].reveal(x+1, y);
  }


  // 3 nederste felter
  if( (x - 1) >= 0 && (y + 1) < board.y )
  {
    if(!board.board[x-1][y+1].hasbomb && !board.board[x-1][y+1].shown) board.board[x-1][y+1].reveal(x-1, y+1);
  }

  if((y + 1) < board.y)
  {
    if(!board.board[x][y+1].hasbomb && !board.board[x][y+1].shown) board.board[x][y+1].reveal(x, y+1);
  }

  if((x + 1) < board.x && (y + 1) < board.y)
  {
    if(!board.board[x+1][y+1].hasbomb && !board.board[x+1][y+1].shown) board.board[x+1][y+1].reveal(x+1, y+1);
  }
}

Mine.prototype.toggleFlag = function()
{
    // Toggler flaget ( Hvis true bliver false || hvis false bliver true)
    this.flag = !this.flag;
};
