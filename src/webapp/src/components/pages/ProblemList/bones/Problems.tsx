import { Box, Flex, Icon, Text } from '@oplog/express';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import { Status } from './ProblemColumn';
import { urls } from '../../../../routers/urls';
import { useParams } from 'react-router-dom';
import { InboundProblemListOutputDTO, SalesOrderProblemsOutputDTO } from '../../../../services/swagger';
import { ProblemType } from '../../../molecules/TouchScreen/ProblemScanStatusColumn';

export interface IProblemsProps {
  solveStatus: Status.NotSolved | Status.InSolvingProcess | Status.Solved;
  problems: SalesOrderProblemsOutputDTO[] | InboundProblemListOutputDTO[] | undefined;
  type: ProblemType.SalesOrderProblem | ProblemType.InboundProblem;
}

export const Problems: React.FC<IProblemsProps> = ({ solveStatus, problems, type }) => {
  const { t } = useTranslation();
  const history = useHistory();
  let { id, sourceType }: { id: any; sourceType: any } = useParams();
  id = decodeURI(id);
  sourceType = decodeURI(sourceType);
  const changeBackgroundColor = (status: Status) => {
    switch (status) {
      case Status.NotSolved:
        return 'palette.snow_darker';
      case Status.InSolvingProcess:
        return '#9dbff9';
      default:
        return 'palette.hardGreen';
    }
  };
  const changeIcon = (status: Status) => {
    switch (status) {
      case Status.NotSolved:
        return 'fal fa-clock';
      case Status.InSolvingProcess:
        return 'fal fa-phone';
      default:
        return 'fal fa-check';
    }
  };

  if (type === ProblemType.SalesOrderProblem) {
    return (
      <>
        {problems ? (
          problems.map((problem, i) => {
            return (
              <Flex
                onClick={() => history.push(urls.problemDetails.replace(':id', encodeURI(problem.referenceNumber)))}
                width={250}
                height={100}
                minHeight={100}
                boxShadow="0 4px 10px 0 rgba(0, 0, 0, 0.1)"
                borderRadius={10}
                overflow="hidden"
                key={i.toString()}
                mb={16}
                cursor="pointer"
              >
                <Box width={10} height={100} minWidth={10} bg={changeBackgroundColor(solveStatus)}></Box>
                <Flex width={1} p={16} flexDirection="column" justifyContent="space-between">
                  <Text fontSize={14} color="palette.hardBlue_darker">
                    {t(`Enum.${problem.problemType}`)}
                  </Text>
                  <Flex width={1} justifyContent="space-between" alignItems="center">
                    <Text fontSize={14} color="palette.blue_lighter">
                      {problem.referenceNumber}
                    </Text>
                    <Icon name={changeIcon(solveStatus)} fontSize={14} color="palette.hardBlue_darker"></Icon>
                  </Flex>
                </Flex>
              </Flex>
            );
          })
        ) : (
          <Skeleton width="100%" height={100}></Skeleton>
        )}
      </>
    );
  } else {
    return (
      <>
        {problems ? (
          problems.map((problem, i) => {
            return (
              <Flex
                onClick={() =>
                  history.push(
                    urls.inboundProblemDetails
                      .replace(':sourceType', encodeURI(sourceType))
                      .replace(':id', encodeURI(problem.referenceNumber))
                  )
                }
                width={250}
                height={100}
                minHeight={100}
                boxShadow="0 4px 10px 0 rgba(0, 0, 0, 0.1)"
                borderRadius={10}
                overflow="hidden"
                key={i.toString()}
                mb={16}
                cursor="pointer"
              >
                <Box width={10} height={100} minWidth={10} bg={changeBackgroundColor(solveStatus)}></Box>
                <Flex width={1} p={16} flexDirection="column" justifyContent="space-between">
                  <Text fontSize={14} color="palette.hardBlue_darker">
                    {t(`Enum.${problem.type}`)}
                  </Text>
                  <Text fontSize={14} color="palette.blue_lighter">
                    {`x${problem.itemAmount} / ${problem.barcodes}`}
                  </Text>
                  <Flex width={1} justifyContent="space-between" alignItems="center">
                    <Text fontSize={14} color="palette.blue_lighter">
                      {problem.referenceNumber}
                    </Text>
                    <Icon name={changeIcon(solveStatus)} fontSize={14} color="palette.hardBlue_darker"></Icon>
                  </Flex>
                </Flex>
              </Flex>
            );
          })
        ) : (
          <Skeleton width="100%" height={100}></Skeleton>
        )}
      </>
    );
  }
};

export default Problems;
