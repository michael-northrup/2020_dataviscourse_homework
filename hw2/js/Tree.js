/** Class representing a Tree. */
class Tree {
    /**
     * Creates a Tree Object
     * Populates a single attribute that contains a list (array) of Node objects to be used by the other functions in this class
     * note: Node objects will have a name, parentNode, parentName, children, level, and position
     * @param {json[]} json - array of json objects with name and parent fields
     */
    constructor(json) {
        this.nodes = this.buildParentChildRelations(json);
    }
    /**
     * Helper function for constructor to unpack json data into objects of the Node class
     */
    buildParentChildRelations(json) {
        let allNodes = json.map(x => new Node(x.name, x.parent));
        allNodes.map(x => assignChildren(x, allNodes))
        allNodes.map(x => assignParents(x, allNodes))
        function assignChildren(parentNode, allNodes) {
            let children = allNodes.filter(x => x.parentName === parentNode.name)
            for (let child of children) {
                parentNode.addChild(child);
            }
            return parentNode;
        }
        function assignParents(childNode, allNodes) {
            childNode.parentNode = allNodes.find(x => x.name === childNode.parentName);
            return childNode;
        }
        return allNodes;
    }
    /**
     * Function that builds a tree from a list of nodes with parent refs
     */
    buildTree() {
        // note: in this function you will assign positions and levels by making calls to assignPosition() and assignLevel()
        this.assignLevel(this.nodes.find(x => x.parentName==='root'),0)
        this.assignPosition(this.nodes.find(x => x.parentName==='root'),0)
        console.log(this.nodes)
    }
    /**
     * Recursive function that assign levels to each node
     */
    assignLevel(node, level) {
        node.level = level;
        if (node.children.length > 0) {
            for (let child of node.children) {
                this.assignLevel(child, level+1);
            }
        }
    }
    /**
     * Recursive function that assign positions to each node
     */
    assignPosition(node, position) {
        node.position = position;
        if (node.children.length === 0) {
                return position + 1
            }
        else {
            for (let child of node.children) {
                position = this.assignPosition(child, position)
            }
            return position
        }
    }
    /**
     * Function that renders the tree
     */
    renderTree() {
        let svg = d3.select("body").append("svg")
            .attr("width", 1200)
            .attr("height", 1200)

        svg.selectAll("line")
            .data(this.nodes)
            .enter()
            .append("line")
            .attr("x1", d => (d.level * 200)+250)
            .attr("y1", d => (d.position * 90)+50)
            .attr("x2", d => (d.parentNode === undefined ? 0: d.parentNode.level * 200)+250)
            .attr("y2", d => (d.parentNode === undefined ? 0: d.parentNode.position * 90)+50);

        let nodeGroups = svg.selectAll(".nodeGroup")
            .data(this.nodes);
        let nodeGroupsEnter = nodeGroups.enter()
            .append("g")
            .classed("nodeGroup", true);
        nodeGroupsEnter.append("circle")
            .attr("cx", d => d.level * 200)
            .attr("cy", d => d.position * 90)
            .attr("r", 40)
            .attr("text", d=> d.name)

        nodeGroupsEnter.append("text")
            .classed("label", true)
            .attr("x", d => d.level * 200)
            .attr("y", d => d.position * 90)
            .text(d=> d.name);

        nodeGroupsEnter.attr("transform", function () {
            return "translate(250, 50)";
        })

        nodeGroups.exit().remove();
        nodeGroups = nodeGroups.merge(nodeGroupsEnter);

    }

}