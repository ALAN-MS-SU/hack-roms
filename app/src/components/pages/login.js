import React, { useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import '../../assets/styles/login.css';
export default function Login(props) {
    const { type } = useParams();
    const navigate = useNavigate();
    const functions = props.functions;
    if (type === 'create') {
        async function create_user() {
            const form = document.querySelector('#form');
            const formdata = new FormData(form);
            const response = await fetch(`${props.api.host}/new-account`, {
                method: 'post',
                body: formdata
            })
                .then((data) => {
                    if (!data.ok) return console.log(data);
                    return data.json();
                })
                .catch((err) => {
                    if (err) console.log(err);
                });
            if (!response) {
                alert('Esses dados não foram aceitos. Tente outros');
                return functions.err();
            }
            localStorage.setItem('user', response.hashtag);
            localStorage.setItem('name', response.name);
            localStorage.setItem('password', response.password);
            localStorage.setItem('icon', response.icon);
            return navigate(response.link);
        }
        return (
            <div className="login">
                <form id="form" encType="multipart/form-data" className="create">
                    <h2>Create account</h2>
                    <div className="row">
                        <label htmlFor="hashtag">Hashtag: </label>
                        <input required placeholder="Hashtag" type="text" id="hashtag" name="hashtag" />
                    </div>
                    <div className="row">
                        <label htmlFor="name">Name: </label>
                        <input required placeholder="Name" type="text" id="name" name="name" />
                    </div>
                    <div className="row">
                        <label htmlFor="password">Password: </label>
                        <input required placeholder="Password" type="password" id="password" name="password" />
                    </div>

                    <label className="btn-light file-function" htmlFor="Choose your icon">
                        Choose your icon
                    </label>
                    <input onChange={() => functions.label(0)} type="file" id="Choose your icon" name="Choose your icon" />

                    <button className="btn-light" onClick={async () => await create_user()} type="button">
                        Create
                    </button>
                    <div className="row" name="row-a">
                        <Link style={{ position: 'relative', bottom: '30px' }} to="/" onClick={() => functions.default_placeholder()}>
                            Already have an account? Login!
                        </Link>
                    </div>
                </form>
                <div></div>
            </div>
        );
    }
    async function login() {
        const form = document.querySelector('#form');
        const formdata = new FormData(form);
        const response = await fetch(`${props.api.host}/login`, {
            method: 'post',
            body: formdata
        })
            .then((data) => {
                if (!data.ok) return console.log(data);
                return data.json();
            })
            .catch((err) => {
                if (err) return console.log(err);
            });
        console.log(response);
        if (!response) {
            alert('Esses dados não foram aceitos. Tente outros');
            return functions.err();
        }
        localStorage.setItem('user', response.hashtag);
        localStorage.setItem('name', response.name);
        localStorage.setItem('password', response.password);
        localStorage.setItem('icon', response.icon);
        return navigate(`/home/${response.hashtag.split('#')[1]}`);
    }
    return (
        <div className="login">
            <form id="form" encType="multipart/form-data">
                <h2>Login</h2>
                <div className="row">
                    <label htmlFor="hashtag">Hashtag: </label>
                    <input required placeholder="Hashtag" minLength="4" type="text" id="hashtag" name="hashtag" />
                </div>

                <div className="row">
                    <label htmlFor="password">Password: </label>
                    <input required placeholder="Password" minLength="7" type="password" id="password" name="password" />
                </div>
                <button className="btn-light" onClick={() => login()} type="button">
                    Login
                </button>
                <div className="row" name="row-a">
                    <Link style={{ position: 'relative', bottom: '30px' }} to="/create" onClick={() => functions.default_placeholder()}>
                        Create new account
                    </Link>
                </div>
            </form>
        </div>
    );
}
