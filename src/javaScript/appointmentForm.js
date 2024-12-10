import { paymentExicution } from "./pyment.js";


const urlparam = new URLSearchParams(window.location.search);
const allTimes = ["09:00 am","10:00 am","11:00 am","12:00 am","02:00 pm","03:00 pm","04:00 pm","05:00 pm"]
let dateAndTimes;
let bookedDateTime = Object()




function convertDate(date) {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    if (date.includes("-")) {
        const parts = date.split("-");
        
        // If the month is numeric, convert to month name
        if (!isNaN(parts[1])) {
            return `${parts[0]}-${months[parseInt(parts[1], 10) - 1]}-${parts[2]}`;
        } 
        // If the month is a name, convert to numeric month
        else {
            return `${parts[0]}-${(months.indexOf(parts[1]) + 1).toString().padStart(2, '0')}-${parts[2]}`;
        }
    }

    return "Invalid date format";
}

function checkCondition(data){
    let dates = [];
    const keys = Object.keys(data)
    
   keys.forEach(v=>{
    const set = new Set(data[v])
    const time = allTimes.filter(v=>set.has(v))

    if (time.length <= 7) {
        dates.push(v)
    }
   })
   dates = keys.filter(v=> !dates.includes(v))
   
    return dates
}

function groupByDate(data) {
    const groupedData = {};

    data.forEach(entry => {
        const { bookedDateTime, residual } = entry;

        // Process bookedDateTime
        if (bookedDateTime) {
            const { date, time } = bookedDateTime;
            if (!groupedData[date]) {
                groupedData[date] = [];
            }
            groupedData[date].push(time);
        }

        // Process residul (if it exists)
        if (residual) {
            const { date, time } = residual;
            if (!groupedData[date]) {
                groupedData[date] = [];
            }
            groupedData[date].push(time);
        }
    });
    dateAndTimes = groupedData
    
    return groupedData;
}

const apiCall = async()=>{
    try {
        const fetchedData = await (await fetch(`http://13.201.107.9/api/v1/doctor/avilabletime/${urlparam.get("id")}`)).json()
        if (fetchedData.data !== undefined) {
            return fetchedData.data
        }else{
            throw new Error("Not avilable data")
        }
    } catch (error) {
        showAlert('error',error)
    }
}



export const fetchdata = async() =>{

    const req = ["doctorName","department","fee"]
    
    try {
        const data = await apiCall()

        
        data.forEach(v=>{
            v.bookedDateTime.date = convertDate(v.bookedDateTime.date)
            if (v.residual !== undefined && v.residual.date !== null) {
                v.residual.date = convertDate(v.residual.date)
            }
            
        })
        
        req.forEach(value => document.getElementById(value).textContent = urlparam.get(value))
        
        return checkCondition(groupByDate(data))

    } catch (error) {
        showAlert('error',error)
    }   
        
}



export async function chackAvilableTime(date){

bookedDateTime["date"] = convertDate(date)

allTimes.forEach(v=>document.getElementById(v).removeAttribute("disabled"))


    if (!Object.keys(dateAndTimes).includes(date)) {
        allTimes.forEach(e => {
            document.getElementById(e).style.backgroundColor = "green"
        })
    }else{
        const time = allTimes.filter(v=> !dateAndTimes[date].includes(v))
        
        time.forEach(v=>{
            document.getElementById(v).style.background = "green"
        })
        dateAndTimes[date].forEach(e=>{
            document.getElementById(e).style.background = "red"
            document.getElementById(e).disabled  = true 
        })
        
    }
    
}


const form = document.getElementById("form_details")
const select = document.getElementById("abilable_time");



select.addEventListener("change" , ()=>{
    bookedDateTime["time"] = select.value
})



form.addEventListener('submit',async(e)=>{
    e.preventDefault()

    
    const data = {
        patientName: document.getElementById("userName").value,
        patientEmail: document.getElementById("email").value,
        doctorName: document.getElementById("doctorName").textContent,
        phone: document.getElementById("phone").value,
        bookedDateTime
    }

    if (!data) {
        showAlert('error',error)
    }
    
    try {
        const response = await (await fetch(`http://13.201.107.9/api/v1/user/appointment/${urlparam.get("id")}`,{
            method: "post",
            headers : {'Content-Type' : 'application/json'},
            body:JSON.stringify(data)
        })).json()

        if (response.code !== 1) {
            throw new Error(response.msg);
        }

        paymentExicution({
            orderid:response.data.orderID ,
            key:response.data.Key , 
            ammount:urlparam.get("fee")*100 ,
            appointmentID:response.data.appointmentID,
            userName:data.patientName,
            userEmail:data.patientEmail,
            userPhone:data.phone
        })

    } catch (error) {
        showAlert('error' , error)
    }

})
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("alert_button").addEventListener('click', closeAlert);
});

(async function(){
    const response = await (await fetch('http://13.201.107.9/api/v1/user/profile' , {
        method:'get',
        credentials:"include"
    })).json()

    if (response.code === 1) {
        const paitentDetails = ["userName","email","phone"]

        paitentDetails.forEach(value =>{
            if (response.data.hasOwnProperty(value)) {
                document.getElementById(value).value = response.data[value]
            }  
        })
        
    }
    
})()





