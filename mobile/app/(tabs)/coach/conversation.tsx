import { View, StyleSheet, FlatList, Pressable, Modal } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { Audio } from 'expo-av';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from 'expo-router';
import { Buffer } from 'buffer';

global.Buffer = global.Buffer || Buffer;

import type { Message } from '@/types/coach';

import { useChat } from '@/context/ChatContext';
import ThemedText from '@/components/ThemedText';
import ThemedView from '@/components/ThemedView';
import useThemeColor from '@/hooks/useThemeColor';
import IconSymbol from '@/components/ui/IconSymbol';

const ConversationScreen = () => {
	const navigation = useNavigation();
	const accent = useThemeColor({}, 'primaryAccent');
	const secondaryAccent = useThemeColor({}, 'secondaryAccent');
	const surface = useThemeColor({}, 'surface');
	const background = useThemeColor({}, 'background');
	const border = useThemeColor({}, 'border');

	const { currentConv, messages, setMessages } = useChat();

	const [modalVisible, setModalVisible] = useState(false);
	const [micPressed, setMicPressed] = useState(false);
	const [elapsedTime, setElapsedTime] = useState(0);
	const intervalRef = useRef<number | null>(null);
	const wsRef = useRef<WebSocket | null>(null);
	const recordingRef = useRef<Audio.Recording | null>(null);

	useEffect(() => {
		if (!currentConv) return;

		const ws = new WebSocket(`ws://192.168.0.100:8000/ws/chat`);

		ws.onopen = () => {
			console.log('[WS] Connected');
			if (currentConv?.id) {
				ws.send(currentConv.id);
			} else {
				console.error(
					'[WS] Cannot send: conversation ID is undefined.'
				);
			}
		};

		ws.onmessage = (event) => {
			console.log('[WS] Bot:', event.data);
			const botMessage: Message = {
				id: Date.now().toString(),
				source: 'BOT',
				conversation_id: currentConv?.id ?? '',
				content: event.data
			};
			setMessages((prev) => [...prev, botMessage]);
		};

		ws.onerror = (e: any) => console.error('[WS] Error:', e.message);
		ws.onclose = () => console.log('[WS] Closed');

		wsRef.current = ws;

		return () => ws.close();
	}, [currentConv]);

	const startRecording = async () => {
		try {
			await Audio.requestPermissionsAsync();
			await Audio.setAudioModeAsync({
				allowsRecordingIOS: true,
				playsInSilentModeIOS: true
			});

			const { recording } = await Audio.Recording.createAsync(
				Audio.RecordingOptionsPresets.HighQuality
			);

			recordingRef.current = recording;
			await recording.startAsync();
			console.log('[Audio] Recording started.');
		} catch (err) {
			console.error('Failed to start recording', err);
		}
	};

	const stopRecording = async () => {
		try {
			if (!recordingRef.current) return;

			await recordingRef.current.stopAndUnloadAsync();
			const uri = recordingRef.current.getURI();
			const fileBlob = await fetch(uri!).then((r) => r.blob());
			const arrayBuffer = await fileBlob.arrayBuffer();

			const ws = wsRef.current;
			if (ws && ws.readyState === WebSocket.OPEN) {
				ws.send(arrayBuffer);
				ws.send('END_AUDIO');
				console.log('[WS] Sent audio + END_AUDIO');
			}

			recordingRef.current = null;
		} catch (err) {
			console.error('Error stopping recording:', err);
		}
	};

	useEffect(() => {
		if (micPressed) startRecording();
		else stopRecording();
	}, [micPressed]);

	useEffect(() => {
		intervalRef.current = setInterval(() => {
			setElapsedTime((prev) => prev + 1);
		}, 1000);
		return () => clearInterval(intervalRef.current!);
	}, []);

	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${String(mins).padStart(2, '0')}:${String(secs).padStart(
			2,
			'0'
		)}`;
	};

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<ThemedView
				style={[styles.container, { backgroundColor: background }]}
			>
				<View style={styles.topBar}>
					<ThemedText type="defaultSemiBold" style={styles.timerText}>
						{formatTime(elapsedTime)}
					</ThemedText>
					<Pressable
						onPress={() => setModalVisible(true)}
						style={styles.closeButton}
					>
						<IconSymbol name="xmark" size={28} color={accent} />
					</Pressable>
				</View>

				<FlatList
					data={messages}
					keyExtractor={(item, index) => item.id ?? index.toString()}
					renderItem={({ item }) => (
						<View
							style={[
								styles.messageBubble,
								item.source === 'USER'
									? styles.userBubble
									: styles.botBubble,
								{ backgroundColor: surface }
							]}
						>
							<ThemedText style={styles.messageText}>
								{item.content}
							</ThemedText>
						</View>
					)}
					style={styles.messagesList}
					contentContainerStyle={styles.messagesContent}
				/>

				<View style={styles.bottomRow}>
					<Pressable
						onPressIn={() => setMicPressed(true)}
						onPressOut={() => setMicPressed(false)}
						style={[
							styles.waveformButton,
							{
								backgroundColor: micPressed
									? secondaryAccent
									: 'transparent',
								borderColor: border
							}
						]}
					>
						<IconSymbol name="waveform" size={32} color={accent} />
					</Pressable>
				</View>

				<Modal visible={modalVisible} transparent animationType="fade">
					<View style={styles.modalBackdrop}>
						<View
							style={[
								styles.modalBox,
								{ backgroundColor: surface }
							]}
						>
							<ThemedText
								type="subtitle"
								style={{ marginBottom: 12 }}
							>
								End this conversation?
							</ThemedText>
							<View style={styles.modalActions}>
								<Pressable
									onPress={() => setModalVisible(false)}
									style={[
										styles.modalBtn,
										{ borderColor: border }
									]}
								>
									<ThemedText>Cancel</ThemedText>
								</Pressable>
								<Pressable
									onPress={() => {
										if (intervalRef.current)
											clearInterval(intervalRef.current);
										navigation.goBack();
									}}
									style={[
										styles.modalBtn,
										{ backgroundColor: accent }
									]}
								>
									<ThemedText colorName="buttonText">
										End
									</ThemedText>
								</Pressable>
							</View>
						</View>
					</View>
				</Modal>
			</ThemedView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 24,
		paddingTop: 16,
		paddingBottom: 80
	},
	topBar: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	timerText: {
		fontSize: 16,
		fontWeight: '600'
	},
	closeButton: {
		padding: 8
	},
	messagesList: {
		flex: 1,
		marginTop: 12
	},
	messagesContent: {
		paddingBottom: 100
	},
	messageBubble: {
		padding: 12,
		borderRadius: 16,
		marginVertical: 6,
		maxWidth: '75%'
	},
	userBubble: {
		alignSelf: 'flex-end'
	},
	botBubble: {
		alignSelf: 'flex-start'
	},
	messageText: {
		color: '#fff'
	},
	bottomRow: {
		position: 'absolute',
		bottom: 24,
		left: 0,
		right: 0,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		gap: 24,
		paddingHorizontal: 24
	},
	waveformButton: {
		borderWidth: 1,
		padding: 16,
		borderRadius: 100
	},
	modalBackdrop: {
		flex: 1,
		backgroundColor: '#00000080',
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: 24
	},
	modalBox: {
		width: '100%',
		padding: 20,
		borderRadius: 16
	},
	modalActions: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		gap: 12
	},
	modalBtn: {
		flex: 1,
		paddingVertical: 12,
		borderRadius: 12,
		borderWidth: 1,
		alignItems: 'center'
	}
});

export default ConversationScreen;
