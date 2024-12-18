import { errorHandler } from "../utils/error.js"
import Comment from '../Models/comment.model.js'

 
 export const CreateComment = async (req, res, next) => {
      
    const { content, postId, userId } = req.body
    
    try {

        if ( userId !== req.user.id ){
          return next(errorHandler(403,'You are Not allow to post a comment'))
       }

       const newComment = new Comment({
            userId,
            postId,
            content
        })
        
        await newComment.save()

        res.status(200).json(newComment)
    } catch (error) {
        next(error);
    }
}

 export const getComment = async (req, res, next) => {
    try {
         const comment = await Comment.find({ postId: req.params.postId }).sort({
          createdAt: -1,  
        })

        res.status(200).json(comment)
    } catch (error) {
       next(error)  
    }

 }

 export const likeComment = async (req, res, next) => {
     try {
        const comment = await Comment.findById(req.params.commentId);
        if(!comment) {
            return next(errorHandler(404, 'Comment Not Found'))
        }

        const userIndex = comment.likes.indexOf(req.user.id);
          if(userIndex === -1) {
            comment.likes.push(req.user.id)
            comment.numberOfLikes += 1
          } else {
            comment.numberOfLikes -= 1
            comment.likes.splice(userIndex, 1)
          }

          await comment.save()
          res.status(200).json(comment)
    } catch (error) {
        next(error)
    }

 }

 export const EditComment = async (req, res, next) => {
      try {

        const comment = await Comment.findById(req.params.commentId);
        if(!comment) {
            return next(errorHandler(404, 'Comment Not Found'))
        }

        if(comment.userId !== req.user.id && req.user.isAdmin === false) {
          return next(errorHandler(404, 'You are not allowed to edit this comment'))
        }

        const editcomment = await Comment.findByIdAndUpdate(req.params.commentId, {
          content: req.body.content,
        },
          {new: true}
    );


    res.status(200).json(editcomment)
         
      } catch (error) {
        next(error)
      }
 }


 export const deleteComment = async (req, res, next) => {
     try {

      const comment = await Comment.findById(req.params.commentId);
      if(!comment) {
          return next(errorHandler(404, 'Comment Not Found'))
      }

      if(comment.userId !== req.user.id && req.user.isAdmin === false) {
        return next(errorHandler(404, 'You are not allowed to delete this comment'))
      }
        await Comment.findByIdAndDelete(req.params.commentId)
        res.status(200).json('Comment has been deleted');
     } catch (error) {
       next(error)
     }
 }

 export const getComments = async (req, res, next) => {

  if(!req.user.isAdmin){
    next(errorHandler(404, "You can't get the comment"))
  }

     try {
      const startIndex = parseInt(req.query.startIndex) || 0;
      const limit = parseInt(req.query.limit) || 9;
      const sortDirection = req.query.sort === 'asc' ? 1 : -1

       const comments = await Comment.find()
        .sort({ updatedAt: sortDirection })
        .skip(startIndex)
        .limit(limit)
        .populate('userId')

        const totalComments = await Comment.countDocuments()

        const now = new Date();

        const oneMonthAgo = new Date(
          now.getFullYear(),
          now.getMonth() -1,
          now.getDate()
        );
    const lastMonthComments = await Comment.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });
    res.status(200).json({
      comments,
      totalComments,
      lastMonthComments
    })
     } catch (error) {
      next(error)
     } 

 }