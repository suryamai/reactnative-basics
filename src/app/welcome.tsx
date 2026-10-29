import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import Svg, { Path, Circle } from 'react-native-svg';
import { Palette } from '@/constants/colors';

const { width } = Dimensions.get('window');

// Custom SVG Heart + Spoon + Fork Logo
const YumQuickLogo = ({ color = Palette.primaryYellow, size = 160 }) => (
  <Svg width={size} height={size} viewBox="0 0 200 200" fill="none">
    {/* Heart outline continuous line with spoon and fork elements */}
    <Path
      d="M100 165 L60 125 C30 95 25 55 55 35 C80 20 95 40 100 50 C105 40 120 20 145 35 C175 55 170 95 140 125 Z"
      stroke={color}
      strokeWidth="10"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    {/* Spoon head left */}
    <Path
      d="M50 90 C35 75 35 105 50 90 Z"
      stroke={color}
      strokeWidth="8"
      strokeLinecap="round"
      fill="none"
    />
    {/* Fork tines right */}
    <Path
      d="M150 75 L160 85 M142 83 L152 93 M134 91 L144 101"
      stroke={color}
      strokeWidth="7"
      strokeLinecap="round"
    />
    {/* Center bottom heart point tip */}
    <Path
      d="M85 145 L100 160 L115 145"
      stroke={color}
      strokeWidth="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* CENTER CONTENT CONTAINER */}
      <View style={styles.contentContainer}>
        {/* BRAND LOGO */}
        <View style={styles.logoWrapper}>
          <YumQuickLogo color={Palette.primaryYellow} size={170} />
        </View>

        {/* APP NAME */}
        <View style={styles.brandRow}>
          <Text style={styles.brandYum}>YUM</Text>
          <Text style={styles.brandQuick}>QUICK</Text>
        </View>

        {/* TAGLINE / DESCRIPTION */}
        <Text style={styles.tagline}>
          Delicious food delivered fast to your doorstep. Order your favorite meals anytime.
        </Text>

        {/* ACTION BUTTONS */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.loginBtn}
            onPress={() => router.push('/login')}
          >
            <Text style={styles.loginBtnText}>Log In</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.signUpBtn}
            onPress={() => router.push('/signup')}
          >
            <Text style={styles.signUpBtnText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Palette.brandOrange, // #E95322
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 36,
  },

  /* LOGO */
  logoWrapper: {
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* BRAND NAME */
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  brandYum: {
    fontSize: 34,
    fontWeight: '900',
    color: Palette.primaryYellow, // #F5CB58
    letterSpacing: 1,
  },
  brandQuick: {
    fontSize: 34,
    fontWeight: '900',
    color: Palette.white, // #FFFFFF
    letterSpacing: 1,
  },

  /* TAGLINE */
  tagline: {
    fontSize: 14,
    color: Palette.white,
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '500',
    paddingHorizontal: 12,
    marginBottom: 48,
    opacity: 0.95,
  },

  /* BUTTONS */
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  loginBtn: {
    width: '100%',
    height: 54,
    borderRadius: 27,
    backgroundColor: Palette.primaryYellow, // #F5CB58
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  loginBtnText: {
    fontSize: 17,
    fontWeight: '800',
    color: Palette.darkBrown, // #391713
  },
  signUpBtn: {
    width: '100%',
    height: 54,
    borderRadius: 27,
    backgroundColor: Palette.lightCream, // #F3E9B5
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  signUpBtnText: {
    fontSize: 17,
    fontWeight: '800',
    color: Palette.darkBrown, // #391713
  },
});
