import http from 'http'
import {config} from './config'
import {serve, RequestHandler, send, json} from 'micro'
import {getMongoDB} from './mongo'
/**
 *
 */
const addCORSHeaders = (handler: RequestHandler): RequestHandler => {
  return (req, res) => {
    const allowedAge = 60 * 60 * 24 // 24 hours
    const allowedMethods = ['POST', 'OPTIONS']
    const allowedHeaders = [
      'Access-Control-Allow-Origin',
      'Content-Type',
      'Authorization',
      'Accept',
    ]
    // change '*' from wildcard to your url when in production
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.setHeader('Access-Control-Allow-Methods', allowedMethods.join(','))
    res.setHeader('Access-Control-Allow-Headers', allowedHeaders.join(','))
    res.setHeader('Access-Control-Max-Age', String(allowedAge))
    return handler(req, res)
  }
}
/**
 *
 */
const api: RequestHandler = async (req, res) => {
  try {
    console.log(req.method, req.url)
    if (req.method === 'OPTIONS') return {}
    switch (req.url) {
      case '/robots.txt':
      case '/favicon.ico':
        return null
      case '/':
        return {now: Date.now()}
      case '/save-score': {
        let {wpm, username} = (await json(req)) as any
        if (typeof wpm !== 'number') throw new Error()
        if (typeof username !== 'string') throw new Error()
        username = username.trim()
        if (!username.length) throw new Error()
        const db = await getMongoDB()
        const $scores = db.collection('scores')
        $scores.insertOne({wpm, username, created: Date.now()})
        return {message: 'Thank you, come again.'}
      }
      case '/get-scores': {
        const db = await getMongoDB()
        const $scores = db.collection('scores')
        const data = await $scores
          .find({}, {limit: 25, sort: {wpm: -1}})
          .toArray()
        return data
      }
      default:
        throw new Error('Server endpoint does not exist.')
    }
  } catch (e: any) {
    send(res, 500, {message: e?.message})
  }
}
/**
 *
 */
const server = new http.Server(serve(addCORSHeaders(api)))
/**
 *
 */
server.listen(config.port, () => {
  console.log(`1️⃣  Server: http://localhost:${config.port}`)
})
