Moralis.initialize('2xY2tmcdYBf3IdqY5Yuo74fSEyxigYSADL9Ywtrj'); // Application id from moralis.io
Moralis.serverURL = 'https://rnonp7vwlz3d.moralis.io:2053/server'; //Server url from moralis.io

function pauseContract() {
  let txt;
  let confirmed = confirm('Did you want to pause the contract!');
  if (confirmed) {
    txt = 'You pressed OK!';
  } else {
    txt = 'You pressed Cancel!';
  }
  document.getElementById('d').innerHTML = txt;
}

async function checkUserType() {
  user = await Moralis.User.current();
  if (!user) {
    alert('Please Log in');
    location.href = 'login.html' + location.hash;
  }
  if (user.get('UserType') != 'SuperAdmin') {
    location.href = 'accessDenied.html';
  }
}
checkUserType();
document.getElementById('pause-button').onclick = pauseContract;


