document.addEventListener("DOMContentLoaded", () => {
    const postForm = document.getElementById("new-post-form");
    const postList = document.getElementById("post-list");
    const postContent = document.getElementById("post-content");
    let posts = []; 

    // Render user posts on the page with date and time
    function renderUserPosts(posts) {
        postList.innerHTML = ""; // Clear the existing list
        
        posts.forEach(post => {
            const li = document.createElement("li");
            li.classList.add("post-item");

            const postText = document.createElement("p");
            postText.textContent = post.content;
            postText.classList.add("post-text");

            // Create a date element
            // const postDate = document.createElement("p");
            // postDate.textContent = new Date(post.createdAt).toLocaleString(); // Format the date
            // postDate.classList.add("post-date"); // Optional styling class

            const editButton = document.createElement("button");
            editButton.textContent = "✏️";
            editButton.classList.add("edit-button");
            editButton.addEventListener("click", () => editPost(post.id, post.content));

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "🗑️";
            deleteButton.classList.add("delete-button");
            deleteButton.addEventListener("click", () => deletePost(post.id));

            li.appendChild(postText);
            // li.appendChild(postDate); // Append the date
            li.appendChild(editButton);
            li.appendChild(deleteButton);
            postList.appendChild(li);
        });
    }

    // Handle new post submission
    postForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const newContent = postContent.value.trim();
        const username = localStorage.getItem('username');
        console.log("Token:",username)
        if (newContent) {
            try {
                const token = localStorage.getItem('token');
                console.log("Token1:",token)
                const response = await fetch('http://localhost:3000/api/posts/create', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ username, content: newContent })
                });

                if (!response.ok) throw new Error("Failed to create post.");
                const createdPost = await response.json();
                posts.push(createdPost); // Update the global posts array with the new post
                renderUserPosts(posts); // Re-render the list with the updated posts
                postContent.value = ""; // Clear the input field
            } catch (error) {
                console.error("Error creating post:", error);
                alert("Error creating post. Please try again.");
            }
        } else {
            alert("Please enter some content before posting!");
        }
    });

    // Handle editing a post
    async function editPost(postId, currentContent) {
        const newContent = prompt("Edit your post:", currentContent);
        if (newContent !== null && newContent.trim() !== "") {
            try {
                const response = await fetch(`http://localhost:3000/api/posts/edit/${postId}`, {
                    method: 'PUT',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({ content: newContent.trim() })
                });
                if (!response.ok) throw new Error("Failed to update post.");
                
                // Update the corresponding post in the global posts array
                const updatedPost = await response.json(); // Assuming the backend returns the updated post
                posts = posts.map(post => post.id === postId ? updatedPost : post);
                renderUserPosts(posts); // Re-render with the updated post
            } catch (error) {
                console.error("Error editing post:", error);
                alert("Error editing post. Please try again.");
            }
        }
    }

    // Handle deleting a post
    async function deletePost(postId) {
        console.log("Deleting post with ID:", postId);
        if (confirm("Are you sure you want to delete this post?")) {
            try {
                const response = await fetch(`http://localhost:3000/api/posts/delete/${postId}`, {
                    method: 'DELETE',
                    headers: { 
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (!response.ok) throw new Error("Failed to delete post.");

                // Remove the post from the global posts array
                posts = posts.filter(post => post.id !== postId);
                renderUserPosts(posts); // Render updated post list
            } catch (error) {
                console.error("Error deleting post:", error);
                alert("Error deleting post. Please try again.");
            }
        }
    }

    // Fetch and render initial posts
    async function fetchUserPosts() {
        try {
            const response = await fetch('http://localhost:3000/api/posts'); // Fetch all user posts
            if (!response.ok) throw new Error("Failed to fetch posts.");
            posts = await response.json(); // Assign the fetched posts to the global variable
            renderUserPosts(posts); // Render the posts
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    }
    

    // Call fetchUserPosts on DOM content loaded
    fetchUserPosts();
});
