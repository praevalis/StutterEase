import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import {
	DarkTheme,
	DefaultTheme,
	ThemeProvider
} from '@react-navigation/native';

import {
	useFonts,
	Inter_400Regular,
	Inter_600SemiBold,
	Inter_700Bold
} from '@expo-google-fonts/inter';

import { AuthProvider, useAuth } from '@/context/AuthContext';
import SplashScreen from '@/app/index';

function AppLayout() {
	const colorScheme = useColorScheme();
	const { authenticated } = useAuth();

	return (
		<ThemeProvider
			value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
		>
			{authenticated ? (
				<>
					<Stack>
						<Stack.Screen
							name="(tabs)"
							options={{ headerShown: false }}
						/>
						<Stack.Screen name="+not-found" />
					</Stack>
					<StatusBar style="auto" />
				</>
			) : (
				<SplashScreen />
			)}
		</ThemeProvider>
	);
}

export default function RootLayout() {
	const [fontsLoaded] = useFonts({
		Inter_400Regular,
		Inter_600SemiBold,
		Inter_700Bold
	});

	if (!fontsLoaded) return null;

	return (
		<AuthProvider>
			<AppLayout />
		</AuthProvider>
	);
}
