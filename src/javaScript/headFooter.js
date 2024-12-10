function login_singup_function(event){
    document.getElementById("login_singup_form").className = "login_singup_form"
    document.querySelector("body").style.overflow = 'hidden'

    change_active(document.querySelector(`.${event.srcElement.id} a`))
    login_singup_form()
}


async function logout(e){
    
    try {
        const response = await (await fetch('http://13.201.107.9/api/v1/user/logout',{
            credentials:'include'
        })).json()
    
        if (response.code === 1) {
            if (window.location.pathname !== "/public/adminPage.html") {
                checkCookie()
                showAlert('success',"user logout successfully.")
                document.getElementById("alert_button").addEventListener("click",()=>window.location.reload())
            }else if(e.srcElement.id === "logOut"){
                checkCookie()
                showAlert('success',"user logout successfully.")
                document.getElementById("alert_button").addEventListener("click",()=>window.location.reload())
            }
        }else{
            throw new Error("user not logout try again.")
        }
    } catch (error) {
        return showAlert('error',error)
    }
}
async function openPages(route){
    if (["myAccount","appointmentHistory"].includes(route)) {
        const check = await checkCookie()


    if (check !== 0) {
        window.location = `https://vinayyadav101.github.io/doctor_appointment_frontend/public/${route}.html`
        return
    }
    showAlert("error" , "user is not login!")
    return;
}

window.location = `https://vinayyadav101.github.io/doctor_appointment_frontend/public/${route}.html`
    
    
}

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("alert_button").addEventListener('click', closeAlert);
});

(function(){
    document.getElementById('logIn').addEventListener('click' , login_singup_function)
    document.getElementById('register').addEventListener('click' , login_singup_function)
    document.addEventListener('DOMContentLoaded',function(){
    document.getElementById('logOut').addEventListener('click',logout)
    document.querySelector('.account').addEventListener('click',()=>openPages('myAccount'))
    document.querySelector('.history').addEventListener('click',()=>openPages('appointmentHistory'))
    document.querySelector('.home').addEventListener('click',()=>openPages('index'))

    })
})()