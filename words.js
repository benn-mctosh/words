  // test seed = 'PLAYER_-0-PLAYER_-0-110-HeLLQ-110'; 
  // add options to pass and play (by changing play button - current task)
  // add encrypter for hands
  // generate email and mailto link
  // low-priority: fix bug where attaching a blank on a blank is invalid
  let params = new URLSearchParams(location.search);
  var seed = params.get('seed')
  if (seed == null) {
    seed = '-0--0-225';
  }
  const p1name = params.get('p1')
  const p2name = params.get('p2')
  // when encrypted, 'PLAYER_' should read 'jvobAY'
  const board = document.querySelector(".gameBoard");
  // const overlay = document.querySelector(".gameTiles")
  
  /**********************
  
  COLORS & STYLES & GEOMETRY
  
  **********************/  
  /* const offsetTop = 50;
  const offsetLeft = 50;
  board.style.position = "absolute";
  board.style.top = "50px";
  board.style.left = "50px"; */
  const width = (board.width);
  const height = (board.height);  
  const bkgdCol = "rgb(255, 255, 255)";
  const transparent = "rgba(1, 1, 1, 1)";
  const tileCol = "rgb(255, 235, 200)";
  const newTileCol = "rgb(240, 200, 80)";
  const selectedTileCol = "rgb(150, 125, 25)";
  const dlCol = "rgb(100, 0, 150)";
  const tlCol = "rgb(150, 0, 100)";
  const dwCol = "rgb(25, 25, 170)";
  const twCol = "rgb(25, 100, 100)";
  const blankCol = "rgb(150, 0, 0)";
  const bonusCol = "rgb(255, 255, 255)";
  const charCol = "rgb(0, 0, 0)";
  const lineCol = "rgb(204, 204, 170)";
  const rackCol = "rgb(200, 150, 50)"
  const tileWidth = 40;
  const tileHeight = 40;
  const tileFont = "38px courier";
  const valueFont = "18px arial";
  const bonusFont = "20px arial";
  const cXpad = 5;
  const cYpad = 30;
  const vX1pad = 27;
  const vX2pad = 20;
  const vYpad = 15;
  const bXpad = 5;
  const bYpad = 28;
  const boardTop = 0;
  const boardLeft = 0;
  
  var currTileIndex = -1;
  var currCellIndex = -1;
  
  /**********************
  
  HELPER FUNCTIONS
  
  **********************/
  
  // ok, we need to write our own sample function?
  function sample(arr, N) {
    drawn = []
    for (let i = 0; i < N; i++) {
    alen = arr.length
    rand = Math.floor(Math.random() * (alen));
    drawn.push(arr.splice(rand, 1)[0]);
    }
    return [arr, drawn];
  }
  
  // bonus uses W, w, L, l, & . for triple/double word, 3/2 letter, & standard
  function decryptBonus(c) {
      if (c == ".") {return ".";}
      if (c == "W") {return "3W";}
      if (c == "w") {return "2W";}
      if (c == "L") {return " 3L";}
      if (c == "l") {return " 2L";}
  }
  
  function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }
  
  function compare( tileA, tileB ) {
      if ( tileA.i < tileB.i ){
        return -1;
      }
      if ( tileA.i > tileB.i ){
        return 1;
      }
      return 0;
  }
  
  /**********************
  
  BOARD SET UP AND TILE VALUES
  
  **********************/  
  // initialize bonuses; triple/double [L/l]etters or [W/w]ords
  const bonuses = ['W','.','.','l','.','.','.','W','.','.','.','l','.','.','W',
                   '.','.','w','.','.','.','l','.','l','.','.','.','w','.','.',
                   '.','w','.','.','.','L','.','.','.','L','.','.','.','w','.',
                   'l','.','.','.','w','.','.','l','.','.','w','.','.','.','l',
                   '.','.','.','w','.','.','.','.','.','.','.','w','.','.','.',
                   '.','.','L','.','.','.','l','.','L','.','.','.','L','.','.',
                   '.','l','.','.','.','L','.','.','.','l','.','.','.','l','.',
                   'W','.','.','l','.','.','.','w','.','.','.','l','.','.','W',
                   '.','l','.','.','.','l','.','.','.','L','.','.','.','l','.',
                   '.','.','L','.','.','.','L','.','l','.','.','.','L','.','.',
                   '.','.','.','w','.','.','.','.','.','.','.','w','.','.','.',
                   'l','.','.','.','w','.','.','l','.','.','w','.','.','.','l',
                   '.','w','.','.','.','L','.','.','.','L','.','.','.','w','.',
                   '.','.','w','.','.','.','l','.','l','.','.','.','w','.','.',
                   'W','.','.','l','.','.','.','W','.','.','.','l','.','.','W']    

  // get the point value of any given letter
  function getValue(letter) {
    if ("AEIOUNSTR".includes(letter)) {return 1;}
    if ("LDM".includes(letter)) {return 2;}
    if ("GBCPH".includes(letter)) {return 3;}
    if ("FWY".includes(letter)) {return 5;}
    if ("VK".includes(letter)) {return 6;}
    if ("JX".includes(letter)) {return 8;}
    if ("Z".includes(letter)) {return 9;}
    if ("Q".includes(letter)) {return 10;}
    // lowercase letters AND "_" represent blanks
    return 0;
  }
  
  // for adding making & drawing the board itself
  function addCell(ctx, bonus, cell) {
    let y = (Math.floor(cell / 15)) * tileHeight + boardTop;
    let x = (cell % 15) * tileWidth + boardLeft;
    
    if (bonus == " 3L") {
      ctx.fillStyle = tlCol;
      ctx.font = bonusFont;
    }
    if (bonus == " 2L") {
      ctx.fillStyle = dlCol;
      ctx.font = bonusFont;
    }
    if (bonus == "3W") {
      ctx.fillStyle = twCol;
      ctx.font = bonusFont;
    }
    if (bonus == "2W") {
      ctx.fillStyle = dwCol;
      ctx.font = bonusFont;
    }
    if (bonus == ".") {
      ctx.fillStyle = bkgdCol;
      ctx.font = "0px arial";
    }
    if (cell == 112) { 
      bonus = "🌻";
      ctx.font = "30px arial"
    }
    ctx.fillRect(x, y, tileWidth, tileHeight);
    ctx.fillStyle = bonusCol;
    ctx.fillText(bonus, x + bXpad, y + bYpad);
    
    ctx.strokeStyle = lineCol;
    ctx.strokeRect(x, y, tileWidth, tileHeight);
    return 0;
  }
   
  // for adding pre-existing tiles to the board
  function setTile(ctx, letter, cell, value) {
     let y = (Math.floor(cell / 15)) * tileHeight + boardTop;
     let x = (cell % 15) * tileWidth + boardLeft;
     ctx.fillStyle = tileCol;
     ctx.fillRect(x, y, tileWidth, tileHeight);
     ctx.strokeStyle = lineCol;
     ctx.strokeRect(x, y, tileWidth, tileHeight);
     if (letter == letter.toLowerCase()) {
       ctx.fillStyle = blankCol;
       ctx.font = tileFont;
     }
     else {
       ctx.fillStyle = charCol;
       ctx.font = tileFont;
     }
     ctx.fillText(letter, x + cXpad, y + cYpad);
     if (value > 9) {
       var xp = vX2pad;
     }
     else {
       var xp = vX1pad;
     }
     ctx.font = valueFont
     if (value > 0) {v = value}
     else {v = '-'}
     ctx.fillText(v, x + xp, y + vYpad);
     return 0;
  }

  /**********************
  
  HANDLING THE PLAYER'S TILES
    
  **********************/
  class handTile {
    constructor(letter, racki) {
      this.i = racki;
      this.oldCell = -1;
      this.border = lineCol;
      this.width = 40;
      this.height = 40;
      this.letter = letter;
      this.points = getValue(letter); // deprecate?
      if (letter == letter.toLowerCase()) {
        this.textColor = blankCol;
      }
      else {
        this.textColor = charCol;
      }
      this.isOnBoard = false;
    }
    placeTile(ctx, cell) {
      // // alert("drawing " + this.letter + " at " + cell);
      // if (cell == this.oldCell && cell > -1) {return 0;}
      if (cell == -1) {
        this.x = 42 * this.i + 4;
        this.y = 5; 
      }
      else {
        this.y = (Math.floor(cell / 15)) * tileHeight + boardTop;
        this.x = (cell % 15) * tileWidth + boardLeft; 
      }
      if (this.isOnBoard && ctx == rackctx) {
        ctx.fillStyle = rackCol;
      }
      else if (this.i == currTileIndex) {
        ctx.fillStyle = selectedTileCol;
      }
      else {
        ctx.fillStyle = newTileCol;
      }
      ctx.fillRect(this.x, this.y, this.width, this.height);
      ctx.fillStyle = this.textColor;
      if (this.isOnBoard && ctx == rackctx) {
        return;
      }
      ctx.font = tileFont;
      ctx.fillText(this.letter, this.x + cXpad, this.y + cYpad);
      ctx.font = valueFont;
      if (this.points > 9) {
        var xp = vX2pad;
      }
      else {
        var xp = vX1pad;
      }
      var v;
      if (this.points > 0) {v = this.points}
      else {v = '-'}
      ctx.fillText(v, this.x + xp, this.y + vYpad);
      ctx.strokeStyle = lineCol;
      ctx.strokeRect(this.x, this.y, tileWidth, tileHeight);
      return;
    }
    getBounds() {
      return {
        x: this.x,
        y: this.y,
        width: tileWidth,
        height: tileWidth
      }; 
    }
  }

  
  /**********************
  
  SETTING UP THE BOARD
  
  **********************/
  
  const ctx = board.getContext("2d");
  ctx.fillStyle = bkgdCol;
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = lineCol;
  
  const args = seed.split("-");
  var p1hand = args[0].split("");
  const p1score = parseInt(args[1]);
  var p2hand = args[2].split("");
  const p2score = parseInt(args[3]);
  var tilesString = "";
  nargs = args.length
  for (let i = 4; i < nargs; i++) {
    if (!isNaN(args[i])) { // if the string is numeric
    var skip = parseInt(args[i])
    tilesString = tilesString + "-".repeat(skip)
    }
    else {
    tilesString = tilesString + args[i]
    }
  }
  const tiles = tilesString.split("")
  
  // set up the pot
  var pot = ("JQZX" + "KFWYCV".repeat(2) + "_BMFP".repeat(3) + "TRSD".repeat(4) +
     "NLHG".repeat(5) + "U".repeat(6) + "AIO".repeat(9) + "E".repeat(14)).split("");
  
  var firstMove;
  if (seed == "-0--0-225") {
    firstMove = true;
    toggleInstructions();
    ret = sample(pot, 14);
    pot = ret[0];
    p1hand = ret[1];
    p2hand = p1hand.splice(0, 7);
  }
  else {
    firstMove = false;
    var tilesInPlay = tilesString.replaceAll('-', "").split("").concat(p1hand).concat(p2hand);
    tlen = tilesInPlay.length
    for (let i = 0; i < tlen; i++) {
      cell = pot.indexOf(tilesInPlay[i]);
      pot.splice(cell, 1);
    }
  }

  
  const keyboardLeft = 0;
  const keyboardTop = 0;
  const keyWidth = 35; 
  const keyHeight = 35;
  const keyColActive = newTileCol;
  const keyColInactive = tileCol;
  const keyFont = "28px courier";
  const kXpad = 5;
  const kYpad = 24;
  const keyList = "abcdefghijklmnopqrstuvwxyz_".split("")
  
  function drawKeyboard(ctx) {   

    ctx.fillStyle = newTileCol;
    ctx.fillRect(0, 0, 315, 105)
    ctx.fillStyle = newTileCol;
    ctx.fillStyle = blankCol;
    ctx.strokeStyle = "rgb(255, 255, 255)";
    ctx.strokeRect(0, 0, 315, 105)
    ctx.font = keyFont;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 9; j++) {
        x = keyboardLeft + keyWidth * j
        y = keyboardTop + keyHeight * i
        if (keyList[i*9 + j] == hand[currTileIndex].letter) {
          ctx.fillStyle = selectedTileCol;
          ctx.fillRect(x, y, keyWidth, keyHeight);
          ctx.fillStyle = blankCol;
        }
        ctx.strokeRect(x, y, keyWidth, keyHeight)
        ctx.fillText(keyList[i * 9 + j], x + kXpad, y + kYpad)
      }
    }     
  }  
  
  /**********************
  
  SCOREBOARD
  
  **********************/
  const GS = document.getElementById("gameStats");
  if (p1score > p2score) { var status = `WINNING`; }
  else if (p1score < p2score) { var status = `LOSING`; }
  else { var status = `TIED`; }
  if (p2name != null) {
    var scoretext = document.createTextNode("You are currently " + status + 
                         ", " + p1score + " – " + p2score + ", against " + p2name + ".");
    var tiletext = document.createTextNode(pot.length + 
                        " tiles left in the pot & " + p2hand.length + " tiles on " +
                        p2name +"'s rack.")
  }
  else {
    var scoretext = document.createTextNode("You are currently " + status + 
                         ", " + p1score + " – " + p2score + ".");
    var tiletext = document.createTextNode(pot.length + 
                        " tiles left in the pot, & " + p2hand.length + " tiles on " +
                        "your opponent's rack.")
  }
  const scorepara = document.createElement("p");
  scorepara.appendChild(scoretext) 
  
  const tilepara = document.createElement("p")


  tilepara.appendChild(tiletext);
  GS.appendChild(scorepara);
  GS.appendChild(tilepara);
  
    
  // could add an option to shuffle the tiles in your hand by clearing them?
  // place the tiles
  
/*  const RACK = document.getElementById("rack");
  const hand = [];
  var lhand = p1hand.length;
  buttonClasses = ["w3-center", "w3-hover-khaki", "w3-button", "w3-brown"]
  for (let i = 0; i < lhand; i ++) {
    let cha = p1hand[i];
    let chalink = document.createElement("a");
    let chatext = document.createTextNode(cha + getValue(cha));
    chalink.appendChild(chatext);
    for (let j = 0; j < buttonClasses.length; j++) {
      chalink.classList.add(buttonClasses[j]);
    }
    RACK.appendChild(chalink);
  }  */
  rack = document.getElementById("rack")
  rackctx = rack.getContext("2d")
  rackctx.fillStyle = rackCol;
  rackctx.fillRect(0, 0, 300, 50)
  const hand = [];
  var lhand = p1hand.length;
  for (let i = 0; i < lhand; i ++) {
    var t = new handTile(p1hand[i], i);
    t.placeTile(rackctx, -1);
    hand.push(t)
  } 
     
  // set up the board display, placing bonus tiles appropriately
  blen = bonuses.length
  for (let i = 0; i < blen; i++) {
    addCell(ctx, decryptBonus(bonuses[i]), i);
  }
  
  // now all the other drawing and editing will be on a separate, transparent canvas
  
  // const ctx2 = overlay.getContext("2d");
  
  
  // add pre-existing tiles
  tlen = tiles.length
  for (let i = 0; i < tlen; i++) {
    if (tiles[i] != "-") {
    v = getValue(tiles[i]);
    setTile(ctx, tiles[i], i, v);
    }
  }
  
  function scoreWord(word) {
    var score = 0;
    for (let i = 0; i < word.length; i++) {
      score += getValue(word[i])
    }
    return score;
  }
  
  function findBranch(letter, cell, bdir) {
    var m;
    var MIN;
    var MAX;
    
    if (bdir == 'v') {
      m = 15;
      MIN = 0;
      MAX = 225;
    }
    else {
      m = 1;
      MIN = cell - cell % 15;
      MAX = MIN + 15;
    }

   // alert("m= " + m)

    if ((tiles[cell - m] == '-') && (tiles[cell + m] == '-')) {
     // alert("isolated cell")
      return [];
    }
    // // alert("findBranch called")

    const branchWord = [letter];
    let head = cell - m;
    let tail = cell + m;
    while (head > MIN) {
      if (tiles[head] == "-") { 
        // alert("found head at " + head + " word is "  + word)
        break; 
      }
      branchWord.unshift(tiles[head]);
      head -= m;
    }
    while (tail < MAX) {
      // alert(tail)
      if (tiles[tail] == "-") { 
        // alert("found tail at " + tail + " word is "  + word)
        break;   
      }
      branchWord.push(tiles[tail]);
      tail += m;
    }
     
    return branchWord;
  }
  
  function score(letters, cells) {
    if (firstMove && !cells.includes(112)) {
      return {score: NaN, error: "The first move of the game must include the center tile"}
    }
    let score = 0;
    const factors = [1];
    const addends = [0];
    const stem = [];
    const branches = [];
    let isAttached = false;

    nTiles = letters.length;
    const rows = []; 
    const cols = [];
    for (let i = 0; i < nTiles; i++) {
      rows.push(Math.floor(cells[i]/15));
      cols.push(cells[i] % 15);
    }
    // tiles must be placed in a single row or column
    let dir;
    if (Math.min(...rows) == Math.max(...rows)) {dir = 'h';}
    else if (Math.min(...cols) == Math.max(...cols)) {dir = 'v;'}
    else {
      return {score: NaN, error: "Tiles must all be in a single row or column" }
    }
    // alert("rows: " + rows + "\ncols: " + cols + "\nletters: " + letters + "\ndir: " + dir);

    
    // tiles must form a single contiguous word
    
    if (dir == 'h') {
      row = rows[0]
      head = Math.min(...cols)
      tail = Math.max(...cols) + 1
      
      while (head > 0 && tiles[row * 15 + head - 1] != '-') {
        head -= 1;
      }
      while (tail < 15 && tiles[row * 15 + tail] != '-') {
        tail +=1; 
      }
            
      for (let i = row * 15 + head; i < row * 15 + tail; i++) {
        if (tiles[i] == "-" && !cells.includes(i)) {
          return {score: NaN, error: ("Tiles must form a single word; you skipped cell " + i)};
        }
        if (tiles[i] != "-" & !isAttached) {isAttached = true;}
        stem.push(tiles[i])
      }
      while (stem.includes("-")) {
        // alert("horiz stem: " + stem)
        let i = stem.indexOf("-");
        let cell = 15 * row + i + head;
        letter = letters[cells.indexOf(cell)];
        stem.splice(i, 1, letter); //right?
        if (bonuses[cell] == 'w') {factors.push(2);}
        else if (bonuses[cell] == 'W') {factors.push(3);}
        else if (bonuses[cell] == 'l') {addends.push(getValue(letter));}
        else if (bonuses[cell] == 'L') {addends.push(2 * getValue(letter));}
        else {
          factors.push(1)
          addends.push(0)
        }
        // // alert(stem[i])
        // // alert(cell)
        let branch = findBranch(stem[i], cell, "v")
        branches.push(branch)
        // if (!dictionary.includes(branch.join("").toUpperCase())) {
          // return {score: NaN, error: "invalid word: " + branch.join("")}
        // }
        if (branch.length != 0) {
          // alert("v branch: " + branch + " of length " + branch.length)

           // alert("branch: " + branch)
            isAttached = true;  
            if (!dictionary.includes(branch.join("").toUpperCase())) {
              return {score: NaN, error: "Invalid branch word: " + branch.join(""), branches: branches}
            }        
          score += (scoreWord(branch) + addends[addends.length - 1]) * 
                   factors[factors.length - 1];
          branches.push(branch);
        }
      }      
    }
    else {
      col = cols[0]
      head = Math.min(...rows)
      tail = Math.max(...rows) + 1
      
      while (head > 0 && tiles[col + 15 * (head - 1)] != '-') {
        head -= 1;
      }
      while (tail < 15 && tiles[col + 15 * (tail)] != '-') {
        tail += 1; 
      }
            
      for (let i = head * 15 + col; i < tail * 15 + col; i += 15) {
        if (tiles[i] == "-" && !cells.includes(i)) {
          return {score: NaN, error: "Tiles must form a single word, you skipped cell " + i};
        }
        stem.push(tiles[i])
      }
      if (stem.includes("-")) {isAttached = true;}
      while (stem.includes("-")) {
        // alert("vert stem: " + stem)
        let i = stem.indexOf("-");
        let cell = 15 * (i + head) + col;
        letter = letters[cells.indexOf(cell)];
        stem.splice(i, 1, letter); //right?
        if (bonuses[cell] == 'w') {factors.push(2);}
        else if (bonuses[cell] == 'W') {factors.push(3);}
        else if (bonuses[cell] == 'l') {addends.push(getValue(letter));}
        else if (bonuses[cell] == 'L') {addends.push(2* getValue(letter));}
        else {
          factors.push(1)
          addends.push(0)
        }
        // // alert(stem[i])
        // // alert(cell)
        let branch = findBranch(stem[i], cell, "h")
        branches.push(branch)

        if (branch.length != 0) {
          // alert("h branch: " + branch + " of length " + branch.length)
            if (!dictionary.includes(branch.join("").toUpperCase())) {
              return {score: NaN, error: "Invalid branch word: " + branch.join(""), branches: branches}
            }      
            isAttached = true;  
          score += (scoreWord(branch) + addends[addends.length - 1]) * 
                   factors[factors.length - 1];
          branches.push(branch);
        }
      }
    }
   // alert("stem = " + stem)

    if (!isAttached && !firstMove) {
      return {score: NaN, error: "Your play must connect to the existing tiles"}
    }
    
    if (stem.length > 1 && !dictionary.includes(stem.join("").toUpperCase())) {
      return {score: NaN, error: "Invalid stem word: " + stem.join("")}
    }
    if (stem.length > 1) {
      score += (scoreWord(stem) + addends.reduce((i, j) => i + j)) * 
          factors.reduce((i, j) => i * j);
    }
    return {score: score, error: "", word : stem.join(""), branches: branches}

  }
  
  var SE = {score: 0, error: "Please play at least one tile.\nClick on a tile to select it, then on the board to place it."};
  // var SE = score("LAY", [94, 95, 96])

  var clickOnTile;
  const letters = [];
  const cells = [];
  
  function shuffleTiles(ctx) {
    hideKeyboard()
    currTileIndex = -1;
    rackctx.fillStyle = rackCol;
    rackctx.fillRect(0, 0, 300, 50)
    rackctx.fillStyle = newTileCol;
    let N = hand.length;
    const numbers = Array.from(Array(N).keys());
    let newPos = sample(numbers, N)[1];
    for (let i = 0; i < N; i++) {
      hand[i].i = newPos[i];
      hand[i].placeTile(ctx, -1);
    }
    hand.sort( compare );
  } 
//  document.getElementById("shuffle").addEventListener("click", alert("clicked shuffle"));
   
  function showKeyboard() {
    let k = document.getElementById("keyboard");
    k.removeAttribute("hidden");
    const kctx = k.getContext("2d");
    drawKeyboard(kctx);
  } 
  
  function hideKeyboard() {
    let k = document.getElementById("keyboard")
    k.setAttribute("hidden", false)
  } 
  
  function toggleInstructions() {
    let ds = document.getElementById("instructions")
    if (ds.hasAttribute("hidden")) {
      ds.removeAttribute("hidden");
    }
    else {
      ds.setAttribute("hidden", false)
    }
  }
  
  function toggleLetterCount() {
    let tc = document.getElementById("tilecounter")
    if (tc.hasAttribute("hidden")) {
      tc.removeAttribute("hidden");
    }
    else {
      tc.setAttribute("hidden", false)
    }
  }  
  function reviseScore() {
      letters.length = 0;
      cells.length = 0;
      for (let i = 0; i < lhand; i++) {
        if (hand[i].oldCell > -1) {
          letters.push(hand[i].letter);
          cells.push(hand[i].oldCell);
        }
      }
      SE = score(letters, cells);
      let b = document.getElementById("play")
      if (SE.score > 0) {
        b.classList.remove("w3-light-gray")
        b.classList.add("w3-green")
        let text = ("✅ Play for " + SE.score + " points!")
        let bContent = document.createTextNode(text)
        b.removeChild(b.firstChild)
        b.appendChild(bContent)
      }
      else {
        b.classList.remove("w3-green")
        b.classList.add("w3-light-gray")
        let text = ("☑️ Play for -- points")
        let bContent = document.createTextNode(text)
        b.removeChild(b.firstChild)
        b.appendChild(bContent)
      }
  }
  
  function clearTiles() {
    for (let i = 0; i < lhand; i++) {
      if (hand[i].isOnBoard) {
        hand[i].isOnBoard = false;
        let c = hand[i].oldCell;
        addCell(ctx, decryptBonus(bonuses[c]), c);
        hand[i].placeTile(rackctx, -1);
        hand[i].oldCell = -1;
      }
    }
    reviseScore()
  }
  
  function swapTiles() {
   alert("Sorry, this button isn't working yet!!\n\nLet Bennett know you want to swap tiles and we'll figure something out.")
   return false;
  }
  
  function submitPlay() {
    if (!(SE.score > 0)) {
     alert("Sorry, this isn't a valid move.\n" + SE.error)
      return;
    }
    
    if (p1score + SE.score > p2score) { var newStatus = `winning`; }
    else if (p1score + SE.score < p2score) { var newStatus = `losing`; }
    else { var newStatus = `tied`; }
    
    // played tiles to board; unplayed tiles to new hand
    const newHand = []
    for (let i = 0; i < lhand; i++) {
      if (hand[i].isOnBoard) {
         tiles[hand[i].oldCell] = hand[i].letter;
      }
      else if (hand[i].letter != hand[i].letter.toLowerCase()) {
        newHand.push(hand[i].letter);
        }
      else {newHand.push('_');}
    }
    drawResult = sample(pot, Math.min(pot.length, 7 - newHand.length))
    newTiles = drawResult[1]
    pot = drawResult[0]
    newHand.push(...newTiles)
    
    let c = 0
    boardcode = []
    boardcode.push(p2hand.join(""), p2score, newHand.join(""), (p1score + SE.score))
    while (c < 225) {
      let w = []
      while (c < 225 && tiles[c] != "-") {
        w.push(tiles[c]);
        c++;
      }
      if (w.length > 0) {boardcode.push(w.join(""));}
      let blanks = 0;
      while (c < 225 && tiles[c] == "-") {
        blanks++;
        c++;
      }
      if (blanks > 0) {
        boardcode.push(blanks);
      }
    }
    codestring = boardcode.join("-");
    if (p1name != null) {var name1 = "&p1=" + p2name;}
    else {var name1 = ""}
    if (p2name != null) {var name2 = "&p2=" + p1name;}
    else {var name2 = ""}
    url = "https://bennettmcintosh.com/words?seed=" + codestring + name1 + name2
    // alert("you drew " + newTiles + "\n\n" + url)
    
    let conf = document.getElementById("confirmation");
    conf.removeAttribute("hidden");
    let sb = document.getElementById("scoreboard");
    sb.setAttribute("hidden", false); 
    
    // congrats = "Congratulations – you played " + SE.word + " for " + SE.score + " points!\n" + 
    //           "You drew: " + newTiles + " so your hand is now: " + newHand + ".";
    congrats = `Congratulations – you played ${SE.word} for ${SE.score} points!
    ` + 
               `You drew: ${newTiles}, so your hand is now: ${newHand}.`

    newScore = `The score is now ${p1score + SE.score} (you) to ${p2score} (your opponent).`
    instruct = "Please click on this button to send an email to your opponent so they can make their move."
    
    document.getElementById("congrats").innerHTML = congrats
    
    if (p2name != null) {
      document.getElementById("newScore").innerHTML = newScore.replace("your opponent", p2name)
      document.getElementById("emailInstruct").innerHTML = instruct.replace("your opponent", p2name)
    }
    else {
      document.getElementById("newScore").innerHTML = newScore
      document.getElementById("emailInstruct").innerHTML = instruct
    }
    if (p2name == null) {var salutation = "Hi,"}
    else { var salutation = `Hi ${p2name},`}
    if (p1name == null) {var closing = ""}
    else {var closing = `${p1name}`;}
    emailText = [`${salutation}`,
    `I’ve made my move in our Words game — I played ${SE.word} for ${SE.score} points, so I am now ${newStatus}, ${p1score + SE.score} to ${p2score}.`,
    `To make your move, click this link, or copy it into your navigation bar!`,
    `${url}`,
    `Happy word-making!`,
    `~${closing}`]
    
    document.getElementById("emailText").innerHTML = `<p>${emailText.join('</p><p>')}</p>`
    encodedurl = url.replaceAll("/", "%2F").replaceAll(":", "%3A")
    // alert(emailText.splice(1, 3, url).join("%0A").replaceAll(" ", "%20"))
    var subject = `I\%20played\%20${SE.word}\%20for\%20${SE.score}\%20points`
    var body = emailText.join("%0A%0A").replaceAll(" ", "%20")
    document.getElementById("sendEmail").href = `mailto:?subject=${subject}&body=${body}`
    
    // hide scoreboard
    // show confirmation
    // add score to confirmation
    // add point value to confirmation
    // add encrypt and decrypt functions
    
    
  }
    
  document.getElementById("keyboard").addEventListener("click", function(event) {
    let t = currTileIndex
    if (t < 0) { return; }
    if (hand[t].letter == hand[t].letter.toLowerCase()) {
      let xy = getMousePos(document.getElementById("keyboard"), event);
      let row = Math.floor(xy.x / keyWidth);
      let col = Math.floor(xy.y / keyHeight);
      let i = row + 9 * col;
      hand[t].letter = "abcdefghijklmnopqrstuvwxyz_"[i];
      if (hand[t].isOnBoard) { hand[t].placeTile(ctx, hand[t].oldCell); }
      else { hand[t].placeTile(rackctx, -1);}  
    }
    reviseScore()
    showKeyboard()
  });
   
  document.getElementById("rack").addEventListener("click", function(event) {
    hideKeyboard()
    // get the coordinates of the click
    let xy = getMousePos(rack, event);
    let x = xy.x;
    let y = xy.y;
    let pos = Math.floor((x - 4) / (tileWidth + 2));
    if (pos < 0) {pos = 0;}
    if (pos >= hand.length) {pos = hand.length - 1}
    if (hand[pos].isOnBoard) { // return the tile to the rack
      if (currTileIndex > -1){
        let t = currTileIndex;
        currTileIndex = -1;
        hand[t].isOnBoard = false;
        let redrawCell = hand[t].oldCell;
        if (redrawCell > -1) {
          addCell(ctx, decryptBonus(bonuses[redrawCell]), redrawCell);
          hand[t].placeTile(rackctx, -1)
        }
        hand[t].oldCell = -1;
      }
      for (let i = 0; i < hand.length; i++) {
        hand[i].placeTile(rackctx, -1)
      }
    }
    else if ( currTileIndex != pos ) { currTileIndex = pos; }
    else { currTileIndex = -1; }
    //for (let i = 0; i < hand.length; i++) {
   //   hand[i].placeTile(rackctx, -1)
   // }
    if (currTileIndex > -1) {
      if (hand[currTileIndex].letter == hand[currTileIndex].letter.toLowerCase()) {
        showKeyboard();
      }
    }
    for (let i = 0; i < hand.length; i++) {
      hand[i].placeTile(rackctx, -1);
      if (hand[i].oldCell > -1) { hand[i].placeTile(ctx, hand[i].oldCell);}
    }
    reviseScore()    
  });
  
  document.getElementById("board").addEventListener("click", function(event) {
    hideKeyboard();
    // get the coordinates of the click
    let xy = getMousePos(board, event);
    let row = Math.floor(xy.x / tileWidth);
    let col = Math.floor(xy.y / tileHeight);
    var cell = row + 15 * col;

    // ignore clicks on existing tiles
    if (tiles[cell] != '-') { return; }
    
    var clickedOnTile = false;
    
    // check if we clicked on a tile; toggle selection if so
    for (let i = 0; i < hand.length; i++) {
      if (cell == hand[i].oldCell) {
        clickedOnTile = true;
        if (currTileIndex == i) {currTileIndex = -1;}
        else {currTileIndex = i;}
        hand[i].placeTile(ctx, cell)
      }
    }

    // if we did click on a tile, turn off selection on other tiles
    if (!clickedOnTile) { // otherwise, move the selected tile to the board and deselect it
      let t = currTileIndex;
      currTileIndex = -1;
      if (t > -1) {
        hand[t].isOnBoard = true;
        redrawCell = hand[t].oldCell;
        if (redrawCell > -1) {
          addCell(ctx, decryptBonus(bonuses[redrawCell]), redrawCell);
        }
        hand[t].placeTile(ctx, cell)
        hand[t].placeTile(rackctx, -1)
        hand[t].oldCell = cell;
      }
    }
    for (let i = 0; i < hand.length; i++) {
      hand[i].placeTile(rackctx, -1);
      if (hand[i].oldCell > -1) { hand[i].placeTile(ctx, hand[i].oldCell);}
    }
    if (currTileIndex > -1) {
      if (hand[currTileIndex].letter == hand[currTileIndex].letter.toLowerCase()) {
        showKeyboard();
      }
    }
    reviseScore()
  }, false);
  
  


  
