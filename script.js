document.addEventListener("DOMContentLoaded", function() {
  var money = 0;
  var moneyPerClick = 1;
  var moneyPerSecond = 0;
  var moneyDisplay = document.getElementById("money-display");
  var earnButton = document.getElementById("earn-button");
  var doubleButton = document.getElementById("double-button");
  var tripleButton = document.getElementById("triple-button");
  var timerDisplay = document.getElementById("timer-display");
  var perSecondDisplay = document.getElementById("per-second-display");
  var leaderboardList = document.getElementById("leaderboard-list");
  var playerName;
  var clickMultiplier = 1;
  var clickMultiplierTimer;
  var doubleTimer;
  var tripleTimer;

  function updateMoney() {
    moneyDisplay.textContent = "Current Money: $" + money;
  }

  function updatePerSecond() {
    perSecondDisplay.textContent = "Money Per Second: $" + moneyPerSecond;
  }

  function updateTimer(button, duration) {
    var remainingTime = duration / 1000;
    button.disabled = true;
    button.style.opacity = "0.5";
    button.style.pointerEvents = "none";

    var intervalId = setInterval(function() {
      remainingTime--;
      timerDisplay.textContent = remainingTime > 0 ? "Next " + button.textContent + " in: " + remainingTime + "s" : "";
      if (remainingTime <= 0) {
        clearInterval(intervalId);
        timerDisplay.textContent = "";
        button.disabled = false;
        button.style.opacity = "1";
        button.style.pointerEvents = "auto";
      }
    }, 1000);
  }

  function updateLeaderboard() {
    var leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    leaderboard.sort(function(a, b) {
      return b.score - a.score;
    });

    leaderboardList.innerHTML = "";
    leaderboard.forEach(function(entry) {
      var li = document.createElement("li");
      li.textContent = entry.name + ": $" + entry.score;
      leaderboardList.appendChild(li);
    });
  }

  function saveScore(score) {
    var leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    leaderboard.push({ name: playerName, score: score });
    leaderboard.sort(function(a, b) {
      return b.score - a.score;
    });
    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
    updateLeaderboard();
  }

  function handleClick() {
    money += moneyPerClick * clickMultiplier;
    updateMoney();
  }

  function handleDoubleClick() {
    if (doubleButton.textContent === "Double Click Value") {
      moneyPerClick *= 2;
      updatePerSecond();
      doubleButton.textContent = "Double Click Value (5s)";
      updateTimer(doubleButton, 5000);
    }
  }

  function handleTripleClick() {
    if (tripleButton.textContent === "Triple Click Value") {
      moneyPerClick *= 3;
      updatePerSecond();
      tripleButton.disabled = true;
      tripleButton.style.opacity = "0.5";
      tripleButton.style.pointerEvents = "none";
      updateTimer(tripleButton, 10000);
    }
  }

  function startDoubleTimer() {
    if (doubleTimer) {
      clearInterval(doubleTimer);
    }

    doubleTimer = setInterval(function() {
      moneyPerClick *= 2;
      updatePerSecond();
    }, 10000);
  }

  function startTripleTimer() {
    if (tripleTimer) {
      clearInterval(tripleTimer);
    }

    tripleTimer = setInterval(function() {
      tripleButton.disabled = false;
      tripleButton.style.opacity = "1";
      tripleButton.style.pointerEvents = "auto";
    }, 10000);
  }

  earnButton.addEventListener("click", handleClick);
  doubleButton.addEventListener("click", handleDoubleClick);
  tripleButton.addEventListener("click", handleTripleClick);

  playerName = prompt("Enter your name:");
  if (playerName) {
    document.getElementById("game-container").insertAdjacentHTML('afterbegin', '<h2>Player: ' + playerName + '</h2>');
  }

  setInterval(function() {
    money += moneyPerSecond;
    updateMoney();
  }, 1000);

  setInterval(function() {
    moneyPerSecond = moneyPerClick * 2;
    updatePerSecond();
  }, 10000);

  startDoubleTimer();
  startTripleTimer();
  updateLeaderboard();
});
