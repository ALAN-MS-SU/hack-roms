import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowCircleLeft } from 'react-icons/fa';
export default function Create(props) {
    const navigate = useNavigate();
    const functions = props.functions;
    const [category, setCategory] = useState(false);
    async function req_category() {
        setCategory(
            await fetch(`${props.api.host}/category`, {
                method: 'get'
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
    useEffect(() => {
        if (!category) {
            req_category();
        }
    });
    async function create_hack() {
        const hashtag = localStorage.getItem('user') || false;
        const password = localStorage.getItem('password') || false;
        if (!hashtag || !password) return functions.err();
        const form = document.querySelector('#form');
        const data = new FormData(form);
        data.append('user', hashtag);
        data.append('password', password);
        const results = await fetch(`${props.api.host}/create-hack`, {
            method: 'post',
            body: data
        })
            .then((data) => {
                if (!data.ok) return console.log(data);
                return data.json();
            })
            .catch((err) => {
                if (err) return console.log(err);
            });
        console.log(results);
        if (!results) {
            alert('Esses dados não foram aceitos. Tente outros');
            return functions.err();
        }
        return navigate(`/home/${results.user}`);
    }
    return (
        <div className="new-hack" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
            <FaArrowCircleLeft onClick={() => navigate(-1)} className="back-dark" />
            <form className="form1" id="form" encType="multipart/form-data">
                <div className="row">
                    <label htmlFor="name" className="normal">
                        Name:
                    </label>
                    <input name="name" id="name" placeholder="Name" />
                </div>

                <div className="row">
                    <label htmlFor="name" className="normal">
                        Category:
                    </label>
                    <select id="category" name="category">
                        <option value="" selected disabled hidden>
                            Category
                        </option>
                        {category
                            ? category.map((category) => (
                                  <>
                                      <option className="option" value={category.category}>
                                          {category.category}
                                      </option>
                                  </>
                              ))
                            : null}
                    </select>
                </div>

                <div className="row">
                    <label htmlFor="original" className="normal">
                        original:
                    </label>
                    <input type="text" id="original-game" name="original" placeholder="original-game" />
                </div>
                <div className="row" name="center">
                    <label htmlFor="Cover" className="btn-light file-function">
                        Cover
                    </label>
                    <input id="Cover" name="cover" type="file" onChange={() => functions.label(0)} />
                    <label htmlFor="Game file" className="btn-light file-function">
                        Game file
                    </label>
                    <input id="Game file" name="game" type="file" onChange={() => functions.label(1)} />
                </div>
                <button type="button" className="btn-light" onClick={() => create_hack()}>
                    Send
                </button>
            </form>
        </div>
    );
}
