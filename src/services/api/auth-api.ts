import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  type UserCredential,
} from "firebase/auth";
import { auth } from "../firebase/firebase";

export const registerUserApi = async (
  email: string,
  password: string
): Promise<UserCredential | null> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential;
  } catch (err) {
    console.error("Ошибка регистрации", err);
    return null;
  }
};

export const loginUserApi = async (
  email: string,
  password: string
): Promise<UserCredential | null> => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential;
  } catch (err) {
    console.error("Ошибка регистрации", err);
    return null;
  }
};

export const logoutUserApi = async () => {
  await signOut(auth);
};
