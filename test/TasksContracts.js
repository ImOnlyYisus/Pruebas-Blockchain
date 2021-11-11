const TasksContract = artifacts.require("TasksContract");

contract("TasksContract", () => {

    before(async() => {
        this.tasksContract = await TasksContract.deployed();
    })

    //Comprueba si se ha desplegado bien el contrato inteligente
    it('migrate deployed successfully', async() => {
        const address = this.tasksContract.address;

        assert.notEqual(address, null);
        assert.notEqual(address, undefined);
        assert.notEqual(address, 0x0);
        assert.notEqual(address, "");
    })

    //Comprueba si se crea la lista de ejemplo
    it('get Tasks List', async() => {
        const tasksCounter = await this.tasksContract.tasksCounter();
        const task = await this.tasksContract.tasks(tasksCounter);

        assert.equal(task.id.toNumber(), tasksCounter);
        assert.equal(task.title, "Mi primera tarea de ejemplo");
        assert.equal(task.description, "Tengo que hacer algo");
        assert.equal(task.done, false);
        assert.equal(tasksCounter, 1);

    })

    //Comprueba si se crea una tarea correctamente
    it('task created successfully', async() => {
        const result = await this.tasksContract.createTask("Ejemplo de test", "Descripcion del test");
        const taskEvent = result.logs[0].args;
        const tasksCounter = await this.tasksContract.tasksCounter();

        assert.equal(tasksCounter, 2);
        assert.equal(taskEvent.id.toNumber(), 2);
        assert.equal(taskEvent.title, "Ejemplo de test");
        assert.equal(taskEvent.description, "Descripcion del test");
        assert.equal(taskEvent.done, false);

    })

    //Comprueba si modifica si se ha hecho o no la tarea "done true or false"
    it('task modified done successfully', async() => {
        const result = await this.tasksContract.toggleDone(1);
        const taskEvent = result.logs[0].args;
        const task = await this.tasksContract.tasks(1);

        assert.equal(task.done, true);
        assert.equal(taskEvent.done, true);
        assert.equal(taskEvent.id, 1);

    })

})