const forgetSection = document.querySelector('.forget')
const loginForm = document.querySelector(".loginAndSingup");
const forgotPasswordForm = document.getElementById("forgotPassword");
const otpSection = document.getElementById("otpSection");
const forgotPasswordLink = document.getElementById("forgotPasswordLink");
const backButton = document.getElementById("back_button");
const closeBtn = document.getElementById("login_singup_close");
const loading = document.querySelector('.loading')


function clearinputValue(){
  
  document.querySelectorAll('.login_singup_form input, .login_singup_form textarea').forEach((input)=>{
    if (input.value !== '') {
      input.value = ''
      input.previousElementSibling.classList.remove('active', 'highlight')
    }
  })
  document.getElementById('login_singup_form').className = 'login_singup_form_hiden'
  document.querySelectorAll('.tab').forEach(v=>{
    if (Object.values(v.classList).includes("active")) {
      v.classList.remove("active")
    }   
})

if (window.location.href.endsWith("login")) {
  
  window.location.href = window.location.href.replace("#login" , "")
  window.location.reload()
  
} else if (window.location.href.endsWith("signup")) {
  
  window.location.href = window.location.href.replace("#signup" , "")

}else{
  window.location.reload()

}

}


function change_active(e) {

    e.parentElement.classList.add('active');
  Array.from(e.parentElement.parentElement.children).forEach(function(sibling) {
    if (sibling !== e.parentElement) {
      sibling.classList.remove('active');
    }
  });

  // Get target tab content and show it
  var target = e.getAttribute('href');
  document.querySelectorAll('.tab-content > div').forEach(function(content) {
    content.style.display = 'none';
  });

  document.querySelector(target).style.display = 'block';
  document.querySelector(target).style.opacity = 0;
  
  // Fade-in effect
  var fadeEffect = setInterval(function () {
    if (document.querySelector(target).style.opacity < 1) {
      document.querySelector(target).style.opacity = parseFloat(document.querySelector(target).style.opacity) + 0.1;
    } else {
      clearInterval(fadeEffect);
    }
  }, 60);
}



function login_singup_form() {
  
  document.querySelectorAll('.login_singup_form input, .login_singup_form textarea').forEach(function(input) {
  
    // Function to handle events
    function handleInputEvent(event) {
      var label = input.previousElementSibling;
      
      
      if (event.type === 'keyup') {
        if (input.value === '') {
          label.classList.remove('active', 'highlight');
        } else {
          label.classList.add('active', 'highlight');
        }
      } else if (event.type === 'blur') {
        if (input.value === '') {
          label.classList.remove('active', 'highlight');
        } else {
          label.classList.remove('highlight');
        }
      } else if (event.type === 'focus') {
        if (input.value === '') {
          label.classList.remove('highlight');
        } else if (input.value !== '') {
          label.classList.add('highlight');
        }
      }
    }
  
    // Add event listeners
    input.addEventListener('keyup', handleInputEvent);
    input.addEventListener('blur', handleInputEvent);
    input.addEventListener('focus', handleInputEvent);
  });
  
  // Tab Navigation
  
  document.querySelectorAll('.tab a').forEach(function(tab) {
    
    tab.addEventListener('click', ()=>change_active(tab));
  });
  
  async function signupForm (event){
      event.preventDefault()
      try {
          const response = await (await fetch('http://localhost:8085/api/v1/user/register',{
              method:'post',
              headers: {'Content-Type' : 'application/json'},
              credentials:"include",
              body : JSON.stringify({
                  email: signup.elements['emial'].value,
                  phone:signup.elements['phoneNumber'].value,
                  password:signup.elements['password'].value
  
              })
          })).json()
          
          if (response.code !== 1) {
              throw new Error(response.msg);    
          }
  
          clearinputValue()
          
  
      } catch (error) {
          showAlert('error',error)
          
      }
  }
  async function loginForm (event){
      event.preventDefault()
      
      try {
          const response = await (await fetch('http://localhost:8085/api/v1/user/login',{
              method:'post',
              headers: {'Content-Type' : 'application/json'},
              credentials:"include",
              body : JSON.stringify({
                  email: login.elements['emial'].value,
                  password:login.elements['password'].value
  
              })
          })).json()

          if (response.code !== 1) {
              throw new Error(response.msg);    
          }
          if (window.location.pathname !== "/public/adminPage.html") {
            
                clearinputValue()
                showAlert('success' , "Loging successfully")
                checkCookie()
          }else if(response.data.role === "admin"){

                  clearinputValue()
                  showAlert('success' , "Admin Loging successfully")
                  checkCookie()

          }else{
              throw new Error("this email not register as admin!")
          }
          
      } catch (error) {
        clearinputValue()
        return showAlert('error' , error)
      }
  }
  const signup = document.getElementById('signupForm')
  const login = document.getElementById('loginForm')
  
  
  signup.addEventListener("submit",signupForm)
  login.addEventListener("submit",loginForm)
  

  closeBtn.addEventListener('click',clearinputValue)

}

const forgotPassword = async (email) => {
  
  try {
    const response = await(await fetch('http://localhost:8085/api/v1/user/forgetpassword',{
      method:'post',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({email:email})
    })).json()  

      if (response.code !==1) {
        return showAlert('error',response.msg)
      }
      return response
  } catch (error) {
    showAlert('error',error)
  }
}
const resetPassword = async(data) =>{
  try {
    const response = await(await fetch('http://localhost:8085/api/v1/user/resetpassword',{
      method:'post',
      headers:{'Content-Type':"application/json"},
      body:JSON.stringify(data)
    })).json()

      if (response.code !== 1) {
        return showAlert('error',response.msg)
      }
      return response
  } catch (error) {
    return showAlert('error',error)
  }
}
forgotPasswordLink.addEventListener("click", function (e) {
    e.preventDefault();
    loginForm.style.display = "none";
    closeBtn.style.display = 'none'
    backButton.style.display = 'block'
    forgetSection.style.display = "block";
});


backButton.addEventListener("click", function () {
     if (otpSection.style.display !== 'none') {
        otpSection.querySelector('input').value =''
        otpSection.style.display = 'none'
        forgotPasswordForm.style.display = "block";
    }else if (forgetSection.style.display !== 'none') {
        forgetSection.querySelector('input').value =''
        forgetSection.style.display = "none";
        loginForm.style.display = "block";
        backButton.style.display = 'none'
        closeBtn.style.display = 'block'
    }
});

document.getElementById("forgotPasswordForm").addEventListener("submit", async function (e) {
    e.preventDefault();
    
    const email = e.srcElement.querySelector('input').value;

      if (!email) {
        return showAlert('error','enter email ID.')
      }
      loading.style.display = 'block'
    const data = await forgotPassword(email)

          if (data !== undefined) {
            forgotPasswordForm.style.display = "none";
            otpSection.style.display = "block";
          }
          
    loading.style.display = 'none'
});
document.getElementById('resetPasswordForm').addEventListener('submit',async function(e){
  e.preventDefault()
  
  const data = {
    email:forgotPasswordForm.querySelector('input').value,
    otp:otpSection.querySelector('[name ="otp"]').value,
    newPassword: otpSection.querySelector('[name ="newPassword"]').value
  }
  for (const key in data) {
      if (data[key] === '') {
        return showAlert('error',`enater ${key} first.`)
      }
    }
      loading.style.display = 'block'
    const response = await resetPassword(data)
    
    if (response !== undefined) {
        forgotPasswordForm.querySelector('input').value = ''
        e.srcElement.querySelector('input').value = ''
      otpSection.style.display = 'none'
      backButton.style.display = 'none'
      forgetSection.style.display = 'none'
      forgotPasswordForm.style.display = 'block'
      loginForm.style.display = "block";
      closeBtn.style.display = 'block'
      
    }
    loading.style.display = 'none'
  
})


