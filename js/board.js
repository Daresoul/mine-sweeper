// Board object
function Board(x, y)
{
  // Længden af boarded i x aksen
  this.x = x;

  // Længden af boarded i y aksen
  this.y = y;

  // Array af hele boarded
  this.board = [];
}

// Laver selve boarded til et 2 dimensionelt array
Board.prototype.createBoard = function ()
{
  // Laver selve boarded
  var board = [];
  for (var i = 0; i < this.x; i++)
  {
    // Laver kollonen af y akserne
    var inner = [];
    for (var j = 0; j < this.y; j++)
    {
      // Laver en ny Mine felt
      var felt = new Mine();

      // Adder den til y aksen
      inner.push(felt);

    }
    // Adder arrayet af y aksen til arrayet af x - aksen
    board.push(inner);
  }

  // returner det nylavede board
  return board;
};

Board.prototype.genBombs = function(bombsInGame)
{
  // Antal bomber allerede fundet
  var bombersFound = 0;

  // Mens bomber funder er mindre end antal bomber der skal være
  while (bombersFound < bombsInGame)
  {
    // Laver 2 random numre
    var ranx = Math.floor(Math.random() * this.x);
    var rany = Math.floor(Math.random() * this.y);

    // Checker om den allerede er brugt
    if(!this.board[ranx][rany].hasbomb)
    {
      // Eller sætter den, den til at være en bombe
      this.board[ranx][rany].hasbomb = true;
      bombersFound++;
    }
  }
};

Board.prototype.getNums = function(x, y)
{
  for (var i = 0; i < this.x; i++)
  {
    for (var j = 0; j < this.y; j++)
    {
      // Checker hvor mange bomber der er rundt om hvert tal
      this.board[i][j].bombs = CheckBombsAround(i, j);
    }
  }
}
