openUerInfo = async()=>{
    user = await Moralis.User.current();
    if(user){
        UserNameFront.innerText = user.get('username');
    }
    
}

const UserNameFront = document.getElementById('userNameFront');
openUerInfo();