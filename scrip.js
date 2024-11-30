function isMobileDevice() {
    return /Android|iPhone|iPad|iPod|BlackBerry|Windows Phone|Opera Mini|IEMobile|Mobile/i.test(navigator.userAgent);
}

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

    const userInput = document.getElementById("user-input");
    if (isMobileDevice()) {
        userInput.focus();
    }
    const recordButton = document.getElementById("record-button");

    userInput.addEventListener("input", () => {
        if (userInput.value.trim() !== "") {
            recordButton.classList.add("hidden");
        } else {
            recordButton.classList.remove("hidden");
        }
    });
    const openModalButton = document.getElementById("open-modal");
    const modal = document.getElementById("file-modal");
    const closeModalButton = document.querySelector(".close-btn");
    function openModal() {
        modal.style.display = "block";
    }
    function closeModal() {
        modal.style.display = "none";
    }
    openModalButton.addEventListener("click", openModal);
    closeModalButton.addEventListener("click", closeModal);
    window.addEventListener("click", function (event) {
        if (event.target === modal) {
            closeModal();
        }
    });
    const uploadLink = document.getElementById("file-upload-link");

    uploadLink.addEventListener("click", (event) => {
        event.preventDefault();

        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.style.display = "none";
        fileInput.addEventListener("change", (event) => {
            const selectedFile = event.target.files[0];
            if (selectedFile) {
                alert(`File dipilih: ${selectedFile.name}`);
            }
        });
        document.body.appendChild(fileInput);
        fileInput.click();
        fileInput.remove();
    });

});
