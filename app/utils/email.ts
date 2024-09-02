import AWS from "aws-sdk";

const awsConfig = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_SECRET_ACCESS_REGION,
  apiVersion: process.env.AWS_SECRET_VERSION,
};

const SES = new AWS.SES(awsConfig);

export const sentEmail = async ({ params }: { params: any }) => {
  // const paramas = {
  //   Source: process.env.EMAIL_FROM || "",
  //   Destination: { ToAddresses: [process.env.EMAIL_FROM] },
  //   ReplyToAddresses: [process.env.EMAIL_FROM || "kikiondo117@gmail.com"],
  //   Message: {
  //     Body: {
  //       Html: {
  //         Charset: "UTF-8",
  //         Data: `
  //           <html>
  //             <h1> Reset password link</h1>
  //             <p>Pls use the following link to reset your password</p>
  //           </html>
  //         `,
  //       },
  //     },
  //     Subject: {
  //       Charset: "UTF-8",
  //       Data: "Password Reset Link",
  //     },
  //   },
  // };

  const emailSent = await SES.sendEmail(params).promise();

  return emailSent;
};
