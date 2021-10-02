import {
  DERECOGNITION_CHECKING,
  DERECOGNITION_URL_STATUS_APPROVED,
  DERECOGNITION_URL_STATUS_REJECTED,
} from "../../../models/derecognition/derecognition.const"
import { Alert, ScrollView, StyleSheet, View } from "react-native"
import { Button, Header, Loading, Text, TextField } from "../../../components"
import { color } from "../../../theme"
import { formatDate } from "../../../utils/utils"
import { observer } from "mobx-react-lite"
import { useNavigation } from "@react-navigation/native"
import { useStores } from "../../../models"
import React, { useEffect, useState } from "react"

export const DerecognitionViewScreen = observer(function DerecognitionViewScreen(props: any) {
  const navigation = useNavigation()

  const { derecognitionId } = props?.route?.params || {}

  const { derecognitionStore } = useStores()

  const [loading, setLoading] = useState(false)
  const [derecognition, setDerecognition] = useState(undefined)
  const [skeleton, setSkeleton] = useState(true)

  const goBack = () => navigation.goBack()

  const getCost = () => {
    let cost = 0

    derecognition?.get_details?.forEach((item) => {
      cost += parseFloat(item?.get_asset?.current_value)
    })

    return cost
  }

  const onUpdateStatus = (url) => {
    setLoading(true)

    derecognitionStore.updateStatus({ derecognitionId, url }).then((response) => {
      if (response) {
        setDerecognition({ ...derecognition, ...response })
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
    derecognitionStore.getDerecognition({ derecognitionId }).then((response) => {
      if (response) {
        setDerecognition(response)
        setSkeleton(false)
      } else {
        goBack()
      }
    })
  }, [])

  return (
    <>
      <Header headerText="Baja de activos" leftIcon="back" onLeftPress={goBack} />

      {skeleton && !derecognition ? (
        <Loading />
      ) : (
        <>
          {loading && <Loading />}

          <ScrollView>
            <View style={style.mainContainer}>
              <TextField label="Número" value={derecognition?.id + ""} editable={false} />

              <TextField
                label="Estado"
                value={derecognition?.get_status?.str_val}
                editable={false}
              />

              <TextField
                label="Observaciones"
                value={derecognition?.observations}
                multiline
                editable={false}
              />

              <TextField label="Costo de la baja" value={`$ ${getCost()}`} editable={false} />

              <Text style={style.title}>Activos a dar de baja</Text>

              <View>
                {derecognition?.get_details?.map((item) => (
                  <View key={item.id} style={style.item}>
                    <Text>{item.get_asset?.asset_number}</Text>
                    <Text>{item.get_asset?.name}</Text>
                    <Text>Serial: {item.get_asset?.serial_number}</Text>
                    <Text>Costo: $ {item.get_asset?.current_value}</Text>
                    <Text>Motivo: {item.get_reason?.str_val}</Text>
                  </View>
                ))}
              </View>

              <View>
                <Text>Elaborado por: {derecognition?.get_creator_user?.display_name}</Text>

                <Text>Fecha de ejecución: {formatDate(derecognition?.created_at)}</Text>
              </View>

              {derecognition?.get_status.parameter_key === DERECOGNITION_CHECKING && (
                <View style={style.buttonContainer}>
                  <Button
                    text="Rechazar"
                    style={style.reject}
                    textStyle={style.text}
                    onPress={() =>
                      onConfirm(
                        "¿Confirma rechazar el proceso de bajas de activos?",
                        DERECOGNITION_URL_STATUS_REJECTED,
                      )
                    }
                  />

                  <Button
                    text="Aprobar"
                    style={style.approve}
                    textStyle={style.text}
                    onPress={() =>
                      onConfirm(
                        "¿Confirma aprobar el proceso de bajas de activos?",
                        DERECOGNITION_URL_STATUS_APPROVED,
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
