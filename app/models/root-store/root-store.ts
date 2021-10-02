import { CertificateStoreModel } from "../certificate/certificate"
import { CharacterStoreModel } from "../character-store/character-store"
import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { PurchaseStoreModel } from "../purchase/purchase"
import { UserStoreModel } from "../user/user"

/**
 * A RootStore model.
 */
// prettier-ignore
export const RootStoreModel = types.model("RootStore").props({
  certificateStore: types.optional(CertificateStoreModel, {}),
  characterStore: types.optional(CharacterStoreModel, {} as any),
  purchaseStore: types.optional(PurchaseStoreModel, {}),
  userStore: types.optional(UserStoreModel, {}),
})

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}

/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
