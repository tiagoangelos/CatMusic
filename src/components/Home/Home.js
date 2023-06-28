import '../Module.css/Navbar.css';
import '../Module.css/Header.css';
import '../Module.css/Loading.css';
import '../Module.css/Body.css';
import ImgLogo from '../../assets/image/Logo.png';
import { useState } from 'react';
import axios from 'axios';
import { CgSearchFound } from 'react-icons/cg';
import { BiError } from 'react-icons/bi';
import { BiSad } from 'react-icons/bi';
import { VscSearchStop } from 'react-icons/vsc';

function Home(){
    //const's
    const btnSearch = document.querySelector('#btnSearch');
    const loading = document.querySelector('#loading');
    const msgSpanError = document.querySelector('#msgSpanError');
    const msgSpanNothingFound = document.querySelector('#msgSpanNothingFound');
    const msgSpanLyricsNotFound = document.querySelector('#msgSpanLyricsNotFound');
    const resultSearch = document.querySelector('#result-search');

    const infoBasic = document.querySelector('#info-basic');
    const imgAlbum = document.querySelector('#img-album');
    const artistAndTitle = document.querySelector('#artist-and-title');
    const hr = document.querySelector('#hr');
    const lyricsContainer = document.querySelector('#lyrics-container');
    const lyricsMusic = document.querySelector('#lyrics-music');
    const lyricsTranslation = document.querySelector('#lyrics-translation');

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
        msgSpanLyricsNotFound.style.display = 'none';
        
        resultSearch.style.display = 'none';
        infoBasic.style.display = 'none';
        hr.style.display = 'none';
        lyricsContainer.style.display = 'none';

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
        hr.style.display = 'block';
        lyricsContainer.style.display = 'flex';
    }

    //request - lyrics not found - fron-end
    function RequestLyricsNotFound(){
        btnSearch.textContent = 'Search';
        btnSearch.disabled = false;
        btnSearch.style.backgroundColor = '#f13835';

        loading.style.display = 'none';

        resultSearch.style.display = 'none'; 
        hr.style.display = 'none';
        infoBasic.style.display = 'none';
        lyricsContainer.style.display = 'none';
    }

    //error: 0 results for search:
    function NothingFound(Totalresults){
        if(Totalresults == 0){
            msgSpanNothingFound.style.display = 'block';
        }else{
            return Totalresults
        }
    }

    //error: lyrics not found
    function lyricsNotFound(){
        msgSpanLyricsNotFound.style.display = 'block';
        RequestLyricsNotFound();
    }

    //insert infor, lyrics/translate on the page 
    function InsertLyricsOnThePage(imageAlbum, artist, musicTitle, lyrics, translate){
        if(!translate){
            imgAlbum.innerHTML = `
                <img src='${imageAlbum}' alt='img-Album' id='img-album-lyrics'></img>
            `;

            artistAndTitle.innerHTML = `
                <h2 id='infor-title'><strong>${artist}</strong> - ${musicTitle}</h2> 
            `;

            hr.innerHTML = `<hr>`;

            lyricsMusic.innerHTML = `
                <h1 id='h1-lyrics'><strong>Lyrics</strong><h1>
                <p>[${musicTitle}]</p>
                <p>${lyrics}</p>
            `;

            lyricsTranslation.innerHTML = ``;

            requestLyricsFinish();
        }else{
            imgAlbum.innerHTML = `
                <img src='${imageAlbum}' alt='img-Album' id='img-album-lyrics'></img>
            `;

            artistAndTitle.innerHTML = `
                <h2 id='infor-title'><strong>${artist}</strong> - ${musicTitle}</h2> 
            `;

            hr.innerHTML = `<hr>`;

            lyricsMusic.innerHTML = `
                <h1 id='h1-lyrics'><strong>Lyrics</strong><h1>
                <p>[${musicTitle}]</p>
                <p>${lyrics}</p>
            `;

            lyricsTranslation.innerHTML = `
                <h1 id='h1-translate'><strong>Translation</strong><h1>
                <p id='p-translate'>${translate}</p>
            `;

            requestLyricsFinish();
        }
    }

    //request lyrics, translate - at vagalume
    const RequestLyrics = async (imageAlbum, artist, musicTitle) => {
        WaitForSearch();

        const apiVagalume = process.env.REACT_APP_API_VAGALUME;
        const apiKey = process.env.REACT_APP_API_VAGALUME_KEY;

        const response = await fetch(`${apiVagalume}art=${artist}&mus=${musicTitle}&apikey=${apiKey}`);
        const data = await response.json()
        .then(function(data){
            const lang = data.mus[0].lang;
            
            if(lang == 1){
                const lyrics = data.mus[0].text.replace(/(\r\n|\r|\n)/g, '<br>');
                InsertLyricsOnThePage(imageAlbum, artist, musicTitle, lyrics);
            }else{
                const lyrics = data.mus[0].text.replace(/(\r\n|\r|\n)/g, '<br>');
                const translate = data.mus[0].translate[0].text.replace(/(\r\n|\r|\n)/g, '<br>');

                InsertLyricsOnThePage(imageAlbum, artist, musicTitle, lyrics, translate);
            }
                       
        }).catch(function(error){
            lyricsNotFound();
        })
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
                
                RequestLyrics(imageAlbum, artist, musicTitle);
            }
        });

        resultSearch.innerHTML = response.data.map(musics => `
            <li className='musics'>
                <img src='${musics.album.cover_xl}' className='musics-album'></img>
                <span className='musics-artist'><strong>${musics.artist.name}</strong> - ${musics.title}</span>
                <button className='btn' id='btn-see-lyrics' data-image-album=${musics.album.cover_xl} data-artist='${musics.artist.name}' data-music-title='${musics.title}'>See Lyrics</button>
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
            <nav id='navbar'>
                <h2 id='h2-primary'>
                    <img src={ImgLogo}></img>
                    <p>Cat Music</p>
                </h2>
                <h2 id='h2-secundary'>
                    <CgSearchFound />
                    <p> 00</p>
                </h2>
            </nav>

            <header>
                <h1>Search Your Favorite Lyric's Music In This App</h1>
                <p>From Ovh, Vagalume Api Oficial</p>
                <form id='form-search' onSubmit={SongRequest}>
                    <input
                        autoFocus
                        required
                        autoComplete='off'
                        id="search"
                        type="text"
                        placeholder="Artist, Music..."
                        onChange={(event) => setSearch(event.target.value)}
                    />
                    <button id='btnSearch' disabled={false}>Search</button>
                </form>
            </header>

            <div id='loading'>
                <span id='spinner'></span>
                <span id='msg-spinner'>Loading...</span>
            </div> 

            <section id='Session-and-erro'>
                <div id='msgSpanNothingFound'>
                    <span><BiSad /> '0' Results! for your search...</span>
                </div>

                <div id='msgSpanError'>
                    <span><BiError /> Conection error! Try Later...</span>
                </div>

                <div id='msgSpanLyricsNotFound'>
                    <span><VscSearchStop /> Lyrics available! Try Later...</span>
                </div>
            </section>

            <ul id='result-search'></ul>

            <section id='info-basic'>
                <div id='img-album'></div>
                <div id='artist-and-title'></div>
            </section>

            <div id='hr'></div>

            <section id='lyrics-container'>
                <div id='lyrics-music'></div>
                <div id='lyrics-translation'></div>
            </section>

        </div>
    )
}

export default Home