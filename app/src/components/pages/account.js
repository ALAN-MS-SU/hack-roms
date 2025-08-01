import React, { useEffect, useRef, useState } from 'react';
import { FaArrowCircleLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../../assets/styles/user.css';
import Hacks from '../pieces/hacks_loding';
export default function Account(props) {
    const navigate = useNavigate();
    const user = useRef();
    const [hacks, setHacks] = useState(false);
    user.current = {
        hashtag: localStorage.getItem('user') || false,
        name: localStorage.getItem('name') || false,
        password: localStorage.getItem('password') || false,
        icon: localStorage.getItem('icon') || false,
        exists: false
    };
    async function get_user() {
        const data = new FormData();
        data.append('password', user.current.password);
        data.append('user', user.current.hashtag);
        setHacks(
            await fetch(`${props.api.host}/infs-hacks`, {
                method: 'post',
                body: data
            })
                .then((data) => {
                    if (!data.ok) return console.log(data);
                    return data.json();
                })
                .catch((err) => {
                    if (err) return console.log(err);
                })
        );
    }
    async function delete_user() {
        const data = new FormData();
        data.append('user', user.current.hashtag);
        data.append('password', user.current.password);
        const results = await fetch(`${props.api.host}/delete-user`, {
            method: 'delete',
            body: data
        })
            .then((results) => {
                if (!results.ok) return console.log(results);
                return results.json();
            })
            .catch((err) => {
                if (err) return console.log(err);
            });
        if (results) {
            localStorage.clear();
            navigate('/exit');
        }
    }
    function log_off() {
        localStorage.clear();
        navigate('/');
    }
    function lazy_loading() {
        const boxes = Array.from(document.querySelectorAll('.box-image'));
        const init = Array.from(document.querySelectorAll('.box'));

        boxes.map((box, index) => {
            if (box.getBoundingClientRect().top < window.innerHeight) {
                box.src = `${process.env.REACT_APP_API_HOST}/cover/${hacks[index].cover}`;
                init[index].classList.add('init');
            }
        });
    }
    window.onscroll = () => lazy_loading();
    useEffect(() => {
        if (!hacks) {
            get_user();
        }
        lazy_loading();
    });
    return (
        <section id="user">
            <button onClick={() => log_off()} style={{ position: 'absolute', right: -10, borderRadius: 0, top: -10, width: '100px', padding: '15px' }} className="btn-dark">
                Log off
            </button>
            <FaArrowCircleLeft onClick={() => navigate(-1)} className="back-light" />
            <div className="row border">
                <div className="web-user column">
                    <h3>{user.current.hashtag}</h3>
                    <h3>{user.current.name}</h3>
                </div>
                <img className="user-icon" src={`${props.api.host}/icon/${user.current.icon}`} onError={() => props.functions.default_icon(0)} alt="" />
                <div className="web-user column">
                    <button onClick={() => navigate('/update-user')} className="btn-dark">
                        Update
                    </button>
                    <button onClick={() => delete_user()} className="btn-dark">
                        Delete
                    </button>
                </div>
                <div className="mobile-user">
                    <div className="column">
                        <h3>{user.current.hashtag}</h3>
                        <h3>{user.current.name}</h3>
                    </div>
                    <div className="column">
                        <button onClick={() => navigate('/update-user')} className="btn-dark">
                            Update
                        </button>
                        <button onClick={() => delete_user()} className="btn-dark">
                            Delete
                        </button>
                    </div>
                </div>
            </div>
            <h1>{hacks.length > 0 ? 'Your hacks' : "You haven't hacks"}</h1>
            {hacks.length > 0 ? <Hacks api={props.api} hacks={hacks} /> : <div id="error"></div>}
        </section>
    );
}
