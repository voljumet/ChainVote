Moralis.initialize('2xY2tmcdYBf3IdqY5Yuo74fSEyxigYSADL9Ywtrj'); // Application id from moralis.io
Moralis.serverURL = 'https://rnonp7vwlz3d.moralis.io:2053/server'; //Server url from moralis.io

function pauseContract(){
    let txt;
   let confirmed = confirm("Did you want to pause the contract!");
   if(confirmed){
    txt = "You pressed OK!";
   }else{
    txt = "You pressed Cancel!";
   }
   document.getElementById("demo").innerHTML = txt;
}

document.getElementById("pause-button").onclick = pauseContract;