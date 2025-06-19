import { Dimensions, Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import ThemedView from '@/components/ThemedView';
import ThemedText from '@/components/ThemedText';
import useThemeColor from '@/hooks/useThemeColor';
import IconSymbol from '@/components/ui/IconSymbol';

const { height } = Dimensions.get('window');

const HomeScreen = () => {
	const router = useRouter();
	const border = useThemeColor({}, 'border');
	const iconColor = useThemeColor({}, 'primaryAccent');
	const surface = useThemeColor({}, 'surface');
	const background = useThemeColor({}, 'background');

	return (
		<SafeAreaView style={styles.safeArea}>
			<ThemedView
				style={[styles.container, { backgroundColor: background }]}
			>
				<ThemedView
					colorName="primaryAccent"
					style={styles.heroSection}
				>
					<ThemedText
						type="title"
						colorName="primaryText"
						style={styles.heroTextPrimary}
					>
						👋 Hello there!
					</ThemedText>
					<ThemedText
						type="default"
						colorName="primaryText"
						style={styles.heroTextSecondary}
					>
						How can we help you today?
					</ThemedText>
				</ThemedView>

				<View style={styles.cardContainer}>
					<Pressable
						onPress={() => router.push('/assistant')}
						style={[
							styles.card,
							{ borderColor: border, backgroundColor: surface }
						]}
					>
						<View style={styles.cardContent}>
							<ThemedText type="subtitle" style={styles.cardText}>
								Speech Assistance
							</ThemedText>
						</View>
						<IconSymbol
							name="chevron.right"
							size={24}
							color={iconColor}
						/>
					</Pressable>

					<Pressable
						onPress={() => router.push('/coach')}
						style={[
							styles.card,
							{ borderColor: border, backgroundColor: surface }
						]}
					>
						<View style={styles.cardContent}>
							<ThemedText type="subtitle" style={styles.cardText}>
								Conversation Practice
							</ThemedText>
						</View>
						<IconSymbol
							name="chevron.right"
							size={24}
							color={iconColor}
						/>
					</Pressable>
				</View>

				<View
					style={[
						styles.funFactContainer,
						{
							borderColor: iconColor
						}
					]}
				>
					<ThemedText type="default" style={styles.funFactText}>
						Did you know? About 1% of the world's population
						stutters — that's over 70 million people!
					</ThemedText>
				</View>
			</ThemedView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	safeArea: {
		flex: 1
	},
	container: {
		flex: 1
	},
	heroSection: {
		height: height / 3,
		paddingHorizontal: 24,
		paddingTop: 36,
		borderBottomLeftRadius: 24,
		borderBottomRightRadius: 24,
		justifyContent: 'center',
		alignItems: 'flex-start',
		gap: 8
	},
	heroTextPrimary: {
		fontWeight: 'bold'
	},
	heroTextSecondary: {
		fontWeight: '600'
	},
	quickActionsRow: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		marginTop: 24,
		paddingHorizontal: 24
	},
	quickActionButton: {
		alignItems: 'center',
		gap: 4
	},
	quickActionText: {
		fontSize: 12,
		fontWeight: '500'
	},
	cardContainer: {
		flex: 1,
		paddingHorizontal: 24,
		paddingTop: 32,
		gap: 20
	},
	card: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		borderRadius: 16,
		paddingVertical: 18,
		paddingHorizontal: 20,
		borderWidth: 1,
		elevation: 2,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4
	},
	cardContent: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12
	},
	cardText: {
		fontWeight: '600'
	},
	funFactContainer: {
		marginHorizontal: 24,
		marginTop: 24,
		padding: 16,
		borderWidth: 1,
		borderRadius: 12,
		backgroundColor: 'transparent',
		gap: 8
	},
	funFactText: {
		fontSize: 14,
		lineHeight: 20,
		fontWeight: '500'
	}
});

export default HomeScreen;
