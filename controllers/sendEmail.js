var nodemailer = require('nodemailer');

module.exports = function(app) {
	var SendEmailController = {
		sendEmail: function(req, res) {
			var email = req.body.email;

			var responseCaptcha = req.body.email['g-recaptcha-response'];

			app.checkCaptcha(responseCaptcha, res,function(success) {
				if (success) {
					// create reusable transporter object using SMTP transport
					var transporter = nodemailer.createTransport({
						service: 'Gmail',
						auth: {
							user: 'fandre@gmail.com',
							pass: 'erfeujwvltdndyfv'
						}
					});

					// NB! No need to recreate the transporter object. You can use
					// the same transporter object for all e-mails

					// setup e-mail data with unicode symbols
					var mailOptions = {
						from: 'iAmFerraz ✔ <fandre@gmail.com>', // sender address
						to: 'fandre@gmail.com', // list of receivers
						subject: 'Hello ✔', // Subject line
						text: 'Hello world ✔', // plaintext body
						html: '<b>Hello world ✔</b>' // html body
					};

					// send mail with defined transport object
					transporter.sendMail(mailOptions, function(error, info){
						if(error){
							app.sendResponse(res, false, "Xiiiii deu zica! No envio do email." + JSON.stringify(error));
						}else{
							app.sendResponse(res, true, "Email enviado!", info.response);
						}
					});
				}
				else
					app.sendResponse(res, false, "Xiiiii deu zica! No envio do email.");
			});
		}
	};

	return SendEmailController;
}