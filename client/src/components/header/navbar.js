import './header.css';

const NavBar = () => {
   return (
      <div className='navbar'>
         <div className='mainContainer'>
            <a className='noselect' href='https://chriskolb.dev'><div>Home</div></a>
            <a className='noselect' href='https://chriskolb.dev/#/projects'><div>Projects</div></a>
            <a className='noselect' href='https://chriskolb.dev/#/research'><div>Research</div></a>
            <a className='noselect' href='https://chriskolb.dev/#/coding'><div>Coding</div></a>
            <a className='noselect' href='https://chriskolb.dev/#/papers'><div>Papers</div></a>
            <a className='noselect' href='https://chriskolb.dev/#/about'><div>About</div></a>
            <div className='active noselect'>Reversi</div>
         </div>
      </div>
   );
}

export default NavBar;