import React, { useState } from 'react'
import { Container, Row } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import axiosInstance from '../axiosInstance';
const Login = () => {
     const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const {login} = useAuth();

    const handleSubmit =async e=>{
        e.preventDefault();
        const loginData = {
            username,
            password
        }
        console.log(loginData);

          try {
            const response = await axiosInstance.post('http://localhost:8080/login', loginData);
            if (response.status === 200){
                login();
                navigate('/')
            } else {
               
                alert( 'Login failed for user. Please retry!')
            }
        } catch(error) {
            toast.error(error);
            // alert('And error occurred. please retry')
        }
    }


  return (
    <Container className='d-flex flex-column align-items-center w-100' style={{height:"90vh"}}>
      <h1 className='m-5'>Login</h1>
       <Form className='w-50' onSubmit={handleSubmit}>

      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label>Username </Form.Label>
        <Form.Control type="text" placeholder="username" 
        name='username'
        value={username}
        onChange={e=>setUsername(e.target.value)}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="password" 
            name='password'
            value={password}
            onChange={e=>setPassword(e.target.value)}
        />
      </Form.Group>
    
      <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
        <Form.Control type="submit" value="Login" className='bg bg-primary text-white' />
      </Form.Group>
    </Form>
    <p className='d-flex'>
        <span>Don't have an account ! </span><Link to="/register">Register</Link>
    </p>
    </Container>
  )
}

export default Login