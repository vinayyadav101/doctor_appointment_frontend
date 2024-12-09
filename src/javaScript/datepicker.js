import  {chackAvilableTime, fetchdata}  from "./appointmentForm.js";


let specialDates = {}


async function checkdata(){

    const data = await fetchdata()
    if (data) {
        data.forEach(v=>{
            specialDates[v] = true
        });
    }else{
        return showAlert('error','Server Down!')
    }
}
checkdata()








$(function() {
    // Get the current date
    var today = new Date();
    today.setHours(0, 0, 0, 0);  // Ensure no time is set for date comparison

    // Initialize datepicker with beforeShowDay to style dates
    $("#datepicker").datepicker({
        firstDay: 1,
        changeMonth: true,  // Enables month dropdown
        changeYear: true,   // Enables year dropdown
        yearRange: "2020:2030",  // Set the range of years for the year dropdown
        beforeShowDay: function(date) {
            var dateString = ('0' + date.getDate()).slice(-2) + '-' +
                             ('0' + (date.getMonth() + 1)).slice(-2) + '-' + 
                             date.getFullYear();
            
            // Check if the date is before today
            if (date < today) {
                return [false, "past-date"];
            }
            // Check if the date is one of the special orange dates
            else if (specialDates[dateString]) {
                return [false, "special-date"];
            }
            // Style future dates as green
            else {
                return [true, "future-date"];
            }
        },
        onSelect: function() {
            // Format the selected date to DD-MM-YYYY
            var selectedDate = $(this).datepicker('getDate');
            var formattedDate = $.datepicker.formatDate('dd-mm-yy', selectedDate);
            $('.date-picker .result span').html(formattedDate);
            
            chackAvilableTime(formattedDate)
            $('.date-picker').removeClass('open');
        }
    });


    $(document).on('click', '.date-picker .input', function(){
        var $me = $(this),
                $parent = $me.parents('.date-picker');
        $parent.toggleClass('open');

        $(".user_phone_number").toggleClass("toggle-height");

    });
    
});
