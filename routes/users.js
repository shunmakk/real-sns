const { isObjectIdOrHexString } = require("mongoose");
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
router.delete("/:id" ,async(req, res)=> {
    if(req.body.userId === req.params.id || req.body.isAdmin){
      try{
        const user = await User.findByIdAndDelete(req.params.id);
        res.status(200).json("ユーザー情報が削除されました")
      }
      catch(err){
        return res.status(500).json(err);
      }
    }
    else{
        return res.status(403).json("あなたは自分のアカウントの情報のみ削除することができます")
    }
  })


//ユーザー情報の取得
// router.get("/:id" ,async(req, res)=> {
    
//       try{
//         const user = await User.findById(req.params.id);

//         //パスワードとupdateatを第三者に見られないようにする
//         const {password, updatedAt, ...others} = user._doc;

//         return res.status(200).json(others);
//       }
//       catch(err){
//         return res.status(500).json(err);
//       }
//   })


  //クエリでユーザー情報を取得
  router.get("/", async (req, res) => {
    const userId = req.query.userId;
    const username = req.query.username;
    try {
      const user = userId
        ? await User.findById(userId)
        : await User.findOne({ username: username });
      const { password, updatedAt, ...other } = user._doc;
      return res.status(200).json(other);
    } catch (err) {
      return res.status(500).json(err);
    }
  });


  //ユーザーのフォロー
  router.put("/:id/follow" , async (req, res) => {
      if(req.body.userId !== req.params.id){
        try{
        //相手のユーザーの情報を探す
         const user = await User.findById(req.params.id);
         const currentUser = await User.findById(req.body.userId);
         //フォロワーに自分がいなかったらフォローできる
         if(!user.followers.includes(req.body.userId)){
            await user.updateOne({
                $push: {
                    followers: req.body.userId,
                }
            })
            await currentUser.updateOne({
                $push : {
                    followings: req.params.id,
                }
            });
            return res.status(200).json('フォローに成功しました！')
        } else {
          return  res.status(403).json('あなたはすでにこのユーザーをフォローしています')
        }
        }
        catch(err){
         return res.status(500).json(err);
        }

      }
      else{
          return res.status(500).json("自分のことはフォローできません")
      }
  })

  //ユーザーのフォローを外す
  router.put("/:id/unfollow" , async (req, res) => {
    if(req.body.userId !== req.params.id){
      try{
      //相手のユーザーの情報を探す
       const user = await User.findById(req.params.id);
       const currentUser = await User.findById(req.body.userId);
       //フォロワーにいたらフォロワーを探す
       if(user.followers.includes(req.body.userId)){
          await user.updateOne({
              $pull: {
                  followers: req.body.userId,
              }
          })
          await currentUser.updateOne({
              $pull : {
                  followings: req.params.id,
              }
          });
          return res.status(200).json('フォロー解除しました')
      } else {
        return  res.status(403).json('このユーザーはフォロー解除できません')
      }
      }
      catch(err){
       return res.status(500).json(err);
      }

    }
    else{
        return res.status(500).json("自分のことはフォロー解除できません")
    }
})





// router.get(("/"), (req, res) => {
//     res.send('user router')
// })


module.exports = router;