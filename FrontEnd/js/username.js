Moralis.initialize('2xY2tmcdYBf3IdqY5Yuo74fSEyxigYSADL9Ywtrj'); // Application id from moralis.io
Moralis.serverURL = 'https://rnonp7vwlz3d.moralis.io:2053/server'; //Server url from moralis.io

openUerInfo = async () => {
  user = await Moralis.User.current();
  if (user) {
    UserNameFront.innerText = user.get('username');
  }
};

const UserNameFront = document.getElementById('userNameFront');
openUerInfo();
