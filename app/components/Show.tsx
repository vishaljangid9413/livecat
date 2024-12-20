import * as React from "react"
import { observer } from "mobx-react-lite"

export interface ConditionalComponentProps {
  condition: boolean
  children: [React.ReactNode, React.ReactNode] | React.ReactNode // Expect two children
}

/**
 * A ConditionalComponent that behaves like a ternary operator.
 * If `condition` is true, it renders the first child; otherwise, it renders the second.
 */
export const ConditionalComponent = observer(function ConditionalComponent(props: ConditionalComponentProps) {
  const { condition, children } = props
  
  if (Array.isArray(children) && children.length > 2) {
    return children
  }else if (Array.isArray(children) && children.length === 2) {
    return (
      <>
        {condition ? children[0] : children[1]}
      </>
    )
  }else{
    return condition && children
  }

})
