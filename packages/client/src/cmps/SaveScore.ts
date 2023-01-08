import {createElement as $, ChangeEvent, FC, useState} from 'react'
import {Portal} from './Portal'
import {css} from '@emotion/css'
import {addkey} from '../utils/addkey'
import {sendReq} from '../utils/sendReq'
/**
 *
 */
export const SaveScore: FC<{wpm: number; exit: () => void}> = ({wpm, exit}) => {
  const [username, usernameSet] = useState('')
  return $(Portal, {
    children: $('div', {
      onClick: (e: MouseEvent) => {
        // close the modal if click on shadow
        if (e.target === e.currentTarget) exit()
      },
      className: css({
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        background: 'hsla(0, 0%, 0%, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }),
      children: $('div', {
        className: css({
          width: 300,
          padding: 50,
          color: 'white',
          border: '2px solid black',
          background: 'hsl(0, 0%, 30%)',
          boxShadow: '0 0 25px 5px hsla(0, 0%, 0%, 0.3)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          textAlign: 'center',
        }),
        children: addkey([
          $('div', {
            children: 'You Got',
          }),
          $('div', {
            children: wpm,
            className: css({
              fontSize: 50,
            }),
          }),
          $('div', {
            children: 'Words Per Minute',
          }),
          $('input', {
            type: 'text',
            value: username,
            placeholder: 'Username',
            onChange: (e: ChangeEvent<HTMLInputElement>) => {
              usernameSet(e.target.value)
            },
            className: css({
              fontSize: 20,
              marginTop: 30,
              padding: '5px 10px',
              color: 'white',
              border: '2px solid black',
              background: 'hsla(0, 0%, 0%, 0.2)',
            }),
          }),
          $('button', {
            children: 'Save to High Scores',
            onClick: () => {
              if (!username.trim().length)
                return alert('Please provide a username.')
              sendReq('/save-score', {
                wpm,
                username,
              })
                .then(() => {
                  exit()
                  setTimeout(() => alert('Score saved.'))
                })
                .catch((err) => {
                  if (err?.message) alert('Error: ' + err.message)
                })
            },
            className: css({
              fontSize: 20,
              marginTop: 20,
              padding: '5px 10px',
              border: '2px solid black',
              background: 'hsla(0, 0%, 0%, 0.2)',
              color: 'white',
              '&:hover': {
                background: 'hsla(0, 0%, 0%, 0.4)',
              },
              '&:active': {
                background: 'hsla(0, 0%, 0%, 0.6)',
              },
            }),
          }),
        ]),
      }),
    }),
  })
}
