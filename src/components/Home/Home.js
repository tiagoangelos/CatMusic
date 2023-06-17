import './Home.css';
import ImgLogo from '../../assets/image/Logo.png';
import { useState } from 'react';

function Home(){
    const [Search, setSearch] = useState('');

    const TreatValue = (str) => {        
        const strText = str;
        const withoutAccent = strText.normalize('NFD').replace(/[\u0300-\u036f]/g, "");

        return withoutAccent.trim();
    }

    const SongRequest = (event) => {
        event.preventDefault();
        const SearchValue = TreatValue(Search);
    }

    return (
        <div>
            <header>
                <img src={ImgLogo} id='imgLogo'></img>
                <h1 id='#'>Search Lyrics' Music</h1>
                <form id='form-search' onSubmit={SongRequest}>
                    <input
                        required
                        autoComplete='off'
                        id="search"
                        type="text"
                        placeholder="Type Music Or Artist..."
                        onChange={(event) => setSearch(event.target.value)}
                    />
                    <button id='btnSearch'>Search</button>
                </form>
            </header>

            <div>
                <ul id='results-Search'></ul>
            </div>

        </div>
    )
}

export default Home