
// Testnet
Moralis.initialize("V72IuyWsaYclkUWnzU7JdLkfSZqyArobvyU4OKOg"); // Application id from moralis.io
Moralis.serverURL = "https://03i7vk4ziens.moralis.io:2053/server"; //Server url from moralis.io

// Local
//Moralis.initialize("2xY2tmcdYBf3IdqY5Yuo74fSEyxigYSADL9Ywtrj"); // Application id from moralis.io
//Moralis.serverURL = "https://rnonp7vwlz3d.moralis.io:2053/server"; //Server url from moralis.io

function getAbi() {
    return new Promise((res) => {
        $.getJSON("../Backend/build/contracts/Case.json", ((json) => {
            res(json.abi);
        }))
    })
}

function getProxyAbi() {
    return new Promise((res) => {
        $.getJSON("../Backend/build/contracts/Proxy.json", ((json) => {
            res(json.abi);
        }))
    })
}

function getMultiAbi() {
    return new Promise((res) => {
        $.getJSON("../Backend/build/contracts/MultiSig.json", ((json) => {
            res(json.abi);
        }))
    })
}
