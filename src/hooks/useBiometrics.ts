import { useState, useEffect } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';

export function useBiometrics() {
  const [isSupported, setIsSupported] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [biometricType, setBiometricType] = useState<string>('Biometrics');

  useEffect(() => {
    checkBiometrics();
  }, []);

  const checkBiometrics = async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();

      setIsSupported(hasHardware);
      setIsEnrolled(enrolled);

      if (hasHardware) {
        const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
        if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
          setBiometricType('Face ID');
        } else if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
          setBiometricType('Fingerprint');
        }
      }
    } catch (e) {
      console.warn('Error checking biometrics', e);
    }
  };

  const authenticate = async (promptMessage = 'Authenticate to access YumQuick') => {
    if (!isSupported || !isEnrolled) {
      return { success: false, error: 'Biometrics not available on this device' };
    }

    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage,
        cancelLabel: 'Use Password',
        fallbackLabel: 'Enter Password',
        disableDeviceFallback: false,
      });

      return {
        success: result.success,
        error: result.success ? undefined : (result as any).error,
      };
    } catch (e: any) {
      return { success: false, error: e.message || 'Authentication failed' };
    }
  };

  return {
    isSupported,
    isEnrolled,
    biometricType,
    authenticate,
  };
}
