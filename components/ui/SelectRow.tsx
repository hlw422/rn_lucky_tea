import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BrandColors } from '../../constants/colors';

interface SelectRowProps {
  title: string;
  options: string[];
  selected: string;
  onSelect: (option: string) => void;
}

export const SelectRow: React.FC<SelectRowProps> = ({
  title,
  options,
  selected,
  onSelect,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.optionsContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.option,
              selected === option && styles.optionSelected,
            ]}
            onPress={() => onSelect(option)}
          >
            <Text
              style={[
                styles.optionText,
                selected === option && styles.optionTextSelected,
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: BrandColors.text,
    marginBottom: 10,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  option: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BrandColors.border,
    backgroundColor: '#fff',
  },
  optionSelected: {
    borderColor: BrandColors.primary,
    backgroundColor: 'rgba(43, 76, 126, 0.1)',
  },
  optionText: {
    fontSize: 13,
    color: BrandColors.text,
  },
  optionTextSelected: {
    color: BrandColors.primary,
    fontWeight: '600',
  },
});
