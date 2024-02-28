import * as React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Entypo } from '@expo/vector-icons';

export default function Button({ onPress, icon, color, size }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <Entypo name={icon} size={size} color={color ? color : "#f1f1f1"} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 80,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "4%",
    marginBottom: "5%",
  },
  text: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#f1f1f1",
    marginLeft: 10,
  },
});