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
                            <h3>
                                This site is a hub for Super Nintendo ROM hacks, inspired by the look of Super Mario World. Use the search bar above to browse available hacks. You can
                                explore, read details, and download patches. The “Create” tab lets you submit your own projects. The map is just for style—nostalgia included!
                            </h3>
                        </details>
                    </article>
                </div>
                <div className="row">
                    <article className="web-how">
                        <details>
                            <summary>
                                <h3>How create your hack rom</h3>
                            </summary>
                            <p>
                                Want to create your own Super Mario World hack? Start by downloading Lunar Magic, the most popular level editor for SMW. With it, you can design levels,
                                modify graphics, and add custom features. Once your hack is ready, head to the "Create" tab to share it with the community!
                            </p>
                        </details>
                    </article>
                    <img src={how_c} alt="" />
                    <article className="mobile-how">
                        <details>
                            <summary>
                                <h3>How create your hack rom</h3>
                            </summary>
                            <h3>
                                Want to create your own Super Mario World hack? Start by downloading Lunar Magic, the most popular level editor for SMW. With it, you can design levels,
                                modify graphics, and add custom features. Once your hack is ready, head to the "Create" tab to share it with the community!
                            </h3>
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
                            <h3>
                                Manage your profile and preferences here. Change your username, update your avatar, and adjust notification settings. You can also view your submitted hacks
                                and saved favorites. Everything’s stored safely in your account—just like a trusty save file!
                            </h3>
                        </details>
                    </article>
                </div>
            </section>
            <Footer />
        </>
    );
}
