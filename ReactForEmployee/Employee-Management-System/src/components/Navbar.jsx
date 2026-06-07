import React from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
const NavbarComp = () => {
  const {isAuthenticated,login , logout} = useAuth();
  const navigate = useNavigate();

  const logoutUser = () => {
    logout()
    navigate("/login")
  }

  return (
   <Navbar expand="lg" className="bg-body-tertiary">
  <Container>
    <Navbar.Brand href="/">Employee CRUD</Navbar.Brand>

    <Navbar.Toggle aria-controls="basic-navbar-nav" />

    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="me-auto">
        <Nav.Link href="/">View Employee</Nav.Link>
        <Nav.Link href="/addEmp">Add Employee</Nav.Link>
        <Nav.Link href="/login">Login</Nav.Link>
        <Nav.Link href="/register">Register</Nav.Link>
      </Nav>

      <Button onClick={logoutUser}>Logout</Button>
    </Navbar.Collapse>
  </Container>
</Navbar>
  )
}

export default NavbarComp