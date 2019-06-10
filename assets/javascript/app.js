rps = {
    //firebase config info
    fbConfig: {
        apiKey: "AIzaSyDO1LjkDTI1kHBokq5OoLnSTMxg-4m14AM",
        authDomain: "birnarpsgame.firebaseapp.com",
        databaseURL: "https://birnarpsgame.firebaseio.com",
        projectId: "birnarpsgame",
        storageBucket: "birnarpsgame.appspot.com",
        messagingSenderId: "25115998215",
        appId: "1:25115998215:web:dea6baf4c9fe2a49"
    },

    //variables 
    database: "",
    numPlayers: 0,
    playerDes: "",
    playersDB: "",
    msgesDB: "",
    //need this to hold empty space
    players: { player1: null, player2: null },

    //player class to hold player data 
        //(name, wins, losses, ties, last move)
    player: function(name) {
        this.name = name;
        this.wins = 0;
        this.losses = 0;
        this.ties = 0;
        this.lastMove = "";
    },

    //message class to create objects for each msg
        //(who sent the message and what did they say)
    message: function(chat, sender = 'anonymous') {
        if(sender!='admin'){
            if (rps.playerDes != ""){
                sender = rps.playerDes;
            }
        }
        this.sender = sender
        this.message = chat;
        this.time = new Date().toLocaleTimeString();
        console.log(this.sender +":"+ chat);
    },
        
    //initialize the app with firebase to be able to store information
    init: function() {
        firebase.initializeApp(rps.fbConfig);
        database = firebase.database();
        //database location for current players
        playersDB = database.ref('players/');        
        //database location for chat messagges
        msgesDB = database.ref('messages/');     
        rps.clickHandlers();
    },
    
    //function to carry out all click events
    clickHandlers: function() {

        //function to take in new player when "join" is clicked
        $(".ready").on("click", function(b) {
            let curPlayer = $(b.target).attr("data-player");
            let enteredTxt = $('#' + curPlayer + ' .name').val().trim();
            //have user re-enter name if field is left blank
            if (enteredTxt == "") {
                alert("Please enter a valid name")
            } else {
            //valid name -> insert player into database and make UI changes
            rps.playerDes = curPlayer;
            rps.players[rps.playerDes] = new rps.player(enteredTxt);
            rps.updatePlayers();
            let connectionsRef = database.ref("/players/"+rps.playerDes);
            connectionsRef.set(rps.players[rps.playerDes]);
            //remove player from DB if they disconnect
            connectionsRef.onDisconnect(   
            function () {
                msgesDB.push(new rps.message(enteredTxt +
                " has left the building.", 'admin'));
            }).remove();
            $('.name').attr('disabled', true);  
            }
        });

        //function to take in player's RPS choice
            //store the player's moves
            //check if both players have went
            //get result
            //update UI with the correct changes

    },

    //function to update player data
    updatePlayers: function() {
        $('.player-title').html("Player Name: ")
        //show name input
        $(' .form-group').slideDown();   

        //update UI with all player info and disable RPS buttons
        for (curPlayer in rps.players){
            if (rps.players[curPlayer] != null){
                $('#' + curPlayer + ' .player-title').html("Player Name: " + 
                    rps.players[curPlayer].name);

                $('#' + curPlayer + ' .form-group').slideUp();
                $('.move-text').html("Waiting for another player");
                $('.moves :button').attr('disabled', true);   
            }
             
            //names on scoreboard
            if (rps.players.player1 != null){
                $(".p1").text(rps.players.player1.name);
            }
            if (rps.players.player2 != null){
                $(".p2").text(rps.players.player2.name);
            }
        }
    },

        //chatroom functionality
            //prevent page refresh
            //show msges on interface once sent
            //prevent blank messages
            //make message object
            //clear msg box in UI
        

        //function to enable RPS buttons when there are two players

        //function to calculate who won based on "last move" property

        //function to update results, wins, losses, and ties in UI
               
}

//run the rps Object
$(document).ready(function() {
    rps.init();
});