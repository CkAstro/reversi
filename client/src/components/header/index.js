import NavBar from './navbar';
import './header.css';

const Header = () => {
   return (
      <div>
         <div className='header'>
            <div className='mainContainer'>
               <h1>Christopher Kolb</h1>
               <h2>Computational Astrophysics</h2>
            </div>
         </div>
         <NavBar/>
      </div>
   );
}

export default Header;