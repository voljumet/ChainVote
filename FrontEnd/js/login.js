Moralis.initialize('2xY2tmcdYBf3IdqY5Yuo74fSEyxigYSADL9Ywtrj'); // Application id from moralis.io
Moralis.serverURL = 'https://rnonp7vwlz3d.moralis.io:2053/server'; //Server url from moralis.io
/*
const userFiled = document.getElementsByClassName('usery')[0];

async function login() {
  try {
    user = await Moralis.User.current();
    alert("user loged in alredy")
    getUser(user)
   
    if (!user) {
      user = await Moralis.Web3.authenticate();
      let email = document.getElementById("email-input").value;
      let username = document.getElementById("username-input").value;
      let region = document.getElementById("region-input").value;
      let usertype = document.getElementById("usertype-input").value;
        user.set("Email",email);
        user.set("username",username);
        user.set("Region",region);
        user.set("UserType",usertype);
      await user.save();
      console.log(user)
      getUser(user)
    } else{
        getUser(user);
    }
  } catch (error) {
    console.log(error);
  }
}

function writeTo(_email, _userType, _region, _userName) {
  const bruker = document.createElement('div');

  const email = document.createElement('h2');
  email.innerText = 'Email: ' + _email;

  const region = document.createElement('h2');
  region.innerText = 'Region: ' + _region;

  const username = document.createElement('h2');
  username.innerText = 'UserName: ' + _userName;

  bruker.append(username);
  bruker.append(email);
  bruker.append(region);
  return bruker;
}


async function openUserInfo(){
    user = await Moralis.User.current();
    if(user){
        const email = user.get('Email');
        if(email){
            userEmailField.value = email;
        }else{
            userEmailField.value = "ww";
        }

        userNameField.value = user.get('username');
        userRegionField.value = user.get('Region');
        userTypeField.value = user.get('UserType')
    }
}
///////////////////////////
async function getUser(user) {
  
        const email = user.get('Email');
        const username = user.get('username');
        const UserType = user.get('UserType');
        const Region = user.get('Region');

          userFiled.appendChild(
            writeTo(
              email,
              UserType,
              Region,
             username
            )
          );
}
async function myFunction() {
  let reuslt = await Moralis.Cloud.run('User', {});
  console.log("result: " + reuslt);
  let match = false;
  let elementTemp;
  try {
     reuslt.forEach((element) => {
        console.log( "hse"+ element.attributes.Email)
      if (document.getElementById('email-input').value == element.attributes.Email) {
        
          elementTemp = element;
        return match = true;
      }
    });
    if (match) {
      alert('Found match');
     login()
     
    } else {
      confirm('No match');
      await login();
    }

   


  } catch (error) {
    console.log(error);
  }
}


async function logout(){
    await Moralis.User.logOut();
    window.location.reload(1);
    alert("Loged out")
}
document.getElementById('input-buttony').onclick = myFunction;
document.getElementById('logout-buttony').onclick = logout;

const userEmailField= document.getElementById('email-input');
const userNameField= document.getElementById('username-input');
const userTypeField= document.getElementById('usertype-input');
const userRegionField= document.getElementById('region-input');

async function doit() {
    try{
        let reuslt = await Moralis.Cloud.run('User', {});
        console.log(reuslt)
    }catch(error){
        console.log(error)
    }
}

doit()
openUserInfo();

*/
function reloadUrl(){
  if(location.hash == "#runLogOut"){
    logOut()
  }
  location.hash=""
}



init = async() =>{
    hideElment(userInfo);
    window.web3 = await Moralis.Web3.enable();
  
    initUser();
}
initUser = async () =>{
    user = await Moralis.User.current()
    if(user){
        hideElment(userConnectButton);
        showElment(userProfileButton);
        showElment(document.getElementById("logout"));
        UserNameFront.innerText = user.get('username');
    }else{
        showElment(userConnectButton);
        hideElment(userProfileButton);
        hideElment(document.getElementById("logout"));
        UserNameFront.innerText = "";
    }
}

login = async()=>{
    try {
        await Moralis.Web3.authenticate();
        showSuccessAlert('You have been sigend in successfully');
        disaprearAlert(2000)
        initUser()
    } catch (error) {
      showErrorAlert('Canceled');
      disaprearAlert(2000)
    }
}

logOut = async()=>{
  await  Moralis.User.logOut();
  hideElment(userInfo);
  showSuccessAlert('You have been loged out successfully');
  disaprearAlert(2000)
  initUser();
}

openUerInfo = async()=>{
    user = await Moralis.User.current();
    if(user){
        const email = user.get('Email');
        UserNameFront.innerText = user.get('username');
        if(email){
            userEmailField.value = email;
        }else{
            userEmailField.value = "";
            userNameField.value = "";
            userTypeField.value = "";
            userRegionField.value = "";
        }

        userNameField.value = user.get('username');
        userRegionField.value = user.get('Region');
        userTypeField.value = user.get('UserType');

        showElment(userInfo);
        hideElment(userProfileButton)
    }
    else{
        login();
    }
}

saveUserInfo = async()=>{

    try {
      createUser(userRegionField.value, userTypeField.value);
    } catch (error) {
        alert(error)
    }
   
}

async function createUser(_region, _userType) {
  confirm("Region: " + _region + "\nUserType: " + _userType);
  window.web3 = await Moralis.Web3.enable();
  let contractInstance = new web3.eth.Contract(window.abi, contractAddress);
  contractInstance.methods
    .createUser(_region, _userType)
    .send({ from: ethereum.selectedAddress })
    .on("receipt", async function (receipt) {
      console.log(receipt);
      if (receipt.events.confirmationE.returnValues.confirmation ){
        showSuccessAlert("user created successfully");
        disaprearAlert(2000)
        user.set('UserType', userTypeField.value);
        user.set('username', userNameField.value);
        user.set('Region', userRegionField.value);
        user.set('Email', userEmailField.value);
      
        await user.save();

        openUerInfo();
      }
    });
    
}

closeButton = async()=>{
    hideElment(userInfo);
    showElment(userProfileButton);
}



async function checkUserType(){
    user = await Moralis.User.current();
    if (user.get('UserType') == "Standard") {
        hideElment(document.getElementById("createCaseHerf"))
        
    } else {
        showElment(document.getElementById("createCaseHerf"))
    }
}

function disaprearAlert(after){
  window.setTimeout(function() {
    $("#alert").hide('fade')
  }, after);
}


function showErrorAlert(message) {
  $('#alert').html("<div class='alert alert-danger' role='alert'>"
  +"<strong>Error! </strong>"
  +message+
  "</div>");
  $('#alert').show();
}
function showSuccessAlert(message) {
  $('#alert').html("<div class='alert alert-success' role='alert'>"
  +"<strong>Success! </strong>"
  +message+
  "</div>");
  $('#alert').show();
}






hideElment = (element) => element.style.display = "none";
showElment = (element) => element.style.display = "block";

const userConnectButton  = document.getElementById("connect");
userConnectButton.onclick= login;
const userProfileButton  = document.getElementById("userinfobutton");
userProfileButton.onclick= openUerInfo;

document.getElementById("closeInfo").onclick = closeButton;
document.getElementById("logout").onclick = logOut;
document.getElementById("save").onclick = saveUserInfo;


const userInfo = document.getElementById("userinfo");
const UserNameFront = document.getElementById('userNameFront');

const userEmailField= document.getElementById('email-input');
const userNameField= document.getElementById('username-input');
const userTypeField= document.getElementById('usertype-input');
const userRegionField= document.getElementById('region-input');

window.location.href.split('#')[0]
console.log(window.location.href)
init();
checkUserType();

Moralis.Web3.onAccountsChanged(function(accounts) {
  logOut()
});
reloadUrl()