import dotenv from 'dotenv'
import mongoose from 'mongoose'
import beautifyUnique from 'mongoose-beautiful-unique-validation'

dotenv.config()

const Schema = mongoose.Schema
mongoose.connect(process.env.DBURL)
mongoose.plugin(beautifyUnique)

const userSchema = new Schema({
  name:{
    type:String,
    minlength: [1, '名稱必須1個字以上'],
    maxlength: [30, '名稱必須少於30個字'],
    required: [true, '請輸入名稱']
  },
  account: {
    type: String,
    minlength: [4, '帳號必須4個字以上'],
    maxlength: [15, '帳號必須少於15個字'],
    unique: '帳號已使用',
    required: [true, '請輸入帳號']
  },
  password: {
    type: String,
    required: [true, '請輸入密碼']
  }
}, {
  versionKey: false
})

// 這裡要修改成 >> 紀錄使用者的計時器的資料表
const fileSchema = new Schema({
  user: {
    type: String,
    required: [true, '沒有使用者名稱']
  },
  description: {
    type: String,
    maxlength: [200, '說明必須少於200個字']
  },
  name: {
    type: String,
    required: [true, '沒有檔案名稱']
  }
}, {
  versionKey: false
})

const users = mongoose.model(process.env.COLLECTION_USER, userSchema)
const files = mongoose.model(process.env.COLLECTION_FILE, fileSchema)
const connection = mongoose.connection

export default {
  users,
  files,
  connection
}
