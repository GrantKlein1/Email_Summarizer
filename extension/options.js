chrome.storage.local.get({ coinCount: 0 }, (items) => {
    const coinCount = items.coinCount;
    const coinCountElement = document.getElementById("coinCount");
    coinCountElement.innerText = `Zenites: ${coinCount}`;
  });

document.querySelectorAll('button').forEach((button) => {
  button.addEventListener('click', () => {
    if (button.id === "save") {
      saveOptions();
      return;
    }
    if (button.id === "reset") {
      chrome.storage.local.get({coinCount: 0, purchasedThemes: []}, (items) => {
        let coins = items.coinCount;
        const purchasedThemes = items.purchasedThemes;
        purchasedThemes.forEach((theme) => {
          if (theme === "default2") {
            coins += 5;
          }
          else if (theme === "medieval") {
            coins += 10;
          }
          else if (theme === "retro") {
            coins += 15;
          }
          else if (theme === "futuristic") {
            coins += 20;
          }
          else if (theme === "psycho") {
            coins += 50;
          }
      });
      chrome.storage.local.set({ theme: "default", coinCount: coins, purchasedThemes: [] }, () => {
        console.log("✅ Purchases reset to default");
      });
      return;
    });

      const defaultRadio = document.querySelector('input[name="theme"][value="default"]');
      defaultRadio.checked = true;
      console.log(defaultRadio.checked);

      restoreOptions();
      return;
    }


    chrome.storage.local.get({ coinCount: 0, purchasedThemes: [] }, (items) => {
      let coinCount = items.coinCount;
      let purchasedThemes = items.purchasedThemes;

      const theme = button.id.replace("purchase-", "");
      const themeCost = {
        default2: 5,
        medieval: 10,
        retro: 15,
        futuristic: 20,
        psycho: 50,
      };

      if (coinCount >= themeCost[theme] && !purchasedThemes.includes(theme)) {
        coinCount -= themeCost[theme];
        purchasedThemes.push(theme);

        chrome.storage.local.set({ coinCount, purchasedThemes }, () => {
          chrome.storage.sync.set({ theme }, () => {
            chrome.runtime.sendMessage({ type: "COIN_COUNT_UPDATED" });
            buttonManager();
          });
        });
      }
    });
  });
});


const saveOptions = () => {
  const selectedTheme = document.querySelector('input[name="theme"]:checked').value;
  chrome.storage.sync.set(
    { theme: selectedTheme },
    () => {
    }
  );
};


const restoreOptions = () => {
  chrome.storage.sync.get(
    { theme: 'default' },
    (items) => {
      const selectedRadio = document.querySelector(`input[name="theme"][value="${items.theme}"]`);
      if (selectedRadio) {
        selectedRadio.checked = true;
      }

      // Ensure the default theme is selected if no theme is found
      const defaultRadio = document.querySelector('input[name="theme"][value="default"]');
      if (defaultRadio && !selectedRadio) {
        defaultRadio.checked = true;
      }
    }
  );
};

const buttonManager = () => {
  chrome.storage.local.get({ coinCount: 0, purchasedThemes: [] }, (items) => {
    const purchasedThemes = items.purchasedThemes;
    const coinCount = items.coinCount;

    const buttons = document.querySelectorAll('button');
    buttons.forEach((button) => {
      const theme = button.id.replace("purchase-", "");
      if (theme === 'default') {
        button.disabled = true;
        return;
      }
      else if ((theme === 'default2' && coinCount < 5) || purchasedThemes.includes(theme)) {
        button.disabled = true;
        return;
      }
      else if ((theme === 'medieval' && coinCount < 10) || purchasedThemes.includes(theme)) {
        button.disabled = true;
        return;
      }
      else if ((theme === 'retro' && coinCount < 15) || purchasedThemes.includes(theme)) {
        button.disabled = true;
        return;
      }
      else if ((theme === 'futuristic' && coinCount < 20) || purchasedThemes.includes(theme)) {
        button.disabled = true;
        return;
      }
      else if ((theme === 'psycho' && coinCount < 50) || purchasedThemes.includes(theme)) {
        button.disabled = true;
        return;
      }
    });

    const radioButtons = document.querySelectorAll('input[name="theme"]');
    radioButtons.forEach((radio) => {
      if (radio.value === 'default') return; 
      radio.disabled = !purchasedThemes.includes(radio.value);
    });
  });
};

document.addEventListener('DOMContentLoaded', () => {
  restoreOptions();
  buttonManager();

});
