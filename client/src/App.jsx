import React from 'react'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import Home from './Pages/Home'
import Dashboard from './Pages/Dashboard'
import SignIn from './Pages/Signin'
import SignUp from './Pages/Signup'
import Header from './Component/Header'
import AboutUs from './Pages/Aboutus'
import Footer from './Component/Footer'
import PrivateRoute from './Component/PrivateRoute'
import OnlyAdmin from './Component/OnlyAdmin'
import CreatePost from './Component/CreatePost'
import Updatepost from './Component/Updatepost'
import PostPage from './Pages/PostPage'
import ScrollTop from './Component/ScrollTop'
import CommentPosts from './Component/CommentPosts'
import Search from './Pages/Search'
import Projects from './Pages/Projects'


function App() {
  return (
   <BrowserRouter>
   <ScrollTop />
         <Header />
      <Routes>
      <Route path='/comment' element={<CommentPosts />} />
         <Route path='/' element={<Home />} />
         <Route element={<PrivateRoute />}>
             <Route path='/dashboard' element={<Dashboard />} />
         </Route>
         <Route element={<OnlyAdmin />}>
             <Route path='/create-post' element={<CreatePost />} />
             <Route path='/update-post/:postId' element={<Updatepost />} />
         </Route>
         <Route path='/signup' element={<SignUp />} />
         <Route path='/search' element={<Search />} />
         <Route path='/signin' element={<SignIn />} />
         <Route path='/aboutus' element={<AboutUs />} />
         <Route path='/post/:slug' element={<PostPage />} />
         <Route path='/project' element={<Projects />} />
      </Routes>
      <Footer />
   </BrowserRouter>
  )
}

export default App
