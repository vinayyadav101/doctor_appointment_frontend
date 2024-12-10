const urlparam = new URLSearchParams(window.location.search);

const stars = document.querySelectorAll('.star');
const ratingInput = document.getElementById('review-rating');
const form = document.getElementById("review-form");


    stars.forEach(star => {
        star.addEventListener('click', () => {
            ratingInput.value = star.getAttribute('data-value');


            stars.forEach(s => s.classList.remove('selected'));
            star.classList.add('selected');
            let previousStar = star.previousElementSibling;
            while (previousStar) {
                previousStar.classList.add('selected');
                previousStar = previousStar.previousElementSibling;
            }
        });
    });

function getTag(className){
    return document.querySelector(`.${className}`)
}

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("alert_button").addEventListener('click', closeAlert);
});


(async function(){
    try {
        const response = await(await fetch(`http://13.201.107.9/api/v1/search/?id=${urlparam.get("id")}`)).json()
                       
        for (const key in response.data) {
            
            if (getTag(key)) {
                if (key !== "avatar") {
                    getTag(key).textContent = response.data[key]
                }else{
                    getTag(key).src =  response.data[key].url_link
                }
                
            }
            if (["areas_of_expertise","approach_to_patient_care","fun_fact"].includes(key)) {
                getTag(key).textContent = response.data[key]
            }
        }
    
        if (response.code === 1) {
            document.getElementById("book-appointment-btn").addEventListener('click' , ()=>{
                window.location.href = `https://vinayyadav101.github.io/doctor_appointment_frontend/public/appointmentForm.html?id=${response.data._id}&doctorName=${response.data.doctorName}&fee=${response.data.consultaionFee}&department=${response.data.specialty}`
            })
            
        }
    } catch (error) {
        showAlert('error',error)
        
    }
})()


form.addEventListener("submit" , async (e)=>{
    e.preventDefault()

    if (!ratingInput.value) {
        alert("Please select a rating before submitting.");
    }
    
    const data = {
        patientEmail : document.getElementById("reviewer-email").value,
        rating : ratingInput.value,
        review : document.getElementById("review-text").value
    }

        const response = await (await fetch(`http://13.201.107.9/api/v1/user/review/${urlparam.get("id")}`,{
            method:"post",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(data)
        })).json()

        if (response.code !== 1) {
            return alert(response.msg)
        }
        
        document.getElementById("reviewer-email").value = null
        ratingInput.value = null
        document.getElementById("review-text").value = null
        stars.forEach(s => s.classList.remove('selected'));

        showAlert("success" , response.msg)
})