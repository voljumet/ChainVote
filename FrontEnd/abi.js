

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
