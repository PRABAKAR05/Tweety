document.addEventListener("DOMContentLoaded", function() {
    const followingList = document.getElementById("following-list");
    const messageForm = document.getElementById("message-form");
    const messageInput = document.getElementById("message-input");
    const chatBox = document.getElementById("chat-box");
    const chatUser = document.getElementById("chat-user");

    // Fetch the logged-in user's username from local storage
    const username = localStorage.getItem('username');
    let originalMessagesCache = {};
    if (!username) {
        // If no username is found in local storage, redirect to login
        window.location.href = 'login.html';
        return;
    }

    // Initial fetch of the following list
    fetchFollowingList();

    // Function to fetch and render the following list
    function fetchFollowingList() {
        fetch(`http://localhost:3000/api/users/following/${username}`)
            .then(response => response.json())
            .then(data => {
                renderFollowingList(data);
            })
            .catch(err => {
                console.error('Error fetching following list:', err);
            });
    }

    // Function to render the list of users you're following
    function renderFollowingList(followingListData) {
        followingList.innerHTML = ""; // Clear the list first
        followingListData.forEach(user => {
            const li = document.createElement("li");
            li.textContent = user.following_username; // Assuming the data contains 'following_username'

            // Create the unfollow button
            const unfollowButton = document.createElement("button");
            unfollowButton.textContent = "Unfollow";

            // Unfollow button click handler
            unfollowButton.addEventListener("click", function(event) {
                event.stopPropagation(); // Prevent opening the chat when clicking "Unfollow"
                unfollowUser(li, user.following_username); // Pass the following username
            });

            // Append unfollow button to the list item
            li.appendChild(unfollowButton);

            // Add click event to open conversation with that user
            li.addEventListener("click", function() {
                openConversation(user.following_username);
            });

            // Append the list item to the following list
            followingList.appendChild(li);
        });
    }

    let currentChatUser = null; // The user currently being chatted with

    // Function to open a conversation with a user
    function openConversation(friendUsername) {
        currentChatUser = friendUsername;
        chatUser.textContent = friendUsername; // Display current chat user
        chatBox.innerHTML = ""; // Clear previous chat messages
        fetchMessages(); // Fetch messages for the current chat user
    }

    // Fetch messages between users
    function fetchMessages() {
        fetch(`http://localhost:3000/api/messages/${username}/${currentChatUser}`)
            .then(response => response.json())
            .then(messages => {
                chatBox.innerHTML = ""; // Clear chat box
                messages.forEach(message => {
                    const msgDiv = document.createElement("div");                    
                    const originalMessage = originalMessagesCache[message.id] || message.message_text;
                    msgDiv.textContent = `${message.sender}: ${originalMessage} (${new Date(message.created_at).toLocaleTimeString()})`;
                    chatBox.appendChild(msgDiv);
                });
            })
            .catch(err => console.error("Error fetching messages:", err));
    }

    // Handle sending a message
    messageForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const messageText = messageInput.value;

        if (messageText && currentChatUser) {
            fetch(`http://localhost:3000/api/messages/send`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sender_username: username,
                    receiver_username: currentChatUser,
                    message_text: messageText
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.message === 'Message sent successfully') {
                    // Display the original message in the chat box directly without re-fetching
                    const timestamp = Date.now();
                    originalMessagesCache[timestamp] = messageText;
                    const msgDiv = document.createElement("div");
                    msgDiv.textContent = `${username}: ${data.original_message} (${new Date().toLocaleTimeString()})`;
                    chatBox.appendChild(msgDiv);
                } else {
                    alert('Failed to send message');
                }
            })
            .catch(err => console.error("Error sending message:", err));
        }

        messageInput.value = '';  // Clear input after sending
    });

    // Function to unfollow a user and update the UI
    function unfollowUser(listItem, followingUsername) {
        fetch(`http://localhost:3000/api/users/unfollow`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                follower_username: username,
                following_username: followingUsername
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'User unfollowed successfully') {
                // Refetch the following list after unfollowing
                fetchFollowingList(); // Update the list to reflect the change
            } else {
                alert('Failed to unfollow user: ' + data.message);
            }
        })
        .catch(err => {
            console.error("Error unfollowing user:", err);
            alert('An error occurred while trying to unfollow the user.');
        });
    }
});
