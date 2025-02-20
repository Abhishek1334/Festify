import Homepage from "./pages/Homepage"
import Events from "./pages/Events"
import Login from "./pages/Login"
import Signup from "./pages/Signup"

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Homepage />,
  },
  {
    path: "/events",
    element: <Events/>,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path:"/signup",
    element:<Signup/>
  }
]);


function App() {
  
  return (
    <>
      
        <RouterProvider router={router} />

    </>
  )
}

export default App
