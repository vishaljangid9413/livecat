import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { AuthStoreModel } from "./AuthStore"
import { OrderStoreModel } from "./OrderStore"

/**
 * A RootStore model.
 */
export const RootStoreModel = types.model("RootStore").props({
    authStore: types.optional(AuthStoreModel, {}),
    orderStore: types.optional(OrderStoreModel, {})
})

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}
/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}

