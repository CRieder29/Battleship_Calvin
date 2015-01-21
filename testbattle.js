var game = {
    boardSize: 7,
    numShips: 3,
    shipLength: 3,
    shipsSunk: 0,       
    ships: []
};

game.fire = function(guess) {
        for (var i = 0; i < this.numShips; i++) {
            var ship = this.ships[i];
            var index = ship.locations.indexOf(guess);
 
            // here's an improvement! Check to see if the ship
            // has already been hit, message the user, and return true.
            if (ship.hits[index] === "hit") {
                view.displayMessage("Oops, you already hit that location!");
                return true;
            } else if (index >= 0) {
                ship.hits[index] = "hit";
                view.displayHit(guess);
                view.displayMessage("HIT!");
 
                if (this.isSunk(ship)) {
                    view.displayMessage("You sank my battleship!");
                    this.shipsSunk++;
                }
                return true;
            }
        }
        view.displayMiss(guess);
        view.displayMessage("You missed.");
        return false;
    };

game.isSunk = function(ship) {
        for (var i = 0; i < this.shipLength; i++)  {
            if (ship.hits[i] !== "hit") {
                return false;
            }
        }
        return true;
    };
    
/*
         * Loads the ship locations into the "objects" in 'ships'
     */
game.generateShipLocations = function() {
            var shiplocs;
            for (var i = 0; i < this.numShips; i++) {
                    do {
                            shiplocs = this.generateShip();
                    } while (this.collision(shiplocs));
                    var newship = new Ship();
                    newship.locations = shiplocs;
                    this.ships.push(newship);
           
            }
            console.log("Ships array: ");
            console.log(this.ships);
        };

// Creates ship object with locations
game.generateShip = function() {
		var direction = Math.floor(Math.random() * 2);
		var row, col;

		if (direction === 1) { // horizontal
			row = Math.floor(Math.random() * this.boardSize);
			col = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
		} else { // vertical
			row = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
			col = Math.floor(Math.random() * this.boardSize);
		}

		var newShipLocations = [];
		for (var i = 0; i < this.shipLength; i++) {
			if (direction === 1) {
				newShipLocations.push(row + "" + (col + i));
			} else {
				newShipLocations.push((row + i) + "" + col);
			}
		}
		return(newShipLocations);
	};

game.collision = function(testlocs) {

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
  
        
var view = {
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
    }
 
}; 


game.controller = {
    guesses: 0,
 
    processGuess: function(guess) {
        var location = game.parseGuess(guess);
        if (location) {
            this.guesses++;
            var hit = game.fire(location);
            if (hit && game.shipsSunk === game.numShips) {
                
                    view.displayMessage("You sank all my battleships, in " + this.guesses + " guesses");
            }
        }
    }
};


game.parseGuess = function(guess) {
    var alphabet = ["A", "B", "C", "D", "E", "F", "G"];
 
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

game.handleFireButton = function() {
    var guessInput = document.getElementById("guessInput");
    var guess = guessInput.value.toUpperCase();
 
    game.controller.processGuess(guess);
 
    guessInput.value = "";
};

game.handleKeyPress = function(e) {
    var fireButton = document.getElementById("fireButton");
 
    // in IE9 and earlier, the event object doesn't get passed
    // to the event handler correctly, so we use window.event instead.
    e = e || window.event;
 
    if (e.keyCode === 13) {
        fireButton.click();
        return false;
    }
};

window.onload = init;


function init() {
    // Fire! button onclick handler
    var fireButton = document.getElementById("fireButton");
    fireButton.onclick = game.handleFireButton;
 
    // handle "return" key press
    var guessInput = document.getElementById("guessInput");
    guessInput.onkeypress = game.handleKeyPress;
 
    // place the ships on the game board
    game.generateShipLocations();
}

function Ship() {
    this.locations = [];
    this.hits = [];
}