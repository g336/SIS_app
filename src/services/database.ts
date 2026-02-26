import firestore from '@react-native-firebase/firestore';

/**
 * Adds a new user with a clean, custom ID (Enrollment/Employee ID)
 * This prevents the random strings like 'IbwIJzAS...' seen in your console.
 */
export const addUserWithPassword = async (userId: string, userData: any) => {
  try {
    await firestore()
      .collection('users')
      .doc(userId.trim()) // Sets the Document ID to the specific User ID
      .set({
        ...userData,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
    return { success: true };
  } catch (error) {
    console.error("Error adding user:", error);
    return { success: false, error };
  }
};

/**
 * Logic for checking login credentials against your custom ID and password field.
 */
export const verifyLogin = async (id: string, inputPassword: string) => {
  try {
    const userDoc = await firestore().collection('users').doc(id.trim()).get();

    if (userDoc.exists()) {
        const data = userDoc.data();
      // Verifies the password field you manually added
      if (data?.password === inputPassword) {
        return { success: true, role: data?.role };
      }
    }
    return { success: false, message: "Invalid ID or Password" };
  } catch (error) {
    console.error("Login verification failed:", error);
    throw error;
  }
};