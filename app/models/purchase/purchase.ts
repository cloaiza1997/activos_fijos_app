/* eslint-disable react-native/split-platform-components */
import { Alert, ToastAndroid } from "react-native"
import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { PURCHASE_LIST_TO_APPROVE, PURCHASE_UPDATE_STATUS, PURCHASE_VIEW } from "./purchase.const"
import { withEnvironment } from "../extensions/with-environment"

export const PurchaseStoreModel = types
  .model("PurchaseStore")
  .props({})
  .extend(withEnvironment)
  .actions((self) => ({
    getPurchaseListApprove: async () => {
      const result = await self.environment.api.apisauce.get(PURCHASE_LIST_TO_APPROVE)

      const data: any = result?.data
      const { purchases } = data || {}

      if (!purchases) {
        Alert.alert("Error", "Error al consultar las órdenes de compra")
      }

      return purchases
    },
    getPurchase: async ({ purchaseId }) => {
      const result = await self.environment.api.apisauce.get(PURCHASE_VIEW + purchaseId + "/edit")

      const data: any = result?.data
      const { purchase } = data || {}

      if (!purchase) {
        Alert.alert("Error", "Error al consultar la orden de compra")
      }

      return purchase
    },
    updateStatus: async ({ purchaseId, status }) => {
      const result = await self.environment.api.apisauce.put(PURCHASE_UPDATE_STATUS + purchaseId, {
        status,
      })

      const data: any = result?.data
      const { purchase } = data || {}

      if (data?.status) {
        ToastAndroid.show(data?.message, ToastAndroid.SHORT)
      } else {
        Alert.alert("Error", "Error al actualizar el estado de la orden de compra")
      }

      return purchase
    },
  }))

type PurchaseStoreType = Instance<typeof PurchaseStoreModel>
export interface PurchaseStore extends PurchaseStoreType {}
type PurchaseStoreSnapshotType = SnapshotOut<typeof PurchaseStoreModel>
export interface PurchaseStoreSnapshot extends PurchaseStoreSnapshotType {}
export const createPurchaseStoreDefaultModel = () => types.optional(PurchaseStoreModel, {})
