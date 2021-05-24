import {withRouter} from 'next/router';
import Link from 'next/link';
function Navigation  ({router})  {
    const navs = [
        { text: 'Home', href: '/' },
        {text: 'Users' , href: '/users'},
        { text: 'About', href: '/about' },
        { text: 'Portfolio', href: '/portfolio' },
        { text: 'Contact', href: '/contact' },
      ];
    return (
        <>
            <div>
                <ul>
                   {
                       navs.map((nav , index) => {
                           return (
                               <li key={index} className={`nav-item ${router.pathname == nav.href ? 'active' : ''}`}>
                                   <Link href={nav.href}>
                                       <a>{nav.text}</a>
                                   </Link>
                               </li>
                           );
                       })
                   } 
                </ul>    
            </div>    
        </>
    );
}
export default withRouter(Navigation);