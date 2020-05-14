- npm start
- using react bootstrap
- ~react bootstrap slider~
- react bootstrap range slider

# TODO
- generate the positions using a spring layout
- take these positions and populates a graph on screen
- make edges be able to be directed (node1 -> node2)
- add collision detection for nodes (make the node not being dragged bounce)
- be able to select a source node
- run dfs (change colors as it goes)


# Algorithms

## Graph generation
Generating nodes spread out uniformly would produce well distanced nodes, however it would not take into account the topology of the graph.

Various layout algorithms exist, of which the following are implemented in this project:
- [Fruchterman-Reingold force-directed algorithm](#fruchterman-reingold-force-directed-algorithm).


#### Fruchterman-Reingold force-directed algorithm
In this class of algorithms, nodes apply attraction and repulsion forces between each other. In this algorithm, the forces are given by [1]:

$f_a(d) = \frac {d^2}{k}$, for attraction
$f_r(d) = \frac {-k^2}{d}$, for repulsion
where $d$ is the distance between a pair of vertices and k, the optimal distance between a pair of vertices, is defined as:
$k=C \sqrt \frac{area}{number of vertices}$, with C some scaling constant.

[1] http://cs.brown.edu/people/rtamassi/gdhandbook/chapters/force-directed.pdf