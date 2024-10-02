import React, { useEffect, useRef } from 'react';
import '../../assets/styles/header.css';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { GoSearch } from 'react-icons/go';
import { IoMdMenu, IoMdClose } from 'react-icons/io';

export default function Header(props) {
    // window.addEventListener('scroll',()=>{
    //    const header = document.querySelectorAll('header')[0];
    //    setTimeout(()=>{
    //      if(window.scrollY > 0)
    //         return header.style.position = 'fixed'
    //      return header.style.position = 'relative'
    //    },100)
    // })
    const navigate = useNavigate();
    const hashtag = localStorage.getItem('user') || null;
    const name = localStorage.getItem('name') || null;
    const icon = localStorage.getItem('icon') || '';
    const url = useLocation();
    const searchRef = useRef();
    const prevent = useRef(null);
    useEffect(() => {
        if (props.focus) {
            searchRef.current.focus();
        }
        if (searchRef.current && props.search) {
            searchRef.current.addEventListener('change', () => {
                if (prevent.current !== searchRef.current.value && searchRef.current.value !== '') {
                    prevent.current = searchRef.current.value;
                    props.search(searchRef.current.value[0] === '#' ? searchRef.current.value.split('#')[1] : searchRef.current.value);
                }
            });
        }
    }, [searchRef.current ? searchRef.current.value : null]);

    return (
        <header>
            <div className="mobile">
                <div className="column">
                    <img
                        className="user-icon"
                        onClick={() => {
                            return navigate(`/account/${hashtag.split('#')[1]}`);
                        }}
                        src={`${props.api.host}/icon/${icon}`}
                        onError={() => props.functions.default_icon(0)}
                        alt="icon"
                    />
                    <h3 className="name">{name}</h3>
                </div>
                <nav>
                    <Link className="btn-dark" to={`/home/${hashtag.split('#')[1]}`}>
                        Home
                    </Link>
                    <Link className="btn-dark" to="/about">
                        About
                    </Link>
                    <Link to="/new-hack" className="last btn-dark">
                        Create
                    </Link>
                </nav>
            </div>
            <img className="mario reverse" src={props.img} alt="mario" />
            <h1>
                Search hacks of
                <br /> Super Nintendo here
            </h1>
            <div
                className="search"
                onClick={() => {
                    if (url.pathname !== `/search/${searchRef.current.value}` && url.pathname !== '/search' && prevent.current !== '') {
                        return navigate('/search');
                    }
                }}
            >
                <GoSearch className="icon" />
                <input defaultValue={''} ref={searchRef} type="text" id="search" name="search" />
            </div>

            <nav>
                <Link className="btn-dark" to={`/home/${hashtag.split('#')[1]}`}>
                    Home
                </Link>
                <Link className="btn-dark" to="/about">
                    About
                </Link>
                <Link to="/new-hack" className="last btn-dark">
                    Create
                </Link>
            </nav>
            <div className="column">
                <img
                    className="user-icon"
                    onClick={() => {
                        return navigate(`/account/${hashtag.split('#')[1]}`);
                    }}
                    src={`${props.api.host}/icon/${icon}`}
                    onError={() => props.functions.default_icon(1)}
                    alt="icon"
                />
                <h3 className="name">{name}</h3>
            </div>
            <div
                id="menu"
                onClick={() => {
                    const nav = document.querySelectorAll('.mobile')[0];
                    const close = document.querySelectorAll('.close')[0];
                    const open = document.querySelectorAll('.open')[0];
                    console.log(nav.classList);
                    nav.classList.toggle('nav-mobile');
                    if (nav.classList[1] === 'nav-mobile' || nav.classList[2] === 'nav-mobile') {
                        nav.classList.add('mobile-open');
                    }
                    if (nav.classList[1] !== 'nav-mobile' && nav.classList[2] !== 'nav-mobile') {
                        nav.classList.remove('mobile-open');
                    }

                    if (close.style.display === 'none') {
                        open.style.display = 'none';
                        close.style.display = 'block';
                        return null;
                    }
                    open.style.display = 'block';
                    close.style.display = 'none';
                    return null;
                }}
            >
                <IoMdMenu className="open" />
                <IoMdClose className="close" style={{ display: 'none' }} />
            </div>
            {/* <button onClick={()=>send()}>aqui</button> */}
        </header>
    );
}
// Get-ExecutionPolicy
// Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
// Set-ExecutionPolicy Restricted -Scope CurrentUser
