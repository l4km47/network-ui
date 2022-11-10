
enum ComponentType {
    Switch = "Switch",
    DHCP = "DHCP Server",
    Controller = "Controller",
    Host = "Host",

}
class FirewallLog {
    public time: Date;
    public src: string;
    public dest: string;
    public protocol: string;
    public action: string;
    public reason: string;
    constructor(time: Date, src: string, dest: string, protocol: string, action: string, reason: string) {
        this.time = time;
        this.src = src;
        this.dest = dest;
        this.protocol = protocol;
        this.action = action;
        this.reason = reason;
    }
}
class Component {
    name: string;
    eth: number = 0
    ip: string;
    status: string;
    type: ComponentType = ComponentType.Switch;
    _id: string;
    x: number = 0;
    y: number = 0;
    targets: string[] = [];
    isMaster: boolean = false;
    reset() {
        this.x = 0;
        this.y = 0;
        this.name = "";
        this.type = ComponentType.Switch;
        this._id = "";
        this.targets = [];
        this.isMaster = false;
    }
    getColor2(type): string {
        switch (type) {
            case ComponentType.Switch:
                return "#00ffff";
            case ComponentType.Host:
                return "green";
            case ComponentType.Controller:
                return "#5b008f";
            case ComponentType.DHCP:
                return "red";
            default:
                return "#000000";
        }
    }

    getColor(): string {
        switch (this.type) {

            case ComponentType.Switch:
                return "#00ffff";
            case ComponentType.Host:
                return "green";
            case ComponentType.Controller:
                return "#5b008f";
            case ComponentType.DHCP:
                return "red";
        }
    }

}


//export 

export { Component, ComponentType, FirewallLog };