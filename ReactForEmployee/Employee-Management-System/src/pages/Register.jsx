import React, { useState } from 'react'
import { Container, Row } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosInstance';
import { toast } from 'react-toastify';

const Register = () => {

     const [formData, setformData] = useState({
    firstname: "",
    lastname: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();
  // console.log(formData);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
    alert("Password not matched");
    return;
}
    try {
      const response = await axiosInstance.post(
        "http://localhost:8080/register",
        formData,
      );

      if (response.status === 201) {
        navigate("/login");
      } else {
        alert("Registration Failed");
      }

      toast.success("registration successfull");
    } catch (err) {
      console.log("Error during register " + err);
      toast.error(err.message());
    }
  };

  const handlechange = (e) => {
    setformData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
      <Container className='d-flex flex-column align-items-center w-100' style={{height:"90vh"}}>
      <h1 className='m-5'>Register User</h1>
       <Form className='w-50' onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label>First Name</Form.Label>
        <Form.Control type="text" placeholder="first name" 
        name='firstname'
        value={formData.firstname}
        onChange={handlechange}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label>Last Name</Form.Label>
        <Form.Control type="text" placeholder="last name" 
        name='lastname'
        value={formData.lastname}
        onChange={handlechange}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label>Username </Form.Label>
        <Form.Control type="text" placeholder="username" 
        name='username'
        value={formData.username}
        onChange={handlechange}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="password" 
            name='password'
            value={formData.password}
            onChange={handlechange}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
        <Form.Label>Confrim Password</Form.Label>
        <Form.Control type="password" placeholder="confirm password" 
            name='confirmPassword'
            value={formData.confirmPassword}
            onChange={handlechange}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
        <Form.Control type="submit" value="Register" className='bg bg-primary text-white' />
      </Form.Group>
    </Form>
    <p className='d-flex'>
        <span>Already have account ! </span><Link to="/login"> Login</Link>
    </p>
    </Container>
  )
}

export default Register