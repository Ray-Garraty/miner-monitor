const convertBufferToObject = (rawData) => JSON.parse(rawData
    .replace(/\-nan/g, '0')
    .replace(/[^\x00-\x7F]/g, '')
    .replace(/[^\}]+$/, ''));

const extractStatsString = (object) => object[0]['MM ID0'];

const testString = 'Ver[1066-50-20080702_a590d24_3dbc55b] DNA[0201000077bea4de] MEMFREE[1043040.0] NETFAIL[0 0 0 0 0 0 0 0] SYSTEMSTATU[Work: In Work, Hash Board: 3 ] Elapsed[166914] BOOTBY[0x11.00000000] LW[44133914] MH[45 38 36] HW[119] DH[1.399%] Temp[34] TMax[69] TAvg[55] Fan1[6206] Fan2[6171] Fan3[6126] Fan4[6126] FanR[86%] Vo[341] PS[0 1228 1299 238 3086 1296] PLL0[226 351 752 5397] PLL1[235 280 651 5560] PLL2[2704 1512 1373 1137] GHSspd[0.00] DHspd[0.000%] GHSmm[53151.45] GHSavg[51187.10] WU[715075.46] Freq[658.53] Led[0] MGHS[17144.51 17844.56 16198.02] MTmax[66 65 69] MTavg[55 53 57] TA[342] PING[1612] SoftOFF[0] ECHU[512 512 512] ECMM[0] SF0[587 612 637 662] SF1[612 637 662 687] SF2[612 637 662 687] PVT_T0[ 56  55  51  52  57  59  59  58  54  54  58  60  59  58  59  53  57  58  57  55  51  50 55  56  54  52  49  47  52  53  52  50  46  45  50  52  50  48  47  43  49  49  48  47  44  42  47  48  47  46  43  41  44  46  50  52  53  55  53  51  51  53  54  54  53  52  52  55  54  56  57  53  56  58  61  59  59  57  58  60  60  61  61  58  60  62  62  63  63  61  61  65  65  65  65  63  62  66  65  64  65  62  62  65  64  63  64  61  60  63  64  64  64  61] PVT_T1[ 52  49  47  48  51  54  56  54  48  51  54  57  56  55  51  50  55  56  56  55  49  49  53  55  53  52  48  47  51  53  52  50  46  45  49  52  52  47  45  42  47  48  47  45  42  41  45  47  46  44  40  39  41  44  48  50  50  52  51  49  50  52  53  52  53  51  52  54  53  55  56  53  56  58  59  58  59  57  57  60  59  59  61  57  59  61  62  60  63  60  60  62  61  65  63  61  60  62  64  62  62  59  59  61  61 60  62  59  58  60  60  61  61  58] PVT_T2[ 59  57  53  55  58  61  61  59  56  56  60  61  62  60  58  55  59  60  60  58  55  53  56  58  58  55  52  49  54  57  55  53  49  48  54  55  52  52  48  46  51  52  51  49  46  44  47  50  50  45  44  42  44  48  50  52  52  54  54  53  54  55  56  56  57  55  56  59  58  59  59  58  60  63  63  63  63  60  60  63  64  64  65  61  63  65  66  65  66  64  65  68  67  68  69  66  65  68  69  66  67  63  63  66  67  66  66  63  63  65  66  66  67  62] PVT_V0[325 328 329 335 335 334 330 331 330 327 327 325 329 327 326 327 325 324 341 341 340 334 335 335 330 331 331 340 339 339 340 340 340 335 335 334 345 345 345 350 349 348 350 351 350 341 341 342 348 349 349 348 350 353 340 333 329 339 339 337 336 335 334 330 331 330 329 327 328 325 324 328 328 329 328 321 320 322 321 324 324 321 322 325 322 320 321 330 327 326 325 322 319 312 312 312 316 315 317 316 317 318 315 315 316 316 318 317 318 318 317 317 319 319] PVT_V1[331 333 334 324 325 325 331 332 333 344 344 346 328 327 328 337 337 337 319 320 321 328 326 327 326 326 327 339 339 340 333 332 333 330 331 331 326 329 328 338 338 338 339 341 342 347 348 348 350 353 355 338 340 345 350 344 342 334 336 337 332 333 336 325 328 331 330 336 337 321 319 322 331 328 325 332 328 327 321 324 318 317 314 320 321 322 321 321 319 322 324 327 328 318 318 323 317 317 313 319 315 317 320 324 321 326 324 326 314 315 314 324 328 331] PVT_V2[331 334 337 329 333 333 329 330 331 330 329 330 329 328 329 329 328 328 329 329 330 332 331 331 333 335 335 333 332 332 331 333 332 333 333 333 335 335 336 332 333 332 336 337 337 334 334 336 342 343 343 341 343 345 336 333 331 333 334 335 333 336 336 330 330 329 336 333 332 326 327 324 333 332 332 331 330 331 327 329 327 325 328 331 323 325 327 312 314 315 325 325 328 320 324 325 322 322 323 319 321 322 322 322 325 320 323 324 325 326 325 322 326 329] MW[14711626 14711787 14711531] MW0[5868 5611 5612 5878 5766 5871 5760 5797 5566 5724 5707 5788 5699 5792 5837 5790 5728 5867 5764 5852 5822 5800 5901 5649 5880 5683 5574 5903 5762 5779 5836 5778 5865 5590 5718 5804 5799 5778 5743 5919 5845 5749 5955 5842 5806 5780 5702 5819 5843 5788 5716 5807 5876 5780 5808 5777 5661 5785 6003 5796 5791 5871 5892 5732 5667 5752 5622 5806 5674 5797 5738 5596 5670 5689 5711 5803 5586 5561 5622 5496 5823 5859 5794 5481 5490 5827 5806 5644 5906 5849 5471 5674 5779 5552 5353 5402 5457 5706 5637 5507 5601 5452 5292 5423 5540 5519 5407 5482 5450 5430 5556 5441 5580 5403] MW1[5956 6135 5923 5830 6019 5956 6090 6024 5920 5922 5958 6000 5851 6097 6085 6149 5983 6081 5658 5871 5592 5840 6049 5965 5842 5978 6055 6234 6098 6157 6070 6050 6001 5900 5845 6071 6120 5784 5925 6187 5990 6020 6008 6047 6055 5873 6108 6088 6033 6059 6033 6081 5996 6009 5959 6090 6108 6006 6045 6100 5959 6033 6139 5895 6136 6039 6024 5950 6049 5937 6147 5844 6024 5914 5915 6072 5971 5912 6038 5454 5918 5761 5938 5660 5698 5964 5573 5883 5935 5641 5746 6055 5997 5922 5800 5552 5484 5729 5776 6010 5725 5746 6172 5803 5922 5974 5997 5836 5658 5693 5804 5911 5698 5822] MW2[5717 5455 4868 5383 5541 5556 5760 5762 5561 5358 5628 5768 5526 5581 5516 5510 5592 5768 5874 5600 5233 5543 5565 5900 5902 5684 5712 5282 5849 5855 6035 5382 5474 5518 5600 5802 5711 5874 5733 5427 5509 5628 5743 5609 5515 5620 5748 5692 5970 5459 5856 5892 5511 5976 5640 5528 5221 5470 5547 5509 5515 5443 5633 5535 5178 5070 5202 5649 5269 5026 5031 4205 5251 5906 5778 5538 5571 5397 5168 5528 5384 5336 5675 4351 5111 5332 5446 2806 2635 2396 5385 5456 5538 5335 5264 5417 5277 5345 5079 5140 5029 4991 4891 5362 5263 5483 4816 5297 5540 4791 5468 5448 5472 5245] CRC[0 4 4] POW_I2C[OK] FACOPTS0[] FACOPTS1[] ATAOPTS0[--avalon10-freq 466:491:516:537 --avalon10-voltage-level 29 ] ATAOPTS1[--avalon10-freq 562:587:612:637 --avalon10-voltage-level 49 ] ADJ[1] MPO[3050] MVL[75] ATABD0[562 587 612 637] ATABD1[587 612 637 662] ATABD2[587 612 637 662] WORKMODE[1]';

const formatStatsString = (logString) => {
  const logArray = logString.split(']').map((entry) => entry.trim());
  
  const parseParameter = (parameterName) => {
    const [parameterString] = logArray.filter((element) => element.startsWith(parameterName));
    return parameterString.split('[');
  };

  const splitPVT = (name, values) => {
    // console.log(values);
    const valuesArray = values.split(';');
    const splitPeriod = 6;
    const result = valuesArray
      .map((value, i, arr) => {
        if ((i + 1) % splitPeriod === 0) {
          return [name, ...arr.slice(i - splitPeriod + 1, i + 1)];
        }
      })
      .filter(x => x)
      .map(([name, ...values]) => [name, values.join(';')]);
    // console.log('На выходе splitPVT: ', result);
    return result;
  };

  const parameters = [
    'SYSTEMSTATU',
    'NETFAIL',
    'WORKMODE',
    'ADJ',
    'MPO',
    'Elapsed',
    'BOOTBY',
    'MH',
    'HW',
    'DH',
    'CRC',
    'Fan1',
    'Fan2',
    'Fan3',
    'Fan4',
    'FanR',
    'PS',
    'GHSmm',
    'GHSavg',
    'MGHS',
    'ECMM',
    'ECHU',
    'Temp',
    'TMax',
    'MTmax',
    'TAvg',
    'MTavg',
    'PVT_T0',
    'PVT_T1',
    'PVT_T2',
  ];

  const entries = parameters
    .map((parameter) => parseParameter(parameter));
  const [systemStatu] = entries.filter(([name,]) => name === "SYSTEMSTATU");
  const restOfEntries = entries.filter(([name,]) => name !== "SYSTEMSTATU");
  
  const splitSystemStatu = ([name, value]) => {
    const [work, hashBoard] = value.split(',');
    return [work.split(': '), hashBoard.trim().split(': ')];
  };

  const processedEntries = [...splitSystemStatu(systemStatu), ...restOfEntries];

  // console.log(processedEntries);

  const reducer = (acc, [name, value]) => {
    // console.log(name, value);
    if(name.startsWith('PVT_T')) {
      return [...acc, ...splitPVT(name, value)];
    }
    if(name.startsWith('BOOTBY')) {
      return [...acc, [name, value.slice(2, 4)]];
    }
    if(name.startsWith('DH')) {
      const n = value.slice(0, -1).replace('.', ',');
      return [...acc, [name, n]];
    }
    if(name.startsWith('FanR')) {
      const n = value.slice(0, -1);
      return [...acc, [name, n]];
    }
    if(name.startsWith('GHS') || name.startsWith('MGHS')) {
      const n = value.replace(/\./g, ',');
      return [...acc, [name, n]];
    }
    return [...acc, [name, value]];
  };

  const normalizedEntries = processedEntries
  .map(([name, value]) => name === 'Work' ? [name, value] : [name, value.trim().split(' ').filter(x => x).join(';')])
  .reduce(reducer, [])
  .map((entry) => entry.join(';'))
  .map((entry, i, array) => {
    if (!entry.startsWith('PVT_T') && array[i + 1].startsWith('PVT_T0')) {
      return `${entry}\n`;
    }
    if (entry.startsWith('PVT_T0') && array[i + 1].startsWith('PVT_T1')) {
      return `${entry}\n`;
    }
    if (entry.startsWith('PVT_T1') && array[i + 1].startsWith('PVT_T2')) {
      return `${entry}\n`;
    }
    return entry;
  });
  return normalizedEntries.join('\n');
};

console.log(formatStatsString(testString));

export { convertBufferToObject, extractStatsString, formatStatsString };