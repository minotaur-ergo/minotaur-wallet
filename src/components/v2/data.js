export const MSTransactions = [
  {
    stateId: 'COMMITMENT',
    step: 0,
    totalSteps: 3,
    needAction: true,
    needPassword: true,
    amount: 22.3,
    id: 'ae7ef086b2ef71cb236830841bd1d6add0506add2586b2eae7ef2c2c256f',
    signatures: [],
  },
  {
    stateId: 'COMMITMENT',
    step: 1,
    totalSteps: 3,
    needAction: false,
    needPassword: false,
    amount: 60.11,
    id: '6506add086b2eae7ef2c25f71cb236830841bd1d6add086b2eae7ef2c25f',
    signatures: [
      {
        signed: false,
        id: 'e2ef3c25f91c64162cb23650bd1d6add086add0825fa68308b2eae7eb2ef',
      },
    ],
  },
  {
    stateId: 'COMMITMENT',
    step: 2,
    totalSteps: 3,
    needAction: true,
    needPassword: true,
    amount: 60.15,
    id: '6b6506a2c25f71cb236830841bd1086b2eae7ef2d6addc25fdd082eae7ef',
    signatures: [
      {
        signed: false,
        id: 'e2ef3c25f91c64162cb23650bd1d6add086add0825fa68308b2eae7eb2ef',
      },
      {
        signed: false,
        id: '162cb23650e2ed1d6dd0825fa6f3c2b2eae7538ebd0d086af91c2efa64b8',
      },
    ],
  },
  {
    stateId: 'SIGNING',
    step: 2,
    totalSteps: 5,
    needAction: false,
    needPassword: false,
    amount: 25.15,
    id: 'cb236830846add086b2eae7ef2c25f71d086b2eae7ef2c25f1bd1d6ad650',
    signatures: [
      {
        signed: false,
        id: 'e2ef3c25f91c64162cb23650bd1d6add086add0825fa68308b2eae7eb2ef',
      },
      {
        signed: false,
        id: '4162cbe2ef3c25f9add086add01c623650bd1d6825f2eae7eb2efa68308b',
      },
      {
        signed: false,
        id: '62cb236e2ef31d6add086add0825c25f91c668308b2eae4150beb2efdfa7',
      },
      {
        signed: true,
        id: '162cb23650e2ed1d6dd0825fa6f3c2b2eae7538ebd0d086af91c2efa64b8',
      },
      {
        signed: true,
        id: '50e2e162cb236d1d6dd7538eb0825fa6f3c2ed0d0b2ea86ab8f91c2efa64',
      },
    ],
  },
  {
    stateId: 'SIGNING',
    step: 2,
    totalSteps: 3,
    needAction: true,
    needPassword: false,
    amount: 1620,
    id: 'b2eae7ef6c25f71cb23683506add08620841bd1deae7ef2c25f6add086b2',
    signatures: [
      {
        signed: false,
        id: 'e2ef3c25f91c64162cb23650bd1d6add086add0825fa68308b2eae7eb2ef',
      },
      {
        signed: true,
        id: '162cb23650e2ed1d6dd0825fa6f3c2b2eae7538ebd0d086af91c2efa64b8',
      },
      {
        signed: true,
        id: '50e2e162cb236d1d6dd7538eb0825fa6f3c2ed0d0b2ea86ab8f91c2efa64',
      },
    ],
  },
  {
    stateId: 'COMPLETED',
    step: 3,
    totalSteps: 3,
    needAction: true,
    needPassword: false,
    amount: 40.5,
    id: '2eae7ef2c6836506add71cb23841bd1d6a2086b025fc25fdd086b2eae7ef',
    signatures: [
      {
        signed: true,
        id: 'e2ef3c25f91c64162cb23650bd1d6add086add0825fa68308b2eae7eb2ef',
      },
      {
        signed: true,
        id: '162cb23650e2ed1d6dd0825fa6f3c2b2eae7538ebd0d086af91c2efa64b8',
      },
      {
        signed: true,
        id: '50e2e162cb236d1d6dd7538eb0825fa6f3c2ed0d0b2ea86ab8f91c2efa64',
      },
    ],
  },
];
