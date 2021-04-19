Moralis.initialize('2xY2tmcdYBf3IdqY5Yuo74fSEyxigYSADL9Ywtrj'); // Application id from moralis.io
Moralis.serverURL = 'https://rnonp7vwlz3d.moralis.io:2053/server'; //Server url from moralis.io
var web3 = new Web3(Web3.givenProvider);

const tabele = document.getElementsByClassName('container3')[0];


function createCard(_number, _title, _stratDate, _endDate, _description){


    const monthDiv = document.createElement('div');

    const month = document.createElement('u');
    month.innerHTML = getMyDate(_stratDate);


    const card = document.createElement('div');
    card.className ="card"; 

    
    window.onload = function() {
        
        localStorage.setItem("storageName",_number);
     }
    const tapNumber = document.createElement('h2');

    tapNumber.innerText = "Proposal " + _number;
    
    const ref = document.createElement('a');

    ref.setAttribute('href', "addAlternatives.html?id"+_number);

    const title= document.createElement('p');
    let txt = _title;
    title.innerHTML = txt.fontsize(5).fontcolor("black");

    const description= document.createElement('textarea');
    description.innerHTML = _description;
    description.disabled = true;

    const timeLeft = document.createElement('p');
    timeLeft.id = "time";
    var txt2= "Voting Starts in: ";
    timeLeft.innerHTML= txt2.fontsize(5).fontcolor("black")+ timeIt( _stratDate);

    const approveButton = document.createElement('button');
    approveButton.id=_number;
    approveButton.innerHTML= "Approve";
    approveButton.setAttribute("onclick", "approve("+_number+")")

    const moreInfo = document.createElement('button');
    moreInfo.id=_number;
    moreInfo.setAttribute("onclick","moreInfoy("+_number+")" );
    moreInfo.innerHTML= "More Info";

    const deleteCase = document.createElement('button');
    deleteCase.id=_number;
    deleteCase.className="deleteCase"
    deleteCase.setAttribute("onclick","delete_Case("+_number+")" );
    deleteCase.innerHTML= "Delete";

    const showMoreInfo = document.createElement("h4");
    showMoreInfo.id = "h"+_number;


    getMyDate(_stratDate);
  
    monthDiv.appendChild(month);
    card.appendChild(monthDiv);
    card.append(tapNumber);
    ref.appendChild(tapNumber);
    card.append(ref);
    card.append(title);
    card.append(description);
    card.append(timeLeft);
    card.appendChild(approveButton);
    card.appendChild(moreInfo)
    card.appendChild(showMoreInfo)
    card.appendChild(deleteCase)

    console.log(card)
    return card;
}

function timedRefresh(timeoutPeriod) {
	setTimeout("location.reload(true);",timeoutPeriod);
}

function getMyDate(t) {
    var month = new Array();
    month[0] = "January";
    month[1] = "February";
    month[2] = "March";
    month[3] = "April";
    month[4] = "May";
    month[5] = "June";
    month[6] = "July";
    month[7] = "August";
    month[8] = "September";
    month[9] = "October";
    month[10] = "November";
    month[11] = "December";
    
    var d = new Date(t/1*1000);
    var n = month[d.getMonth()];
    var y = d.getFullYear();
    return n + " "+ y;
  }

////////////////////////
function timeIt(date){
    var countDownDate = date*1000
    // Get today's date and time
    var now = new Date().getTime();
    // Find the distance between now and the count down date
    var distance = countDownDate - now;

    console.log(distance)
    // Time calculations for days, hours, minutes and seconds
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if(days < 0 || hours < 0 || minutes < 0){
        return "Case has started"
    }
    if (days == 0){
        return [ hours + " H "
        + minutes + " M "];
    } else if(hours == 0){
        return [
    + minutes + " M " + seconds + "S"];
    }else{
        return [days + " D " + hours + " H "];
    }
}

///////////////////////////
// Render Case Card on the Index page
async function AddCardsToPage() {
    let reuslt  = await Moralis.Cloud.run("Cases",{});
    console.log(reuslt);
    reuslt.forEach(element =>{
        if(element.attributes.openForVoting == false){
            tabele.appendChild(createCard(element.attributes.caseNumber,
                element.attributes.title,
                element.attributes.startDate,
                element.attributes.endDate,
                element.attributes.description
                
                ))
                //update moralis after approving
        }
    })
}
async function updateMoralis(_caseNum, _result) {
    let reuslt = await Moralis.Cloud.run('Cases', {});
    let ID;
    reuslt.forEach((element) => {
      if (element.attributes.caseNumber == _caseNum) ID = element.id;
    });
    const CaseOne = Moralis.Object.extend('Cases');
    const TheCase = new CaseOne();
  
    TheCase.set('objectId', ID);
    TheCase.save().then((gameScore) => {
      // Now let's update it with some new data. In this case, only cheatMode and score
      // will get sent to the cloud. playerName hasn't changed.
      gameScore.set('openForVoting', _result);
      return gameScore.save();
    });
    timedRefresh(1000)
  }

async function approve(_caseNumber) {
    let reuslt = await Moralis.Cloud.run('Cases', {});
    window.web3 = await Moralis.Web3.enable();
    let contractInstance = new web3.eth.Contract(window.abi, contractAddress);
    contractInstance.methods
      .approve(_caseNumber)
      .send({ from: ethereum.selectedAddress })
      .on('receipt', function (receipt) {
        console.log(receipt);
       let show = document.getElementById("show");
       let result = receipt.events.confirmationE.returnValues.confirmation;
       let approved_case_number = receipt.events.caseApprovedE.returnValues.caseNumber;
       let approved_case_title = receipt.events.caseApprovedE.returnValues.title;
       
       if(approved_case_title!="" )
       {
           show.innerText = "Limit: " + approved_case_number+ 
                              " ,Approvals: "+ approved_case_title; 
        updateMoralis(_caseNumber, true)
        alert("moralis is updated")
       }
      });
  }

async function moreInfoy(_caseNumber) {
    let reuslt = await Moralis.Cloud.run('Cases', {});
    window.web3 = await Moralis.Web3.enable();
    let contractInstance = new web3.eth.Contract(window.abi, contractAddress);
    contractInstance.methods
      .getApprovalsAndLimit(_caseNumber)
      .send({ from: ethereum.selectedAddress })
      .on('receipt', function (receipt) {
        console.log(receipt);
       let result = document.getElementById("h"+_caseNumber)
       let limit = receipt.events.approvalsE.returnValues.limit;
       let numberOfApprovals = receipt.events.approvalsE.returnValues.numberOfApprovals
            result.innerText =  "Approvals: "+ numberOfApprovals+ " of " + limit; 
      });
  }

  async function delete_Case(_caseNumber) {
    let reuslt = await Moralis.Cloud.run('Cases', {});
    window.web3 = await Moralis.Web3.enable();
    let contractInstance = new web3.eth.Contract(window.abi, contractAddress);
    contractInstance.methods
      .endVoting(_caseNumber)
      .send({ from: ethereum.selectedAddress })
      .on('receipt', function (receipt) {
        console.log(receipt);
       //let result = document.getElementById("h"+_caseNumber)
       //let limit = receipt.events.approvalsE.returnValues.limit;
       //let numberOfApprovals = receipt.events.approvalsE.returnValues.numberOfApprovals
         //   result.innerText =  "Approvals: "+ numberOfApprovals+ " of " + limit; 
      });
  }
  Moralis.Web3.onAccountsChanged(function(accounts) {
    // window.location.replace("http://www.w3schools.com");
    location.hash = "runLogOut";
    location.href = 'login.html' + location.hash ;
  
  });

  async function checkUserType() {
    user = await Moralis.User.current();
    if (user.get('UserType') == 'Standard') {
      location.href = 'accessDenied.html';
    } 
  }
  window.addEventListener("load", function(){
    const loader = document.querySelector(".loader");
    loader.className += " hidden"
  })
checkUserType();
AddCardsToPage()
//moreInfo(1)

 

hideElment = (element) => element.style.display = "none";
showElment = (element) => element.style.display = "block";

