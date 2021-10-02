/* eslint-disable react-native/split-platform-components */
import { Alert, ToastAndroid } from "react-native"
import { CERTIFICATE_EDIT, CERTIFICATE_LIST_APPROVE } from "./certificate.const"
import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { withEnvironment } from "../extensions/with-environment"

export const CertificateStoreModel = types
  .model("CertificateStore")
  .props({})
  .extend(withEnvironment)
  .actions((self) => ({
    getCertificateListApprove: async () => {
      const result = await self.environment.api.apisauce.get(CERTIFICATE_LIST_APPROVE)

      const data: any = result?.data
      const { certificates } = data || {}

      if (!certificates) {
        Alert.alert("Error", "Error al consultar las actas de movimiento")
      }

      return certificates
    },
    getCertificate: async ({ certificateId }) => {
      const result = await self.environment.api.apisauce.get(
        CERTIFICATE_EDIT + certificateId + "/edit",
      )

      const data: any = result?.data
      const { certificate } = data || {}

      if (!certificate) {
        Alert.alert("Error", "Error al consultar el acta de movimiento")
      }

      return certificate
    },
    updateStatus: async ({ certificateId, url }) => {
      const result = await self.environment.api.apisauce.post(url + certificateId)

      const data: any = result?.data
      const { certificate } = data || {}

      if (data?.status) {
        ToastAndroid.show(data?.message, ToastAndroid.SHORT)
      } else {
        Alert.alert("Error", "Error al actualizar el estado del acta de movimiento")
      }

      return certificate
    },
  }))

type CertificateStoreType = Instance<typeof CertificateStoreModel>
export interface CertificateStore extends CertificateStoreType {}
type CertificateStoreSnapshotType = SnapshotOut<typeof CertificateStoreModel>
export interface CertificateStoreSnapshot extends CertificateStoreSnapshotType {}
export const createCertificateStoreDefaultModel = () => types.optional(CertificateStoreModel, {})
