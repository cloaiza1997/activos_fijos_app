import { color } from "../../../theme"
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native"
import { formatDate } from "../../../utils/utils"
import { Header, Loading, Text } from "../../../components"
import { observer } from "mobx-react-lite"
import { useNavigation, useIsFocused } from "@react-navigation/native"
import { useStores } from "../../../models"
import React, { useEffect, useState } from "react"

export const DerecognitionListApproverScreen = observer(function DerecognitionListApproverScreen() {
  const navigation = useNavigation()

  const { derecognitionStore } = useStores()

  const [loading, setLoading] = useState(false)
  const [certificates, setDerecognitions] = useState([])
  const [skeleton, setSkeleton] = useState(true)

  const isFocus = useIsFocused()

  const goBack = () => navigation.goBack()

  const goToDerecognition = (derecognitionId) =>
    navigation.navigate("derecognitionView", { derecognitionId })

  const getDerecognitions = () => {
    derecognitionStore.getDerecognitionListApprove().then((response) => {
      if (response) {
        setDerecognitions(response)
      }

      setLoading(false)
      setSkeleton(false)
    })
  }

  useEffect(() => {
    if (isFocus) {
      setSkeleton(true)
      getDerecognitions()
    }
  }, [isFocus])

  return (
    <>
      <Header headerText="Bajas de activos" leftIcon="back" onLeftPress={goBack} />

      {skeleton ? (
        <Loading />
      ) : (
        <FlatList
          data={certificates}
          refreshing={loading}
          onRefresh={() => {
            setLoading(true)
            getDerecognitions()
          }}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => goToDerecognition(item.id)} activeOpacity={0.5}>
              <View style={style.itemContainer}>
                <Text>Nº: {item.id}</Text>
                <Text>Elaborado por: {item.get_creator_user.display_name}</Text>
                <Text>Fecha: {formatDate(item.created_at)}</Text>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={() => (
            <Text style={style.emptyText}>No hay bajas de activos pendientes de aprobación</Text>
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
