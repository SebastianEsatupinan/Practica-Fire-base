import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  deleteUser,
  updateEmail,
  updatePassword,
} from "firebase/auth";
import { auth } from "./firebase";

async function signIn(email, password) {
  try {
    let userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    return user;
  } catch (error) {
    const errorMessage = error.message;
    throw new Error(errorMessage);
  }
}

async function signUp(email, password) {
  try {
    let userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("User created:", user);
    return user;
  } catch (error) {
    const errorMessage = error.message;
    console.error("Error creating user:", errorMessage);
    throw new Error(errorMessage);
  }
}

async function deleteUserAccount(user) {
  try {
    await deleteUser(user);
  } catch (error) {
    console.error("Error deleting user:", error);
  }
}

async function updateUserEmail(user, newEmail) {
  try {
    await updateEmail(user, newEmail);
  } catch (error) {
    console.error("Error updating email:", error);
  }
}

async function updateUserPassword(user, newPassword) {
  try {
    await updatePassword(user, newPassword);
  } catch (error) {
    console.error("Error updating password:", error);
  }
}

export { signIn, signUp, deleteUserAccount, updateUserEmail, updateUserPassword };
