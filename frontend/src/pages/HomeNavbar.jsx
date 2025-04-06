import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import "./HomeNavbar.css"
import {useAuth} from '../context/authContext';

function HomeNavbar() {
  const {user} = useAuth();
  const {role} = user;

  const options = [];

  if (role === "cashier") {
    options.push(
      <NavDropdown title="Users" id="navbarScrollingDropdown" className="custom-nav-link" style={{color: "#292f63"}}>
        <NavDropdown.Item href="/create-user" className="custom-nav-link">Create User</NavDropdown.Item>
      </NavDropdown>
    );
  }

  if (role === "manager" || role === "superuser") {
    options.push(
      <NavDropdown title="Users" id="navbarScrollingDropdown" className="custom-nav-link" style={{color: "#292f63"}}>
        <NavDropdown.Item href="/create-user" className="custom-nav-link">Create User</NavDropdown.Item>
        <NavDropdown.Item href="/users" className="custom-nav-link">View Users</NavDropdown.Item>
      </NavDropdown>
    );
  }

  options.push(
    <>
      <Nav.Link href="/promotions" className="custom-nav-link">Promotions</Nav.Link>
      <Nav.Link href="/events" className="custom-nav-link">Events</Nav.Link>
      <Nav.Link href="/transactions" className="custom-nav-link">Transactions</Nav.Link>
      <Nav.Link href="/profile" className="custom-nav-link">Profile</Nav.Link>
    </>
  );

  return (
      <Navbar bg="#primary" data-bs-theme="light" fixed="top" style={{backgroundColor: "#ffffff"}}>
        <Container fluid style={{marginLeft: "5px", marginRight: "5px", width: "100%"}}>
          <Navbar.Brand href="/home" style={{color: "#292f63"}}>Home</Navbar.Brand>
          <Navbar.Collapse className="justify-content-end">
            <Nav>
              {options}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
  );
}

export default HomeNavbar;