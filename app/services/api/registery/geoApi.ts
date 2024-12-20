import { CallParamsApi, ExecutableFunctionType } from "./api.types";

export interface GeographyAPIType {
    timezone: ExecutableFunctionType;
    zipcode: ExecutableFunctionType;
}

export const GeographyAPI:GeographyAPIType = {
    timezone: ({ call, props }) => {
        const data: CallParamsApi = {
          url: 'timezone/',
          meta: {
            errorMessage: "Unable to fetch timezones!"
          }
        };
        call({ ...data, ...props })
      },
    zipcode: ({ call, urlSuffix, props }) => {
        const data: CallParamsApi = {
          url: 'zipcode/' + urlSuffix,
        };
        call({ ...data, ...props })
      },
}

