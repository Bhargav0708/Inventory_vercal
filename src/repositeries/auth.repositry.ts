// import { User } from "../models";
import { compare } from "bcrypt";
import { User } from "../models/user.model";
import { OTP } from "../models/otp.model";
import { Op, where } from "sequelize";
import { customError } from "../helpers/customError";
import { sequelize } from "../config/database";
import { Roles } from "../models/role.model";
import { userRole } from "../models/userRole.model";
import { Permission } from "../models/permission.model";
import { RolePermisson } from "../models/rolepermission.model";
import { UserData } from "../services/auth.services";
// import{}
// import { bcrypt } from "bcrypt";
interface otpstore {
  otp: number;
  email: string;
}
interface userdata2 {
  name?: string;
  email: string;
  password?: string;
  phone?: number;
  role?: Array<string>;
  customertype?: string;
}
export const authRepository = {
  // async Permission() {
  //   const t = await sequelize.transaction();
  //   try {
  //   } catch (error) {
  //     console.log(error);
  //   }
  // },
  async Permission(permissionname: string, rolename: Array<string>) {
    const permission = await Permission.findOne({
      where: {
        permission_name: permissionname,
      },
    });
    const roles = await Roles.findAll({
      where: {
        role_name: rolename,
      },
    });
    for (const role of roles) {
      const result = await RolePermisson.findOrCreate({
        where: {
          roleid: role.roleid,
          permissionid: permission?.permissionid,
        },
      });
    }
    console.log(`✅ Assigned "${permissionname}" to roles:`, rolename);
    return true;
    // return result;
  },
  // export const assignPermissionToRoles = async (
  //   permissionName: string,
  //   description: string,
  //   roleNames: string[]
  // ) => {
  //   const [permission] = await Permission.findOrCreate({
  //     where: { name: permissionName },
  //     defaults: { description }
  //   });

  //   const roles = await Role.findAll({
  //     where: { name: roleNames }
  //   });

  // for (const role of roles) {
  //   await RolePermission.findOrCreate({
  //     where: {
  //       roleId: role.id,
  //       permissionId: permission.id
  //     }
  //   });
  // }

  //   console.log(`✅ Assigned "${permissionName}" to roles:`, roleNames);
  // };

  // async migrationofrole() {
  //   const t = await sequelize.transaction();
  //   try {
  //     const users = await User.findAll({ transaction: t });
  //     const userRoleResults: userRole[] = [];

  //     for (const user of users) {
  //       const role = user.role;
  //       const userId = user.id;

  //       const rolesid = await Roles.findOne({
  //         where: { role_name: role },
  //         transaction: t,
  //       });

  //       if (!rolesid) {
  //         throw new Error(`Role "${role}" not found for user ${userId}`);
  //       }

  //       const dataofuserroletable = {
  //         userid: userId,
  //         roleid: rolesid.roleid,
  //       };

  //       const userRoletable = await userRole.create(
  //         dataofuserroletable as userRole,
  //         { transaction: t }
  //       );

  //       userRoleResults.push(userRoletable);
  //     }

  //     await t.commit();
  //     return userRoleResults;
  //   } catch (error) {
  //     console.error("Migration failed:", error);
  //     await t.rollback();
  //     throw error;
  //   }
  // },

  async create(data: UserData) {
    console.log("body data in repo", data);
    const datatobesent = {
      name: data!.name,
      email: data.email,
      password: data!.password,
      phone: data!.phone,
      customertype: data!.customertype,
    };
    const user_create = await User.create(datatobesent as User);
    console.log("this is user_create", user_create);
    // cons;
    if (user_create) {
      const user_role = await Roles.findAll({
        where: {
          role_name: data.role,
        },
      });
      console.log("this is user_role", user_role);
      let count = 0;

      for (const role of user_role) {
        let resultobj = {
          userid: user_create.dataValues.id,
          roleid: role.dataValues.roleid,
        };
        let resultcount = await userRole.create(resultobj as userRole);
        console.log("this is result count", resultcount);
        if (resultcount) {
          count++;
        }
      }
      return count;
    }
  },
  async storeOtp(data: OTP) {
    console.log("the otp is", data);
    return await OTP.create(data);
  },
  async verifyOTP(otp2: number, email: string) {
    try {
      let status: string;
      const currentTime = new Date();
      const twoMinutesAgo = new Date(currentTime.getTime() - 2 * 60 * 1000);

      let otpcorrection = await OTP.findOne({
        where: {
          email: email,
          otp: otp2,
        },
      });
      if (!otpcorrection) {
        // statuss: "Otp_invalid",
        status = "Otp_invalid";
        return status;
      }

      let verifyotpwithtime = await OTP.findOne({
        where: {
          email: email,
          otp: otp2,
          createdAt: {
            // [Op.gt]: time,
            [Op.gte]: twoMinutesAgo,
          },
        },
      });
      console.log("verify with time", verifyotpwithtime);
      if (!verifyotpwithtime) {
        // throw new customError(
        //   "OTP_EXPIRED",
        //   "Otp is expired please genreate again and verify "
        // );

        // statuss: "expired",
        status = "expired";
        return status;
      } else {
        return verifyotpwithtime;
      }
    } catch (error) {
      console.log(error);
    }
  },
  // async getUser(email: string) {
  //   let user = await User.findOne({
  //     where: {
  //       email,
  //     },
  //     include: {
  //       model: Roles,
  //       as: "Roles",
  //       through: {
  //         attributes: {},
  //       },
  //     },
  //   });
  //   return user;
  // },
  async getUser(email: string) {
    return User.findOne({
      where: { email },
      include: [
        {
          model: Roles,
          as: "Roles",
          through: { attributes: [] },
        },
      ],
    });
  },
  async getUserinRegenreate(email: string) {
    let user = await OTP.findOne({
      where: {
        email,
      },
    });
    return user;
  },
  async getUserByid(id: number) {
    let user = await User.findOne({
      where: {
        id: id,
      },
    });
    return user;
  },
  async update(data: User, id: number) {
    try {
      const userid = id;

      const UserUpdatedInfo = await User.update(data, {
        where: {
          id: userid,
        },
      });
      return UserUpdatedInfo;
    } catch (error) {
      console.log(error);
    }
  },
  async delete(id: number) {
    const found_user = await User.findOne({
      where: {
        id: id,
      },
    });
    console.log("purchase Order_is not found in the repositry", found_user);
    if (!found_user) {
      throw new customError("USER_NOT_FOUND", "User Not Found to delete ");
    } else {
      const deleted_User = User.destroy({
        where: { id: id },
      });
      return deleted_User;
    }
  },
  async getrole(email: string) {
    try {
      const userid = await User.findOne({
        where: {
          email: email,
        },
      });
      if (userid) {
        const id = userid.id;
        const userrole = await userRole.findOne({
          where: {
            userid: id,
          },
        });
        if (userrole) {
          const roleid = userrole.roleid;
          const role = await Roles.findOne({
            where: {
              roleid: roleid,
            },
          });
          if (role) {
            const role_name = role.role_name;
            return role_name;
          }
        }
      } else {
        throw new customError("YOUR_ROLE_NOT_FOUND", "Your role is not found");
      }
    } catch (error) {
      console.log(error);
      if (error instanceof customError) {
        throw error;
      }
    }
  },
};
