import {BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";
import Profile from "./pages/Profile";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import CreateListing from "./pages/CreateListing";
import Listings from "./pages/Listings";
import ViewList from "./pages/ViewList";

import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";

function App() {

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/about" element={<About />}></Route>
        <Route path="/sign-in" element={<SignIn />}></Route>
        <Route path="/sign-up" element={<SignUp />}></Route>
        <Route path="/view-list/:listId" element={<ViewList /> } ></Route>
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />}></Route>
          <Route path="/create-listing" element={<CreateListing />}></Route>
          <Route path="/update-listing/:listId" element={<CreateListing />}> </Route>
          <Route path="/listings" element={<Listings />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
