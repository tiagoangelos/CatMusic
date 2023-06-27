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
    
    const infoBasic = document.querySelector('#info-basic');
    const imgAlbum = document.querySelector('#img-album');
    const infoPreviewAndTitle = document.querySelector('#info-preview-and-title');

    //get input value
    const [Search, setSearch] = useState('');

    //treat input value: tiny, removing accent's, removing space. 
    function TreatValue(str){        
        const strText = str.toLowerCase();        
        const treatedValue = strText.normalize('NFD').replace(/[\u0300-\u036f]/g, "");

        return treatedValue.trim();
    }

    //receive value, call treat value, and pass to api
    function SongRequest(event){
        event.preventDefault();
        const SearchValue = TreatValue(Search);

        RequestApiOvh(SearchValue);
    }

    //wait request - front-end:
    function WaitForSearch(){
        btnSearch.textContent = 'Wait...';
        btnSearch.disabled = true;
        btnSearch.style.backgroundColor = '#808080';

        msgSpanError.style.display = 'none';
        msgSpanNothingFound.style.display = 'none';
        
        resultSearch.style.display = 'none';
        infoBasic.style.display = 'none';

        loading.style.display = 'flex';
    }

    //request finish - front-end:
    function SearchFinish(){
        btnSearch.textContent = 'Search';
        btnSearch.disabled = false;
        btnSearch.style.backgroundColor = '#f13835';

        loading.style.display = 'none';

        resultSearch.style.display = 'block';  
    }

    //request - lyrics finish - fron-end
    function requestLyricsFinish(){
        btnSearch.textContent = 'Search';
        btnSearch.disabled = false;
        btnSearch.style.backgroundColor = '#f13835';

        msgSpanError.style.display = 'none';
        msgSpanNothingFound.style.display = 'none';

        resultSearch.style.display = 'none';
        loading.style.display = 'none';

        infoBasic.style.display = 'flex';
    }

    //error: 0 results for search:
    function NothingFound(Totalresults){
        if(Totalresults == 0){
            msgSpanNothingFound.style.display = 'block';
        }else{
            return Totalresults
        }
    }

    //request music-selected
    function RequestLyrics(imageAlbum, artist, musicTitle, musicPreview){
        //loading
        WaitForSearch();

        //insert infor-basic on the page
        imgAlbum.innerHTML = `
            <img src='${imageAlbum}' alt='img-Album' id='img-album-lyrics'></img>
        `;

        infoPreviewAndTitle.innerHTML = `
            <h2 id='infor-title'><strong>${artist}</strong> - ${musicTitle}</h2>
            <audio controls='false' id='infor-preview'>
                <source src=${musicPreview} type='audio/mpeg'></source>
            </audio>    
        `;

        requestLyricsFinish();
    }
    
    //insert results in the page
    function InsertResultsInThePage(response){
        NothingFound(response.total); //verify error: nothing found

        //take music clicked, and call request!
        resultSearch.addEventListener('click', event => {
            const clickedElement = event.target;

            if(clickedElement.tagName === 'BUTTON'){
                const imageAlbum = clickedElement.getAttribute('data-image-album');
                const artist = clickedElement.getAttribute('data-artist');
                const musicTitle = clickedElement.getAttribute('data-music-title');
                const musicPreview = clickedElement.getAttribute('data-audio-preview');
                
                RequestLyrics(imageAlbum, artist, musicTitle, musicPreview);
            }
        });

        resultSearch.innerHTML = response.data.map(musics => `
            <li className='musics'>
                <img src='${musics.album.cover_xl}' className='musics-album'></img>
                <span className='musics-artist'><strong>${musics.artist.name}</strong> - ${musics.title}</span>
                <button className='btn' id='btn-see-lyrics' data-image-album=${musics.album.cover_xl} data-artist='${musics.artist.name}' data-music-title='${musics.title}' data-audio-preview=${musics.preview}>See Lyrics</button>
            </li>
        `).join('');
    }

    //request api with Axios
    function RequestApiOvh(search){
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

            <div id='loading'>
                <span id='spinner'></span>
                <span id='msg-spinner'>please wait...</span>
            </div> 

            <section id='loading-session-and-erro'>
                <div id='msgSpanNothingFound'>
                    <span><BiSad />Nothing Found! Sorry</span>
                </div>

                <div id='msgSpanError'>
                    <span><BiError /> Something Went Wrong, Try Later!</span>
                </div>
            </section>

            <ul id='result-search'></ul>

            <section id='info-basic'>
                <div id='img-album'></div>
                <div id='info-preview-and-title'></div>
            </section>

        </div>
    )
}

export default Home