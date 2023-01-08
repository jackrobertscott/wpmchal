import {css} from '@emotion/css'
import {
  createElement as $,
  ChangeEvent,
  FC,
  useEffect,
  useRef,
  useState,
} from 'react'
import {addkey} from './utils/addkey'
import {getRandomWords} from './utils/words'
/**
 *
 */
export const App: FC<{}> = () => {
  const [txt, txtSet] = useState('')
  const [usrTxt, usrTxtSet] = useState('')
  const refInput = useRef<HTMLInputElement>()
  const retry = () => {
    txtSet(getRandomWords(50).join(' '))
    usrTxtSet('')
  }
  useEffect(() => {
    retry()
    refInput.current?.focus()
  }, [])
  return $('div', {
    onClick: () => {
      refInput.current?.focus()
      console.log('focused')
    },
    className: css({
      width: '100%',
      height: '100%',
      background: 'hsl(0, 0%, 30%)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }),
    children: $('div', {
      className: css({
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 50,
        width: 700,
        padding: 20,
        maxWidth: '100%',
        border: '2px dashed black',
      }),
      children: addkey([
        $('input', {
          ref: refInput,
          value: usrTxt,
          onChange: (e: ChangeEvent<HTMLInputElement>) => {
            usrTxtSet(e.target.value)
          },
          className: css({
            position: 'absolute',
            opacity: 0, // hide the input
          }),
        }),
        $('div', {
          className: css({
            fontSize: 20,
            color: 'hsl(0, 0%, 70%)',
            '.okay': {
              color: 'hsl(0, 0%, 100%)',
            },
            '.error': {
              color: 'hsl(0, 100%, 50%)',
            },
            '.cursor': {
              background: 'hsl(0, 0%, 10%)',
            },
          }),
          children: txt.split('').map((i, index) => {
            return $('span', {
              key: index,
              children: i,
              className: [
                usrTxt.length > index
                  ? usrTxt[index] === i
                    ? 'okay'
                    : 'error'
                  : undefined,
                usrTxt.length === index ? 'cursor' : undefined,
              ]
                .filter(Boolean)
                .join(' '),
            })
          }),
        }),
        $('button', {
          children: 'Retry',
          onClick: () => retry(),
          className: css({
            padding: '10px 15px',
            background: 'hsl(0, 0%, 30%)',
            border: '2px solid black',
          }),
        }),
      ]),
    }),
  })
}
