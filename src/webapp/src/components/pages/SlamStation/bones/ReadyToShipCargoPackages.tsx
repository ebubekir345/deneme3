import React from 'react';
import ReadyToShipPackagesTable from './ReadyToShipPackagesTable';
import ReadyToShipCategoryFilters from './ReadyToShipCategoryFilters';
import Grid from '../../../atoms/Grid';

const ReadyToShipCargoPackages: React.FC = () => {
  return (
    <Grid gridTemplateColumns="270px 1fr" width={1} height="auto" overflow="hidden" flexGrow={1}>
      <ReadyToShipCategoryFilters />
      <ReadyToShipPackagesTable />
    </Grid>
  );
};

export default ReadyToShipCargoPackages;
