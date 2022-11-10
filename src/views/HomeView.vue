<script setup lang="ts">
import { reactive, ref } from "vue";
import * as vNG from "v-network-graph";
import { Edge, Edges, Nodes } from "v-network-graph";

const data = createNetwork(2, 3, 4, 3, 0);

function createNetwork(
  rows: number,
  Controlers: number,
  Switches: number,
  Hosts: number,
  MasterIndex: number
) {
  const network = ref(null);
  const dhcpcolor = "#ff0000";
  const controlerColor = "#fc03b5";
  const switchColor = "#03b5fc";
  const hostColor = "#03fc4e";
  const mastercontrolerColor = "#fc8403";
  var nodes = {};
  var edges = {};
  var layouts = {
    nodes: {},
  };

  var switchCount = 0;
  var hostCount = 0;
  let dhcpindex = 0;
  // Create DHCP
  nodes["dhcp" + dhcpindex] = {
    name: "DHCP Server " + (dhcpindex + 1),
    color: dhcpcolor,
  };
  layouts.nodes["dhcp" + dhcpindex] = { x: -1200, y: -1000 + dhcpindex * 1000 };

  //add controlers to dhcp
  for (let c = 0; c < Controlers; c++) {
    nodes["c" + 0 + c] = {
      name: (c == MasterIndex ? "Master " : "Slave ") + "Controler " + (c + 1),
      color: c == MasterIndex ? controlerColor : mastercontrolerColor,
    };
    layouts.nodes["c" + dhcpindex + c] = {
      x: -1000 + 250 * c,
      y: -1300,
    };
    edges["dhcp_to_controler_edge" + c + 0] = {
      source: "dhcp" + 0,
      target: "c" + 0 + c,
    };
  }

  //add switches to controlers
  for (let d = 0; d < rows; d++) {
    for (let j = 0; j < Switches; j++) {
      nodes["s" + switchCount] = {
        name: "Switch " + (switchCount + 1),
        color: switchColor,
      };
      layouts.nodes["s" + switchCount] = {
        // x: -600 + (450 * (j * Switches)) / Hosts,
        x: -600 + ((((300 * Switches) / Switches) * Hosts) / Controlers) * j,
        y: -900 + 400 * 0 + d * 500,
      };
      if (j == 0) {
        for (let k = 0; k < Controlers; k++) {
          edges["controler_to_switch_edge" + k + dhcpindex] = {
            source: "c" + dhcpindex + k,
            target: "s" + switchCount,
          };
        }
      } else {
        edges["controler_to_switch_edge" + switchCount] = {
          source: "s" + (switchCount - 1),
          target: "s" + switchCount,
        };
      }
      // add hosts to switches
      for (let k = 0; k < Hosts; k++) {
        nodes["h" + hostCount] = {
          name: "Host " + (hostCount + 1),
          color: hostColor,
        };
        layouts.nodes["h" + hostCount] = {
          x:
            -700 +
            100 * k +
            ((((300 * Switches) / Switches) * Hosts) / Controlers) * j,
          y: -900 + 400 * 0 + 150 + d * 500,
        };
        edges["host_to_switch_edge" + hostCount] = {
          source: "s" + switchCount,
          target: "h" + hostCount,
        };
        hostCount++;
      }
      switchCount++;
    }

    // Create Switches
    /* for (let i = 1; i < Switches; i++) {
    nodes["s" + i] = { name: "Switch " + i };
    layouts.nodes["s" + i] = { x: 0, y: 150 * i };
    // Create Edges
    for (let j = 0; j < Controlers; j++) {
      edges["sw_edge" + i + j] = { source: "c" + j, target: "s" + i };
    }
  }*/

    //add switches to controlers

    for (let i = 0; i < Controlers; i++) {}
  }

  //print network
  console.log(nodes);
  console.log("edges", edges);
  console.log(layouts);

  return { nodes, edges, layouts };
}

const configs = vNG.defineConfigs({
  view: {
    layoutHandler: new vNG.GridLayout({ grid: 15 }),
  },
  node: {
    normal: {
      type: "circle",
      size: 10,
      color: (node) => node.color,
    },
  },
});
</script>

<template>
  <div class="graph">
    <v-network-graph
      :zoom-level="0.5"
      :nodes="data.nodes"
      :edges="data.edges"
      :layouts="data.layouts"
      :configs="configs"
    />
  </div>
</template>

<style>
.graph {
  width: 1200px;
  height: 1000px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
</style>