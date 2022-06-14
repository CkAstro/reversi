import NavBar from './navbar';
import style from './header.module.css';

const Header = () => {
   return (
      <div>
         <div className={style.header}>
            <div className='mainContainer'>
               <h1>Christopher Kolb</h1>
               <h2>Computational Astrophysics + Full Stack Development</h2>
            </div>
         </div>
         <NavBar/>
      </div>
   );
}

export default Header;