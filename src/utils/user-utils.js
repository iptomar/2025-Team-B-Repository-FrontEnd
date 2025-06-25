/**
 * Função responsavél por fazer decode dos roles a partir do token devolvido pelo login.
 * @param {*} token 
 * @returns 
 */
export function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );

        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
}



export function userIsAdmin(userRoles){
    for (var i = 0; i < userRoles.length; i++) {
      if (userRoles[i] === 'Admistrador') return true;
    }
    return false;
}

/**
 * Esta função esta a ser usada para verificar os botões de submissão das salas, cadeiras e professores.
 * @param {*} userRoles 
 * @returns 
 */
export function canSubmit(userRoles, professor){
  for (var i = 0; i < userRoles.length; i++) {
    if (userRoles[i] === 'Admistrador' || userRoles[i] === 'Comissão de Cursos' || isValidTeacher(professor)) return true;
  }
  return false;
}

export function isValidTeacher(professor){
  let token = localStorage.getItem('token');
  let profId = parseJwt(token)["sub"];
  return profId == professor;
}

export function getUserId(){
  let token = localStorage.getItem('token');
  let userId = parseJwt(token)["sub"];
  return userId;
}

export function getUserName(){
  let token = localStorage.getItem('token');
  let username = parseJwt(token)["name"];
  return username;
}