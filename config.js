require('dotenv').config();

// Configuração dos limites de cada provedor
const providers = {
  brevo: {
    host: 'smtp-relay.brevo.com',
    port: 587,
    auth: {
      user: process.env.BREVO_USER,
      pass: process.env.BREVO_SMTP_KEY
    },
    dailyLimit: 300,
    monthlyLimit: null,
    priority: 1 // Alta prioridade (usar primeiro)
  },
//   mailjet: {
//     host: 'in-v3.mailjet.com',
//     port: 587,
//     auth: {
//       user: process.env.MAILJET_API_KEY,
//       pass: process.env.MAILJET_SECRET_KEY
//     },
//     dailyLimit: 200,
//     monthlyLimit: 6000,
//     priority: 2
//   },
//   smtp2go: {
//     host: 'mail.smtp2go.com',
//     port: 587,
//     auth: {
//       user: process.env.SMTP2GO_USER,
//       pass: process.env.SMTP2GO_API_KEY
//     },
//     dailyLimit: 200,
//     monthlyLimit: 1000,
//     priority: 3
//   },
//   mailersend: {
//     host: 'smtp.mailersend.net',
//     port: 587,
//     auth: {
//       user: process.env.MAILERSEND_USER,
//       pass: process.env.MAILERSEND_API_KEY
//     },
//     dailyLimit: null,
//     monthlyLimit: 3000,
//     priority: 4 // Menor prioridade
//   }
};

module.exports = {
  providers,
  customDomain: process.env.CUSTOM_DOMAIN,
  customSender: `${process.env.SENDER_NAME} <${process.env.SENDER_EMAIL}>`
};
