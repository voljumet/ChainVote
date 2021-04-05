Moralis.initialize('2xY2tmcdYBf3IdqY5Yuo74fSEyxigYSADL9Ywtrj'); // Application id from moralis.io
Moralis.serverURL = 'https://rnonp7vwlz3d.moralis.io:2053/server'; //Server url from moralis.io
var web3 = new Web3(Web3.givenProvider);

const tabele = document.getElementsByClassName('container2')[0];

function createCard(_number, _title, _stratDate, _endDate){

    const monthDiv = document.createElement('div');

    const month = document.createElement('u');
    month.innerHTML = getDate(_stratDate);

    const card = document.createElement('div');
    card.className ="card"; 

    const tapNumber = document.createElement('h2');

    tapNumber.innerText = "Proposal " + _number;
    
    const ref = document.createElement('a');
    ref.setAttribute('href', "ended.html");

    const title= document.createElement('p');
    let txt = "Title: ";
    title.innerHTML = txt.fontsize(5).fontcolor("black")+ _title;

    const pro = document.createElement('div');
    pro.id = "myProgress";
    
    const bar = document.createElement('div');
    bar.id = "myBar";

    const timeLeft = document.createElement('p');
    timeLeft.id = "time";
    var txt2= "Time Left: ";
    timeLeft.innerHTML= txt2.fontsize(5).fontcolor("black")+ timeIt( _endDate, bar, _stratDate);
    getDate(_stratDate);
  
    
    
  


    monthDiv.appendChild(month);
    card.appendChild(monthDiv);
    card.append(tapNumber);
    ref.appendChild(tapNumber);
    card.append(ref);
    card.append(title);
    card.append(timeLeft);
    card.append(pro);
    pro.appendChild(bar);
   

    
    return card;
}


function getDate(t) {
    var month = new Array();
    month[0] = "January";
    month[1] = "February";
    month[2] = "March";
    month[3] = "April";
    month[4] = "May";
    month[5] = "June";
    month[6] = "July";
    month[7] = "August";
    month[8] = "September";
    month[9] = "October";
    month[10] = "November";
    month[11] = "December";

    var w = new Date(t);
    var n = month[w.getMonth()];
    var y = w.getFullYear();
    return n + " "+ y;
 
  }

////////////////////////
function timeIt(date, End, Start){
    var countDownDate = new Date(date).getTime();
    // Get today's date and time
    var now = new Date().getTime();
    // Find the distance between now and the count down date
    var distance = countDownDate - now;
    // Time calculations for days, hours, minutes and seconds
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (days <= 0 & hours <=0 & minutes <=0 &seconds <= 0 || isNaN(days) )
    {
        End.style.backgroundColor='red';
        return "Expired";
    }
    if (days <= 0 & hours >0 )
    {
        End.style.backgroundColor='orange';
      
    }
    if (hours <= 0 & minutes >0 )
    {
        End.style.backgroundColor='#baef1c';
      
    }

    if (days == 0){
        return [ hours + " H "
        + minutes + " M "];
    } else if(hours == 0){
        return [
    + minutes + " M " + seconds + "S"];
    }else{
        return [days + " D " + hours + " H "];
    }

}

// Reload the page
setTimeout(function(){
    window.location.reload(1);
 }, 60000);

 function unpack(str) {
    var bytes = [];
    for(var i = 0; i < str.length; i++) {
        var char = str.charCodeAt(i);
        bytes.push(char >>> 8);
        bytes.push(char & 0xFF);
    }
    return bytes;
}


///////////////////////////
async function AddCardsToPage() {
    let reuslt  = await Moralis.Cloud.run("Cases",{});
    console.log(reuslt)
    reuslt.forEach(element =>{
        tabele.appendChild(createCard(element.attributes.CaseNumber,element.attributes.Title,element.attributes.StartDate,element.attributes.EndDate))
    })
 
}
async function getUser() {
    try {
      let reuslt = await Moralis.Cloud.run("User", {});
      console.log(reuslt);
    } catch (error) {
      console.log(error);
    }
  }

  getUser()
  AddCardsToPage()
    



