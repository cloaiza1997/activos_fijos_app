import { Button, Loading, Text, TextField } from "../../components"
import { color } from "../../theme"
import { Image, ScrollView, StyleSheet, View } from "react-native"
import { observer } from "mobx-react-lite"
import { useNavigation } from "@react-navigation/native"
import { useStores } from "../../models"
import React, { useEffect, useState } from "react"

const LOGO = require("../../assets/logo_1.png")

export const LoginScreen = observer(function LoginScreen() {
  const navigation = useNavigation()

  const { userStore } = useStores()

  const [disabled, setDisabled] = useState(true)
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [password, setPassword] = useState("")

  const goToRecovery = () => navigation.navigate("recovery")

  const onLogin = () => {
    setLoading(true)

    const success = () => setLoading(false)

    const error = () => setLoading(false)

    userStore.login({ form: { email, password }, success, error })
  }

  useEffect(() => {
    setDisabled(!email.trim() || !password.trim())
  }, [email, password])

  return (
    <>
      {loading && <Loading />}

      <ScrollView>
        <View style={style.mainContainer}>
          <Image source={LOGO} style={style.logo} />

          <Text style={style.title}>Gestión de Activos</Text>

          <TextField
            keyboardType="email-address"
            label="Usuario"
            value={email}
            onChangeText={setEmail}
            style={style.input}
          />

          <TextField
            label="Contraseña"
            style={style.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Button text="Login" style={style.button} disabled={disabled} onPress={onLogin} />

          <Text style={style.link} onPress={goToRecovery}>
            Recuperar contraseña
          </Text>
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
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
})
