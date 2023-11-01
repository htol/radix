import { expect, test } from "vitest";
import { l } from "./debug_helper";
import { Tree } from "./ipt";

test("insert", () => {
  let t = new Tree();
  t.insertNet("127.0.0.0/24");
  t.insertNet("127.0.0.0/25");
  t.insertNet("127.0.1.0/24");
  l(t.root);
  //l(t.toString());
  expect(true).toEqual(false);
});

test("toString", () => {
  let t = new Tree();
  t.insertNet("127.0.0.122/24");
  t.insertNet("127.0.0.128/32");
  t.insertNet("127.0.1.1/24");
  t.insertNet("127.0.1.1/25");
  t.insertNet("127.0.1.129/25");
  t.insertNet("127.0.1.129/32");
  t.insertNet("127.0.1.130/32");
  t.insertNet("127.0.1.131/32");
  t.insertNet("127.0.1.132/32");
  t.insertNet("127.0.0.0/16");
  t.insertNet("127.0.1.133/32");
  t.insertNet("127.0.1.134/32");
  t.insertNet("127.0.1.135/32");
  l(t.toString());
  //expect(true).toEqual(false);
});
