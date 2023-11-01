import { l } from "./debug_helper.js";
import { int2ip, ip2int, isSubnet, netFromCIDR } from "./ip";

class Node {
  constructor(label) {
    this.label = label;
    this.children = {};
    this.network = null;
    this.prefixes = {};
  }

  hasKey(key) {
    return key in this.children;
  }

  getNode(key) {
    return this.children[key];
  }

  putNode(key, node) {
    this.children[key] = node;
  }

  hasPrefix(prefix) {
    return prefix in this.prefixes;
  }

  putPrefix(prefix) {
    this.prefixes[prefix] = true;
  }

  isNetwork() {
    return this.network ? true : false;
  }

  setNetwork(network) {
    this.network = network;
  }
}

export class RadixTree {
  constructor() {
    this.root = new Node();
  }

  getRoot() {
    return this.root;
  }

  insert(cidr) {
    let current = this.root;

    const [ip, prefix] = netFromCIDR(cidr);
    l(cidr, int2ip(ip));
    const decimalIp = ip.toString().padStart(10, "0");
    //l("decimalIP: ", decimalIp);

    for (let i = 0; i < decimalIp.length; i++) {
      let key = decimalIp.charAt(i);
      if (!current.hasKey(key)) {
        current.putNode(key, new Node(key));
      }
      current = current.getNode(key);
    }
    current.putPrefix(prefix);
    current.setNetwork(int2ip(ip));
  }

  searchHelper(ip) {
    let node = this.root;
    let foundPath = [];

    for (let i = 0; i < ip.length; i++) {
      const currentChar = ip.charAt(i);
      foundPath.push(currentChar);
      if (node.hasKey(currentChar)) {
        node = node.getNode(currentChar);
      } else {
        return null;
      }
    }
    return node;
  }

  search(cidr) {
    const [ip, prefix] = cidr.split("/");
    const decimalIp = ip2int(ip).toString().padStart(10, "0");
    l("search: ", ip, decimalIp, prefix);
    let node = this.searchHelper(decimalIp);
    return node != null && node.isNetwork() && node.hasPrefix(prefix);
  }

  readTree(root, str, level, result) {
    //console.dir(root);
    if (root.isNetwork()) {
      for (let k = level; k < str.length; k++) {
        str[k] = "";
      }
      result.push(
        int2ip(str.join("")) + "/" + Object.keys(root.prefixes).join(","),
      );
    }
    for (let i = 0; i < 10; i++) {
      //l(i.toString() in root.children);
      if (i.toString() in root.children) {
        str[level] = i.toString();
        this.readTree(root.children[i.toString()], str, level + 1, result);
      }
    }
    //return result
  }

  displayHelper(node, depth, prevPrefixes) {
    if (node === null) return;

    const prefix = "  ".repeat(depth);
    if (node.isNetwork()) {
      //l(prefix + node.network + '/' + Math.min.apply(null, Object.keys(node.prefixes)))
      Object.keys(node.prefixes)
        .sort()
        .forEach((key) => {
          depth++;
          l("  ".repeat(depth) + prefix + node.network + "/" + key);
          let prevSize = prevPrefixes.length - 1;
          l(prevSize);
          l(prevPrefixes[prevSize]);
          if (
            prevSize >= 0 &&
            isSubnet(
              ip2int(prevPrefixes[prevSize].subnet),
              prevPrefixes[prevSize].prefix,
              ip2int(node.network),
            )
          ) {
            l("=== subnet! ===");
          }
          prevPrefixes.push({
            subnet: node.network,
            prefix: key,
            depth: depth,
          });
        });
      depth = depth + 1;
    }
    Object.keys(node.children).forEach((key) => {
      const childNode = node.children[key];
      this.displayHelper(childNode, depth, prevPrefixes);
    });
  }

  display() {
    let stack = [];
    this.displayHelper(this.root, 0, stack);
    l("stack: ", stack);
  }

  ttt(node, depth) {
    let result = "";
    if (node.isNetwork()) {
      result += " ".repeat(depth) + node.label + " : " + node.network + "\n";
      depth += 1;
    } else {
      //result += " ".repeat(depth) + node.label + "\n";
    }
    let keys = Object.keys(node.children);
    keys.forEach((key) => {
      let child = node.children[key];
      result += this.ttt(child, depth);
    });
    return result;
  }

  tt() {
    l(this.ttt(this.root, 0));
  }
}
