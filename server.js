const { SMTPServer } = require('smtp-server');
const { simpleParser } = require('mailparser');
const { sendMail } = require('./smtp-relay');
const cron = require('node-cron');
const { checkResets } = require('./quota-manager');

// Configuração do servidor SMTP
const server = new SMTPServer({
  name: 'Multi-Provider SMTP Relay',
  banner: 'Welcome to Multi-Provider SMTP Relay',
  authOptional: true, // Configure autenticação conforme necessário
  size: 10 * 1024 * 1024, // Limite de tamanho (10MB)
  
  // Handler para receber emails
  async onData(stream, session, callback) {
    try {
      // Faz o parsing do email
      const email = await simpleParser(stream);
      
      // Prepara as opções do email
      const mailOptions = {
        from: email.from.text,
        to: email.to.text,
        subject: email.subject,
        text: email.text,
        html: email.html,
        attachments: email.attachments
      };
      
      // Envia o email através do relé
      await sendMail(mailOptions);
      
      callback();
    } catch (error) {
      console.error('Erro ao processar email:', error);
      callback(new Error('Erro ao processar sua mensagem'));
    }
  }
});

// CORREÇÃO: Agendar verificação de reset das cotas diárias e mensais
// Encapsulando a função checkResets em uma função de callback
cron.schedule('0 0 * * *', () => {
  console.log('Executando verificação programada de cotas');
  checkResets();
});

// Inicia o servidor na porta 2525 (ou outra de sua escolha)
server.listen(2525, () => {
  console.log('Servidor SMTP multi-provedor rodando na porta 2525');
});
