import React from 'react';
import Header from '../pieces/header';
import mario from '../../assets/images/mario.gif';
import Footer from '../pieces/footer';
import map from '../../assets/images/check-point2.gif';
import point from '../../assets/images/check-point.gif';
import star from '../../assets/images/stars-star.gif';
import '../../assets/styles/home.css';
import { useNavigate } from 'react-router-dom';
export default function Home(props) {
    const navigate = useNavigate();
    return (
        <>
            <Header functions={props.functions} img={mario} api={props.api} />
            <section id="home">
                <img className="star" src={star} alt="star" />
                <div className="welcome">
                    <h1>
                        <span>Welcome</span>
                    </h1>
                    <h1>
                        <span>To website</span>
                    </h1>
                </div>
            </section>
            <section id="experience" className="column">
                <h2>Unleash your imagination</h2>
                <div className="row">
                    <div className="column">
                        <h1>
                            <span>Post your hack roms</span>
                        </h1>
                        <img onClick={() => navigate('/new-hack')} src={map} alt="image-Post" />
                    </div>
                    <div className="column">
                        <h1>
                            <span>Dowload hack roms from other people</span>
                        </h1>
                        <img onClick={() => navigate('/search')} src={point} alt="image-dowload" />
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
}
