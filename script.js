
//  Creating  the graph
const graph = {};

const towns = [
    "Mzuzu", "Karonga", "Chitipa", "Rumphi",
    "Nkhata Bay", "Mzimba", "Lilongwe", "Kasungu",
    "Nkhotakota", "Salima", "Dedza", "Ntcheu",
    "Mchinji", "Mangochi", "Balaka", "Zomba",
    "Blantyre", "Thyolo", "Mulanje", "Nsanje"
];

// Creating an empty adjacency list for every town
towns.forEach(town => {
    graph[town] = [];
});

//  Adding an undirected weighted connection
function addEdge(town1, town2, distance) {
    graph[town1].push({ town: town2, distance: distance });
    graph[town2].push({ town: town1, distance: distance });
}

// Adding the 24 connections 
addEdge("Mzuzu", "Karonga", 170);
addEdge("Karonga", "Chitipa", 100);
addEdge("Mzuzu", "Rumphi", 53);
addEdge("Mzuzu", "Nkhata Bay", 40);
addEdge("Mzuzu", "Mzimba", 66);
addEdge("Mzimba", "Kasungu", 126);
addEdge("Kasungu", "Lilongwe", 108);
addEdge("Kasungu", "Nkhotakota", 89);
addEdge("Nkhotakota", "Salima", 96);
addEdge("Salima", "Lilongwe", 75);
addEdge("Lilongwe", "Mchinji", 100);
addEdge("Lilongwe", "Dedza", 74);
addEdge("Dedza", "Ntcheu", 80);
addEdge("Ntcheu", "Balaka", 70);
addEdge("Balaka", "Mangochi", 89);
addEdge("Mangochi", "Zomba", 101);
addEdge("Zomba", "Blantyre", 55);
addEdge("Blantyre", "Thyolo", 40);
addEdge("Thyolo", "Mulanje", 40);
addEdge("Blantyre", "Nsanje", 180);
addEdge("Lilongwe", "Mzuzu", 278);
addEdge("Lilongwe", "Blantyre", 240);
addEdge("Salima", "Mangochi", 116);
addEdge("Blantyre", "Balaka", 127);



// Implementing  Dijkstra's algorithm

function dijkstra(graph, source, destination) {
    const distance = {};
    const predecessor = {};
    const visited = new Set();

    // Initialising distances and predecessors
    for (const town of Object.keys(graph)) {
        distance[town] = Infinity;
        predecessor[town] = null;
    }

    distance[source] = 0;

    while (true) {
        let currentTown = null;
        let smallestDistance = Infinity;

        // Finding  the unvisited town with the smallest distance
        for (const town of Object.keys(graph)) {
            if (
                !visited.has(town) &&
                distance[town] < smallestDistance
            ) {
                smallestDistance = distance[town];
                currentTown = town;
            }
        }

        if (currentTown === null) {
            break;
        }
        if (currentTown === destination) {
            break;
        }

        visited.add(currentTown);

        // Examining the current town's neighbours
        for (const neighbour of graph[currentTown]) {
            const newDistance =
                distance[currentTown] + neighbour.distance;

            if (newDistance < distance[neighbour.town]) {
                distance[neighbour.town] = newDistance;
                predecessor[neighbour.town] = currentTown;
            }
        }
    }

    // Reconstructing  the shortest path
    const path = [];
    let current = destination;

    if (distance[destination] === Infinity) {
        return {
            distance: Infinity,
            path: [],
            predecessor: predecessor
        };
    }

    while (current !== null) {
        path.unshift(current);

        if (current === source) {
            break;
        }

        current = predecessor[current];
    }

    return {
        distance: distance[destination],
        path: path,
        predecessor: predecessor
    };
}

document.getElementById("findRoute").addEventListener("click", function () {
    const source = document.getElementById("source").value;
    const destination = document.getElementById("destination").value;

    const result = dijkstra(graph, source, destination);

    const output = document.getElementById("output");

    if (result.path.length === 0) {
        output.innerHTML = `
            <h2>Results</h2>
            <p>No route was found between these towns.</p>
        `;
        return;
    }

    output.innerHTML = `
        <h2>Shortest Route</h2>
        <p><strong>From:</strong> ${source}</p>
        <p><strong>To:</strong> ${destination}</p>
        <p><strong>Route:</strong> ${result.path.join(" → ")}</p>
        <p><strong>Total distance:</strong> ${result.distance} km</p>
    `;
});
//error handling 
document.getElementById("findRoute").addEventListener("click", function () {
    const source = document.getElementById("source").value;
    const destination = document.getElementById("destination").value;
    const output = document.getElementById("output");
 
    // Invalid input: no town selected (the placeholder is still showing).
    if (!source || !destination) {
        output.innerHTML = "<h2>Error</h2><p>Please select both a source town and a destination town.</p>";
        return;
    }
 
    const result = dijkstra(graph, source, destination);
 
    // Invalid town or no route found.
    if (result.error) {
        output.innerHTML = "<h2>Error</h2><p>" + result.error + "</p>";
        return;
    }
 
    output.innerHTML =
        "<h2>Shortest Route</h2>" +
        "<p><strong>From:</strong> " + source + "</p>" +
        "<p><strong>To:</strong> " + destination + "</p>" +
        "<p><strong>Route:</strong> " + result.path.join(" → ") + "</p>" +
        "<p><strong>Total distance:</strong> " + result.distance + " km</p>";
});

