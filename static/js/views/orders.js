
function initializeOrder() {
    const allButton = document.getElementById("allButton");
    if (allButton) {
        allButton.classList.add("border-b-[5px]", "border-[#EB6B72]");
    }

    const allTable = document.querySelector(".allTable");
    if (allTable) {
        allTable.classList.remove("hidden");
    }
}



function handleTabClick(tabId) {
    const buttons = document.querySelectorAll(".tab-button");
    buttons.forEach(button => {
        button.classList.remove("border-b-[5px]", "border-[#EB6B72]");
    });
  
    document.getElementById(tabId).classList.add("border-b-[5px]", "border-[#EB6B72]");
  
    const tables = document.querySelectorAll(".allTable, .pndTable, .opTable, .compTable, .cnclTable");
    tables.forEach(table => {
        table.classList.add("hidden");
    });
  
    switch (tabId) {
        case "allButton":
            document.querySelector(".allTable").classList.remove("hidden");
            break;
        case "pendingButton":
            document.querySelector(".pndTable").classList.remove("hidden");
            break;
        case "processButton":
            document.querySelector(".opTable").classList.remove("hidden");
            break;
        case "completedButton":
            document.querySelector(".compTable").classList.remove("hidden");
            break;
        case "cancelledButton":
            document.querySelector(".cnclTable").classList.remove("hidden");
        break;
    }
  }
  



  initializeOrder();
