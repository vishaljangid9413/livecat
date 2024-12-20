import { useState } from 'react';
import { colorMap, preDefinedStyleMap, styleMap, StyleArrayDataType } from './styleMap';

const useStyle = (initital: any) => {
  const [stateData, setStateData] = useState(undefined)
  const dataKey = JSON.stringify(initital)

  if ($Handler.shallowEqual(initital)) {
    $Handler.styleData[dataKey] = { ...initital }
    for (const [element, data] of Object.entries($Handler.styleData[dataKey])) {
      Object.assign($Handler.styleData[dataKey], $Handler.filter(element, data))

      $Handler.styleData[dataKey][element].update = function (data: StyleArrayDataType, isActive: boolean) {
        return applyStyle.bind({ element, func: 'update' }, undefined, data, isActive)();
      };
      // $Handler.styleData[dataKey][element].add = function (data: any, isActive: boolean) {
      //   return applyStyle.bind({ element, func:'add' }, undefined, data, isActive)();
      // };  
    }
    $Handler.styleData[dataKey].only = (data: StyleArrayDataType) => $Handler.filter(undefined, data)
  }

  function applyStyle(this: any, element: string | undefined, data: StyleArrayDataType, isActive: boolean): any {
    const currElement = element ?? this.element;
    const active = isActive ?? true

    // if(this?.func && this?.func === 'add'){
    //     return {...$Handler.styleData[dataKey][currElement], ...$Handler.filter(currElement, data, active, $Handler.styleData[dataKey])}
    // }
    if (!element && !$Handler.shallowStateEqual(data, active)) {
      Object.assign($Handler.styleData[dataKey], $Handler.filter(currElement, data, active, $Handler.styleData[dataKey]))
      setStateData({ ...$Handler.styleData[dataKey] })
    } else if (element) {
      Object.assign($Handler.styleData[dataKey], $Handler.filter(currElement, data, active, $Handler.styleData[dataKey]))
    }
    return $Handler.styleData[dataKey][currElement]
  }
  return [stateData ?? $Handler.styleData[dataKey], applyStyle];
};


const $Handler = {
  styleData: {} as any,
  tempStateData: [] as any,

  filter(element: string | undefined, data: any, isActive: boolean = true, inititalData?: any) {
    const filteredArray: any = { ...inititalData }
    for (const item of data) {
      if (typeof item === 'boolean'){
        continue // to allow conditioning
      }else if (typeof item === 'object') {
        this.ifObject(filteredArray, element, item, isActive)
      } else if (preDefinedStyleMap.hasOwnProperty(item)) {
        this.ifPredefinedStyle(filteredArray, element, item, isActive)
      } else if (item.includes('-')) {
        this.ifNormalStyle(filteredArray, element, item, isActive)
      }
    }
    return filteredArray
  },
  ifObject(filteredArray: any, element: string | undefined, item: any, isActive: boolean) {
    const filtered = Object.entries(item)
      .filter(([key, value]) =>
        isActive ?
          styleMap.hasOwnProperty(key) :
          !styleMap.hasOwnProperty(key)
      )
    if (element) {
      filteredArray[element] = { ...filteredArray[element], ...Object.fromEntries(filtered) };
    } else {
      Object.assign(filteredArray, Object.fromEntries(filtered))
    }
  },
  ifPredefinedStyle(filteredArray: any, element: string | undefined, item: any, isActive: boolean) {
    if (isActive) {
      if (element) {
        filteredArray[element] = { ...filteredArray[element], ...preDefinedStyleMap[item] };
      } else {
        Object.assign(filteredArray, preDefinedStyleMap[item])
      }
    } else if (element && !isActive) {
      for (const key in preDefinedStyleMap[item]) {
        delete filteredArray[element][key];
      }
    }
  },
  ifNormalStyle(filteredArray: any, element: string | undefined, item: any, isActive: boolean) {
    let [key, value] = item.split(/-(.+)/);

    if (!styleMap.hasOwnProperty(key)) return;
    if (isActive) {
      const hasNumber = /\d/.test(value);
      const hasFloat = /^[+-]?([0-9]+[.][0-9]+)$/.test(value);
      const hasLetter = /[a-zA-Z]/.test(value);

      if (value.includes('#')) {
        value.pop();
      } else if (colorMap.hasOwnProperty(value) || hasNumber && hasLetter) {
        value = colorMap[value]
      } else if (hasFloat) {
        value = parseFloat(value);
      } else if (!isNaN(Number(value))) {
        value = parseInt(value);
      }
      // } else if (hasNumber && hasLetter) {
      //   value = colorMap[value] 
      // }
      if (element) {
        filteredArray[element] = { ...filteredArray[element], [styleMap[key]]: value }
      } else {
        Object.assign(filteredArray, { [styleMap[key]]: value })
      }
    } else if (element && !isActive) {
      delete filteredArray[element][styleMap[key]]
    }
  },
  shallowEqual(obj: any) {
    const stringify = JSON.stringify(obj)
    if (!Object.keys(this.styleData).includes(stringify)) {
      return true
    } else {
      return false
    }
  },
  shallowStateEqual(obj: any, isActive: boolean) {
    const stringify = JSON.stringify(`${obj}_${isActive}`)
    if (this.tempStateData.includes(stringify)) {
      return true
    } else {
      this.tempStateData.push(stringify)
      return false
    }
  },
}

export default useStyle;


