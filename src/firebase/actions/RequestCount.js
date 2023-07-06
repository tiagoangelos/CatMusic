import { collection, query, getDocs } from "firebase/firestore";
import { doc, setDoc } from "firebase/firestore"; 
import {db} from '../../firebase/FirebaseConnect';


//Firebase: Take Current Value Request Count
export const IncrementCount = async () => {

    const incrementValue = async (value) => {
        await setDoc(doc(db, "request_count", "ApdQdR7FiB2eTpNQzA5R"), {
            total: value
        });
    }

    const docRef = query(collection(db, "request_count"));

    const querySnapshot = await getDocs(docRef);
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        const requestCurrentCount = (data.total);

        const value = (requestCurrentCount + 1);
        incrementValue(value);
    }); 
}