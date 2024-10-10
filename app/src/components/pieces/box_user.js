import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/styles/box.css';
export default function Box(props) {
    const navigate = useNavigate();
    async function delete_hack() {
        const data = new FormData();
        data.append('id', props.id);
        data.append('user', localStorage.getItem('user'));
        data.append('password', localStorage.getItem('password'));
        data.append('cover', props.cover);
        data.append('game', props.game);
        await fetch(`${props.api.host}/delete-hack`, {
            method: 'delete',
            body: data
        })
            .then((results) => {
                if (!results.ok) return console.log(results);
            })
            .catch((err) => {
                if (err) return console.log(err);
            });
        return window.location.reload();
    }
    console.log(props);
    return (
        <>
            <div className="box">
                <img className="box-image" />
                <h3>{props.name}</h3>
                <div className="row">
                    <button onClick={() => navigate(`/update-hack/${props.id}`)} className="btn-dark">
                        Update
                    </button>
                    <button className="btn-dark" onClick={() => delete_hack()}>
                        Delete
                    </button>
                </div>
            </div>
        </>
    );
}
