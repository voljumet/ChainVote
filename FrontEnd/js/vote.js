Moralis.initialize("2xY2tmcdYBf3IdqY5Yuo74fSEyxigYSADL9Ywtrj"); // Application id from moralis.io
Moralis.serverURL = "https://rnonp7vwlz3d.moralis.io:2053/server"; //Server url from moralis.io



async function vote(caseNumber, alternative) {
  window.web3 = await Moralis.Web3.enable();
  let contractInstance = new web3.eth.Contract(window.abi, contractAddress);
  contractInstance.methods
    .vote(caseNumber, alternative)
    .send({ from: ethereum.selectedAddress })
    .on("receipt", function (receipt) {
      console.log(receipt);
      if (
        receipt.events.confirmationE.returnValues.confirmation ==
        "Vote has been registered"
      ) {
        alert(receipt.events.confirmationE.returnValues.confirmation);
      }
    });
}

document.getElementById("vote_").onclick = function () {
  vote(
    document.getElementById("caseNumber4").value,
    document.getElementById("alternative").value
  );
};
