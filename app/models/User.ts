import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"

/**
 * Model description here for TypeScript hints.
 */
export const UserModel = types
  .model("User")
  .props({
    id: types.maybe(types.number), 
    full_name: types.maybe(types.string),
    email: types.maybe(types.string),
    mobile: types.maybe(types.string),
    mpin: types.maybe(types.string),
    time_zone: types.maybe(types.string),
    address: types.maybe(types.string),
    zipcode: types.maybeNull(types.string),
    role: types.maybeNull(types.string),
    language: types.maybe(types.string),
    theme: types.maybe(types.string),
    notification: types.boolean,
    // is_active: types.boolean,
    // is_staff: types.boolean,
    // profile: types.frozen<UserProfile>(),
  })
  .actions(withSetPropAction)
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface User extends Instance<typeof UserModel> {}
export interface UserSnapshotOut extends SnapshotOut<typeof UserModel> {}
export interface UserSnapshotIn extends SnapshotIn<typeof UserModel> {}
export const createUserDefaultModel = () => types.optional(UserModel, {})
