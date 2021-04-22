Moralis.initialize('V72IuyWsaYclkUWnzU7JdLkfSZqyArobvyU4OKOg'); // Application id from moralis.io
Moralis.serverURL = 'https://03i7vk4ziens.moralis.io:2053/server'; //Server url from moralis.io

const tabele = document.getElementsByClassName('case-details')[0];

function globaNumber() {
  var url = new URL(window.location.href).href;
  return url.substring(url.lastIndexOf('d') + 1);
}

var globalCaseNumber = globaNumber();

function showCase(
  _number,
  _title,
  _stringAlternatives,
  _description,
  _endDate,
  _totalVotes,
  _UintAlt,
  _stratDate
) {
  var totalVotes = { totalVotes: _totalVotes };
  w3.displayObject('total-votes-vote', totalVotes);

  var caseNum = { proposal_number: _number };
  w3.displayObject('case-num-vote', caseNum);

  var timeLeft = { timeLeft: timeIt(_stratDate) };
  w3.displayObject('time-left-vote', timeLeft);

  const cardy = document.createElement('ul');
  const caseTitle = document.createElement('h2');
  caseTitle.innerText = _title;
  cardy.appendChild(caseTitle);
  cardy.className = 'casey';

  const caseDes = document.createElement('textarea');
  caseDes.innerText = _description;
  caseDes.disabled = true;
  cardy.appendChild(caseDes);

  for (let i = 0; i < _stringAlternatives.length; i++) {
    const card = document.createElement('li');
    const labelInput = document.createElement('input');
    labelInput.type = 'radio';
    labelInput.id = 'option' + i;
    labelInput.name = 'selector';
    labelInput.value = i;
    var now = new Date().getTime();
    if (_endDate * 1000 < now) {
      labelInput.disabled = true;
      disapleButtons();
    }
    if (i == 0) {
      labelInput.checked = 'checked';
    }

    const caseLabel = document.createElement('label');
    caseLabel.innerHTML = _stringAlternatives[i];
    caseLabel.setAttribute('for', 'option' + i);

    const div2 = document.createElement('div');
    div2.className = 'check';

    card.append(labelInput);
    card.append(caseLabel);
    card.append(div2);
    cardy.appendChild(card);
  }

  console.log(cardy);
  return cardy;
}
function timeIt(date) {
  var countDownDate = date * 1000;
  // Get today's date and time
  var now = new Date().getTime();
  // Find the distance between now and the count down date
  var distance = countDownDate - now;
  // Time calculations for days, hours, minutes and seconds
  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);
  console.log(days, hours, minutes, seconds);
  //Change the color of Time Bar based on date
  if (days < 0 || hours < 0 || minutes < 0) {
    data();
    return 'Case Closed';
  }
  if (days == 0) {
    return [hours + ' H ' + minutes + ' M '];
  } else if (hours == 0) {
    return [+minutes + ' M ' + seconds + 'S'];
  } else {
    return [days + ' D ' + hours + ' H '];
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
          element.attributes.totalVotes,
          element.attributes.UintAlt,
          element.attributes.startDate
        )
      );
    }
  });
}

async function vote(caseNumber, alternative) {
  window.web3 = await Moralis.Web3.enable();
  let abi = await getAbi();
  let contractInstance = new web3.eth.Contract(abi, contractAddress);
  contractInstance.methods
    .vote(caseNumber, alternative)
    .send({ from: ethereum.selectedAddress })
    .on('receipt', function (receipt) {
      console.log(receipt);
      if (receipt.events.confirmationE.returnValues.confirmation) {
        alert(receipt.events.confirmationE.returnValues.confirmation);
        let resultArray =
          receipt.events.casesWaitingForApprovalE.returnValues
            .casesWaitingForApproval;
        try {
          updateMoralis(caseNumber, resultArray);
          alert('Moralis is updated');
        } catch (error) {
          console.log('Moralis is NOT updated: ' + error);
        }
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
  vote(globalCaseNumber, selected.value);
}

document.getElementById('confirm-myVote').onclick = showResult;

const caseTilteFiled = document.getElementById('case-title');
const alternative_1_Field = document.getElementById('alt1');
const alternative_2_Field = document.getElementById('alt2');
const alternative_3_Field = document.getElementById('alt3');
const alternative_4_Field = document.getElementById('alt4');
const alternative_5_Field = document.getElementById('alt5');

const caseNumber = document.getElementById('proposal-number');

const result = document.getElementById('h1');

async function updateMoralis(_caseNum, _resultArray) {
  let reuslt = await Moralis.Cloud.run('Cases', {});
  let ID;
  reuslt.forEach((element) => {
    if (element.attributes.caseNumber == _caseNum) ID = element.id;
  });
  const CaseOne = Moralis.Object.extend('Cases');
  const TheCase = new CaseOne();

  TheCase.set('objectId', ID);
  TheCase.save().then((gameScore) => {
    gameScore.set('uintAlt', _resultArray);
    return gameScore.save();
  });
}

async function getMyVote(_caseNumber) {
  let reuslt = await Moralis.Cloud.run('Cases', {});
  window.web3 = await Moralis.Web3.enable();
  let abi = await getAbi();
  let contractInstance = new web3.eth.Contract(abi, contractAddress);
  contractInstance.methods
    .getMyVote(_caseNumber)
    .send({ from: ethereum.selectedAddress })
    .on('receipt', function (receipt) {
      console.log(receipt);
      if (receipt.events.myVoteE.returnValues.votedAlternative != '') {
        alert(receipt.events.myVoteE.returnValues.votedAlternative);
        let vote = receipt.events.myVoteE.returnValues.votedAlternative;
        result.innerText = 'Your Have Voted: ' + vote;

        let array;
        reuslt.forEach((element) => {
          if (element.attributes.caseNumber == _caseNumber)
            array = element.attributes.stringAlt;
        });
        for (let i = 0; i < array.length; i++) {
          console.log(array[i]);
          if (array[i] == vote) {
            document.getElementById('option' + i).checked = 'checked';
          }
        }

        console.log(vote);
        return vote;
      }
    });
}

function disapleButtons() {
  document.getElementById('confirm-myVote').disabled = true;
  document.getElementById('change-myvote').disabled = true;
}

Moralis.Web3.onAccountsChanged(function (accounts) {
  location.hash = 'runLogOut';
  location.href = 'login.html' + location.hash;
});
window.addEventListener('load', function () {
  const loader = document.querySelector('.loader');
  loader.className += ' hidden';
});

// Chart
async function data() {
  let stringData;
  let intData;
  let reuslt = await Moralis.Cloud.run('Cases', {});
  reuslt.forEach((element) => {
    if (element.attributes.caseNumber == globalCaseNumber) {
      stringData = element.attributes.stringAlt;
      intData = element.attributes.uintAlt;
      console.log(intData);
    }
  });

  var data = [
    {
      x: stringData,
      y: intData,
      type: 'bar',
    },
  ];
  var layout = {
    title: 'Graph over result',
    showlegend: false,
  };

  Plotly.newPlot('myDiv', data, layout, { staticPlot: true });
}

getMyVote(globalCaseNumber);
AddCaseToPage(globalCaseNumber);
