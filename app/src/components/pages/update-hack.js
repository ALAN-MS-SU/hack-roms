import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowCircleLeft } from 'react-icons/fa';
export default function Update(props) {
    const navigate = useNavigate();
    const { id } = useParams();
    const functions = props.functions;
    const [category, setCategory] = useState(false);
    const [hack, setHack] = useState(false);
    async function get_hack() {
        setHack(
            await fetch(`${props.api.host}/get-hack/${id}`, {
                method: 'get'
            })
                .then((results) => {
                    if (!results.ok) return console.log(results);
                    return results.json();
                })
                .catch((err) => {
                    if (err) return console.log(err);
                })
        );
    }
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
    async function update() {
        
        const form = document.querySelector('#form');
        const data = new FormData(form);
        data.append('user', localStorage.getItem('user'));
        data.append('password', localStorage.getItem('password'));
        data.append('old_cover', hack.cover);
        data.append('old_game', hack.rom);
        data.append('id', id);
        if (!data.get('category')) {
            data.append('category', hack.category);
        }
        const results = await fetch(`${props.api.host}/update-hack`, {
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
        if (!results) {
            functions.err();
            const input = document.querySelectorAll('input');
            input.forEach((input) => {
                if (input.name !== 'cover' && input.name !== 'game') return (input.value = hack[input.id]);
            });
            const select = document.querySelectorAll('select')[0];
            select.value = select.options[0].value;
            select.options[0].innerText = hack['category'];
            alert('Esses dados não foram aceitos. Tente outros');
            return functions.err();
        }
        if (results) return navigate(-1);
    }
    useEffect(() => {
        if (!hack) {
            get_hack();
        }
    });
    useEffect(() => {
        if (!category && hack) {
            req_category();

        }
    });
    return (
        <>
            <section id="update-hack" style={{backgroundImage:`url('${props.api.host}/cover/${hack.cover}')`}}>
                <div className="column" style={{ justifyContent: 'center', height: '100vh'}}>
                    <FaArrowCircleLeft onClick={() => navigate(-1)} className="back-dark" />
                    <form className="form1" id="form" encType="multipart/form-data">
                        <div className="row">
                            <label htmlFor="h_name" className="normal">
                                 Name:
                            </label>
                            <input defaultValue={hack ? hack.h_name : ''} name="name" id="h_name" placeholder="Name" />
                        </div>

                        <div className="row">
                            <label htmlFor="category" className="normal">
                                Category:
                            </label>
                            <select id="category" name="category">
                                <option value={hack ? hack.category : ''} selected disabled hidden>
                                    {hack ? hack.category : 'Category'}
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
                            <label htmlFor="original_game" className="normal">
                                 original:
                            </label>
                            <input defaultValue={hack ? hack.original_game : ''} type="text" id="original_game" name="original" placeholder="original-game" />
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
                        <button type="button" className="btn-light" onClick={() => update()}>
                            Send
                        </button>
                    </form>
                </div>
            </section>
        </>
    );
}
