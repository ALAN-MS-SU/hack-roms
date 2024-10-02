import React, { useEffect, useState } from 'react';
import Header from '../pieces/header';
import shell from '../../assets/images/shell.gif';
import Footer from '../pieces/footer';
import { useParams } from 'react-router-dom';
import { FaLongArrowAltRight } from 'react-icons/fa';
export default function Hack(props) {
    const [hack, setHack] = useState(false);
    const { id } = useParams();
    async function get_hack() {
        setHack(
            await fetch(`${props.api.host}/view/${id}`, {
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
    useEffect(() => {
        if (!hack) {
            get_hack();
        }
    });
    return (
        <>
            <Header img={shell} api={props.api} functions={props.functions} />
            <section
                style={{
                    backgroundImage: `url('${props.api.host}/cover/${hack.cover}')
            `
                }}
                id="hack"
            >
                <div id="infs">
                    <h3 style={{ fontSize: '150%' }}>ID: {hack.id}</h3>
                    <div className="row">
                        <div className="column">
                            <h3>Name:</h3>
                            <h1 style={{ fontFamily: 'arial' }}>{hack.h_name}</h1>
                        </div>
                        <div className="column">
                            <h3>Category:</h3>
                            <h1 style={{ fontFamily: 'arial' }}>{hack.category}</h1>
                        </div>
                    </div>
                    <div className="row">
                        <h1>Creator:</h1>
                        <div className="column">
                            <img className="user-icon" src={`${props.api.host}/icon/${hack.icon}`} alt="" onError={() => props.functions.default_icon(2)} />
                            <div style={{ gap: '10px' }} className="column">
                                <h3 style={{ fontSize: '150%' }}>{hack.creator}</h3>
                                <h3 style={{ fontSize: '150%' }}>{hack.u_name}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <h1 name={'rom'}>{'ROM'}</h1>
                        <FaLongArrowAltRight className="arrow" name={'rom'} />
                        <button type="button" className="btn-dark">
                            <a href={`${props.api.host}/download/${hack.rom}/${hack.h_name}`}>Dowload</a>
                        </button>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
}
