import User from '../models/user.model.js';
import {errorHandler} from '../utils/error.js';

export const getUsers = async (req, res, next) => {
    // console.log(req.user.isAdmin); 
  // if(!req.user.isAdmin){
  //   return next(errorHandler(403, 'You are not allowed to view all users'))
  // }
  try{
    const startIndex=parseInt(req.query.startIndex) || 0
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === 'asc' ? 1 : -1;

    const users = await User.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

      const usersWithoutPassword = users.map((user) => {
        const { password, ...rest } = user._doc;
        return rest;
      })

      res.status(200).json({
        users:usersWithoutPassword,
      })
  }
  catch(err){
    next(err)
  }                                               
}

export const getUser = async (req, res, next) => {
  try{
    const user=await User.findById(req.params.userId)
    if(!user){
      return next(errorHandler(404,'User not found'))
    
    }
    const {password,...rest}=user._doc
    res.status(200).json(rest)
  }
  catch(err){
    next(err)
  }
}