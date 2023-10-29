import { l } from "./debug_helper";
import { expect, test } from "vitest";
import { RadixTree } from "./radix.js";
import { ip2int, isSubnet } from "./ip";

test("insert and search 127.0.0.1/32 && 127.0.0.1/24", () => {
  let input = [
    "1.1.1.1/32",
    "127.0.0.1/32",
    "127.0.0.1/24",
    "127.0.0.0/32",
    "127.0.0.0/24",
  ];

  let expected = ["1.1.1.1/32", "127.0.0.1/32", "127.0.0.0/32", "127.0.0.0/24"];

  let tree = new RadixTree();
  input.forEach((cidr) => {
    tree.insert(cidr);
  });

  tree.display();
  expected.forEach((cidr) => {
    l("===", cidr);
    expect(tree.search(cidr)).toEqual(true);
  });
  expect(tree.search("127.0.0.1/24")).toEqual(false);
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

test("is subnet", () => {
  const result1 = isSubnet(ip2int("192.168.23.0"), 24, ip2int("192.168.23.64"));
  expect(result1).toEqual(true);

  const result2 = isSubnet(ip2int("192.168.23.0"), 24, ip2int("192.168.24.64"));
  expect(result2).toEqual(false);
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
