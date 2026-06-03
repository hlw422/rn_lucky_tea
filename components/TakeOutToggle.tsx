import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { BrandColors } from '../constants/colors';

interface TakeOutToggleProps {
  value: 'pickup' | 'delivery';
  onChange: (value: 'pickup' | 'delivery') => void;
}

export const TakeOutToggle: React.FC<TakeOutToggleProps> = ({
  value,
  onChange,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.option,
          value === 'pickup' && styles.optionSelected,
        ]}
        onPress={() => onChange('pickup')}
      >
        <Text
          style={[
            styles.optionText,
            value === 'pickup' && styles.optionTextSelected,
          ]}
        >
          自提
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[
          styles.option,
          value === 'delivery' && styles.optionSelected,
        ]}
        onPress={() => onChange('delivery')}
      >
        <Text
          style={[
            styles.optionText,
            value === 'delivery' && styles.optionTextSelected,
          ]}
        >
          外送
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: BrandColors.backgroundSecondary,
    borderRadius: 20,
    padding: 2,
  },
  option: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 18,
  },
  optionSelected: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  optionText: {
    fontSize: 14,
    color: BrandColors.textSecondary,
  },
  optionTextSelected: {
    color: BrandColors.primary,
    fontWeight: '600',
  },
});
