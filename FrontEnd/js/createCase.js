async function getNewCaseNumber(_caseNum) {
  hideElment(document.getElementById('n1'));
  var num = _caseNum;
  console.log(_caseNum);
  var myObject = { proposal_number: num };
  w3.displayObject('id03', myObject);
  showElment(document.getElementById('n2'));
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
    let abi = await getAbi();
    window.web3 = await Moralis.Web3.enable();
    let contractInstance = new web3.eth.Contract(abi, contractAddress);
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
      .on('receipt', async function (receipt) {
        if (receipt.events.confirmationE.returnValues.confirmation) {
          showSuccessAlert('Case Created Successfully');
          disaprearAlert(2000);
          getNewCaseNumber(receipt.events.getCaseE.returnValues.caseNumber);
          document.getElementById('title').value =
            receipt.events.getCaseE.returnValues.title;
          document.getElementById('title').disabled = true;

          document.getElementById('description').value =
            receipt.events.getCaseE.returnValues.description;
          document.getElementById('description').disabled = true;

          document.getElementById('alternatives1').value =
            receipt.events.getCaseE.returnValues.stringAlt[1];
          document.getElementById('alternatives1').disabled = true;

          document.getElementById('alternatives2').value =
            receipt.events.getCaseE.returnValues.stringAlt[2];
          document.getElementById('alternatives2').disabled = true;
          showElment(addNewOption);
          showElment(addAltButton);
          hideElment(document.getElementById('create-button'));
          redirect(receipt.events.getCaseE.returnValues.caseNumber);
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
  hideElment(addNewOption);
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
  newdiv.id = counter;
  newdiv.innerHTML =
    "<div class='input-group mb-3'><input id= alt" +
    counter +
    "  class='form-control' type='text' placeholder='Alternative Text' name='myInputs[]'> <div id= 'delete-alt-button' type='button' value='-' onClick='removeInput(" +
    counter +
    ");'>-</div> </div> ";
  document.getElementById('formulario').appendChild(newdiv);
  console.log(counter);
  counter++;
  hideElment(addNewOption);
}

function removeInput(id) {
  console.log(id);
  var elem = document.getElementById(id);
  showElment(addNewOption);
  return elem.parentNode.removeChild(elem);
}

async function addAlternative(_caseNumber, _altValue) {
  window.web3 = await Moralis.Web3.enable();
  let abi = await getAbi();
  let contractInstance = new web3.eth.Contract(abi, contractAddress);

  contractInstance.methods
    .addAlternatives(_caseNumber, _altValue)
    .send({ from: ethereum.selectedAddress })
    .on('receipt', async function (receipt) {
      if (receipt.events.addApprovalsE.returnValues.stringAlt) {
        showSuccessAlert('Option added successfully');
        showElment(document.getElementById('add-alt-button'));
        showElment(addAltButton);
        hideElment(document.getElementById('create-button'));
        disaprearAlert(2000);
      } else {
        showErrorAlert('Failed');
      }
    });
}

function redirect(_caseNum) {
  location.href = 'addAlternatives.html?id' + _caseNum;
}

document.getElementById('add-alt-button').onclick = addInput;
const addAltButton = document.getElementById('addNewAlt-button');
const addNewOption = document.getElementById('add-alt-button');

addAltButton.onclick = addAlternative();

hideElment = (element) => (element.style.display = 'none');
showElment = (element) => (element.style.display = 'block');

hideElment(document.getElementById('n2'));

checkUserType();
