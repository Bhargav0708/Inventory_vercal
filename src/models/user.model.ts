import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  CreatedAt,
  UpdatedAt,
  AllowNull,
  BeforeValidate,
  HasMany,
  ForeignKey,
  BelongsToMany,
} from "sequelize-typescript";
import { Product } from "./product.model";
import { Addresses } from "./address.model";
import { Purchaseorders } from "./purchase_order.model";
import { Sequelize } from "sequelize";
import { Roles } from "./role.model";
import { userRole } from "./userRole.model";

@Table({ tableName: "Users", timestamps: true, paranoid: true })
export class User extends Model<User> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    // validate: {
    //   len: [6, 15],
    // },
  })
  password!: string;
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    validate: {
      len: [10, 10], // This won't work with INTEGER, so you can use a custom validator
      isInt: true, // Ensure that the value is an integer
      min: 1000000000, // Minimum 10-digit number
      max: 9999999999, // Maximum 10-digit number
    },
  })
  phone!: number;
  // @Column({
  //   type: DataType.ENUM("customer", "supplier", "admin"),
  //   allowNull: false,
  // })
  // role!: "customer" | "supplier" | "admin";

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  customertype?: string;
  @CreatedAt
  @Column({
    field: "createdAt",
  })
  createdAt?: Date;
  @UpdatedAt
  @Column({
    field: "updatedAt",
  })
  updatedAt?: Date;
  @ForeignKey(() => Addresses)
  @Column({
    type: DataType.INTEGER,
  })
  addressid!: number;
  // @BeforeValidate
  // static validateCustomerType(instance: User) {
  //   if (instance.role === "customer") {
  //     if (!instance.customertype || instance.customertype.trim() === "") {
  //       throw new Error("Customer type is required when role is customer");
  //     }
  //   }
  // }
  @HasMany(() => Product)
  product!: Product[];

  @HasMany(() => Addresses)
  addresses!: Addresses[];

  @HasMany(() => Purchaseorders)
  purchaseorders!: Purchaseorders[];

  @BelongsToMany(() => Roles, () => userRole)
  Roles!: Roles[];
}
