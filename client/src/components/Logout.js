
const logout = async () => {



    localStorage.removeItem('token');

    window.location.href = '/login';




};

export default logout;
