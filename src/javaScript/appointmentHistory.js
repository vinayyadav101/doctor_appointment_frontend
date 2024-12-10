(async function() {
    const role = await checkCookie()

    if (role === "doctor") {
        const tr = document.querySelector('.appointment-table thead tr')
        const submit = document.createElement('th')
        submit.textContent = "Upload"
        const th =document.querySelectorAll('.appointment-table thead tr th')
        tr.appendChild(submit)
        
        th[0].textContent = "Patient Name"
        th[1].textContent = "Patient Email"
        th[3].textContent = "Appointment ID"
        th[7].textContent = "Prescription"    
        th[6].remove()
        
    }
})()

async function residual(residual , id){
    const loading = document.querySelector('.loading')
    loading.style.display = "block"
    
    try {
        const response = await(await fetch(`http://13.201.107.9/api/v1/doctor/residual/${id}`,{
            method:'put',
            credentials:"include",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({"residual":residual})
        })).json()

        if (response.code === 0) {
            loading.style.display="none"
            return showAlert("error", response.msg)
        }
        loading.style.display="none"
        showAlert("success" , response.msg)
        document.getElementById("alert_button").addEventListener("click",()=>window.location.reload())

    } catch (error) {
        loading.style.display="none"
        return showAlert("error",error)
    }
    
} 
async function getHistory() {
    try {
        const response = await(await fetch("http://13.201.107.9/api/v1/user/" , {
            credentials:"include"
        })).json()
        
        if (response.code !== 1) {
            showAlert("error" , response.msg)
            return;
        }
        
        renderAppointments(response.data)
    } catch (error) {
        showAlert("error",error)
    }
}

getHistory()
  // Function to render appointments    
function renderAppointments(appointments) {

    
    const tableBody = document.getElementById("appointmentTableBody");
    appointments.forEach(appointment => {

        
        
        const key = Object.keys(appointment)
        key.forEach(v=>{
            if (appointment[v] === null) {
                appointment[v] = "-"
            }else if (typeof appointment[v] === "object") {
                const key = Object.keys(appointment[v])
                   key.forEach(v1=>{
                    if (appointment[v][v1] === null) {
                        appointment[v][v1] = "-"
                    }
                   })
                   
                }
            })
            const row = document.createElement("tr");
            const th = document.querySelectorAll('.appointment-table thead tr th')


                   if (appointment.patientName) {
                

                            row.innerHTML = `
                        <td>${appointment.patientName}</td>
                        <td>${appointment.patientEmail}</td>
                        <td>${appointment.status}</td>
                        <td>${appointment._id}</td>
                        <td>${appointment.bookedDateTime.date} ${appointment.bookedDateTime.time}</td>
                        <td class="residual">${appointment.residual.date} ${appointment.residual.time}</td>
                        <td class="prescription"><a href="${appointment.prescription.url_link}" target="_blank" class="prescription-link" download>View Prescription</a></td>
                        <td class='button' id=${appointment._id}>Submit</td>
                        `;
                        
                        if (appointment.residual.date === "-") {
                            row.querySelector('.residual').innerHTML = `<input type="datetime-local" name="" id="">` 
                        }
                        if (appointment.prescription.url_link === "-") {
                            const aTag = row.querySelector('.prescription a')
                            aTag.removeAttribute('download')
                            aTag.textContent = "Add Pescription"
                                if (appointment.status !== "cancel") {
                                    aTag.href = `https://vinayyadav101.github.io/doctor_appointment_frontend/public/prescriptionForm.html?id=${appointment._id}&patientName=${appointment.patientName}`
                                }else{
                                    aTag.style.pointerEvents = "none"
                                    aTag.style.cursor = "no-drop"
                                }
                        }
                            
                   }else{
                        row.innerHTML = `
                    <td>${appointment.doctorName}</td>
                    <td>${appointment.department}</td>
                    <td>${appointment.status}</td>
                    <td>${appointment.order_id}</td>
                    <td>${appointment.bookedDateTime.date} ${appointment.bookedDateTime.time}</td>
                    <td>${appointment.residual.date} ${appointment.residual.time}</td>
                    <td>${appointment.prescription.prescription_id}</td>
                    <td><a href="${appointment.prescription.url_link}" target="_blank" class="prescription-link" download>View Prescription</a></td>
                    `;
                }
                
                tableBody.appendChild(row);

                document.getElementById(appointment._id).addEventListener('click',(e)=>{
                    const data = e.target.previousElementSibling.previousElementSibling.childNodes[0].value
                    
                    if (data === undefined) {
                        return showAlert("error","you alredy residualed")
                    }
                    if (data === '') {
                        return showAlert("error","please select residual date and time")
                    }else{
                        const dateAndTime = data.split('T')
                        const date = new Date(dateAndTime[0]).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replaceAll(' ','-')
                        const time = new Date(data).toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase()
                        
                            if (dateAndTime[1].split(':')[1] !== '00') {
                                    return showAlert("error","this time is unvalid")
                                }
                            
                                    residual({"date":date,"time":time} , e.target.id)
                    }
                    
                })
                   
            });
}








