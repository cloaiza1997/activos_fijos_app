import { Button, Loading, Text } from "../../components"
import { color } from "../../theme"
import { Image, ScrollView, StyleSheet, View } from "react-native"
import { observer } from "mobx-react-lite"
import { useNavigation } from "@react-navigation/native"
import { useStores } from "../../models"
import React, { useState } from "react"

const LOGO = require("../../assets/logo_1.png")

export const MenuScreen = observer(function MenuScreen() {
  const navigation = useNavigation()

  const { userStore } = useStores()
  const { user } = userStore

  const [loading, setLoading] = useState(false)

  const onLogout = () => {
    setLoading(true)

    const success = () => {
      navigation.navigate("login")
      setLoading(false)
    }

    const error = () => setLoading(false)

    userStore.logout({ success, error })
  }

  return (
    <>
      {loading && <Loading />}

      <ScrollView>
        <View style={style.mainContainer}>
          <Image source={LOGO} style={style.logo} />

          <Text style={style.title}>Bienvenido, {user?.display_name}</Text>

          <Text>{user?.role}</Text>

          <Button text="Cerrar sesión" onPress={onLogout} />
        </View>
      </ScrollView>
    </>
  )
})

const style = StyleSheet.create({
  button: {
    margin: 16,
    width: 200,
  },
  input: {
    width: "80%",
  },
  link: {
    color: color.palette.blue,
    fontSize: 14,
    textDecorationLine: "underline",
  },
  logo: {
    height: 150,
    marginBottom: 20,
    width: 150,
  },
  mainContainer: {
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
    padding: 20,
  },
  text: {
    marginVertical: 10,
    textAlign: "justify",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
})
