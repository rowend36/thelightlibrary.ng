var data = JSON.stringify({
  length: 7,
  customer: {
    name: "Rowend Duke",
    email: "rowendduke36@gmail.com",
    phone: "2348157004401",
  },
  sender: "Reelest Studios",
  send: false,
  medium: ["email"],
  expiry: 5,
});

fetch("https://api.flutterwave.com/v3/otps", {
  method: "POST",
  headers: {
    Authorization: "Bearer FLWSECK_TEST-8df7b5718b648da332649901e78e8876-X",
    "Content-Type": "application/json",
  },
  body: data,
})
  .then((res) => res.json())
  .then(console.log, console.log);
