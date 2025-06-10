import * as Haptics from 'expo-haptics';
import { PlatformPressable } from '@react-navigation/elements';
import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';

const HapticTab = (props: BottomTabBarButtonProps) => {
    return (
        <PlatformPressable
            {...props}
            onPressIn={(ev) => {
                if (process.env.EXPO_OS === 'ios') {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
                props.onPressIn?.(ev);
            }}
        />
    );
};

export default HapticTab;
