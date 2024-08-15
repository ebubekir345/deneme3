import { Box, Flex, Icon, Image, ImageViewer, Text } from '@oplog/express';
import { Resource } from '@oplog/resource-redux';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Skeleton from 'react-loading-skeleton';
import { useSelector } from 'react-redux';
import { ResourceType } from '../../../../models';
import { StoreState } from '../../../../store/initState';
import { ProblemState, GetInboundProblemDetailsOutputDTO } from '../../../../services/swagger';
import Grid from '../../../atoms/Grid';
import { Badge } from '../../../atoms/TouchScreen';

const intlKey = 'TouchScreen.ProblemSolver.Details.DetailsPanel';

const InboundProblemsDetailsPanel: React.FC = () => {
  const { t } = useTranslation();
  const [isImageOpen, setIsImageOpen] = useState(false);
  const inboundProblemDetails: Resource<GetInboundProblemDetailsOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.GetInboundProblemDetails]
  );
  const infoPanels = [
    { title: t(`${intlKey}.ProblemRefNo`), value: inboundProblemDetails?.data?.referenceNumber },
    { title: t(`${intlKey}.Barcodes`), value: inboundProblemDetails?.data?.barcodes },
    {
      title: t(`${intlKey}.ProblemType`),
      value: t(`Enum.${inboundProblemDetails?.data?.type}`),
    },
    {
      title: t(`${intlKey}.SourcePackage`),
      value: inboundProblemDetails?.data?.inboundBoxLabel,
    },
    {
      title: t(`${intlKey}.Photo`),
      value: (
        <>
          <Image
            onClick={() => setIsImageOpen(true)}
            src={inboundProblemDetails?.data?.imageUrl || ''}
            width={20}
            height={20}
          />
          <ImageViewer
            images={[{ url: inboundProblemDetails?.data?.imageUrl || "" as string }]}
            activeIndex={0}
            onActiveIndexChange={() => null}
            isOpen={isImageOpen}
            onClose={() => setIsImageOpen(false)}
          />
        </>
      ),
    },
    {
      title: t(`${intlKey}.Count`),
      value: inboundProblemDetails?.data?.itemAmount,
    },
    {
      title: t(`${intlKey}.OpenedBy`),
      value: inboundProblemDetails?.data?.openedBy,
    },
  ];
  const stateBadgeMap = (state?: string) => {
    switch (state) {
      case ProblemState.Created:
        return { badgeColor: 'palette.snow_darker', iconName: 'far fa-clock' };
      case ProblemState.InProgress:
        return { badgeColor: '#9dbff9', iconName: 'far fa-phone' };
      case ProblemState.Resolved:
        return { badgeColor: 'palette.hardGreen', iconName: 'far fa-check' };
      default:
        return { badgeColor: 'palette.snow_darker', iconName: 'far fa-clock' };
    }
  };
  return (
    <Box bg="palette.snow_light" p={24} width={1} borderRadius="lg">
      <Flex justifyContent="space-between">
        <Text fontSize="16" fontWeight="600" letterSpacing="negativeLarge" color="palette.hardBlue_darker">
          {t(`${intlKey}.ProblemDetail`)}:
        </Text>
        {inboundProblemDetails?.isBusy ? (
          <Skeleton width={100} height={20} />
        ) : (
          <Badge
            outlined={false}
            badgeColor={stateBadgeMap(inboundProblemDetails?.data?.state).badgeColor}
            height={20}
            paddingX={8}
          >
            <Text fontSize="12" fontWeight="600" letterSpacing="-0.8px" marginRight={12}>
              {t(`${intlKey}.StatusBadge.${inboundProblemDetails?.data?.state}`)}
            </Text>
            <Icon name={stateBadgeMap(inboundProblemDetails?.data?.state).iconName} fontSize={12} />
          </Badge>
        )}
      </Flex>
      <Grid
        width={1}
        overflow="auto"
        gridTemplateColumns="160px 1fr 160px 1fr"
        fontSize="12"
        letterSpacing="negativeMedium"
        color="palette.hardBlue_darker"
        marginTop={16}
      >
        {inboundProblemDetails?.isBusy ? (
          <Skeleton width="100%" height={30} />
        ) : (
          infoPanels.map((item, i) => (
            <React.Fragment key={i.toString()}>
              <Flex
                alignItems="center"
                py={8}
                px={16}
                bg={i % 4 === 0 || i % 4 === 1 ? 'palette.white' : 'transparent'}
                borderTopLeftRadius={i % 2 === 0 ? 'lg' : 'unset'}
                borderBottomLeftRadius={i % 2 === 0 ? 'lg' : 'unset'}
                fontWeight={600}
              >
                {item.title}:
              </Flex>
              <Flex
                alignItems="center"
                py={8}
                px={16}
                bg={i % 4 === 0 || i % 4 === 1 ? 'palette.white' : 'transparent'}
                borderTopRightRadius={i % 2 !== 0 ? 'lg' : 'unset'}
                borderBottomRightRadius={i % 2 !== 0 ? 'lg' : 'unset'}
              >
                {item.value}
              </Flex>
            </React.Fragment>
          ))
        )}
      </Grid>
    </Box>
  );
};

export default InboundProblemsDetailsPanel;
