import {
  CERTIFICATE_CHECKING,
  CERTIFICATE_URL_STATUS_APPROVED,
  CERTIFICATE_URL_STATUS_REJECTED,
} from "../../../models/certificate/certificate.const"
import { Alert, ScrollView, StyleSheet, View } from "react-native"
import { Button, Header, Loading, Text, TextField } from "../../../components"
import { color } from "../../../theme"
import { formatDate } from "../../../utils/utils"
import { observer } from "mobx-react-lite"
import { useNavigation } from "@react-navigation/native"
import { useStores } from "../../../models"
import React, { useEffect, useState } from "react"

export const CertificateViewScreen = observer(function CertificateViewScreen(props: any) {
  const navigation = useNavigation()

  const { certificateId } = props?.route?.params || {}

  const { certificateStore } = useStores()

  const [loading, setLoading] = useState(false)
  const [certificate, setCertificate] = useState(undefined)
  const [skeleton, setSkeleton] = useState(true)

  const goBack = () => navigation.goBack()

  const onUpdateStatus = (url) => {
    setLoading(true)

    certificateStore.updateStatus({ certificateId, url }).then((response) => {
      if (response) {
        setCertificate({ ...certificate, ...response })
      }

      setLoading(false)
    })
  }

  const onConfirm = (message, url) => {
    Alert.alert("Confirmar", message, [
      {
        text: "Cancelar",
      },
      { text: "Aceptar", onPress: () => onUpdateStatus(url) },
    ])
  }

  useEffect(() => {
    certificateStore.getCertificate({ certificateId }).then((response) => {
      if (response) {
        setCertificate(response)
        setSkeleton(false)
      } else {
        goBack()
      }
    })
  }, [])

  return (
    <>
      <Header headerText="Orden de compra" leftIcon="back" onLeftPress={goBack} />

      {skeleton && !certificate ? (
        <Loading />
      ) : (
        <>
          {loading && <Loading />}

          <ScrollView>
            <View style={style.mainContainer}>
              <TextField label="Número" value={certificate?.id + ""} editable={false} />

              <TextField label="Estado" value={certificate?.get_status?.str_val} editable={false} />

              <TextField
                label="Entrega"
                value={certificate?.get_deliver_user?.display_name}
                editable={false}
              />

              <TextField
                label="Área que entrega"
                value={certificate?.get_deliver_area?.str_val}
                editable={false}
              />

              <TextField
                label="Recibe"
                value={certificate?.get_receiver_user?.display_name}
                editable={false}
              />

              <TextField
                label="Área que entrega"
                value={certificate?.get_receiver_area?.str_val}
                editable={false}
              />

              <TextField
                label="Observaciones"
                value={certificate?.observations}
                multiline
                editable={false}
              />

              <Text style={style.title}>Activos del acta</Text>

              <View>
                {certificate?.get_certificate_details?.map((item) => (
                  <View key={item.id} style={style.item}>
                    <Text>{item.asset_number}</Text>
                    <Text>{item.name}</Text>
                    <Text>{item.brand}</Text>
                    <Text>{item.serial_number}</Text>
                    <Text>Estado: {item.get_physical_status?.str_val}</Text>
                  </View>
                ))}
              </View>

              <View>
                <Text>Elaborado por: {certificate?.get_creator_user?.display_name}</Text>

                <Text>Fecha de ejecución: {formatDate(certificate?.created_at)}</Text>
              </View>

              {certificate?.get_status.parameter_key === CERTIFICATE_CHECKING && (
                <View style={style.buttonContainer}>
                  <Button
                    text="Rechazar"
                    style={style.reject}
                    textStyle={style.text}
                    onPress={() =>
                      onConfirm(
                        "¿Confirma rechazar el acta de movimiento?",
                        CERTIFICATE_URL_STATUS_REJECTED,
                      )
                    }
                  />

                  <Button
                    text="Aprobar"
                    style={style.approve}
                    textStyle={style.text}
                    onPress={() =>
                      onConfirm(
                        "¿Confirma aprobar el acta de movimiento?",
                        CERTIFICATE_URL_STATUS_APPROVED,
                      )
                    }
                  />
                </View>
              )}
            </View>
          </ScrollView>
        </>
      )}
    </>
  )
})

const style = StyleSheet.create({
  approve: {
    backgroundColor: color.palette.green,
    marginHorizontal: 10,
  },
  buttonContainer: {
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    margin: 10,
  },
  item: {
    backgroundColor: color.palette.white,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 10,
    padding: 8,
  },
  mainContainer: {
    paddingBottom: 16,
    paddingHorizontal: 20,
    paddingTop: 6,
  },
  reject: {
    backgroundColor: color.palette.angry,
    marginHorizontal: 10,
  },
  text: {
    color: color.palette.white,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 10,
  },
})
