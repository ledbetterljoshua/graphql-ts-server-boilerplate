import * as Sparkpost from "sparkpost";
const client = new Sparkpost(process.env.SPARKPOST_API_KEY);

export const sendEmail = async (address: string, url: string) => {
  try {
    const data = await client.transmissions.send({
      options: {
        sandbox: true
      },
      content: {
        from: "testing@sparkpostbox.com",
        subject: "Confirm Email!",
        html: `
          <html>
            <body>
              <a href="${url}" target="_blank">Confirm Your Email</a>
            </body>
          </html>
          `
      },
      recipients: [{ address }]
    });
    console.log("Woohoo! You just sent your first mailing!");
    console.log(data);
  } catch (err) {
    console.log("Whoops! Something went wrong");
    console.log(err);
  }
};
