// utils/validateEmail.js
import dns from 'dns';

export const validateEmail = (email) => {
  // Basic regex for email format validation
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(String(email).toLowerCase());
};

export const checkDomain = (email) => {
  const domain = email.split('@')[1];
  return new Promise((resolve, reject) => {
    dns.resolve(domain, 'MX', (err, addresses) => {
      if (err || addresses.length === 0) {
        reject(false);
      } else {
        resolve(true);
      }
    });
  });
};
