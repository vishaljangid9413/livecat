import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { SuccessToast } from "app/utils/formValidation"

interface SavedOrders {
  id:number,
  User:string,
  SKU:string,
  Quantity:string
}

export const OrderStoreModel = types
  .model("OrderStore")
  .props({
    savedOrders: types.optional(types.array(types.frozen<SavedOrders>()), []),
  })
  .actions(withSetPropAction)
  .views((self) => ({
    get getSavedOrders(){
      return self.savedOrders
    }
  })) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    addOrder(data:SavedOrders){
      self.setProp('savedOrders', [{...data, 'id': (self.savedOrders.length + 1)}, ...self.savedOrders])
    },
    removeOrder(id:number){
      self.setProp('savedOrders', self.savedOrders.filter((item:any)=>item?.id !== id))
    },
    clearOrders(data?:Array<SavedOrders>){
        self.setProp('savedOrders', data ?? [])
    }
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface OrderStore extends Instance<typeof OrderStoreModel> {}
export interface OrderStoreSnapshotOut extends SnapshotOut<typeof OrderStoreModel> {}
export interface OrderStoreSnapshotIn extends SnapshotIn<typeof OrderStoreModel> {}
export const createOrderStoreDefaultModel = () => types.optional(OrderStoreModel, {})
