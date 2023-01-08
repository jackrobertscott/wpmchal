import {css} from '@emotion/css'
import {
  createElement as $,
  ChangeEvent,
  FC,
  useEffect,
  useRef,
  useState,
} from 'react'
import {addkey} from '../utils/addkey'
import {getRandomWords} from '../utils/words'
import {HighScores} from './HighScores'
import {SaveScore} from './SaveScore'
/**
 *
 */
export const App: FC<{}> = () => {
  const [txt, txtSet] = useState('')
  const [usrTxt, usrTxtSet] = useState('')
  const [wpm, wpmSet] = useState<number>()
  const [, reloadSet] = useState(Date.now())
  const [shwSave, shwSaveSet] = useState(false)
  const [timeStart, timeStartSet] = useState<number>()
  const refInput = useRef<HTMLInputElement>()
  const retry = () => {
    setTimeout(() => {
      refInput.current?.focus()
      reloadSet(Date.now())
    })
    txtSet(getRandomWords(10).join(' '))
    usrTxtSet('')
  }
  /**
   * Add text when the component mounts.
   */
  useEffect(() => {
    retry()
  }, [])
  /**
   * Listen to the user text change and detect when user finishes passage.
   */
  useEffect(() => {
    if (timeStart && usrTxt.length >= txt.length && txt.length !== 0) {
      const time = (Date.now() - timeStart) / 1000
      const usrArr = usrTxt.split(' ')
      const correctArr = txt
        .split(' ')
        .filter((i, index) => i === usrArr[index])
      const charCorrect = correctArr.join('').length + (correctArr.length - 1)
      const wpmTmp = (60 / time) * (charCorrect / 5)
      wpmSet(Math.trunc(wpmTmp * 100) / 100)
      shwSaveSet(true)
      timeStartSet(undefined)
    }
  }, [usrTxt.length]) // eslint-disable-line
  return $('div', {
    onClick: () => {
      reloadSet(Date.now())
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
        /**
         * A hidden input which is where the user's input will be collected.
         * The reason I've used an input is so that all keyboard events are collected
         * such as when you press "Alt+Backspace" which will delete a whole word.
         */
        $('input', {
          ref: refInput,
          value: usrTxt,
          onChange: (e: ChangeEvent<HTMLInputElement>) => {
            if (usrTxt.length === 0) timeStartSet(Date.now())
            usrTxtSet(e.target.value)
          },
          className: css({
            position: 'absolute',
            opacity: 0, // hide the input
          }),
        }),
        /**
         * Show the passage of text. Each character is wrapped in a span which
         * will give it color.
         */
        $('div', {
          /**
           * Focus the input whenever the user clicks on the element.
           */
          onClick: () => {
            if (document.activeElement !== refInput.current) {
              refInput.current?.focus()
              reloadSet(Date.now())
            }
          },
          className: css({
            fontSize: 20,
            color: 'hsl(0, 0%, 70%)',
            '.okay': {
              color: 'hsl(0, 0%, 100%)',
            },
            '.error': {
              color: 'hsl(0, 100%, 50%)',
            },
            '.cursor': document.activeElement === refInput.current && {
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
        /**
         * Simple retry button.
         */
        $('button', {
          children: 'Retry',
          onClick: () => retry(),
          className: css({
            padding: '10px 15px',
            background: 'hsl(0, 0%, 30%)',
            border: '2px solid black',
          }),
        }),
        /**
         * WPM Reading.
         */
        $('div', {
          children: 'Last wpm: ' + wpm,
        }),
        /**
         *
         */
        $(HighScores, {
          reload: shwSave,
        }),
        /**
         *
         */
        shwSave &&
          !!wpm &&
          $(SaveScore, {
            wpm,
            exit: () => {
              shwSaveSet(false)
              retry()
            },
          }),
      ]),
    }),
  })
}
