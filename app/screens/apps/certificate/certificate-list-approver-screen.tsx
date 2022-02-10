import { color } from "../../../theme"
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native"
import { formatDate } from "../../../utils/utils"
import { Header, Loading, Text } from "../../../components"
import { observer } from "mobx-react-lite"
import { useNavigation, useIsFocused } from "@react-navigation/native"
import { useStores } from "../../../models"
import React, { useEffect, useState } from "react"

/**
 * @function CertificateListApproverScreen
 * @brief Listado de aprobaciones de actas
 * @date 01/06/2021
 * @author Cristian Loaiza <cristianaloaiza@estudiante.uniajc.edu.co>
 */
export const CertificateListApproverScreen = observer(function CertificateListApproverScreen() {
  const navigation = useNavigation()

  const { certificateStore } = useStores()

  const [loading, setLoading] = useState(false)
  const [certificates, setCertificates] = useState([])
  const [skeleton, setSkeleton] = useState(true)

  const isFocus = useIsFocused()

  const goBack = () => navigation.goBack()

  const goToCertificate = (certificateId) =>
    navigation.navigate("certificateView", { certificateId })

  const getCertificates = () => {
    certificateStore.getCertificateListApprove().then((response) => {
      if (response) {
        setCertificates(response)
      }

      setLoading(false)
      setSkeleton(false)
    })
  }

  useEffect(() => {
    if (isFocus) {
      setSkeleton(true)
      getCertificates()
    }
  }, [isFocus])

  return (
    <>
      <Header headerText="Actas de movimiento" leftIcon="back" onLeftPress={goBack} />

      {skeleton ? (
        <Loading />
      ) : (
        <FlatList
          data={certificates}
          refreshing={loading}
          onRefresh={() => {
            setLoading(true)
            getCertificates()
          }}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => goToCertificate(item.id)} activeOpacity={0.5}>
              <View style={style.itemContainer}>
                <Text>Nº: {item.id}</Text>
                <Text>Entregado por: {item.get_deliver_user.display_name}</Text>
                <Text>Recibido por: {item.get_receiver_user.display_name}</Text>
                <Text>Fecha: {formatDate(item.created_at)}</Text>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={() => (
            <Text style={style.emptyText}>No hay actas de movimiento pendientes de aprobación</Text>
          )}
          contentContainerStyle={style.list}
        />
      )}
    </>
  )
})

const style = StyleSheet.create({
  emptyText: {
    fontSize: 20,
    paddingHorizontal: 10,
    paddingVertical: 20,
    textAlign: "center",
  },
  itemContainer: {
    backgroundColor: color.palette.white,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 10,
    padding: 16,
  },
  list: {
    padding: 10,
  },
})
