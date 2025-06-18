import {
	View,
	ScrollView,
	StyleSheet,
	Pressable,
	Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ThemedView from '@/components/ThemedView';
import ThemedText from '@/components/ThemedText';
import IconSymbol from '@/components/ui/IconSymbol';
import useThemeColor from '@/hooks/useThemeColor';

const { height } = Dimensions.get('window');

const AssistantScreen = () => {
	const surface = useThemeColor({}, 'surface');
	const background = useThemeColor({}, 'background');
	const iconColor = useThemeColor({}, 'primaryAccent');
	const border = useThemeColor({}, 'border');

	// TO-DO: Add state logic and backend integration.
	const transcript: string[] = ['I am umm trying to aaa- an appointment.'];
	const suggestion: string | null = 'schedule';
	const isRecording = true;

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<ThemedView
				style={[styles.container, { backgroundColor: background }]}
			>
				<View style={styles.header}>
					<ThemedText
						type="default"
						colorName="secondaryText"
						style={styles.headerSubtitle}
					>
						We’ll assist you if you get stuck.
					</ThemedText>
				</View>

				<ThemedView
					style={[
						styles.transcriptionBox,
						{ backgroundColor: surface, borderColor: border }
					]}
				>
					<ScrollView contentContainerStyle={styles.scrollContainer}>
						{transcript.slice(-2).map((line, index) => (
							<ThemedText
								key={index}
								type="default"
								style={styles.transcriptionLine}
							>
								{line}
							</ThemedText>
						))}
					</ScrollView>
				</ThemedView>

				{suggestion && (
					<View
						style={[
							styles.suggestionBubble,
							{
								borderColor: iconColor,
								backgroundColor: background
							}
						]}
					>
						<ThemedText type="defaultSemiBold">
							Try saying: "{suggestion}"
						</ThemedText>
					</View>
				)}

				<View style={styles.micWrapper}>
					<Pressable style={styles.micButton}>
						<IconSymbol
							name="mic.circle.fill"
							size={32}
							color={iconColor}
						/>
					</Pressable>
					<ThemedText
						type="defaultSemiBold"
						colorName="secondaryText"
						style={{ marginTop: 8 }}
					>
						{isRecording ? 'Listening...' : 'Tap to start'}
					</ThemedText>
				</View>
			</ThemedView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 24,
		paddingTop: 16,
		paddingBottom: 48
	},
	header: {
		marginBottom: 16,
		alignItems: 'center'
	},
	headerText: {
		textAlign: 'center'
	},
	headerSubtitle: {
		marginTop: 4,
		textAlign: 'center'
	},
	transcriptionBox: {
		borderWidth: 1,
		borderRadius: 12,
		padding: 16,
		flex: 1,
		minHeight: height * 0.25,
		maxHeight: height * 0.35
	},
	scrollContainer: {
		justifyContent: 'flex-end'
	},
	transcriptionLine: {
		fontSize: 16,
		lineHeight: 24,
		marginBottom: 6
	},
	suggestionBubble: {
		marginTop: 20,
		alignSelf: 'center',
		paddingVertical: 8,
		paddingHorizontal: 14,
		borderRadius: 20,
		borderWidth: 1
	},
	micWrapper: {
		position: 'absolute',
		bottom: 32,
		left: 0,
		right: 0,
		alignItems: 'center',
		justifyContent: 'center'
	},
	micButton: {
		width: 64,
		height: 64,
		borderRadius: 32,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'transparent'
	}
});

export default AssistantScreen;
