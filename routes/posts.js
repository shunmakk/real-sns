const router = require("express").Router();
const { promiseHooks } = require("v8");
const Post = require("../models/Post");
const { findById } = require("../models/User");
const User = require("../models/User");


//投稿を作成する
router.post("/" , async (req,res)  => {
    const newPost = new Post(req.body);
    try{
        const savedPost = await newPost.save();
        return res.status(200).json(savedPost);
    }
    catch(err){
       return res.status(500).json(err)
    }
})

//投稿を更新する
router.put("/:id" , async (req,res) => {
   try{
    const post = await Post.findById(req.params.id);
    if(post.userId === req.body.userId){
        await post.updateOne({
            $set: req.body,
        });
        return res.status(200).json('あなたは投稿の編集に成功しました')
    }
    else{
        return res.status(403).json('あなたは他のユーザーの投稿を編集できません')
    }
   }
   catch(err){
    return res.status(403).json(err)
   }
})

//投稿を削除する
router.delete("/:id" , async (req,res) => {
    try{
     const post = await Post.findById(req.params.id);
     if(post.userId === req.body.userId){
         await post.deleteOne({
             $set: req.body,
         });
         return res.status(200).json('あなたは投稿の削除に成功しました')
     }
     else{
         return res.status(403).json('あなたは他のユーザーの投稿を削除できません')
     }
    }
    catch(err){
     return res.status(403).json(err)
    }
 })

 //投稿を取得する
 router.get("/:id" , async (req,res) => {
    try{
     const post = await Post.findById(req.params.id);
     return res.status(200).json(post)
    }
    catch(err){
     return res.status(403).json(err)
    }
 })


 //特定の投稿にいいねを押す
 router.put("/:id/like" , async (req, res) => {
      try{
       const post = await Post.findById(req.params.id);
       //まだいいねを押していなかったら
       if(!post.likes.includes(req.body.userId)){
          await post.updateOne({
              $push: {
                  likes: req.body.userId,
              }
          });
          return res.status(200).json('投稿にいいねを押しました！')
      } 
      //既にいいねを押されていたら
      else {
          //いいねしているユーザーのidを取り除く
          await post.updateOne({
              $pull: {
              likes: req.body.userId
             },
           });

        return  res.status(403).json('投稿にいいねを外しました')
      }
      }
      catch(err){
       return res.status(500).json(err);
      }
 })


 //タイムラインを取得するAPI
router.get("/timeline/:userId", async (req, res) => {
    try {
      const currentUser = await User.findById(req.params.userId);
      const userPosts = await Post.find({ userId: currentUser._id });
      const friendPosts = await Promise.all(
        currentUser.followings.map((friendId) => {
          return Post.find({ userId: friendId });
        })
      );
      res.status(200).json(userPosts.concat(...friendPosts));
    } catch (err) {
      res.status(500).json(err);
    }
  });
  



// router.get(("/"), (req, res) => {
//     res.send('posts router')
// })


module.exports = router;