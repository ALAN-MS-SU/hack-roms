import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/styles/box.css';
export default function Boxsearch(props) {
    const navigate = useNavigate();
    return (
        <div className="box" onClick={() => navigate(`/hack/${props.id}`)}>
            <img className="box-image" alt="without" />
            <h3>Name: {props.name}</h3>
            <h3>Category: {props.category}</h3>
            <h3>Creator: {props.creator}</h3>
        </div>
    );
}
