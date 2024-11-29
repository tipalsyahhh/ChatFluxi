document.addEventListener("DOMContentLoaded", function () {
    const loader = document.getElementById("loader");
    setTimeout(() => {
        loader.style.display = 'none';
    }, 5000);
    setTimeout(() => {
        loader.style.display = 'none';
    }, 300000);
    const toggleSidebar = document.getElementById('toggleSidebar');
    const closeSidebar = document.getElementById('closeSidebar');
    const sidebar = document.getElementById('sidebar');
    
    toggleSidebar.addEventListener('click', function () {
        sidebar.style.display = 'block';
        setTimeout(() => {
            sidebar.classList.add('active');
        }, 10); 
    });
    
    closeSidebar.addEventListener('click', function () {
        sidebar.classList.remove('active');
        setTimeout(() => {
            sidebar.style.display = 'none';
        }, 300);
    });    
});
