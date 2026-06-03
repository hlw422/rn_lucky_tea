import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { BrandColors } from '../../constants/colors';

interface StepperProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
}

export const Stepper: React.FC<StepperProps> = ({
  value,
  min = 1,
  max = 99,
  onChange,
}) => {
  const handleDecrease = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrease = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, value <= min && styles.buttonDisabled]}
        onPress={handleDecrease}
        disabled={value <= min}
      >
        <Text style={[styles.buttonText, value <= min && styles.buttonTextDisabled]}>
          -
        </Text>
      </TouchableOpacity>
      
      <View style={styles.valueContainer}>
        <Text style={styles.valueText}>{value}</Text>
      </View>
      
      <TouchableOpacity
        style={[styles.button, value >= max && styles.buttonDisabled]}
        onPress={handleIncrease}
        disabled={value >= max}
      >
        <Text style={[styles.buttonText, value >= max && styles.buttonTextDisabled]}>
          +
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BrandColors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  button: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BrandColors.backgroundSecondary,
  },
  buttonDisabled: {
    backgroundColor: BrandColors.borderLight,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: BrandColors.text,
  },
  buttonTextDisabled: {
    color: BrandColors.disabled,
  },
  valueContainer: {
    width: 40,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  valueText: {
    fontSize: 14,
    fontWeight: '600',
    color: BrandColors.text,
  },
});
