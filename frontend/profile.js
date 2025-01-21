document.addEventListener("DOMContentLoaded", function() {
    const profilePic = document.getElementById("profile-pic");
    const usernameInput = document.getElementById("username-input");
    const bioInput = document.getElementById("bio-input");
    const form = document.getElementById("edit-profile-form");
    const editProfileBtn = document.getElementById("edit-profile-btn");
    const editProfileSection = document.getElementById("edit-profile-section");
    const followersCount = document.getElementById("followers-count");
    const followingCount = document.getElementById("following-count");
    const friendSearchInput = document.getElementById("friend-search");
    const friendsList = document.getElementById("friends-list");

    // Retrieve username from local storage
    const username = localStorage.getItem('username');

    if (!username) {
        // Redirect to login if no username found
        window.location.href = 'login.html';
        return;
    }

    let friendsData = []; // To store the original list of friends
    let followedFriends = []; // To store the followed friends

    // Load profile from the backend
    function loadProfile() {
        fetch(`http://localhost:3000/api/profile/${username}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Profile not found');
                }
                return response.json();
            })
            .then(data => {
                document.getElementById("username").textContent = data.username;
                document.getElementById("bio").textContent = data.bio;
                profilePic.src = "/images/profile.jpg"; // Default profile picture
                followersCount.textContent = `Followers: ${data.followers}`;
                followingCount.textContent = `Following: ${data.following}`;
                
                // Store user profile for further use
                userProfile = { following: data.following };  // Initialize userProfile
                followedFriends = data.followedUsers; // Assuming this gives you a list of followed friends
            })
            .catch(err => {
                console.error('Error fetching profile data:', err);
                alert("Failed to load profile");
            });
    }

    // Call the function to load the profile data
    loadProfile();

    // Handle form submission for editing profile
    form.addEventListener("submit", function(event) {
        event.preventDefault();
        
        const bio = bioInput.value;

        const updatedProfile = {
            bio: bio,
        };

        fetch(`http://localhost:3000/api/profile/${username}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedProfile)
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'Profile updated successfully') {
                alert('Profile updated successfully!');
                loadProfile(); // Reload the profile after successful update
            } else {
                alert('Error updating profile: ' + data.message);
            }
        })
        .catch(err => {
            console.error('Error updating profile:', err);
            alert('Failed to update profile');
        });
    });

    // Toggle visibility of the edit profile section
    editProfileBtn.addEventListener("click", function() {
        editProfileSection.style.display = (editProfileSection.style.display === "none" || editProfileSection.style.display === "") 
            ? "block" // Show the section
            : "none";  // Hide the section
    });

    // Function to fetch all friends from the backend
    function loadFriends() {
        fetch(`http://localhost:3000/api/users/all/${username}`) // Adjust the URL to match your API endpoint
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to load friends');
                }
                return response.json();
            })
            .then(data => {
                friendsData = data.map(user => ({ name: user.username })); // Store the original data
                displayFriends(friendsData); // Call the display function
            })
            .catch(err => {
                console.error('Error fetching friends:', err);
                alert("Failed to load friends");
            });
    }
    loadFriends();
    // Function to display friends
    function displayFriends(friendsListData) {
        friendsList.innerHTML = ''; // Clear existing list
        if (friendsListData.length === 0) {
            friendsList.innerHTML = '<li>No users found.</li>'; // Display message if no users
            return;
        }
        friendsListData.forEach(friend => {
            const li = document.createElement('li');
            li.textContent = friend.name;

            const followButton = document.createElement('button');
            followButton.textContent = 'Follow';
            followButton.addEventListener('click', function() {
                userProfile.following += 1;  // Increment following count
                followingCount.textContent = `Following: ${userProfile.following}`;  // Update displayed following count
                
                // Update database
                fetch(`http://localhost:3000/api/users/follow`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ 
                        username: username,         // Your username
                        targetUsername: friend.name  // The username of the friend you're following
                    }) 
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to update following count in database');
                    }
                    return response.json();
                })
                .then(data => {
                    alert(data.message); // Show success message
                    followButton.disabled = true;  // Disable button after following to prevent multiple follows
                    
                    // Remove the followed friend from the list and search results
                    li.remove();
                })
                .catch(err => {
                    console.error('Error updating following count:', err);
                    alert('Failed to update following count');
                });
            });

            li.appendChild(followButton);
            friendsList.appendChild(li);
        });
    }

    // Load friends on page load
    

    // Clear the search input on page load
    friendSearchInput.value = ''; // Reset the search input

    // Search functionality for friends
    friendSearchInput.addEventListener("input", function() {
        const searchTerm = this.value.toLowerCase();
        const filteredFriends = friendsData.filter(friend => 
            friend.name.toLowerCase().includes(searchTerm) &&
            !followedFriends.includes(friend.name) // Exclude followed friends
        );
        displayFriends(filteredFriends); // Call displayFriends with filtered results
    });
    
    
});
