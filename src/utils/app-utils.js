import jwtDecode from "jwt-decode";
import { JwtPayload } from "jwt-decode";

export function getRoles() {
  const roles = [];
  const token = localStorage.getItem("token");
  if (token) {
    const decoded = jwtDecode < JwtPayload > token;
    const decodedRoles =
      decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    return roles.value = Array.isArray(decodedRoles) ? decodedRoles : [decodedRoles];
  }

  return roles;
}
