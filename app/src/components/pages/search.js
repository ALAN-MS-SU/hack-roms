import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import mario_yoshi from '../../assets/images/mario-yoshi.gif';
import '../../assets/styles/search.css';
import Box from '../pieces/box-search';
import Footer from '../pieces/footer';
import Header from '../pieces/header';
export default function Search(props) {
    const navigate = useNavigate();
    const results = useRef(false);
    async function req_hacks(value) {
        if (value) {
            results.current = await fetch(`${props.api.host}/search/${value}`, {
                method: 'get'
            })
                .then((data) => {
                    if (!data.ok) return console.log(data);
                    return data.json();
                })
                .catch((err) => {
                    if (err) return console.log(err);
                });
            navigate(`/search/${value}`);
        }
    }
    function boxes() {
        console.log(results.current);
        if (!results.current)
            return (
                <div className="column">
                    <h1>Type something</h1>
                </div>
            );
        if (results.current.length < 1)
            return (
                <div className="column">
                    <h1>Not found</h1>
                </div>
            );
        return (
            <div className="container">
                {results.current.map((box, key) => {
                    return (
                        <Box
                            key={key}
                            id={box.id}
                            category={box.category}
                            api={props.api}
                            cover={box.cover}
                            name={box.h_name}
                            creator={box.creator !== null ? box.creator : 'Deleted user'}
                        />
                    );
                })}
            </div>
        );
    }

    function lazy_loading() {
        const boxes = Array.from(document.querySelectorAll('.box-image'));
        const init = Array.from(document.querySelectorAll('.box'));
        boxes.map((box, index) => {
            if (box.getBoundingClientRect().top < window.innerHeight) {
                box.src = `${process.env.REACT_APP_API_HOST}/cover/${results.current[index].cover}`;
                init[index].classList.add('init');
            }
        });
    }

    window.onscroll = () => lazy_loading();
    useEffect(() => lazy_loading());

    return (
        <>
            <Header functions={props.functions} focus={true} search={req_hacks} api={props.api} img={mario_yoshi} />
            <section id="search-section">{boxes()}</section>
            <Footer />
        </>
    );
}
