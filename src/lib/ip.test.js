import { expect, test } from "vitest";
import { createMask, int2ip, ip2int, netFromIP } from "./ip";
import { l } from "./debug_helper";

test("ip2int 127.0.0.1", () => {
  expect(ip2int("127.0.0.1")).toEqual(2130706433);
});

test("net from ip", () => {
  let expected = ["127.0.0.0", "127.0.0.32", "127.0.0.32"];
  let input = [];
  input.push(netFromIP("127.0.0.111/24"));
  input.push(netFromIP("127.0.0.38/28"));
  input.push(netFromIP("127.0.0.32/32"));
  for (let i = 0; i < input.length; i++) {
    const [subnet, prefix] = input[i];
    l(subnet, prefix);
    l(int2ip(subnet), prefix);
    expect(int2ip(subnet)).toEqual(expected[i]);
  }
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
    const mask = createMask(vlsm);
    l(mask);
    l(int2ip(mask));
    expect(mask).toEqual(expected);
  }
});
