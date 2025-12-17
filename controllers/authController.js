const express= require("express")
const {User} = require("../models/user")
const bcrypt = require("bcrypt")
const crypto = require("crypto")
const ErrorHandler = require("../middlewares/errorMiddleware")
const {catchAsyncErrors}= require("../middlewares/catchAsyncError")

export const register = catchAsyncErrors(async(req,res,next)=>{
    try {
        const{name,email,password}= req.body
    } catch (error) {
        
    }
})