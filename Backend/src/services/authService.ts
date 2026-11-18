import bcrypt from "bcrypt";
import { prisma } from "../config/prisma";
import { generateToken } from "../utils/jwt";

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: "PHOTOGRAPHER" | "CLIENT";
}

interface LoginData {
  email: string;
  password: string;
}

export const registerUser = async (data: RegisterData) => {
  const { name, email, password, role } = data;

  // cek apakah email sudah digunakan
  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw new Error("Email already exists");
  }

  // hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // simpan user
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
    },
  });
// Hapus password dari objek sebelum dikembalikan ke response
  const { password: _, ...userWithOutPassword } = user
  return userWithOutPassword
};


export const loginUser = async (data: LoginData) => {
  const { email, password } = data;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    user.password
  );

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }


   
  const token = generateToken({
    id: user.id,
    role: user.role,
  });

  //Hapus password dari objek user sebelum dikembalikan 
  const {password : _, ...userWithOutPassword} = user

 return {
   user : userWithOutPassword,
   token
 }
};