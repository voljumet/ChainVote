

const CaseOne = artifacts.require("Case");
const Proxey = artifacts.require("Proxy");


module.exports = async function (deployer, network, accounts) {

    let caseContract = await CaseOne.deployed();
    let proxyContract = await Proxey.deployed();
    var redirectToCase = await CaseOne.at(proxyContract.address);

    await redirectToCase.approve(1, { from: accounts[1] });
    await redirectToCase.approve(1, { from: accounts[2] });
    await redirectToCase.approve(1, { from: accounts[3] });

    result = await redirectToCase.getMyVote(1);
    console.log(result.logs[0]);
    
    console.log("Timeout 2sec-------------------------------------")
    setTimeout(async function () {
        await redirectToCase.vote(1, 1, { from: accounts[4] });

    }, 2000);

    
    result = await redirectToCase.getMyVote(1, { from: accounts[4] });
    console.log("after vote: "+result.logs[0]);



  
};
