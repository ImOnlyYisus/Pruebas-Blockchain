App = {
    contracts: {},

    init: async() => {
        console.log("Loaded")
        await App.loadEtherum();
        await App.loadContracts();
        await App.loadAccount();
        App.render();
        await App.renderTask();
    },

    loadEtherum: async() => {

        if (window.ethereum) {
            console.log("Etherum existe");
            App.web3Provider = window.ethereum;

            await window.ethereum.request({ method: 'eth_requestAccounts' });

        } else if (window.web3) {
            new Web3(window.web3.currentProvider);

        } else {
            console.log("No etherum browser is installed. Try installing MetaMask");
        }
    },

    loadAccount: async() => {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        App.accounts = accounts[0];
        console.log(App.accounts);
    },

    loadContracts: async() => {
        const response = await fetch("TasksContract.json");
        const tasksContractJSON = await response.json();

        App.contracts.tasksContract = TruffleContract(tasksContractJSON);

        App.contracts.tasksContract.setProvider(App.web3Provider);

        App.tasksContract = await App.contracts.tasksContract.deployed();
    },

    render: () => {
        document.getElementById('account').innerText = App.accounts;
    },

    renderTask: async() => {
        const taskCounter = await App.tasksContract.tasksCounter();
        const taskCounterNumber = taskCounter.toNumber();

        let html = '';

        for (let i = 1; i <= taskCounterNumber; i++) {
            const task = await App.tasksContract.tasks(i);

            const taskId = task[0];
            const taskTitle = task[1];
            const taskDescription = task[2];
            const taskDone = task[3];
            const taskCreateAt = task[4];

            let taskElement = `
            <div class="card bg-dark mb-2">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <span>${taskTitle}</span> 
                    <div class="form-check form-switch">
                        <input class="form-check-input" data-id="${taskId}" type="checkbox" ${taskDone ? "checked" : ""}
                        onchange="App.toggleDone(this)"/>
                    </div>
                </div>
                <div class="card-body">
                    <span>${taskDescription}</span>
                    <p class="text-muted">${new Date(taskCreateAt * 1000).toLocaleString()}</p>
                </div>
            </div>
            `;

            html += taskElement;

        }

        document.querySelector("#tasksList").innerHTML = html;
    },

    createTask: async(title, description) => {
        const result = await App.tasksContract.createTask(title, description, { from: App.accounts });
        //const createdTask = ;

        console.log(result.logs[0].args);
    },

    toggleDone: async(element) => {
        const taskId = element.dataset.id;

        await App.tasksContract.toggleDone(taskId, { from: App.accounts });

        window.location.reload();
    }

}