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

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import SplashScreen from '@/app/index';

export default function RootLayout() {
	const colorScheme = useColorScheme();

	const [fontsLoaded] = useFonts({
		Inter_400Regular,
		Inter_600SemiBold,
		Inter_700Bold
	});

	const [authenticated, setAuthenticated] = useState(false);
	const [authChecked, setAuthChecked] = useState(false);

	useEffect(() => {
		const checkAuth = async () => {
			const token = await AsyncStorage.getItem('auth_token');
			setAuthenticated(!!token);
			setAuthChecked(true);
		};

		checkAuth();
	}, []);

	if (!fontsLoaded || !authChecked) return null;

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
