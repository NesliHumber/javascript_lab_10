document.getElementById('fetchButton').addEventListener('click', fetchData);
document.getElementById('xhrButton').addEventListener('click', fetchDataXHR);
document.getElementById('dataForm').addEventListener('submit', sendData);
document.getElementById('putButton').addEventListener('click', updateData);

function displayMessage(message, isError = false) {
    const dataDisplay = document.getElementById('dataDisplay');
    dataDisplay.innerHTML = message;
    dataDisplay.className = isError ? 'error' : 'success';
}

function fetchData() {
    const apiUrl = 'https://jsonplaceholder.typicode.com/posts/1';
    
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Server error: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            const displayContent = `<h2>${data.title}</h2><p>${data.body}</p>`;
            displayMessage(displayContent);
        })
        .catch(error => {
            if (error.message.includes("NetworkError")) {
                displayMessage('Network error: Please check your internet connection.', true);
            } else {
                displayMessage(error.message, true);
            }
        });
}

function fetchDataXHR() {
    const apiUrl = 'https://jsonplaceholder.typicode.com/posts/2';
    const xhr = new XMLHttpRequest();
    
    xhr.open('GET', apiUrl);
    
    xhr.onload = function() {
        if (xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            const displayContent = `<h2>${data.title}</h2><p>${data.body}</p>`;
            displayMessage(displayContent);
        } else {
            displayMessage(`Server error: ${xhr.status} ${xhr.statusText}`, true);
        }
    };
    
    xhr.onerror = function() {
        displayMessage('Network error: Please check your internet connection.', true);
    };
    
    xhr.send();
}

function sendData(event) {
    event.preventDefault();
    
    const apiUrl = 'https://jsonplaceholder.typicode.com/posts';
    const title = document.getElementById('postTitle').value.trim();
    const body = document.getElementById('postBody').value.trim();

    if (!title || !body) {
        displayMessage('Invalid input: Title and body cannot be empty.', true);
        return;
    }

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, body })
    })
    .then(response => response.json())
    .then(data => {
        displayMessage(`Post created with ID: ${data.id}`);
    })
    .catch(error => {
        if (error.message.includes("NetworkError")) {
            displayMessage('Network error: Please check your internet connection.', true);
        } else {
            displayMessage('Error sending data: ' + error.message, true);
        }
    });
}

function updateData() {
    const postId = document.getElementById('postId').value.trim();
    const title = document.getElementById('updateTitle').value.trim();
    const body = document.getElementById('updateBody').value.trim();

    if (!postId || !title || !body) {
        displayMessage('Invalid input: All fields must be filled out.', true);
        return;
    }

    const apiUrl = `https://jsonplaceholder.typicode.com/posts/${postId}`;
    
    const xhr = new XMLHttpRequest();
    
    xhr.open('PUT', apiUrl);
    
    xhr.setRequestHeader('Content-Type', 'application/json');
    
    xhr.onload = function() {
        if (xhr.status === 200) {
            const updatedData = JSON.parse(xhr.responseText);
            const displayContent = `<h2>Updated Post</h2><h3>${updatedData.title}</h3><p>${updatedData.body}</p>`;
            displayMessage(displayContent);
        } else if (xhr.status === 404) {
            displayMessage(`Error: Post with ID ${postId} not found.`, true);
        } else {
            displayMessage(`Server error: ${xhr.status} ${xhr.statusText}`, true);
        }
    };
    
    xhr.onerror = function() {
        displayMessage('Network error: Please check your internet connection.', true);
    };
    
    xhr.send(JSON.stringify({ title, body }));
}