const fs = require('fs');
const path = require('path');

// Arquivo para armazenar o uso de cada provedor
const usageFilePath = path.join(__dirname, 'usage.json');

// Inicializa o arquivo de uso se não existir
if (!fs.existsSync(usageFilePath)) {
  const initialUsage = {
    brevo: { daily: 0, monthly: 0, lastReset: new Date().toISOString() },
    mailjet: { daily: 0, monthly: 0, lastReset: new Date().toISOString() },
    smtp2go: { daily: 0, monthly: 0, lastReset: new Date().toISOString() },
    mailersend: { daily: 0, monthly: 0, lastReset: new Date().toISOString() }
  };
  fs.writeFileSync(usageFilePath, JSON.stringify(initialUsage, null, 2));
}

function getUsage() {
  return JSON.parse(fs.readFileSync(usageFilePath, 'utf8'));
}

function saveUsage(usage) {
  fs.writeFileSync(usageFilePath, JSON.stringify(usage, null, 2));
}

// Verifica se os contadores precisam ser resetados
function checkResets() {
  const usage = getUsage();
  const now = new Date();
  
  Object.keys(usage).forEach(provider => {
    const lastReset = new Date(usage[provider].lastReset);
    
    // Reset diário
    if (now.getDate() !== lastReset.getDate() || 
        now.getMonth() !== lastReset.getMonth() || 
        now.getFullYear() !== lastReset.getFullYear()) {
      usage[provider].daily = 0;
    }
    
    // Reset mensal
    if (now.getMonth() !== lastReset.getMonth() || 
        now.getFullYear() !== lastReset.getFullYear()) {
      usage[provider].monthly = 0;
    }
    
    usage[provider].lastReset = now.toISOString();
  });
  
  saveUsage(usage);
  console.log('Cotas de uso verificadas e resetadas se necessário:', new Date().toISOString());
}

// Incrementa o uso para um provedor específico
function incrementUsage(provider) {
  checkResets();
  const usage = getUsage();
  
  usage[provider].daily += 1;
  usage[provider].monthly += 1;
  
  saveUsage(usage);
  return usage[provider];
}

// Verifica qual provedor está disponível baseado em suas cotas
function getAvailableProvider(providers) {
  checkResets();
  const usage = getUsage();
  
  // Ordena provedores por prioridade
  const sortedProviders = Object.entries(providers).sort((a, b) => a[1].priority - b[1].priority);
  
  for (const [name, config] of sortedProviders) {
    const providerUsage = usage[name];
    
    // Verifica se o provedor está dentro dos limites
    const withinDailyLimit = config.dailyLimit === null || providerUsage.daily < config.dailyLimit;
    const withinMonthlyLimit = config.monthlyLimit === null || providerUsage.monthly < config.monthlyLimit;
    
    if (withinDailyLimit && withinMonthlyLimit) {
      return name;
    }
  }
  
  return null; // Nenhum provedor disponível
}

// Certifique-se de exportar a função checkResets
module.exports = {
  getAvailableProvider,
  incrementUsage,
  checkResets  // Adicionando isso, que estava faltando
};
