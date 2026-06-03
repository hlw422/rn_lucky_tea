import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  ViewStyle,
  TextStyle 
} from 'react-native';
import { BrandColors } from '../../constants/colors';

type ButtonType = 'primary' | 'secondary' | 'outline' | 'text';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  title: string;
  onPress: () => void;
  type?: ButtonType;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  type = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  style,
  textStyle,
}) => {
  const buttonStyles = [
    styles.base,
    styles[`type_${type}`],
    styles[`size_${size}`],
    disabled && styles.disabled,
    style,
  ];

  const textStyles = [
    styles.text,
    styles[`text_${type}`],
    styles[`textSize_${size}`],
    disabled && styles.textDisabled,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator 
          color={type === 'outline' || type === 'text' ? BrandColors.primary : '#fff'} 
          size="small" 
        />
      ) : (
        <>
          {icon && icon}
          <Text style={textStyles}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    gap: 8,
  },
  type_primary: {
    backgroundColor: BrandColors.primary,
  },
  type_secondary: {
    backgroundColor: BrandColors.secondary,
  },
  type_outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: BrandColors.primary,
  },
  type_text: {
    backgroundColor: 'transparent',
  },
  size_small: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  size_medium: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  size_large: {
    paddingVertical: 14,
    paddingHorizontal: 28,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontWeight: '600',
  },
  text_primary: {
    color: '#fff',
  },
  text_secondary: {
    color: '#fff',
  },
  text_outline: {
    color: BrandColors.primary,
  },
  text_text: {
    color: BrandColors.primary,
  },
  textSize_small: {
    fontSize: 12,
  },
  textSize_medium: {
    fontSize: 14,
  },
  textSize_large: {
    fontSize: 16,
  },
  textDisabled: {
    color: BrandColors.disabled,
  },
});
