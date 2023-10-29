import { l } from "./debug_helper";

class Node {
  constructor(label) {
    this.label = label;
    this.children = {};
    this.end = false;
    this.network = null;
    this.prefixes = {};
  }

  hasKey(key) {
    return key in this.children;
  }

  setEnd() {
    this.end = true;
  }

  isEnd() {
    return this.end;
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

    const [ip, prefix] = cidr.split("/");
    const decimalIp = RadixTree.ip2int(ip).toString().padStart(10, "0");

    for (let i = 0; i < decimalIp.length; i++) {
      let key = decimalIp.charAt(i);
      if (!current.hasKey(key)) {
        current.putNode(key, new Node(key));
      }
      current = current.getNode(key);
    }
    current.putPrefix(prefix);
    current.setNetwork(ip);
    current.setEnd();
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
    const decimalIp = RadixTree.ip2int(ip).toString();
    l("search: ", ip, decimalIp, prefix);
    let node = this.searchHelper(decimalIp);
    return node != null && node.isEnd() && node.hasPrefix(prefix);
  }

  readTree(root, str, level, result) {
    //console.dir(root);
    if (root.isEnd()) {
      for (let k = level; k < str.length; k++) {
        str[k] = "";
      }
      result.push(
        RadixTree.int2ip(str.join("")) +
          "/" +
          Object.keys(root.prefixes).join(","),
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
    if (node.isEnd()) {
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
            RadixTree.isSubnet(
              RadixTree.ip2int(prevPrefixes[prevSize].subnet),
              prevPrefixes[prevSize].prefix,
              RadixTree.ip2int(node.network),
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
    if (node.isEnd()) {
      result += " ".repeat(depth) + node.label + " : " + node.network + "\n";
    } else {
      result += " ".repeat(depth) + node.label + "\n";
    }
    let keys = Object.keys(node.children);
    keys.forEach((key) => {
      let child = node.children[key];
      result += this.ttt(child, depth + 1);
    });
    return result;
  }

  tt() {
    l(this.ttt(this.root, 0));
  }

  static ip2int(ip) {
    return ip.split(".").reduce(function (ipInt, octet) {
      return (ipInt << 8) + parseInt(octet, 10);
    }, 0);
  }

  static int2ip(ipInt) {
    return (
      (ipInt >>> 24) +
      "." +
      ((ipInt >> 16) & 255) +
      "." +
      ((ipInt >> 8) & 255) +
      "." +
      (ipInt & 255)
    );
  }

  static createMask(maskLength) {
    return maskLength > 0 ? 0x80000000 >> (maskLength - 1) : 0;
  }

  static isSubnet(net, maskLenght, subnet) {
    if (!net) return false;
    const mask = RadixTree.createMask(maskLenght);
    //l(mask, this.int2ip(mask));
    //const netMasked = net & mask;
    const subnetMasked = subnet & mask;
    //l(net, netMasked, this.int2ip(net), this.int2ip(netMasked));
    return net === subnetMasked ? true : false;
  }

  static netFromIP(cidr) {
    if (!cidr) return null;

    const [ip, prefix] = cidr.split("/");
    const decimalIp = RadixTree.ip2int(ip);

    if (prefix === "32") return [RadixTree.ip2int(ip), prefix];

    const mask = RadixTree.createMask(prefix);
    //l(mask, this.int2ip(mask));
    //const netMasked = net & mask;
    const subnet = decimalIp & mask;
    //l(net, netMasked, this.int2ip(net), this.int2ip(netMasked));
    return [subnet, prefix];
  }

  //ipv6ToInt(ipv6) {
  //  return ipv6
  //    .split(":")
  //    .map((str) => Number("0x" + str))
  //    .reduce(function (int, value) {
  //      return BigInt(int) * BigInt(65536) + BigInt(+value);
  //    });
  //}
}
