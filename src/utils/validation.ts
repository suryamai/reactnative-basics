/**
 * Utility functions for form input validation (Positive & Negative test cases)
 */

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

export const isValidPhone = (phone: string): boolean => {
  // Allows digits, spaces, plus signs, dashes. Must contain at least 8-15 digits.
  const cleaned = phone.replace(/[^0-9]/g, '');
  return cleaned.length >= 8 && cleaned.length <= 15;
};

export const isValidEmailOrPhone = (input: string): boolean => {
  const trimmed = input.trim();
  if (!trimmed) return false;
  return isValidEmail(trimmed) || isValidPhone(trimmed);
};

export const isValidPassword = (password: string): boolean => {
  return password.trim().length >= 6;
};

export const isValidName = (name: string): boolean => {
  const trimmed = name.trim();
  // Must be at least 2 characters and only contain letters, spaces, hyphens
  const nameRegex = /^[a-zA-Z\s\-']{2,50}$/;
  return nameRegex.test(trimmed);
};

export const isValidDate = (dateStr: string): boolean => {
  const trimmed = dateStr.trim();
  if (!trimmed) return false;

  // Formats: DD/MM/YYYY, DD-MM-YYYY, YYYY-MM-DD
  const dateRegex = /^(\d{2}[-/\.]\d{2}[-/\.]\d{4})|(\d{4}[-/\.]\d{2}[-/\.]\d{2})$/;
  return dateRegex.test(trimmed);
};

export interface LoginFormErrors {
  identifier?: string;
  password?: string;
  general?: string;
}

export interface SignupFormErrors {
  fullName?: string;
  email?: string;
  password?: string;
  mobile?: string;
  dob?: string;
  general?: string;
}
