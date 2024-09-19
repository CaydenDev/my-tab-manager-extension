document.addEventListener("DOMContentLoaded", function () {
    const tabList = document.getElementById("tabList");
    const closeAllButton = document.getElementById("closeAll");
    const saveTabsButton = document.getElementById("saveTabs");
    const loadTabsButton = document.getElementById("loadTabs");
    const reopenLastTabButton = document.getElementById("reopenLastTab");
    const exportTabsButton = document.getElementById("exportTabs");
    const searchInput = document.getElementById("search");
    const darkModeToggle = document.getElementById("darkModeToggle");

    let lastClosedTabId = null;

    function fetchTabs() {
        browser.tabs.query({}).then((tabs) => {
            tabList.innerHTML = "";
            const searchText = searchInput.value.toLowerCase();
            tabs.forEach((tab) => {
                if (tab.title.toLowerCase().includes(searchText)) {
                    const li = document.createElement("li");
                    li.textContent = tab.title;

                    const closeButton = document.createElement("button");
                    closeButton.textContent = "Close";
                    closeButton.addEventListener("click", () => {
                        lastClosedTabId = tab.id;
                        browser.tabs.remove(tab.id);
                        fetchTabs();
                    });
                    li.appendChild(closeButton);
                    tabList.appendChild(li);
                }
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

    loadTabsButton.addEventListener("click", () => {
        browser.storage.local.get("savedTabs").then((result) => {
            if (result.savedTabs) {
                result.savedTabs.forEach((url) => {
                    browser.tabs.create({ url });
                });
            }
        });
    });

    reopenLastTabButton.addEventListener("click", () => {
        if (lastClosedTabId) {
            browser.sessions.restore(lastClosedTabId);
            lastClosedTabId = null;
        } else {
            alert("No tabs to reopen.");
        }
    });

    exportTabsButton.addEventListener("click", () => {
        browser.tabs.query({}).then((tabs) => {
            const tabUrls = tabs.map(tab => tab.url).join("\n");
            const blob = new Blob([tabUrls], { type: "text/plain" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "tabs.txt";
            a.click();
        });
    });

    searchInput.addEventListener("input", fetchTabs);

    darkModeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
    });

    fetchTabs();
});
