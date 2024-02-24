const { resolve } = require("path");
const User = require("../models/User");

const router = require("express").Router();


//CRUD操作
//ユーザー情報の更新
router.put("/:id" ,async(req, res)=> {
  if(req.body.userId === req.params.id || req.body.isAdmin){
    try{
      const user = await User.findByIdAndUpdate(req.params.id, {
          $set:  req.body,
      });
      res.status(200).json("ユーザー情報が更新されました")
    }
    catch(err){
      return res.status(500).json(err);
    }
  }
  else{
      return res.status(403).json("あなたは自分のアカウントの情報のみ更新することができます")
  }
})




//ユーザー情報の削除



//ユーザー情報の取得





// router.get(("/"), (req, res) => {
//     res.send('user router')
// })


module.exports = router;