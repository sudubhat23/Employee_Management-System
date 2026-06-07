
import React, { useEffect, useState } from 'react'
import { Container } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '../axiosInstance';
const UpdateEmployee = () => {
  const[id,setId]=useState("")
const[name , setName]=useState("");
const[age , setAge] =useState("");
const[dept , setDept]=useState("");
const navigate = useNavigate();
const {empid} = useParams();
useEffect(()=>{
  axiosInstance.get(`http://localhost:8080/employee/${empid}`)
  .then(res=>{
    const data = res.data;
    // console.log(data);
    setId(data.id);
    setName(data.name);
    setAge(data.age);
    setDept(data.dept);
  }).catch(err=>console.log(err));
},[])


  let handleSubmit=async e=>{
    e.preventDefault();
    const formData={
      id,
      name,
      age,
      dept
    };
    console.log(formData);
    try{
      await axiosInstance.put(`http://localhost:8080/employee/update` , formData);
      toast.success("data updated successfully");
      navigate("/")
    }
    catch(err)
    {
      toast.error(err);
    }
  }
  return (
   <Container className='d-flex flex-column align-items-center w-100' style={{height:"90vh"}}>
      <h1 className='m-5'>Update Employee Details</h1>
       <Form className='w-50' onSubmit={handleSubmit}>
         <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label>Employee Id</Form.Label>
        <Form.Control type="text" placeholder="employee id" 
        readOnly
        name='id'
        value={id}
        onChange={e=>setId(e.target.value)}
        />
      </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label>Employee name</Form.Label>
        <Form.Control type="text" placeholder="employee name" 
        name='name'
        value={name}
        onChange={e=>setName(e.target.value)}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label>Employee age</Form.Label>
        <Form.Control type="text" placeholder="employee age" 
        name='age'
        value={age}
         onChange={e=>setAge(e.target.value)}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
        <Form.Label>Department</Form.Label>
        <Form.Control type="text" placeholder="employee department" 
        name='dept'
        value={dept}
         onChange={e=>setDept(e.target.value)}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
        <Form.Control type="submit" value="Update Employee" className='bg bg-primary text-white' />
      </Form.Group>
    </Form>
    <Link to="/">Back to Home</Link>
    </Container>
  )
}

export default UpdateEmployee