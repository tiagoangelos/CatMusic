import './Home.css';
import './Loading.css';
import ImgLogo from '../../assets/image/Logo.png';
import { useState } from 'react';
import axios from 'axios';
import { BiError } from 'react-icons/bi';

function Home(){
    //const's
    const btnSearch = document.querySelector('#btnSearch');
    const loading = document.querySelector('#loading');
    const msgSpanError = document.querySelector('#msgSpanError');

    //get input value
    const [Search, setSearch] = useState('');

    //treat input value 
    const TreatValue = (str) => {        
        const strText = str;
        const withoutAccent = strText.normalize('NFD').replace(/[\u0300-\u036f]/g, "");

        return withoutAccent.trim();
    }

    //no scrool in thepage, and call request-api
    const SongRequest = (event) => {
        event.preventDefault();
        const SearchValue = TreatValue(Search);

        RequestApiOvh(SearchValue);
    }

    //wait request - front-end:
    const WaitForSearch = () => {
        btnSearch.textContent = 'Wait...';
        btnSearch.disabled = true;
        btnSearch.style.backgroundColor = '#808080';

        msgSpanError.style.display = 'none';
        loading.style.display = 'flex';
    }

    //request finish - front-end:
    const SearchFinish = () => {
        btnSearch.textContent = 'Search';
        btnSearch.disabled = false;
        btnSearch.style.backgroundColor = '#f13835';

        msgSpanError.style.display = 'none';
        loading.style.display = 'none';
    }

    //insert results in the page
    const InsertResultsInThePage = (responseData) => {
        console.log(responseData)
        




    }

    //request api
    const RequestApiOvh = (search) => {
        const apiOvh = process.env.REACT_APP_API_OVH;
        WaitForSearch();
        
        axios.get(`${apiOvh}/suggest/${search}`)
        .then(function (response){
            SearchFinish();
            InsertResultsInThePage(response.data);
        })
        .catch(function(error){
            SearchFinish();
            msgSpanError.style.display = 'block';
        })
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
                    <button id='btnSearch' disabled={false}>Search</button>
                </form>
            </header>

            <div>
                <span id='msgSpanError'><BiError /> Something Went Wrong, Try Again!</span>
            </div>

            <div id='loading'>
                <p id='spinner'></p>
            </div>

            <div>
                <ul id='results-Search'></ul>
            </div>

        </div>
    )
}

export default Home