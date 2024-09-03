import { initializeApp } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD-v5gNG_aLP4o5uqGET03yHG1izhG-A9o",
  authDomain: "expensetrack-5bc40.firebaseapp.com",
  databaseURL: "https://expensetrack-5bc40-default-rtdb.firebaseio.com",
  projectId: "expensetrack-5bc40",
  storageBucket: "expensetrack-5bc40.appspot.com",
  messagingSenderId: "778250175101",
  appId: "1:778250175101:web:5bab44dbdf95bb73b6e714"
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