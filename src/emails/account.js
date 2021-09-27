const sgMail = require('@sendgrid/mail')


sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email,name) => {
    sgMail.send({
        to: email,
        from: 'rodrigo.peralta@cetys.edu.mx',
        subject: 'Thanks for joining us',
        text: `Welcome to the app, ${name}. Let me know how you get along with the app` //` izq a la 1
    })
}

const sendCancellationEmail = (email,name) => {
    sgMail.send({
        to: email,
        from: 'rodrigo.peralta@cetys.edu.mx',
        subject: 'Sad to see you go!',
        text: `Hey ${name}, why did you leave? What could we have done to keep you with us?`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
}
// sgMail.send({
//     to: 'rodrigo.peralta@cetys.edu.mx',
//     from: 'rodrigo.peralta@cetys.edu.mx',
//     subject: 'This is my first creation',
//     text: 'I hope this shid works dawg.'
// })