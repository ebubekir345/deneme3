import React from 'react';
import WaitingPackagesTable from './WaitingPackagesTable';
import WaitingCategoryFilters from './WaitingCategoryFilters';
import Grid from '../../../atoms/Grid';

const WaitingCargoPackages: React.FC = () => {
  return (
    <Grid gridTemplateColumns="270px 1fr" width={1} height="auto" overflow="hidden" flexGrow={1}>
      <WaitingCategoryFilters />
      <WaitingPackagesTable />
    </Grid>
  );
};

export default WaitingCargoPackages;
