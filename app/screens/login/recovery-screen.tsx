import { Button, Loading, Text, TextField } from "../../components"
import { color } from "../../theme"
import { Image, ScrollView, StyleSheet, View } from "react-native"
import { observer } from "mobx-react-lite"
import { useNavigation } from "@react-navigation/native"
import { useStores } from "../../models"
import React, { useEffect, useState } from "react"

const LOGO = require("../../assets/logo_1.png")

/**
 * @function RecoveryScreen
 * @brief Formulario de recuperación de contraseña
 * @date 01/06/2021
 * @author Cristian Loaiza <cristianaloaiza@estudiante.uniajc.edu.co>
 */
export const RecoveryScreen = observer(function RecoveryScreen() {
  const navigation = useNavigation()

  const { userStore } = useStores()

  const [disabled, setDisabled] = useState(true)
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)

  const goToLogin = () => navigation.navigate("login")

  const onLogin = () => {
    setLoading(true)

    const success = () => {
      setEmail("")
      setLoading(false)
    }

    const error = () => setLoading(false)

    userStore.recoveryPassword({ email, success, error })
  }

  useEffect(() => {
    setDisabled(!email.trim())
  }, [email])

  return (
    <>
      {loading && <Loading />}

      <ScrollView>
        <View style={style.mainContainer}>
          <Image source={LOGO} style={style.logo} />

          <Text style={style.title}>Recuperación de contraseña</Text>

          <Text style={style.text}>
            Para recuperar la contraseña ingrese el usuario y presione el botón "Enviar correo" para
            que se envíe un mensaje de correo electrónico con las instrucciones al email registrado
            para la cuenta de usuario.
          </Text>

          <TextField
            keyboardType="email-address"
            label="Usuario"
            value={email}
            onChangeText={setEmail}
            style={style.input}
          />

          <Button text="Enviar correo" style={style.button} disabled={disabled} onPress={onLogin} />

          <Text style={style.link} onPress={goToLogin}>
            Regresar
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
  text: {
    marginVertical: 10,
    textAlign: "justify",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
})
