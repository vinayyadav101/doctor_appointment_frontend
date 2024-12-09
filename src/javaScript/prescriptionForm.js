const urlparam = new URLSearchParams(window.location.search);
const addRowBtn = document.getElementById('add-row-btn');
const tableBody = document.getElementById('prescription-table-body');
const submitBtn = document.querySelector('.prescriptionForm');

document.querySelector('.Date').textContent = new Date().toLocaleDateString('en-GB').split('/').join('-');
if (urlparam.get("patientName")) {
    document.querySelector('.patientName').value = urlparam.get("patientName")
}



(async function (){
    try {
        const role = await checkCookie()
        if (role === "user") {
            showAlert("error" , "Accsess denid!")
            return;
        }
        const response = await(await fetch("http://localhost:8085/api/v1/user/profile" ,{
            credentials:'include'
        })).json()

        if (response.code === 0) {
            showAlert("error",response.msg)
            
            return;
        }

        document.querySelector(".doctorName").textContent = response.data.doctorName
        

    } catch (error) {
        showAlert("error",error)
        return;
    }
})()

function updateEmptyFields(obj) {
    for (let key in obj) {
      if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
        
        updateEmptyFields(obj[key]);
  
      } else if (Array.isArray(obj[key])) {
       
        obj[key].forEach(item => updateEmptyFields(item));
  
      } else if (obj[key] === "") {
     
        obj[key] = "Not Mention";
  
      }
    }
  }

async function uploadPdfOnServer(pdfBlob){
    const loading = document.querySelector('.loading')
    loading.style.display = "block"
            
    const formData = new FormData();
    formData.append('Prescription', pdfBlob,'prescription.pdf');
            
            
        try {

            const response = await(await fetch(`http://localhost:8085/api/v1/doctor/sendprescription?id=${urlparam.get("id")}`, {
                method: 'put',
                credentials: "include",
                body: formData
            })).json()

                if (response.code !== 0) {
                    loading.style.display = "none"
                    showAlert("success" , response.msg)
                    document.getElementById("alert_button").addEventListener("click",()=>window.location.href = 'http://127.0.0.1:5501/public/appointmentHistory.html')
                    return;
                }

                loading.style.display = "none"
                showAlert("error",response.msg)
                return;

        } catch (err) {
            loading.style.display = "none"
            showAlert("error",err)
            return;
        }
    
}

function createPrescription(data) {
    updateEmptyFields(data)

    try {

        const doc = new PDFDocument();


            const chunks = [];

            // Listen for data and add chunks to the array
            doc.on('data', (chunk) => chunks.push(chunk));
            
            // Listen for the end of the document
            doc.on('end', () => {
                // Combine chunks into a Blob
                const pdfBlob = new Blob(chunks, { type: 'application/pdf' });

                // Send the PDF file to the API
                uploadPdfOnServer(pdfBlob);
            });

        doc.font('Helvetica').fontSize(10);


          doc
            .fontSize(18)
            .text(data.prescriberDetails.doctorName, 50, 50)
            .fontSize(14)
            .text("Medical Prescription", 50, 70);

          doc
            .fontSize(16)
            .text(data.prescriberDetails.hospitalName, 300, 50, { align: 'right' });

          
          doc
            .fontSize(10)
            .rect(50, 100, 500, 100).stroke() // Outer box
            .text(`Patient Name: ${data.genralDetails.patientName}`, 55, 105)
            .text(`Date: ${data.genralDetails.Date}`, 350, 105)
            .text("S/O | D/O | W/O:", 55, 125)
            .text(`Age: ${data.genralDetails.Age}`, 350, 125)
            .text(`Sex: ${data.genralDetails.Sex}`, 400, 125)
            .text(`Health Insurance No.: ${data.genralDetails.HealthInsuranceNoovide}`, 55, 165)
            .text(`Health Care Provider: ${data.genralDetails.HealthCareProviderrovide}`, 250, 165)
            .text(`Health Card No.: ${data.genralDetails.HealthCardNo}`, 55, 185)
            .text(`Patient ID No.: ${data.genralDetails.PatientIDNo}`, 250, 185);

          // Patient Address Section
          doc
            .rect(50, 210, 500, 20).stroke() 
            .text(`Patient's Address: ${data.genralDetails.patientAddress}`, 55, 215);

          // Diagnosis Section
          doc
            .rect(50, 240, 350, 20).stroke() 
            .text(`Diagnosed With: ${data.gernralTestResults.Dignosed}`, 55, 245)
            .rect(400, 240, 150, 20).stroke() 
            .text(`Cell No: ${data.gernralTestResults.CellNO}`, 405, 245);

          // Vitals Section
          doc
            .rect(50, 270, 150, 20).stroke()
            .text(`Blood Pressure: ${data.gernralTestResults.BllodPressure}`, 55, 275)
            .rect(210, 270, 150, 20).stroke() 
            .text(`Pulse Rate: ${data.gernralTestResults.PulseRate}`, 215, 275)
            .rect(370, 270, 150, 20).stroke() 
            .text(`Weight: ${data.gernralTestResults.Wegight}`, 375, 275)


          doc
            .font('Helvetica-Bold')
            .rect(50, 300, 35, 20).stroke()
            .text('NO' , 60 , 305)
            .rect(85, 300, 150, 20).stroke()
            .text('Drugs' , 130 , 305)
            .rect(235, 300, 150, 20).stroke()
            .text('unit(Tablet / syrup' , 265 , 305)
            .rect(385, 300, 165, 20).stroke()
            .text('Dosage(Per Day)' , 430 , 305)
            .moveDown(0.3)


            data.medicineDetails.forEach((value , index) => {
              const startY = 320
          
              doc
                  .font('Helvetica')
                  .rect(50, startY + index * 20, 35, 20).stroke()
                  .text(index + 1 ,60 , (startY + index * 20)+5)
                  .rect(85, startY + index * 20, 150, 20).stroke()
                  .text(value.drugName , 95 , (startY + index * 20) + 5)
                  .rect(235, startY + index * 20, 150, 20).stroke()
                  .text(value.Units , 310 , (startY + index * 20) + 5)
                  .rect(385, startY + index * 20, 165, 20).stroke()
                  .text(value.dosages , 465 , (startY + index * 20) + 5 )        
                  .moveDown(0.3)
          
          })


          doc
              .rect(50, doc.y + 5, 500, 40).stroke()
              .font('Helvetica-Bold')
              .text("Diet To Follow:", 55, doc.y + 10 , {continued:true})

          doc
            .font('Helvetica')
            .text(data.ComanText.dietFollow)
            .moveDown(2);

          // History Section
          doc
            .rect(50, doc.y + 5, 500, 40).stroke() 
            .font('Helvetica-Bold')
            .text("Brief History of Patient: ", 55, doc.y + 10 , {continued:true})

          doc
            .font('Helvetica')
            .text(data.ComanText.briefHistory)
            .moveDown(2);



          // Signature Section
          doc
            .rect(300, doc.y + 5, 250, 20).stroke() // Box for Signature
            .text(`Doctor name:${data.prescriberDetails.doctorName}`, 305, doc.y + 10);

          // Finalize the PDF and end the stream
          doc.end();
      



    } catch (error) {
        
    }
    
}



    

addRowBtn.addEventListener('click', () => {
    const rowCount = tableBody.rows.length + 1;
    const newRow = document.createElement('tr');
    
    newRow.innerHTML = `
        <td>${rowCount}</td>
        <td><input type="text" class="input-field drugName" placeholder="Drug Name"></td>
        <td><input type="number" class="input-field Units" placeholder="Unit"></td>
        <td><input type="number" class="input-field dosages" placeholder="Dosage"></td>
    `;
    
    tableBody.appendChild(newRow);
});


submitBtn.addEventListener('submit', (e) => {
e.preventDefault()
    
    const prescriptions = Array()
        
    const inputs = document.querySelectorAll("#prescription-table-body td input")
            
            for (let i = 0; i < inputs.length; i=i+3) {
                const obj = Object()

                obj[inputs[i].classList[1]] = inputs[i].value
                obj[inputs[i+1].classList[1]] = inputs[i+1].value
                obj[inputs[i+2].classList[1]] = inputs[i+2].value
            
                prescriptions.push(obj)
            }



    const data = {
        prescriberDetails:{
            doctorName:document.querySelector('.doctorName').textContent,
            hospitalName:"HealthCare hospital",
        },
        genralDetails:{
            patientName:document.querySelector('.patientName').value,  
            patientAddress:document.querySelector('.patientAddress').value,
            Date:document.querySelector('.Date').textContent,
            Age:document.querySelector('.Age').value,
            Sex:document.querySelector('.Sex').value,
            HealthInsuranceNoovide:"",
            HealthCareProviderrovide:"",
            HealthCardNo:"",
            PatientIDNo:""
            
        },
        gernralTestResults:{
            Dignosed:document.querySelector('.Dignosed').value,
            CellNO:document.querySelector('.CellNO').value,
            BllodPressure:document.querySelector('.BllodPressure').value,
            PulseRate:document.querySelector('.PulseRate').value,
            Wegight:document.querySelector('.Wegight').value,
        },
        
        medicineDetails:prescriptions,
        ComanText:{
            dietFollow:document.querySelector('.dietFollow').value,
            briefHistory:document.querySelector('.briefHistory').value
        }
    }
        
        createPrescription(data)
});