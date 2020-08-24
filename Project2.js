$(document).ready(function () {   /* Make a request to get the data and display the main function */
    $.ajax({
        url: "https://api.coingecko.com/api/v3/coins",
        type: "get",
        success: function (coins) {
            console.log("Connected Succsessfully")
            console.log(coins); 
            displayAll(coins);
        },
        error: function () {
            console.log("Connection Failed");
        }
    })
})

function displayAll(coins) {
    let coinsArray = createCoinsArray(coins); /* Creating a variable that will keep the data  */
    $(".loader-wrapper").fadeOut("slow"); /* Make loader disappear */
    showCoinsUI(coinsArray); /* Create a UI from the data */
    displayButtons(coinsArray); /* Make the buttons menu to work */
    
}

function showCoinsUI(coinsArray) {
    let coinsArea = $("#dynamicCoinsArea");
    coinsArea.empty(); /* Delete whatever was displayed on the dynamic area */
    coinsArea.attr("class","scrollbar scrollbar-black bordered-black square"); /* bootstrap wrap */

    $(coinsArray).each(function (index , coin) { /* On each coin create this special card */
        // Create the main card box
        let singleCoinArea = $("<div>");
        singleCoinArea.attr("id",coin.id);
        singleCoinArea.css("border-radius","6px");
        singleCoinArea.css("background-image","url('/pics/image.jpg')");
        singleCoinArea.css("-moz-box-shadow" , "inset 0 0 100px #000000");
        singleCoinArea.css("-webkit-box-shadow" , "inset 0 0 100px #000000");
        singleCoinArea.css("box-shadow"," 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 40px 0 rgba(0, 0, 0, 0.19)")
        // singleCoinArea.css("background-size","cover"); /* not displayed for design reasons */
        singleCoinArea.css("width","240px");
        singleCoinArea.css("height","147px");
        singleCoinArea.css("display","inline-block");
        singleCoinArea.css("margin-right","10px");
        singleCoinArea.css("margin-left","10px");
        singleCoinArea.css("margin-top","5px");
        singleCoinArea.css("padding","5px");
        singleCoinArea.attr("class" , "card-body");
        singleCoinArea.css("transition", "0.25s");
        $(singleCoinArea).hover(function() {
            $(this).css("border","2px solid black");},
            function() {$(this).css("border","");}
        );
            
        // Adding the slider checkbox
        let sliderButtonArea = $("<label>");
        sliderButtonArea.attr("class" , "switch");
        sliderButtonArea.css("float" , "right");
        sliderButtonArea.css("margin-top" , "3px");
        let checkBox = $("<input>");
        checkBox.attr("type","checkbox");
        checkBox.attr("class","checkbox-"+coin.id); /* Giving the check box uniqe class, we will use it later */
        checkBox.addClass("coinCheckbox"); /* Giving the checkbox a non uniqe class, we will use it later */
        checkBox.attr("id",coin.id);
        let coinId = coin.id;

        // Checking if the coin is on the chosen coins at storage -
        //  for displaying the chosen coins as checked at search,
        //  and also after user navigation back from about/reports/search
        if (isCoinIsOneOfTheChosenCoins(coinId) == true) {
            checkBox.attr("checked","true");/* Display checkbox as checked */
        }
        // On each click the function will manage the chosen coins storage
        checkBox.click(manageCheckedCoinStorage); /* Spcial function that will work on every click */
        let slider = $("<span>");
        slider.attr("class" , "slider round");
        sliderButtonArea.append(checkBox);
        sliderButtonArea.append(slider);
        // Displaying coin details
        let coinSymbol = $("<h6>");
        coinSymbol.html((coin.symbol).toUpperCase());
        coinSymbol.css("display" , "inline-block");
        coinSymbol.css("font-weight","Bold");
        coinSymbol.css("padding-left" , "2px");
        coinSymbol.css("class","card-title");
        coinSymbol.css("text-shadow","2px 7px 5px rgba(0,0,0,0.3), 0px -4px 10px rgba(255,255,255,0.3)")
        let coinName = $("<div>");
        coinName.html(coin.name);
        coinName.css("font-size" , "11px");
        coinName.css("padding-bottom", "5px");
        coinName.css("font-weight","Bold");
        coinName.css("width", "100px");
        coinName.css("padding-left" , "2px");
        coinName.css("class","card-text");
        coinName.css("text-shadow","2px 7px 5px rgba(0,0,0,0.3), 0px -4px 10px rgba(255,255,255,0.3)");

        // displaying more info button
        let toggleRefernce = ("#"+coin.name);
        let moreInfoButton = $("<button>");
        moreInfoButton.html("More Info");
        moreInfoButton.attr("class","btn btn-primary btn-sm");
        moreInfoButton.css("margin-right","2%");
        moreInfoButton.attr("id",coin.id)
        moreInfoButton.css("display","inline-block")
        moreInfoButton.attr("type","button");
        moreInfoButton.attr("data-toggle","collapse");
        moreInfoButton.attr("data-target",toggleRefernce);
        moreInfoButton.css("float","right");
        // displaying more info output
        let moreInfoOutputArea = $("<div>");
        moreInfoOutputArea.attr("class" , "collapse");
        moreInfoOutputArea.attr("id" , toggleRefernce);
        moreInfoOutputArea.addClass("loader-"+coin.id)
        let loader = $("<div class='loader-div'></div>")
        loader.addClass("load-"+coin.id)
        let leftArea = $("<span>");
        leftArea.css("float" , "left");
        leftArea.css("text-align" , "left"); 
        leftArea.append(coinSymbol , coinName , loader) 
        // Flow after more info button is clicked
        moreInfoButton.click(function () {
            let id = this.id; /* Define an id variable of the button that was clicked, it's same as the coin id */
            $(".load-"+id).css("display","block");
            let clickedCoinData = getClickedCoinDataFromStorage(id);
            if (clickedCoinData == null) { /* If the coin wasn't on storage - do this functions */
            flowOfNewClickedCoinMoreInfo(id); /* Main flow new info from api */
            }
            else{
                displayMoreInfo(id);
            }
        })           
        leftArea.append(moreInfoOutputArea);
        singleCoinArea.append(sliderButtonArea,moreInfoButton,leftArea);
        coinsArea.append(singleCoinArea);
    })

    function deleteCoinFromStorage(id) {/* Taking the wanted coin and delete it from storage */
        let clickedMoreInfoCoinsArray = JSON.parse(sessionStorage.getItem("Clicked More info coins"));
        $(clickedMoreInfoCoinsArray).each(function (index,coin) {
            if (coin.id == id) {
                clickedMoreInfoCoinsArray.splice(index,1);
            }
        })
        sessionStorage.setItem("Clicked More info coins" , JSON.stringify(clickedMoreInfoCoinsArray));
    }

    function isCoinIsOneOfTheChosenCoins(coinId) { /* Checking if Wanted coin is in the chosen coins storage*/
        let chosenCoins = JSON.parse(sessionStorage.getItem("Chosen coins"));
        if (chosenCoins == null) {
            return false;
        }
        for (let index = 0; index < chosenCoins.length; index++) {
            if (coinId == chosenCoins[index]) {
                return true;
            }
        }
        return false;
    }

    // This function give the coin data from the storage of the coins that already been clicked for more info
    function getClickedCoinDataFromStorage(id) { 
        let clickedMoreInfoCoinsArray = JSON.parse(sessionStorage.getItem(("Clicked More info coins")));
        if (clickedMoreInfoCoinsArray == null) {
            return null;
        }
        for (let index = 0; index < clickedMoreInfoCoinsArray.length; index++) {
            if (id == clickedMoreInfoCoinsArray[index].id) {
            return clickedMoreInfoCoinsArray[index];
            }
        }
        return null; /* Means that the clicked coin wasnt on the storage */
    }

    function flowOfNewClickedCoinMoreInfo(id) { /* Get the new clicked coin data */
        $.ajax({
            url: "https://api.coingecko.com/api/v3/coins/"+id,
            type: "get",
            success: function (coinData) {
                getCurrentCoinRequiredData(coinData , id);
                return;
            },
            error: function () {
                return "Somthing went wrong";
            }
        })
    }

    // Make an object of the specific data that we want
    function getCurrentCoinRequiredData(coinData,id) {
        let specificData = getSpecificData(coinData,id)
        putMoreInfoClickedCoinInStorage(specificData , id)
        setTimeout(function(){ deleteCoinFromStorage(id); }, 120000);
        displayMoreInfo(id);    
    }
    // Take the data the we want from the data that we got from the api
    function getSpecificData(coinData,id) {
        let moreInfoText = {
        id : id,
        name: coinData.name,
        usd: coinData.market_data.current_price.usd ,
        eur: coinData.market_data.current_price.eur , 
        ils: coinData.market_data.current_price.ils,
        pic: coinData.image.thumb
        }
        return moreInfoText;
    }

    function displayMoreInfo(id) {
        $(".load-"+id).css("display","none");
        let clickedMoreInfoCoinsArray = JSON.parse(sessionStorage.getItem(("Clicked More info coins"))); 
            $(clickedMoreInfoCoinsArray).each(function (index , clickedCoin) {
                if (id == clickedCoin.id) { /* Do the following only on the current clicked coin */
                let coinPicture = $("<img>");
                coinPicture.attr("src",clickedCoin.pic);
                coinPicture.css("float","right");
                let clickedCoinText = $("<p>");
                clickedCoinText.html("USD: "+clickedCoin.usd+"$<br>EUR: "+ clickedCoin.eur+"€<br>ILS: "+clickedCoin.ils+"₪");
                clickedCoinText.css("text-shadow","2px 7px 5px rgba(0,0,0,0.3), 0px -4px 10px rgba(255,255,255,0.3)")
                clickedCoinText.css("font-size","12px");
                clickedCoinText.css("font-weight","Bold");
                $(".loader-"+id).empty();
                $(".loader-"+id).append(coinPicture , clickedCoinText);
                }
            })
            $(".loader-"+id).toggle(); 
    }
    
    // Take the new coin data and update the storage with his details
    function putMoreInfoClickedCoinInStorage(clickedCoinData , id) {
        let clickedMoreInfoArray = JSON.parse(sessionStorage.getItem("Clicked More info coins"));
        if (clickedMoreInfoArray == null) {
            clickedMoreInfoArray = [];
        }
        // If coin is already in storage, stop the function
        for (let index = 0; index < clickedMoreInfoArray.length; index++) {
            if (id == clickedMoreInfoArray[index].id) {
                return;
            }
        }
        clickedMoreInfoArray.push(clickedCoinData); /* Add coin to array and then update storage */
        sessionStorage.setItem("Clicked More info coins" , JSON.stringify(clickedMoreInfoArray));
        return;
    }
    // Manage storage of the chosen coins 
    function manageCheckedCoinStorage() {
        let coinId = (this.id);
        let chosenCoinsArray = JSON.parse(sessionStorage.getItem("Chosen coins"));
        if (this.checked == true) {
            if (chosenCoinsArray == null) {
                chosenCoinsArray = []; /* If there is not a chosen coins array in storage, create an array */
            }            
            if (chosenCoinsArray.length < 5) { /* If the array is less then 5, add it to the storge */
                chosenCoinsArray.push(coinId);
                sessionStorage.setItem("Chosen coins" , JSON.stringify(chosenCoinsArray));
            }
            else{ /* Getting here means that the user tried to choose more than 5 coins */
                this.checked = false; /* Keep the checkbox unchecked */
                popWindow(coinId);
                $('#myModal').modal("show");
            }       
        }
        else{ /* Deleting the coin from storage because the checked box is unchecked */
            $(chosenCoinsArray).each(function (index , item) {
                if (item == coinId) {
                    chosenCoinsArray.splice(index,1);
                    sessionStorage.setItem("Chosen coins" , JSON.stringify(chosenCoinsArray));
                }
            })
        }
    }
    function popWindow(coinId) {
        // Creartion of the modal 
        let modal = `<div id="myModal" class="modal fade" role="dialog" data-backdrop="static" data-keyboard="false">
        <div class="modal-dialog"><div class="modal-content"><div class="modal-header">
        <h4 class="modal-title">Please Choose only 5 coins</h4></div><div class="modal-body"><div id="optionsArea"></div>
        </div><div class="modal-footer"><button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
        <button type="button" id="saveChanges" class="btn btn-primary"    data-dismiss="modal">Save Changes</button>
        </div></div></div></div>`;
        $("#optionsArea").empty(); /* Init the Changing coins area in the modal */
        $("body").append(modal);
        // Create a copy of the chosen coins array
        let temporaryChosenCoinsArray = JSON.parse(sessionStorage.getItem("Chosen coins")); 
        temporaryChosenCoinsArray.push(coinId); /* Adding the 6th coin to the array, just to show him as well at the modal */
        $(".modal-content").css("background-image","url('/pics/image.jpg')"); 
        $(temporaryChosenCoinsArray).each(function (index , coin) { /* Create spcial div to each chosen coin */
            let choosenCoinDiv = $("<div>");
            choosenCoinDiv.css("border", "1px solid black");
            choosenCoinDiv.css("border-radius", "4px");
            choosenCoinDiv.css("background-color", "aqua");
            choosenCoinDiv.css("margin-left", "15%");
            choosenCoinDiv.css("margin-right", "15%");
            choosenCoinDiv.css("margin-top", "2%");
            choosenCoinDiv.css("transition", "0.25s");
            $(choosenCoinDiv).hover(function(){
                $(this).css("background-color", "aliceblue");
                $(this).css("margin-left", "13%");
                $(this).css("margin-right", "13%");
                }, function(){
                $(this).css("background-color", "aqua");
                $(this).css("margin-left", "15%");
                $(this).css("margin-right", "15%");
            });
            let coinName = $("<span>");
            let nameCapitaized = (coin.charAt(0).toUpperCase()) + coin.slice(1);/* Make first letter capitalized */
            coinName.html(nameCapitaized);
            coinName.css("font-weight","Bold");
            coinName.css("font-size","20px");
            let sliderButtonArea = $("<label>");
            sliderButtonArea.attr("class" , "switch");
            sliderButtonArea.css("float" , "right");
            sliderButtonArea.css("margin-top", "3.8px");
            sliderButtonArea.css("margin-right" , "3px");
            let checkBox = $("<input>");
            checkBox.attr("type","checkbox");
            if (coin != coinId) { /* Setting all the checkboxes as checked besides the 6th coin */
                checkBox.attr("checked","true"); 
            }
            checkBox.attr("id",coin);
            checkBox.click(manageTemporaryChosenCoinsArray);/* Spcial function that will work on every click */
            let slider = $("<span>");
            slider.attr("class" , "slider round");
            sliderButtonArea.append(checkBox);
            sliderButtonArea.append(slider);
            choosenCoinDiv.append(sliderButtonArea);
            choosenCoinDiv.append(coinName);
            $("#optionsArea").append(choosenCoinDiv);
        })
        $("#saveChanges").click(function () { /* On save -  */
                let temporaryChosenCoinsArray = JSON.parse(sessionStorage.getItem("Temporary Chosen Coins Array"));
                if (temporaryChosenCoinsArray == null) {
                return;
                }
                sessionStorage.setItem("Chosen coins" , JSON.stringify(temporaryChosenCoinsArray));
                updateChosenCheckboxes();
            })
        updateTemporaryArrayInStorage();
    }
    function updateChosenCheckboxes() {
        initCheckBoxes()
        markNewCheckboxes()
    }
    function initCheckBoxes() { /* Take all the checkboxes and mark them as unchecked */
        $(".coinCheckbox").attr("checked",false);
    }
    function markNewCheckboxes() {/* Take only the new chosen coins after the modal save - and mark them as checked */
        let allCoinsArray = JSON.parse(sessionStorage.getItem("Coins Array"));/* Take all coins */
        for (let index = 0; index < allCoinsArray.length; index++) {/* Run on each one of them */
            if (isCoinIsOneOfTheChosenCoins(allCoinsArray[index].id)) {/* Check if coin is on the updated chosen coins */
                $(".checkbox-"+(allCoinsArray[index].id)).prop("checked",true);/* If it is chosen - Display checkbox as checked */
                console.log(".checkbox-"+(allCoinsArray[index].id));
            }          
        }
    }
    function updateTemporaryArrayInStorage() { /* Switch between the old array to the new one */
        let temporaryChosenCoinsArray = JSON.parse(sessionStorage.getItem("Chosen coins"));
        sessionStorage.setItem("Temporary Chosen Coins Array" , JSON.stringify(temporaryChosenCoinsArray));
    }
    function manageTemporaryChosenCoinsArray() {
        let coinId = (this.id);
        let temporaryChosenCoinsArray = JSON.parse(sessionStorage.getItem("Temporary Chosen Coins Array"));
        if (this.checked == false) {/* if coin unmarked - delete from array and update */
            for (let index = 0; index < temporaryChosenCoinsArray.length; index++) {
                if (coinId == temporaryChosenCoinsArray[index]) {
                    temporaryChosenCoinsArray.splice(index,1);
                    sessionStorage.setItem("Temporary Chosen Coins Array" , JSON.stringify(temporaryChosenCoinsArray));
                }
            }
        }
        else {
            if (temporaryChosenCoinsArray.length < 5) {
                temporaryChosenCoinsArray.push(coinId); /* If coin marked - add to array and update */
                sessionStorage.setItem("Temporary Chosen Coins Array" , JSON.stringify(temporaryChosenCoinsArray));
            }
            else{
                this.checked = false; /* Doesn't make the 6th chosen coin to be marked as checked */
            }
        }        
    }    
}
function createCoinsArray(coins) { /* Create all coins array in storage */
    let coinsArray = [];
    $(coins).each(function (index , singleCoin) {
        coinsArray.push(singleCoin);
    })
    sessionStorage.setItem("Coins Array" , JSON.stringify(coinsArray));
    return coinsArray;
}
function displayButtons(coinsArray) { /* Display most of the buttons */
    displaySearch();/* Search function */
    $("#showCoins").click(function () {
        clearDynamicArea();
        showCoinsUI(coinsArray); /* Create the main coins again */
    })
    $("#showReports").click(function () {
        clearDynamicArea();
        createReportsArea();
    })
    $("#about").click(function () { /*A lot of css at the about area */
        clearDynamicArea();
        let myAboutArea = $("<div>");
        myAboutArea.attr("id","myAboutArea");
        myAboutArea.css("width" , "100%");
        myAboutArea.css("max-height" , "auto");   
        let myDescriptionArea = $("<div>");
        let title = $("<h2>");
        title.html("Hey !");
        let myText = $("<h4>");
        myText.html("My name is Roi Shapira <br> I'm 24 years old <br> and this is my project (;");
        let enjoyText = $("<h2>");
        enjoyText.html("Enjoy !");
        let myPic = $("<img>");
        myPic.attr("src" , "/pics/myPicture.JPG");
        myPic.css("width" , "100%");
        myPic.attr("id","myPic")
        myPic.css("max-width" , "500px");
        myPic.css("max-height" , "auto");
        myPic.css("float" , "right");
        myPic.css("margin","4%");
        myPic.css("box-shadow"," 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 30px 0 rgba(0, 0, 0, 0.19)")
        myPic.css("border-radius" , "15px");
        let secondPic = $("<img>");
        secondPic.attr("src" , "/pics/me.png");
        secondPic.css("width" , "100px");
        secondPic.css("height" , "100px");
        myDescriptionArea.css("border-radius" , "15px");
        myDescriptionArea.css("color","white")
        myDescriptionArea.css("text-shadow","5px 4px 4px black, 0 0 10px blue, 0 0 4px darkblue")
        myDescriptionArea.css("padding","4%");
        myDescriptionArea.css("padding","4%");
        myDescriptionArea.css("border","2.5px solid white")
        myDescriptionArea.css("background-image","url('/pics/image2.jpg')");
        myDescriptionArea.css("background-size", "cover")
        myDescriptionArea.css("margin","2%")
        myDescriptionArea.css("display","inline-block");
        $(myDescriptionArea).append(title);
        $(myDescriptionArea).append(myText);
        $(myDescriptionArea).append(enjoyText);
        $(myDescriptionArea).append(secondPic)
        myAboutArea.append(myDescriptionArea , myPic);
        myAboutArea.css("padding","3%");
        myAboutArea.css("background-image","url('/pics/image.jpg')");
        myAboutArea.css("border-radius" , "15px");
        myAboutArea.css("-moz-box-shadow" , "inset 0 0 100px #000000");
        myAboutArea.css("-webkit-box-shadow" , "inset 0 0 100px #000000");
        myAboutArea.css("box-shadow" , "inset 0 0 20px #000000");
        myDescriptionArea.css("box-shadow"," 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 30px 0 rgba(0, 0, 0, 0.19)")
        $("#dynamicCoinsArea").append(myAboutArea);
        $("#dynamicCoinsArea").css("text-align","center");
    })
}
function displaySearch() {
    $("#searchButton").click(function () {
        let coinsArray = JSON.parse(sessionStorage.getItem("Coins Array"));
        clearDynamicArea();
        let searchInput = $("#search").val();
        let capitalizedSearchInput = searchInput.toUpperCase();/* Setting var for capital search */
        let matchingResultArray = []; /* Result will enter this array */
        $(coinsArray).each(function (index , singleCoin) {
            let capitalizedCoinSymbol = singleCoin.symbol.toUpperCase(); /* Setting var for capital symbol */
            // Making it possible to search in capital or non capital symbol
            if (searchInput == singleCoin.symbol || capitalizedSearchInput == capitalizedCoinSymbol) {
                matchingResultArray.push(singleCoin);
                showCoinsUI(matchingResultArray); /* Create UI by from the result */
                $("#search").val("");
                return;
            }
        })
        if (matchingResultArray.length == 0) { /* If there no result */
            $("#search").val("");
            displaySorryImg(); /* Show this */
        }
    })
}
function displaySorryImg() {/* On no result for search - this function is displayed */
    let massageArea = $("<span>");
    let massage = $("<h2>");
    massage.html("We didn't find your coin");
    massage.css("background-color" , "white");
    massage.css("margin-left","23%");
    massage.css("margin-right","23%");
    massage.css("margin-top","4%");
    massage.css("border-radius","15px");
    massage.css("border","4px solid blue");
    let alertPicture = $("<img>");
    alertPicture.css("width" , "100%");
    alertPicture.css("max-width" , "400px");
    alertPicture.css("max-height" , "auto");
    alertPicture.attr("src","/pics/sorry.png");
    massageArea.append(massage)
    $("#dynamicCoinsArea").append(massageArea , alertPicture);
}
function clearDynamicArea() { /* Clean the main dynamic area */
    $("#dynamicCoinsArea").empty();
}
function createReportsArea() {
    let currentChosenCoins = JSON.parse(sessionStorage.getItem("Chosen coins"));/* Taking the chosen coins */
    if (currentChosenCoins == null || currentChosenCoins.length == 0) {/* If there is not any chosen coin - show this */
        let massageArea = $("<span>");
        let massage = $("<h2>");
        massage.html("Please choose at least one coin !");
        massage.css("background-color" , "yellow");
        massage.css("margin-left","23%");
        massage.css("margin-right","23%");
        massage.css("border-radius","15px");
        massage.css("border","4px solid red");
        massage.css("margin-top","10px");
        massage.css("-webkit-text-stroke" , "0.5px white")
        let alertPicture = $("<img>");
        alertPicture.css("width" , "100%");
        alertPicture.css("max-width", "330px");
        alertPicture.css("max-heigth","auto");
        alertPicture.attr("src","/pics/alert pic.png");
        massageArea.append(massage)
        $("#dynamicCoinsArea").append(massageArea,alertPicture);
        return;
    }
    // Create an spcial area for graph and append it
    let reportsArea = $("<div>");
    reportsArea.attr("id","chartContainer");
    reportsArea.css("height","300px");
    reportsArea.css("width" , "100%");
    $("#dynamicCoinsArea").append(reportsArea);
    // The following rows get every chosen coin symbol by his id, and create an array of the chosen coin symbol
    let allCoinsArray = JSON.parse(sessionStorage.getItem("Coins Array"));
    let chosenCoinsSymbolId = [];
    for (let index = 0; index < currentChosenCoins.length; index++) {
       for (let i = 0; i < allCoinsArray.length; i++) {
           if (currentChosenCoins[index] == allCoinsArray[i].id) {
               chosenCoinsSymbolId.push(allCoinsArray[i].symbol);
               break;
           }
       }
    }
    // The following rows take the chosen coins symbol array and create a string
    //  with "," between them, for the ajax link later
    let idString = chosenCoinsSymbolId[0];
    console.log(idString);
    for (let index = 1; index < chosenCoinsSymbolId.length; index++) {
        idString = idString+","+chosenCoinsSymbolId[index];
        console.log(idString);
    }
    
    getUpdatedInfoForGraf(idString); /* Display the function that show the coins values on the graph */
    let coinsData = []; /* New array that will be an array of objects for the coins in the graph - will be on graph "Data"*/
    for (let index = 0; index < currentChosenCoins.length; index++) { 
        let upperCaseName = currentChosenCoins[index];  /* Take the name of the coin */
        upperCaseName = (upperCaseName.charAt(0).toUpperCase()) + upperCaseName.slice(1); /* Make his first letter upper case */
        coinsData.push({ /* Push an object of the coin to the coinsData array */
        type: "line",
        xValueType: "dateTime",
		name: upperCaseName,
        showInLegend: true,
        xValueFormatString: "hh:mm:ss TT",
		yValueFormatString: "#,##0 USD",
		dataPoints: [
            // This area will be updated every 2 seconds by the "getUpdatedInfoForGraf" function
		]
       });
    }    
    console.log(coinsData);
    // The main graph 
    var options = {
	animationEnabled: true,
	title:{
		text: "Chosen currencies:"
	},
	subtitles: [{
		text: "Click a coin to Hide his Data"
	}],
	axisX: {
        title: "",
        includeZero: false
	},
	axisY: {
		title: "Coins value in USD",
		titleFontColor: "#4F81BC",
		lineColor: "#4F81BC",
		labelFontColor: "#4F81BC",
		tickColor: "#4F81BC",
		includeZero: false
	},
	toolTip: {
		shared: true
	},
	legend: {
		cursor: "pointer",
		itemclick: toggleDataSeries
	},
    data: coinsData
    };
    $("#chartContainer").CanvasJSChart(options);
    function toggleDataSeries(e) {
	if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
		e.dataSeries.visible = false;
	} else {
		e.dataSeries.visible = true;
	}
	e.chart.render();
    }
    // Setting an inteval that make the main function every 2 seconds
    let myIntrerval = setInterval(function () { getUpdatedInfoForGraf(idString) }, 2000);

     function getUpdatedInfoForGraf(idString) { /* Get the update clicked coins data */
        $.ajax({
            url: "https://min-api.cryptocompare.com/data/pricemulti?fsyms="+idString+"&tsyms=usd",
            type: "get",
            success: function (updatedCoinsValue) {
                updateData(updatedCoinsValue);
                return;
            },
            error: function () {
                alert("Something went wrong, please check your internet connection")
                return;
            }
        })
    }

    function updateData(updatedCoinsValue) {
        let coinValueByUsd = (Object.values(updatedCoinsValue)); /* convert the data that we get from the api - to an array */
        for (let index = 0; index < chosenCoinsSymbolId.length; index++) { /* On each coin */
            // Push the specific data coin object to his dataPoints array
            options.data[index].dataPoints.push({x:  $.now() , y: coinValueByUsd[index].USD});
        }   
        if ($("#chartContainer").CanvasJSChart() == undefined) {/* If the graph as been deleted */
            clearInterval(myIntrerval);/* Stop the interval */
            return;
        }
	    $("#chartContainer").CanvasJSChart().render(); /* Update graph visuallcly */
    }   
}

