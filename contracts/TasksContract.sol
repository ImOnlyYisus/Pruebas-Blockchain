// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

contract TasksContract{

    uint contador = 0;

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
        tasks[contador] = Task(contador, _title, _description, false, block.timestamp);

        contador++;
    }

    //function toggleDone(){

    //}


}