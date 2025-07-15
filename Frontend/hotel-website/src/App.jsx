// import { BrowserRouter } from 'react-router-dom';
// import AppRouter from './router/AppRouter';
// import AuthContextProvider from './contexts/AuthContext';
// import './styles/tailwind.css';

// function App() {
//   return (
//     <AuthContextProvider>
//       <BrowserRouter>
//         <AppRouter />
//       </BrowserRouter>
//     </AuthContextProvider>
//   );
// }

// export default App;



import { Link } from 'react-router-dom';

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Hotel Booking App</h1>
        <p className="mb-4">Please sign up or log in to continue.</p>
        <div className="space-x-4">
          <Link to="/signup" className="text-blue-500 hover:underline">Sign Up</Link>
          <Link to="/login" className="text-blue-500 hover:underline">Login</Link>
        </div>
      </div>
    </div>
  );
}

export default App;