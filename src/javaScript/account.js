function getTag(className){
    if (className === 'avatar') {
        return document.querySelector(`.account_profile img`)
    }else if (className === 'userName') {
        return document.getElementById('userName')
    } else{
        return document.querySelector(`.${className}`)
    }
}
const data ={
    avatar:'',
    userName:'',
    email:'',
    phone:''
}
async function getprofile(){
    try {
        const response = await(await fetch("http://13.201.107.9/api/v1/user/profile",{
            credentials:'include'
        })).json()

        if (response.code === 1) {
            
            for (const key in response.data) {
                if (getTag(key)) {
                    document.querySelector(`.${key}`).value = response.data[key]
                    data[key] = getTag(key).value
                }
                if (key === "avatar") {
                    getTag(key).src = response.data[key].url_link
                    data[key] = getTag(key).src
                }  
                if (key === 'userName' || key === 'doctorName') {
                    getTag('userName').value = response.data[key]
                    data['userName']= getTag('userName').value
                    document.querySelector('.userName').textContent = response.data[key]
                }   
            }
            
        }
    } catch (error) {
        showAlert("error",error)
    }
}

getprofile()  

async function updateProfile(data){
    loading.style.display = 'block'

    const formData = new FormData()
    Object.keys(data).forEach(v=> formData.append(v,data[v]))

      
        try {
            const response = await(await fetch("http://13.201.107.9/api/v1/user/updateprofile",{
                credentials:'include',
                method:"PUT",
                body:formData
            })).json()


            if (response.code !== 1 ) {
                loading.style.display = 'none'
                return showAlert("error" , response.msg)
            }else{
                loading.style.display = 'none'
                showAlert("success" , response.msg)
                document.getElementById("alert_button").addEventListener("click",()=>window.location.reload())      
            }

        } catch (error) {
            loading.style.display = 'none'
            showAlert("error" , error)
        }
}

async function changepassword() {
    try {
        const response = await(await fetch("http://13.201.107.9/api/v1/user/changepassword",{
            credentials:"include",
            method:"put",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({
                oldPassword:getTag("oldPassword").value,
                newPassword:getTag("newPassword").value
            })
        })).json()


        if (response.code !== 1 ) {
            showAlert("error" , response.msg)
        }else{
            showAlert("success" , response.msg)
            document.getElementById("alert_button").addEventListener("click",()=>window.location.reload())      
        }

    } catch (error) {
        showAlert("error" , error)
    }

}

document.querySelector(".user_form").addEventListener('submit',(e)=>{
    e.preventDefault()
    if (getTag("oldPassword").value !== "" && getTag("newPassword").value !== "") {
        changepassword()
        return
        
    }



    const check_value_condition = Object.keys(data).filter(v=> {



        if (v === 'userName') {
            return data[v] !== document.getElementById('userName').value
        } else if (v === 'avatar') {
            return data[v] !== getTag(v).src
        }else{
            return data[v] !== getTag(v).value
        }
    })
      
        if (check_value_condition.length === 0) {
            showAlert("error" , "change filde value")
            return
        }

        const changed_data = new Object()
        check_value_condition.forEach(v => {
            if (v === 'userName') {
                changed_data[v] = document.getElementById(v).value
            }if (v === 'avatar') {
                changed_data[v] = document.getElementById('avatar').files[0]
            } else{
                changed_data[v] = getTag(v).value
            }
        })

        
        updateProfile(changed_data)

        
})

document.getElementById('avatar').addEventListener('change',function(){
    const files = this.files
    
    document.querySelector('.account_profile img').src = URL.createObjectURL(files[0])
    data.avatar = URL.createObjectURL(files[0])
    
})


