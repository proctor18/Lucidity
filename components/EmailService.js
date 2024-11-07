// const sgMail = require('@sendgrid/mail');
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// export const sendNotificationEmail = async (email, message) => {
//   const msg = {
//     to: email,
//     from: 'lucidity.notifications@gmail.com', // Verified sender email address
//     subject: 'New Session Booked!',
//     text: message,
//     html: `<p>${message}</p>`,
//   };

//   try {
//     await sgMail.send(msg);
//     console.log('Notification email sent to:', email);
//   } catch (error) {
//     console.error('Error sending email:', error);
//   }
// };