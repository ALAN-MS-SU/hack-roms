import React, { useEffect, useRef, useState } from 'react';
import { FaArrowCircleLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
export default function Update(props) {
    const [user, setUser] = useState(false);
    const navigate = useNavigate();
    async function get_user() {
        const data = new FormData();
        data.append('hashtag', localStorage.getItem('user').split('#')[1]);
        data.append('password', localStorage.getItem('password'));
        setUser(
            await fetch(`${props.api.host}/login`, {
                method: 'post',
                body: data
            })
                .then((user) => {
                    if (!user.ok) return console.log(user);
                    return user.json();
                })
                .catch((err) => {
                    if (err) return console.log(err);
                })
        );
        console.log(user);
    }
    async function update() {
        const form = document.querySelector('.form1');
        const data = new FormData(form);
        data.append('check', user.password);
        data.append('old_icon', user.icon);

        const results = await fetch(`${props.api.host}/update-user/${user.hashtag.split('#')[1]}`, {
            method: 'put',
            body: data
        })
            .then((results) => {
                if (!results.ok) return console.log(results);

                return results.json();
            })
            .catch((err) => {
                if (err) return console.log(err);
            });
        console.log(results);
        if (!results) {
            props.functions.err();
            const input = document.querySelectorAll('input');
            const array = Array.from(input);
            array.map((input) => {
                if (input.name !== 'icon') return (input.value = user[input.name]);
            });
            alert('Esses dados não foram aceitos. Tente outros');
            return;
        }
        if (results) {
            localStorage.setItem('password', results.password);
            localStorage.setItem('name', results.name);
            localStorage.setItem('icon', results.icon ? results.icon : localStorage.getItem('icon'));
            navigate(`/account/${localStorage.getItem('user').split('#')[1]}`);
            return window.location.reload();
        }
    }
    useEffect(() => {
        if (!user) {
            get_user();
        }
    });
    return (
        <div className="column" style={{ justifyContent: 'center', height: '100vh' }}>
            <FaArrowCircleLeft onClick={() => navigate(-1)} className="back-dark" />
            <form className="form1" encType="multipart/form-data">
                <h3>{user ? user.hashtag : ''}</h3>
                <img className="user-icon" src={`${props.api.host}/icon/${user.icon}`} onError={() => props.functions.default_icon(0)} />
                <div className="row">
                    <label htmlFor="name" className="normal">
                        Name:{' '}
                    </label>
                    <input id="name" placeholder="Name" defaultValue={user ? user.name : ''} name="name" />
                </div>
                <div className="row">
                    <label htmlFor="password" className="normal">
                        Password:{' '}
                    </label>
                    <input id="password" defaultValue={user ? user.password : ''} placeholder="Password" name="password" type="password" />
                </div>

                <label htmlFor="icon" className="btn-light file-function">
                    Icon
                </label>
                <input id="icon" onChange={() => props.functions.label(0)} name="icon" type="file" />
                <button type="button" onClick={() => update()} className="btn-light">
                    Update
                </button>
            </form>
        </div>
    );
}
