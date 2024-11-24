import { User } from "../data/models/user";

export function sendMail(user: User) {
  fetch("https://api.zeptomail.com/v1.1/email", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: process.env.SEND_MAIL_TOKEN,
    },
    body: JSON.stringify({
      from: { address: "<DOMAIN>" },
      to: [
        {
          email_address: {
            address: "thegleamingcatalog@reelest.com.ng",
            name: "The Gleaming Catalog",
          },
        },
      ],
      subject: "Test Email",
      htmlbody: "<div><b> Test email sent successfully. </b></div>",
    }),
  });
}
