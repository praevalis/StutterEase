import {
	StyleSheet,
	View,
	TextInput,
	FlatList,
	Pressable,
	Modal,
	ScrollView
} from 'react-native';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useChat } from '@/context/ChatContext';
import { useAuth } from '@/context/AuthContext';
import { useScenario } from '@/context/ScenarioContext';

import ThemedText from '@/components/ThemedText';
import ThemedView from '@/components/ThemedView';
import useThemeColor from '@/hooks/useThemeColor';
import IconSymbol from '@/components/ui/IconSymbol';

const CoachMainScreen = () => {
	const router = useRouter();

	const { user } = useAuth();
	const { scenarios, setScenarios } = useScenario();
	const { allConvs, setAllConvs, setCurrentConv, messages, setMessages } =
		useChat();

	const [search, setSearch] = useState('');
	const [modalVisible, setModalVisible] = useState(false);
	const [selectedScenario, setSelectedScenario] = useState<string>('');
	const [dropdownOpen, setDropdownOpen] = useState(false);

	const surface = useThemeColor({}, 'surface');
	const border = useThemeColor({}, 'border');
	const accent = useThemeColor({}, 'primaryAccent');
	const placeholder = useThemeColor({}, 'secondaryText');
	const background = useThemeColor({}, 'background');

	useEffect(() => {
		const fetchInitialData = async () => {
			const response = await axios.get(
				'http://192.168.0.100:8000/coach/scenario'
			);
			setScenarios(response.data.data);

			if (user) {
				const convResponse = await axios.get(
					`http://192.168.0.100:8000/coach/conversation/user/${user.id}`
				);

				setAllConvs(convResponse.data.data);
			}

			if (!selectedScenario && scenarios.length > 0) {
				setSelectedScenario(scenarios[0].title);
			}
		};

		fetchInitialData();
	}, []);

	const filtered = allConvs.filter((convo) =>
		convo.scenario_id?.toLowerCase().includes(search.toLowerCase())
	);

	const handleStartConversation = async () => {
		const selected = scenarios.find((s) => s.title === selectedScenario);
		if (!selected) return;

		const response = await axios.post(
			'http://192.168.0.100:8000/coach/conversation',
			{
				user_id: user?.id,
				scenario_id: selected.id
			}
		);

		setAllConvs((prev) => [...prev, response.data.data]);
		setCurrentConv(response.data.data);
		setMessages([]);

		setModalVisible(false);
		setDropdownOpen(false);
		router.push('/coach/conversation');
	};

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<ThemedView style={styles.container}>
				<View style={styles.searchRow}>
					<View style={[styles.searchInput, { borderColor: border }]}>
						<IconSymbol
							name="magnifyingglass"
							size={20}
							color={placeholder}
						/>
						<TextInput
							placeholder="Search"
							value={search}
							onChangeText={setSearch}
							placeholderTextColor={placeholder}
							style={styles.textInput}
						/>
					</View>

					<Pressable onPress={() => setModalVisible(true)}>
						<IconSymbol
							name="plus.circle.fill"
							size={32}
							color={accent}
						/>
					</Pressable>
				</View>

				<Modal
					visible={modalVisible}
					transparent
					animationType="fade"
					onRequestClose={() => setModalVisible(false)}
				>
					<View style={styles.modalBackdrop}>
						<View
							style={[
								styles.modalContainer,
								{ backgroundColor: surface }
							]}
						>
							<View style={styles.dropdownWrapper}>
								<Pressable
									style={[
										styles.dropdownHeader,
										{ borderColor: border }
									]}
									onPress={() =>
										setDropdownOpen(!dropdownOpen)
									}
								>
									<ThemedText>
										{selectedScenario || 'Select Scenario'}
									</ThemedText>
									<IconSymbol
										name={
											dropdownOpen
												? 'chevron.down'
												: 'chevron.right'
										}
										size={20}
										color={accent}
									/>
								</Pressable>

								{dropdownOpen && (
									<View
										style={[
											styles.dropdownMenu,
											{
												backgroundColor: surface,
												borderColor: border
											}
										]}
									>
										<ScrollView
											style={styles.dropdownScroll}
											nestedScrollEnabled
											showsVerticalScrollIndicator={false}
										>
											{scenarios.map((s) => (
												<Pressable
													key={s.id}
													style={styles.dropdownItem}
													onPress={() => {
														setSelectedScenario(
															s.title
														);
														setDropdownOpen(false);
													}}
												>
													<ThemedText>
														{s.title}
													</ThemedText>
												</Pressable>
											))}
										</ScrollView>
									</View>
								)}
							</View>

							<Pressable
								style={[
									styles.startButton,
									{ backgroundColor: accent }
								]}
								onPress={handleStartConversation}
							>
								<ThemedText
									type="defaultSemiBold"
									style={styles.startButtonText}
									colorName="buttonText"
								>
									Start
								</ThemedText>
							</Pressable>
						</View>
					</View>
				</Modal>

				<FlatList
					data={filtered}
					keyExtractor={(item) => item.id || ''}
					contentContainerStyle={{
						paddingHorizontal: 24,
						paddingTop: 24
					}}
					ItemSeparatorComponent={() => (
						<View style={{ height: 16 }} />
					)}
					renderItem={({ item }) => {
						const scenario = scenarios.find(
							(s) => s.id === item.scenario_id
						);
						return (
							<Pressable
								style={[
									styles.card,
									{
										backgroundColor: surface,
										borderColor: border
									}
								]}
								onPress={() => {
									setCurrentConv(item);
									setMessages([]);
									router.push('/coach/conversation');
								}}
							>
								<View>
									<ThemedText type="defaultSemiBold">
										{scenario?.title || 'Untitled'}
									</ThemedText>
									<ThemedText
										type="default"
										colorName="secondaryText"
										style={{ marginTop: 4 }}
									>
										{item.created_at
											? new Date(
													item.created_at
											  ).toLocaleDateString()
											: 'Unknown date'}
									</ThemedText>
								</View>
								<IconSymbol
									name="chevron.right"
									size={24}
									color={accent}
								/>
							</Pressable>
						);
					}}
				/>
			</ThemedView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	searchRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 24,
		paddingTop: 16
	},
	searchInput: {
		flexDirection: 'row',
		alignItems: 'center',
		flex: 1,
		paddingHorizontal: 12,
		paddingVertical: 8,
		borderWidth: 1,
		borderRadius: 12,
		marginRight: 12
	},
	textInput: {
		flex: 1,
		marginLeft: 8,
		fontSize: 16
	},
	card: {
		padding: 16,
		borderRadius: 8,
		borderWidth: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between'
	},
	modalBackdrop: {
		flex: 1,
		backgroundColor: '#00000080',
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: 24
	},
	modalContainer: {
		width: '100%',
		borderRadius: 16,
		padding: 20,
		gap: 20,
		position: 'relative',
		overflow: 'visible'
	},
	dropdownWrapper: {
		position: 'relative',
		zIndex: 20
	},
	dropdownHeader: {
		borderWidth: 1,
		borderRadius: 12,
		paddingVertical: 12,
		paddingHorizontal: 16,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	dropdownMenu: {
		position: 'absolute',
		top: 56,
		left: 0,
		right: 0,
		borderRadius: 12,
		borderWidth: 1,
		zIndex: 100,
		elevation: 10,
		overflow: 'hidden',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4
	},
	dropdownScroll: {
		maxHeight: 160,
		borderRadius: 12,
		paddingVertical: 4,
		paddingHorizontal: 12
	},
	dropdownItem: {
		paddingVertical: 10
	},
	startButton: {
		borderRadius: 12,
		paddingVertical: 12,
		alignItems: 'center'
	},
	startButtonText: {
		fontSize: 16
	}
});

export default CoachMainScreen;
