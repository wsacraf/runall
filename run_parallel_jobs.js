math = require("mathjs");

const graph = require('./Graph');
// not used
var parallel = require('run-parallel')

// specify the number of vertices
let Graph = new graph(5);

// add the vertices
for (let i = 0; i <= 10; i++) {
    Graph.AddVertex(i);
}

// add the edges in between vertices 
Graph.AddEdge(0, 1);
Graph.AddEdge(0, 2);
Graph.AddEdge(1, 3);
Graph.AddEdge(1, 4);
Graph.AddEdge(2, 5);
Graph.AddEdge(2, 6);
Graph.AddEdge(3, 7);
Graph.AddEdge(3, 8);
Graph.AddEdge(4, 9);
Graph.AddEdge(4, 10);

/*                                                 0
                            1                                          2
                    3               4                           5               6
                7       8        9      10
*/

var myCallback = function(newtextfile, index, n) {
    
    const fs = require('fs');
    const file = fs.readFileSync("bigfile.txt", "utf8")
    // in this case we read only one piece from the file after some time interval
    const source = fs.createReadStream("bigfile.txt", "utf8")
    //after that we set the stream variable we can start geting the file data
    source.on('data', function(chunk) {
        console.log("appending" + newtextfile);
        fs.appendFile(newtextfile, chunk, (err) => {
            
            if (err) throw err;
        });
    });
    if (n == 0) {
        console.log('layer ' + index + ' with  ' + math.sum(1, n) + 'st child checked');
    } else if (n == 1) {
        console.log('layer ' + index + ' with  ' + math.sum(1, n) + 'nd child checked');
    } else if (n == 2) {
        console.log('layer ' + index + ' with  ' + math.sum(1, n) + 'rd child checked');
    } else if (n >= 3) {
        console.log('layer ' + index + ' with ' + math.sum(1, n) + 'th child checked');
    }
};


var usingItNow = function(callback, file, index, n) {
    callback(file, index, n);
};

// not used
var fl = [];
const S_0 = Graph.FindStart();
let array = Graph.GetGraph();
console.log('S_0 -->>    ' + S_0);
let index = 0;
let layersList = new Array();
layersList.push(new Set(S_0));

// *comments with stars presents my arguments : here starts the main function that will run everything
function recursive(S_i, a, index, layersList) // recursive function (custom bfs)
{
    let parallelnode = [];
    let parallelnodes = [];
    
    // getting the elements of the array and their successors and pushin them to layersList
    index += 1;
    layersList.push(new Set());
    S_i.forEach(element => {
        console.log("S_i through")
        let arr2 = new Array();
        arr2 = a.get(element);
        arr2.forEach(item => {
            console.log("elements added !")
            layersList[index].add(item);
        });
    });
    //-----------------------------------

    // get the array of a set from an array --> [ {} ]
    S_i = Array.from(layersList[index]);
    console.log('successors S_i?  -->>        ' + S_i);

    // not used 
    var X = [];
    // loop through nodes and push them to array then push array into array --> [[text0],[text1,2],[text3,4,5,6]]
    for (let i = 0; i < S_i.length; i++) {
        console.log("getting pushed");
        parallelnode.push(usingItNow(myCallback, index + '_' + i + '.txt', index, i));
    }
    //where the execution happens and the results are saved in parallelnodes[]
    //*up until here there is no execution 
    //*but the next line does execution with promise.all(parallelnode) which execute nodes without order
    parallelnodes.push(Promise.all(parallelnode));
    //push the results of promise.all to parallelnodes !!

    //breaking point
    if (S_i.length == 0) {
        console.log("processing nodes execution.....");
        //console.log(parallelnodes);
        //execution of all the children and parents
        //*here is the final stage of the function where there is another execution of all the nodes in parallel nodes
        //Promise.all(parallelnodes)
        return parallelnode;
    }
    recursive(S_i, a, index, layersList);
}

////////////////////////////////
recursive(S_0, array, index, layersList);
////////////////////////////////