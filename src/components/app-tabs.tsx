import { NativeTabs } from 'expo-router/native-tabs';
import { Palette } from '@/constants/colors';

export default function AppTabs() {
  return (
    <NativeTabs
      backgroundColor={Palette.background}
      indicatorColor={Palette.lightCream}
      labelStyle={{ selected: { color: Palette.brandOrange } }}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={require('@/assets/images/tabIcons/home.png')}
          renderingMode="template"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="explore">
        <NativeTabs.Trigger.Label>Explore</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={require('@/assets/images/tabIcons/explore.png')}
          renderingMode="template"
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
