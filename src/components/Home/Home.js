import Nav from '../Nav/Nav';
import '../Module.css/Header.css';
import '../Module.css/Loading.css';
import '../Module.css/Body.css';
import { useState } from 'react';
import axios  from 'axios';
import { BiError } from 'react-icons/bi';
import { BiSad } from 'react-icons/bi';
import { VscSearchStop } from 'react-icons/vsc';
import {IncrementCount} from '../../firebase/actions/RequestCount';


function Home(){
    //const's - initial
    const btnSearch = document.querySelector('#btnSearch');
    const loading = document.querySelector('#loading');
    const msgSpanError = document.querySelector('#msgSpanError');
    const msgSpanNothingFound = document.querySelector('#msgSpanNothingFound');
    const msgSpanLyricsNotFound = document.querySelector('#msgSpanLyricsNotFound');
    const resultSearch = document.querySelector('#result-search');

    //Const's Results - infor basic | lyrics | translate + infor
    const infoBasic = document.querySelector('#info-basic');
    const imgAlbum = document.querySelector('#img-album');
    const artistAndTitle = document.querySelector('#artist-and-title');
    const hr = document.querySelector('#hr');
    const lyricContainer = document.querySelector('#lyric-container')
    const lyric = document.querySelector('#lyric');
    const lyricsContainer = document.querySelector('#lyrics-container');
    const lyricsMusic = document.querySelector('#lyrics-music');
    const lyricsTranslation = document.querySelector('#lyrics-translation');

    //get input value
    const [Search, setSearch] = useState('');

    //treat input value: tiny, removing accent's, removing space. 
    const TreatValue = (str) => {        
        const strText = str.toLowerCase();        
        const treatedValue = strText.normalize('NFD').replace(/[\u0300-\u036f]/g, "");

        return treatedValue.trim();
    }

    //receive value, call treat value, and pass to api
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
        msgSpanLyricsNotFound.style.display = 'none';
        
        resultSearch.style.display = 'none';
        infoBasic.style.display = 'none';
        hr.style.display = 'none';
        lyricContainer.style.display = 'none';
        lyricsContainer.style.display = 'none';

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

    //request - lyric BR finish - front-end
    const requestLyricFinish = () => {
        btnSearch.textContent = 'Search';
        btnSearch.disabled = false;
        btnSearch.style.backgroundColor = '#f13835';

        resultSearch.style.display = 'none';
        loading.style.display = 'none';

        infoBasic.style.display = 'flex';
        hr.style.display = 'block';

        lyricContainer.style.display = 'flex';
        lyricsContainer.style.display = 'none';
    }

    //request - lyrics EN finish - fron-end
    const requestLyricsFinish = () => {
        btnSearch.textContent = 'Search';
        btnSearch.disabled = false;
        btnSearch.style.backgroundColor = '#f13835';

        resultSearch.style.display = 'none';
        loading.style.display = 'none';

        infoBasic.style.display = 'flex';
        hr.style.display = 'block';

        lyricContainer.style.display = 'none';
        lyricsContainer.style.display = 'flex';

    }

    //request - lyrics not found - fron-end
    const RequestLyricsNotFound = () => {
        btnSearch.textContent = 'Search';
        btnSearch.disabled = false;
        btnSearch.style.backgroundColor = '#f13835';

        loading.style.display = 'none';

        resultSearch.style.display = 'none'; 
        hr.style.display = 'none';
        infoBasic.style.display = 'none';
        lyricContainer.style.display = 'none';
        lyricsContainer.style.display = 'none';    
    }

    //error: 0 results for search:
    const NothingFound = (Totalresults) => {
        if(Totalresults == 0){
            msgSpanNothingFound.style.display = 'block';
        }else{
            return Totalresults;
        }
    }

    //error: lyrics not found
    const lyricsNotFound = () => {
        msgSpanLyricsNotFound.style.display = 'block';

        RequestLyricsNotFound();
    }

    //Css - Just Lyrics
    const JustLyric = () => {
        infoBasic.style.justifyContent = 'center';

        requestLyricFinish();
    }

    //Css - Lyrics + tranlate
    const LyricsAndTranslate = () => {
        infoBasic.style.justifyContent = 'left';
        
        requestLyricsFinish();
    }

    //insert infor, lyrics/translate on the page 
    const InsertLyricsOnThePage = (imageAlbum, artist, musicTitle, lyrics, translate) => {
        WaitForSearch();
    
        imgAlbum.innerHTML = `
            <img src='${imageAlbum}' alt='img-Album' id='img-album-lyrics'></img>
        `;

        artistAndTitle.innerHTML = `
            <h2 id='infor-title'><strong>${artist}</strong> - ${musicTitle}</h2> 
        `;

        hr.innerHTML = `<hr>`;

        if(!translate){
            lyric.innerHTML = ` 
                <h1 id='h1-lyrics'><strong>Lyrics</strong><h1>
                <p>[${musicTitle}]</p>
                <p>${lyrics}</p>
            `;

            JustLyric();
        }else{
            lyricsMusic.innerHTML = `
                <h1 id='h1-lyrics'><strong>Lyrics</strong><h1>
                <p>[${musicTitle}]</p>
                <p>${lyrics}</p>
            `;

            lyricsTranslation.innerHTML = `
                <h1 id='h1-translate'><strong>Translation</strong><h1>
                <p id='p-translate'>${translate}</p>
            `;

            LyricsAndTranslate();
        }
    }

    //request lyrics, translate - at vagalume
    const RequestLyrics = (imageAlbum, artist, musicTitle) => {
        WaitForSearch();

        const apiVagalume = process.env.REACT_APP_API_VAGALUME;
        const apiKey = process.env.REACT_APP_API_VAGALUME_KEY;

        axios.get(`${apiVagalume}art=${artist}&mus=${musicTitle}&apikey=${apiKey}`)
        .then(function(response){
            const data = response.data
            
            const lang = data.mus[0].lang;

            //music br or inter
            if(lang == 1){
                const lyrics = data.mus[0].text.replace(/(\r\n|\r|\n)/g, '<br>');
                
                InsertLyricsOnThePage(imageAlbum, artist, musicTitle, lyrics);
            }else{
                const lyrics = data.mus[0].text.replace(/(\r\n|\r|\n)/g, '<br>');
                const translate = data.mus[0].translate[0].text.replace(/(\r\n|\r|\n)/g, '<br>');
                
                InsertLyricsOnThePage(imageAlbum, artist, musicTitle, lyrics, translate);
            }
        })
        .catch(function(error){
            lyricsNotFound();
        })
    }

    //insert results in the page
    const InsertResultsInThePage = (response) => {
        NothingFound(response.total); //verify error: nothing found

        //FireStore - Count - Searched
        if(response.total >= 1){
            IncrementCount();
        }

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

    //request api with Fetch async await json
    const RequestApiOvh = (search) => {  
        WaitForSearch();

        const apiOvh = process.env.REACT_APP_API_OVH;
        
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
            <Nav />

            <header href='#'>
                <h1>Search Your Favorite Lyric's Music In This App</h1>
                <p>From Ovh, Vagalume Api Oficial</p>
                <form id='form-search' onSubmit={SongRequest}>
                    <input
                        autoFocus
                        required
                        autoComplete='on'
                        id="search"
                        type="text"
                        placeholder="Artist, Music..."
                        onChange={(event) => setSearch(event.target.value)}
                    />
                    <button id='btnSearch' disabled={false}>Search</button>
                </form>
            </header>

            <div id='loading' href='#'>
                <span id='spinner'></span>
                <span id='msg-spinner'>Loading...</span>
            </div> 

            <section id='Session-and-erro' href='#'>
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

            <ul id='result-search' href='#'></ul>

            <section id='info-basic' href='#'>
                <div id='img-album'></div>
                <div id='artist-and-title'></div>
            </section>

            <div id='hr' href='#'></div>

            <section id='lyric-container' href='#'>
                <div id='lyric'></div>
            </section>

            <section id='lyrics-container' href='#'>
                <div id='lyrics-music'></div>
                <div id='lyrics-translation'></div>
            </section>
        </div>
    )
}

export default Home