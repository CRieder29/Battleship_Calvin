function game() {
    this.boardSize = 8;
    this.numShips = 4;
    this.shipsSunk = 0;       
    this.ships = [];
};

game.prototype.fire = function(guess) {
        for (var i = 0; i < this.numShips; i++) {
            var ship = this.ships[i];
            var index = ship.locations.indexOf(guess);
 
            // here's an improvement! Check to see if the ship
            // has already been hit, message the user, and return true.
            if (ship.hits[index] === "hit") {
                game.view.displayMessage("Oops, you already hit that location!");
                return true;
            } else if (index >= 0) {
                ship.hits[index] = "hit";
                game.view.displayHit(guess);
                game.view.displayMessage("HIT!");
                
                // Checks if the ship should start or stop fleeing
                game.flee(i);
 
                if (this.isSunk(ship)) {
                    game.view.displayMessage("You sank my battleship!");
                    this.shipsSunk++;
                }
                return true;
            }
        }
        game.view.displayMiss(guess);
        game.view.displayMessage("You missed.");
        
        
        return false;
    };

game.prototype.isSunk = function(ship) {
        for (var i = 0; i < ship.length; i++)  {
            if (ship.hits[i] !== "hit") {
                return false;
            }
        }
        return true;
    };
    
/*
         * Loads the ship locations into the "objects" in 'ships'
     */
game.prototype.generateShipLocations = function() {
            var shiplocs;
            for (var i = 0; i < this.numShips; i++) {
                    do {
                        
                        // Creates ship of different lengths
                        if(i === 0){
                            var shiplen = 2;  
                        } 
                        else if(i > 0 && i < (this.numShips-1)){
                            var shiplen = 3;
                        }
                        else{
                            var shiplen = 4;
                        }
                      
                        shiplocs = this.generateShip(shiplen);                          
                        
                    } while (this.collision(shiplocs[0]));
                    
                    // Creates the new ship from the randomized location and orientation data
                    var newship = new Ship();
                    newship.locations = shiplocs[0];
                    newship.length = shiplen;
                    newship.direction = shiplocs[1];
                    newship.orientation = shiplocs[2];
                    newship.setHits();
                    this.ships.push(newship);
           
            }
            console.log("Ships array: ");
            //console.log(this.ships);
            
            for(var ship in this.ships){
                console.log(this.ships[ship].locations);
            };
        };

// Creates ship object with locations
game.prototype.generateShip = function(shiplen) {
		var direction = Math.floor(Math.random() * 2);
                
		var row, col;


                // Creates location values
		if (direction === 1) { // horizontal
			row = Math.floor(Math.random() * this.boardSize);
			col = Math.floor(Math.random() * (this.boardSize - shiplen + 1));
		} else { // vertical
			row = Math.floor(Math.random() * (this.boardSize - shiplen + 1));
			col = Math.floor(Math.random() * this.boardSize);
		}

		var newShipLocations = [];
		for (var i = 0; i < shiplen; i++) {
			if (direction === 1) {
				newShipLocations.push(row + "" + (col + i));
			} else {
				newShipLocations.push((row + i) + "" + col);
			}
		}
                
                // Creates random orientation or ship
                var orientcheck = Math.floor(Math.random() * 2);
                if(direction === 1){
                    var direct = "horizontal";
                    
                    if(orientcheck === 1){
                        var orient = "E";
                    } else {
                        var orient = "W";
                    }
                             
                } else {
                    var direct = "vertical";
                    
                    if(orientcheck === 1){
                        var orient = "N";
                    } else {
                        var orient = "S";
                    }
                }

            return([newShipLocations, direct, orient]);              
	};


// Checks if a ship is on a collison path with another ship
game.prototype.collision = function(testlocs) {

                for (var shipnum in this.ships) {
			var oldship = this.ships[shipnum];
                        if(this.ships.length > 0){
                        
                            for (var j = 0; j < testlocs.length; j++) {
                                  
                                    if (oldship.locations.indexOf(testlocs[j]) >= 0) {
                                            return(true);
                                    }
                                }                       
                        }else{
                            return(false);
                        }   
                }    
            return(false);
        };
  

game.prototype.flee = function(shipind){
    var hitcount = 0;
    
    for(var squarnum in this.ships[shipind].hits){
        var square = this.ships[shipind].hits[squarnum];
        if(square === "hit"){
            hitcount += 1;
        };
    };
    // If the ship has been hit once, it will start moving
    if(hitcount === 1){
        this.ships[shipind].isMoving = true;
    }
    
    // If its been hit more than once, it will stop moving
    else if(hitcount > 1){
        this.ships[shipind].isMoving = false;
    }

};

game.prototype.moveShips = function(){
    // Checks if each ship can move
    for(var shipnum in this.ships){
        
        var ship = this.ships[shipnum];
        
        // 50% chance that ship will move
        var willmove = Math.floor(Math.random() * 2);
        if(/*willmove === 1 && */ship.isMoving === true){
            
            // Checks if square in front of ship is free
            var forward = game.squareCheck(ship, "forward");
            if(forward === false){
                
                // If the square in front of it isn't free, it checks if it can move backwards
                var backward = game.squareCheck(ship, "backward");
                
                if(backward === false){
                    this.ships[shipnum].reorient();
                }
            };
            
            
            if(forward || backward){
           
                // Moves the ship forward varying on orientation
                for(var locnum in this.ships[shipnum].locations){
                    
                    var tempsquare = this.ships[shipnum].locations[locnum];
                    
                    if(this.ships[shipnum].orientation === "N"){

                        var lastsquare = this.ships[shipnum].locations[this.ships[shipnum].length - 1];
                        this.view.removedisplay(lastsquare);
                        var newloc = parseInt(tempsquare) - 10;

                    }else if(this.ships[shipnum].orientation === "S"){
                        var lastsquare = this.ships[shipnum].locations[0];
                        this.view.removedisplay(lastsquare);
                        var newloc = parseInt(tempsquare) + 10;
                        

                    }else if(this.ships[shipnum].orientation === "E"){
                        var lastsquare = this.ships[shipnum].locations[0];
                        this.view.removedisplay(lastsquare);
                        var newloc = parseInt(tempsquare) + 1;

                    }else{
                        var lastsquare = this.ships[shipnum].locations[this.ships[shipnum].length - 1];
                        this.view.removedisplay(lastsquare);
                        var newloc = parseInt(tempsquare) - 1;
                    };

                    var newsquare = newloc.toString();
                    if(newsquare.length === 1){
                        newsquare = "0" + newsquare;
                    };
                    
                    
                    this.ships[shipnum].locations[locnum] = newsquare;
                                   
                }
                
                this.changedisplay(this.ships[shipnum]);
                
            } 
            
        };
    };
    
    console.log("New Locations");
        for(var ship in this.ships){
            console.log(this.ships[ship].locations);
            };
    
};

game.prototype.squareCheck = function(ship, direction){
  
    if(direction === "backward"){
        
        ship.reorient();
        
    };
    
    var inBoard = true;
    
    if(ship.orientation === "N"){
        var frontsquare = ship.locations[0];
        var testsquare = parseInt(frontsquare) - 10;
        var row = frontsquare[0];
        if(row === "0"){
            inBoard = false;    
        };
        
    }else if(ship.orientation === "S"){
        var frontsquare = ship.locations[ship.length - 1];
        var testsquare = parseInt(frontsquare) + 10;
        var row = frontsquare[0];
        var col = frontsquare[1];
        if(row === "7"){
            inBoard = false;    
        };

    }else if(ship.orientation === "E"){
        var frontsquare = ship.locations[ship.length - 1];
        var testsquare = parseInt(frontsquare) + 1;
        var row = frontsquare[0];
        var col = frontsquare[1];
        if(col === "7"){
            inBoard = false;    
        };
        
    }else{
        var frontsquare = ship.locations[0];
        var testsquare = parseInt(frontsquare) - 1;
        var row = frontsquare[0];
        var col = frontsquare[1];
        if(col === "0"){
            inBoard = false;    
        };
    };
    
    // If the forward square is on the board and free, let the ship move forward 
    if(game.collision(testsquare) === false && inBoard === true) {
        
        return(true);

    }else{
        return(false);
    }
    
};

// Change the display once the ship moves
game.prototype.changedisplay = function(ship){
    
    // For each square of the ship
    for(var i in ship.locations){
        var loc = ship.locations[i];
        
        // If the square is hit
        if(ship.hits[i] === "hit"){         
            this.view.displayHit(loc);
            
        } else {
            this.view.removedisplay(loc);
        };
    }
};




game.prototype.view = {
    displayMessage: function(msg) {
        var messageArea = document.getElementById("messageArea");
        messageArea.innerHTML = msg;
    },
 
    displayHit: function(location) {
        var cell = document.getElementById(location);
        cell.setAttribute("class", "hit");
    },
 
    displayMiss: function(location) {
        var cell = document.getElementById(location);
        cell.setAttribute("class", "miss");
    
    },
    removedisplay: function(location) {
        var cell = document.getElementById(location);
        var attribute = cell.getAttribute("class");
        if(attribute !== null){
            cell.removeAttribute("class");
        };
     
    }
    // Define a function to remove the attribute for cell if
    // a ship is moving to it or from it.
    // Use cell.removeAttribute("class"); or maybe cell.removeAttribute("class, "miss");
    
   
}; 

game.prototype.controller = {
    guesses: 0,
 
    processGuess: function(guess) {
        var location = game.parseGuess(guess);
        if (location) {
            this.guesses++;
            var hit = game.fire(location);
            
            // Moves ships that are able to move
            game.moveShips();
            if (hit && game.shipsSunk === game.numShips) {
                
                    game.view.displayMessage("You sank all my battleships, in " + this.guesses + " guesses");
            }
        }
    }
};


game.prototype.parseGuess = function(guess) {
    var alphabet = ["A", "B", "C", "D", "E", "F", "G", "H"];
 
    if (guess === null || guess.length !== 2) {
        alert("Oops, please enter a letter and a number on the board.");
    } else {
        var firstChar = guess.charAt(0);
        var row = alphabet.indexOf(firstChar);
        var column = guess.charAt(1);
         
        if (isNaN(row) || isNaN(column)) {
            alert("Oops, that isn't on the board.");
        } else if (row < 0 || row >= game.boardSize ||
                   column < 0 || column >= game.boardSize) {
            alert("Oops, that's off the board!");
        } else {
            return row + column;
        }
    }
    return null;
};

game.prototype.handleFireButton = function() {
    var guessInput = document.getElementById("guessInput");
    var guess = guessInput.value.toUpperCase();
 
    game.controller.processGuess(guess);
 
    guessInput.value = "";
    
};

game.prototype.handleKeyPress = function(e) {
    var fireButton = document.getElementById("fireButton");
 
    // in IE9 and earlier, the event object doesn't get passed
    // to the event handler correctly, so we use window.event instead.
    e = e || window.event;
 
    if (e.keyCode === 13) {
        fireButton.click();
        return false;
    }
};

function Ship() {
    this.locations = [];
    this.hits = [];
    this.length = 0;
    this.direction = "";
    this.orientation = "";
    this.isMoving = false;
    
};

Ship.prototype.setHits = function(){
    for(var box = 0; box < this.length; box++){
        this.hits.push([]);
    }
};

// Flips orientation of ship
Ship.prototype.reorient = function(){
        if (this.orientation === "N"){
            this.orientation = "S";
        } else if (this.orientation === "S"){
            this.orientation = "N";
        } else if (this.orientation === "E"){
            this.orientation = "W";
        } else {
            this.orientation = "E";
        };
    };


window.onload = init;


function init() {
    game = new game();
    // Fire! button on click handler
    var fireButton = document.getElementById("fireButton");
    fireButton.onclick = game.handleFireButton;
 
    // handle "return" key press
    var guessInput = document.getElementById("guessInput");
    guessInput.onkeypress = game.handleKeyPress;
 
    // place the ships on the game board
    game.generateShipLocations();
}