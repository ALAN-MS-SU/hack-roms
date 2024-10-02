import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import Home from './components/pages/home';
import Login from './components/pages/login';
import Error from './components/pages/error';
import New_hack from './components/pages/new-hack';
import Search from './components/pages/search';
import Account from './components/pages/account';
import Update_user from './components/pages/update-user';
import Update_hack from './components/pages/update-hack';
import icon_default from './assets/images/default.jpeg';
import About from './components/pages/about';
import Hack from './components/pages/hack';
import './assets/styles/global.css';
function App() {
    class Api {
        host = process.env.REACT_APP_API_HOST;
    }
    class Functions {
        err() {
            const inputs = document.querySelectorAll('input') || [];
            const select = document.querySelectorAll('select') || [];
            const array = Array.from(inputs);
            const array_select = Array.from(select);
            const file = document.querySelectorAll('.file-function') || false;
            const array_files = Array.from(file);
            array.map((input) => {
                input.placeholder = 'ERR';
                input.style.border = 'solid red 1.5px';
                input.value = '';
                return null;
            });
            array_select.map((select) => {
                select.style.border = 'solid red 1.5px';
                return null;
            });
            if (file)
                array_files.map((file) => {
                    file.innerHTML = file.getAttribute('for');

                    return null;
                });
        }
        default_placeholder() {
            const inputs = document.querySelectorAll('input') || [];
            const select = document.querySelectorAll('select') || [];
            const array = Array.from(inputs);
            const array_select = Array.from(select);
            array.map((input, index) => {
                const label = document.querySelectorAll('label')[index].innerText;
                input.placeholder = label;
                input.style.border = 'none';
                input.value = null;
                return null;
            });
            array_select.map((select) => {
                select.style.border = 'none';
                return null;
            });
        }
        label(index) {
            const label_icon = document.querySelectorAll('.file-function')[index];
            return (label_icon.innerHTML = 'Selected');
        }
        default_icon(index) {
            const icon = document.querySelectorAll('.user-icon')[index];
            icon.src = icon_default;
        }
    }
    const router = createBrowserRouter([
        {
            path: '/',
            element: <Login api={new Api()} functions={new Functions()} />,
            errorElement: <Error />
        },
        {
            path: '/:type',
            element: <Login api={new Api()} functions={new Functions()} />,
            errorElement: <Error />
        },
        {
            path: '/home/:user',
            element: <Home functions={new Functions()} api={new Api()} />
        },
        {
            path: '/new-hack',
            element: <New_hack api={new Api()} functions={new Functions()} />,
            errorElement: <Error />
        },
        {
            path: '/search',
            element: <Search functions={new Functions()} api={new Api()} />,
            errorElement: <Error />
        },
        {
            path: '/search/:value',
            element: <Search functions={new Functions()} api={new Api()} />,
            errorElement: <Error />
        },
        {
            path: '/account/:user',
            element: <Account functions={new Functions()} api={new Api()} />
        },
        {
            path: '/update-user',
            element: <Update_user api={new Api()} functions={new Functions()} />
        },
        {
            path: '/update-hack/:id',
            element: <Update_hack api={new Api()} functions={new Functions()} />
        },
        {
            path: '/About',
            element: <About api={new Api()} functions={new Functions()} />
        },
        {
            path: '/hack/:id',
            element: <Hack api={new Api()} functions={new Functions()} />
        },
        {
            path: '/exit',
            element: <Navigate to="/" />
        }

        // {
        //    path: "/",
        //    element: <Navigate to="/home/tangle"/>,
        //    errorElement: <Error/>,
        //    children:[
        //     {
        //         path: "/",
        //    element: <App/>,
        //     }
        //    ]
        // }
    ]);
    return (
        <>
            <RouterProvider router={router} />
        </>
    );
}

export default App;
