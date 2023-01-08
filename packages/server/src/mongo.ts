import {MongoClient} from 'mongodb'
import {config} from './config'
/**
 *
 */
let cachedClient: MongoClient
/**
 *
 */
export const getMongoDB = async () => {
  if (!cachedClient) cachedClient = await MongoClient.connect(config.mongodbUri)
  return cachedClient.db(config.mongodbName)
}
