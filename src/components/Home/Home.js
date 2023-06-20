import '../Module.css/Header.css';
import '../Module.css/Loading.css';
import '../Module.css/Body.css';
import ImgLogo from '../../assets/image/Logo.png';
import { useState } from 'react';
import axios from 'axios';
import { BiError } from 'react-icons/bi';
import { BiSad } from 'react-icons/bi';

function Home(){
    //const's
    const btnSearch = document.querySelector('#btnSearch');
    const loading = document.querySelector('#loading');
    const msgSpanError = document.querySelector('#msgSpanError');
    const msgSpanNothingFound = document.querySelector('#msgSpanNothingFound');
    const resultSearch = document.querySelector('#result-search');
    const btnSeeLyrics = document.querySelector('#btn-see-lyrics');
    
    //get input value
    const [Search, setSearch] = useState('');

    //treat input value: tiny, removing accent's, removing space. 
    const TreatValue = (str) => {        
        const strText = str.toLowerCase();        
        const treatedValue = strText.normalize('NFD').replace(/[\u0300-\u036f]/g, "");

        return treatedValue.trim();
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
        msgSpanNothingFound.style.display = 'none';
        resultSearch.style.display = 'none';

        loading.style.display = 'flex';
    }

    //request finish - front-end:
    const SearchFinish = () => {
        btnSearch.textContent = 'Search';
        btnSearch.disabled = false;
        btnSearch.style.backgroundColor = '#f13835';

        loading.style.display = 'none';
        resultSearch.style.display = 'block';
    }

    //error no-results:
    const NothingFound = (Totalresults) => {
        if(Totalresults == 0){
            msgSpanNothingFound.style.display = 'block';
        }else{
            return Totalresults
        }
    }
    

    //body - capa, artista, titulo, letra e tradução**********
    //btn-see-lyrics -- addEventListernner em react:
    
    

    //insert results in the page
    const InsertResultsInThePage = (response) => {
        NothingFound(response.total); //verify error: nothing found

        resultSearch.innerHTML = response.data.map(musics => `
            <li className='musics'>
                <img src='${musics.album.cover_xl}' className='musics-album'></img>
                <span className='musics-artist'><strong>${musics.artist.name}</strong> - ${musics.title}</span>
                <button className='btn' id='btn-see-lyrics' data-artist='${musics.artist.name}' data=-song-title'${musics.title}'>See Lyrics</button>
            </li>
        `).join('');
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

            <section id='loading-session-and-erro'>
                <div id='msgSpanNothingFound'>
                    <span><BiSad />Nothing Found! Sorry</span>
                </div>

                <div id='msgSpanError'>
                    <span><BiError /> Something Went Wrong, Try Later!</span>
                </div>

                <div id='loading'>
                    <span id='spinner'></span>
                    <span id='msg-spinner'>please wait...</span>
                </div> 
            </section>

            <ul id='result-search'></ul>
        </div>
    )
}

export default Home