import {
  PURCHASE_STATUS_APPROVED,
  PURCHASE_STATUS_CHECKING,
  PURCHASE_STATUS_REJECTED,
} from "../../../models/purchase/purchase.const"
import { Alert, ScrollView, StyleSheet, View } from "react-native"
import { Button, Header, Loading, Text, TextField } from "../../../components"
import { color } from "../../../theme"
import { formatDate } from "../../../utils/utils"
import { observer } from "mobx-react-lite"
import { useNavigation } from "@react-navigation/native"
import { useStores } from "../../../models"
import React, { useEffect, useState } from "react"

/**
 * @function PurchaseViewScreen
 * @brief Visualización de la compra para aprobación
 * @date 01/06/2021
 * @author Cristian Loaiza <cristianaloaiza@estudiante.uniajc.edu.co>
 */
export const PurchaseViewScreen = observer(function PurchaseViewScreen(props: any) {
  const navigation = useNavigation()

  const { purchaseId } = props?.route?.params || {}

  const { purchaseStore } = useStores()

  const [loading, setLoading] = useState(false)
  const [purchase, setPurchase] = useState(undefined)
  const [skeleton, setSkeleton] = useState(true)

  const goBack = () => navigation.goBack()

  const onUpdateStatus = (status) => {
    setLoading(true)

    purchaseStore.updateStatus({ purchaseId, status }).then((response) => {
      if (response) {
        setPurchase(response)
      }

      setLoading(false)
    })
  }

  const onConfirm = (message, status) => {
    Alert.alert("Confirmar", message, [
      {
        text: "Cancelar",
      },
      { text: "Aceptar", onPress: () => onUpdateStatus(status) },
    ])
  }

  useEffect(() => {
    purchaseStore.getPurchase({ purchaseId }).then((response) => {
      if (response) {
        setPurchase(response)
        setSkeleton(false)
      } else {
        goBack()
      }
    })
  }, [])

  return (
    <>
      <Header headerText="Orden de compra" leftIcon="back" onLeftPress={goBack} />

      {skeleton && !purchase ? (
        <Loading />
      ) : (
        <>
          {loading && <Loading />}

          <ScrollView>
            <View style={style.mainContainer}>
              <TextField label="Número" value={purchase?.id + ""} editable={false} />

              <TextField label="Estado" value={purchase?.get_status?.str_val} editable={false} />

              <TextField
                label="Solicitado por"
                value={purchase?.get_requesting_user?.display_name}
                editable={false}
              />

              <TextField label="Proveedor" value={purchase?.get_provider?.name} editable={false} />

              <TextField
                label="Fecha de entrega"
                value={purchase?.delivery_date}
                editable={false}
              />

              <TextField
                label="Ciudad de entrega"
                value={purchase?.get_city?.str_val}
                editable={false}
              />

              <TextField
                label="Dirección de entrega"
                value={purchase?.delivery_address}
                editable={false}
              />

              <TextField
                label="Observaciones"
                value={purchase?.observations}
                multiline
                editable={false}
              />

              <Text style={style.title}>Productos</Text>

              <View>
                {purchase?.get_purchase_items?.map((item) => (
                  <View key={item.id} style={style.item}>
                    <Text>
                      {item.product} ({item.quantity} unds)
                    </Text>
                    <Text>Valor unitario: $ {item.unit_value}</Text>
                    <Text>Valor total: $ {item.total_value}</Text>
                  </View>
                ))}
              </View>

              <View>
                <Text>Elaborado por: {purchase?.get_creator_user?.display_name}</Text>

                <Text>Fecha de ejecución: {formatDate(purchase?.created_at)}</Text>
              </View>

              {purchase?.get_status.parameter_key === PURCHASE_STATUS_CHECKING && (
                <View style={style.buttonContainer}>
                  <Button
                    text="Rechazar"
                    style={style.reject}
                    textStyle={style.text}
                    onPress={() =>
                      onConfirm("¿Confirma rechazar la orden de compra?", PURCHASE_STATUS_REJECTED)
                    }
                  />

                  <Button
                    text="Aprobar"
                    style={style.approve}
                    textStyle={style.text}
                    onPress={() =>
                      onConfirm("¿Confirma aprobar la orden de compra?", PURCHASE_STATUS_APPROVED)
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
