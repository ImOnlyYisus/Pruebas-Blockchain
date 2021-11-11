// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

contract TasksContract{
    uint256 public tasksCounter = 0;

    //Crear una tarea cuando se suba el contrato por primera vez
    constructor (){
        createTask("Mi primera tarea de ejemplo", "Tengo que hacer algo");
    }

    event TaskCreated(
        uint256 id,
        string title,
        string description,
        bool done,
        uint256 createAt
    );

    event TaskToggleDone (uint id, bool done);

    //uint256 (enteros sin negativos)
    struct Task{
        uint256 id;
        string title;
        string description;
        bool done;
        uint256 createAt;
    }

    //mapping es como una lista con listas [0:{id=...},1:{id=..}]
    mapping (uint256 => Task ) public tasks;

    //Fucion para crear tareas
    //Memory (para guardar en memoria un tiempo)
    //public para poder aceder desde cualquier parte de la aplicacion
    //_ para referenciar que son parametros y no variables privadas
    function createTask(string memory _title, string memory _description) public{
        tasksCounter++;

        tasks[tasksCounter] = Task(tasksCounter, _title, _description, false, block.timestamp);

        emit TaskCreated(tasksCounter, _title, _description, false, block.timestamp);
    }

    //Funcion para completar una tarea
    function toggleDone(uint _id) public{
       Task memory _task = tasks[_id];

       _task.done = !_task.done; //Cambia el valor al que tenga

       tasks[_id] = _task;

       emit TaskToggleDone(_id, _task.done);
    }


}