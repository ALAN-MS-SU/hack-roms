import React from 'react';
import Header from '../pieces/header';
import mushroom from '../../assets/images/gold-mushroom.gif';
import Footer from '../pieces/footer';
import how_f from '../../assets/images/about1.jpg';
import how_c from '../../assets/images/about2.gif';
import settings from '../../assets/images/about3.gif';
import '../../assets/styles/about.css';
export default function About(props) {
    return (
        <>
            <Header api={props.api} img={mushroom} functions={props.functions} />
            <section id="about" className="column">
                <div className="row">
                    <img src={how_f} alt="" />
                    <article>
                        <details>
                            <summary>
                                <h3>How does this function?</h3>
                            </summary>
                            <h3>Text here</h3>
                        </details>
                    </article>
                </div>
                <div className="row">
                    <article className="web-how">
                        <details>
                            <summary>
                                <h3>How create your hack rom</h3>
                            </summary>
                            <p>Text here</p>
                        </details>
                    </article>
                    <img src={how_c} alt="" />
                    <article className="mobile-how">
                        <details>
                            <summary>
                                <h3>How create your hack rom</h3>
                            </summary>
                            <h3>Text here</h3>
                        </details>
                    </article>
                </div>
                <div className="row">
                    <img src={settings} alt="" />

                    <article>
                        <details>
                            <summary>
                                <h3>User settings</h3>
                            </summary>
                            <h3>Text here</h3>
                        </details>
                    </article>
                </div>
            </section>
            <Footer />
        </>
    );
}
