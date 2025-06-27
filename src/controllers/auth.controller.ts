import { Request, Response } from "express";
import { authService } from "../services/auth.services";
import { verify } from "crypto";
import { customError } from "../helpers/customError";

export const authController = {
  async Permission(req: Request, res: Response) {
    try {
      const permission_name = req.body.permission_name;
      const role_name = req.body.role_name;
      const permission = await authService.Permission(
        permission_name,
        role_name
      );
      if (permission) {
        res.json({ msg: "Successful Permission" });
      } else {
        res.json({ msg: "Not done" });
      }
    } catch (error) {
      console.log(error);
    }
  },
  // async migration(req: Request, res: Response) {
  //   try {
  //     const migration = await authService.migration();
  //     console.log("migraation", migration);
  //     if (migration) {
  //       res.json({ msg: "Success" });
  //     } else {
  //       res.json({ msg: "error" });
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // },
  async create(req: Request, res: Response) {
    try {
      console.log("the req.body", req.body);
      const usertoken = await authService.create(req.body);
      console.log(usertoken);
      res.status(201).json({ token: usertoken });
    } catch (error) {
      console.log(error);
      if (error instanceof customError) {
        if (error.errorKey == "INVALID_EMAIL") {
          res.status(400).json({
            success: false,
            errorKey: error.errorKey,
            error: error.errorMessage,
          });
        } else if (error.errorKey == "USER_EXISTS") {
          res.status(400).json({
            success: false,
            errorKey: error.errorKey,
            error: error.errorMessage,
          });
        } else if (error.errorKey == "CUSTOMER_TYPE_REQUIRED") {
          res.status(400).json({
            success: false,
            errorKey: error.errorKey,
            error: error.errorMessage,
          });
        }
      }
    }
  },
  async verify(req: Request, res: Response) {
    try {
      const verifiedotp = await authService.verifyOTP(req.body);
      if (verifiedotp!) {
        res.status(200).json({
          data: null,
          msg: "Your Otp has been verifried",
        });
      }
    } catch (error) {
      console.log(error);
      if (error instanceof customError) {
        if (error.errorKey === "USER_NOT_FOUND") {
          res.status(404).json({
            success: false,
            errorKey: error.errorKey,
            error: error.errorMessage,
          });
        } else if (error.errorKey === "OTP_INVALID") {
          res.status(400).json({
            success: false,
            errorKey: error.errorKey,
            error: error.errorMessage,
          });
        } else if (error.errorKey === "OTP_EXPIRED") {
          res.status(400).json({
            success: false,
            errorKey: error.errorKey,
            error: error.errorMessage,
          });
        } else if (error.errorKey === "TOKEN_MISSING") {
          res.status(401).json({
            success: false,
            errorKey: error.errorKey,
            error: error.errorMessage,
          });
        }
      }
    }
  },
  async login(req: Request, res: Response) {
    try {
      const user = await authService.login(req.body);
      console.log("is valid", user);
      res.cookie("login_token", user);
      res.status(201).json({
        data: user,
        msg: "Login Successfully",
      });
    } catch (error) {
      console.log(error);
      if (error instanceof customError) {
        if (error.errorKey === "USER_NOT_FOUND") {
          res.status(404).json({
            success: false,
            errorKey: error.errorKey,
            error: error.errorMessage,
          });
        } else if (error.errorKey === "OTP_INVALID") {
          res.status(400).json({
            success: false,
            errorKey: error.errorKey,
            error: error.errorMessage,
          });
        } else if (error.errorKey === "OTP_EXPIRED") {
          res.status(400).json({
            success: false,
            errorKey: error.errorKey,
            error: error.errorMessage,
          });
        } else if (error.errorKey === "ROLE_MISMATCHING") {
          res.status(400).json({
            success: false,
            errorKey: error.errorKey,
            error: error.errorMessage,
          });
        } else if (error.errorKey === "YOUR_ROLE_NOT_FOUND") {
          res.status(400).json({
            success: false,
            errorKey: error.errorKey,
            error: error.errorMessage,
          });
        }
      }
    }
  },
  async regenreate(req: Request, res: Response) {
    try {
      const newOTP = await authService.regenerateOtp(req.body);
      console.log("this is the new OTP genreated", newOTP);
    } catch (error) {
      console.log(error);
    }
  },
  async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        throw new customError("ID_NAN", "Please Enter ID IN Number ");
      }
      // console.log("the file of the user_profile", req.file);
      // if (req.file === undefined || req.file.path === undefined) {
      //   throw new customError(
      //     "FILE_REQUIRED",
      //     "Please Enter the Product Image "
      //   );
      // }
      // console.log(path)
      // const path = req.file!.path;
      const updated_user_info = await authService.update(req.body, id);
      if (updated_user_info!.length > 0) {
        res.status(200).json({
          data: updated_user_info,
          msg: " User Info updated succesfully",
        });
      } else {
        res.status(200).json({
          data: null,
          msg: "User Info is Not Updated ",
        });
      }
    } catch (error) {
      console.log(error);
      if (error instanceof customError) {
        if (error.errorKey == "ID_NAN") {
          res.status(400).json({
            success: false,
            errorKey: error.errorKey,
            error: error.errorMessage,
          });
        } else if (error.errorKey == "FIELD_CANT_CHANGE") {
          res.status(400).json({
            success: false,
            errorKey: error.errorKey,
            error: error.errorMessage,
          });
        }
      }
    }
  },
  async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        throw new customError("ID_NAN", "Please Enter ID IN Number ");
      }
      const deletedUser = await authService.delete(id);
      console.log("this is the deleted user service response", deletedUser);
      if (deletedUser! > 0) {
        res.status(200).json({
          data: deletedUser,
          msg: "The data is succesfully deleted ",
        });
      } else {
        res.status(200).json({
          data: null,
          msg: "User is not deleted",
        });
      }
    } catch (error) {
      console.log(error);
      if (error instanceof customError) {
        if (error.errorKey == "ID_NAN") {
          res.status(400).json({
            success: false,
            errorKey: error.errorKey,
            error: error.errorMessage,
          });
        } else if (error.errorKey == "USER_NOT_FOUND") {
          res.status(404).json({
            success: false,
            errorKey: error.errorKey,
            error: error.errorMessage,
          });
        }
      }
    }
  },
};
// {
