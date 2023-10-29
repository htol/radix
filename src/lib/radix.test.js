import { l } from "./debug_helper";
import { expect, test } from "vitest";
import { RadixTree } from "./radix.js";

test("RadixTree.ip2int 127.0.0.1", () => {
  expect(RadixTree.ip2int("127.0.0.1")).toEqual(2130706433);
});

test("insert and search 127.0.0.1/32 && 127.0.0.1/24", () => {
  let ip0 = "1.1.1.1/32";
  let ip1 = "127.0.0.1/32";
  let ip2 = "127.0.0.1/24";
  let ip3 = "127.0.0.0/32";
  let ip4 = "127.0.0.0/24";
  let tree = new RadixTree();
  tree.insert(ip0);
  tree.insert(ip1);
  tree.insert(ip2);
  tree.insert(ip3);
  tree.insert(ip4);
  expect(tree.search(ip1)).toEqual(true);
  expect(tree.search(ip2)).toEqual(true);
  expect(tree.search(ip3)).toEqual(true);
  expect(tree.search(ip4)).toEqual(true);
  expect(tree.search("127.0.0.2/32")).toEqual(false);
  //l(tree, {depth: null});
});

test("RadixTree print", () => {
  const prefixes = [
    "1.1.1.1/32",
    "4.4.4.4/32",
    "8.8.8.8/32",
    "127.0.0.1/32",
    "127.0.0.1/24",
    "127.0.0.0/32",
    "127.0.0.0/24",
    "255.255.255.255/24",
  ];
  let tree = new RadixTree();
  prefixes.forEach((prefix) => {
    tree.insert(prefix);
  });

  let stack = [];
  tree.displayHelper(tree.getRoot(), 0, stack);
});

test("mask by vlsm", () => {
  let vlsms = ["8", "16", "24", "28", "32"];
  let expectedMasks = [
    "255.0.0.0",
    "255.255.0.0",
    "255.255.255.0",
    "255.255.255.248",
    "255.255.255.255",
  ];
  for (let i; i < vlsms.length; i++) {
    const vlsm = vlsms[i];
    const expected = expectedMasks[i];
    const mask = RadixTree.createMask(vlsm);
    l(mask);
    l(RadixTree.int2ip(mask));
    expect(mask).toEqual(expected);
  }
});

test("is subnet", () => {
  const result1 = RadixTree.isSubnet(
    RadixTree.ip2int("192.168.23.0"),
    24,
    RadixTree.ip2int("192.168.23.64"),
  );
  expect(result1).toEqual(true);

  const result2 = RadixTree.isSubnet(
    RadixTree.ip2int("192.168.23.0"),
    24,
    RadixTree.ip2int("192.168.24.64"),
  );
  expect(result2).toEqual(false);
});

test("net from ip", () => {
  let expected = [
    "127.0.0.0",
    "127.0.0.32",
  ];
  let input = [];
  input.push(RadixTree.netFromIP("127.0.0.111/24"));
  input.push(RadixTree.netFromIP("127.0.0.38/28"));
  for(let i = 0; i < input.length; i++){
  const subnet = input[i][0]
    //l(subnet, prefix);
    //l(RadixTree.int2ip(subnet), prefix);
    expect(RadixTree.int2ip(subnet)).toEqual(expected[i]);
  };
});

test("display", () => {
  const prefixes = [
    "1.1.1.1/32",
    "4.4.4.4/32",
    "8.8.8.8/32",
    "10.0.0.0/16",
    "10.0.1.0/24",
    "10.0.2.0/24",
    "10.0.1.0/25",
    "10.0.1.32/30",
    "127.0.0.0/32",
    "127.0.0.0/24",
    "127.0.0.1/32",
    "127.0.0.1/24",
    "255.255.255.255/24",
  ];
  let tree = new RadixTree();
  prefixes.forEach((prefix) => {
    tree.insert(prefix);
  });

  tree.display();
});

test("ttt", () => {
  const prefixes = [
    "1.1.1.1/32",
    "4.4.4.4/32",
    "8.8.8.8/32",
    "10.0.0.0/16",
    "10.0.1.0/24",
    "10.0.2.0/24",
    "10.0.1.0/25",
    "10.0.1.32/30",
    "127.0.0.0/32",
    "127.0.0.0/24",
    "127.0.0.1/32",
    "127.0.0.1/24",
    "255.255.255.255/24",
  ];
  let tree = new RadixTree();
  prefixes.forEach((prefix) => {
    tree.insert(prefix);
  });

  tree.tt();
});

