Moralis.initialize(initialize); // Application id from moralis.io
Moralis.serverURL = serverurl; //Server url from moralis.io


openUerInfo = async()=>{
    user = await Moralis.User.current();
    if(user){
        UserNameFront.innerText = user.get('username');
    }
    
}

const UserNameFront = document.getElementById('userNameFront');
openUerInfo();