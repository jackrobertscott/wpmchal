import {createElement as $, FC, useEffect, useState} from 'react'
import {addkey} from '../utils/addkey'
import {css} from '@emotion/css'
import {sendReq} from '../utils/sendReq'
/**
 *
 */
export const HighScores: FC<{
  reload: boolean
}> = ({reload}) => {
  const borderStyle = '1px solid black'
  const [scoreArr, scoreArrSet] =
    useState<{_id: string; wpm: number; username: string; created: number}[]>()
  useEffect(() => {
    sendReq('/get-scores')
      .then((data) => {
        scoreArrSet(data)
      })
      .catch((err) => {
        if (err?.message) alert('Error: ' + err.message)
      })
  }, [reload])
  return $('table', {
    className: css({
      width: '100%',
      border: borderStyle,
      borderCollapse: 'collapse',
      color: 'white',
      background: 'hsl(0, 0%, 25%)',
      thead: {
        background: 'hsl(0, 0%, 20%)',
      },
      tr: {
        td: {
          borderTop: borderStyle,
        },
      },
      'th, td': {
        padding: '5px 10px',
        '&:not(:last-child)': {
          borderRight: borderStyle,
        },
      },
    }),
    children: addkey([
      $('thead', {
        children: $('tr', {
          children: $('th', {
            children: 'High Scores',
            colSpan: 3,
          }),
        }),
      }),
      $('tbody', {
        children: scoreArr?.map((score) => {
          return $('tr', {
            key: score._id,
            children: addkey([
              $('td', {children: score.username}),
              $('td', {children: score.wpm + 'wpm'}),
              $('td', {
                children: new Date(score.created).toLocaleString('en', {
                  dateStyle: 'short',
                  timeStyle: 'short',
                }),
              }),
            ]),
          })
        }),
      }),
    ]),
  })
}
