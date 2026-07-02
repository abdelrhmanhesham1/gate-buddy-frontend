import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export function useAuthGuard() {
  const navigate = useNavigate();

  const requireAuth = (callback) => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      Swal.fire({
        icon: "info",
        title: "Login Required",
        text: "Please log in to access this feature.",
        confirmButtonText: "Go to Login",
        confirmButtonColor: "#002D6B",
        showCancelButton: true,
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) navigate("/login");
      });
      return;
    }
    if (callback) callback();
  };

  return { requireAuth };
}
