import Post from "../Models/post.model.js"
import { errorHandler } from '../utils/error.js';

export const createPost = async (req, res, next) => {

    if(!req.user.isAdmin) {
        return next(errorHandler(403, 'You are not allow to Create a post'))
    }
    if(!req.body.title || !req.body.content) {
        return next(errorHandler(403, 'Please Field out all fields'))
    }
      if(req.body.content.length < 15) {
        return next(errorHandler(403, 'Content must be more than 15 words....'))
      }
    const slug = req.body.title
    .split(' ')
    .join('-')
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-!]/g, '-');

    const newPost = new Post ({
        ...req.body, slug, userId: req.user.id,
    })
    try {
        const savedPost = await newPost.save()
        res.status(200).json({savedPost})
    } catch ({error}) {
        next(error)
    }
} 

export const getposts = async (req, res, next) => {
    try {
        const startIndex = parseInt(req.query.startIndex) || 0
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.order === 'asc' ? 1 : -1

        const posts = await Post.find({
            ...(req.query.userId && {userId: req.query.userId}),
            ...(req.query.category && {category: req.query.category}),
            ...(req.query.slug && {slug: req.query.slug}),
            ...(req.query.postId && {_id: req.query.postId}),
            ...(req.query.searchTerm && {
                $or: [
                {title: { $regex: req.query.searchTerm, $options: 'i' }},
                {content: { $regex: req.query.searchTerm, $options: 'i' }},
            ],    
         }),
                
        })
        .sort({ updatedAt: sortDirection})
        .skip(startIndex)
        .limit(limit)
        .populate('userId')

          const totalPosts = await Post.countDocuments();
           
          const now = new Date();

          const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() -1,
            now.getDate()
          );
      const lastMonthPosts = await Post.countDocuments({
        createdAt: { $gte: oneMonthAgo },
      });
      res.status(200).json({
        posts,
        totalPosts,
        lastMonthPosts
      })

    } catch (error) {
        next(error)
    }
}

export const deletepost = async (req, res, next) => {
        if( !req.user.isAdmin || req.user.id !== req.params.userId) {
            return next(errorHandler(403, 'You are not allowed to delete this post'))
        }
        try {
          await Post.findByIdAndDelete(req.params.postId);
          res.status(200).json('The post has been deleted')
        } catch (error) {
          next(rror)
        }
}

export const updatepost = async (req, res, next) => {
        if( !req.user.isAdmin || req.user.id !== req.params.userId) {
          return next(errorHandler(403, 'You are not allowed to delete this post'))
      }
      try {
         const updatedpost = await Post.findByIdAndUpdate(
          req.params.postId,
          {
            $set: {
                title: req.body.title,
                image: req.body.image,
                category: req.body.category,
                content: req.body.content,
            } 
          }, { new: true }
        )
        res.status(200).json(updatedpost)
      } catch (error) {
        next(error)
      }
}