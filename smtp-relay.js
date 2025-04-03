const nodemailer = require('nodemailer');
const { providers, customDomain, customSender } = require('./config');
const { getAvailableProvider, incrementUsage } = require('./quota-manager');

// Cria transporters para cada provedor
const transporters = {};
Object.entries(providers).forEach(([name, config]) => {
  transporters[name] = nodemailer.createTransport(config);
});

async function sendMail(mailOptions) {
  // Obtém o provedor disponível com base nas cotas
  const providerName = getAvailableProvider(providers);
  
  if (!providerName) {
    throw new Error('Todos os provedores atingiram seus limites de envio');
  }
  
  try {
    // Configura o remetente personalizado se não for especificado
    if (!mailOptions.from) {
      mailOptions.from = customSender;
    }
    
    // Envia o email usando o provedor selecionado
    const result = await transporters[providerName].sendMail(mailOptions);
    
    // Incrementa o contador de uso
    incrementUsage(providerName);
    
    console.log(`Email enviado via ${providerName}: ${result.messageId}`);
    return {
      success: true,
      provider: providerName,
      messageId: result.messageId
    };
  } catch (error) {
    console.error(`Erro ao enviar email via ${providerName}:`, error);
    throw error;
  }
}

module.exports = { sendMail };
