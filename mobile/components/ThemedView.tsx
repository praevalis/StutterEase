import { View, type ViewProps } from 'react-native';

import { Colors } from '@/constants/colors';
import useThemeColor from '@/hooks/useThemeColor';

export interface ThemedViewProps extends ViewProps {
    darkColor?: string;
    lightColor?: string;
    colorName?: keyof typeof Colors.light & keyof typeof Colors.dark;
}

const ThemedView = ({
    style,
    darkColor,
    lightColor,
    colorName = 'background',
    ...otherProps
}: ThemedViewProps) => {
    const backgroundColor = useThemeColor(
        { light: lightColor, dark: darkColor },
        colorName
    );

    return <View style={[{ backgroundColor }, style]} {...otherProps} />;
};

export default ThemedView;
