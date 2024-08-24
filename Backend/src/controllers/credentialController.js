import mongoose from 'mongoose';
import Credential from '../models/credentialModel.js';
import handleError from '../utils/helpers/handleError.js';
import { encryptPassword, verifyPassword } from '../utils/helpers/handlePassword.js';
import { validateCredentialData } from '../validators/credentialValidate.js';

// Actualizar una credencial
export const updateCredentialPassword = async (req, res) => {
  let session;
  try {

    const validationResult = validateCredentialData(req.body);

    if (!validationResult.isValid) {
      return res.status(400).json({ error: validationResult.message });
    }

    session = await mongoose.startSession();
    session.startTransaction();

    const { id } = req.params;
    const { password, newPassword, confirmPassword } = req.body;

    const credential = await Credential.findOne({ user: id }).exec();

    if (!credential) {
      await session.abortTransaction();
      return handleError(res, null, session, 404, 'Credencial no encontrada');
    }

    if (password && !(await verifyPassword(password, credential.password))) {
      await session.abortTransaction();
      return handleError(res, null, session, 400, 'La contraseña actual es incorrecta');
    }

    if (newPassword && newPassword !== confirmPassword) {
      await session.abortTransaction();
      return handleError(res, null, session, 400, 'Las nuevas contraseñas no coinciden');
    }

    const updatedFields = {};

    if (newPassword) {
      updatedFields.password = await encryptPassword(newPassword);
    }

    const updatedCredential = await Credential.findByIdAndUpdate(credential._id, { $set: updatedFields }, { new: true, session }).exec();

    // await saveAuditEntry({
    //   eventType: 'UPDATE',
    //   documentId: id,
    //   documentCollection: 'Credential',
    //   userId: req.currentUser,
    //   changes: generateChanges(credential.toObject(), updatedCredential.toObject())
    // });

    await session.commitTransaction();
    res.status(200).json({ data: updatedCredential, message: 'Credencial actualizada con éxito' });
  } catch (error) {
    if (session && session.inTransaction()) {
      try {
        await session.abortTransaction();
      } catch (abortError) {
        console.error('Error al abortar la transacción:', abortError);
      }
    }
    handleError(res, error, session, 500, 'Error al actualizar la credencial');
  } finally {
    if (session) {
      session.endSession();
    }
  }
};

// Actualizar el estado de una credencial
export const updateCredentialStatus = async (req, res) => {
  try {

    const validationResult = validateCredentialData(req.body);

    if (!validationResult.isValid) {
      return res.status(400).json({ error: validationResult.message });
    }

    const { _id, isActive } = req.body;
    
    const credentialUser = await Credential.findOne({ user: _id }).exec();

    if (!credentialUser) {
      return res.status(404).json({ error: "Credencial no encontrada" });
    }

    const credential = await Credential.findByIdAndUpdate(credentialUser._id, { isActive }, { new: true }).exec();

    const successMessage = isActive ? "Credencial activada con éxito" : "Credencial desactivada con éxito";
    res.status(200).json({ message: successMessage, data: credential });
  } catch (error) {
    handleError(res, error);
  }
};
