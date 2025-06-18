import {
	View,
	ScrollView,
	StyleSheet,
	Pressable,
	Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useRef, useState } from 'react';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';

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

	const [isRecording, setIsRecording] = useState(false);
	const [transcript, setTranscript] = useState<string[]>([]);
	const [suggestion, setSuggestion] = useState<string | null>(null);

	const websocketRef = useRef<WebSocket | null>(null);
	const recordingRef = useRef<Audio.Recording | null>(null);
	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

	const WEBSOCKET_URL = `ws://192.168.0.100:8000/assistant/ws/audio`;

	useEffect(() => {
		const ws = new WebSocket(WEBSOCKET_URL);
		websocketRef.current = ws;

		ws.onmessage = (event) => {
			const suggestionText = event.data;
			setSuggestion(suggestionText);
			setTranscript((prev) => [...prev, `...${suggestionText}`]);
		};

		ws.onerror = (err) =>
			console.error('WebSocket error:', (err as ErrorEvent).message);
		ws.onclose = () => console.log('WebSocket closed');

		return () => {
			ws.close();
			stopRecording();
		};
	}, []);

	const startRecording = async () => {
		try {
			const { status } = await Audio.requestPermissionsAsync();
			if (status !== 'granted') {
				console.warn('Permission not granted for microphone');
				return;
			}

			try {
				await Audio.setAudioModeAsync({
					allowsRecordingIOS: true,
					playsInSilentModeIOS: true
				});
				console.log('Audio mode set successfully.');
			} catch (e) {
				console.error('Failed to set audio mode:', e);
			}

			setIsRecording(true);

			const loop = async () => {
				try {
					while (isRecording) {
						const { recording } = await Audio.Recording.createAsync(
							Audio.RecordingOptionsPresets.HIGH_QUALITY
						);
						recordingRef.current = recording;
						console.log('[Loop] Started short recording.');

						await new Promise((res) => setTimeout(res, 1000));

						await recording.stopAndUnloadAsync();
						const uri = recording.getURI();
						if (!uri) {
							console.warn('Recording URI is null');
							continue;
						}

						console.log('[Loop] Recording URI:', uri);

						const audioData = await FileSystem.readAsStringAsync(
							uri,
							{
								encoding: FileSystem.EncodingType.Base64
							}
						);
						const buffer = Uint8Array.from(atob(audioData), (c) =>
							c.charCodeAt(0)
						);
						websocketRef.current?.send(buffer);
						console.log('[Loop] Sent audio chunk.');
					}
				} catch (err) {
					console.error('[Loop] Error in recording loop:', err);
				}
			};

			loop();
			console.log('Recording started.');
		} catch (err) {
			console.error('Recording failed:', err);
		}
	};

	const stopRecording = async () => {
		setIsRecording(false);
		if (recordingRef.current) {
			try {
				await recordingRef.current.stopAndUnloadAsync();
			} catch (e) {
				console.warn('Recording already stopped.');
			}
			recordingRef.current = null;
		}
	};

	const toggleRecording = async () => {
		if (isRecording) {
			await stopRecording();
		} else {
			await startRecording();
		}
	};

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
					<ScrollView
						contentContainerStyle={styles.scrollContainer}
						showsVerticalScrollIndicator={false}
					>
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
					<Pressable
						onPress={toggleRecording}
						style={styles.micButton}
					>
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
