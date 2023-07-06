import '../Module.css/Navbar.css';
import ImgLogo from '../../assets/image/Logo.png';
import { CgSearchFound } from 'react-icons/cg';
import { collection, query, onSnapshot } from 'firebase/firestore';
import {db} from '../../firebase/FirebaseConnect';
import { useEffect, useState } from 'react';


function Nav(){
    const [requestCount, setRequestCount] = useState([]);

    useEffect(() => {
        const q = query(collection(db, 'request_count'));
        onSnapshot(q, (querySnapshot) => {
            setRequestCount(querySnapshot.docs.map(doc=>({
                data: doc.data()
            })))
        })
    }, [])

    return (
        <nav id='navbar'>
            <h2 id='h2-primary' href='#'>
                <img src={ImgLogo}></img>
                <p>Cat Music</p>
            </h2>
            <h2 id='h2-secundary'>
                <CgSearchFound />
                <p id='valueCurrentRequest'>{requestCount[0]?.data?.total}</p>
            </h2>
        </nav>
    )
}

export default Nav