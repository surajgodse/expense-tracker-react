import { initializeApp } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "******************",
  authDomain: "expensetrack-5bc40.firebaseapp.com",
  databaseURL: "******************",
  projectId: "********************",
  storageBucket: "*****************",
  messagingSenderId: "************************",
  appId: "***************************"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);

export const fetchGuestData = async () => {
  const guestEmail = 'godsesuraj2140@gmail.com'.replace('.', ',');
  const expensesRef = ref(db, `expenses/${guestEmail}`);
  try {
    const snapshot = await get(expensesRef);
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      console.log("No data available");
      return null;
    }
  } catch (error) {
    console.error("Error fetching guest data:", error);
    return null;
  }
};

export default app;
