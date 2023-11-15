import React, { Fragment } from "react";
import {TextField, Button, Typography} from '@mui/material'

const RegisterPage = (props: any) => {
    const {setLogin, setName, setSurname, setPassword, setConfirmedPassword} = props;
    
    return (
        <Fragment>
        <Typography variant = 'h2' padding={3} fontFamily={'Poppins'} textAlign='center'>Регистрация</Typography>
        <TextField fullWidth={true} margin='normal'  label='login' variant='outlined' placeholder='Введите логин' onChange={(e) => setLogin(e.target.value)}/>
        <TextField fullWidth={true} margin='normal' label='name' variant='outlined' placeholder="Введите Ваше имя" onChange={(e) => setName(e.target.value)}/>
        <TextField fullWidth={true} margin='normal' label='surname' variant='outlined' placeholder="Введите Вашу фамилию" onChange={(e) => setSurname(e.target.value)}/>
        <TextField type = 'password' fullWidth={true} margin='normal' label='password' variant='outlined' placeholder="Введите пароль" onChange={(e) => setPassword(e.target.value)}/>
        <TextField type = 'password' fullWidth={true} margin='normal' label='password' variant='outlined' placeholder="Повторите пароль" onChange={(e) => setConfirmedPassword(e.target.value)}/>
        <Button type ='submit' sx={{fontFamily:'Poppins', marginTop:2,marginBottom:2, width: '60%'}} variant="outlined">Зарегистрироваться</Button>
        <Typography variant = 'body1' fontFamily={'Poppins'} textAlign='center'>Уже есть аккаунт?<span className = "registerLink">Авторизоваться</span></Typography>

    </Fragment>
    );
};

export default RegisterPage;