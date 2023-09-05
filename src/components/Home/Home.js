import '../Module.css/Navbar.css';
import '../Module.css/Header.css';
import '../Module.css/Body.css';
import ImgLogo from '../../assets/image/Logo.png';
import { useEffect, useState } from 'react';
import { collection, query, onSnapshot } from 'firebase/firestore';
import {db} from '../../firebase/FirebaseConnect';
import {IncrementCount} from '../../firebase/actions/RequestCount';
import { CgSearchFound } from 'react-icons/cg';
import { BiError } from 'react-icons/bi';
import { BiSad } from 'react-icons/bi';
import { VscSearchStop } from 'react-icons/vsc';
import axios  from 'axios';


function Home(){
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
    const lyricContainer = document.querySelector('#lyric-container')
    const lyric = document.querySelector('#lyric');
    const lyricsContainer = document.querySelector('#lyrics-container');
    const lyricsMusic = document.querySelector('#lyrics-music');
    const lyricsTranslation = document.querySelector('#lyrics-translation');

    const [requestCount, setRequestCount] = useState([]);

    useEffect(() => {
        const q = query(collection(db, 'request_count'));
        onSnapshot(q, (querySnapshot) => {
            setRequestCount(querySnapshot.docs.map(doc=>({
                data: doc.data()
            })))
        })
    }, [])

    const [Search, setSearch] = useState('');

    const TreatValue = (str) => {        
        const strText = str.toLowerCase();        
        const treatedValue = strText.normalize('NFD').replace(/[\u0300-\u036f]/g, "");

        return treatedValue.trim();
    }

    const SongRequest = (event) => {
        event.preventDefault();
        const SearchValue = TreatValue(Search);

        RequestApiOvh(SearchValue);
    }

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

    const SearchFinish = () => {
        btnSearch.textContent = 'Search';
        btnSearch.disabled = false;
        btnSearch.style.backgroundColor = '#f13835';

        loading.style.display = 'none';

        resultSearch.style.display = 'block';  
    }

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

    const NothingFound = (Totalresults) => {
        if(Totalresults == 0){
            msgSpanNothingFound.style.display = 'block';
        }else{
            return Totalresults;
        }
    }

    const lyricsNotFound = () => {
        msgSpanLyricsNotFound.style.display = 'block';

        RequestLyricsNotFound();
    }

    const JustLyric = () => {
        infoBasic.style.justifyContent = 'center';

        requestLyricFinish();
    }

    const LyricsAndTranslate = () => {
        infoBasic.style.justifyContent = 'left';
        
        requestLyricsFinish();
    }

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

    const RequestLyrics = (imageAlbum, artist, musicTitle) => {
        WaitForSearch();

        const apiVagalume = process.env.REACT_APP_API_VAGALUME;
        const apiKey = process.env.REACT_APP_API_VAGALUME_KEY;

        axios.get(`${apiVagalume}art=${artist}&mus=${musicTitle}&apikey=${apiKey}`)
        .then(function(response){
            const data = response.data          
            const translate = data.mus[0].translate;

            //music br or inter
            if(!translate){
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

    const InsertResultsInThePage = (response) => {
        NothingFound(response.total); //verify error: nothing found

        if(response.total >= 1){
            IncrementCount();
        }

        resultSearch.addEventListener('click', event => {
            const clickedElement = event.target;

            if(clickedElement.tagName === 'BUTTON'){
                const imageAlbum = clickedElement.getAttribute('data-image-album');
                const artist = clickedElement.getAttribute('data-artist');
                const musicTitle = clickedElement.getAttribute('data-music-title');
                
                RequestLyrics(imageAlbum, artist, musicTitle);
            }
        });

        const removingAccent = (string) => {
            return string.replace(/[',!^`]/g, "");
        }

        resultSearch.innerHTML = response.data.map(musics => `
            <li className='musics'>
                <img src='${musics.album.cover_xl}' className='musics-album'></img>
                <span className='musics-artist'><strong>${musics.artist.name}</strong> - ${musics.title}</span>
                <button className='btn' id='btn-see-lyrics' data-image-album=${musics.album.cover_xl} data-artist='${musics.artist.name}' data-music-title='${removingAccent(musics.title)}'>See Lyrics</button>
            </li>
        `).join('');
    }

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

    const RedirectToPag = () => {
        const Link = 'https://vagalume.zendesk.com/hc/pt-br/articles/200726538-Cadastrar-artistas-e-letras#:~:text=Para%20adicionar%20novos%20artistas,artista%2C%20letra%20ou%20%C3%A1lbum%22.';
        window.open(Link, '_blank');
    }

    return (
        <div>
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
                    <div><VscSearchStop /> Lyrics available! Try Later Or...</div>
                    <button id='btnSend' onClick={RedirectToPag}>Send Lyric</button>
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