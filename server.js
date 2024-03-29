//expressを呼び出す
const express = require("express");

//express関数をインスタンス化
const app = express();

//routesディレクトリから呼び出す
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postsRoute = require("./routes/posts");
const uploadRoute = require("./routes/upload");
const  PORT = 4000;

const path = require("path");


//mongoDBと接続
const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.MONGOURL).then(() => {
    console.log('DBと接続中')
}).catch((err) => {
    console.log(err)
})



//ミドルウェアの設定
app.use("/images", express.static(path.join(__dirname, "public/images")))
app.use(express.json());
app.use("/api/users" , userRoute);
app.use("/api/auth" , authRoute);
app.use("/api/posts" , postsRoute);
app.use("/api/upload" , uploadRoute);


//ブラウザを立ち上げる
app.get("/" , (req, res) => {
    res.send('Hello Express');
})
// app.get("/users" , (req, res) => {
//     res.send('Users');
// })

//サーバーを立ち上げる
app.listen(PORT, () => console.log("サーバーが起動しました"))