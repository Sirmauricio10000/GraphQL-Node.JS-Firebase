// src/resolvers.js
import admin from 'firebase-admin';

const resolvers = {
  Query: {
    login: async (parent, args) => {
      try {
        const { id, pass } = args;

        // Obtener usuario por correo electrónico desde la base de datos
        const snapshot = await admin.database().ref(`usuarios/${id}`).once('value')
        .catch((error) => {
            console.error('Error al obtener usuario desde Firebase:', error);
            throw error;
        });

        const userData = snapshot.val();

        if (!userData) {
          throw new Error(`Usuario con ID ${id} no encontrado`);
        }

        if (userData.pass != pass){
          throw new Error(`Contraseña incorrecta`);
        } 

          return "Login Exitoso";

      } catch (error){
        console.error('Error al logearse:', error);
        throw error;
      }
    }, 
    users: async () => {
      try {
        // Lógica para obtener todos los usuarios desde Firebase
        const snapshot = await admin.database().ref('usuarios').once('value');
        const data = snapshot.val();

        // Convertir el objeto de datos a un array de usuarios
        const users = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));

        return users;
      } catch (error) {
        console.error('Error al obtener usuarios desde Firebase:', error);
        throw error;
      }
    },
    user: async (parent, args) => {
      try {
        const userId = args.id.toString(); // Convertir a cadena
        const snapshot = await admin.database().ref(`usuarios/${userId}`).once('value')
        .catch((error) => {
            console.error('Error al obtener usuario desde Firebase:', error);
            throw error;
        });
        
        const userData = snapshot.val();

        if (!userData) {
          throw new Error(`Usuario con ID ${userId} no encontrado`);
        }

        // Devolver el usuario encontrado
        return {
          id: userId,
          ...userData,
        };
      } catch (error) {
        console.error('Error al obtener usuario desde Firebase:', error);
        throw error;
      }
    },
  },
  Mutation: {
    updateUserBalance: async (parent, args) => {
      try {
        const userId = args.id.toString(); // Convertir a cadena
        const newBalance = args.newBalance.toString(); // Convertir a cadena
        const userRef = admin.database().ref(`usuarios/${userId}`);

        // Actualizar el saldo del usuario en la base de datos de Firebase
        await userRef.update({ saldo: newBalance });

        // Obtener el usuario actualizado y devolverlo
        const snapshot = await userRef.once('value');
        const userData = snapshot.val();

        if (!userData) {
          throw new Error(`Usuario con ID ${userId} no encontrado`);
        }

        return {
          id: userId,
          ...userData,
        };
      } catch (error) {
        console.error('Error al actualizar saldo del usuario en Firebase:', error);
        throw error;
      }
    },
    createUser: async (parent, args) => {
      try {
        const { id, email, name, ti, pass } = args;
        const newBalance = "0"; // Saldo preestablecido a 0

        // Crear el nuevo usuario en la base de datos de Firebase
        const newUserRef = admin.database().ref(`usuarios/${id}`);
        await newUserRef.set({
          id,
          email,
          name,
          ti,
          pass,
          saldo: newBalance,
        });

        // Obtener el usuario recién creado y devolverlo
        const snapshot = await newUserRef.once('value');
        const userData = snapshot.val();

        return {
          id,
          ...userData,
        };
      } catch (error) {
        console.error('Error al crear un nuevo usuario en Firebase:', error);
        throw error;
      }
    },
  },
};

export default resolvers;
