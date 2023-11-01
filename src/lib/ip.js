export class IPNet {
  constructor(ip, mask) {
    this.ip = ip;
    this.mask = mask;
  }
}

export function ip2int(ip) {
  return ip.split(".").reduce(function (ipInt, octet) {
    return (ipInt << 8) + parseInt(octet, 10);
  }, 0);
}

export function int2ip(ipInt) {
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

export function createMask(maskLength) {
  return maskLength > 0 ? 0x80000000 >> (maskLength - 1) : 0;
}

export function isSubnet(net, maskLenght, subnet) {
  if (!net) {
    return false;
  }
  const mask = createMask(maskLenght);
  const subnetMasked = subnet & mask;
  return net === subnetMasked ? true : false;
}

export function netFromCIDR(cidr) {
  if (!cidr) return null;

  const [p1, p2] = cidr.split("/");
  const decimalIp = ip2int(p1);
  const ones = parseInt(p2);

  if (ones === 32) return [decimalIp, ones];

  const mask = createMask(ones);
  const subnet = decimalIp & mask;
  return [subnet, ones];
}

//ipv6ToInt(ipv6) {
//  return ipv6
//    .split(":")
//    .map((str) => Number("0x" + str))
//    .reduce(function (int, value) {
//      return BigInt(int) * BigInt(65536) + BigInt(+value);
//    });
//}
