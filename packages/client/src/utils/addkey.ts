import {createElement as $, ReactNode, Fragment} from 'react'
/**
 *
 */
export const addkey = (chdrn: ReactNode[]): ReactNode[] => {
  return chdrn.map((child, index) => {
    return $(Fragment, {
      key: index.toString(),
      children: child,
    })
  })
}
