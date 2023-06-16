import './Header.css';
import imgLogo from '../../assets/image/Logo.png';

function Header(){
    return (
        <div>
            <header>
                <img src={imgLogo} id='imgLogo'></img>
                <h1 id='#'>Search Lyrics' Music</h1>
                <form id='form-search'>
                    <input
                        required
                        autoComplete='off'
                        id="search"
                        type="text"
                        placeholder="Type Music Or Artist..."
                    />
                    <button id='btnSearch'>Search</button>
                </form>
            </header>
        </div>
    )
}

export default Header