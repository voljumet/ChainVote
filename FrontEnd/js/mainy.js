Moralis.initialize(initialize); // Application id from moralis.io
Moralis.serverURL = serverurl; //Server url from moralis.io

const tabele = document.getElementsByClassName('container2')[0];

function createCard(
  _number,
  _title,
  _stratDate,
  _endDate,
  _openForVoting,
  _uintAlt,
  _stingAlt
) {
  const monthDiv = document.createElement('div');

  const month = document.createElement('u');
  month.innerHTML = getCaseMonth(_stratDate);

  const card = document.createElement('div');
  card.className = 'card';

  const tapNumber = document.createElement('h2');

  tapNumber.innerText = 'Proposal ' + _number;

  const ref = document.createElement('a');

  ref.setAttribute('href', 'Vote.html?id' + _number);

  const title = document.createElement('p');
  let txt = _title;
  title.innerHTML = txt.fontsize(5).fontcolor('black');

  const pro = document.createElement('div');
  pro.id = 'myProgress';

  const bar = document.createElement('div');
  bar.id = 'myBar';

  const timeLeft = document.createElement('p');

  var txt2 = 'Time Left: ';
  timeLeft.innerHTML =
    txt2.fontsize(5).fontcolor('black') +
    calculateTimeLeft(_endDate, bar, _openForVoting);

  const openForVoting = document.createElement('p');
  var now = new Date().getTime();
  var value = _openForVoting.toString().toUpperCase();
  openForVoting.id = 'openForVoting';

  if (value == 'TRUE' && _endDate * 1000 > now) {
    openForVoting.innerHTML = 'Voting Open'.fontsize(5).fontcolor('black');
  } else if (value == 'FALSE' && _endDate * 1000 > now) {
    openForVoting.innerHTML = 'Opening Soon'.fontsize(5).fontcolor('black');
  } else if (value == 'FALSE' && _endDate * 1000 < now) {
    openForVoting.innerHTML = 'Voting Closed'.fontsize(5).fontcolor('black');
  }

  var voteResult = _stingAlt[indexOfMax(_uintAlt)];
  console.log('vote: ' + voteResult);
  const result = document.createElement('h2');
  result.innerHTML = 'Result: ' + voteResult;

  monthDiv.appendChild(month);
  card.appendChild(monthDiv);
  card.append(tapNumber);
  ref.appendChild(tapNumber);
  card.append(ref);
  card.append(title);
  card.append(timeLeft);
  card.append(pro);
  pro.appendChild(bar);
  card.appendChild(openForVoting);
  if (_endDate * 1000 < now) {
    card.appendChild(result);
  }

  return card;
}

function getCaseMonth(t) {
  var month = new Array();
  month[0] = 'January';
  month[1] = 'February';
  month[2] = 'March';
  month[3] = 'April';
  month[4] = 'May';
  month[5] = 'June';
  month[6] = 'July';
  month[7] = 'August';
  month[8] = 'September';
  month[9] = 'October';
  month[10] = 'November';
  month[11] = 'December';

  var d = new Date((t / 1) * 1000);
  var n = month[d.getMonth()];
  var y = d.getFullYear();
  return n + ' ' + y;
}

////////////////////////
function calculateTimeLeft(date, timeBar, _openForVoting) {
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

  //Change the color of Time Bar based on date
  if (
    (days <= 0) & (hours <= 0) & (minutes <= 0) & (seconds <= 0) ||
    isNaN(days)
  ) {
    timeBar.style.backgroundColor = 'gray';
    return 'Expired';
  }
  if ((days <= 0) & (hours > 0)) {
    timeBar.style.backgroundColor = 'orange';
  }
  if ((hours <= 0) & (minutes > 0)) {
    timeBar.style.backgroundColor = 'red';
  }
  if (!_openForVoting) {
    timeBar.style.backgroundColor = 'rgba(248, 252, 6, 0.5)';
  }

  if (days == 0) {
    return [hours + ' H ' + minutes + ' M '];
  } else if (hours == 0) {
    return [+minutes + ' M ' + seconds + ' S'];
  } else {
    return [days + ' D ' + hours + ' H '];
  }
}

///////////////////////////
// Render Case Card on the Index page
async function AddCardsToPage() {
  user = await Moralis.User.current();
  if (!user) {
    alert('Please Log in');
    location.href = 'login.html' + location.hash;
  }
  let reuslt = await Moralis.Cloud.run('Cases', {});

  console.log('userRegion: ' + user.get('Region'));
  console.log(reuslt);
  var newArray = reuslt.filter(function (el) {
    return el.attributes.region == user.get('Region');
  });
  newArray.forEach((element) => {
    tabele.appendChild(
      createCard(
        element.attributes.caseNumber,
        element.attributes.title,
        element.attributes.startDate,
        element.attributes.endDate,
        element.attributes.openForVoting,
        element.attributes.uintAlt,
        element.attributes.stringAlt
      )
    );
    console.log('id:' + element.id);
    console.log('alt1:' + element.attributes.uintAlt[1]);
  });
}
function indexOfMax(arr) {
  console.log(arr);
  if (arr.length === 0) {
    return -1;
  }

  var max = arr[0];
  var maxIndex = 0;

  for (var i = 1; i < arr.length; i++) {
    if (arr[i] > max) {
      maxIndex = i;
      max = arr[i];
    }
  }

  return maxIndex;
}

async function checkUserType() {
  user = await Moralis.User.current();
  if (user.get('UserType') == 'Standard') {
    hideElment(document.getElementById('createCaseHerf'));
    hideElment(document.getElementById('approveHerf'));
    window.onload = function () {
      if (!window.location.hash) {
        window.location = window.location + '#loaded';
        window.location.reload();
      }
    };
  } else if (user.get('UserType') == 'Admin') {
    showElment(document.getElementById('createCaseHerf'));
    showElment(document.getElementById('approveHerf'));
    hideElment(document.getElementById('contractHerf'));
    window.onload = function () {
      if (!window.location.hash) {
        window.location = window.location + '#loaded';
        window.location.reload();
      }
    };
  } else if (user.get('UserType') == 'SuperAdmin') {
    showElment(document.getElementById('createCaseHerf'));
    showElment(document.getElementById('approveHerf'));
    showElment(document.getElementById('contractHerf'));
    window.onload = function () {
      if (!window.location.hash) {
        window.location = window.location + '#loaded';
        window.location.reload();
      }
    };
  }
}

async function search(_title) {
  $('#here').load(document.URL + ' #here');
  var tempy = false;
  document.getElementById('noMatch').innerText = '';

  let reuslt = await Moralis.Cloud.run('Cases', {});
  console.log('result:' + reuslt);
  if (_title == '' && tempy == false) {
    AddCardsToPage();
  }
  reuslt.every((element) => {
    console.log(
      'title: ' + _title + '  caseNum: ' + element.attributes.caseNumber
    );
    if (
      element.attributes.caseNumber == _title ||
      element.attributes.title.toUpperCase() == _title.toUpperCase()
    ) {
      tabele.appendChild(
        createCard(
          element.attributes.caseNumber,
          element.attributes.title,
          element.attributes.startDate,
          element.attributes.endDate,
          element.attributes.openForVoting,
          element.attributes.uintAlt,
          element.attributes.stringAlt
        )
      );
      tempy = true;
      return false;
    } else {
      return true;
    }
  });
  if (_title != '' && tempy == false) {
    document.getElementById('noMatch').innerText = 'No Match Found';
  }
}

hideElment = (element) => (element.style.display = 'none');
showElment = (element) => (element.style.display = 'block');

document.getElementById('search-button').onclick = function () {
  search(document.getElementById('search-input').value);
};

/// Using Enter To clcik the search button
var input = document.getElementById('search-input');
input.addEventListener('keyup', function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    document.getElementById('search-button').click();
  }
});

Moralis.Web3.onAccountsChanged(function (accounts) {
  location.hash = 'runLogOut';
  location.href = 'login.html' + location.hash;
});

window.addEventListener('load', function () {
  const loader = document.querySelector('.loader');
  loader.className += ' hidden';
});

AddCardsToPage();
checkUserType();
