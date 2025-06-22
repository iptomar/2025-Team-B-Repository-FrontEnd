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
    userRoles.map((userRole) => {
        if (userRole === 'Admistrador') return true;
    })

    return false;
}