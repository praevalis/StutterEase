import * as Haptics from 'expo-haptics';
import { PlatformPressable } from '@react-navigation/elements';
import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';

const HapticTab = ({
	onPress,
	onPressIn,
	...rest
}: BottomTabBarButtonProps) => {
	return (
		<PlatformPressable
			{...rest}
			onPress={onPress}
			onPressIn={(ev) => {
				if (process.env.EXPO_OS === 'ios') {
					Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
				}
				onPressIn?.(ev);
			}}
		/>
	);
};

export default HapticTab;
