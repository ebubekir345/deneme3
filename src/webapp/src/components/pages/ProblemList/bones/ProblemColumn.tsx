import { Flex, Text } from '@oplog/express';
import React from 'react';
import { InboundProblemListOutputDTO, SalesOrderProblemsOutputDTO } from '../../../../services/swagger';
import { ProblemType } from '../../../molecules/TouchScreen/ProblemScanStatusColumn';
import Problems from './Problems';

export enum Status {
  NotSolved = 'notSolved',
  InSolvingProcess = 'inSolvingProcess',
  Solved = 'solved',
}

export interface IProblemColumnProps {
  problems: SalesOrderProblemsOutputDTO[] | InboundProblemListOutputDTO[] | undefined;
  solveStatus: Status.NotSolved | Status.InSolvingProcess | Status.Solved;
  title: string;
  type: ProblemType.SalesOrderProblem | ProblemType.InboundProblem
}

export const ProblemColumn: React.FC<IProblemColumnProps> = ({ problems, solveStatus, title, type }) => {
  return (
    <Flex flexDirection="column" px={30} borderRight={solveStatus === Status.Solved ? 'none' : '1px solid #f7fafc'}>
      <Flex
        width={250}
        height={40}
        minHeight={40}
        bg="palette.snow_light"
        borderRadius={10}
        justifyContent="center"
        alignItems="center"
        mb={24}
      >
        <Text fontSize={14} color="palette.softBlue_light" letterSpacing="negativeMedium" fontWeight={400}>
          {title}
        </Text>
      </Flex>
      <Flex flexDirection="column" height="100%" overflowY="auto" id="problems-column">
        <Problems solveStatus={solveStatus} problems={problems} type={type} />
      </Flex>
    </Flex>
  );
};

export default ProblemColumn;
