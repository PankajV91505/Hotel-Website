import { BrowserRouter } from 'react-router-dom';
import AppRouter from './router/AppRouter';
import AuthContextProvider from './contexts/AuthContext';
import './styles/tailwind.css';

function App() {
  return (
    <AuthContextProvider>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </AuthContextProvider>
  );
}

export default App;