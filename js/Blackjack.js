let blackjackGame = {
    "you":{"scoreSpan": "#your-score", "div":"#your-box-div", "score": 0},
    "computer": {"scoreSpan":"#computer-score", "div":"#computer-box-div", "score":0},
    "card": ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"],
    "cardScores": {"2" : 2, "3" : 3, "4" : 4, "5" : 5, "6" : 6, "7" : 7, "8" : 8, "9" : 9, "10" : 10, "J" : 10, "Q" : 10, "K" : 10, "A" : [1,11]},
    "wins": 0,
    "losses": 0,
    "draws": 0,
    "isHit": false,
    "isStand": false,
    "isTurnOver": false,
};


const YOU = blackjackGame["you"];
const COMPUTER = blackjackGame["computer"];

const hitSound = new Audio("sounds/swish.m4a");
const winSound = new Audio("sounds/cash.mp3");
const lossSound = new Audio("sounds/aww.mp3");
const drawSound = new Audio("sounds/draw.mp3");

document.querySelector("#hit-button").addEventListener("click", blackjackHit);

document.querySelector("#stand-button").addEventListener("click", blackjackStand);

document.querySelector("#reset-button").addEventListener("click", blackjackReset);


function blackjackHit(){
    if (blackjackGame["isStand"] === false){
        let card = randomCard();
        showCard(card, YOU);
        updateScore(card, YOU);
        displayScore(YOU);
        blackjackGame["isHit"] = true;
    }
}


function randomCard(){
    let pickRandomCard = Math.floor(Math.random() * 13);
    return blackjackGame["card"][pickRandomCard];
}


function showCard(card, activePlayer){
    if(activePlayer["score"] <= 21){
        let insertImage = document.createElement("img");
        insertImage.src = `images/${card}.png`;
        document.querySelector(activePlayer['div']).appendChild(insertImage);
        hitSound.play();
    }
}


function blackjackReset(){
    if(blackjackGame["isTurnOver"] === true){
        blackjackGame["isStand"] = false;

        let myCardsAdded = document.querySelector("#your-box-div").querySelectorAll("img");
        let computerCardsAdded = document.querySelector("#computer-box-div").querySelectorAll("img");

        for(i = 0; i < myCardsAdded.length; i++){
            myCardsAdded[i].remove();
        }
        for(i = 0; i < computerCardsAdded.length; i++){
            computerCardsAdded[i].remove();
        }

        YOU["score"] = 0;
        COMPUTER["score"] = 0;

        document.querySelector("#your-score").textContent = 0;
        document.querySelector("#computer-score").textContent = 0;
        
        document.querySelector("#your-score").style.color = "white";
        document.querySelector("#computer-score").style.color = "white";

        document.querySelector("#blackjack-result-display").textContent = "Let's Play!";
        document.querySelector("#blackjack-result-display").style.color = "black";

        blackjackGame["isTurnOver"] = false;
        blackjackGame["isHit"] = false;
        }
    }


    function updateScore(card, activePlayer){
        if(card === "A"){
            //Adds '11' if the score becomes <= 21; otherwise adds '1'
            if(activePlayer["score"] + blackjackGame["cardScores"][card][1]  <= 21){
                activePlayer["score"] += blackjackGame["cardScores"][card][1];
            }else{
                activePlayer["score"] += blackjackGame["cardScores"][card][0];
            }
        }else {
            activePlayer["score"] += blackjackGame["cardScores"][card];
    }
}


function displayScore(activePlayer){
    if(activePlayer["score"] > 21){
        document.querySelector(activePlayer["scoreSpan"]).textContent = "BUST!";
        document.querySelector(activePlayer["scoreSpan"]).style.color = "red";
        
    }else{
        document.querySelector(activePlayer["scoreSpan"]).textContent = activePlayer["score"];
    }
}


function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}


async function blackjackStand(){
    if (blackjackGame["isHit"] === true){
        blackjackGame["isStand"] = true;

        while ((COMPUTER["score"] < 16) && (blackjackGame["isStand"] === true)){
            let card = randomCard();
            showCard(card, COMPUTER);
            updateScore(card, COMPUTER);
            displayScore(COMPUTER);
            await sleep(1000);
        }
        
        blackjackGame["isTurnOver"] = true;
        let winner = decideWinner();
        displayResult(winner);
    }
}


function decideWinner(){
    let winner;
    //if YOU did not bust!
    if (YOU["score"] <= 21){
        if((YOU["score"] > COMPUTER["score"]) || (COMPUTER["score"] > 21)){
            blackjackGame["wins"]++;            //updates the wins, losses and draws.
            winner = YOU;
        }else if(YOU["score"] < COMPUTER["score"]){
            blackjackGame["losses"]++;          //updates the wins, losses and draws.
            winner = COMPUTER;
        }else if (YOU["score"] === COMPUTER["score"]){
            blackjackGame["draws"]++;           //updates the wins, losses and draws.
        }
    }else if (YOU["score"] > 21){            //if YOU busts!
        if (YOU["score"] > 21 && COMPUTER["score"] <= 21){
            blackjackGame["losses"]++;          //updates the wins, losses and draws.
            winner = COMPUTER;
        }else if (YOU["score"] >21 && COMPUTER["score"] > 21){
            blackjackGame["draws"]++;           //updates the wins, losses and draws.
        }
    }
    return winner;
}


function displayResult(winner){
    let message, messageColor;
    if (blackjackGame["isTurnOver"] === true){
        if (winner === YOU){
            document.querySelector("#wins-count").textContent = blackjackGame["wins"];
            message = "You Won!";
            messageColor = "green";
            winSound.play()
        }else if (winner === COMPUTER){
            document.querySelector("#losses-count").textContent = blackjackGame["losses"];
            message = "You Lost!";
            messageColor = "red";
            lossSound.play();
        }else{
            document.querySelector("#draws-count").textContent = blackjackGame["draws"];
            message = "You Drew!";
            messageColor = "gold";
            drawSound.play();
        }
    }

    document.querySelector("#blackjack-result-display").textContent = message;
    document.querySelector("#blackjack-result-display").style.color = messageColor;
}