document.addEventListener("DOMContentLoaded", function () {
    const tabList = document.getElementById("tabList");
    const closeAllButton = document.getElementById("closeAll");
    const saveTabsButton = document.getElementById("saveTabs");


    function fetchTabs() {
        browser.tabs.query({}).then((tabs) => {
            tabList.innerHTML = "";
            tabs.forEach((tab) => {
                const li = document.createElement("li");
                li.textContent = tab.title;
                
                // Create a close button for each tab
                const closeButton = document.createElement("button");
                closeButton.textContent = "Close";
                closeButton.addEventListener("click", () => {
                    browser.tabs.remove(tab.id);
                    fetchTabs(); 
                });
                li.appendChild(closeButton);
                tabList.appendChild(li);
            });
        });
    }


    closeAllButton.addEventListener("click", () => {
        browser.tabs.query({}).then((tabs) => {
            tabs.forEach((tab) => {
                browser.tabs.remove(tab.id);
            });
            fetchTabs(); 
        });
    });


    saveTabsButton.addEventListener("click", () => {
        browser.tabs.query({}).then((tabs) => {
            const tabUrls = tabs.map(tab => tab.url);
            browser.storage.local.set({ savedTabs: tabUrls }).then(() => {
                alert("Tabs have been saved.");
            });
        });
    });

    fetchTabs();
});
