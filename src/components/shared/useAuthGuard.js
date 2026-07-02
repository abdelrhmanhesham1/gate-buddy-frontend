import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export function useAuthGuard() {
  const navigate = useNavigate();

  const requireAuth = (callback, featureName = "this feature") => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      Swal.fire({
        html: `
          <div style="text-align:center; padding: 8px 0 4px;">
            <div style="
              width: 64px; height: 64px;
              background: linear-gradient(135deg, #002D6B, #0047b3);
              border-radius: 50%;
              display: flex; align-items: center; justify-content: center;
              margin: 0 auto 20px;
              box-shadow: 0 8px 24px rgba(0,45,107,0.3);
            ">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <h2 style="
              color: #002D6B;
              font-size: 1.3rem;
              font-weight: 800;
              margin: 0 0 10px;
              font-family: system-ui, sans-serif;
            ">Login Required</h2>
            <p style="
              color: #4B5563;
              font-size: 0.92rem;
              line-height: 1.6;
              margin: 0;
              font-family: system-ui, sans-serif;
            ">
              You need to be logged in to access<br/>
              <strong style="color: #002D6B;">${featureName}</strong>.
            </p>
          </div>
        `,
        showConfirmButton: true,
        confirmButtonText: "✈️ &nbsp; Go to Login",
        showCancelButton: true,
        cancelButtonText: "Maybe Later",
        confirmButtonColor: "#002D6B",
        cancelButtonColor: "#9CA3AF",
        buttonsStyling: true,
        customClass: {
          popup: "gb-auth-popup",
          confirmButton: "gb-auth-confirm",
          cancelButton: "gb-auth-cancel",
        },
        background: "#ffffff",
        showClass: {
          popup: "animate__animated animate__fadeInDown animate__faster",
        },
        hideClass: {
          popup: "animate__animated animate__fadeOutUp animate__faster",
        },
      }).then((result) => {
        if (result.isConfirmed) navigate("/login");
      });

      // Inject styles once
      if (!document.getElementById("gb-swal-style")) {
        const style = document.createElement("style");
        style.id = "gb-swal-style";
        style.textContent = `
          .gb-auth-popup {
            border-radius: 20px !important;
            padding: 32px 28px !important;
            box-shadow: 0 24px 60px rgba(0,45,107,0.18) !important;
            border: 1.5px solid #E5EAF5 !important;
            max-width: 380px !important;
          }
          .gb-auth-confirm {
            border-radius: 50px !important;
            padding: 12px 32px !important;
            font-size: 0.9rem !important;
            font-weight: 700 !important;
            letter-spacing: 0.02em !important;
            box-shadow: 0 8px 20px rgba(0,45,107,0.3) !important;
          }
          .gb-auth-cancel {
            border-radius: 50px !important;
            padding: 12px 28px !important;
            font-size: 0.88rem !important;
            font-weight: 600 !important;
          }
          .swal2-actions {
            gap: 12px !important;
            margin-top: 24px !important;
          }
        `;
        document.head.appendChild(style);
      }

      return;
    }
    if (callback) callback();
  };

  return { requireAuth };
}
