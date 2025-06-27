import { JwtPayload } from "jsonwebtoken";
import { genrateToken, isValidEmail, verifyToken } from "../../utils/auth";
import { mailsend } from "../../utils/mailer";
import { OTP } from "../models/otp.model";
import { User } from "../models/user.model";
import { authRepository } from "../repositeries/auth.repositry";
import bcrypt from "bcrypt";
import { throwDeprecation } from "process";
import { customError } from "../helpers/customError";
import { userRole } from "../models/userRole.model";
interface verification {
  email: string;
  otp: number;
  token: string;
}
interface userUpdation {
  name: string;
  email: string;
  password: string;
  phone: number;
}
export interface UserData {
  name?: string;
  email: string;
  password?: string;
  phone?: number;
  role: Array<string>;
  customertype: string;
  id?: number;
}
export interface loginData {
  email: string;
  password: string;
  role: Array<string>;
  id: number;
}
export const authService = {
  async Permission(data: string, data2: Array<string>) {
    try {
      const permission = await authRepository.Permission(data, data2);
      return permission;
    } catch (error) {
      console.log(error);
    }
  },
  // async migration() {
  //   try {
  //     const migration = await authRepository.migrationofrole();
  //     return migration;
  //   } catch (error) {
  //     console.log(error);
  //   }
  // },
  async create(data: UserData): Promise<string> {
    try {
      const hasedpassword = await bcrypt.hash(data.password!, 12);
      const email = data.email;

      if (!isValidEmail(data.email)) {
        throw new customError(
          "INVALID_EMAIL",
          "Please provide a valid email address."
        );
      }
      //
      const emailExists = await authRepository.getUser(email);
      console.log("the user is exists", emailExists);
      if (emailExists) {
        throw new customError(
          "USER_EXISTS",
          "User aleready Exists Please Register With Another Email"
        );
      }
      console.log("this is the data in the user create service", data);

      const roleCheck = data.role;
      if (roleCheck.includes("customer")) {
        if (!data.customertype) {
          throw new customError(
            "CUSTOMER_TYPE_REQUIRED",
            "you should be enter customer type beacuse your role is customer or in multiple role your one of role is customer"
          );
        }
      }
      const bodydata = {
        name: data.name,
        email: data.email,
        password: hasedpassword,
        phone: data.phone,
        role: data.role,
        customertype: data.customertype,
      };
      const OTP = Math.floor((999999 - 100000) * Math.random() + 100000);

      const otpdata = {
        otp: OTP,
        email: data.email,
      };

      const datatootp = await authRepository.storeOtp(otpdata as OTP);
      console.log("the data otp result in auth services", datatootp);

      const token = genrateToken(bodydata as UserData);
      console.log("the token data", token);
      mailsend(
        data.email,
        "Your Verification",
        OTP,
        "Mail is for OTP And Register Verification"
      );

      return token;
    } catch (error) {
      console.log(error);
      if (error instanceof customError) {
        throw error;
      }
      throw error;
    }
  },

  async verifyOTP(data: verification) {
    try {
      const otp2 = data.otp;
      const email = data.email;
      const token = data.token;
      const verify = await authRepository.verifyOTP(
        otp2 as number,
        email as string
      );
      console.log("the verify", verify);
      // console.log(verify?.status!);
      if (verify == "Otp_invalid") {
        throw new customError("OTP_INVALID", "The Otp Is Invalid ");
      } else if (verify == "expired") {
        // throw new Error("OTP is expired");
        const result = await this.regenerateOtp(email);
        console.log("the result is this ", result);
        if (result.dataValues) {
          throw new customError(
            "OTP_EXPIRED",
            "The Otp is Expired the new otp has been sent to the email"
          );
        }
      } else {
        const body = (await verifyToken(token)) as JwtPayload;
        const datatobesent = {
          name: body.name,
          email: body.email,
          password: body.password,
          phone: body.phone,
          role: body.role,
          customertype: body.customertype,
        };

        const datatotable = await authRepository.create(
          datatobesent as UserData
        );
        console.log("data to table", datatotable);
        return datatotable;
      }
    } catch (error) {
      if (error instanceof customError) {
        throw error;
      }
      console.log(error);
    }
  },
  async login(data: UserData) {
    const email: string = data.email;
    const password = data.password;
    const role: Array<string> = data.role;
    let Role_match = false;
    // const id: number = data.id;

    const userData = await authRepository.getUser(email as string);

    // console.log;
    //role checking
    const Rolechecking = await authRepository.getrole(email);
    if (Array.isArray(role)) {
      Role_match = role.includes(Rolechecking!);
    } else {
      Role_match = role == Rolechecking;
    }
    if (!Role_match) {
      throw new customError(
        "ROLE_MISMATCHING",
        "Your Entered role is not mismatching"
      );
    }
    // if (Rolechecking) {

    // if()?
    // }

    console.log("the rolechecking", Rolechecking);
    console.log("this is the data of user data which is loggedin", userData);

    if (!userData) {
      // throw new Error("user Does Not Exist");
      throw new customError(
        "USER_NOT_FOUND",
        "User is Not found in please Register Your Self"
      );
    }
    try {
      const validation = await bcrypt.compare(
        password!,
        userData.dataValues.password
      );
      const userid = userData.id;
      console.log("this is id in login service ", userid);
      if (validation) {
        const loginbody = {
          email: email,
          role: role,
          id: userid,
        };
        const login_token = genrateToken(loginbody as UserData);
        console.log("this is a login_token", login_token);
        return login_token;
      } else {
        return "user is not valid check email and password again";
      }
    } catch (e) {
      console.log(e);
      // if (e instanceof customError) {
      //   throw e;
      // }
    }
  },
  async regenerateOtp(email: string) {
    try {
      const user = await authRepository.getUserinRegenreate(email);
      if (!user) {
        throw new customError("USER_NOT_FOUND", "User does not exist.");
      }

      const newOtp = Math.floor(100000 + Math.random() * 900000);
      const otpPayload = {
        email,
        otp: newOtp,
      };

      const result = await authRepository.storeOtp(otpPayload as OTP);
      console.log("New OTP stored:", result);

      mailsend(
        email,
        "OTP Regeneration",
        newOtp,
        "This is your regenerated OTP"
      );
      console.log(result);
      return result;
    } catch (error) {
      console.log(error);
      if (error instanceof customError) {
        throw error;
      }
      throw new customError("SERVER_ERROR", "Error while regenerating OTP.");
    }
  },
  async update(data: User, id: number) {
    try {
      const UserExists = await authRepository.getUserByid(id);
      // const hasedpassword = await bcrypt.hash(data.password, 12);
      if (data.password) {
        // return hasedpassword;
        data.password = await bcrypt.hash(data.password, 12);
      }
      // console.log("this is in data", data);
      if (!UserExists) {
        throw new customError("USER_NOT_FOUND", "User does not exist.");
      } else {
        if ("role" in data || "id" in data) {
          throw new customError(
            "FIELD_CANT_CHANGE",
            "Please dont enter the role and id that is not changable"
          );
        }
        console.log("this is a data", data);
        const updateedUser = await authRepository.update(data, id);
        return updateedUser;
      }
    } catch (error) {
      console.log(error);
      if (error instanceof customError) {
        throw error;
      }
    }
  },
  async delete(id: number) {
    const deleteduser = await authRepository.delete(id);
    return deleteduser;
  },
};
