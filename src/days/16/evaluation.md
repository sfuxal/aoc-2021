```
620080001611562C8802118E34

=>

011 000 1 00000000010  (18)
-3- -0- c -----2----- 
-v-                   

    000 000 0 000000000010110   (22)
    -0- -0- l ------22------- 
    -v-                       

        000 100 01010 (11)
        -0- -4- --A--
        -v-

        101 100 01011 (11)
        -5- -4- --B-- 

    001 000 1 00000000010 
    -1- -0- c -----2-----
    -v-

        000 100 01100 
        -0- -4- --C--
        -v-

        011 100 01101 00
        -3- -4- --D--
```

```js
const tree = {
  binary: '011000100000000010',
  version: 3,
  typeId: 0,
  type: 'operator',
  lengthTypeId: 1,
  lengthType: 'count',
  subPackagesCount: 2,
  subPackages: [
    {
      binary: '0000000000000000010110',
      version: 0,
      typeId: 0,
      type: 'operator',
      lengthTypeId: 0,
      lengthType: 'length',
      subPackagesLength: 22,
      subPackages: [
        {
          binary: '00010001010',
          version: 0,
          typeId: 4,
          type: 'literal',
          value: 'A',
          subPackages: [],
        },
        ...
      ]
    },
    ...
  ]
}
```