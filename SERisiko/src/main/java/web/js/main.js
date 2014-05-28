// ---------------------- #
var main = new Main();

function Main() {
    //#Public Vars
	this.sctTable = null;
	this.gameWindow = null;
	this.gameList = new GameList();
	this.connection = null;
	
	//#Private Vars
	var thePlayerName = "";
	var canvas = null;
	var ctx = null;
	var game = "stopped";
	var gameListRefresher = null;
	var playerListRefresher = null;
	
	//#Preinitiator
	window.onload = function () {
		canvas = document.getElementById("screen");
		ctx = canvas.getContext("2d");
		
		ctx.strokeRect(40, 40, 80, 40);
		ctx.fillText("SE_RISK", 50, 65);
	}
	
	// Start ConnectionToServer

	$(function() {
		connection = new RisikoApi();
		connection.onmessage = function(elem) { //get message from server
			console.log( elem );
			$('#message').append(elem.data);
		};
	});
	
	
	
	//# Public Methods
	this.setPlayerName = function(){
		var name = document.getElementById("playerName").value;
		if(name == "" || name == "Ihr Spielername")
			return false;
		thePlayerName = name;
		
		// check for name from server
		// if valid
		hideElement(document.getElementById("setPlayerName"));
		showElement(document.getElementById("selectGame"));
		divs = document.getElementsByClassName('playerNameDisplay');
		[].slice.call(divs).forEach(function(div){div.innerHTML = thePlayerName;});
		
		// create selectable Table
		this.sctTable = new SelectableTable(this.gameList);
		gameListRefresher = $.timer(function(){main.updateGameList();}, 2000);
		gameListRefresher.play();

		return true;
	}

	this.deletePlayerName = function(){
		if(thePlayerName == "")
			return false;
		
		// delete playername from server
		
		// delete playername from client
		thePlayerName = "";
		
		// revert menu
		showElement(document.getElementById("setPlayerName"));
		hideElement(document.getElementById("selectGame"));
		gameListRefresher.pause();

		divs = document.getElementsByClassName('playerNameDisplay');
		[].slice.call(divs).forEach(function(div){div.innerHTML = playerName;});
		this.sctTable.clear("availableGames");
	}
	
	this.backToLobby = function(){
		showElement(document.getElementById("selectGame"));
		hideElement(document.getElementById("game"));
		hideElement(document.getElementById("newGame"));
		game = "stopped";
		gameListRefresher.play();
		playerListRefresher.pause();
	}
	
	this.setGame = function(id){
		if(this.sctTable != null){
			//if(this.sctTable.isSelected()){
			if(id > 0 && id <= this.gameList.getGameAmount() && id <= this.sctTable.getRows()){
				//alert("Joining to " + document.getElementById('cell_'+this.sctTable.getSelectedRow()+',1').innerHTML + " ...");
				alert("Joining to " + document.getElementById('cell_'+id+',1').innerHTML + " ...");
				startGame(this.sctTable, id);
			}
			else
				alert("You must select a Game first!");
		}
		else
			alert("Error! no gameTable");
	}
	
	this.showCreateNewGame = function(){
		showElement(document.getElementById("newGame"));
		hideElement(document.getElementById("selectGame"));
		gameListRefresher.pause();
	}
	
	this.createNewGame = function(){
		//check game settings....
		var gameName = document.getElementById("gameName").value;
		var maxPlayers = document.getElementById("maxPlayers").value;
		var gameSettings = document.getElementById("gameSettings").value;
		//parse data to server
		//verify 
		//create game
		alert("coming soon...");
	}
	
	this.updateGameList = function(){
		if(this.sctTable != null){
			this.sctTable.clear("availableGames");
			getGameList(this.sctTable, this.gameList);
		}
		else
			alert("Error! no gameTable");	
	}
	
	this.minmax = function(value, min, max){
		if(parseInt(value) < min || isNaN(value)) 
			return min; 
		else if(parseInt(value) > max) 
			return max; 
		else return value;
	}
	
	this.checkForKey = function(caller, key){
		switch(caller){
			case "playerName":
				if(key == 13)
					this.setPlayerName();
				break;
			default:
				//nothing
		}
	}
	
	this.readyToPlay = function(){		
		// send to server : player ready
		updatePlayerList();
	}
	
	this.updatePlayerList = function(){
		// get playerlsit from server // get ready state of pl from server
		var players = [ // pseudo test data
					  {"name" : "Hans von Massow", "rdy" : 1},
					  {"name" : "Maismüller", "rdy" : 1},
					  {"name" : "Karl-Heinz", "rdy" : 0},
					  {"name" : "Philipp", "rdy" : 1},
					  {"name" : "Alex", "rdy" : 0},
					  {"name" : "Nerv", "rdy" : 1}
					  ];			  	  
		var rdy = '<img id="Ready" src="img/Gruener-Haken.jpg" width="15" align="right"/>';
		var notRdy = '';
		
		document.getElementById("PlayerList").innerHTML = "";
		for(var i = 0; i < 6; i++){
			$("#PlayerList").append(players[i].name + ((players[i].rdy == 1)? rdy : notRdy) + "<br>");
		}
	}
	
	//# Private Methods
    var startGame = function(table, id){
		this.gameWindow = new GameWindow(canvas, ctx);
			
		showElement(document.getElementById("game"));
		hideElement(document.getElementById("selectGame"))
		gameListRefresher.pause();
		game = "running";
		table.selectRow(0);
		
		playerListRefresher = $.timer(function(){main.updatePlayerList();}, 2000);
		playerListRefresher.play();
    }
	var hideElement = function(element){
		element.style.display = "none";
	}
	var showElement = function(element){
		element.style.display = "block";
	}
	
	var getGameList = function(table, list){
		list.addGame(["Game 1", "DHBW", "1/6", "n/a"], table);
		list.addGame(["Game 42", "World", "0/6", "n/a"], table);
		list.addGame(["Game 3", "DHBW", "4/6", "n/a"], table);
	}
}

function SelectableTable(list){
	//#Public Vars
	
	//#Private Vars
	var currentRow = -1;
	var rows = 0;
	var gameList = list;
	
	//# Public Methods
	this.selectRow = function(newRow){
		if(newRow == currentRow)
			return;
		for(var i = 1; i < 5; ++i){
			var cell=document.getElementById('cell_'+newRow+','+i);
			if(cell != null)
				cell.style.background='#AAF';
			if(currentRow != -1){
				var cell=document.getElementById('cell_'+currentRow+','+i);
				if(cell != null)
					cell.style.background='#C4D3F6';
			}
	   }
		if(newRow == currentRow)
			currentRow = -1;
		else
			currentRow = newRow;
	}
	
	this.getSelectedRow = function(){
		return currentRow;
	}
	
	this.getRows = function(){
		return rows;
	}
	
	this.addRow = function(tableId, cells){
		rows++;
		var tb   = document.getElementById(tableId)
							.getElementsByTagName('tbody')[0];
		var newTr = document.createElement('tr');
		for (var i = 0; i < cells.length; i++) {
			var td = document.createElement('td');
			td.appendChild(document.createTextNode(cells[i]));
			td.id = "cell_"+rows+","+(parseInt(i)+1);
			//td.onclick = new Function("main.sctTable.selectRow('"+rows+"')");
			//td.ondblclick = new Function("main.setGame()");
			td.onclick = new Function("main.setGame('"+rows+"')");
			newTr.appendChild(td);
		}
		tb.appendChild(newTr);
	}
	
	this.isSelected = function(){
		return currentRow==-1?false:true;
	}
	
	this.clear = function(tableId){
		for(var i = 0; i < rows; i++)
			document.getElementById(tableId).deleteRow(1);
		rows = 0;
		currentRow = -1;
		gameList.clear();
	}
	//# Private Methods
}

function GameWindow(cv, ct){
	//#Public Vars
	
	//#Private Vars
	var canvas = cv;
	var ctx = ct;
	
	//# Public Methods
	this.clear = function(){
		// clear stuff
	}
	
	//# Private Methods
}

function GameList(){
	//#Public Vars
	
	//#Private Vars
	var amount = 0;
	var games = new Array();
	
	//# Public Methods
	this.clear = function(){
		games = [];
		amount = 0;
	}
	
	this.addGame = function(data, table){
		table.addRow("availableGames", data);
		amount++;
		games.push(parseData(data));
	}
	
	this.getGames = function(){
		if(games != null)
			return games;
		else
			alert('no games found');
	}
	
	this.getGameAmount = function(){
		return amount;
	}
	
	this.getGame = function(index){
		return games[index];
	}
	
	//# Private Methods
	var parseData = function(data){
		var game = new GameObject(data[0], data[1], data[2], data[3]);
		return game;
	}
}

function GameObject(name, mp, maxP, set){
	//#Public Vars
	
	//#Private Vars
	var gameName = name;
	var map = mp;
	var maxPlayers = maxP;
	var settings = gameName;
	
	//# Public Methods
	this.getGameName = function(){
		return gameName;
	}
	this.getMaxPlayers = function(){
		return maxPlayers;
	}
	this.getSettings = function(){
		return settings;
	}
	this.getMap = function(){
		return map;
	}
	//# Private Methods
}
// ---------------------- #