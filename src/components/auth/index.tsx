import React, {useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom'
import LoginPage from './login';
import './style.scss'
import {Box} from '@mui/material'
import axios from 'axios';
import UsersList from '../userList';
import checkTokenValidity from './login/checkTokenValidity';


const AuthRootComponent = () => {
    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')
    const [authToken, setAuthToken] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    
    const location = useLocation();

    

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const loginRegex = new RegExp('^[\\w.@+-]+$');
        const passwordRegex = new RegExp('^(?=.*[A-Z])(?=.*\\d).{8,}$');


        // Проверить логин и пароль
        
        
        try {
            if (!loginRegex.test(login)) {
                alert('Ошибка в логине')
                return;
            }
            if (!passwordRegex.test(password)) {
                alert('Ошибка в пароле')
                return;
            }
    
            
            const response = await axios.post('https://test-assignment.emphasoft.com/api/v1/login/', {
                username: login,
                password: password,
            });
            const token = response.data.token;
            setAuthToken(token);
            localStorage.setItem('authtoken',`Token ${token}`)
            console.log(token);
            const tokenIsValid = await checkTokenValidity(response.data.token);
                if (tokenIsValid) {
                    navigate('/userlist');
                } else {

                setError('Невалидный токен');            
                }
            
        } catch (error) {
          if (axios.isAxiosError(error) && error.response) {
            setError(`Ошибка аутентификации: ${error.response.status}`);
            alert('Неверные данные')
          } else {
            setError('Ошибка аутентификации');
          }
          console.error(error);
        }
      };

   return (
    <div className='root' >
        <form className='form' onSubmit={handleLogin}>
            <Box
                display='flex'
                justifyContent='center'
                alignItems='center'
                flexDirection='column'
                maxWidth={800}
                margin-top={'50px'}
                padding={5}
                borderRadius={5}
                boxShadow={'5px 5px 10px #ccc'}
            >
                {location.pathname === '/login' ? <LoginPage setLogin={setLogin} setPassword={setPassword}/> : 
                location.pathname === '/userlist'  && authToken ? <UsersList authToken={authToken} />: null}
            </Box>
        </form>
   </div>
   );   
}

export default AuthRootComponent;