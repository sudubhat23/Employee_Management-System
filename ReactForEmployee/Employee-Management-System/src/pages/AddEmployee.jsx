
import React, { useState } from 'react'
import { Container } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '../axiosInstance';

const AddEmployee = () => {
  const[formData , setFormData] = useState({
    name:"",
    age:"",
    dept:""
  });
const navigate = useNavigate();

  let handleSubmit = async e =>{
    e.preventDefault();
    console.log(formData);
   try{
    await axiosInstance.post("http://localhost:8080/employee/add" , formData);
    toast.success("data submitted successfully");
navigate("/")
   }
   catch(err){
    toast.error(err);
   }
  };

  let handleInputChange = e =>{
    setFormData({...formData , [e.target.name]:e.target.value});
  }
  return (
    <Container className='d-flex flex-column align-items-center w-100' style={{height:"90vh"}}>
      <h1 className='m-5'>Add Employee Details</h1>
       <Form className='w-50' onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label>Employee name</Form.Label>
        <Form.Control type="text" placeholder="employee name" 
        name='name'
        value={formData.name}
        onChange={handleInputChange}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label>Employee age</Form.Label>
        <Form.Control type="text" placeholder="employee age" 
        name='age'
        value={formData.age}
         onChange={handleInputChange}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
        <Form.Label>Department</Form.Label>
        <Form.Control type="text" placeholder="employee department" 
        name='dept'
        value={formData.dept}
         onChange={handleInputChange}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
        <Form.Control type="submit" value="Add Employee" className='bg bg-primary text-white' />
      </Form.Group>
    </Form>
    <Link to="/">Back to Home</Link>
    </Container>
  )
}

export default AddEmployee