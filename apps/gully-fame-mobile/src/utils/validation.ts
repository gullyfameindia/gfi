







export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};






export const isValidMobile = (mobile: string): boolean => {
  const mobileRegex = /^\d{10}$/;
  const digitsOnly = mobile.replace(/\D/g, '');
  return mobileRegex.test(digitsOnly);
};






export const validatePassword = (password: string) => {
  const checks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    numbers: /\d/.test(password),
    special: /[@$!%*?&]/.test(password),
  };

  const passedChecks = Object.values(checks).filter(Boolean).length;

  let strength: 'weak' | 'fair' | 'good' | 'strong' = 'weak';
  if (passedChecks >= 4) strength = 'strong';
  else if (passedChecks >= 3) strength = 'good';
  else if (passedChecks >= 2) strength = 'fair';

  return {
    isValid: checks.length && checks.lowercase && checks.uppercase && checks.numbers,
    strength,
    checks,
  };
};






export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};






export const isValidUsername = (username: string): boolean => {
  const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
  return usernameRegex.test(username);
};






export const isValidDate = (date: string): boolean => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) return false;

  const parsedDate = new Date(date);
  return parsedDate instanceof Date && !isNaN(parsedDate.getTime());
};






export const isValidAge = (dob: string): boolean => {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age >= 18;
};






export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  return phoneRegex.test(phone);
};






export const isValidCreditCard = (cardNumber: string): boolean => {
  const digitsOnly = cardNumber.replace(/\D/g, '');

  if (digitsOnly.length < 13 || digitsOnly.length > 19) {
    return false;
  }

  let sum = 0;
  let isEven = false;

  for (let i = digitsOnly.length - 1; i >= 0; i--) {
    let digit = parseInt(digitsOnly[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
};






export const isValidOTP = (otp: string): boolean => {
  const otpRegex = /^\d{6}$/;
  return otpRegex.test(otp);
};






export const isRequired = (value: any): boolean => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined;
};







export const minLength = (value: string, minLength: number): boolean => {
  return value.length >= minLength;
};







export const maxLength = (value: string, maxLength: number): boolean => {
  return value.length <= maxLength;
};







export const matches = (value1: any, value2: any): boolean => {
  return value1 === value2;
};







export const getValidationError = (fieldName: string, validationType: string): string => {
  const messages: Record<string, Record<string, string>> = {
    email: {
      invalid: 'Please enter a valid email address',
      required: 'Email is required',
    },
    mobile: {
      invalid: 'Please enter a valid 10-digit mobile number',
      required: 'Mobile number is required',
    },
    password: {
      invalid: 'Password must be at least 8 characters with uppercase, lowercase, and numbers',
      required: 'Password is required',
      weak: 'Password is too weak',
    },
    username: {
      invalid: 'Username must be 3-20 characters (alphanumeric, underscore, hyphen)',
      required: 'Username is required',
    },
    date: {
      invalid: 'Please enter a valid date (YYYY-MM-DD)',
      required: 'Date is required',
    },
    age: {
      invalid: 'You must be at least 18 years old',
    },
    phone: {
      invalid: 'Please enter a valid phone number',
      required: 'Phone number is required',
    },
    otp: {
      invalid: 'OTP must be 6 digits',
      required: 'OTP is required',
    },
  };

  return messages[fieldName]?.[validationType] || `${fieldName} is invalid`;
};
