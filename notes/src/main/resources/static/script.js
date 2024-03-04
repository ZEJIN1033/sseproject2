const jwtToken = sessionStorage.getItem('token');
if (!jwtToken) {
    alert('Please log in to view your Memos.');
    window.location.href = '/login';
}
else {
    const base64Url = jwtToken.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(window.atob(base64));
    const JWTuserId = payload.id;

    const userId = getUserIdFromPath();

    if (JWTuserId != userId) {
        alert('Please log in to view your Memos.');
        window.location.href = '/login';
    }
}

// Debounce function to prevent excessive executions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(this, args);
        }, wait);
    };
}

// Fetch user ID from the data attribute
function getUserIdFromPath() {
    const userId = document.getElementById('memoApp').getAttribute('data-userid');
    console.log("Fetched userId:", userId); // Debug output
    return userId;
}

// Fetch and display notes for the user
function fetchNotes(userId) {
    fetch(`/api/${userId}/notes`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'token': jwtToken,
        }
    })
        .then(response => response.json())
        .then(result => {
            const sidebar = document.getElementById('sidebar');
            sidebar.innerHTML = `
                <div class="sidebar-header">
                    MemoMind
                    <button id="pendingListsBtn">Inv</button>
                    <button id="addNoteBtn">+</button>
                </div>
            `;
            result.data.forEach(note => {
                const noteElement = document.createElement('div');
                noteElement.className = 'note-item';
                noteElement.innerHTML = `
                    <button class="delete-note-btn" onclick="deleteNote(${note.id}, '${userId}')">-</button>
                    <span class="note-title" data-id="${note.id}">${note.title}</span>
                `;
                sidebar.appendChild(noteElement);
                noteElement.querySelector('.note-title').addEventListener('click', () => fetchNoteDetails(note.id, userId));
            });
            document.getElementById('addNoteBtn').addEventListener('click', () => addNote(userId));
            document.getElementById('pendingListsBtn').addEventListener('click', () => window.location.href = `/${userId}/pending`);
        });
}

function fetchNoteDetails(noteId, userId) {
    fetch(`/api/${userId}/notes/${noteId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'token': jwtToken,
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(response => {
            const noteDetails = response.data;
            const contentArea = document.getElementById('content');

            contentArea.innerHTML = `
                <input id="editTitle" class="editTitle" value="${noteDetails.title}" />
                <textarea id="editContent" class="editContent">${noteDetails.content}</textarea>
                <div>
                    <input type="text" id="inviteeId" placeholder="Enter the InviteeID" />
                    <button id="sendInvitationBtn">SEND</button>
                </div>
            `;

            document.getElementById('editTitle').addEventListener('input', debounce(() => autoSave(noteDetails.id, userId), 2000));
            document.getElementById('editContent').addEventListener('input', debounce(() => autoSave(noteDetails.id, userId), 2000));
            document.getElementById('sendInvitationBtn').addEventListener('click', () => {
                const inviteeId = document.getElementById('inviteeId').value;
                sendInvitation(noteDetails.id, userId, inviteeId);
            });
        })
        .catch(error => {
            console.error('Failed to fetch note details:', error);
        });
}

function sendInvitation(noteId, userId, inviteeId) {
    if (!inviteeId) {
        alert('Please enter the invitee ID!!!');
        return;
    }

    // Assuming the API requires noteId and inviteeId to send an invitation
    fetch(`/api/${userId}/send`, {
        method: 'PUT', // Ensure the HTTP method matches your backend requirements
        headers: {
            'Content-Type': 'application/json',
            'token': jwtToken,
        },
        body: JSON.stringify({
            noteId: noteId, // Include the noteId in the request
            inviteeId: inviteeId,
            inviterId: userId
        })
    })
        .then(response => {
            if (!response.ok) {
                // Handle HTTP errors
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            alert('Invitation sent successfully!');
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('Failed to send the invitation.');
        });
}

// Add a new note
function addNote(userId) {
    const defaultNote = {
        title: "New Note",
        content: "Note content here..."
    };

    fetch(`/api/${userId}/notes`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'token': jwtToken,
        },
        body: JSON.stringify(defaultNote)
    }).then(() => {
        fetchNotes(userId); // Reload notes after adding
    });
}

// Delete a note
function deleteNote(noteId, userId) {
    fetch(`/api/${userId}/notes/${noteId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'token': jwtToken,
        },
    })
        .then(response => {
            if (response.status === 403) {
                alert("Sorry! Only the creator of the Note has the right to delete the Note!");
                throw new Error('Forbidden: You do not have permission');
            }
            if (!response.ok) {
                throw new Error('An error occurred while deleting the memo');
            }
            return response.json();
        })
        .then(() => {
            fetchNotes(userId);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// Auto-save note changes
function autoSave(noteId, userId) {
    const title = document.getElementById('editTitle') ? document.getElementById('editTitle').value : '';
    const content = document.getElementById('editContent') ? document.getElementById('editContent').value : '';
    saveNoteChanges(noteId, userId, title, content);
}

// Save changes to a note
function saveNoteChanges(noteId, userId, title, content) {
    const version = document.getElementById('editVersion') ? parseInt(document.getElementById('editVersion').value) : 1;
    const isPublic = document.getElementById('editIsPublic') ? document.getElementById('editIsPublic').checked : true;

    fetch(`/api/${userId}/notes`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'token': jwtToken,
        },
        body: JSON.stringify({ id: noteId, userId: userId, title: title, content: content, version: version, isPublic: isPublic })
    }).then(() => {
        fetchNotes(userId); // Refresh notes to reflect the updated content
    });
}

// Execute when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const userId = getUserIdFromPath();
    if (userId) {
        fetchNotes(userId);
    } else {
        console.error('No userId found in URL path');
    }
});