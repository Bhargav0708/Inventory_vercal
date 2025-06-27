import express from "express";
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload, TokenExpiredError } from "jsonwebtoken";
import { ResultSetHeader } from "mysql2";
import { customError } from "../helpers/customError";
// import { CustomJwtPayload } from "../../types/auth";
interface CustomJwtPayload extends JwtPayload {
  role: string;
}

export const verifyToken = (role: Array<string>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // const token = req.cookies("login_token");
    const token = req.cookies.login_token;
    try {
      if (!token) {
        // res.status(401).redirect("/login");
        throw new customError(
          "TOKEN_MISSING",
          "The token is missing please provide the token"
        );
      }
      const data = jwt.verify(token, "Bhargav@12345") as CustomJwtPayload;
      // console.log(data);
      console.log("this is a data", data);
      //   if(!role.includes((data.role)){
      //     return res.json({msg :"Access Denied"})

      //   }
      if (!role.includes(data.role)) {
        // return res.redirect("/login");
        // new Error("Your role must be supplier ");
        throw new customError(
          "NOT_AUTHORIZED",
          "Your role must be supplier or admin"
        );
        // res.json({ msg: "Your role is not Supplier" });
      }
      req.user = data;
      next();
    } catch (error) {
      console.log(error);
      if (error instanceof customError) {
        // throw error;
        if (error.errorKey == "TOKEN_MISSING") {
          res.status(400).json({
            success: false,
            errorKey: error.errorKey,
            error: error.errorMessage,
          });
        } else if (error.errorKey == "NOT_AUTHORIZED") {
          res.status(400).json({
            success: false,
            errorKey: error.errorKey,
            error: error.errorMessage,
          });
        }
      } else if (error instanceof TokenExpiredError) {
        res.status(400).json({
          success: false,
          errorKey: "TOKEN_EXPIRED",
          errorMessage: "Token has expired. Please log in again.",
        });
      }
    }
  };
};
// export const verifyTokenrole2 = (
//   role1: Array<string>,
//   role2: Array<string>
// ) => {
//   return async (req: Request, res: Response, next: NextFunction) => {
//     // const token = req.cookies("login_token");
//     const token = req.cookies.login_token;
//     try {
//       if (!token) {
//         // res.status(401).redirect("/login");
//         throw new customError(
//           "TOKEN_MISSING",
//           "The token is missing please provide the token"
//         );
//       }

//       const data = jwt.verify(token, "Bhargav@12345") as CustomJwtPayload;
//       console.log("this is a data", data);
//       //   if(!role.includes((data.role)){
//       //     return res.json({msg :"Access Denied"})

//       //   }
//       console.log("this is data role", data.role);
//       if (!role1.includes(data.role) || !role2.includes(data.role)) {
//         // return res.redirect("/login");
//         // new Error("Your role must be supplier ");
//         throw new customError(
//           "ACTION_NOT_GIVEN",
//           "Your role must be supplier or admin"
//         );
//         // res.json({ msg: "Your role is not Supplier" });
//       }
//       req.user = data;
//       next();
//     } catch (error) {
//       console.log(error);
//       if (error instanceof customError) {
//         throw error;
//       } else if (error instanceof TokenExpiredError) {
//         return {
//           success: false,
//           errorKey: "TOKEN_EXPIRED",
//           errorMessage: "Token has expired. Please log in again.",
//         };
//       }
//     }
//   };
// };
