import { color } from "../../../theme"
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native"
import { Header, Loading, Text } from "../../../components"
import { observer } from "mobx-react-lite"
import { useNavigation, useIsFocused } from "@react-navigation/native"
import { useStores } from "../../../models"
import React, { useEffect, useState } from "react"

/**
 * @function PurchaseListApproverScreen
 * @brief Listado de aprobaciones de compras
 * @date 01/06/2021
 * @author Cristian Loaiza <cristianaloaiza@estudiante.uniajc.edu.co>
 */
export const PurchaseListApproverScreen = observer(function PurchaseListApproverScreen() {
  const navigation = useNavigation()

  const { purchaseStore } = useStores()

  const [loading, setLoading] = useState(false)
  const [purchases, setPurchases] = useState([])
  const [skeleton, setSkeleton] = useState(true)

  const isFocus = useIsFocused()

  const goBack = () => navigation.goBack()

  const goToPurchase = (purchaseId) => navigation.navigate("purchaseView", { purchaseId })

  const getPurchases = () => {
    purchaseStore.getPurchaseListApprove().then((response) => {
      if (response) {
        setPurchases(response)
      }

      setLoading(false)
      setSkeleton(false)
    })
  }

  useEffect(() => {
    if (isFocus) {
      setSkeleton(true)
      getPurchases()
    }
  }, [isFocus])

  return (
    <>
      <Header headerText="Órdenes de compra" leftIcon="back" onLeftPress={goBack} />

      {skeleton ? (
        <Loading />
      ) : (
        <FlatList
          data={purchases}
          refreshing={loading}
          onRefresh={() => {
            setLoading(true)
            getPurchases()
          }}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => goToPurchase(item.id)} activeOpacity={0.5}>
              <View style={style.itemContainer}>
                <Text>Nº: {item.consecutive}</Text>
                <Text>Proveedor: {item.provider}</Text>
                <Text>Valor total: {item.total}</Text>
                <Text>Ítems: {item.items}</Text>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={() => (
            <Text style={style.emptyText}>No hay órdenes pendientes de aprobación</Text>
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
