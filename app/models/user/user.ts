/* eslint-disable react-native/split-platform-components */
import {
  USER_AUTH_TOKEN,
  USER_LOGIN,
  USER_LOGOUT,
  USER_RECOVERY_PASSWORD,
  USER_ROLE_APPROVER,
} from "./user.const"
import { Alert, ToastAndroid } from "react-native"
import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { withEnvironment } from "../extensions/with-environment"
import * as storage from "../../utils/storage"

export const UserStoreModel = types
  .model("UserStore")
  .props({
    token: types.maybeNull(types.string),
    user: types.maybeNull(types.optional(types.frozen(), {})),
  })
  .extend(withEnvironment)
  .actions((self) => ({
    setLogin: (user, token) => {
      self.token = token
      self.user = user
    },
  }))
  .actions((self) => ({
    login: async ({ form, success, error }) => {
      const result = await self.environment.api.apisauce.post(USER_LOGIN, form)

      const data: any = result?.data

      if (data?.status) {
        if (data?.user?.get_role?.parameter_key === USER_ROLE_APPROVER) {
          self.setLogin(data.user, data.token)

          storage.saveString(USER_AUTH_TOKEN, data.token)
        } else {
          Alert.alert(
            "Error",
            `Usuario con rol ${data?.user?.get_role?.str_val} no puede iniciar sesión`,
          )
        }

        success()
      } else {
        Alert.alert("Error", data?.message || "Usuario o contraseña incorrectos")
        error()
      }
    },
    logout: async ({ success, error }) => {
      const result = await self.environment.api.apisauce.post(USER_LOGOUT)

      const data: any = result?.data

      if (data?.status) {
        self.setLogin(undefined, undefined)
        storage.remove(USER_AUTH_TOKEN)

        success()
      } else {
        Alert.alert("Error", data?.message || "Error al cerrar sesión")
        error()
      }
    },
    recoveryPassword: async ({ email, success, error }) => {
      const result = await self.environment.api.apisauce.post(USER_RECOVERY_PASSWORD, { email })

      const data: any = result?.data

      if (data?.status) {
        ToastAndroid.show(data?.message, ToastAndroid.SHORT)
        success()
      } else {
        Alert.alert("Error", data?.message || "Error al recuperar la contraseña")
        error()
      }
    },
  }))

type UserStoreType = Instance<typeof UserStoreModel>
export interface UserStore extends UserStoreType {}
type UserStoreSnapshotType = SnapshotOut<typeof UserStoreModel>
export interface UserStoreSnapshot extends UserStoreSnapshotType {}
export const createUserStoreDefaultModel = () => types.optional(UserStoreModel, {})
