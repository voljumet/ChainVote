Moralis.initialize('2xY2tmcdYBf3IdqY5Yuo74fSEyxigYSADL9Ywtrj'); // Application id from moralis.io
Moralis.serverURL = 'https://rnonp7vwlz3d.moralis.io:2053/server'; //Server url from moralis.io

async function getNewCaseNumber() {
  hideElment(document.getElementById("n1"));
  let reuslt = await Moralis.Cloud.run('Cases', {});
  let array = [];
  reuslt.forEach((element) => {
    array.push(element.attributes.caseNumber);
  });
  var num = Math.max(...array);
  var myObject = { proposal_number: num };
  w3.displayObject('id03', myObject);
  showElment(document.getElementById("n2"));
}

// createCase
async function createCase(
  _title,
  _description,
  _startDate,
  _endDate,
  alt1,
  alt2
) {
  try {
    window.web3 = await Moralis.Web3.enable();
    let contractInstance = new web3.eth.Contract(window.abi, contractAddress);
    contractInstance.methods
      .createCase(
        _title,
        _description,
        _startDate / 1000,
        _endDate / 1000,
        alt1,
        alt2
      )
      .send({ from: ethereum.selectedAddress })
      .on('receipt', function (receipt) {
        if (receipt.events.confirmationE.returnValues.confirmation) {
          showSuccessAlert('Case Created Successfully');
          showElment(document.getElementById("add-alt-button"))
          disaprearAlert(2000);
          getNewCaseNumber()
          document.getElementById('title').value = receipt.events.getCaseE.returnValues.title;
          document.getElementById('title').disabled = true;

          document.getElementById('description').value = receipt.events.getCaseE.returnValues.description;
          document.getElementById('description').disabled = true;

          document.getElementById('alternatives1').value = receipt.events.getCaseE.returnValues.stringAlt[1];
          document.getElementById('alternatives1').disabled = true;

          document.getElementById('alternatives2').value = receipt.events.getCaseE.returnValues.stringAlt[2];
          document.getElementById('alternatives2').disabled = true;


        } else {
          showErrorAlert('Failed');
          disaprearAlert(2000);
        }
      });
  } catch (error) {
    showErrorAlert('Failed');
    disaprearAlert(2000);
  }
}

document.getElementById('create-button').onclick = function () {
  createCase(
    document.getElementById('title').value,
    document.getElementById('description').value,
    (document.getElementById('startDate').innerHTML = new Date(
      $('#startDate').val()
    ).getTime()),
    (document.getElementById('endDate').innerHTML = new Date(
      $('#endDate').val()
    ).getTime()),
    document.getElementById('alternatives1').value,
    document.getElementById('alternatives2').value
  );
};

$('#startDate').datetimepicker({
  timepicker: true,
  datepicker: true,
  minDate: new Date(),
  format: 'Y-m-d H:i',
  onShow: function (ct) {
    this.setOptions({
      maxDate: $('#endDate').val() ? $('#endDate').val() : false,
    }),
      console.log($('#startDate').val());
  },
});
$('#endDate').datetimepicker({
  timepicker: true,
  datepicker: true,
  format: 'Y-m-d H:i',
  onShow: function (ct) {
    this.setOptions({
      minDate: $('#startDate').val() ? $('#startDate').val() : false,
    });
  },
});

async function checkUserType() {
  //hideElment(document.getElementById("add-alt-button"));
  hideElment(addAltButton);
  user = await Moralis.User.current();
  console.log('Sa:' + user);
  if (!user) {
    alert('Please Log in');
    location.href = 'login.html' + location.hash;
  }
  if (user.get('UserType') == 'Standard') {
    location.href = 'accessDenied.html';
  }
}
function disaprearAlert(after) {
  window.setTimeout(function () {
    $('#alert').hide('fade');
  }, after);
}

function showErrorAlert(message) {
  $('#alert').html(
    "<div class='alert alert-danger' role='alert'>" +
      '<strong>Error! </strong>' +
      message +
      '</div>'
  );
  $('#alert').show();
}
function showSuccessAlert(message) {
  $('#alert').html(
    "<div class='alert alert-success' role='alert'>" +
      '<strong>Success! </strong>' +
      message +
      '</div>'
  );
  $('#alert').show();
}

Moralis.Web3.onAccountsChanged(function (accounts) {
  // window.location.replace("http://www.w3schools.com");
  location.hash = 'runLogOut';
  location.href = 'login.html' + location.hash;
});
window.addEventListener('load', function () {
  const loader = document.querySelector('.loader');
  loader.className += ' hidden';
});



var counter = 1;
function addInput() {
  var newdiv = document.createElement('div');
  newdiv.id = counter
  newdiv.innerHTML =
  "<div class='input-group mb-3'><input id= alt"+counter+"  class='form-control' type='text' placeholder='Alternative Text' name='myInputs[]'> <div id= 'delete-alt-button' type='button' value='-' onClick='removeInput(" +
  counter +
  ");'>-</div> </div> " ;
  document.getElementById('formulario').appendChild(newdiv);
  console.log(counter)
  counter++;
  //hideElment(document.getElementById("add-alt-button"))
}

 function removeInput(id) {
   console.log(id);
  var elem = document.getElementById(id);
  showElment(document.getElementById("add-alt-button"))
  return elem.parentNode.removeChild(elem);
}

async function addAlternative(_caseNumber, _altValue){
    window.web3 = await Moralis.Web3.enable();
    let contractInstance = new web3.eth.Contract(window.abi, contractAddress);
   
    contractInstance.methods
      .addAlternatives(_caseNumber, _altValue)
      .send({from: ethereum.selectedAddress })
      .on("receipt", async function (receipt) {
        if (receipt.events.addApprovalsE.returnValues.stringAlt){
          showSuccessAlert("user created successfully");
          showElment(document.getElementById("add-alt-button"));
          showElment(addAltButton);
          hideElment(document.getElementById("create-button"))
          disaprearAlert(2000)
        } 
      });
}

function dothis(){
  console.log(document.getElementById("alt1").value)
}

document.getElementById("add-alt-button").onclick= addInput
const addAltButton = document.getElementById("addNewAlt-button");

document.getElementById("cancel-buttony").onclick = dothis

addAltButton.onclick = addAlternative();

hideElment = (element) => element.style.display = "none";
showElment = (element) => element.style.display = "block";

hideElment(document.getElementById("n2"));

checkUserType();