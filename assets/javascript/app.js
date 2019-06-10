$(document).ready(function(){

    //firebase config info
    const fbConfig = {
        apiKey: "AIzaSyDO1LjkDTI1kHBokq5OoLnSTMxg-4m14AM",
        authDomain: "birnarpsgame.firebaseapp.com",
        databaseURL: "https://birnarpsgame.firebaseio.com",
        projectId: "birnarpsgame",
        storageBucket: "birnarpsgame.appspot.com",
        messagingSenderId: "25115998215"
    };
    
    //variables 
    let database = "";
    let numPlayers = 0;
    let playerDes = "";
    let playersDB = "";
    let msgesDB = "";

    //player class to hold player data 
        //(name, wins, losses, ties, last move)
    let player = function(name) {
        this.name = name;
        this.wins = 0;
        this.losses = 0;
        this.ties = 0;
        this.lastMove = "";
    };

    //message class to create objects for each msg
        //(who sent the message and what did they say)
    let message = function(chat, sender = 'anonymous') {
        if(sender!='admin'){
            if (playerDes != ""){
                sender = playerDes;
            }
        }
        this.sender = sender
        this.message = chat;
        this.time = new Date().toLocaleTimeString();
        console.log(this.sender +":"+ chat);
    };
        
    //initialize the app with firebase to be able to store information
    let init = function() {
        firebase.initializeApp(fbConfig);
        database = firebase.database();
        //database location for current players
        playersDB = database.ref('players/');        
        //database location for chat messagges
        msgesDB = database.ref('messages/');     
    };
    //run the function    
    init();

        //function to take in new player when "enter" is clicked
            //have user re-enter a name if field is left blank
            //valid name -> insert player into database and make UI changes

        //function to take in player's RPS choice
            //store the player's moves
            //check if both players have went
            //get result
            //update UI with the correct changes

        //chatroom functionality
            //prevent page refresh
            //show msges on interface once sent
            //prevent blank messages
            //make message object
            //clear msg box in UI
        
        //function to update player data

        //function to enable RPS buttons when there are two players

        //function to calculate who won based on "last move" property

        //function to update results, wins, losses, and ties in UI
});