import mongoose from 'mongoose';

export const validateUserData = (data) => {
  // Si `data` es null o no es un objeto, retornar el error correspondiente
  if (data === null || typeof data !== 'object') {
    return { isValid: false, message: "Datos inválidos: no es un objeto válido." };
  }

  // Validar `name` si está presente: debe ser una cadena no vacía
  if (data.hasOwnProperty('name')) {
    if (typeof data.name !== 'string' || data.name.trim().length === 0) {
      return { isValid: false, message: "El campo 'Nombre' no puede estar vacío." };
    }
  }

  // Validar `lastName` si está presente: debe ser una cadena no vacía
  if (data.hasOwnProperty('lastName')) {
    if (typeof data.lastName !== 'string' || data.lastName.trim().length === 0) {
      return { isValid: false, message: "El campo 'Apellido' no puede estar vacío." };
    }
  }

  // Validar `address` si está presente: debe ser una cadena no vacía
  if (data.hasOwnProperty('address')) {
    if (typeof data.address !== 'string' || data.address.trim().length === 0) {
      return { isValid: false, message: "El campo 'Dirección' no puede estar vacío." };
    }
  }

  // Validar `dni` si está presente: debe ser una cadena con al menos 10 dígitos
  if (data.hasOwnProperty('dni')) {
    if (typeof data.dni !== 'string') {
      return { isValid: false, message: "El campo 'DNI' es inválido." };
    } else {
      const dni = data.dni.trim();
      if (dni.length < 10 || !/^\d+$/.test(dni)) {
        return { isValid: false, message: "El campo 'DNI' debe contar con al menos 10 dígitos numéricos." };
      }
    }
  }

  // Validar `email` si está presente y no está vacío
  if (data.hasOwnProperty('email') && typeof data.email === 'string' && data.email.trim().length > 0) {
    if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(data.email)) {
      return { isValid: false, message: "El campo 'Email' debe tener un formato de email válido." };
    }
  }

  // Validar `phone` si está presente y no está vacío
  if (data.hasOwnProperty('phone') && data.phone.trim() !== '') {
    const phoneRegex = /^\+?(\d{1,4}[\s-]?)?(\(?\d{1,4}\)?[\s-]?)?[\d\s-]{7,15}$|^\d{7,15}$/;
    if (typeof data.phone !== 'string' || !phoneRegex.test(data.phone.trim())) {
      return { isValid: false, message: "El campo 'Teléfono' debe tener un formato válido con o sin código de país." };
    }
  }

  // Validar `isActive` si está presente: debe ser un booleano
  if (data.hasOwnProperty('isActive')) {
    if (typeof data.isActive !== 'boolean') {
      return { isValid: false, message: "El campo 'Activo' debe ser un booleano." };
    }
  }

  // Validar `role` si está presente: debe ser un ObjectId válido
  if (data.hasOwnProperty('role')) {
    if (!mongoose.Types.ObjectId.isValid(data.role) || typeof data.role !== 'string') {
      return { isValid: false, message: "El campo 'Rol' es inválido." };
    }
  }

  // Validar `_id` si está presente: debe ser un ID de MongoDB válido
  if (data.hasOwnProperty('_id')) {
    if (!mongoose.Types.ObjectId.isValid(data._id) || typeof data._id !== 'string') {
      return { isValid: false, message: "El campo 'ID' es inválido." };
    }
  }

  // Validar `password` si está presente: debe ser una cadena no vacía
  if (data.hasOwnProperty('password')) {
    if (typeof data.password !== 'string' || data.password.trim().length === 0) {
      return { isValid: false, message: "El campo 'Contraseña' no puede estar vacío." };
    }
  }

  // Validar `confirmPassword` si está presente: debe ser una cadena no vacía
  if (data.hasOwnProperty('confirmPassword')) {
    if (typeof data.confirmPassword !== 'string' || data.confirmPassword.trim().length === 0) {
      return { isValid: false, message: "El campo 'Confirmar Contraseña' no puede estar vacío." };
    }
  }

  return { isValid: true };
};
