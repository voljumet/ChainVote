Moralis.initialize('2xY2tmcdYBf3IdqY5Yuo74fSEyxigYSADL9Ywtrj'); // Application id from moralis.io
Moralis.serverURL = 'https://rnonp7vwlz3d.moralis.io:2053/server'; //Server url from moralis.io

async function getNewCaseNumber() {
  let reuslt = await Moralis.Cloud.run('Cases', {});
  let array = [];
  reuslt.forEach((element) => {
    array.push(element.attributes.caseNumber);
  });
  var num = Math.max(...array) + 1;
  var myObject = { proposal_number: num };
  w3.displayObject('id03', myObject);
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
          disaprearAlert(2000);
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

checkUserType();
getNewCaseNumber();

var counter = 1;
var dynamicInput = [];

function addInput() {
  var newdiv = document.createElement('div');
  newdiv.id = dynamicInput[counter];
  newdiv.innerHTML =
    "<div class='input-group mb-3'><input class='form-control' type='text' placeholder='Alternative Text' name='myInputs[]'> <div id= 'delete-alt-button' type='button' value='-' onClick='removeInput(" +
    dynamicInput[counter] +
    ");'>-</div> </div> " ;
  document.getElementById('formulario').appendChild(newdiv);
  counter++;
}

function removeInput(id) {
  var elem = document.getElementById(id);
  return elem.parentNode.removeChild(elem);
}
