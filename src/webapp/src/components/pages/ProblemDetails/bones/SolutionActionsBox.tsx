import { Box, Flex, Icon, Image, Text } from '@oplog/express';
import { Resource } from '@oplog/resource-redux';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { ResourceType } from '../../../../models';
import { StoreState } from '../../../../store/initState';
import {
  ProblemType,
  GetSalesOrderDetailsForProblemOutputDTO,
  ProblemState,
  GetLostItemProblemDetailsOutputDTO,
} from '../../../../services/swagger';
import CargoCarrierDropdown from './CargoCarrierDropdown';

const intlKey = 'TouchScreen.ProblemSolver.Details.SolutionPanel.ActionsBox';

const SolutionActionsBox: React.FC = () => {
  const { t } = useTranslation();
  const problemDetails: Resource<GetSalesOrderDetailsForProblemOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.GetProblemDetails]
  );
  const solveCargoCarrierQuotaProblemResponse = useSelector(
    (state: StoreState) => state.resources[ResourceType.SolveCargoCarrierQuotaProblem]
  );
  const solveSLAMShipmentProblemResponse = useSelector(
    (state: StoreState) => state.resources[ResourceType.SolveSLAMShipmentProblem]
  );
  const solveCargoCarrierPreferenceProblemResponse = useSelector(
    (state: StoreState) => state.resources[ResourceType.SolveCargoCarrierPreferenceProblem]
  );
  const lostItemProblemDetails: Resource<GetLostItemProblemDetailsOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.GetLostItemProblemDetails]
  );
  if (
    !(
      (problemDetails?.data?.type === ProblemType.CargoCarrierQuotaProblem &&
        problemDetails?.data?.state !== ProblemState.Resolved) ||
      (problemDetails?.data?.type === ProblemType.MissingCargoPackageLabelProblem &&
        problemDetails?.data?.state !== ProblemState.Resolved) ||
      (problemDetails?.data?.type === ProblemType.MissingSlamLabelProblem &&
        problemDetails?.data?.state !== ProblemState.Resolved) ||
      (problemDetails?.data?.type === ProblemType.SlamShipmentProblem &&
        problemDetails?.data?.state !== ProblemState.Resolved) ||
      (problemDetails?.data?.type === ProblemType.CargoCarrierPreferenceProblem &&
        problemDetails?.data?.state !== ProblemState.Resolved) ||
      problemDetails?.data?.type === ProblemType.LostItemProblem
    )
  ) {
    return null;
  }
  const content = () => {
    switch (problemDetails?.data?.type) {
      case ProblemType.CargoCarrierQuotaProblem: {
        return {
          leftTitle: t(`${intlKey}.CurrentCargoCarrier`),
          leftContent: (
            <Flex alignItems="center" mt={16}>
              <Image src={problemDetails?.data?.shippingCompanyImageUrl} width={48} height={48} p={8} />
              <Text fontSize="16" ml={16}>
                {problemDetails?.data?.shippingCompany}
              </Text>
            </Flex>
          ),
          rightTitle: t(`${intlKey}.NewCargoCarrier`),
          rightContent: <CargoCarrierDropdown />,
        };
      }
      case ProblemType.MissingCargoPackageLabelProblem: {
        return {
          leftTitle: t(`${intlKey}.PackageCount`),
          leftContent: (
            <Flex alignItems="center" mt={32}>
              <Icon name="fal fa-box-alt" fontSize={26} />
              <Text fontSize={32} ml={16}>
                {problemDetails?.data?.cargoPackagesCount}
              </Text>
            </Flex>
          ),
          rightTitle: t(`${intlKey}.Action`),
          rightContent: (
            <Text fontSize="16" mt={32} lineHeight={2.78}>
              {t(`${intlKey}.ShouldPrintNewPackageLabel`)}
            </Text>
          ),
        };
      }
      case ProblemType.MissingSlamLabelProblem: {
        return {
          leftTitle: t(`${intlKey}.CurrentCargoCarrier`),
          leftContent: (
            <Flex alignItems="center" mt={16}>
              <Image src={problemDetails?.data?.shippingCompanyImageUrl} width={48} height={48} p={8} />
              <Text fontSize="16" ml={16}>
                {problemDetails?.data?.shippingCompany}
              </Text>
            </Flex>
          ),
          rightTitle: t(`${intlKey}.Action`),
          rightContent: (
            <Text fontSize="16" mt={16} lineHeight={2.78}>
              {t(`${intlKey}.ShouldPrintNewSLAMLabel`)}
            </Text>
          ),
        };
      }
      case ProblemType.SlamShipmentProblem: {
        return {
          leftTitle: t(`${intlKey}.CurrentCargoCarrier`),
          leftContent: (
            <Flex alignItems="center" mt={16}>
              <Image src={problemDetails?.data?.shippingCompanyImageUrl} width={48} height={48} p={8} />
              <Text fontSize="16" ml={16}>
                {problemDetails?.data?.shippingCompany}
              </Text>
            </Flex>
          ),
          rightTitle: t(`${intlKey}.NewCargoCarrier`),
          rightContent: <CargoCarrierDropdown />,
        };
      }
      case ProblemType.CargoCarrierPreferenceProblem: {
        return {
          leftTitle: t(`${intlKey}.CurrentCargoCarrier`),
          leftContent: (
            <Flex alignItems="center" mt={16}>
              <Image src={problemDetails?.data?.shippingCompanyImageUrl} width={48} height={48} p={8} />
              <Text fontSize="16" ml={16}>
                {problemDetails?.data?.shippingCompany}
              </Text>
            </Flex>
          ),
          rightTitle: t(`${intlKey}.NewCargoCarrier`),
          rightContent: <CargoCarrierDropdown />,
        };
      }
      case ProblemType.LostItemProblem: {
        return {
          leftTitle: lostItemProblemDetails?.data?.customerServicesReviewedAt
            ? t(`${intlKey}.AnsweredByCustomerServices`)
            : '',
          leftContent: (
            <Flex alignItems="center" mt={16}>
              <Text fontSize={14}>
                {lostItemProblemDetails?.data?.customerServicesReviewedAt
                  ? t(`${intlKey}.${lostItemProblemDetails?.data?.solutionType}`)
                  : ''}
              </Text>
            </Flex>
          ),
        };
      }
      default:
        return null;
    }
  };
  return (
    <Flex flexDirection="column">
      <Box my={32} height={1} width={1} bg="palette.softGrey" />
      {(solveCargoCarrierQuotaProblemResponse?.error ||
        solveSLAMShipmentProblemResponse?.error ||
        solveCargoCarrierPreferenceProblemResponse?.error) && (
        <Text color="palette.red_darker" fontSize="16" letterSpacing="negativeMedium" mb={32}>
          {t(`${intlKey}.CargoCarrierChangeError`)}
        </Text>
      )}
      <Flex>
        <Flex flexDirection="column" letterSpacing="negativeMedium" color="palette.hardBlue_darker">
          <Text fontSize="12" fontWeight={600}>
            {content()?.leftTitle}
          </Text>
          {content()?.leftContent}
        </Flex>
        <Flex
          flexDirection="column"
          letterSpacing="negativeMedium"
          color="palette.hardBlue_darker"
          ml={36}
          pl={36}
          borderLeft="xs"
          borderColor="palette.softGrey"
          flexGrow={1}
        >
          <Text fontSize="12" fontWeight={600}>
            {content()?.rightTitle}
          </Text>
          {content()?.rightContent}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default SolutionActionsBox;
