
// createCase
async function createCase( _title, _description, _startDate, _endDate, alt1, alt2) {
  try {
    window.web3 = await Moralis.Web3.enable();
    let contractInstance = new web3.eth.Contract(window.CaseAbi, contractAddress);
    contractInstance.methods
      .createCase( _title, _description, _startDate / 1000, _endDate / 1000, alt1, alt2)
      .send({ from: ethereum.selectedAddress })
      .on('receipt', async function (receipt) {
        console.log('This is receipt:' + receipt);
        if (receipt.events.confirmationE.returnValues.confirmation) {
          showSuccessAlert('Case Created Successfully');
          disaprearAlert(2000);
          document.getElementById('title').value = receipt.events.getCaseE.returnValues.title;
          document.getElementById('title').disabled = true;
          document.getElementById('description').value = receipt.events.getCaseE.returnValues.description;
          document.getElementById('description').disabled = true;
          document.getElementById('alternatives1').value = receipt.events.getCaseE.returnValues.stringAlt[1];
          document.getElementById('alternatives1').disabled = true;
          document.getElementById('alternatives2').value = receipt.events.getCaseE.returnValues.stringAlt[2];
          document.getElementById('alternatives2').disabled = true;
          // hideElment(document.getElementById('create-button'));
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
    (document.getElementById('startDate').innerHTML = new Date( $('#startDate').val() ).getTime()),
    (document.getElementById('endDate').innerHTML = new Date( $('#endDate').val() ).getTime()),
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
  console.log('user: ' + user);
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
  location.hash = 'runLogOut';
  location.href = 'login.html' + location.hash;
});

window.addEventListener('load', function () {
  const loader = document.querySelector('.loader');
  loader.className += ' hidden';
});


function redirect(_caseNum) {
  location.href = 'addAlternatives.html?id' + _caseNum;
}


hideElment = (element) => (element.style.display = 'none');
showElment = (element) => (element.style.display = 'block');


checkUserType();
