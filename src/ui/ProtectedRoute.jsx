import { useUrl } from "@/contexts/UrlContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { loading, isAuthenticated } = useUrl();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated && loading === false) {
      navigate("/auth");
    }
  }, [isAuthenticated, loading]);

  if (loading) return <p>Loading...</p>;

  if (isAuthenticated) return children;
}
