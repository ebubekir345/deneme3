import React from 'react';
import Grid from '../../atoms/Grid';
import PackagesStatusColumn from './bones/PackagesStatusColumn';
import ScanStatusColumn from './bones/ScanStatusColumn';

const SlamStation: React.FC = () => {
  return (
    <Grid gridTemplateColumns="460px 1fr" height="100vh" fontFamily="touchScreen" bg="palette.softGrey">
      <ScanStatusColumn />
      <PackagesStatusColumn />
    </Grid>
  );
};

export default SlamStation;
