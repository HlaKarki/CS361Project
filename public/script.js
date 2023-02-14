let currentUrl = window.location.href;
let word_length = '4'
let attempt_setting = '3';
let chosenWord;
let currentWord = "";
let alphabets = ["a", "b", "d", "e", "f", "g",
    "h", "i", "k", "l", "m", "n",
    "o", "p", "r", "s", "t", "w"];


//***************** home page js **************************
if (currentUrl.indexOf("/index.html")!==-1 || currentUrl === "http://localhost:3000/") {
    const beginButton = document.getElementById("begin-button")
    const settingsButton = document.getElementById("settings-button")
    const aboutButton = document.getElementById("about-button")

    beginButton.addEventListener("click", function () {
        window.location.href = "/gameplay.html";
    })

    settingsButton.addEventListener("click", function (){
        window.location.href = "/settings.html"
    })

    aboutButton.addEventListener("click", function (){
        window.location.href = "/about.html"
    })
}


//***************** settings page js **************************
if (currentUrl.indexOf("/settings.html")!==-1) {
    const allowed_attempts = document.getElementById("allowed-attempts-number");
    const word_lengthId = document.getElementById("word-length-number")

    const settingDone = document.getElementById("settings-done-button")
    settingDone.addEventListener("click", function() {
        // console.log("from settings.html, attempts-settings:", allowed_attempts.value)
        localStorage.setItem("attempts", allowed_attempts.value)
        attempt_setting = allowed_attempts.value

        // console.log("from settings.html, word_length:", word_lengthId.value)
        localStorage.setItem("word-length", word_lengthId.value)
        word_length = word_lengthId.value
        window.location.href = "/index.html";
    })
}
//*************************************************************



//***************** gameplay page js **************************
else if (currentUrl.indexOf("/gameplay.html")!==1) {
    console.log("starting stats")
    console.log("   attempt_setting:", attempt_setting)
    console.log("   word_length:", word_length)

    const buttons = document.getElementsByClassName("input");
    const gameplay_attempts_left = document.getElementById("gameplay-attempts-left");
    const user_input_container = document.querySelector(".user-input");
    const user_input_A = user_input_container.querySelectorAll("label");
    const newWordButton = document.getElementById("new-word-button")
    const gameHomeButton = document.getElementById("gameplay-home-button")

    const guess = document.getElementById("guessit");
    const erase = document.getElementById("erase");
    let guessedWord = "";
    let userAnswer = ""

    if (localStorage.getItem("attempts")) {
        console.log("attempt setting was updated in settings page")
        attempt_setting = localStorage.getItem("attempts");
    }

    let attempts_left = attempt_setting

    if (localStorage.getItem("word-length")) {
        console.log("word length was updated in settings page")
        word_length = localStorage.getItem("word-length");
    }

    console.log("from gameplay, attempts_left: ", attempts_left)
    console.log("from gameplay, word_length: ", word_length)
    gameplay_attempts_left.textContent = "Attempts left: " + attempts_left


    fetchWord(word_length)
        .then(word => {

            if(!buttons.length){
                console.log("No buttons found with class name 'input'")
            }else{
                for (let i = 0; i < buttons.length; i++) {
                    buttons[i].textContent = alphabets[i]

                    buttons[i].addEventListener("click", function() {
                        // Code to run when any button is clicked
                        const ranWord = this.textContent;
                        console.log("a button was clicked:", this.textContent)
                        for (let j = 0; j < user_input_A.length; j++) {
                            if (user_input_A[j].textContent === "_") {
                                user_input_A[j].textContent = ranWord
                                userAnswer += ranWord
                                break;
                            }
                        }
                        this.textContent = "-"
                    });
                }
            }
        })


    guess.addEventListener("click", function (){
        console.log("attempts settings:", attempt_setting)
        guessedWord = ""
        let lean = true;
        let addOrNot = true;
        if (attempts_left < 1) {
            alert("You have used all the attempts!")
        }
        else {
            for (let j = 0; j < word_length; j++) {
                if (user_input_A[j].textContent === "_") {
                    alert("Please select all the letters of the word first")
                    lean = false;
                    addOrNot = false;
                    break;
                }
                else {
                    guessedWord += user_input_A[j].textContent
                }
            }
            if (lean && attempts_left >0) {
                if (guessedWord === chosenWord) {
                    addOrNot = false
                    currentWord = ""
                    let result = confirm("Amazing!\nYou've successfully guessed the word!It was indeed \"" + chosenWord.toUpperCase()+"\"!\nWould you like to try a new word?")
                    if (result === true ){
                        attempts_left = reset(attempts_left, gameplay_attempts_left)
                        updateRandomList(buttons)
                        userAnswer = ""
                    }
                    else {
                        goBackHome();
                    }
                }
                else {
                    if(attempts_left <= 1) {
                        addOrNot = false
                        currentWord = ""
                        let result = confirm("Sorry :( You used up all the attempts.\nThe word to be guessed was \"" + chosenWord.toUpperCase()+"\"\nWould you like to try guessing another word?")
                        if (result === true) {
                            attempts_left = reset(attempts_left, gameplay_attempts_left)
                            updateRandomList(buttons)
                            userAnswer = ""
                        }
                        else {
                            goBackHome();
                        }
                    }
                }
                for (let j = 0; j < word_length; j++) {
                    if(user_input_A[j].style.background !== "green"){
                        user_input_A[j].textContent = "_"
                    }
                    else {
                        userAnswer[j] = chosenWord[j]
                    }
                }
            }

            if (addOrNot) {
                console.log("UserAnswer:", userAnswer)
                attempts_left = (parseInt(attempts_left)-1).toString()
                gameplay_attempts_left.textContent = "Attempts left: " + attempts_left

                const answerDiv = document.getElementById("answer_container")
                const div = document.createElement("div");

                for (let i = 0; i < word_length; i++) {
                    const label = document.createElement("label")
                    label.textContent = guessedWord[i]
                    if (label.textContent === chosenWord[i]) {
                        label.style.background = "green";
                        alphabets[alphabets.indexOf(guessedWord[i])] = "_"
                        updateRandomList(buttons)
                        user_input_A[i].textContent = chosenWord[i]
                        user_input_A[i].style.background = "green";
                        currentWord += chosenWord[i]
                    }
                    else if (chosenWord.indexOf(userAnswer[i]) !== -1) {
                        label.style.background = "yellow"
                    }
                    else {
                        alphabets[alphabets.indexOf(userAnswer[i])] = "_"
                        updateRandomList(buttons)
                    }
                    div.appendChild(label)


                }
                answerDiv.appendChild(div)
                userAnswer = ""
            }

        }
        console.log("guessed word: ", guessedWord)

    })

    erase.addEventListener("click", function (){
        for (let j = user_input_A.length-1; j > -1; j--) {
            if (user_input_A[j].textContent !== "_") {
                user_input_A[j].textContent = "_"
                break;
            }
        }
        userAnswer = userAnswer.substring(0, userAnswer.length - 1);
    })

    newWordButton.addEventListener("click", function() {
        attempts_left = reset(attempts_left, gameplay_attempts_left)
        updateRandomList(buttons)
        userAnswer = ""
    })

    for (let j = 0; j < user_input_A.length; j++) {
        if (j>=word_length) {
            user_input_A[j].style.display = "none";
        }
    }

    gameHomeButton.addEventListener("click", goBackHome)
}

// *************************** helper functions ***************************
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function updateArrayW(word) {
    console.log("updateArrayW_word:", word)
    console.log("   before:", alphabets)
    for (let z = 0; z < word.length; z++) {
        alphabets[z] = word[z]
    }
    alphabets = shuffleArray(alphabets)
    console.log("   after:", alphabets)

    return word
}

function reset(attempts_left, gameplay_attempts_left) {
    attempts_left = attempt_setting
    gameplay_attempts_left.textContent = "Attempts left: " + attempts_left

    const deleteThis = document.getElementById("answer_container");
    const buttons = document.getElementsByClassName("input");

    while (deleteThis.firstChild) {
        deleteThis.removeChild(deleteThis.firstChild);
    }

    const h3 = document.createElement("h3");
    const text = document.createTextNode("Attempt history");
    h3.appendChild(text)
    deleteThis.append(h3)

    alphabets = ["a", "b", "d", "e", "f", "g",
        "h", "i", "k", "l", "m", "n",
        "o", "p", "r", "s", "t", "w"];

    fetchWord(word_length)
        .then(word => {
            console.log("from gameplay page:", word)

            // resetting the input buttons with the original alphabets
            for (let i = 0; i < buttons.length; i++) {
                buttons[i].textContent = alphabets[i]
            }
        })

    const user_input_container = document.querySelector(".user-input");
    const user_input_A = user_input_container.querySelectorAll("label");
    for (let i = 0; i < chosenWord.length; i++) {
        user_input_A[i].textContent = "_"
        user_input_A[i].style.background = "none";
    }

    return attempts_left
}

function goBackHome() {
    let indexURL = currentUrl.indexOf("/")
    window.location.href = currentUrl.substring(0, indexURL) + "index.html";
}

function updateRandomList(buttons){
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].textContent = alphabets[i].toLowerCase()
    }
}

async function fetchWord(word_length){
    await fetch("/word", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ word: word_length})
    })
        .then(response => response.json())
        .then(data => {
            console.log("received from server: ", data.responseString)
            chosenWord = data.responseString.toLowerCase()
            updateArrayW(chosenWord)
        })
    return chosenWord
}