import React, { useState, useEffect } from 'react';
import {
	TextInput,
	Pressable,
	StyleSheet,
	SafeAreaView,
	ScrollView,
	Modal,
	View,
	Platform
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ThemedText from '@/components/ThemedText';
import ThemedView from '@/components/ThemedView';
import useThemeColor from '@/hooks/useThemeColor';

const genderOptions = ['Male', 'Female', 'Other', 'Prefer not to say'];

const SplashScreen = () => {
	const [authenticated, setAuthenticated] = useState(false);
	const [showLogin, setShowLogin] = useState(true);
	const [showDatePicker, setShowDatePicker] = useState(false);
	const [showGenderModal, setShowGenderModal] = useState(false);

	const [loginData, setLoginData] = useState({ username: '', password: '' });
	const [registerData, setRegisterData] = useState({
		firstName: '',
		lastName: '',
		username: '',
		email: '',
		password: '',
		dob: '',
		gender: ''
	});

	const router = useRouter();
	const accent = useThemeColor({}, 'primaryAccent');
	const border = useThemeColor({}, 'border');
	const background = useThemeColor({}, 'background');
	const text = useThemeColor({}, 'primaryAccent');

	useEffect(() => {
		const checkAuth = async () => {
			const token = await AsyncStorage.getItem('auth_token');
			if (token) {
				setAuthenticated(true);
				router.replace('/');
			}
		};
		checkAuth();
	}, []);

	const handleLogin = async () => {
		if (loginData.username && loginData.password) {
			await AsyncStorage.setItem('auth_token', 'mock_token');
			setAuthenticated(true);
			router.replace('/');
		}
	};

	const handleRegister = async () => {
		if (
			registerData.username &&
			registerData.password &&
			registerData.email
		) {
			await AsyncStorage.setItem('auth_token', 'mock_token');
			setAuthenticated(true);
			router.replace('/');
		}
	};

	const handleDateChange = (event: any, selectedDate?: Date) => {
		setShowDatePicker(false);
		if (selectedDate) {
			const formatted = selectedDate.toISOString().split('T')[0];
			setRegisterData({ ...registerData, dob: formatted });
		}
	};

	if (authenticated) return null;

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<ThemedView
				style={[styles.container, { backgroundColor: background }]}
			>
				<ScrollView
					contentContainerStyle={{
						flexGrow: 1,
						justifyContent: 'center'
					}}
				>
					{showLogin ? (
						<ThemedView style={styles.form}>
							<ThemedText
								type="title"
								colorName="primaryAccent"
								style={styles.title}
							>
								Login
							</ThemedText>

							<ThemedText>Username</ThemedText>
							<TextInput
								value={loginData.username}
								onChangeText={(text) =>
									setLoginData({
										...loginData,
										username: text
									})
								}
								style={[
									styles.input,
									{ borderColor: border, color: text }
								]}
							/>

							<ThemedText>Password</ThemedText>
							<TextInput
								secureTextEntry
								value={loginData.password}
								onChangeText={(text) =>
									setLoginData({
										...loginData,
										password: text
									})
								}
								style={[
									styles.input,
									{ borderColor: border, color: text }
								]}
							/>

							<Pressable
								style={[
									styles.button,
									{ backgroundColor: accent }
								]}
								onPress={handleLogin}
							>
								<ThemedText
									colorName="buttonText"
									style={styles.buttonText}
								>
									Login
								</ThemedText>
							</Pressable>

							<Pressable onPress={() => setShowLogin(false)}>
								<ThemedText
									colorName="primaryAccent"
									style={styles.link}
								>
									Don't have an account? Sign up
								</ThemedText>
							</Pressable>
						</ThemedView>
					) : (
						<ThemedView style={[styles.form]}>
							<ThemedText
								type="title"
								colorName="primaryAccent"
								style={styles.title}
							>
								SignUp
							</ThemedText>

							<ThemedText>First Name</ThemedText>
							<TextInput
								value={registerData.firstName}
								onChangeText={(text) =>
									setRegisterData({
										...registerData,
										firstName: text
									})
								}
								style={[
									styles.input,
									{ borderColor: border, color: text }
								]}
							/>

							<ThemedText>Last Name (Optional)</ThemedText>
							<TextInput
								value={registerData.lastName}
								onChangeText={(text) =>
									setRegisterData({
										...registerData,
										lastName: text
									})
								}
								style={[
									styles.input,
									{ borderColor: border, color: text }
								]}
							/>

							<ThemedText>Username</ThemedText>
							<TextInput
								value={registerData.username}
								onChangeText={(text) =>
									setRegisterData({
										...registerData,
										username: text
									})
								}
								style={[
									styles.input,
									{ borderColor: border, color: text }
								]}
							/>

							<ThemedText>Email</ThemedText>
							<TextInput
								value={registerData.email}
								onChangeText={(text) =>
									setRegisterData({
										...registerData,
										email: text
									})
								}
								style={[
									styles.input,
									{ borderColor: border, color: text }
								]}
							/>

							<ThemedText>Password</ThemedText>
							<TextInput
								secureTextEntry
								value={registerData.password}
								onChangeText={(text) =>
									setRegisterData({
										...registerData,
										password: text
									})
								}
								style={[
									styles.input,
									{ borderColor: border, color: text }
								]}
							/>

							<View style={styles.row}>
								<View style={styles.half}>
									<ThemedText>
										Date of Birth (Optional)
									</ThemedText>
									<Pressable
										onPress={() => setShowDatePicker(true)}
										style={[
											styles.input,
											{
												justifyContent: 'center',
												borderColor: border
											}
										]}
									>
										<ThemedText style={{ color: text }}>
											{registerData.dob || 'Select Date'}
										</ThemedText>
									</Pressable>
									{showDatePicker && (
										<DateTimePicker
											value={
												registerData.dob
													? new Date(registerData.dob)
													: new Date()
											}
											mode="date"
											display={
												Platform.OS === 'ios'
													? 'spinner'
													: 'default'
											}
											onChange={handleDateChange}
											maximumDate={new Date()}
										/>
									)}
								</View>

								<View style={[styles.half, { marginLeft: 12 }]}>
									<ThemedText>Gender</ThemedText>
									<Pressable
										onPress={() => setShowGenderModal(true)}
										style={[
											styles.input,
											{
												justifyContent: 'center',
												borderColor: border
											}
										]}
									>
										<ThemedText style={{ color: text }}>
											{registerData.gender ||
												'Select Gender'}
										</ThemedText>
									</Pressable>
								</View>
							</View>

							<Modal
								visible={showGenderModal}
								transparent
								animationType="fade"
								onRequestClose={() => setShowGenderModal(false)}
							>
								<Pressable
									style={styles.modalBackdrop}
									onPress={() => setShowGenderModal(false)}
								>
									<ThemedView
										style={[
											styles.modalBox,
											{
												backgroundColor: background,
												borderColor: border
											}
										]}
									>
										{genderOptions.map((option) => (
											<Pressable
												key={option}
												onPress={() => {
													setRegisterData({
														...registerData,
														gender: option
													});
													setShowGenderModal(false);
												}}
												style={styles.modalOption}
											>
												<ThemedText>
													{option}
												</ThemedText>
											</Pressable>
										))}
									</ThemedView>
								</Pressable>
							</Modal>

							<Pressable
								style={[
									styles.button,
									{ backgroundColor: accent }
								]}
								onPress={handleRegister}
							>
								<ThemedText
									colorName="buttonText"
									style={styles.buttonText}
								>
									Register
								</ThemedText>
							</Pressable>

							<Pressable onPress={() => setShowLogin(true)}>
								<ThemedText
									colorName="primaryAccent"
									style={styles.link}
								>
									Already have an account? Login
								</ThemedText>
							</Pressable>
						</ThemedView>
					)}
				</ScrollView>
			</ThemedView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 24
	},
	form: {
		gap: 12
	},
	input: {
		borderWidth: 1,
		padding: 12,
		borderRadius: 8,
		fontSize: 16
	},
	button: {
		padding: 14,
		borderRadius: 8,
		alignItems: 'center'
	},
	buttonText: {
		fontWeight: 'bold'
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 16
	},
	link: {
		marginTop: 8,
		textAlign: 'center'
	},
	row: {
		flexDirection: 'row'
	},
	half: {
		flex: 1
	},
	modalBackdrop: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#00000080',
		paddingHorizontal: 32
	},
	modalBox: {
		width: '100%',
		borderRadius: 12,
		borderWidth: 1,
		padding: 16
	},
	modalOption: {
		paddingVertical: 12
	}
});

export default SplashScreen;
