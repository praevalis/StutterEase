import {
	View,
	StyleSheet,
	FlatList,
	Pressable,
	Modal,
	Text
} from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from 'expo-router';

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

	const [messages, setMessages] = useState([
		{ id: '1', type: 'bot', text: 'Hello! Ready to practice?' },
		{ id: '2', type: 'user', text: 'Yes, I am!' },
		{ id: '3', type: 'bot', text: 'Great! Let’s begin with an intro.' }
	]);

	const [modalVisible, setModalVisible] = useState(false);
	const [micPressed, setMicPressed] = useState(false);
	const [elapsedTime, setElapsedTime] = useState(0);
	const intervalRef = useRef<number | null>(null);

	useEffect(() => {
		intervalRef.current = setInterval(() => {
			setElapsedTime((prev) => prev + 1);
		}, 1000);

		return () => {
			if (intervalRef.current) clearInterval(intervalRef.current);
		};
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
						style={styles.closeButton}
						onPress={() => setModalVisible(true)}
						hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
					>
						<IconSymbol name="xmark" size={28} color={accent} />
					</Pressable>
				</View>

				<FlatList
					data={messages}
					keyExtractor={(item) => item.id}
					renderItem={({ item }) => (
						<View
							style={[
								styles.messageBubble,
								item.type === 'user'
									? styles.userBubble
									: styles.botBubble,
								{
									backgroundColor: surface
								}
							]}
						>
							<ThemedText style={styles.messageText}>
								{item.text}
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

					{micPressed && (
						<View style={styles.energyVisual}>
							<View style={styles.pulseBar} />
							<View style={[styles.pulseBar, { height: 14 }]} />
							<View style={[styles.pulseBar, { height: 22 }]} />
							<View style={[styles.pulseBar, { height: 10 }]} />
							<View style={[styles.pulseBar, { height: 18 }]} />
							<View style={[styles.pulseBar, { height: 16 }]} />
							<View style={[styles.pulseBar, { height: 20 }]} />
						</View>
					)}
				</View>

				{/* Exit Confirmation */}
				<Modal
					visible={modalVisible}
					transparent
					animationType="fade"
					onRequestClose={() => setModalVisible(false)}
				>
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
		paddingHorizontal: 0,
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
	energyVisual: {
		flexDirection: 'row',
		alignItems: 'flex-end',
		gap: 6
	},
	pulseBar: {
		width: 4,
		height: 18,
		backgroundColor: '#60A5FA',
		borderRadius: 2
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
