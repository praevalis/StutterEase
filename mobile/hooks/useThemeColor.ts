import { useColorScheme } from 'react-native';

import { Colors } from '@/constants/colors';

const useThemeColor = (
    props: { light?: string; dark?: string },
    colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) => {
    const theme = useColorScheme() ?? 'light';
    const colorFromProps = props[theme];

    if (colorFromProps) {
        return colorFromProps;
    } else {
        return Colors[theme][colorName];
    }
};

export default useThemeColor;
