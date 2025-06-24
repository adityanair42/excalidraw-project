import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { middleware } from "./middleware";
import { CreateUserSchema, SigninSchema, CreateRoomSchema } from "@repo/common/types";
import { prismaClient } from "@repo/db/client";

const app = express();
app.use(express.json());

app.post("/signup", async (req, res) => {

  const parsedData = CreateUserSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.json({
      message: "Incorrect Inputs"
    })
    return
  }

  try {
    const user = await prismaClient.user.create({
      data: {
        email: parsedData.data?.username,
        //hash the password
        password: parsedData.data.password,
        name: parsedData.data.name
      }

    })
    res.json({
      userId: user.id
    })
  } catch (e) {
    res.status(411).json({
      message: "User already exists with this undername"
    })
  }

})

app.post("/signin", async (req, res) => {

  const parsedData = SigninSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.json({
      message: "Incorrect Inputs"
    })
    return;
  }

  //compare the hashed passwords here
  const user = await prismaClient.user.findFirst({
    where: {
      email: parsedData.data.username,
      password: parsedData.data.password
    }
  })

  if (!user) {
    res.status(403).json({
      message: "NOt authorized"
    })
    return
  }

  const token = jwt.sign({
    userId: user?.id
  }, JWT_SECRET);

  res.json({
    token
  })


})

app.post("/room", middleware, async (req, res) => {

  const parsedData = CreateRoomSchema.safeParse(req.body);
  console.log(parsedData)
  if (!parsedData.success) {
    res.json({
      message: "Incorrect Inputs"
    })
    return
  }

  //@ts-ignore
  const userId = req.userId;

  try{
    const room = await prismaClient.room.create({
    data: {
      slug: parsedData.data.name,
      adminId: userId
    }
  })

  res.json({
    roomId: room.id
  })
  } catch(e){
    res.status(411).json({
      message: "Room alreadye exists with ths name"
    })
  }
})

app.listen(3001);