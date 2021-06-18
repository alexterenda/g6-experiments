import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom';
import { data } from './data';
import G6 from '@antv/g6';

const Graph = () => {

const ref = React.useRef(null);
  let graph = null;

    const toolbar = new G6.ToolBar();

    const nodes = data.nodes;
    nodes.forEach((node) => {
        if (!node.style) {
        node.style = {};
        }
        node.style.lineWidth = 1;
        node.style.stroke = '#5B8FF9';
        node.style.fill = '#DEE9FF';
        // eslint-disable-next-line default-case
        switch (node.class) {
            case 'c0': {
                break;
            }
            case 'c1': {
                node.size = [30, 23];
                break;
            }
            case 'c2': {
                node.size = [50, 50];
                break;
            }
        } 
    });

    const edges = data.edges;
    edges.forEach((edge) => {
        if (!edge.style) {
            edge.style = {};
        }
        edge.style.lineWidth = edge.weight; // Mapping the weight in data to lineWidth
        // The styles are moved to here
        edge.style.opacity = 0.5;
        edge.style.stroke = 'grey';
    });

  useEffect(() => {
    if (!graph) {

      const container = ReactDOM.findDOMNode(ref.current);
      const width = container.scrollWidth;
      const height = (container.scrollHeight || 500) - 120;

      const timeBarData = [];

      for (let i = 0; i < 10; i++) {
        timeBarData.push({
          date: `2020${i}`,
          value: Math.round(Math.random() * 300),
        });
      }

      const timebar = new G6.TimeBar({
        x: 0,
        y: 0,
        width,
        height: 150,
        padding: 10,
        type: 'trend',
        
        trend: {
          data: timeBarData,
        },
      });


      // eslint-disable-next-line react-hooks/exhaustive-deps
      graph = new G6.Graph({
        container: ReactDOM.findDOMNode(ref.current),
        width: width,
        height: height,
        animate: true,
        // plugins: [timebar],
        plugins: [toolbar, timebar],
        modes: {
          default: ['drag-canvas', 'drag-node', 'zoom-canvas', {
        type: 'tooltip', // Tooltip
        formatText(model) {
          // The content of tooltip0 25px 50px -12px rgba(0, 0, 0, 0.25)
          const text = 'label: ' + model.label + '<br/> class: ' + model.class;
          return text;
        },
      }, {
        type: 'edge-tooltip', // Edge tooltip
        formatText(model) {
          // The content of the edge tooltip
          const text =
            'source: ' +
            model.source +
            '<br/> target: ' +
            model.target +
            '<br/> weight: ' +
            model.weight;
          return text;
        },
      },
],
        },

        layout: {
          type: 'force',
          center: [200, 200], // The center of the graph by default
          linkDistance: 100, // Edge length
          nodeStrength: -30,
          edgeStrength: 0.1,
          collideStrength: 0.8,
          nodeSize: 50,
          alpha: 0.3,
          alphaDecay: 0.028,
          alphaMin: 0.01,
          forceSimulation: null,
          preventOverlap: true,
          linkCenter: true
        },
        defaultNode: {
          size: 20,
          type: 'circle',
          labelCfg: {
            style: {
              fill: '#000000A6',
              fontSize: 10,
            },
          },
          style: {
            fill: '#DEE9FF',
            stroke: '#5B8FF9',
          },
        },
        defaultEdge: {
          type: 'straight',
        },
        nodeStateStyles: {
          // The node style when the state 'hover' is true
          hover: {
            fill: '#b6c9e3',
          },
          // The node style when the state 'click' is true
          click: {
            stroke: '#0746c5',
            lineWidth: 3,
          },
        },
        // The edge styles in different states
        edgeStateStyles: {
          // The edge style when the state 'click' is true
          click: {
            stroke: '#0746c5',
          },
        },
      });
    }

    graph.on('node:mouseenter', (e) => {
          const nodeItem = e.item; // Get the target item
          graph.setItemState(nodeItem, 'hover', true); // Set the state 'hover' of the item to be true
        });

        // Mouse leave a node
        graph.on('node:mouseleave', (e) => {
          const nodeItem = e.item; // Get the target item
          graph.setItemState(nodeItem, 'hover', false); // Set the state 'hover' of the item to be false
        });

        // Click a node
        graph.on('node:click', (e) => {
          // Swich the 'click' state of the node to be false
          const clickNodes = graph.findAllByState('node', 'click');
          clickNodes.forEach((cn) => {
            graph.setItemState(cn, 'click', false);
          });
          const nodeItem = e.item; // et the clicked item
          graph.setItemState(nodeItem, 'click', true); // Set the state 'click' of the item to be true
        });

        // Click an edge
        graph.on('edge:click', (e) => {
          // Swich the 'click' state of the edge to be false
          const clickEdges = graph.findAllByState('edge', 'click');
          clickEdges.forEach((ce) => {
            graph.setItemState(ce, 'click', false);
          });
          const edgeItem = e.item; // Get the clicked item
          graph.setItemState(edgeItem, 'click', true); // Set the state 'click' of the item to be true
        });

    
      

    graph.data(data);
    graph.render();

  }, []);
    return (
        <div className="">
        <div ref={ref} className='graph-container'><div className="toggle-cover"></div></div>
        </div>
    )
}

export default Graph;
