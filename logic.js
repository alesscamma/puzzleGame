//variable to get the ul elements
let ul = document.querySelector('ul');


// onLoad --> add event listener for the three buttons + invoke statGame(3) and ads class to define squares size
document.addEventListener("DOMContentLoaded", event => {
    document.getElementById("easy").addEventListener("click", () => {
        startGame(3);
        document.getElementById("list").classList.add('easy');
    });
    document.getElementById("medium").addEventListener("click", () => {
        startGame(4);

    });
    document.getElementById("difficult").addEventListener("click", () => {
        startGame(5);
        document.getElementById("list").classList.add('difficult');
    });
    startGame(3);
    document.getElementById("list").classList.add('easy');
});

// resets the right number of boxes
easy.onclick = () => {
    const myNode = document.getElementById("list");
    myNode.innerHTML = '';
    document.getElementById("list").className = "easy";
  };
medium.onclick = () => {
    const myNode = document.getElementById("list");
    myNode.innerHTML = '';
    document.getElementById("list").className = "medium";
  };
  difficult.onclick = () => {
    const myNode = document.getElementById("list");
    myNode.innerHTML = '';
    document.getElementById("list").className = "difficult";
  };


let numbers = []; //numbers to be populated
let boxCounts; //number of boxes in the square to determin the level
let li; //li which will determin the boxes

//function to lunch on pageload
const startGame = (n) => {
    console.log(n);
    boxCounts = n;

    if(n===3){
        numbers = ["1","2","3","4","5","6","7","8", ""];
    } else if (n===4){
        numbers = ["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15", ""];
    }else{
        numbers = ["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24", ""];
    }
    
    generateBoxes();
    li = document.querySelectorAll('li');
    fillBox(li, numbers);
    setIds(li);
    stage.content = getStage(li);
    stage.rows = getRows(stage);
    setDrop(li) ;
    setDrag(li);
    
};

//function that generates the number of boxes based on the level
const generateBoxes = () => {
    for (var i = 0; i < numbers.length; i++) {
        var boxes = numbers[i];
        var listItem = document.createElement("li");
        ul.appendChild(listItem);
      }
};
//keeps order of the boxes at any given stage of the game
const stage = {};
stage.content = numbers;
const getStage = (objects) => {
    console.log(objects);
    const content = [];
    objects.forEach((object, i) => {
        content.push(object.innerText);
    });
    return content;
};

//function to know where the empty box is located
const getEmptyBox = () => {
    const emptyBoxNumber = stage.emptyBoxIndex+1; // cause index starts at 0
    const emptyBoxRow = Math.ceil(emptyBoxNumber/boxCounts); // devide by number of rows and round it up
    const emptyBoxCol = boxCounts - (boxCounts* emptyBoxRow - emptyBoxNumber); 

    return [emptyBoxRow-1, emptyBoxCol-1]; // -1 for actual index
};

// to divide the array into a 4 * 4 grid (4 arrays of 4 rows)
const getRows = (stage) => {
    let i = 0;
    let array = [];
    const {content} = stage;
    for(let j = 0; j < boxCounts; j++) {
        array.push(content.slice(i, i+boxCounts));
        i+=boxCounts;
    }
    return array;
};

// this function creates an individual id for each li, in the form 1 to 16
const setIds = (objects) => {
    for(let i = 0; i < objects.length; i++) {
        objects[i].setAttribute("id", "box "+i);
    }
};

//check how many swaps are needed to solve de puzzle and makes sure it is solvable (need to be even swaps for the puzzle to be solvable)
const solvable = (array) => {
    let numberOfSwaps = 0;
    for(let i =0; i<array.length; i++){
        for(let j = i+1; j < array.length; j++) {
            if((array[i] && array[j]) && array[i] > array[j]) numberOfSwaps++;
        }
    }
    return (numberOfSwaps % 2 == 0); 
};

//function to check if puzzle is solved
const checkSolution = (solution, content) => {
    if(JSON.stringify(solution) == JSON.stringify(content)) return true;
    return false;
};

//function to populate numbers in the boxes
const fillBox = (objects, numbers) => {
    let shuffling = shuffle(numbers);
    while(!solvable(shuffling)) {
        shuffling = shuffle(numbers);
    }
    objects.forEach((object, i) => {
        object.innerText = shuffling[i];
    });
};

// shuffle the array
const shuffle = (array) => {
    const copy = [...array];
    for(let i = 0; i < copy.length; i++) {
        let j = parseInt(Math.random()*copy.length);
        let temp = copy[i];
        copy[i] = copy[j];
        copy[j] = temp;
    }   
    return copy;
 };

//Drag and drop components 

const setDrag= (objects) => {
    const [row, col] = getEmptyBox();
    let left, right, top, bottom = null;
    if(stage.rows[row][col-1]) left = stage.rows[row][col-1];
    if(stage.rows[row][col+1]) right = stage.rows[row][col+1];
    if(stage.rows[row-1] != undefined) top = stage.rows[row-1][col];
    if(stage.rows[row+1] != undefined) bottom = stage.rows[row+1][col];

    objects.forEach(object => {
        if(object.innerText == top || 
            object.innerText == bottom || 
            object.innerText == right ||
            object.innerText == left) {
                object.setAttribute("draggable", "true");
                object.setAttribute("ondragstart", "dragstart_handler(event)");
                object.setAttribute("ondragend", "dragend_handler(event)");
            }
        
    });
};

const setDrop = (objects) => {
    objects.forEach((object, i) => {
        if(!object.innerText) {
            stage.emptyBoxIndex = i;
            object.setAttribute("ondrop", "drop_handler(event);");
            object.setAttribute("ondragover", "dragover_handler(event);");
            object.setAttribute("class", "empty");
            object.setAttribute("draggable", "false");
            object.setAttribute("ondragstart", "");
            object.setAttribute("ondragend", "");
        }
        return;
        
    });
};

const removeDrop = (objects) => {
    objects.forEach((object) => {
        object.setAttribute("ondrop", "");
        object.setAttribute("ondragover", "");
        object.setAttribute("draggable", "false");
        object.setAttribute("ondragstart", "");
        object.setAttribute("ondragend", "");
    });
};

const dragstart_handler = ev => {
    ev.dataTransfer.setData("text/plain", ev.target.id);
    ev.dataTransfer.dropEffect = "move";
};

const dragover_handler = ev => {
    ev.preventDefault();
};
// Get the id of the target and the moved element to the target's DOM and replace the empty box
const drop_handler = ev => {
    ev.preventDefault();
    const data = ev.dataTransfer.getData("text/plain");
    ev.target.innerText = document.getElementById(data).innerText;
    

    ev.target.classList.remove("empty");
    ev.target.setAttribute("ondrop", "");
    ev.target.setAttribute("ondragover", "");
    document.getElementById(data).innerText = "";

   
    stage.content = getStage(li);
    stage.rows = getRows(stage);
};
//remove drop and set new drag and drop elements
const dragend_handler = ev => {
  ev.dataTransfer.clearData();
  removeDrop(document.querySelectorAll('li'));

  setDrop(document.querySelectorAll('li'));
  setDrag(document.querySelectorAll('li'));

    // shows modal if correct
    if(checkSolution(numbers, stage.content)) {
        showModal();
    }
};
// Shows winning banner
const showModal = () => {
    document.getElementById('message').innerText = "Congrats you win!";
    document.getElementById('modal').classList.remove("hide");
};
// hides banner when clicking on x
const hideModal = () => {
    document.getElementById('message').innerText = "Congrats you win!";
    document.getElementById('modal').classList.add("hide");
};