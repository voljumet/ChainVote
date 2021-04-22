Moralis.initialize('V72IuyWsaYclkUWnzU7JdLkfSZqyArobvyU4OKOg'); // Application id from moralis.io
Moralis.serverURL = 'https://03i7vk4ziens.moralis.io:2053/server'; //Server url from moralis.io

openUerInfo = async () => {
  user = await Moralis.User.current();
  if (user) {
    UserNameFront.innerText = user.get('username');
  }
};

const UserNameFront = document.getElementById('userNameFront');
openUerInfo();
