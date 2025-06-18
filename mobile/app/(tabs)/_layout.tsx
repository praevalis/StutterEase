import { Tabs } from 'expo-router';

import { Colors } from '@/constants/colors';
import HapticTab from '@/components/HapticTab';
import IconSymbol from '@/components/ui/IconSymbol';
import { useColorScheme, Platform } from 'react-native';
import TabBarBackground from '@/components/ui/TabBarBackground';

const TabLayout = () => {
	const colorScheme = useColorScheme();

	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor:
					Colors[colorScheme ?? 'light'].primaryAccent,
				headerShown: false,
				tabBarBackground: TabBarBackground,
				tabBarButton: HapticTab,
				tabBarStyle: Platform.select({
					ios: {
						position: 'absolute'
					},
					default: {}
				})
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: 'Home',
					tabBarIcon: ({ color }) => (
						<IconSymbol size={28} name="house.fill" color={color} />
					)
				}}
			/>
			<Tabs.Screen
				name="assistant"
				options={{
					title: 'Assistant',
					tabBarIcon: ({ color }) => (
						<IconSymbol
							size={28}
							name="mic.circle.fill"
							color={color}
						/>
					)
				}}
			/>
			<Tabs.Screen
				name="coach"
				options={{
					title: 'Coach',
					tabBarIcon: ({ color }) => (
						<IconSymbol
							size={28}
							name="bubble.left.and.bubble.right.fill"
							color={color}
						/>
					)
				}}
			/>
			<Tabs.Screen
				name="account"
				options={{
					title: 'Account',
					tabBarIcon: ({ color }) => (
						<IconSymbol
							size={28}
							name="person.crop.circle.fill"
							color={color}
						/>
					)
				}}
			/>
		</Tabs>
	);
};

export default TabLayout;
