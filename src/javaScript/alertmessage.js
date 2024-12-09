function showAlert(type, message , otherOption) {
    let msg = message
    const alertOverlay = document.getElementById('alertOverlay');
    const alertLogo = document.getElementById('alertLogo');
    const alertMessage = document.getElementById('alertMessage');


    if (msg.message === 'Failed to fetch') {
          type = 'warning'
          msg = 'Server Down.'
    }else if (msg === 'Server Down!') { 
      type='warning'
    }
    
    // Set the message based on the action
    alertMessage.textContent = msg;
    // Change the logo and color based on the type of alert
    if (type === 'success') {
      alertLogo.textContent = '✓'; // Check mark for success
      alertLogo.style.backgroundColor = '#28a745'; // Green
    } else if (type === 'error') {
      alertLogo.textContent = '✖'; // Cross mark for error
      alertLogo.style.backgroundColor = '#dc3545'; // Red
    } else if (type === 'warning') {
      alertLogo.textContent = '!'; // Exclamation mark for warning
      alertLogo.style.backgroundColor = '#ffc107'; // Yellow
    }

    // Show the overlay
    alertOverlay.style.display = 'flex';
    alertOverlay.style.backdropFilter = 'blur(4px)'
}

function closeAlert(){
  document.getElementById('alertOverlay').style.display = 'none';
}



