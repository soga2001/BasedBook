function Logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    window.location.href ='/Home';
}

export default Logout;