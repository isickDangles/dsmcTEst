
const logout = async () => {

    localStorage.removeItem('token');
    localStorage.removeItem("role");

    window.location.href = '/login';

};

export default logout;
