

function debounceFunc() {
    let timeoutId:any;
    return function (func:()=>void, time:number=0) {
      if (timeoutId) clearTimeout(timeoutId);
      if (time === 0){
        func.apply(this)
        return
      }
      timeoutId = setTimeout(() => {
        func.apply(this);
      }, time);
    };
  }


function throttleFunc() {
  let lastExecuted: number = 0;
  return function (func: () => void, time: number = 0) {
    const now = Date.now();
    if (now - lastExecuted >= time) {
      func.apply(this);
      lastExecuted = now;
    }
  };
}


export const debounce = debounceFunc();
export const throttle = throttleFunc();


// **  Abondoned Frontside Search Functionality
  // const showsData = useMemo(() => {
  //   if (!!getSearchText && data) {
  //     const filterData = data?.results.filter((item: any) => {
  //       return item?.title?.toLowerCase().includes(getSearchText.trim()) ||
  //       formatDate(item?.date)?.toLowerCase().includes(getSearchText.trim()) ||
  //       formatTime(item?.time)?.toLowerCase().includes(getSearchText.trim())
  //     })
  //     return filterData.length > 0 && filterData
  //   } else {
  //     return data?.results
  //   }
  // }, [getSearchText, data])

  // Memoize debounced fetch to ensure debounce only applied once
