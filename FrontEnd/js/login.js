Moralis.initialize(initialize); // Application id from moralis.io
Moralis.serverURL = serverurl; //Server url from moralis.io

function reloadUrl() {
  if (location.hash == '#runLogOut') {
    logOut();
  }
  location.hash = '';
}

init = async () => {
  hideElment(userInfo);
  window.web3 = await Moralis.Web3.enable();

  initUser();
};
initUser = async () => {
  user = await Moralis.User.current();
  if (user) {
    hideElment(userConnectButton);
    showElment(userProfileButton);
    showElment(document.getElementById('logout'));
    UserNameFront.innerText = user.get('username');
    window.onload = function () {
      if (!window.location.hash) {
        console.log('wwerwer');
        window.location = window.location + '#loaded';
        window.location.reload();
      }
    };
  } else {
    showElment(userConnectButton);
    hideElment(userProfileButton);
    hideElment(document.getElementById('logout'));
    UserNameFront.innerText = '';
  }
};

login = async () => {
  try {
    await Moralis.Web3.authenticate();
    showSuccessAlert('You have been sigend in successfully');
    disaprearAlert(2000);
    initUser();
  } catch (error) {
    showErrorAlert('Canceled');
    disaprearAlert(2000);
  }
};

logOut = async () => {
  await Moralis.User.logOut();
  hideElment(userInfo);
  showSuccessAlert('You have been loged out successfully');
  disaprearAlert(2000);
  initUser();
};

openUerInfo = async () => {
  user = await Moralis.User.current();
  if (user) {
    const email = user.get('Email');
    UserNameFront.innerText = user.get('username');
    if (email) {
      userEmailField.value = email;
    } else {
      userEmailField.value = '';
      userNameField.value = '';
      userTypeField.value = '';
      userRegionField.value = '';
    }

    userNameField.value = user.get('username');
    userRegionField.value = user.get('Region');
    userTypeField.value = user.get('UserType');

    showElment(userInfo);
    hideElment(userProfileButton);
  } else {
    login();
  }
};

saveUserInfo = async () => {
  try {
    await createUser(userRegionField.value, userTypeField.value);
  } catch (error) {
    showErrorAlert('Canceled');
    disaprearAlert(2000);
  }
};

async function createUser(_region, _userType) {
  if (confirm('Region: ' + _region + '\nUserType: ' + _userType)) {
    window.web3 = await Moralis.Web3.enable();
    let abi = await getAbi();
    let contractInstance = new web3.eth.Contract(abi, contractAddress);

    contractInstance.methods
      .createUser(_region, _userType)
      .send({ from: ethereum.selectedAddress })
      .on('receipt', async function (receipt) {
        if (receipt.events.confirmationE.returnValues.confirmation) {
          showSuccessAlert('user created successfully');
          disaprearAlert(2000);
          user.set('UserType', userTypeField.value);
          user.set('username', userNameField.value);
          user.set('Region', userRegionField.value);
          user.set('Email', userEmailField.value);
          await user.save();
          openUerInfo();
        }
      });
  } else {
    showErrorAlert('Canceled');
    disaprearAlert(2000);
  }
}

closeButton = async () => {
  hideElment(userInfo);
  showElment(userProfileButton);
};

function disaprearAlert(after) {
  window.setTimeout(function () {
    $('#alert').hide('fade');
  }, after);
}

function showErrorAlert(message) {
  $('#alert').html(
    "<div class='alert alert-danger' role='alert'>" +
      '<strong>Error! </strong>' +
      message +
      '</div>'
  );
  $('#alert').show();
}
function showSuccessAlert(message) {
  $('#alert').html(
    "<div class='alert alert-success' role='alert'>" +
      '<strong>Success! </strong>' +
      message +
      '</div>'
  );
  $('#alert').show();
}
window.addEventListener('load', function () {
  const loader = document.querySelector('.loader');
  loader.className += ' hidden';
});

hideElment = (element) => (element.style.display = 'none');
showElment = (element) => (element.style.display = 'block');

const userConnectButton = document.getElementById('connect');
userConnectButton.onclick = login;
const userProfileButton = document.getElementById('userinfobutton');
userProfileButton.onclick = openUerInfo;

document.getElementById('closeInfo').onclick = closeButton;
document.getElementById('logout').onclick = logOut;
document.getElementById('save').onclick = saveUserInfo;

const userInfo = document.getElementById('userinfo');
const UserNameFront = document.getElementById('userNameFront');

const userEmailField = document.getElementById('email-input');
const userNameField = document.getElementById('username-input');
const userTypeField = document.getElementById('usertype-input');
const userRegionField = document.getElementById('region-input');

window.location.href.split('#')[0];
console.log(window.location.href);
init();

Moralis.Web3.onAccountsChanged(function (accounts) {
  var user = Moralis.User.current();
  if (user) {
    logOut();
  }
});
reloadUrl();
