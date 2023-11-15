import React, { Fragment } from "react";
import {TextField, Button, Typography} from '@mui/material'

const LoginPage = (props: any) => {
    const {setLogin, setPassword} = props;
    
   


    return (
        <Fragment>
            <Typography variant = 'h2' padding={3} fontFamily={'Poppins'} textAlign='center'>Авторизация</Typography>
            <TextField fullWidth={true} margin='normal'  label='login' variant='outlined' placeholder='Введите логин' onChange={(e) => setLogin(e.target.value)}/>
            <TextField fullWidth={true} margin='normal' type='password' label='password' variant='outlined' placeholder="Введите пароль" onChange={(e) => setPassword(e.target.value)}/>
            <Button type = 'submit' sx={{fontFamily:'Poppins', marginTop:2,marginBottom:2, width: '60%'}} variant="outlined">Войти</Button>

        </Fragment>
    );
};

export default LoginPage;