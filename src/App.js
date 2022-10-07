import React from "react";
import logo from "./logo.svg";
import "./App.css";

function loadScript(src) {
  return new Promise((resolve) => {
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
}

function App() {
  const payload = {
    propertyId: "61d1a347c31c61bdfdbc688d",
    serviceCategoryId: "61bfb4f169554cea7ba278c7",
    customerId: "61b50130a60e4495d59e7bda",
    checkInDate: "2022-02-07",
    checkOutDate: "2022-02-09",
  };

  const confirmBooking = async (payment) => {
    const booking = {
      ...payload,
      payment: payment,
      // Booking Status
      bookingStatusId: "61d2d1685c41f20143cca451", //"Confirmed",
      paymentStatusId: "61d2b4a248459ec16ee535a7", // "Paid",
    };
    console.log(booking);
    // alert("Booking APi");
    fetch("http://3.111.11.219:3000/api/booking/authorize", {
      method: "POST",
      body: JSON.stringify(booking),
      headers: {
        "Content-Type": "application/json",
        "x-access-token":
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxYjUwNDZkODVjYWMyMjY5OGI1MGMxOSIsImlhdCI6MTY0MjYyMTk2NSwiZXhwIjoxNjQ1MjEzOTY1fQ.cz4e92ipsk1ruz0zG2_rO_nxfxVflLCMGX0aN13Nub8",
      },
    }).then((r) => {
      console.log(r);
      if (r.ok) alert("Booking made successfully!");
    });
  };

  async function showRazorpay() {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    const RAZORPAY_KEY = "rzp_test_h2on3gnKuJgpt1";
    const customer = {
      firstName: "Shlok",
      lastName: "Chavan",
      emailId: "ishlokchavan@gmail.com",
      phoneNumber: "8356047973",
    };

    const apiResponse = await fetch("http://3.111.11.219:3000/api/booking", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
        "x-access-token":
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxYjUwNDZkODVjYWMyMjY5OGI1MGMxOSIsImlhdCI6MTY0MjYyMTk2NSwiZXhwIjoxNjQ1MjEzOTY1fQ.cz4e92ipsk1ruz0zG2_rO_nxfxVflLCMGX0aN13Nub8",
      },
    }).then((t) => t.json());

    // console.log(data);
    const { data } = apiResponse;

    const options = {
      key: RAZORPAY_KEY,
      currency: data.currency,
      // amount: data.amount.toString(),
      amount: `${data.amount}`,
      order_id: data.id,
      name: "Visit Madh Island - Booking",
      description: "Thank you for booking with us",
      handler: (response) => {
        // Continue Adding to DB
        confirmBooking(response);
      },
      prefill: {
        name: `${customer.firstName} ${customer.lastName}`,
        email: customer.emailId,
        phone_number: customer.phoneNumber.includes("+")
          ? `${customer.phoneNumber}`
          : `+91${customer.phoneNumber}`,
      },
    };
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Test Payment</p>
        <button onClick={showRazorpay}>Pay now</button>
      </header>
    </div>
  );
}

export default App;
