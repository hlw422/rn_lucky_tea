import React from 'react';
import { 
  TouchableOpacity, 
  View, 
  Text, 
  StyleSheet, 
  ViewStyle 
} from 'react-native';
import { BrandColors } from '../../constants/colors';

interface RowProps {
  leftChild?: React.ReactNode;
  centerChild?: React.ReactNode;
  rightChild?: React.ReactNode;
  height?: number;
  padding?: number;
  margin?: number;
  showBorder?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
}

export const Row: React.FC<RowProps> = ({
  leftChild,
  centerChild,
  rightChild,
  height = 50,
  padding = 15,
  margin = 0,
  showBorder = true,
  onPress,
  style,
}) => {
  const content = (
    <View
      style={[
        styles.container,
        { 
          height, 
          paddingHorizontal: padding,
          marginVertical: margin,
        },
        showBorder && styles.border,
        style,
      ]}
    >
      {leftChild && (
        <View style={styles.leftSection}>
          {leftChild}
        </View>
      )}
      
      {centerChild && (
        <View style={styles.centerSection}>
          {centerChild}
        </View>
      )}
      
      {rightChild && (
        <View style={styles.rightSection}>
          {rightChild}
        </View>
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  border: {
    borderBottomWidth: 1,
    borderBottomColor: BrandColors.borderLight,
  },
  leftSection: {
    marginRight: 12,
  },
  centerSection: {
    flex: 1,
  },
  rightSection: {
    marginLeft: 12,
  },
});
