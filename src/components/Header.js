import { React, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import "./header.css";
import { useTranslation } from "react-i18next";
import { Form, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import Bosta from "../images/bosta_en.png";

const Header = () => {
  const [t, i18l] = useTranslation();

  const [selectedItem, setSelectedItem] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState("");

  const changeLanguage = (lang) => {
    i18l.changeLanguage(lang);
    document.documentElement.lang = lang; // Set the `lang` attribute for accessibility
    document.documentElement.dir = i18l.dir(lang); // Update the `dir` attribute
  };

  const handleSelection = (item) => {
    setSelectedItem(item); // Update the selected item
    setDropdownOpen("");
  };

  const handleDropdownToggle = (id, isOpen) => {
    setDropdownOpen(isOpen ? id : ""); // Toggle dropdown open state
  };

  return (
    <Navbar className="navbar border-b-4" expand="lg">
      <Container className="border-b-4">
        <Navbar.Brand href="#home" className="text-danger">
          <img src={Bosta} className="image mx-2" alt="logo"></img>
          {t("title")}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto gap-5">
            {t("menu_bar.items", { returnObjects: true }).map((item, index) => (
              <Nav.Link
                key={index}
                href={`#${index}`}
                onClick={() => handleSelection(`menu_${index}`)}
                style={{
                  color: selectedItem === `menu_${index}` ? "red" : "black",
                  fontWeight:
                    selectedItem === `menu_${index}` ? "bold" : "normal",
                }}
              >
                {item.item_name}
              </Nav.Link>
            ))}
          </Nav>
          <Nav className="ms-auto gap-5">
            <NavDropdown
              title={t("menu_bar.track")}
              id="basic-nav-dropdown"
              href="#track"
              onToggle={(isOpen) => handleDropdownToggle("track", isOpen)}
              className={
                dropdownOpen === "track" ? "text-danger fw-bold" : "text-black"
              }
            >
              <Form className="d-flex flex-column w-100 justify-content text-center">
                <Form.Label className="mb-2 mx-2 text-center">
                  {t("menu_bar.track")}
                </Form.Label>

                <div className="d-flex justify-content-center text-center align-items-center">
                  <Form.Control
                    type="search"
                    className="mx-2 custom-input rounded-start-2 search-bar center"
                    aria-label="Search"
                  />
                  <Button variant="btn-sm " className="btn-danger mx-2 center">
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                  </Button>
                </div>
              </Form>
            </NavDropdown>

            <Nav.Link
              href="#login"
              onClick={() => handleSelection("login")}
              style={{
                color: selectedItem === "login" ? "red" : "black",
                fontWeight: selectedItem === "login" ? "bold" : "normal",
              }}
            >
              {t("menu_bar.login")}
            </Nav.Link>
            <NavDropdown
              title={t("menu_bar.language")}
              id="basic-nav-dropdown"
              href="#language"
              onToggle={(isOpen) => handleDropdownToggle("language", isOpen)}
              className={
                dropdownOpen === "language"
                  ? "text-danger fw-bold"
                  : "text-black"
              }
            >
              <Nav.Link
                href="#home"
                onClick={() => {
                  changeLanguage("ar");
                  handleSelection("ar");
                }}
                style={{
                  color: selectedItem === "ar" ? "red" : "black",
                }}
                className="text-center"
              >
                عربي
              </Nav.Link>
              <Nav.Link
                href="#link"
                onClick={() => {
                  changeLanguage("en");
                  handleSelection("en");
                }}
                style={{
                  color: selectedItem === "en" ? "red" : "black",
                }}
                className="text-center"
              >
                English
              </Nav.Link>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
