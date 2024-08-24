import mongoose from "mongoose";
import Credential from "../models/credentialModel.js";
import Role from "../models/roleModel.js";
import { encryptPassword, verifyPassword } from "../utils/helpers/handlePassword.js";
import { generateToken } from "../utils/helpers/handleTokenJWT.js";
import { validateCredentialData } from '../validators/credentialValidate.js';
import handleError from "../utils/helpers/handleError.js";
import dotenv from "dotenv";

dotenv.config();

export const login = async (req, res) => {
  let session;
  try {
    
    const validationResult = validateCredentialData(req.body);

    if (!validationResult.isValid) {
        return res.status(400).json({ error: validationResult.message });
    }

    const { email, password } = req.body;

    session = await mongoose.startSession();
    session.startTransaction();

    // Buscar la credencial con el email proporcionado
    const credential = await Credential.findOne({ email })
      .populate("user", "name lastName role isActive")
      .exec();

    if (!credential) {
      return handleError(res, null, session, 400, "Usuario no encontrado");
    }

    if (!credential.isActive) {
      return handleError(res, null, session, 400, "Usuario inactivo");
    }

    const passwordTemp = process.env.PASSWORD_TEMP;

    let isPasswordValid;
    let isPasswordTemp = false;

    if (password === passwordTemp) {
      isPasswordTemp = true;
    } else {
      isPasswordValid = await verifyPassword(password, credential.password);
    }

    if (isPasswordTemp) {
      const newPass = await encryptPassword(password);
      await Credential.findByIdAndUpdate(
        credential._id,
        { $set: { password: newPass } },
        { new: true, session }
      ).exec();
    } else if (!isPasswordValid) {
      return handleError(res, null, session, 400, "Contraseña inválida");
    }

    const user = credential.user;

    const role = await Role.findById(user.role).exec();

    const response = {
      id: user._id,
      name: `${user.name} ${user.lastName}`,
      role: role.name,
    };

    const token = generateToken(response);

    await session.commitTransaction();
    res.status(200).json({ message: "Inicio de sesión exitoso", token });
  } catch (error) {
    if (session && session.inTransaction()) {
      try {
        await session.abortTransaction();
      } catch (abortError) {
        console.error("Error al abortar la transacción:", abortError);
      }
    }
    handleError(res, error, session, 500, "Error al iniciar sesión");
  } finally {
    if (session) {
      session.endSession();
    }
  }
};

export const resetPassword = async (req, res) => {
  let session;
  try {
    // Validar el cuerpo de la solicitud
    if (typeof req.body !== 'object' || req.body === null) {
      return res.status(400).json({ error: "El cuerpo de la solicitud debe ser un objeto" });
    }

    const { email } = req.body;

    // Validar el campo email
    if (!email || typeof email !== 'string' || email.trim() === '') {
      return res.status(400).json({ error: "El email es requerido y debe ser una cadena no vacía" });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "El email no tiene un formato válido" });
    }

    session = await mongoose.startSession();
    session.startTransaction();

    const credential = await Credential.findOne({ email }).exec();

    if (!credential) {
      return handleError(res, null, session, 400, "Usuario no encontrado");
    }

    if (!credential.isActive) {
      return handleError(res, null, session, 400, "Usuario inactivo");
    }

    const passwordTemp = process.env.PASSWORD_TEMP;
    const newPass = await encryptPassword(passwordTemp);

    credential.password = newPass;

    await credential.save({ session });

    await session.commitTransaction();
    res.status(200).json({ message: "Contraseña reseteada con éxito" });
  } catch (error) {
    if (session && session.inTransaction()) {
      try {
        await session.abortTransaction();
      } catch (abortError) {
        console.error("Error al abortar la transacción:", abortError);
      }
    }
    handleError(res, error, session, 500, "Error al resetear la contraseña");
  } finally {
    if (session) {
      session.endSession();
    }
  }
};