import React from 'react';
import { FaYoutube, FaTiktok, FaInstagram, FaGithub, FaFacebook } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { BsTwitterX } from 'react-icons/bs';
import '../../assets/styles/footer.css';
export default function Footer() {
    return (
        <footer>
            <div className="row">
                <div className="column">
                    <h1>Social media</h1>
                    <div className="row">
                        <FaYoutube />
                        <FaTiktok />
                        <FaFacebook />
                        <FaGithub />
                        <FaInstagram />
                        <BsTwitterX />
                    </div>
                </div>
                <Link to={`/update-user`}>
                    <h3>User</h3>
                </Link>
                <Link to={`/about`}>
                    <h3>About</h3>
                </Link>
                <Link to={`/search`}>
                    <h3>Search</h3>
                </Link>
                <Link to={`/account/${localStorage.getItem('user').split('#')[1]}`}>
                    <h3>Config</h3>
                </Link>
            </div>
            <h1 className="autor">©Alan Martins da Silva 2024</h1>
        </footer>
    );
}
