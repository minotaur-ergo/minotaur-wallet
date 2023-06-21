import React from 'react';
import HomeFrame from '../../layouts/HomeFrame';
import ListController from '../../components/ListController';
import AssetItem from './AssetItem';

const Assets = () => {
  const getAssets = () =>
    new Promise((resolve, reject) => {
      const x = Math.random();
      setTimeout(() => {
        if (x >= 0.4)
          resolve([
            {
              name: 'Ergold',
              amount: 60,
              id: '6506add086b2eae7ef2c25f71cb236830841bd1d6add086b2eae7eeae7ef',
              logoSrc: '/Ergold.png',
            },
            {
              name: 'Ergold',
              amount: 15,
              id: '6506add086b2eae7ef2c25f71cb236830841bd1d6add086b2eae7eeae7ef',
              logoSrc: '/logo192.png',
            },
            {
              name: 'Ergold',
              amount: 23,
              id: '6506add086b2eae7ef2c25f71cb236830841bd1d6add086b2eae7eeae7ef',
            },
            {
              name: 'Token 1',
              amount: 68.65,
              id: '6506add086b2eae7ef2c25f71cb236830841bd1d6add086b2eae7eeae7ef',
            },
            {
              name: 'Token 2',
              amount: 1570,
              id: '6506add086b2eae7ef2c25f71cb236830841bd1d6add086b2eae7eeae7ef',
            },
            {
              name: 'Token 3',
              amount: 0,
              id: '6506add086b2eae7ef2c25f71cb236830841bd1d6add086b2eae7eeae7ef',
            },
            {
              name: 'Ergold',
              amount: 60,
              id: '6506add086b2eae7ef2c25f71cb236830841bd1d6add086b2eae7eeae7ef',
            },
            {
              name: 'Ergold',
              amount: 15,
              id: '6506add086b2eae7ef2c25f71cb236830841bd1d6add086b2eae7eeae7ef',
            },
            {
              name: 'Ergold',
              amount: 23,
              id: '6506add086b2eae7ef2c25f71cb236830841bd1d6add086b2eae7eeae7ef',
            },
          ]);
        else if (x >= 0.2) resolve([]);
        else
          reject([
            {
              title: 'Unknown error',
              description: 'Please try again',
            },
          ]);
      }, 1000);
    });

  return (
    <HomeFrame>
      <ListController
        ListItem={<AssetItem />}
        getData={getAssets}
        emptyTitle="You have no assets yet"
        emptyDescription="You can issue new asset using Issue Token dApp."
        emptyIcon="document"
        divider={false}
      />
    </HomeFrame>
  );
};

export default Assets;
