let changeSymbolButton = document.getElementById("changeSymbolButton");

const mapping = {
  "stockrow.com": (symbol) => `https://stockrow.com/${symbol}`,
  "wsj.com/market-data/quotes": (symbol) =>
    `https://www.wsj.com/market-data/quotes/${symbol}`,
  "finance.yahoo.com/quote": (symbol) =>
    `https://finance.yahoo.com/quote/${symbol}/analysis?p=${symbol}`,
  "earningswhispers.com": (symbol) =>
    `https://www.earningswhispers.com/stocks/${symbol}`,
  "fintel.io/ss/us": (symbol) => `https://fintel.io/ss/us/${symbol}`,
};

const urlKeys = Object.keys(mapping);

changeSymbolButton.onclick = function (element) {
  let changeSymbolInput = document.getElementById("changeSymbolInput");
  let symbol = changeSymbolInput.value;
  let updatedTabs = [];

  chrome.tabs.query({ currentWindow: true }, function (tabs) {
    // update existing
    tabs.forEach((tab) => {
      let matchedUrlKey;
      urlKeys.forEach((urlKey) => {
        if (tab.url.includes(urlKey)) {
          matchedUrlKey = urlKey;
        }
      });
      if (matchedUrlKey) {
        chrome.tabs.update(tab.id, { url: mapping[matchedUrlKey](symbol) });
        updatedTabs.push(matchedUrlKey);
      }
    });

    // create new
    urlKeys
      .filter((urlKey) => !updatedTabs.includes(urlKey))
      .forEach((urlKey) => {
        chrome.tabs.create({ url: mapping[urlKey](symbol) });
      });
  });
};
