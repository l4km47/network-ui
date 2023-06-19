<template>
  <div class="">
    <!-- popup diagram -->
    <div v-if="PopupDiagram" class="card graph popup">
      <div class="card-body">
        <!-- close button -->
        <button
          type="button"
          class="btn btn-sm"
          aria-label="Close"
          @click="PopupDiagram = false"
        >
          <!-- full screen icon google material -->
          <span class="material-symbols-outlined"> close </span>
        </button>
        <v-network-graph
          :zoom-level="0.1"
          :nodes="data.nodes"
          :edges="data.edges"
          :layouts="data.layouts"
          :configs="configs"
          :paths="data.paths"
          :event-handlers="eventHandlers"
        >
          <template #override-node="{ nodeId }">
            <defs>
              <clipPath id="myCircle">
                <circle cx="00" cy="0" r="500" fill="#ff00ff00" />
              </clipPath>
            </defs>
            <image
              :xlink:href="getimage(data.nodes[nodeId])"
              :x="-150"
              :y="-150"
              width="300"
              height="300"
              clip-path="url(#myCircle)"
            />
          </template>
        </v-network-graph>
      </div>
    </div>

    <!-- top nav -->
    <nav class="navbar navbar-expand-sm navbar-sm navbar-dark bg-dark">
      <a class="container-fluid navbar-brand" href="#">STP Dashboard</a>
    </nav>
    <!-- end top nav -->

    <!-- start page content -->
    <div class="container-fluid">
      <div class="col-lg">
        <div class="row">
          <div class="graph-container col-lg-10">
            <div class="card-body">
              <div class="card-text">
                <div class="graph">
                  <v-network-graph
                    :zoom-level="0.1"
                    :nodes="data.nodes"
                    :edges="data.edges"
                    :layouts="data.layouts"
                    :paths="data.paths"
                    :configs="configs"
                    :event-handlers="eventHandlers"
                  >
                    <template #override-node="{ nodeId }">
                      <defs>
                        <clipPath id="myCircle">
                          <circle cx="00" cy="0" r="500" fill="#ff00ff00" />
                        </clipPath>
                      </defs>
                      <image
                        :xlink:href="getimage(data.nodes[nodeId])"
                        :x="-150"
                        :y="-150"
                        width="300"
                        height="300"
                        clip-path="url(#myCircle)"
                      />
                    </template>
                  </v-network-graph>
                </div>
                <button
                  type="button"
                  class="btn btn-sm"
                  aria-label="Close"
                  @click="PopupDiagram = true"
                >
                  <!-- full screen icon google material -->
                  <span class="material-symbols-outlined"> fullscreen </span>
                </button>
              </div>
            </div>
          </div>
          <div class="card col-lg-2">
            <div class="card-body">
              <h4 class="card-title">Assinged ips</h4>
              <div class="card-text">
                <div class="iplist">
                  <span v-for="ip in getips()" :key="ip.id">
                    {{ ip.ip }} ➡️ {{ ip.name.split("\n")[0] }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="card col-sm-6 col-lg-4">
            <div class="card-body">
              <h4 class="card-title">Add / Edit Component</h4>
              <div class="card-text">
                <div
                  class="row"
                  style="display: flex; flex-direction: row; flex-wrap: nowrap"
                >
                  <div class="form-group" style="width: 30%">
                    <label for="name">ID</label>
                    <input
                      readonly
                      class="form-control form-control-sm"
                      id="name"
                      v-model="newSwitch._id"
                      placeholder="Id"
                    />
                  </div>
                  <div class="form-group" style="width: 70%">
                    <label for="name">Name</label>
                    <input
                      class="form-control form-control-sm"
                      id="name"
                      v-model="newSwitch.name"
                      placeholder="Enter name"
                    />
                    <label for="name">{{ newSwitch.ip }}</label>
                  </div>
                </div>
                <!-- dropdown -->
                <div
                  class="row"
                  style="display: flex; flex-direction: row; flex-wrap: nowrap"
                >
                  <div class="form-group" style="width: 30%">
                    <label for="type">Type</label>
                    <select
                      class="form-control form-control-sm"
                      id="type"
                      v-model="newSwitch.type"
                      placeholder="Enter type"
                      @change="onChangetype()"
                    >
                      <option
                        v-for="(type, index) in filterComType()"
                        :key="index"
                        :value="type"
                      >
                        <p>{{ type }}</p>
                      </option>
                    </select>
                  </div>
                </div>
                <br />
                <div
                  v-if="newSwitch.type == ComponentType.Host"
                  class="form-check card"
                >
                  <label for="ip">Interface</label>
                  <!-- eth ports list of switch -->
                  <div>
                    <div
                      v-for="n in 4"
                      :key="n"
                      class="form-check form-check-inline"
                    >
                      <input
                        class="form-check-input"
                        type="radio"
                        name="inlineRadioOptions"
                        :id="'inlineRadio' + (n - 1)"
                        :value="newSwitch.eth"
                        @change="setEth(n - 1)"
                      />
                      <label class="form-check-label" for="inlineRadio1"
                        >eth{{ n - 1 }}</label
                      >
                    </div>
                  </div>
                </div>
                <!-- master slave selection -->
                <div
                  class="form-group"
                  v-if="newSwitch.type == ComponentType.Controller"
                >
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      :value="newSwitch.isMaster"
                      id="flexCheckChecked"
                      :checked="newSwitch.isMaster"
                      @change="newSwitch.isMaster = !newSwitch.isMaster"
                    />
                    <label class="form-check-label" for="flexCheckChecked">
                      is Master Controler
                    </label>
                  </div>
                </div>
                <br />
                <div v-if="newSwitch.type != ComponentType.DHCP" class="card">
                  <div class="card-body">
                    <h5 class="card-title">Add to Interfaces</h5>
                    <div class="log-list2">
                      <div
                        style="display: flex; align-items: center"
                        v-for="node in filterNodes()"
                        :key="node.id"
                      >
                        <input
                          class="form-check-input"
                          type="checkbox"
                          :id="'flexCheckChecked' + node.id"
                          :value="node.isSelected"
                          v-model="node.isSelected"
                          @change="onAddInterface(node)"
                        />
                        <div
                          class="form-check-label node-lable"
                          :for="'flexCheckChecked' + node.id"
                        >
                          <span class="node-name">{{
                            node.name.split("\n")[0]
                          }}</span>
                          <span :class="getTypeCss(node)">{{
                            node.nodetype
                          }}</span
                          ><span class="node-id">{{ node.id }}</span>
                          <span class="node-ip">{{ node.ip }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  class="btn btn-primary btn-sm"
                  @click="addNewSwitch()"
                >
                  {{ addbutton }}
                </button>
              </div>
            </div>
          </div>
          <div class="card col-sm-4">
            <!-- list nodes -->
            <div class="card-body">
              <h4 class="card-title">List of Nodes</h4>
              <div class="card-text node-list">
                <div
                  class="node-lable"
                  v-for="node in data.nodes"
                  :key="node.id"
                >
                  <div class="node-details">
                    <div>
                      <span class="node-name">{{
                        node.name.split("\n")[0]
                      }}</span>
                      <span :class="getTypeCss(node)">{{ node.nodetype }}</span
                      ><span class="node-id">{{ node.id }}</span>
                    </div>
                    <div>
                      <span
                        v-if="node.nodetype == ComponentType.Host"
                        class="node-eth"
                        >{{ node.eth }}</span
                      >
                      <span class="node-ip">{{ node.ip }}</span>
                      <span
                        class="btn btn-sm node-status"
                        @click="setNodeStatus(node)"
                        >{{ node.status }}
                        <span class="">
                          <i :class="getonline(node)" aria-hidden="true"></i>
                        </span>
                      </span>
                    </div>
                  </div>

                  <!-- space -->
                  <span class="spacer"></span>
                  <button
                    style="margin-right: 5px"
                    v-if="
                      node.nodetype == ComponentType.Controller &&
                      node.name.includes('Slave')
                    "
                    class="btn btn-sm btn-primary"
                    @click="setMaster(node)"
                  >
                    Set Master
                  </button>
                  <button
                    style="margin-right: 5px"
                    class="btn btn-danger btn-sm"
                    @click="onRemoveInterface(node)"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div class="card col-sm-6 col-lg-4">
            <div class="card-body">
              <h4 class="card-title">Log</h4>
              <div class="card-text">
                <!-- scroll automatically random firewall log -->
                <div class="log-list" ref="log">
                  <div v-for="log in firewallLog" :key="log">
                    <span class="log-time">{{ log }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <br />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from "vue";
import { Component, ComponentType } from "../components/NetworkComponent";
import * as vNG from "v-network-graph";

import fdata from "../data/firewall";

function finddhcp(id) {
  let sources: string[] = [];
  for (let key in data.edges) {
    if (data.edges[key].target == id) {
      sources.push(key);
    }
  }
  return sources;
}
const eventHandlers: vNG.EventHandlers = {
  "node:click": ({ node }) => {
    //get note data
    let n = data.nodes[node];
    newSwitch.name = n.name.split("\n")[0];
    newSwitch.ip = n.ip;
    newSwitch.eth = n.eth;
    newSwitch.type = n.nodetype;
    newSwitch.isMaster = n.name.includes("Master");
    newSwitch._id = n.id;
    //de select all nodes
    for (let key in data.nodes) {
      data.nodes[key].isSelected = false;
    }
    for (let key in data.edges) {
      if (data.edges[key].target == newSwitch._id) {
        data.nodes[data.edges[key].source].isSelected = true;
      }
    }

    //remove all paths
    for (let key in data.paths) {
      delete data.paths[key];
    }

    //find edges to dhcp0 and add to array
    let edges: string[] = [];
    let id = newSwitch._id;
    //loop until find all connected nodes
    edges = finddhcp(id);

    //loop until find all connected nodes
    for (let i = 0; i < edges.length; i++) {
      let edge = edges[i];
      let source = data.edges[edge].source;
      let target = data.edges[edge].target;
      edges = edges.concat(finddhcp(source));
    }
    //remove status offline edges
    for (let i = 0; i < edges.length; i++) {
      let edge = edges[i];
      if (
        data.nodes[data.edges[edge].source].status == "Offline" ||
        data.nodes[data.edges[edge].target].status == "Offline"
      ) {
        edges.splice(i, 1);
        i--;
      }
    }

    //remove duplicates from array
    let unique_edges: string[] = [...new Set(edges)];
    console.log(unique_edges);
    for (let key in unique_edges) {
      let path = {
        edges: [unique_edges[key]],
      };
      data.paths[unique_edges[key] + newSwitch._id] = path;
    }
    addbutton = "Update";
  },
  "node:dragend": (event) => {
    let pos = Object.values(event)[0];
    let node = Object.keys(event)[0];
    //console.log("node:dragend", node, pos);
    data.layouts.nodes[node].x = pos.x;
    data.layouts.nodes[node].y = pos.y;
    if (localStorage.getItem("data") == null) {
      localStorage.setItem("data", JSON.stringify(data));
    } else {
      let localData = JSON.parse(localStorage.getItem("data") || "");
      localData.layouts.nodes[node].x = pos.x;
      localData.layouts.nodes[node].y = pos.y;
      localStorage.setItem("data", JSON.stringify(localData));
    }
  },
};

let PopupDiagram = false;
let addbutton: string = "Add Edit ";
let ips: string[] = reactive([""]);
ips = [];

let firewallLog = reactive([
  "loading app ryu.app.simple_switch_stp_13",
  "loading app ryu.controller.ofp_handler",
  "instantiating app None of Stp",
  "creating context stplib",
  "instantiating app ryu.app.simple_switch_stp_13 of SimpleSwitch13",
  "instantiating app ryu.controller.ofp_handler of OFPHandler",
  "[STP][INFO] dpid=0000000000000004: Join as stp bridge.",
  "[STP][INFO] dpid=0000000000000003: Join as stp bridge.",
  "[STP][INFO] dpid=0000000000000001: Join as stp bridge.",
  "[STP][INFO] dpid=0000000000000005: Join as stp bridge.",
  "[STP][INFO] dpid=0000000000000002: Join as stp bridge.",
]);

let data = reactive({
  paths: {
    path1: { edges: ["edge1", "edge3", "edge5", "edge7"] },
  },
  nodes: {
    dhcp0: {
      id: "dhcp0",
      name: "DHCP Server 1",
      color: new Component().getColor2(ComponentType.DHCP),
      isSelected: false,
      type: "Type C\nMultiline",
      nodetype: ComponentType.DHCP,
      ip: "",
      status: "Online",
      icon: "&#f86a",
      eth: 0,
    },
    //controller0
    c00: {
      id: "c00",
      name: "(Master) Controller 1",
      color: new Component().getColor2(ComponentType.Controller),
      isSelected: false,
      type: "Type C\nMultiline",
      nodetype: ComponentType.Controller,
      ip: "",
      status: "Offline",
      icon: "&#f86a",
      eth: 0,
    },
  },
  edges: {
    dhcp_to_controler_edge00: {
      source: "dhcp0",
      target: "c00",
    },
  },
  layouts: {
    nodes: {
      dhcp0: { x: -2200, y: -2000 },
      c00: { x: -600, y: -2000 },
    },
  },
});

//read saved local data
if (localStorage.getItem("data")) {
  data = reactive(JSON.parse(localStorage.getItem("data") || "{}"));
  // console.log(data);
}

let newSwitch = reactive(new Component());

//chart config
let configs = reactive({
  view: {
    layoutHandler: new vNG.SimpleLayout(),
  },
  marker: {
    source: {
      type: "none",
      width: 4,
      height: 4,
      margin: -1,
      units: "strokeWidth",
      color: null,
    },
    target: {
      type: "arrow",
      width: 4,
      height: 4,
      margin: -1,
      units: "strokeWidth",
      color: null,
    },
  },
  node: {
    selectable: true,
    normal: {
      type: "rect",
      size: 10,
      color: (node) => node.color,
    },
    label: {
      visible: true,
      fontFamily: undefined,
      fontSize: 14,
      lineHeight: 1.1,
      color: "#000000",
      margin: 4,
      direction: "north-east",
      text: "name",
    },
  },
  path: {
    visible: true,
    normal: {
      width: 10,
      dasharray: "10 16",
      color: (path) => {
        try {
          if (data.nodes[data.edges[path.edges[0]]])
            return data.nodes[data.edges[path.edges[0]].source].color;
          let source = data.nodes[data.edges[path.edges[0]].source];
          let target = data.nodes[data.edges[path.edges[0]].target];
          if (source || target) {
            if (source.status == "Online" && target.status == "Online") {
              //add transparent color
              return "rgba(0, 255, 0, 0.5)";
            } else {
              return "rgba(255, 0, 0, 0.5)";
            }
          }
        } catch (e) {
          console.log(e);
          return "rgba(255, 0, 0, 0.5)";
        }
      },
      animate: true,
      animationSpeed: 40,
    },
  },
  edge: {
    gap: 5,
    type: "straight",
    margin: 2,
    normal: {
      color: (edge) => {
        try {
          //   console.log(edge.source);
          let source = data.nodes[edge.source];
          let target = data.nodes[edge.target];
          if (source && target) {
            if (target.status == "Online" && source.status == "Online") {
              return "#038227";
            } else if (
              target.status == "Offline" ||
              source.status == "Offline"
            ) {
              return "#ff0000";
            } else {
              return "#820b03";
            }
          } else if (source) {
            if (source.status == "Online") {
              return "#038227";
            } else {
              return "#820b03";
            }
          }
        } catch (e) {
          //
        }
      },
    },
    marker: {
      source: {
        type: "circle",
        width: 6,
        height: 6,
        margin: -15,
        units: "strokeWidth",
        color: (edge) => {
          //  console.log(edge[0].source);
          if (data.nodes[edge[0].target])
            return data.nodes[edge[0].source].status == "Online"
              ? "#00ff00"
              : "#ff0000";
          else return "#ff0000";
        },
      },
      target: {
        type: "circle",
        width: 6,
        height: 6,
        margin: -15,
        units: "strokeWidth",
        color: (edge) => {
          //  console.log(edge[0].target);
          if (data.nodes[edge[0].target])
            return data.nodes[edge[0].target].status == "Online"
              ? "#00ff00"
              : "#ff0000";
          else return "#ff0000";
        },
      },
    },
  },
});

//scroll automatically to end of log
function scrollToEnd() {
  document.querySelector(".log-list")?.scrollTo(0, 100000);
}

//increment ip address by 1
function incrementIP(ip: string) {
  console.log("last ip", ip);
  let ipArr = ip.split(".");
  let last = ipArr.pop();
  if (last) {
    let lastNum = parseInt(last);
    lastNum++;
    ipArr.push(lastNum.toString());
  }
  console.log("new ip", ipArr.join("."));
  return ipArr.join(".");
}

function onRemoveInterface(node) {
  // console.log("onRemoveInterface", node.id);
  delete data.layouts.nodes[node.id];
  delete data.nodes[node.id];
  //delete object from nodes
  for (let key in data.edges) {
    if (data.edges[key].source == node.id) {
      delete data.edges[key];
    }
  }
  //  console.log("data", data);
  firewallLog.push("Node " + node.name + " is removed");

  if (localStorage.getItem("data") == null) {
    localStorage.setItem("data", JSON.stringify(data));
  } else {
    localStorage.setItem("data", JSON.stringify(data));
  }
}

//change master controller
function setMaster(n) {
  //console.log("setMaster", n);

  for (let key in data.nodes) {
    if (data.nodes[key].nodetype == ComponentType.Controller) {
      data.nodes[key].name = data.nodes[key].name.replace("Master", "Slave");
      data.nodes[key].color = "#5b008f";
    }
  }
  n.name = n.name.replace("Slave", "Master");
  n.color = "#a816fd";
  firewallLog.push("Master controller is set to " + n.name);

  if (localStorage.getItem("data") == null) {
    localStorage.setItem("data", JSON.stringify(data));
  } else {
    localStorage.setItem("data", JSON.stringify(data));
  }
}

//get conteroller type style
function getTypeCss(t) {
  // console.log("t", t);
  switch (t.nodetype) {
    case ComponentType.Controller:
      if (!t.name.includes("Master")) {
        return "node-type-controller-slave";
      }
      return "node-type node-type-controller";
    case ComponentType.DHCP:
      return "node-type node-type-dhcp";
    case ComponentType.Switch:
      return "node-type node-type-switch";
    case ComponentType.Host:
      return "node-type node-type-host";
    default:
      return "node-type";
  }
  return "node-type " + t;
}

//get component image icon
function getimage(node) {
  switch (node.nodetype) {
    case ComponentType.DHCP:
      return "/server.png";
    case ComponentType.Controller:
      if (node.name.includes("Master")) {
        return "/network-master.png";
      }
      return "/network.png";
    case ComponentType.Switch:
      return "/hub.png";
    case ComponentType.Host:
      return "/computer.png";
    default:
      return "/computer.png";
  }
}
function onAddInterface(node) {
  //set target
}

function filterComType() {
  let types = Object.values(ComponentType);
  return types; //.filter((type) => type != ComponentType.DHCP);
}

function filterNodes() {
  let nodes = Object.values(data.nodes);
  return nodes.filter((node) => node.nodetype != ComponentType.Host);
}

function getonline(node) {
  if (node.status == "Online") {
    return "fa fa-circle online";
  }
  return "fa fa-circle offline";
}

function setEth(n) {
  newSwitch.eth = n;
}

function addNewSwitch() {
  if (newSwitch.type == ComponentType.Controller)
    if (newSwitch.isMaster) {
      for (let key in data.nodes) {
        if (data.nodes[key].nodetype == ComponentType.Controller) {
          data.nodes[key].name = data.nodes[key].name.replace(
            "Master",
            "Slave"
          );
          data.nodes[key].color = "#5b008f";
        }
      }
      if (!newSwitch.name.includes("Master")) {
        newSwitch.name = "(Master) " + newSwitch.name;
      }
    } else {
      if (!newSwitch.name.includes("Slave")) {
        newSwitch.name = "(Slave) " + newSwitch.name;
      }
    }

  //check ip is already used
  let ip = newSwitch.ip;
  let ipUsed = false;
  if (ip != "")
    for (let key in data.nodes) {
      if (data.nodes[key].ip == ip) {
        ipUsed = true;
        break;
      }
    }
  let isupdate = ipUsed;
  console.log("isupdate", isupdate);
  console.log("newSwitch", newSwitch.ip);
  //get last ip
  let lastIP = getips()[getips().length - 1].ip;
  //check last is is empty
  if (lastIP == "") {
    lastIP = "10.0.0.1";
  }

  if (!isupdate) if (lastIP) newSwitch.ip = incrementIP(lastIP);
  console.log("lastIP", lastIP, newSwitch.ip);

  data.nodes[newSwitch._id] = {
    id: newSwitch._id,
    name: ComponentType.Host
      ? newSwitch.name + "\n" + newSwitch.ip
      : newSwitch.name,
    color: newSwitch.isMaster ? "#a816fd" : newSwitch.getColor(),
    isSelected: false,
    nodetype: newSwitch.type,
    type: "Type C\nMultiline",
    ip: ComponentType.Host ? newSwitch.ip : "",
    status: "Online",
    eth: newSwitch.eth,
  };

  //get selected nodes
  let selectedNodes = Object.values(data.nodes).filter(
    (node) => node.isSelected
  );
  if (isupdate) {
    //clear edges
    for (let key in data.edges) {
      if (data.edges[key].target == newSwitch._id) {
        delete data.edges[key];
      }
    }
  }
  //add edges
  selectedNodes.forEach((node) => {
    data.edges[node.id + "_to_" + newSwitch._id] = {
      source: node.id,
      target: newSwitch._id,
    };
  });

  if (!isupdate) {
    //add layout
    if (selectedNodes.length > 0) {
      //get selected nodes last node location
      let lastNode = selectedNodes[selectedNodes.length - 1];
      let lastNodeLayout = data.layouts.nodes[lastNode.id];
      data.layouts.nodes[newSwitch._id] = {
        x: lastNodeLayout.x + 1000,
        y: lastNodeLayout.y,
      };
    } else {
      data.layouts.nodes[newSwitch._id] = { x: -1500, y: -1800 };
    }
  }
  //reset selected nodes
  selectedNodes.forEach((node) => {
    node.isSelected = false;
  });

  firewallLog.push(`New ${newSwitch.type} added with name ${newSwitch.name}`);
  //reset new switch
  newSwitch.name = "";
  newSwitch._id = "";
  newSwitch.targets = [];
  newSwitch.type = ComponentType.Switch;
  newSwitch.isMaster = false;
  newSwitch.ip = "";
  newSwitch.status = "Online";
  onChangetype();

  if (localStorage.getItem("data") == null) {
    localStorage.setItem("data", JSON.stringify(data));
  } else {
    localStorage.setItem("data", JSON.stringify(data));
  }
}
function onChangetype() {
  switch (newSwitch.type) {
    case ComponentType.Switch:
      newSwitch._id = "sw" + Math.floor(Math.random() * 1000);
      break;
    case ComponentType.Host:
      newSwitch._id = "h" + Math.floor(Math.random() * 1000);
      break;
    case ComponentType.Controller:
      newSwitch._id = "c" + Math.floor(Math.random() * 1000);
      break;
    case ComponentType.DHCP:
      newSwitch._id = "dhcp" + Math.floor(Math.random() * 1000);
      break;
  }
  //reset new switch
  newSwitch.name = "";
  newSwitch.targets = [];
  newSwitch.isMaster = false;
  newSwitch.ip = "";
  newSwitch.status = "Online";
  addbutton = "Add new " + newSwitch.type;

  //reset selected nodes
  let selectedNodes = Object.values(data.nodes).filter(
    (node) => node.isSelected
  );
  selectedNodes.forEach((node) => {
    node.isSelected = false;
  });
}

//set node status
function setNodeStatus(node) {
  if (node.status == "Online") {
    node.status = "Offline";
  } else {
    node.status = "Online";
  }
  if (localStorage.getItem("data") == null) {
    localStorage.setItem("data", JSON.stringify(data));
  } else {
    localStorage.setItem("data", JSON.stringify(data));
  }
}
//loop random firewall log
let findex = 0;
setInterval(() => {
  let random = Math.floor(Math.random() * fdata.length);
  firewallLog.push(fdata[findex]);

  if (firewallLog.length > 20) {
    firewallLog.shift();
    firewallLog.shift();
    firewallLog.shift();
    firewallLog.shift();
    firewallLog.shift();
  }
  scrollToEnd();
  findex++;
  if (findex > fdata.length - 1) {
    findex = 0;
  }
}, 100);

//loop offline log
setInterval(() => {
  try {
    //log offline nodes
    for (let node in data.nodes) {
      if (data.nodes[node].status == "Offline") {
        let log = "Node " + data.nodes[node].name + " is offline";

        firewallLog.push(log);
      }
    }
  } catch (error) {
    //
  }
  //remove old logs
}, 5000);

//monitor nodes ip address
function getips() {
  //map nodes ip and id and name to array
  let nodes = Object.values(data.nodes).map((node) => {
    return { id: node.id, ip: node.ip, name: node.name };
  });
  return nodes;
}

onMounted(() => {
  onChangetype();
});
</script>
