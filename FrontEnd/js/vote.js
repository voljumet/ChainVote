Moralis.initialize('2xY2tmcdYBf3IdqY5Yuo74fSEyxigYSADL9Ywtrj'); // Application id from moralis.io
Moralis.serverURL = 'https://rnonp7vwlz3d.moralis.io:2053/server'; //Server url from moralis.io

const tabele = document.getElementsByClassName('case-details')[0];


function showCase(_number, _title, _stringAlternatives, _description, _endDate, _totalVotes) {
  var totalVotes = { totalVotes: _totalVotes };
  w3.displayObject('total-votes-vote', totalVotes); 

  var caseNum = { proposal_number: _number };
  w3.displayObject('case-num-vote', caseNum); 

  var timeLeft = { timeLeft: timeIt(_endDate*1000) };
  w3.displayObject('time-left-vote', timeLeft);

  const cardy = document.createElement('ul');
  const caseTitle = document.createElement('h2');
  caseTitle.innerText = _title;
  cardy.appendChild(caseTitle);
  cardy.className = 'casey';

  const caseDes = document.createElement('textarea');
  caseDes.innerText = _description;
  caseDes.disabled = true
  cardy.appendChild(caseDes);
  
  for (let i = 0; i < _stringAlternatives.length; i++) {
    const card = document.createElement('li');
    const labelInput = document.createElement('input');
    labelInput.type = 'radio';
    labelInput.id="option"+i;
    labelInput.name = 'selector';
    labelInput.value = i;
    if(i == 0 ){
      labelInput.checked = 'checked'
    }
    
    const caseLabel = document.createElement('label');
    caseLabel.innerHTML =_stringAlternatives[i] ;
    caseLabel.setAttribute("for","option"+i);
    

    const div2 = document.createElement('div');
    div2.className="check";

    

    card.append(labelInput);
    card.append(caseLabel);
    card.append(div2);
    cardy.appendChild(card)
    
  }
   console.log(cardy);
  return cardy;
 
  
}
function timeIt(date){
  var countDownDate = date
  // Get today's date and time
  var now = new Date().getTime();
  // Find the distance between now and the count down date
  var distance = countDownDate - now;
  // Time calculations for days, hours, minutes and seconds
  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);
  console.log(days,hours,minutes,seconds)
  //Change the color of Time Bar based on date

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

async function AddCaseToPage(_caseNumber) {
  
  let reuslt = await Moralis.Cloud.run('Cases', {});
  reuslt.forEach((element) => {
    if (element.attributes.caseNumber == _caseNumber) {
      tabele.appendChild(
        showCase(
          element.attributes.caseNumber,
          element.attributes.title,
          element.attributes.stringAlt,
          element.attributes.description,
          element.attributes.endDate,
          element.attributes.totalVotes
        )
      );
    }
    
  });
}

async function vote(caseNumber, alternative) {
  window.web3 = await Moralis.Web3.enable();
  let contractInstance = new web3.eth.Contract(window.abi, contractAddress);
  contractInstance.methods
    .vote(caseNumber, alternative)
    .send({ from: ethereum.selectedAddress })
    .on('receipt', function (receipt) {
      console.log(receipt);
      if (
        receipt.events.confirmationE.returnValues.confirmation ==
        'Vote has been registered'
      ) {
        alert(receipt.events.confirmationE.returnValues.confirmation);
      }
    });
}

async function getCaseInfo(_caseNumber) {
  let reuslt = await Moralis.Cloud.run('Cases', {});
  reuslt.forEach((element) => {
    if (element.attributes.caseNumber == _caseNumber) {
      caseTilteFiled.innerHTML = element.attributes.title;
      var myObject = { proposal_number: _caseNumber };
      w3.displayObject('id03', myObject);

      console.log(element.attributes.stringAlt[0]);
    }
  });
}

function showResult() {
  let selected = document.querySelector('input[type="radio"]:checked');
    vote(1,1)
  result.innerText = selected.value;
  console.log(selected );
}

document.getElementById("confirm-myVote").onclick= showResult

const caseTilteFiled = document.getElementById('case-title');
const alternative_1_Field = document.getElementById('alt1');
const alternative_2_Field = document.getElementById('alt2');
const alternative_3_Field = document.getElementById('alt3');
const alternative_4_Field = document.getElementById('alt4');
const alternative_5_Field = document.getElementById('alt5');

const caseNumber = document.getElementById('proposal-number');


const result = document.getElementById('h1');

AddCaseToPage(1);

document.getElementById('vote_').onclick = function () {
  vote(
    document.getElementById('caseNumber4').value,
    document.getElementById('alternative').value
  );
};

