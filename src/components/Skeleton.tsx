import React, { useEffect } from 'react';
import { View, StyleSheet, DimensionValue } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Palette } from '@/constants/colors';

interface SkeletonProps {
  width?: DimensionValue;
  height?: DimensionValue;
  borderRadius?: number;
  style?: any;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 20,
  borderRadius = 8,
  style,
}) => {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.8, { duration: 750, easing: Easing.ease }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.skeleton,
        { width, height, borderRadius },
        animatedStyle,
        style,
      ]}
    />
  );
};

export const FoodCardSkeleton = () => (
  <View style={styles.cardSkeleton}>
    <Skeleton height={120} borderRadius={16} />
    <Skeleton height={16} width="80%" borderRadius={6} style={{ marginTop: 10 }} />
    <Skeleton height={12} width="50%" borderRadius={4} style={{ marginTop: 6 }} />
    <View style={styles.skeletonRow}>
      <Skeleton height={18} width="40%" borderRadius={6} />
      <Skeleton height={30} width={30} borderRadius={10} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: Palette.lightCream,
  },
  cardSkeleton: {
    width: 170,
    backgroundColor: Palette.white,
    borderRadius: 20,
    padding: 12,
    borderWidth: 1,
    borderColor: Palette.lightCream,
  },
  skeletonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
});
