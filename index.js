import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import connectMongo from 'connect-mongo'
import session from 'express-session'
import multer from 'multer'
import md5 from 'md5'
import dotenv from 'dotenv'

import db from './db'

dotenv.config()

const MongoStore = connectMongo(session)

const app = express()

app.use(bodyParser.json())
app.use(cors({
  origin (origin, callback) {
    if (process.env.DEV) {
      // 開發環境，允許 (在開發中)
      callback(null, true)
    } else if (origin.includes('github')) {
      // 非開發環境，但是從 github 過來，允許
      callback(null, true)
    } else {
      // 不是開發環境，也不是從 github 過來，不允許
      callback(new Error('Not allowed'), false)
    }
  },
  credentials: true
}))

app.use(session({
  // 加密解密用的序號，隨便打就好
  secret: 'workout',
  // 將 session 存入 mongodb
  store: new MongoStore({
    // 使用 mongoose 的資料連接
    mongooseConnection: db.connection,
    // 設定要存入的 collection
    collection: process.env.COLLECTION_SESSION
  }),
  // session 有效期間
  cookie: {
    // 登入狀態 30 mins
    maxAge: 1000 * 60 * 30
  },
  saveUninitialized: false,
  // 是否每次重設過期時間
  rolling: true
}))

app.listen(process.env.PORT, () => {
  console.log('已經啟動了哦')
})
