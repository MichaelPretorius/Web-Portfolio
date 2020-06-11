const functions = require('firebase-functions');
const sgMail = require('@sendgrid/mail');

const gmailEmail = functions.config().gmail.login;
const sendgridAPI = functions.config().sendgrid.api;
sgMail.setApiKey(sendgridAPI);

// ==============================
// FUNCTION TO SEND EMAIL
// ==============================

const goMail = (name, email, message) => {
	const msg = {
		to: gmailEmail,
		from: gmailEmail,
		subject: 'Web Profile Contact Request',
		reply_to: email,
		html: `<h2>You have a new contact request from your web portfolio</h2>
    <h3>Name: </h3> <p>${name}</p>
    <h3>Email: </h3> <p>${email}</p>
    <h3>Message: </h3> <p>${message}</p>`,
	};

	return sgMail
		.send(msg)
		.then(() => {
			console.log(
				`Email sent successfully: name: ${name}, email: ${email}, message: ${message}`,
			);
		})
		.catch(err => {
			console.log(
				`Email failed: error: ${err} name: ${name}, email: ${email}, message: ${message}`,
			);
		});
};

//onDataAdded watches for changes in database
exports.onDataAdded = functions.database.ref('/messages/{sessionId}').onCreate((snapshot, context) => {
    const Data = snapshot.val();
    const name = Data.name;
    const email = Data.email;
    const message = Data.message;

    goMail(name, email, message);
    return null;
});
