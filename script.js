document.addEventListener('DOMContentLoaded', function() {
    const searchButton = document.getElementById('search-btn');
    const userNameInput = document.getElementById('user-input');
    const statsContainer = document.querySelector('.stats-container');
    const easyProgressCircle = document.querySelector('.easy-progress');
    const mediumProgressCircle = document.querySelector('.medium-progress');
    const hardProgressCircle = document.querySelector('.hard-progress');
    const easyLabel = document.getElementById('easy-label');
    const mediumLabel = document.getElementById('medium-label');
    const hardLabel = document.getElementById('hard-label');
    const cardStatsContainer = document.querySelector('.stats-cards');

    function validateUsername(userName){
        if(userName.trim() == ""){
            alert('Please enter a username');
            return false;
        }
        const regex = /^[a-zA-Z0-9_]+$/;
        const isMatch = regex.test(userName);
        if(!isMatch){
            alert('Username can only contain letters, numbers, and underscores');
        }
        return isMatch;
    }

    async function fetchUserDetails(userName){
        const url = `https://leetcode-stats-api.herokuapp.com/${userName}`;
        try{
            searchButton.textContent = 'Searching...';
            searchButton.disabled = true;

            const response = await fetch(url);
            if(!response.ok){
                throw new Error('User not found');
            }
            const data = await response.json();
            console.log('logging data = ',data);
        }
        catch(error){
            statsContainer.innerHTML = `<h2 class="error-message">${error.message}</h2>`;

        }
        finally{
            searchButton.textContent = 'Search';
            searchButton.disabled = false;
        }
    }

    searchButton.addEventListener('click', function(){
        const userName = userNameInput.value;
        if(validateUsername(userName)){
            fetchUserDetails(userName);
        }
    })
})