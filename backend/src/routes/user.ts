import express  from "express";
import { signupBody,signinBody } from "../zod";
import { PrismaClient } from "@prisma/client";
import { sign } from "jsonwebtoken";
import { JWT_SECRET } from "../config";


const router = express.Router();
const prisma = new PrismaClient();

router.post('/signup', async(req,res) => {
    const {success} = signupBody.safeParse(req.body)
    if(!success){
        res.status(411).json({
            message: "Email already Taken/Incorrect Inputs"
        })
    }

    const existing_user = await prisma.user.findUnique({
        where: {
            email: req.body.email
        }
    })
    if(existing_user){
        res.status(411).json({
            message: "Email already Taken/Incorrect Inputs"
        })
    }
    const user = await prisma.user.create({
        data: {
            name:req.body.name,
            email:req.body.email,
            phone:req.body.phone,
            password:req.body.password,
            role:req.body.role
        }
    })
    console.log(user);
    const userId = user.id;

    const token = sign({userId},JWT_SECRET);

    res.status(200).json({
        message: "User Created Successfully",
        token:token
    })
})



router.post('/signin', async (req,res) => {
    const {success} = signinBody.safeParse(req.body);
    if(!success){
        res.status(411).json({
            message: "Email already Taken/Incorrect Inputs"
        })
    }

    const user = await prisma.user.findUnique({
        where: {
            email: req.body.email,
            password: req.body.password
        },
        select:{
            id:true,
            role: true
        }
    })
    if(!user) {
        res.status(403).json({
            message: "User Not Found / Incorrect Password"
        })
    }
    console.log(user);
    const userId = user?.id
    const token = sign({userId},JWT_SECRET);
    res.status(200).json({
        message: "Signin In",
        token:token,
        role:user?.role
    })
})

export default router