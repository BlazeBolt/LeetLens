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
    const cardStatsContainer = document.querySelector('.stats-card');

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
            //statsContainer.classList.add('hidden');

            const response = await fetch(url);
            if(!response.ok){
                throw new Error('User not found');
            }
            const parsedData = await response.json();
            console.log('logging data = ',parsedData);

            displayUserStats(parsedData);
        }
        catch(error){
            statsContainer.innerHTML = `<h2 class="error-message">${error.message}</h2>`;

        }
        finally{
            searchButton.textContent = 'Search';
            searchButton.disabled = false;
        }
    }

    function updateProgress(solved, total, label, circle) {
        const progressDegree = solved / total * 100;
        circle.style.setProperty('--progress-degree', `${progressDegree}%`);
        label.textContent = `${solved} / ${total}`;
    }

    const displayUserStats = (parsedData) => {
        const totalQuestions = parsedData.totalQuestions;
        const totalEasyQuestions = parsedData.totalEasy;
        const totalMediumQuestions = parsedData.totalMedium;
        const totalHardQuestions = parsedData.totalHard;

        const solvedTotalQuestions = parsedData.totalSolved;
        const solvedTotalEasyQuestions = parsedData.easySolved;
        const solvedTotalMediumQuestions = parsedData.mediumSolved;
        const solvedTotalHardQuestions = parsedData.hardSolved;

        updateProgress(solvedTotalEasyQuestions, totalEasyQuestions, easyLabel, easyProgressCircle);
        updateProgress(solvedTotalMediumQuestions, totalMediumQuestions, mediumLabel, mediumProgressCircle);
        updateProgress(solvedTotalHardQuestions, totalHardQuestions, hardLabel, hardProgressCircle);

        const cardsData = [
            {label: "Questions Solved:", value: solvedTotalQuestions, icon: "fa-question"},
            {label: "Ranking:", value: parsedData.ranking, icon: "fa-trophy"},
            {label: "Acceptance Rate:", value: parsedData.acceptanceRate, icon: "fa-check"},
            {label: "Contribution Points:", value: parsedData.contributionPoints, icon: "fa-star"},
            {label: "Reputation:", value: parsedData.reputation, icon: "fa-users"},

        ];

        console.log('cardsData = ', cardsData);

        cardStatsContainer.innerHTML = cardsData.map(data => (
            `<div class="card">
                <i class="fa ${data.icon}"></i>
                <h4>${data.label}</h4>
                <p>${data.value ?? 'N/A'}</p>
            </div>`
        )).join('');
    }

    searchButton.addEventListener('click', function(){
        const userName = userNameInput.value;
        if(validateUsername(userName)){
            fetchUserDetails(userName);
        }
    })
})