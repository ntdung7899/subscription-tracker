const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '..', 'locales');
const languages = ['en', 'vi'];

function loadTranslations(lang) {
  const langDir = path.join(localesDir, lang);
  const files = fs.readdirSync(langDir);
  const translations = {};

  files.forEach(file => {
    if (file.endsWith('.json')) {
      const content = fs.readFileSync(path.join(langDir, file), 'utf8');
      const namespace = file.replace('.json', '');
      translations[namespace] = JSON.parse(content);
    }
  });

  return translations;
}

function getAllKeys(obj, prefix = '') {
  let keys = [];
  
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      keys = keys.concat(getAllKeys(obj[key], fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  
  return keys;
}

function checkTranslations() {
  console.log('🔍 Checking translation keys...\n');
  
  const allTranslations = {};
  languages.forEach(lang => {
    allTranslations[lang] = loadTranslations(lang);
  });

  const allKeys = {};
  languages.forEach(lang => {
    allKeys[lang] = new Set();
    Object.keys(allTranslations[lang]).forEach(namespace => {
      const keys = getAllKeys(allTranslations[lang][namespace], namespace);
      keys.forEach(key => allKeys[lang].add(key));
    });
  });

  let hasErrors = false;

  languages.forEach(lang => {
    const otherLangs = languages.filter(l => l !== lang);
    
    otherLangs.forEach(otherLang => {
      const missingInOther = [...allKeys[lang]].filter(key => !allKeys[otherLang].has(key));
      
      if (missingInOther.length > 0) {
        hasErrors = true;
        console.error(`❌ Keys in ${lang} but missing in ${otherLang}:`);
        missingInOther.forEach(key => console.error(`   - ${key}`));
        console.log('');
      }
    });
  });

  if (!hasErrors) {
    console.log('✅ All translation keys are synchronized!');
    console.log(`📊 Total keys: ${allKeys[languages[0]].size}`);
  } else {
    console.error('\n❌ Translation synchronization check failed!');
    process.exit(1);
  }
}

checkTranslations();
