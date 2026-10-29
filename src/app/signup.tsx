import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { Palette } from '@/constants/colors';
import { useAuth } from '@/context/auth-context';
import {
  isValidName,
  isValidEmail,
  isValidPassword,
  isValidPhone,
  isValidDate,
  SignupFormErrors,
} from '@/utils/validation';

export default function SignupScreen() {
  const router = useRouter();
  const { signup } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [mobile, setMobile] = useState('');
  const [dob, setDob] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<SignupFormErrors>({});

  const validate = (): boolean => {
    const newErrors: SignupFormErrors = {};

    // Full Name Validation
    if (!fullName.trim()) {
      newErrors.fullName = 'Full Name is required.';
    } else if (!isValidName(fullName)) {
      newErrors.fullName = 'Please enter a valid name (letters only, at least 2 characters).';
    }

    // Email Validation
    if (!email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!isValidEmail(email)) {
      newErrors.email = 'Please enter a valid email address (e.g. name@domain.com).';
    }

    // Password Validation
    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (!isValidPassword(password)) {
      newErrors.password = 'Password must be at least 6 characters long.';
    }

    // Mobile Validation
    if (!mobile.trim()) {
      newErrors.mobile = 'Mobile number is required.';
    } else if (!isValidPhone(mobile)) {
      newErrors.mobile = 'Please enter a valid phone number (at least 8 digits).';
    }

    // Date of Birth Validation
    if (!dob.trim()) {
      newErrors.dob = 'Date of birth is required.';
    } else if (!isValidDate(dob)) {
      newErrors.dob = 'Please enter a valid date format (e.g. DD/MM/YYYY).';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validate()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const success = await signup({ fullName, email, password, mobile, dob });
      if (success) {
        router.replace('/preparing');
      }
    } catch (e) {
      setErrors({
        general: 'Account registration failed. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* TOP YELLOW HEADER */}
      <SafeAreaView style={styles.topHeader} edges={['top']}>
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={24} color={Palette.darkBrown} />
          </TouchableOpacity>

          <Text style={styles.topHeaderTitle}>New Account</Text>

          <View style={{ width: 40 }} />
        </View>
      </SafeAreaView>

      {/* MAIN WHITE CARD SHEET */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.cardSheet}
        >
          {errors.general ? (
            <View style={styles.generalErrorBanner}>
              <Ionicons name="alert-circle" size={18} color="#D32F2F" />
              <Text style={styles.generalErrorText}>{errors.general}</Text>
            </View>
          ) : null}

          {/* FULL NAME */}
          <Text style={styles.inputLabel}>Full Name</Text>
          <View
            style={[
              styles.inputContainer,
              errors.fullName ? styles.inputErrorBorder : null,
            ]}
          >
            <TextInput
              style={styles.textInput}
              placeholder="e.g. Surya M"
              placeholderTextColor={Palette.grayText}
              value={fullName}
              onChangeText={(val) => {
                setFullName(val);
                if (errors.fullName) {
                  setErrors((prev) => ({ ...prev, fullName: undefined }));
                }
              }}
            />
          </View>
          {errors.fullName ? (
            <Text style={styles.fieldErrorText}>{errors.fullName}</Text>
          ) : null}

          {/* EMAIL */}
          <Text style={styles.inputLabel}>Email</Text>
          <View
            style={[
              styles.inputContainer,
              errors.email ? styles.inputErrorBorder : null,
            ]}
          >
            <TextInput
              style={styles.textInput}
              placeholder="example@example.com"
              placeholderTextColor={Palette.grayText}
              value={email}
              onChangeText={(val) => {
                setEmail(val);
                if (errors.email) {
                  setErrors((prev) => ({ ...prev, email: undefined }));
                }
              }}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          {errors.email ? (
            <Text style={styles.fieldErrorText}>{errors.email}</Text>
          ) : null}

          {/* PASSWORD */}
          <Text style={styles.inputLabel}>Password</Text>
          <View
            style={[
              styles.inputContainer,
              errors.password ? styles.inputErrorBorder : null,
            ]}
          >
            <TextInput
              style={styles.textInput}
              placeholder="••••••••"
              placeholderTextColor={Palette.grayText}
              value={password}
              onChangeText={(val) => {
                setPassword(val);
                if (errors.password) {
                  setErrors((prev) => ({ ...prev, password: undefined }));
                }
              }}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeBtn}
            >
              <Ionicons
                name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                size={20}
                color={Palette.darkBrown}
              />
            </TouchableOpacity>
          </View>
          {errors.password ? (
            <Text style={styles.fieldErrorText}>{errors.password}</Text>
          ) : null}

          {/* MOBILE NUMBER */}
          <Text style={styles.inputLabel}>Mobile Number</Text>
          <View
            style={[
              styles.inputContainer,
              errors.mobile ? styles.inputErrorBorder : null,
            ]}
          >
            <TextInput
              style={styles.textInput}
              placeholder="+123 456 7890"
              placeholderTextColor={Palette.grayText}
              value={mobile}
              onChangeText={(val) => {
                setMobile(val);
                if (errors.mobile) {
                  setErrors((prev) => ({ ...prev, mobile: undefined }));
                }
              }}
              keyboardType="phone-pad"
            />
          </View>
          {errors.mobile ? (
            <Text style={styles.fieldErrorText}>{errors.mobile}</Text>
          ) : null}

          {/* DATE OF BIRTH */}
          <Text style={styles.inputLabel}>Date of Birth</Text>
          <View
            style={[
              styles.inputContainer,
              errors.dob ? styles.inputErrorBorder : null,
            ]}
          >
            <TextInput
              style={styles.textInput}
              placeholder="DD / MM / YYYY"
              placeholderTextColor={Palette.grayText}
              value={dob}
              onChangeText={(val) => {
                setDob(val);
                if (errors.dob) {
                  setErrors((prev) => ({ ...prev, dob: undefined }));
                }
              }}
            />
          </View>
          {errors.dob ? (
            <Text style={styles.fieldErrorText}>{errors.dob}</Text>
          ) : null}

          <Text style={styles.termsText}>
            By signing up you agree to our{' '}
            <Text style={styles.termsHighlight}>Terms & Privacy Policy</Text>
          </Text>

          {/* SIGN UP SUBMIT BUTTON */}
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.signupSubmitBtn}
            onPress={handleSignup}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={Palette.white} />
            ) : (
              <Text style={styles.signupSubmitBtnText}>Sign Up</Text>
            )}
          </TouchableOpacity>

          {/* OR DIVIDER */}
          <View style={styles.orRow}>
            <View style={styles.orLine} />
            <Text style={styles.orText}>or sign up with</Text>
            <View style={styles.orLine} />
          </View>

          {/* SOCIAL LOGINS */}
          <View style={styles.socialRow}>
            <TouchableOpacity style={styles.socialIconCircle}>
              <FontAwesome name="google" size={18} color="#EA4335" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialIconCircle}>
              <FontAwesome name="facebook" size={18} color="#1877F2" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialIconCircle}>
              <FontAwesome name="apple" size={18} color="#000000" />
            </TouchableOpacity>
          </View>

          {/* LOGIN LINK */}
          <View style={styles.loginFooterRow}>
            <Text style={styles.alreadyAccountText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text style={styles.loginLinkText}>Log In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Palette.primaryYellow, // #F5CB58
  },
  topHeader: {
    backgroundColor: Palette.primaryYellow,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topHeaderTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Palette.darkBrown,
  },

  /* WHITE CARD SHEET */
  cardSheet: {
    backgroundColor: Palette.white,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 40,
    minHeight: '100%',
  },
  generalErrorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    gap: 8,
  },
  generalErrorText: {
    color: '#D32F2F',
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },

  /* INPUTS */
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: Palette.darkBrown,
    marginTop: 10,
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.lightCream, // #F3E9B5
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 50,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  inputErrorBorder: {
    borderColor: '#D32F2F',
    backgroundColor: '#FFF8F8',
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: Palette.darkBrown,
    fontWeight: '600',
  },
  eyeBtn: {
    padding: 6,
  },
  fieldErrorText: {
    color: '#D32F2F',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
    marginLeft: 4,
  },

  termsText: {
    fontSize: 12,
    color: Palette.grayText,
    textAlign: 'center',
    marginTop: 18,
    marginBottom: 20,
  },
  termsHighlight: {
    color: Palette.brandOrange,
    fontWeight: '700',
  },

  /* SUBMIT BUTTON */
  signupSubmitBtn: {
    height: 54,
    borderRadius: 27,
    backgroundColor: Palette.brandOrange, // #E95322
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Palette.brandOrange,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  signupSubmitBtnText: {
    fontSize: 17,
    fontWeight: '800',
    color: Palette.white,
  },

  /* OR DIVIDER */
  orRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: Palette.lightCream,
  },
  orText: {
    paddingHorizontal: 12,
    fontSize: 12,
    color: Palette.grayText,
    fontWeight: '600',
  },

  /* SOCIAL */
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 24,
  },
  socialIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Palette.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Palette.lightCream,
    shadowColor: Palette.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },

  /* FOOTER LOGIN */
  loginFooterRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  alreadyAccountText: {
    fontSize: 13,
    color: Palette.grayText,
    fontWeight: '500',
  },
  loginLinkText: {
    fontSize: 13,
    color: Palette.brandOrange,
    fontWeight: '800',
  },
});
