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

  const goTo = (route) => navigation.navigate(route)

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

          <View style={style.buttonsContainer}>
            <Text>Aprobaciones</Text>

            <Button text="Compras" style={style.button} onPress={() => goTo("purchase")} />
            <Button text="Actas" style={style.button} onPress={() => goTo("certificate")} />
            <Button text="Bajas" style={style.button} onPress={() => goTo("derecognition")} />
          </View>

          <View style={style.buttonsContainer}>
            <Button
              text="Cerrar sesión"
              textStyle={style.buttonText}
              onPress={onLogout}
              style={[style.button, style.logout]}
            />
          </View>
        </View>
      </ScrollView>
    </>
  )
})

const style = StyleSheet.create({
  button: {
    marginHorizontal: 16,
    marginTop: 16,
    width: "100%",
  },
  buttonText: {
    color: color.palette.white,
  },
  buttonsContainer: {
    alignItems: "center",
    padding: 20,
    width: "100%",
  },
  logo: {
    height: 150,
    marginBottom: 20,
    width: 150,
  },
  logout: {
    backgroundColor: color.palette.blue,
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
