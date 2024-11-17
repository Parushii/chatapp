import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import {errorHandler} from '../utils/error.js'

export const signup=async(req,res,next)=>{
    const {username,email,password}=req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    if (!username || !email || !password) {
        return next(errorHandler(400, 'All fields are required'));
    }
    const hashedPassword=bcryptjs.hashSync(password,10)

    const newUser=new User(
        {username,
        email,
        password:hashedPassword,
    }
    )
    try{
    await newUser.save();
    res.json("Signup successful!")
    }
    catch(error){
        res.status(500).json({
            message:error.message
        })
    }
}
export const signin=async(req,res,next)=>{
    const {email,password}=req.body;
    if(!email || !password){
        next(errorHandler(400,'All fields required'))
    }
    try{
        const validUser=await User.findOne({email})
        if(!validUser){
            return next(errorHandler(404,'User not found'))
        }
        const validPassword=bcryptjs.compareSync(password,validUser.password)
        if(!validPassword){
            return next(errorHandler(404,'Invalid username or password'))
        }

        const token=jwt.sign(
            {id:validUser._id, isAdmin: validUser.isAdmin },process.env.JWT_SECRET,{ expiresIn: '1d' } 
        )
        const {password:pass,...rest}=validUser._doc;

        res.status(200).cookie('access_token',token,{
            httpOnly: true,
            sameSite: 'Lax', // Use 'Lax' or 'Strict' if they are on the same origin
            secure: false, // Set to true only over HTTPS
        }).json({...rest,token})
    }   
    catch(error){
        res.status(500).json({
            message:error.message
        })
    }
}

export const signout = (req, res, next) => {
    try {
      res
        .clearCookie('access_token')
        .status(200)
        .json('User has been signed out');
    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }
  };