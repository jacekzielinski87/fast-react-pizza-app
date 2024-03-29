import { Link } from 'react-router-dom';
import SearchOrder from '../features/order/SearchOrder';
import Username from '../features/user/Username';

function Header() {
  return (
    <header
      className="text-huge flex items-center justify-around
     border-b border-stone-800 bg-yellow-500 px-4 
     py-4 font-serif font-semibold uppercase sm:px-6"
    >
      <Link to="/" className="tracking-widest">
        Fast React Pizza Co.
      </Link>

      <SearchOrder />
      <Username />
    </header>
  );
}

export default Header;
