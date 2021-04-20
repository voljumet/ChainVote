window.abi = getAbi;

function getAbi() {
    return new Promise((res) => {
        $.getJSON("../BackEnd/build/contracts/Token.json", ((json) => {
            res(json.abi);
        }))
    })
}