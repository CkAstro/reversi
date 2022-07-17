import NavBar from './navbar';
import style from './header.module.css';

const Header = () => (
   <div className={style.headerContainer}>
      <div className={style.header}>
         <div className='mainContainer'>
            <h1>Christopher Kolb</h1>
            <h2>Full Stack Development + Computational Astrophysics</h2>
         </div>
      </div>
      <NavBar/>
   </div>
);

export default Header;