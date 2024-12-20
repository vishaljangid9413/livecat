import { useEffect, useRef } from 'react';



function useEffectAfterMount(effect:()=>void, dependencies:Array<any> = []) {
  const hasMounted = useRef(false);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    // Run the provided effect function after the first render
    effect();
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
}

export default useEffectAfterMount;
