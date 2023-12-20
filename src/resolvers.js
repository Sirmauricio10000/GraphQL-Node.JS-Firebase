// src/resolvers.js
import admin from 'firebase-admin';

const resolvers = {
  Query: {
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
};

export default resolvers;
