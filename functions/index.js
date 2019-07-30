const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
const rp = require("request-promise");
const cors = require("cors")({ origin: true });

const gmailEmail = functions.config().gmail.login;
const gmailPassword = functions.config().gmail.pass;

// ==============================
// FUNCTION TO SEND EMAIL
// ==============================

const goMail = (name, email, message) => {

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: gmailEmail,
            pass: gmailPassword
        }
    });

    const mailOptions = {
        from: gmailEmail,
        to: gmailEmail,
        subject: 'Web Profile Contact Request',
        html: `<h2>You have a new contact request from your web portfolio</h2>
        <h3>Name: </h3> <p>${name}</p>
        <h3>Email: </h3> <p>${email}</p>
        <h3>Message: </h3> <p>${message}</p>`
    };

    const getDeliveryStatus = (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    };

    transporter.sendMail(mailOptions, getDeliveryStatus);
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


// ==================================
// FUNCTION FOR reCAPTCHA
// ==================================

const secretKey = functions.config().recaptcha.secret;

exports.checkRecaptcha = functions.https.onRequest((req, res) => {

    const captcha = req.body.captcha;
    console.log("recaptcha response", captcha);

    return cors(req, res, () => {
        rp({
            method: 'POST',
            uri: 'https://recaptcha.google.com/recaptcha/api/siteverify',
            formData: {
                secret: secretKey,
                response: captcha
            },
            json: true
        }).then(result => {
            console.log("Recaptcha Result: ", result);
            if (result.success) {
                res.json({ success: true, msg: "Captcha Passed." });
            }
            else {
                res.json({ success: false, msg: "Captcha Verification Failed." });
            }
        }).catch(reason => {
            console.log("Recaptcha Request Failure: ", reason);
            res.json({ success: false, msg: "Error occured with Verification." });
        })
    });

});