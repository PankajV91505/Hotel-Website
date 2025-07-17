import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Callback() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const accessToken = params.get("access_token");
    if (accessToken) {
      localStorage.setItem("token", accessToken);
      navigate("/dashboard/rooms");
    } else {
      navigate("/login");
    }
  }, [navigate, location]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <p>Redirecting...</p>
    </div>
  );
}

export default Callback;