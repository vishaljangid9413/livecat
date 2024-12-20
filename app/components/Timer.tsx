import * as React from "react"
import { observer } from "mobx-react-lite"
import { Text } from "app/components/Text"

export interface TimerProps {
  count: number,
  style?: any,
  onComplete?:(value:boolean)=>void
}

/**
 * Describe your component here
 */
export const Timer = observer(React.forwardRef(function Timer(props: TimerProps, ref) {
  const { count, style, onComplete } = props
  const [timer, setTimer] = React.useState(count);

  const [isRunning, setIsRunning] = React.useState(false);

    const formatTime = (seconds:number) => {
      const minutes = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

    React.useEffect(() => {
        let intervalId:any;

        if (isRunning && timer > 0) {
            intervalId = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);
        }

        if (timer === 0 && isRunning) {
            setIsRunning(false); 
            onComplete?.(true); 
        }

        return () => clearInterval(intervalId);
    }, [timer, isRunning, onComplete]);

    React.useImperativeHandle(ref, () => ({
        start: () => setIsRunning(true),
        stop: () => setIsRunning(false),
        reset: () => {
            setIsRunning(false);
            setTimer(count);
        },
        restart: () => {
            setTimer(count);
            setIsRunning(true);
        },
    }));

  return <Text style={style}>{formatTime(timer)}</Text>
}))
