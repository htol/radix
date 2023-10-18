class Node {
    constructor() {
        this.childs = {};
        this.end = false;
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
    hasPrefix(prefix){
        return prefix in this.prefixes;
    }

    putPrefix(prefix){
        this.prefixes[prefix]=true;
    }
}

export class RadixTree {
    constructor() {
        this.root = new Node();
    }

    getRoot(){return this.root}

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
        current.setEnd();
    }

    searchHelper(ip) {
        let node = this.root;
        let foundPath=[];

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
        console.log('search: ', ip, decimalIp, prefix);
        let node = this.searchHelper(decimalIp);
        return node != null && node.isEnd() && node.hasPrefix(prefix);
    }

    display(root, str, level) {
        //console.dir(root);
        if (root.isEnd()) {
            //console.log('root is end!');
            for (let k = level; k < str.length; k++) {
                str[k] = '';
            }
            console.log(RadixTree.int2ip(str.join("")), Object.keys(root.prefixes));
        }
        for (let i = 0; i < 10; i++) {
            //console.log(i.toString() in root.childs);
            if (i.toString() in root.childs) {
                str[level] = i.toString();
                this.display(root.childs[i.toString()], str, level + 1);
            }
        }
    }

    static ip2int(ip) {
        return (
            ip.split(".").reduce(function (ipInt, octet) {
                return (ipInt << 8) + parseInt(octet, 10);
            }, 0) >>> 0
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

    static getMaskByVLSM(vlsm) {
        return vlsm > 0 ? 0x80000000 >> (vlsm - 1): 0;
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
