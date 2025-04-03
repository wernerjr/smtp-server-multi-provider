const nodemailer = require('nodemailer');

async function testSMTP() {
  // Cria um objeto de transporte
  const transporter = nodemailer.createTransport({
    host: 'smtp-server-multi-provider.onrender.com',
    port: 443,
    secure: false, // true para 465, false para outras portas
    tls: {
      rejectUnauthorized: false // Necessário para testes locais
    }
  });

  try {
    // Envia e-mail
    const info = await transporter.sendMail({
      from: 'Brasil Rental Karts <no-reply@brasilrentalkarts.com.br>', // Deve corresponder ao domínio configurado
      to: 'werner.junior@outlook.com', // O destinatário real para o teste
      subject: 'Teste de Servidor SMTP Multi-Provedor',
      text: 'Este é um e-mail de teste enviado através do servidor SMTP personalizado.',
      html: '<b>Este é um e-mail de teste enviado através do servidor SMTP personalizado.</b>'
    });

    console.log('E-mail enviado com sucesso!');
    console.log('ID da mensagem:', info.messageId);
    return info;
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
    throw error;
  }
}

// Executa o teste
testSMTP()
  .then(result => console.log('Resultado:', result))
  .catch(err => console.error('Falha no teste:', err));
