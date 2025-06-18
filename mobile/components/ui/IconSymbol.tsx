import { ComponentProps } from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight, SymbolViewProps } from 'expo-symbols';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Record<
	SymbolViewProps['name'],
	ComponentProps<typeof MaterialIcons>['name']
>;
type IconSymbolName = keyof typeof MAPPING;

const MAPPING: IconMapping = {
	'house.fill': 'home',
	'mic.circle.fill': 'keyboard-voice',
	'bubble.left.and.bubble.right.fill': 'chat',
	'person.crop.circle.fill': 'person',
	'chevron.right': 'chevron-right',
	'chevron.down': 'keyboard-arrow-down',
	'waveform.circle.fill': 'graphic-eq',
	waveform: 'graphic-eq',
	xmark: 'close',
	magnifyingglass: 'search',
	'plus.circle.fill': 'add-circle'
} as IconMapping;

const IconSymbol = ({
	name,
	color,
	style,
	size = 24
}: {
	name: IconSymbolName;
	size?: number;
	color: string | OpaqueColorValue;
	style?: StyleProp<TextStyle>;
	weight?: SymbolWeight;
}) => {
	return (
		<MaterialIcons
			color={color}
			size={size}
			name={MAPPING[name]}
			style={style}
		/>
	);
};

export default IconSymbol;
