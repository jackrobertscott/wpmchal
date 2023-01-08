import {FC, ReactNode, useEffect, useState} from 'react'
import {createPortal} from 'react-dom'
/**
 *
 */
export const Portal: FC<{
  id?: string
  children: ReactNode
}> = ({id = 'portal', children}) => {
  const [dom, domSet] = useState(document.getElementById(id))
  useEffect(() => {
    if (!dom)
      setTimeout(() => {
        const dom = document.getElementById(id)
        if (!dom) throw new Error('Failed to find DOM element for portal.')
        domSet(dom)
      })
  }, [dom, id])
  return dom ? createPortal(children, dom) : null
}
