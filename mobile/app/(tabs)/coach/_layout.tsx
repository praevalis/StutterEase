import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import {
	DarkTheme,
	DefaultTheme,
	ThemeProvider
} from '@react-navigation/native';

import { ChatProvider } from '@/context/ChatContext';
import { ScenarioProvider } from '@/context/ScenarioContext';

export default function CoachLayout() {
	const colorScheme = useColorScheme();

	return (
		<ScenarioProvider>
			<ChatProvider>
				<ThemeProvider
					value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
				>
					<Stack>
						<Stack.Screen
							name="index"
							options={{ headerShown: false }}
						/>
						<Stack.Screen
							name="conversation"
							options={{ headerShown: false }}
						/>
					</Stack>
				</ThemeProvider>
			</ChatProvider>
		</ScenarioProvider>
	);
}
