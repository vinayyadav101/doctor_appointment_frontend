let search = document.getElementById("search")
const doctorListDiv = document.getElementById('seaarch_result');
         const createDiv = (doctor)=>{


        const doctorContainer = document.createElement('div');
        doctorContainer.className = 'doctor-container'; // Optional: Add a class for styling
        
        const doctorDetails = document.createElement('div')
        doctorDetails.className = "doctor-details"

        const doctorProfile = document.createElement("div")
        doctorProfile.className = "doctor-image"

        const doctorName = document.createElement('h2');
        doctorName.textContent = doctor.doctorName;

        const doctorSpecialization = document.createElement('p');
        doctorSpecialization.innerHTML = `<b>Specialization:</b> ${doctor.specialty}`;

        const doctorEducation = document.createElement('p');
        doctorEducation.innerHTML = `<b>Education:</b> ${doctor.qualifications}`;

        const ConsultancyFee = document.createElement('p')
        ConsultancyFee.innerHTML = `<b>Consultancy Fee:</b> ₹${doctor.consultaionFee}`
        
        const div = document.createElement('div')
        div.className = `button`
        const button = document.createElement("button")
        const profile = document.createElement("button")
        button.textContent = 'Book Appointmnet'
        profile.textContent = "Profile"
        profile.style.marginLeft = "2%"
        button.setAttribute(
            "onclick" , 
            `bookAppointment(
            "${doctor._id}",
            "${doctor.doctorName}",
            "${doctor.consultaionFee}",
            "${doctor.specialty}"
            )`
        )
        profile.setAttribute(
            "onclick",
            `window.location.href = "http://127.0.0.1:5501/public/doctorProfile.html?id=${doctor._id}"`
        )
        
        const doctorImage = document.createElement('img');
        
        if (doctor.avatar !== undefined) {
            doctorImage.src = doctor.avatar.url_link;
        }
        
        doctorImage.alt = `${doctor.name} image`;

        doctorContainer.appendChild(doctorDetails);
        doctorContainer.appendChild(doctorProfile);
        doctorDetails.appendChild(doctorName);
        doctorDetails.appendChild(doctorSpecialization);
        doctorDetails.appendChild(doctorEducation);
        doctorDetails.appendChild(ConsultancyFee);
        doctorDetails.appendChild(div)
        div.appendChild(button)
        div.appendChild(profile)
        doctorProfile.appendChild(doctorImage);

        doctorListDiv.appendChild(doctorContainer);
        }

       

   
   
        

const topthreedoctors = (data)=>{

    for (let i = 0; i < data.length; i++) {
        
        document.getElementById(`doctorName_${i+1}`).textContent = data[i].doctorName || '-'
        document.getElementById(`specialty_${i+1}`).textContent = data[i].specialty || '-'
        document.getElementById(`number_${i+1}`).textContent = data[i].number || '-'
        document.getElementById(`address_${i+1}`).textContent = data[i].address  || '-'
        document.getElementById(`consultancy_${i+1}`).textContent = data[i].consultaionFee || '-'
        document.getElementById(`book_button_${i+1}`).setAttribute(
            "onclick" , 
            `bookAppointment(
            "${data[i]._id}",
            "${data[i].doctorName}",
            "${data[i].consultaionFee}",
            "${data[i].specialty}",
            )`
        )

        if (data[i].avatar !== undefined) {
            document.getElementById(`image_${i+1}`).src = data[i].avatar.url_link
        } 
    }
}


const bookAppointment = (id , name , fee , department)=>{
    
    window.location.href = `http://127.0.0.1:5501/public/appointmentForm.html?id=${encodeURIComponent(id)}&doctorName=${name}&fee=${fee}&department=${department}`
    
}



(async function() {

try {
    const doctor_details = await fetch("http://127.0.0.1:5501/api/v1/search/topthreedoctors")
    .then(data => data.json())

topthreedoctors(doctor_details.data)
} catch (error) {
    return showAlert("error" , error)
}
    
})();






search.addEventListener("input" , async()=>{
    await fetch(`http://localhost:8085/api/v1/search/?collect=${search.value.toLowerCase()}`)
    .then(data => {
            return data.json()
        })
        .then(data1 => {
            doctorListDiv.innerHTML = '';
            data1.data.forEach(element => {
                createDiv(element)
            });
        })
})
// menu code //
