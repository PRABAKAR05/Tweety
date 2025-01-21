document.addEventListener('DOMContentLoaded', () => {
    // Fetch and display posts from followed users
    fetchFollowedPosts();

    // Function to fetch posts from backend
    async function fetchFollowedPosts() {
        const token = localStorage.getItem('token');
        console.log("Token:", token);

        if (!token) {
            // alert("You need to log in to access this feature.");
            return; // Exit the function if the token is not available
        }

        try {
            const response = await fetch('http://localhost:3000/api/posts/followers', {
                method:'GET',
                headers: {
                    'Authorization': `Bearer ${token}`, // Include token if required
                }
            });
            if (!response.ok) throw new Error("Failed to fetch posts.");
            const posts = await response.json(); // Assign the fetched posts to the local variable
            renderPosts(posts); // Render the posts
            if (posts.length === 0) {
                alert("No posts found from followed users."); // Alert user
            }
        } catch (error) {
            console.error("Error fetching posts:", error);
            alert("Could not load posts. Please try again later."); // User-friendly alert
        }
    }

    // Function to render posts with like buttons and count
    function renderPosts(posts) {
        const notificationList = document.getElementById('notification-list');
        notificationList.innerHTML = ''; // Clear any previous posts

        posts.forEach(post => {
            const postItem = document.createElement('li');
            postItem.innerHTML = `
                <p>${post.content}</p>
                <div class="post-footer">
                    <button class="like-button" data-post-id="${post.id}">
                        Like (<span class="like-count">${post.count}</span>)
                    </button>
                    <span class="timestamp">${new Date(post.created_at).toLocaleString()}</span>
                </div>
            `;
            notificationList.appendChild(postItem);
        });

        // Add event listeners to like buttons
        document.querySelectorAll('.like-button').forEach(button => {
            button.addEventListener('click', handleLikeButtonClick);
        });
    }

    // Handle like button click
    async function handleLikeButtonClick(event) {
        const postId = event.target.getAttribute('data-post-id');
        const likeCountElem = event.target.querySelector('.like-count');

        try {
            const response = await fetch(`http://localhost:3000/api/posts/like/${postId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`, // Include token if required
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to like post');
            }
            // Update like count in the frontend
            let currentCount = parseInt(likeCountElem.textContent, 10);
            likeCountElem.textContent = currentCount + 1;
        } catch (error) {
            console.error('Error liking post:', error);
            alert(error.message); // User-friendly alert for errors
        }
    }
});
