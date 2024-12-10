export const paymentExicution = (data)=>{
    var options = {
        "key": data.key,
        "amount": data.amount, 
        "currency": "INR",
        "name": "Helth Care",
        "description": "Doctor Consultancy feee",
        "image": "https://example.com/your_logo",
        "order_id": data.orderid,
        "prefill": {
            "name": data.userName,
            "email": data.userEmail,
            "contact": data.userPhone
        },
        "notes": {
            "address": "helath care office in gujarat"
        },
        "theme": {
            "color": "#3399cc"
        },
        "handler":async function (response){
        // Call your verification API after successful payment
        try {
            await fetch('http://13.201.107.9/api/v1/payment/verifypayment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    payment_id: response.razorpay_payment_id,
                    order_id: response.razorpay_order_id,
                    signature: response.razorpay_signature,
                    appointmentID: data.appointmentID
                })
            })
            .then(res => res.json())
            .then(data => {
                if (data.code !== 0) {
                    
                    console.log('Payment verified successfully:', data);

                    // edit this section to rediract home page and popup to show to payment successfully msg.
                }else{
                    throw new Error("payment not verifyd!");
                }
            })
        } catch (error) {
            alert(error)
        }
    }
    };
    
    var rzp1 = new Razorpay(options);

    rzp1.on('payment.failed', function (response){
        alert(response.error.code);
        alert(response.error.description);
        alert(response.error.source);
        alert(response.error.step);
        alert(response.error.reason);
        alert(response.error.metadata.order_id);
        alert(response.error.metadata.payment_id);
    });
        rzp1.open();
}