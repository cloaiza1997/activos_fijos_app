/* eslint-disable react-native/no-unused-styles */
/* eslint-disable react-native/no-color-literals */
import React from "react"
import { View, ActivityIndicator, StyleSheet } from "react-native"

export function Loading() {
  return (
    <View style={style.container}>
      <ActivityIndicator color="black" size={50} />
    </View>
  )
}

const style = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#000000a6",
    display: "flex",
    height: "100%",
    justifyContent: "center",
    position: "absolute",
    width: "100%",
    zIndex: 100,
  },
})
