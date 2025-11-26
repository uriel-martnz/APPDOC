import React from 'react';
import { StyleSheet } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { spacing } from '../../theme/spacing';

export default function SearchBar({ value, onChangeText, placeholder = 'Buscar...' }) {
  return (
    <Searchbar
      placeholder={placeholder}
      onChangeText={onChangeText}
      value={value}
      style={styles.searchbar}
    />
  );
}

const styles = StyleSheet.create({
  searchbar: {
    margin: spacing.md,
    elevation: 2,
  },
});
