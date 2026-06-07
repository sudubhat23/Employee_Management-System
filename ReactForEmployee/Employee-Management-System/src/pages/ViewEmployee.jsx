import React, { useEffect, useState } from 'react'
import { Container } from 'react-bootstrap'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const ViewEmployee = () => {

    const[employees , setEmployees] = useState([]);

    const navigate = useNavigate();

    const fetchEmployee= async()=>{
        const url = "http://localhost:8080/employee/all";
        const res = await axios.get(url);
        // console.log(res.data);
        setEmployees(res.data);
    };

    useEffect(()=>{
        fetchEmployee();
    },[]);

    // to delete employee based on id
    const deleteEmp = async (id) =>{
       try{
        //  let url = "http://localhost:8080/deleteEmp/";
        // let x = await axios.delete(url+id);
        // console.log(x);
        await axios.delete(`http://localhost:8080/employee/delete/${id}`);
        fetchEmployee();
       }
       catch(err){
        console.log(err);
       }
    }

    // to navigate into update component
    const handleUpdate = id=>{
        navigate(`/updateEmp/${id}`)
    }
  return (
    <Container>
        <Row>
        <Col className='mt-4 mb-2 d-flex align-items-center justify-content-center'><h1>View Employee Details</h1></Col>
      </Row>
      <Row>
        <Col>
         <Link to='/addEmp' className='p-3 bg-success
          mb-3 d-inline-block
          rounded-2
          text-white
          text-decoration-none
          '>Add Employee</Link>
        </Col>
      </Row>
      <Row>
        <Col>
        {
            employees && employees.length>0 ? (
                 <Table striped bordered hover className='text-center'>
      <thead>
        <tr>
          <th>Id</th>
          <th>Name</th>
          <th>Age</th>
          <th>Department</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
       {
        employees && employees.map((emp , i)=>{
            return(
                <tr key={i}>
                    <td>{emp.id}</td>
                    <td>{emp.name}</td>
                    <td>{emp.age}</td>
                    <td>{emp.dept}</td>
                    <td>
                         <Button onClick={()=>handleUpdate(emp.id)} variant="primary" className='me-3'>Edit</Button>
                        <Button onClick={()=>deleteEmp(emp.id)} variant="danger">Delete</Button>
                    </td>
                </tr>
            )
        })
       }
      </tbody>
    </Table>
            ) : <h1>No data available</h1>
        }
        
        </Col>
      </Row>
        </Container>
  )
}

export default ViewEmployee