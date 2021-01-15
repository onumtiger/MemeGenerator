'use strict';

let currentImage = 0;

window.addEventListener('DOMContentLoaded', function () {

    /*
    reads the input fields of the upload form
    */
    function getUploadConfig() {
        const container = document.getElementById('filterContainerUpload');
        const fieldsetItems = container.querySelector('fieldset').elements
        let category;
        for (let i = 0; i < fieldsetItems.length; i++) {
            if (fieldsetItems[i].checked) {
                category = fieldsetItems[i].value;
                break;
            }
        }
        const location = container.querySelector('#location').value;
        return { category: category, location: location }
    }

    // ---------- ui event listeners ----------


    document.getElementById('uploadButtonUrl').addEventListener('click', e => {
        const url = document.querySelector('#filterContainerUpload input[type="url"]').value;

        const { category, location } = getUploadConfig();

        // --- the REQUEST which is used for URL UPLOAD ---     	
        fetch(`http://localhost:3000/images/${category}`, {
            method: 'POST',
            mode: 'cors',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                url: url,
                location: location
            })
        }).then(res => {
            loadImageUrls();
        })
    });

    document.getElementById('uploadButtonFile').addEventListener('click', e => {
        const container = document.getElementById('filterContainerUpload');
        const file = container.querySelector('input[type="file"]').files[0];

        const { category, location } = getUploadConfig();

        const formData = new FormData();
        formData.append('image', file);
        formData.append('location', location)

        // --- the REQUEST which is used for FILE UPLOAD ---
        fetch(`http://localhost:3000/images/${category}`, {
            method: 'POST',
            mode: 'cors',
            body: formData
        }).then(res => {
            loadImageUrls();
        })
    });

    document.getElementById('locationSearch').addEventListener('input', e => {
        loadImageUrls();
    })


    loadImageUrls();
});      