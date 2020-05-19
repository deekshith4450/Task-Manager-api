const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email,name) =>{
    sgMail.send({
        to:email,
        from:'deekshith4450@gmail.com',
        subject:'Welcome email',
        text:`Welcome to the task manager app ${name}.`
    })
}

const sendCancelEmail =(email,name) =>{
    sgMail.send({
        to:email,
        from:'deekshith4450@gmail.com',
        subject:'It was pleassure doing business',
        text:`Thank you ${name} for using our app. Is there any thing we can do to improve user experence.`
    })
}

module.exports = {sendWelcomeEmail,sendCancelEmail}