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
        playersDB.on('value', function(data){
            //wipe local data if nothing in DB
            if(data.val()==null){                   
                players = { 
                    player1: null, 
                    player2: null 
                };
            }else{
                rps.players = data.val();           
                rps.numPlayers = Object.keys(data.val()).length;
                //check if we have two players
                if(rps.numPlayers>1){              
                    let moveFlag = true;
                    //check if both players have went
                    for(key in rps.players){        
                        if (rps.players[key].lastMove === ""){
                            moveFlag=false;         
                            break;
                        }
                    }
                    //get result
                    if (moveFlag) {
                            rps.getResult();        
                    }
                }
                //update UI with the correct changes     
                rps.updatePlayers();                
            }
        }, function(error){alert("Error! Cannot compute!")});

        //chatroom functionality
        msgesDB.on('child_added',                
        function(data){    
            //show on chatbox
            rps.showMessage(data.val());        
            }, function(b){
            alert("You have been disconnected");
        });

        $('#send').on('click', function(b){
            //prevent page refresh
            b.preventDefault();     
            let message = $('#message-input').val().trim();
            if(message===""){
                alert("Cannot send blank message") 
            } else{
            //show msges on interface once sent
            msgesDB.push(
                new rps.message(message));
            }
            //clear msg box in UI
            $('message-input').val("");
        });
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

            //win losses and ties on scoreboard
            if (rps.players.player1.wins != 0){
                $(".p1win").text(rps.players.player1.wins);
            }if (rps.players.player1.losses != 0){
                $(".p1loss").text(rps.players.player1.losses);
            }if (rps.players.player1.ties != 0){
                $(".p1tie").text(rps.players.player1.ties);
            }
            if (rps.players.player2.wins != 0){
                $(".p2win").text(rps.players.player2.wins);
            }if (rps.players.player2.losses != 0){
                $(".p2loss").text(rps.players.player2.losses);
            }if (rps.players.player2.ties != 0){
                $(".p2tie").text(rps.players.player2.ties);
            }   
            rps.checkPlayers();
        }
    },

    //how to style the message
    showMessage: function(message){
        let style="";
        switch (message.sender){
            case 'anonymous':
                style = 'anonymous';
                break;
            case 'admin':
                style = 'anonymous';
                break;
            case rps.playerDes:
                style = 'left';
                break;
            default:
                style = 'right';
        }
        //add message to our messages list
        $('.messages ul').append($('<li class="li-' + style +'">').html(
            '<span class="li-message">' + message.message + '</span>' +
            '<span class="li-username">- ' + message.sender + " | " + 
            message.time + '</span>'));
        //scroll to the bottom
        $(".messages").animate({scrollTop: $(".messages").prop("scrollHeight")}, 10);
    },

        //function to enable RPS buttons when there are two players
        checkPlayers: function() {
            for (key in rps.players) {
                if (rps.players[key] == null) {
                    //disable buttons if there's not two players
                    $("#" + key + " .moves :button").attr('disabled', true);
                    //when we have our players
                } else if (rrs.numPlayers > 1) {        
                    //only enable move buttons for current player
                    $("#" + rrs.playerDes + " .moves :button").removeAttr('disabled');
                    $('#' + key + ' .move-text').html("Make your move:");
                    $('#' + key + ' .player-title').html("Player Name: " + rps.players[key].name);
                }
            }
        },

        //make all buttons visible
        refresh: function(){
            $('.moves :button').show();
        },

        //function to calculate who won based on "last move" property

        //function to update results, wins, losses, and ties in UI
        getResult: function() {
    },           
}

//run the rps Object
$(document).ready(function() {
    rps.init();
});