import { DummyApi, DummyApiType, AuthAPI, AuthAPIType } from "./authApi"
import { CustomerApi, CustomerAPIType } from "./customerApi"
import { CatalogueAPI, CatalogueAPIType } from "./catalogueApi"
import { VendorApi, VendorAPIType } from "./vendorApi"
import { LiveShowsApi, LiveShowsAPIType } from "./liveShowsApi"
import { OrderAPI, OrderAPIType } from "./orderApi"
import { GeographyAPI, GeographyAPIType } from "./geoApi"
import { AccountsAPI, AccountsAPIType } from "./accountsApi"

export interface rootApiType{
    auth:AuthAPIType
    catalogue:CatalogueAPIType
    vendor:VendorAPIType
    customer:CustomerAPIType
    liveshow:LiveShowsAPIType
    order:OrderAPIType
    account:AccountsAPIType
    geo:GeographyAPIType
    dummy:DummyApiType
}

export const rootApi = {
    auth:AuthAPI,
    catalogue:CatalogueAPI,
    vendor:VendorApi,
    customer:CustomerApi,
    liveshow:LiveShowsApi,
    order:OrderAPI,
    account:AccountsAPI,
    geo:GeographyAPI,
    dummy:DummyApi,
}
