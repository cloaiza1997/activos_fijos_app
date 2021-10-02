/* eslint-disable react-native/split-platform-components */
import { Alert, ToastAndroid } from "react-native"
import { DERECOGNITION_EDIT, DERECOGNITION_LIST_APPROVE } from "./derecognition.const"
import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { withEnvironment } from "../extensions/with-environment"

export const DerecognitionStoreModel = types
  .model("DerecognitionStore")
  .props({})
  .extend(withEnvironment)
  .actions((self) => ({
    getDerecognitionListApprove: async () => {
      const result = await self.environment.api.apisauce.get(DERECOGNITION_LIST_APPROVE)

      const data: any = result?.data
      const { derecognitions } = data || {}

      if (!derecognitions) {
        Alert.alert("Error", "Error al consultar los procesos de bajas de activos")
      }

      return derecognitions
    },
    getDerecognition: async ({ derecognitionId }) => {
      const result = await self.environment.api.apisauce.get(
        DERECOGNITION_EDIT + derecognitionId + "/edit",
      )

      const data: any = result?.data
      const { derecognition } = data || {}

      if (!derecognition) {
        Alert.alert("Error", "Error al consultar la baja de activos")
      }

      return derecognition
    },
    updateStatus: async ({ derecognitionId, url }) => {
      const result = await self.environment.api.apisauce.post(url + derecognitionId)

      const data: any = result?.data
      const { derecognition } = data || {}

      if (data?.status) {
        ToastAndroid.show(data?.message, ToastAndroid.SHORT)
      } else {
        Alert.alert("Error", "Error al actualizar el estado del proceso de baja")
      }

      return derecognition
    },
  }))

type DerecognitionStoreType = Instance<typeof DerecognitionStoreModel>
export interface DerecognitionStore extends DerecognitionStoreType {}
type DerecognitionStoreSnapshotType = SnapshotOut<typeof DerecognitionStoreModel>
export interface DerecognitionStoreSnapshot extends DerecognitionStoreSnapshotType {}
export const createDerecognitionStoreDefaultModel = () =>
  types.optional(DerecognitionStoreModel, {})
