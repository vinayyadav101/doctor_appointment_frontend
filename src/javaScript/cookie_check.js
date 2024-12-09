async function checkCookie(){
    
    const profileLogo = document.getElementById('profile_logo')
    const logIn = document.getElementById('logIn')
    const options = document.querySelector('.options')
    const logOut = document.getElementById('logOut')
    try {
        const check_cookie = await (await fetch('http://localhost:8085/api/v1/user/cookie_check' , {
            method:'get',
            credentials:'include'
        })).json()


        if (check_cookie.code === 1) {
            if (window.location.pathname !== "/public/adminPage.html") {
                profileLogo.style.display = 'grid'
                logIn.style.display = 'none'
                logOut.style.display = "block"
                document.getElementById('head').style.gridTemplateColumns = "10% auto 6%"
                return check_cookie.data
            }else{
                if (check_cookie.data !== "admin") {
                    logout()
                    checkCookie()
                }else{
                    profileLogo.style.display = 'grid'
                    logIn.style.display = 'none'
                    logOut.style.display = "block"
                    document.getElementById('head').style.gridTemplateColumns = "10% auto 6%"
                    return check_cookie.data
                }
            }
        }else{
            profileLogo.style.display = 'none'
            logIn.style.display = 'block'
            logOut.style.display = "none"
            document.getElementById('head').style.gridTemplateColumns = "10% auto"

            if (check_cookie.code === 0) {
                
                return check_cookie.code
            }
        }
            
    } catch (error) {
        showAlert('error',error)   
    }
    
}
checkCookie()
