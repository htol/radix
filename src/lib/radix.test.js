import {expect, test} from 'vitest'
import {RadixTree} from './radix.js'

test('RadixTree.ip2int 127.0.0.1', ()=> {
    expect(RadixTree.ip2int('127.0.0.1')).toEqual(2130706433)
})


test('insert and search 127.0.0.1/32 && 127.0.0.1/24', ()=> {
    let ip0 = '1.1.1.1/32';
    let ip1 = '127.0.0.1/32';
    let ip2 = '127.0.0.1/24';
    let ip3 = '127.0.0.0/32';
    let ip4 = '127.0.0.0/24';
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
    expect(tree.search('127.0.0.2/32')).toEqual(false);
    //console.dir(tree, {depth: null});
})


test('RadixTree print', ()=> {
    const prefixes = [ '1.1.1.1/32', '4.4.4.4/32', '8.8.8.8/32', '127.0.0.1/32', '127.0.0.1/24', '127.0.0.0/32', '127.0.0.0/24', '255.255.255.255/24'];
    let tree = new RadixTree();
    prefixes.forEach((prefix)=>{
        tree.insert(prefix);

    });

    const level = 0;
    const str = new Array(10).fill(0);
    tree.display(tree.getRoot(), str, level);    
})

