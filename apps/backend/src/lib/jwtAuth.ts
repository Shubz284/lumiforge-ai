// import type { Request, Response } from "express";
// import { signinSchema, signupSchema } from "../schema/schema";
// import { ErrorResponse, SuccessResponse } from "../utility/ApiResponse";
// import {prisma} from "../../db"
// import { password } from "bun";
// import * as jose from "jose";

// const signup = async (req: Request, res: Response) => {
//   const parsedData = signupSchema.safeParse(req.body);

//   if (!parsedData.success) {
//     return res.status(400).json(ErrorResponse("INVALID_REQUEST"));
//   }
//   try {
//     const existingUser = await prisma.user.findUnique({
//       where: {
//         email: parsedData.data.email,
//       },
//     });

//     if (existingUser)
//       return res.status(400).json(ErrorResponse("USER_ALREADY_EXISTS"));

//     const hashedPassword = await password.hash(parsedData.data.password, {
//       algorithm: "bcrypt",
//       cost: 10,
//     });

//     const user = await prisma.user.create({
//       data: {
//         id: crypto.randomUUID(),
//         name: parsedData.data.name,
//         email: parsedData.data.email,
//         password: hashedPassword,
//       },
//       select: {
//         id: true,
//         name: true,
//         email: true,
//       },
//     });
//     res.status(201).json(SuccessResponse(user));
//   } catch (error: any) {
//     return res.status(500).json(ErrorResponse("SERVER_ERROR"));
//   }
// };

// const signin = async (req: Request, res: Response) => {
//   const parsedData = signinSchema.safeParse(req.body);

//   if (!parsedData.success) {
//     return res.status(400).json(ErrorResponse("INVALID_REQUEST"));
//   }

//   try {
//     const user = await prisma.user.findUnique({
//       where: {
//         email: parsedData.data.email,
//       },
//     });

//     if (!user) {
//       return res.status(401).json(ErrorResponse("INVALID_CREDENTIALS"));
//     }

//     if (!user.password) {
//       return res.status(401).json(ErrorResponse("INVALID_CREDENTIALS"));
//     }

//     const validPassword = await password.verify(
//       parsedData.data.password,
//       user.password,
//     );

//     if (!validPassword) {
//       return res.status(401).json(ErrorResponse("PASSWORD_DOES_NOT_MATCH"));
//     }

//     const secret = new TextEncoder().encode(process.env.JWT_SECRET);

//     const token = await new jose.SignJWT({
//       userId: user.id,
//       email: user.email,
//     })
//       .setProtectedHeader({ alg: "HS256" })
//       .setIssuedAt()
//       .setExpirationTime("7d")
//       .sign(secret);

//     return res.status(200).json(SuccessResponse({ token }));
//   } catch (error) {
//     return res.status(500).json(ErrorResponse("SERVER_ERROR"));
//   }
// };

// export { signin, signup };