const randerContainer = document.querySelector('.secondContainer')
const doctorform = document.querySelector(".doctorRegister")
const dashboard1 = document.querySelector('.dashboard')
const paymentt = document.querySelector('.pay')
const appointment1 = document.querySelector('.ap')
const doctor = document.querySelector('.doctor')
const user = document.querySelector('.us')
const data = {};

function numberInsert(name = 'dashboard') {
    
    if (name === 'dashboard') {
        document.querySelector('.appointments span').textContent = data.appointment
        document.querySelector('.users span').textContent = data.user
        document.querySelector('.doctors span').textContent = data.doctor
        document.querySelector('.payments span').textContent = data.payment
    }else if(name === 'payment'){
        
        document.querySelector('.payments span').textContent = data.payment
        document.querySelector('.refunds span').textContent = data.refundpayment

    }else if (name === 'appointment') {
        document.querySelector('.completedAppointment span').textContent = data.completedAppointment
        document.querySelector('.canceledAppointment span').textContent = data.canceledAppointment
    }
}
(async function(){
    try {
        const response = await(await fetch('http://localhost:8085/graph/v2/admin/AllDataInNumbers',{credentials:'include'})).json()
            if (response.code !==1) {
                return showAlert('error','number data not get from server')
            }
            Object.assign(data , response.data)
            numberInsert()
    } catch (error) {
        return showAlert('error',error)
    }
})()

async function doctorregistrationform(event){
        event.preventDefault()
    const data = {}
    function celarfildes(){
        document.getElementById("alert_button").addEventListener("click",()=>{
            tages.forEach(el=>el.value = '')
        })
    }
        const tages = document.querySelectorAll('#doctorRegistrationForm input , select , textarea')
    tages.forEach((el)=>{
        data[el.name] = el.value
    })
        try {
            const response = await(await fetch('http://localhost:8085/api/v1/doctor/register',{
                credentials:'include',
                method:'post',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify(data)
            })).json()

                if (response.code !== 1) {
                     showAlert('error',response.msg)
                return celarfildes()

                }
                showAlert('success', 'doctor register successfully')
                return celarfildes()
                
        } catch (error) {
                 showAlert('error',error)
            return celarfildes()
        }
}

async function getGraphData(route) {
    
    try {
        const response = await(await fetch(`http://localhost:8085/graph/v2/admin/${route}`,{credentials:'include'})).json()

        if (response.code !== 1) {
            return showAlert("error",response.msg)
        }


        return response.data
    } catch (error) {
        showAlert("error",error)
    }
}
function loadChart(name="dashboard" , ...data){
    
    google.charts.load('current',{packages:['corechart']});

    google.charts.setOnLoadCallback(()=>{
        if (name === "dashboard") {
            dashboardChart1(data[0])
            dashboardChart2(data[1])
            
        } else if (name === "payment") {
            paymentRefundeChart()
            paymentCompletedChart()
        }else if (name === "appointment") {
            appointmentChart1(data[0])
            appointmentChart2(data[1])
            
        }
    })
    
}
function dashboardChart1(chartData) {

        var data = new google.visualization.DataTable();

    
      data.addColumn('date', 'X');
      data.addColumn('number','Amount');


      data.addRows(chartData.map(([k,v])=>[new Date(k),v]));

      var options = {
        
        vAxis: {
          title: 'Amount'
        },
      };

      var chart = new google.visualization.LineChart(document.getElementById('dashboardPaymentChart'));
      chart.draw(data, options);
}
function dashboardChart2(chartData) {
    
    const data = google.visualization.arrayToDataTable(chartData);

const options = {
title:'persentage of appointment department'
};

const appointment = new google.visualization.PieChart(document.getElementById('dashboardAppointmentChart'));
appointment.draw(data, options);
}
function appointmentChart1(chartData) {
    
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Month');
    data.addColumn('number', 'newUser');
    data.addColumn('number', 'Old USer');

    data.addRows(chartData);

    var options = {
      hAxis: {
        title: 'year'
      },
      vAxis: {
        title: 'Appointments'
      },
      series: {
        1: {curveType: 'function'}
      }
    };

    var chart = new google.visualization.LineChart(document.getElementById('appointmentChart'));
    chart.draw(data, options);
}
function appointmentChart2(chartData) {
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'number Of appointments');
    data.addColumn('number', 'confirm');
    data.addColumn('number', 'Canceld');

    data.addRows(chartData);

    var options = {
      title: 'Status of confirm and Canceld Appointment monthly',
      colors: ['#9575cd', '#33ac71'],
      hAxis: {
        title: 'months',
      },
      vAxis: {
        title: 'Number Of Appointmnets'
      }
    };

    var chart = new google.visualization.ColumnChart(document.getElementById('appointmentUserChart'));
    chart.draw(data, options);
}
function paymentRefundeChart() {
    var data = google.visualization.arrayToDataTable([
      ['Year', 'Sales'],
      ['2013',  1000],
      ['2014',  1170],
      ['2015',  660],
      ['2016',  1030]
    ]);

    var options = {
      title: 'Company Performance',
      hAxis: {title: 'Year',  titleTextStyle: {color: '#333'}},
      vAxis: {minValue: 0}
    };

    var chart = new google.visualization.AreaChart(document.getElementById('paymentRefundeChart'));
    chart.draw(data, options);
  }
function paymentCompletedChart() {
    var data = google.visualization.arrayToDataTable([
      ['Year', 'Sales'],
      ['2013',  1000],
      ['2014',  1170],
      ['2015',  660],
      ['2016',  1030]
    ]);

    var options = {
      title: 'Company Performance',
      hAxis: {title: 'Year',  titleTextStyle: {color: '#333'}},
      vAxis: {minValue: 0}
    };

    var chart = new google.visualization.AreaChart(document.getElementById('paymentCompletedChart'));
    chart.draw(data, options);
  }

async function dashBoardData(){
    loading.style.display = "block"
    const data1 = await getGraphData('paymentCollection')
    const data2 =await getGraphData('departmentPortion')
    numberInsert()
    loadChart('dashboard', data1 , data2)
    loading.style.display = "none"

}

function paymentdetails(el){
    
    const paymentDetails =document.getElementById('result-bar')
    paymentDetails.style.display = 'grid'
    paymentDetails.innerHTML = `
        <div class="result-item">
                <span class="label">PaymentId:</span>
                <span class="value">${el.payment_id}</span>
            </div>
            <div class="result-item">
                <span class="label">Signature:</span>
                <span class="value">${el.signature}</span>
            </div>
            <div class="result-item">
                <span class="label">OrderId:</span>
                <span class="value">${el.order_id}</span>
            </div>
            <div class="result-item">
                <span class="label">Date:</span>
                <span class="value">${el.createdAt}</span>
            </div>
            <div class="result-item">
                <span class="label">Status:</span>
                <span class="value">${el.refund?'Refunded':'Completed'}</span>
            </div>
            <div class="result-item">
                <span class="label">Amount:</span>
                <span class="value">${el.amount}</span>
            </div>
            <div class="result-item">
                <span class="label">Refund:</span>
                <span class="value">${el.refund?el.refund:'-'}</span>
            </div>
            <div class="button-container">
                <button class="refund-button">Refund</button>
                <button class="cancel-button">Cancel</button>
            </div>
    `
    paymentDetails.querySelector('.cancel-button').addEventListener(
        'click',
        ()=>canculButton()
    )

}
function appointmentdetails(el) {

    const appointmentDetails =document.getElementById('result-bar')
        appointmentDetails.style.display = 'grid'

    appointmentDetails.innerHTML = `
        <div class="result-item">
                <span class="label">Patient Name:</span>
                <span class="value">${el.patientName}</span>
        </div>
        <div class="result-item">
                <span class="label">Patient email:</span>
                <span class="value">${el.patientEmail}</span>
        </div>
        <div class="result-item">
                <span class="label">Doctor Name:</span>
                <span class="value">${el.doctorName}</span>
        </div>
        <div class="result-item">
                <span class="label">Department:</span>
                <span class="value">${el.department}</span>
        </div>
        <div class="result-item">
                <span class="label">Date:</span>
                <span class="value">${el.bookedDateTime.date}</span>
        </div>
        <div class="result-item">
                <span class="label">Time:</span>
                <span class="value">${el.bookedDateTime.time}</span>
        </div>
        <div class="result-item">
                <span class="label">Order ID:</span>
                <span class="value">${el.order_id}</span>
        </div>
        <div class="result-item">
                <span class="label">Appointment ID:</span>
                <span class="value">${el._id}</span>
        </div>
        <div class="result-item">
                <span class="label">Patient Phone No:</span>
                <span class="value">${el.phone}</span>
        </div>
        <div class="result-item">
                <span class="label">Status:</span>
                <span class="value">${el.status}</span>
        </div>
        <div class="result-item">
                <span class="label">Prescription:</span>
                ${el.prescription.url_link !== null ?
                    `<a href=${el.prescription.url_link}>link</a>`:
                    `<span style="color: red;">Not Upload</span>`
                }
        </div>
        <div class="button-container">
                <button class="cancel-button">Cancel</button>
        </div>
    `
        appointmentDetails.querySelector('.cancel-button').addEventListener(
            'click',
            ()=>canculButton()
        )
    
}

function canculButton(){
    const paymentDetails =document.getElementById('result-bar')
        paymentDetails.innerHTML = ''
        paymentDetails.style.display ='none'
}
async function deleteDoctor(id){
    try {
        const response = await(await fetch(`http://localhost:8085/api/v2/admin/deletedoctor/${id}`,{
            credentials:'include',
            method:'delete'
        })).json()
            if (response.code !== 1) {
                return showAlert('error',response.msg)
            }
            showAlert('success','doctor remove successfully.')
            document.getElementById("alert_button").addEventListener("click",()=>window.location.reload())
    } catch (error) {
        return showAlert('error',error)
    }
}
async function deleteUser(id){
    try {
        const response = await(await fetch(`http://localhost:8085/api/v2/admin/deleteuser/${id}`,{
            credentials:'include',
            method:'delete'
        })).json()
            if (response.code !== 1) {
                return showAlert('error',response.msg)
            }
            showAlert('success','user remove successfully.')
            document.getElementById("alert_button").addEventListener("click",()=>window.location.reload())
    } catch (error) {
        return showAlert('error',error)
    }
}
async function PaymentFindByID(event) {
    
    const id = event.srcElement.value
    const paymentTable = document.getElementById('paymentHistoryBody')
        
    if (event.key === 'Enter') {
        if (id.length === 0) {
            return getAllPayments()
        }else if (id.length !== 14) {
            return showAlert('error','please enter valid id.')
        }
            try {
                const response = await(await fetch(`http://localhost:8085/api/v1/payment/payment/pay_${id}`)).json()

                    if (response.code !== 1) {
                        return showAlert('error',response.msg)
                    }


                    paymentTable.innerHTML = `
                        <tr>
                            <td>${response.data.payment_id}</td>
                            <td>${response.data.order_id}</td>
                            <td>${response.data.appointment_id}</td>
                            <td>&#8377;${response.data.amount}</td>
                            ${response.data.refund?`<td>&#8377;${response.data.refund}</td>`:`<td>-</td>`}
                        </tr>
                    `
                    paymentTable.querySelector('tr').addEventListener(
                        'click',
                        ()=>paymentdetails(response.data)
                    )
                
            } catch (error) {
                showAlert('error',error)
                
            }
    }
}
async function appointmentFindByID(event) {
    
    const id = event.srcElement.value
    const appointentTable = document.getElementById('appointmentHistoryBody')
        
    if (event.key === 'Enter') {
        if (id.length === 0) {
            return getAllAppointments()
        }else if (id.length !== 24) {
            return showAlert('error','please enter valid id.')
        }
        
            try {
                const response = await(await fetch(`http://localhost:8085/api/v2/admin/appointment/${id}`)).json()

                    if (response.code !== 1) {
                        return showAlert('error',response.msg)
                    }


                    appointentTable.innerHTML = `
                        <tr>
                            <td>${response.data.patientEmail}</td>
                            <td>${response.data.doctorName}</td>
                            <td>${response.data.department}</td>
                            <td>${response.data.bookedDateTime.date}</td>
                            <td>${response.data._id}</td>
                            <td>${response.data.status}</td>
                        </tr>
                    `
                    appointentTable.querySelector('tr').addEventListener(
                        'click',
                        ()=>appointmentdetails(response.data)
                    )
                
            } catch (error) {
                showAlert('error',error)
                
            }
    }
}
async function getAllPayments(){
    try {
        const response = await(await fetch('http://localhost:8085/api/v2/admin/payments',{credentials:'include'})).json()

        if (response.code === 0) {
            return showAlert('error',response.msg)
        }
        const apdend = document.getElementById('paymentHistoryBody')
        response.data.forEach(el => {
            const row = document.createElement('tr')
            row.innerHTML = `
                <tr>
                    <td>${el.payment_id}</td>
                    <td>${el.order_id}</td>
                    <td>${el.appointment_id}</td>
                    <td>&#8377;${el.amount}</td>
                    ${el.refund?`<td>&#8377;${el.refund}</td>`:`<td>-</td>`}
                </tr>
                `;

                
                row.addEventListener('click',()=>paymentdetails(el))
                apdend.append(row)
            });
        
        
            
        } catch (err) {
            return showAlert('error',err)
        
        }
}

async function getAllAppointments(){
    try {
        const response = await(await fetch('http://localhost:8085/api/v2/admin/appointments',{credentials:'include'})).json()

        if (response.code === 0) {
            return showAlert('error',response.msg)
        }
        const apdend = document.getElementById('appointmentHistoryBody')
        response.data.forEach(el => {
            
            const row = document.createElement('tr')
            row.innerHTML = `
                
                    <td>${el.patientEmail}</td>
                    <td>${el.doctorName}</td>
                    <td>${el.department}</td>
                    <td>${el.bookedDateTime.date}</td>
                    <td>${el._id}</td>
                    <td>${el.status}</td>
                
                `
                row.addEventListener('click',()=>appointmentdetails(el))
                apdend.append(row)
        });
        
        
        
    } catch (err) {
        return showAlert('error',err)
        
    }
}
function openreviewDetails(el){
    const reviewDetails = document.getElementById('result-bar')
        reviewDetails.style.display = 'grid'
    reviewDetails.innerHTML = `
            <div class="result-item">
                <span class="label">Patiant Email:</span>
                <span class="value">${el.patientEmail}</span>
            </div>
            <div class="result-item">
                <span class="label">Rating:</span>
                <span class="value">${el.rating}</span>
            </div>
            <div class="result-item">
                <span class="label">review:</span>
                <span class="value">${el.review}</span>
            </div>
            <div class="button-container">
                <button class="refund-button">Delete</button>
                <button class="cancel-button">Cancel</button>
            </div>
    `
    reviewDetails.querySelector('.cancel-button').addEventListener(
        'click',
        ()=>canculButton()
    )
}
async function getDoctorDetails(name) {
    
    try {
        const respponse = await(await fetch(`http://localhost:8085/api/v1/search/admin/?collect=${name.toLowerCase()}`,{
            credentials:'include'
        })).json()
        
            if (respponse.code !== 1) {
                return showAlert('error',respponse.msg)
            }


            document.querySelector('.doctor-details-dashboard').style.display = 'block'
        for (const key in respponse.data[0]) {
            if (document.querySelector(`.${key}`)) {
                document.querySelector(`.${key}`).textContent = respponse.data[0][key]   
            }
            if (key === '_id') {
                document.getElementById('delete-doctor-btn').addEventListener(
                    'click',
                    ()=>deleteDoctor(respponse.data[0][key])
                )
                
            }

            if (key === 'review') {
                const reviewsBody = document.getElementById('appointmentHistoryBody')
                respponse.data[0][key].forEach(el=>{
                    const row = document.createElement('tr')
                    row.innerHTML = `
                        <td>${el.patientEmail}</td>
                        <td>${el.rating}</td>
                    `
                    reviewsBody.append(row)
                    row.addEventListener('click',()=>openreviewDetails(el))
                })
            }
            
        }
        
    } catch (error) {
        showAlert('error',error)
        
    }
}
async function getUserDetails(email) {
    
    try {
        const respponse = await(await fetch(`http://localhost:8085/api/v2/admin/user/${email.toLowerCase()}`,{
            credentials:'include'
        })).json()
        
            if (respponse.code !== 1) {
                return showAlert('error',respponse.msg)
            }
            document.querySelector('.doctor-details-dashboard').style.display = 'block'
        for (const key in respponse.data) {
            
            if (document.querySelector(`.${key}`)) {
                document.querySelector(`.${key}`).textContent = respponse.data[key]   
            }
            if (key === '_id') {
                document.getElementById('delete-user-btn').addEventListener(
                    'click',
                    ()=>deleteUser(respponse.data[key])
                )
                
            }
            
        }
        
    } catch (error) {
        showAlert('error',error)
        
    }
}

doctorform.addEventListener('click',()=>{

    randerContainer.innerHTML = register
})

appointment1.addEventListener('click',async()=>{
    loading.style.display = "block"
    const data1 = await getGraphData('appointmentUsers')
    const data2 = await getGraphData('appointmentStatus')
    randerContainer.innerHTML = appointmnet
    getAllAppointments()
    numberInsert('appointment')
    loadChart("appointment",data1,data2)
    document.getElementById('searchOrderId').addEventListener('keypress',()=>appointmentFindByID(event))
    loading.style.display = "none"
})

dashboard1.addEventListener('click',async()=> {
    randerContainer.innerHTML = dashboard
    dashBoardData()
})


paymentt.addEventListener('click',async()=>{
    randerContainer.innerHTML = payment
    numberInsert('payment')
    loadChart('payment')
    getAllPayments()
    document.getElementById('searchOrderId').addEventListener('keypress',()=>PaymentFindByID(event))
})
doctor.addEventListener('click',()=>{
    randerContainer.innerHTML = doctors
    document.getElementById('searchDoctorName').addEventListener('keypress',(event)=>{
        if (event.srcElement.value.length === 0) {
            document.querySelector('.doctor-details-dashboard').style.display = 'none'
        }else if (event.key === 'Enter') {
            getDoctorDetails(event.srcElement.value)
        }
    })

})
user.addEventListener('click',()=>{
    randerContainer.innerHTML = users
    document.getElementById('searchOrderId').addEventListener('keypress',(event)=>{
        if (event.srcElement.value.length === 0) {
            document.querySelector('.doctor-details-dashboard').style.display = 'none'
        }else if (event.key === 'Enter') {
            getUserDetails(event.srcElement.value)
        }
    })

})

dashBoardData()
