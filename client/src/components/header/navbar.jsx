import style from './header.module.css';

const NavBar = () => (
   <div className={style.navbar}>
      <div className='mainContainer'>
         <a className='noselect' href='https://chriskolb.dev'><div>Home</div></a>
         <div className={`noselect ${style.active}`}>Reversi</div>
      </div>
   </div>
);

export default NavBar;