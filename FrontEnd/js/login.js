Moralis.initialize('I65RnUxauoNa8j0LUyYuLnPNHkVt94JJxtfWzxiy'); // Application id from moralis.io
Moralis.serverURL = 'https://8eb5frfqjkbo.moralis.io:2053/server'; //Server url from moralis.io

const user = document.getElementsByClassName('usery')[0];


async function login(){
    alert("hh")
    try{
        usery = await Moralis.User.current();
        if(!usery){
            usery = await Moralis.Web3.authenticate();
        }
        console.log(usery);
        alert("User logged ib")
        document.getElementsByClassName("wrapper fadeInDown").style.display = "none";

    }catch(error){
        console.log(error);

    }
}

function writeTo(_email, _userType, _region, _userName){
    const bruker = document.createElement('div');
    
    const email = document.createElement('h2');
    email.innerText = "Email: "+ _email;

    const region = document.createElement('h2');
    region.innerText = "Region: "+ _region;

    const username = document.createElement('h2');
    username.innerText = "UserName: "+ _userName;

    bruker.append(username);
    bruker.append(email);
    bruker.append(region);
    return bruker;
}

///////////////////////////
async function getUser() {
    try{    
        let reuslt  = await Moralis.Cloud.run("Usert",{});
        reuslt.forEach(element =>{
            user.appendChild(writeTo(element.attributes.Email,element.attributes.UserType,element.attributes.Region,element.attributes.username))
        })
        console.log(reuslt);

    }catch (error){
        console.log(error)
    }
  
}
async function myFunction() {
    alert("heheh")
   
    let reuslt  = await Moralis.Cloud.run("Usert",{});
    console.log(reuslt)
    let match = false;
   
    reuslt.forEach(element =>{
        if(document.getElementById("input").value == element.attributes.Email){
            login();
            user.appendChild(writeTo(element.attributes.Email,element.attributes.UserType,element.attributes.Region,element.attributes.username))
           return  match= true;
        }
    })
    if(match){
        alert("Found match");
    }
       else{
        alert("No match");
    }
  }

  document.getElementById("input-buttony").onclick= myFunction;






    



