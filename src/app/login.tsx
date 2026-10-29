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
  isValidEmailOrPhone,
  isValidPassword,
  LoginFormErrors,
} from '@/utils/validation';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<LoginFormErrors>({});

  const validate = (): boolean => {
    const newErrors: LoginFormErrors = {};

    // Identifier Validation (Negative Cases)
    if (!identifier.trim()) {
      newErrors.identifier = 'Email or Mobile Number is required.';
    } else if (!isValidEmailOrPhone(identifier)) {
      newErrors.identifier =
        'Please enter a valid email (e.g. name@domain.com) or phone number (e.g. +1234567890).';
    }

    // Password Validation (Negative Cases)
    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (!isValidPassword(password)) {
      newErrors.password = 'Password must be at least 6 characters long.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const success = await login(identifier, password);
      if (success) {
        router.replace('/preparing');
      }
    } catch (e) {
      setErrors({
        general: 'Login failed. Please check your credentials and try again.',
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
            onPress={() => router.push('/welcome')}
          >
            <Ionicons name="chevron-back" size={24} color={Palette.darkBrown} />
          </TouchableOpacity>

          <Text style={styles.topHeaderTitle}>Log In</Text>

          <View style={{ width: 40 }} />
        </View>

        <View style={styles.greetingContainer}>
          <Text style={styles.greetingTitle}>Hello!</Text>
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
          <Text style={styles.welcomeTitle}>Welcome</Text>
          <Text style={styles.welcomeSubtext}>
            Please sign in with your account credentials to continue ordering.
          </Text>

          {errors.general ? (
            <View style={styles.generalErrorBanner}>
              <Ionicons name="alert-circle" size={18} color="#D32F2F" />
              <Text style={styles.generalErrorText}>{errors.general}</Text>
            </View>
          ) : null}

          {/* INPUT 1: EMAIL OR MOBILE */}
          <Text style={styles.inputLabel}>Email or Mobile Number</Text>
          <View
            style={[
              styles.inputContainer,
              errors.identifier ? styles.inputErrorBorder : null,
            ]}
          >
            <TextInput
              style={styles.textInput}
              placeholder="example@example.com or +1234567890"
              placeholderTextColor={Palette.grayText}
              value={identifier}
              onChangeText={(val) => {
                setIdentifier(val);
                if (errors.identifier) {
                  setErrors((prev) => ({ ...prev, identifier: undefined }));
                }
              }}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          {errors.identifier ? (
            <Text style={styles.fieldErrorText}>{errors.identifier}</Text>
          ) : null}

          {/* INPUT 2: PASSWORD */}
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

          {/* FORGOT PASSWORD */}
          <TouchableOpacity style={styles.forgotBtn}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* LOG IN BUTTON */}
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.loginSubmitBtn}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={Palette.white} />
            ) : (
              <Text style={styles.loginSubmitBtnText}>Log In</Text>
            )}
          </TouchableOpacity>

          {/* OR DIVIDER */}
          <View style={styles.orRow}>
            <View style={styles.orLine} />
            <Text style={styles.orText}>or</Text>
            <View style={styles.orLine} />
          </View>

          {/* FINGERPRINT BIOMETRIC BUTTON */}
          <TouchableOpacity
            style={styles.fingerprintBtn}
            onPress={() => {
              setIdentifier('surya@example.com');
              setPassword('123456');
              handleLogin();
            }}
          >
            <Ionicons name="finger-print-outline" size={36} color={Palette.brandOrange} />
          </TouchableOpacity>

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

          {/* SIGN UP LINK */}
          <View style={styles.signupFooterRow}>
            <Text style={styles.noAccountText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/signup')}>
              <Text style={styles.signupLinkText}>Sign Up</Text>
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
    paddingBottom: 20,
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
  greetingContainer: {
    marginTop: 10,
    paddingHorizontal: 10,
  },
  greetingTitle: {
    fontSize: 28,
    fontWeight: '900',
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
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: Palette.darkBrown,
  },
  welcomeSubtext: {
    fontSize: 13,
    color: Palette.grayText,
    marginTop: 4,
    marginBottom: 16,
    lineHeight: 18,
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
    marginTop: 12,
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.lightCream, // #F3E9B5
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 52,
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

  forgotBtn: {
    alignSelf: 'flex-end',
    marginTop: 8,
    marginBottom: 24,
  },
  forgotText: {
    fontSize: 13,
    fontWeight: '700',
    color: Palette.brandOrange, // #E95322
  },

  /* SUBMIT BUTTON */
  loginSubmitBtn: {
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
  loginSubmitBtnText: {
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
    fontSize: 13,
    color: Palette.grayText,
    fontWeight: '600',
  },

  /* FINGERPRINT */
  fingerprintBtn: {
    alignSelf: 'center',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Palette.lightPeach, // #FFDECF
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
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

  /* FOOTER SIGNUP */
  signupFooterRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  noAccountText: {
    fontSize: 13,
    color: Palette.grayText,
    fontWeight: '500',
  },
  signupLinkText: {
    fontSize: 13,
    color: Palette.brandOrange,
    fontWeight: '800',
  },
});
