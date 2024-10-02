import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/styles/box.css';
export default function Boxsearch(props) {
    const navigate = useNavigate();
    const box = useRef(false);
    useEffect(() => {
        if (box.current !== null) {
            box.current.classList.remove('init');
            setTimeout(() => {
                box.current.classList.add('init');
            }, 100);
        }
    });

    return (
        <div ref={box} className="box" onClick={() => navigate(`/hack/${props.id}`)}>
            <img src={`${props.api.host}/cover/${props.cover}`} alt="without" />
            <h3>Name: {props.name}</h3>
            <h3>Category: {props.category}</h3>
            <h3>Creator: {props.creator}</h3>
        </div>
    );
}
