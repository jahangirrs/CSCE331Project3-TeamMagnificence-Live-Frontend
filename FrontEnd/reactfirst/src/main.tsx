import { createRoot } from 'react-dom/client'
import './index.css'
import Manager from './Manager.tsx'
import Customer from './Customer.tsx'
import Login from './Login.tsx'
import Cashier from './Cashier.tsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

//Create root element of document with all routes leading to separate Login, Manager, Customer, Cashier UI
createRoot(document.getElementById('root')!).render(

        <BrowserRouter>
            <Routes>
                <Route path = '/Manager' element={<Manager />}></Route>
                <Route path = '/Customer' element={<Customer />}></Route>
                <Route path = 'Cashier' element={<Cashier />}></Route>
                <Route path = '/' element={<Login />}></Route>
                </Routes>
            </BrowserRouter>

)

