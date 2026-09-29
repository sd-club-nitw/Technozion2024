import React, { useState } from 'react'


const loadScript = (src) =>
  new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });



const makePayment = async ({ setLoading, payment_name, description, image, amount, order_id, name, email, contact, }) => {
  setLoading(true);
  const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
  if (!res) {
    setLoading(false);
    return {
      done: false,
      message: "Razorpay SDK failed to load. Are you online?",
      data: {},
    };
  }
  return new Promise((resolve) => {
    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY,
      amount,
      currency: "INR",
      name: payment_name,
      description: description,
      // image,
      order_id,
      handler: ({ razorpay_payment_id, razorpay_order_id, razorpay_signature, }) => {
        setLoading(false);
        resolve({
          done: true,
          data: {
            razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature,
          },
          message: "Payment successful",
        });
      },
      modal: {
        ondismiss: function () {
          setLoading(false);
          resolve({ done: false, message: "Payment cancelled" });
        },
      },
      prefill: { name, email, contact },
      notes: {
        address: "NIT Warangal",
      },
      theme: {
        color: "#3399cc",
      },
    };
    const paymentObject = new window.Razorpay(options);
    paymentObject.on("payment.failed", function (response) {
      console.log("failed")
      // payment cancled
      // payment will stop on modal close

    });
    paymentObject.open();
  });
}



// const createOrder = async (setLoading) => {
//   setLoading(true)
//   const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/payment/razorpay`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) })
//   const data = await response.json()
//   setLoading(false)
//   return data;
// }
const createRegOrder = async (setLoading, formData) => {
  setLoading(true)
  const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/payment/razorpay`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ formData }) })
  const data = await response.json()
  setLoading(false)
  return data;
}

const paymentConfirm = async (setLoading, razorpay_request, formData) => {
  setLoading(true)
  const sendData = {
    formData,
    razorpay_request_data: razorpay_request.data
  }
  console.log(sendData);
  const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/payment/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(sendData) })
  const data = await response.json()
  setLoading(false)
  return data

}

const displayRazorpay = async (setLoading, userObj, formData) => {
  const order = await createRegOrder(setLoading, formData);
  if (order.errMessage) {
    alert('Something went Wrong , Please try after some time')
    return
  }
  const razorpay_request = await makePayment({
    payment_name: "SpringSpree 2023 | NIT Warangal",
    description: "something",
    // image: event.poster,
    amount: order.amount,
    order_id: order.id,
    name: userObj.user.name,
    email: userObj.user.email,
    contact: formData.phoneNumber,
    setLoading
  })
  if (!razorpay_request.done) {
    alert(razorpay_request.message);
    return;
  }
  const confirmation = await paymentConfirm(setLoading, razorpay_request, formData)
  return confirmation
}







//const options = {
//     key: process.env.REACT_APP_RAZORPAY_KEY,
//     currency: "INR",
//     amount: 5000,
//     order_id: data.id,
//     name: 'Spring Spree',
//     description: 'Thank you for nothing. Please give us some money',
//     image: '',
//     handler: function (response) {
//         alert(response.razorpay_payment_id)
//         alert(response.razorpay_order_id)
//         alert(response.razorpay_signature)
//     },
//     prefill: {
//         email: 'sdfdsjfh2@ndsfdf.com',
//         phone_number: '9899999999'
//     }
// }
// const paymentObject = new window.Razorpay(options)
// paymentObject.open()
// export function useEventPayment() {
//   const gateway = usePaymentGateway();
//   const createOrder = useApi(paymentApi.createOrder);
//   const paymentConfirm = useApi(paymentApi.paymentConfirm);
//   const { user } = useAuth();

//   const makePayment = async ({ event, specialEvent = 0, promo = "" }) => {
//     const event_id = specialEvent ? event.key : event._id;

//     const order = await createOrder.request(event_id, {
//       specialEvent,
//       promo,
//     });
//     if (!order.ok) {
//       alert("Something went wrong. Please try again later");
//       return;
//     }
//     const razorpay_request = await gateway.makePayment({
//       payment_name: event.name,
//       description: event.description?.substr(0, 255),
//       image: event.poster,
//       amount: order.data.amount,
//       order_id: order.data.id,
//       name: user.name,
//       email: user.email,
//       contact: user.mobile,
//     });

//     if (!razorpay_request.done) {
//       alert(razorpay_request.message);
//       return;
//     }

//     const payment = await paymentConfirm.request({
//       ...razorpay_request.data,
//       id: user._id,
//       name: user.name,
//       email: user.email,
//       mobile: user.mobile,
//       event_id,
//       event: event.name,
//       registration_fee: order.amount,
//       specialEvent,
//       promo,
//     });

//     if (!payment.ok) {
//       alert(
//         "Payment verification failed. If money is deducted from your account please contact us."
//       );
//       return;
//     }

//     return payment.data;
//   }
// }
export default displayRazorpay