import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const CustomSelector = ({ options, selectedValue, onSelect }) => {
  return (
    <View style={styles.selectorContainer}>
      {options.map((option) => (
        <TouchableOpacity
          key={option.value}
          style={[
            styles.optionButton,
            selectedValue === option.value && styles.selectedOption
          ]}
          onPress={() => onSelect(option.value)}
          activeOpacity={0.7}
          testID={`option-${option.value}`} // Para pruebas
        >
          <Text style={[
            styles.optionText,
            selectedValue === option.value && styles.selectedText
          ]}>
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  selectorContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 5,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
    minWidth: 80,
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: '#4CAF50',
  },
  optionText: {
    color: '#333',
    fontSize: 14,
  },
  selectedText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default CustomSelector;