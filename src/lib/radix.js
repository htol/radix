import { l } from "./debug_helper";

class Node {
    constructor() {
        this.childs = {};
        this.end = false;
        this.network = null;
        this.prefixes = {};
    }

    hasKey(key) {
        return key in this.childs;
    }

    setEnd() {
        this.end = true;
    }

    isEnd() {
        return this.end;
    }

    getNode(key) {
        return this.childs[key];
    }

    putNode(key, node) {
        this.childs[key] = node;
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

    getRoot() { return this.root }

    insert(cidr) {
        let current = this.root;

        const [ip, prefix] = cidr.split("/");
        const decimalIp = RadixTree.ip2int(ip).toString().padStart(10, '0');

        for (let i = 0; i < decimalIp.length; i++) {
            let key = decimalIp.charAt(i);
            if (!current.hasKey(key)) {
                current.putNode(key, new Node());
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
        l('search: ', ip, decimalIp, prefix);
        let node = this.searchHelper(decimalIp);
        return node != null && node.isEnd() && node.hasPrefix(prefix);
    }

    display(root, str, level) {
        //console.dir(root);
        if (root.isEnd()) {
            //l('root is end!');
            for (let k = level; k < str.length; k++) {
                str[k] = '';
            }
            l(RadixTree.int2ip(str.join("")), Object.keys(root.prefixes));
        }
        for (let i = 0; i < 10; i++) {
            //l(i.toString() in root.childs);
            if (i.toString() in root.childs) {
                str[level] = i.toString();
                this.display(root.childs[i.toString()], str, level + 1);
            }
        }
    }

    readTree(root, str, level, result) {
        //console.dir(root);
        if (root.isEnd()) {
            for (let k = level; k < str.length; k++) {
                str[k] = '';
            }
            result.push(RadixTree.int2ip(str.join("")) + "/" + Object.keys(root.prefixes).join(','));
        }
        for (let i = 0; i < 10; i++) {
            //l(i.toString() in root.childs);
            if (i.toString() in root.childs) {
                str[level] = i.toString();
                this.readTree(root.childs[i.toString()], str, level + 1, result);
            }
        }
        //return result
    }

    display2(node, depth) {
        if (node === null) return;

        const prefix = "  ".repeat(depth);
        if (node.isEnd()) {
            l(prefix + node.network + '/' + Math.min.apply(null, Object.keys(node.prefixes)))
            Object.keys(node.prefixes).sort().forEach((key) => {
                depth++;
                l("  ".repeat(depth) + prefix + "/" + key);
            })
            depth = depth + 1;
        }
        Object.keys(node.childs).forEach((key) => {
            const childNode = node.childs[key];
            this.display2(childNode, depth);
        });
    }

    dsp2() {
        this.display2(this.root, 0);
    }

    static ip2int(ip) {
        return (
            ip.split(".").reduce(function (ipInt, octet) {
                return (ipInt << 8) + parseInt(octet, 10);
            }, 0)
        );
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
        const mask = RadixTree.createMask(maskLenght);
        l(mask, this.int2ip(mask));
        const netMasked = net & mask;
        const subnetMasked = subnet & mask;
        l(net, netMasked, this.int2ip(net), this.int2ip(netMasked));
        return net === subnetMasked ? true : false;
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
