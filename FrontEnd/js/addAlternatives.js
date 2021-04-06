Moralis.initialize("2xY2tmcdYBf3IdqY5Yuo74fSEyxigYSADL9Ywtrj"); // Application id from moralis.io
Moralis.serverURL = "https://rnonp7vwlz3d.moralis.io:2053/server"; //Server url from moralis.io


// createCase
async function createCase(
  _title,
  _description,
  _startDate,
  _endDate,
  alt1,
  alt2
) {
  var array = [alt1, alt2];
  alert(
    "title: " +
      _title +
      "\ndesciption: " +
      _description +
      "\nstart date: " +
      _startDate +
      "\nend date: " +
      _endDate +
      "\nalternatives: " +
      array
  );
  window.web3 = await Moralis.Web3.enable();
  let contractInstance = new web3.eth.Contract(window.abi, contractAddress);
  contractInstance.methods
    .createCase(
      _title,
      _description,
      _startDate,
      _endDate,
      alt1,
      alt2,
    )
    .send({ from: ethereum.selectedAddress })
    .on("receipt", function (receipt) {
      console.log(receipt);
      if (
        receipt.events.confirmationE.returnValues.confirmationE ==
        "Case created successfully"
      ) {
        alert("case Created successfully");
      }
    });
}


document.getElementById("create-button").onclick = function () {
    createCase(
    document.getElementById("title").value,
    document.getElementById("description").value,
    (document.getElementById("startDate").innerHTML = new Date(
      $("#startDate").val()
    ).getTime()),
    (document.getElementById("endDate").innerHTML = new Date(
      $("#endDate").val()
    ).getTime()),
    document.getElementById("alternatives1").value,
    document.getElementById("alternatives2").value
  );
};