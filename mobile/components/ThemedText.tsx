import { StyleSheet, Text, type TextProps } from 'react-native';

import { Colors } from '@/constants/colors';
import useThemeColor from '@/hooks/useThemeColor';

export interface ThemedTextProps extends TextProps {
	darkColor?: string;
	lightColor?: string;
	colorName?: keyof typeof Colors.light & keyof typeof Colors.dark;
	type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
}

const ThemedText = ({
	type,
	style,
	darkColor,
	lightColor,
	colorName = 'primaryText',
	...otherProps
}: ThemedTextProps) => {
	const color = useThemeColor(
		{ light: lightColor, dark: darkColor },
		colorName
	);

	return (
		<Text
			style={[
				{ color },
				type === 'link' ? styles.link : undefined,
				type === 'title' ? styles.title : undefined,
				type === 'default' ? styles.default : undefined,
				type === 'subtitle' ? styles.subtitle : undefined,
				type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
				style
			]}
			{...otherProps}
		/>
	);
};

const styles = StyleSheet.create({
	link: {
		fontSize: 16,
		lineHeight: 30,
		fontFamily: 'Inter_400Regular'
	},
	title: {
		fontSize: 32,
		lineHeight: 32,
		fontWeight: 'bold',
		fontFamily: 'Inter_700Bold'
	},
	default: {
		fontSize: 16,
		lineHeight: 24,
		fontFamily: 'Inter_400Regular'
	},
	subtitle: {
		fontSize: 20,
		fontFamily: 'Inter_700Bold'
	},
	defaultSemiBold: {
		fontSize: 16,
		lineHeight: 24,
		fontFamily: 'Inter_600SemiBold'
	}
});

export default ThemedText;
