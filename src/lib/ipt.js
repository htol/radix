import { int2ip, netFromCIDR } from "./ip";
import { l } from "./debug_helper.js";

const masks32 = [
  0x00000000, 0x80000000, 0xc0000000, 0xe0000000, 0xf0000000, 0xf8000000,
  0xfc000000, 0xfe000000, 0xff000000, 0xff800000, 0xffc00000, 0xffe00000,
  0xfff00000, 0xfff80000, 0xfffc0000, 0xfffe0000, 0xffff0000, 0xffff8000,
  0xffffc000, 0xffffe000, 0xfffff000, 0xfffff800, 0xfffffc00, 0xfffffe00,
  0xffffff00, 0xffffff80, 0xffffffc0, 0xffffffe0, 0xfffffff0, 0xfffffff8,
  0xfffffffc, 0xfffffffe, 0xffffffff,
];

const Key32BitSize = 32;

class Node {
  constructor(key, bits, leaf, value) {
    this.key = key;
    this.bits = bits;
    this.leaf = leaf;
    this.value = value;
    this.child = [null, null]; //new Array(2).fill(null);
  }
}

export class Tree {
  constructor() {
    this.root = null;
  }

  getRoot() {
    return this.root;
  }

  insertNet(cidr) {
    const [ip, ones] = netFromCIDR(cidr);
    this.insert(ip, ones, true, null);
  }

  insert(key, bits, leaf, value) {
    l(int2ip(key), bits, leaf, value);
    if (!key) return;

    let r = this.root;
    let parent = null;
    let middle = null;
    let branch = 0;
    let pBranch = null;
    let cbits = 0;

    while (r != null) {
      l("enter loop r: ", int2ip(r.key), "/", r.bits);
      l("enter loop n: ", int2ip(key), "/", bits);
      // common most significant bits (CMSB)
      // first ^ is XOR will clear (set to zero) all common bits
      // ~ is NOT bitwise operator it will reduce number of common bits by mask if nessesary
      cbits = Math.clz32((r.key ^ key) | ~masks32[r.bits] | ~masks32[bits]);
      if (cbits < r.bits) {
        l("cbits<r.bits ");
        l("r: ", int2ip(r.key), "/", r.bits);
        l("n: ", int2ip(key), "/", bits);

        pBranch = branch;
        // branch select 0/1 for Node.child it based on next bit after last common bit
        branch = (r.Key >> (Key32BitSize - 1 - cbits)) & 1;

        l("cbits/bits: ", cbits, bits);
        l(typeof cbits, typeof bits);
        if (cbits === bits) {
          l("cbits === bits");
          // making new root
          middle = new Node(key, bits, true, value);
          //middle.child[branch] = r;
        } else {
          middle = new Node(key & masks32[cbits], cbits, false, value);
          middle.child[1 - branch] = new Node(key, bits, true, value);
        }

        middle.child[branch] = r;

        if (!parent) {
          l("no parent", int2ip(middle.key), middle.bits);
          this.root = middle;
        } else {
          l("parent", int2ip(middle.key), middle.bits);
          parent.child[pBranch] = middle;
        }

        l("retrun 1");
        return;
      }

      // same node, just rewrite value
      if (bits === r.bits) {
        l("bits === r.bits", int2ip(key), bits);
        r.key = key;
        r.bots = bits;
        r.leaf = leaf;
        r.value = value;
        return;
      }

      parent = r;
      branch = (key >> (Key32BitSize - 1 - cbits)) & 1;
      //l(r,branch);
      r = r.child[branch];
    } // end while

    let node = new Node(key, bits, leaf, value);
    if (!parent) {
      this.root = node;
      return;
    }
    parent.child[branch] = node;
    //l("end: ", bits, parent);
  }

  toString() {
    if (!this.root) return;
    let output = "";

    function walk(node, indent) {
      if (node.leaf) {
        output +=
          "  ".repeat(indent) +
          int2ip(node.key) +
          "/" +
          node.bits +
          " leaf: " +
          node.leaf +
          "\n";
        indent += 1;
      }
      const [c1, c2] = node.child;
      if (c1 != null) {
        walk(c1, indent);
      }
      if (c2 != null) {
        walk(c2, indent);
      }
    }

    walk(this.root, 0);
    return output;
  }
}
