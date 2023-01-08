/**
 *
 */
export const sendReq = <I = any, O = any>(path: string, data?: I): Promise<O> =>
  fetch('http://localhost:4000' + path, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((rsp: Response) => {
    if (rsp.status >= 200 && rsp.status < 300) {
      return rsp.json()
    } else {
      throw new Error('Server crashed or something...')
    }
  })
