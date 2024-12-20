import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { User } from "./User"
import AsyncStorage from "@react-native-async-storage/async-storage"



interface Profile {
  id:number,
  user: User,
  facebook?: URL,
  instagram?: URL,
  linkedin?: URL,
  youtube?: URL,
  website: URL,
  whatsapp: URL,
  telegram: URL,
  blog: URL,
  e_card: string,
  photo: string
}


export const AuthStoreModel = types
  .model("AuthStore")
  .props({
    token: types.maybeNull(types.string),
    user: types.maybeNull(types.frozen<User>()),
    profile: types.maybeNull(types.frozen<Profile>()),
    searchString: types.maybeNull(types.string),
  })
  .actions(withSetPropAction)
  .views((self) => ({
    get isAuthenticated() {
      return !!self.token
    },
    get getUser() {
      return self.user
    },
    get getProfile() {
      return self.profile
    },
    get isSeller(){
      return self.user?.role === 'seller'
    },
    get getSearchText(){
      return self.searchString
    }
  }))
  .actions((self) => ({
    setToken(value:string){
      self.token = value
    },
    async clearToken(){
      self.setProp('token', '')
      self.setProp('user', null)
      self.setProp('profile', null)
      await AsyncStorage.removeItem('token');
    },
    setSearchText(text:string){
      self.setProp('searchString',text?.toLowerCase().trim())
    },
    clearSearchText(){
      self.setProp('searchString',"")
    }
  }))

export interface AuthStore extends Instance<typeof AuthStoreModel> { }
export interface AuthStoreSnapshotOut extends SnapshotOut<typeof AuthStoreModel> { }
export interface AuthStoreSnapshotIn extends SnapshotIn<typeof AuthStoreModel> { }
export const createAuthStoreDefaultModel = () => types.optional(AuthStoreModel, {})
