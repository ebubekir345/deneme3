import { Box, Button, Flex, Icon, Input, Modal, ModalContent, Toggle, Tooltip } from '@oplog/express';
import { Resource, resourceActions } from '@oplog/resource-redux';
import React, { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { ResourceType } from '../../../../models';
import {
  BatchPickingConfigurationDTO,
  RebinVolumeConfigType,
  UpsertBatchPickingConfigurationCommand,
} from '../../../../services/swagger';
import { StoreState } from '../../../../store/initState';

const intlKey = 'BatchManagement.BatchPickingRulesModal';

enum ContentHeader {
  RebinSettings = 'RebinSettings',
  PickingTime = 'PickingTime',
  ToteSettings = 'ToteSettings',
}

interface IBatchPickingRulesModal {
  isOpen: boolean;
  setIsOpen: Function;
}
const BatchPickingRulesModal: FC<IBatchPickingRulesModal> = ({ isOpen, setIsOpen }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [warningHeader, setWarningHeader] = useState('');
  const [isWarningModalOpen, setIsWarningModalOpen] = useState<boolean>(false);
  const [rules, setRules] = useState<BatchPickingConfigurationDTO>({
    rebinVolumeConfigType: RebinVolumeConfigType.Trolley,
    rebinVolumeCapacity: 0,
    rebinVolumeThreshold: 0,
    rebinSalesOrderCapacity: 0,
    durationBetweenAddresses: 0,
    durationBetweenAisles: 0,
    productPickingDuration: 0,
    specialProductPickingDuration: 0,
    pickListPickingDuration: 0,
    pickListPickingDurationThreshold: 0,
    toteVolumeCapacity: 0,
    toteVolumeThreshold: 0,
    toteWeightCapacity: 0,
    batchTrolleyToteCountLimit: 0,
  });
  const getConfig: Resource<BatchPickingConfigurationDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.BatchPickingProcessGetConfig]
  );
  const upsertConfig: Resource<UpsertBatchPickingConfigurationCommand> = useSelector(
    (state: StoreState) => state.resources[ResourceType.BatchPickingProcessUpsertConfig]
  );

  useEffect(() => {
    isOpen && dispatch(resourceActions.resourceRequested(ResourceType.BatchPickingProcessGetConfig));
  }, [isOpen]);

  useEffect(() => {
    getConfig?.data && setRules(getConfig.data);
  }, [getConfig]);

  useEffect(() => {
    upsertConfig?.isSuccess && setIsOpen(false);
  }, [upsertConfig]);

  const rebinSettingsContent = [
    `${ContentHeader.RebinSettings}.RebinVolumeThreshold`,
    `${ContentHeader.RebinSettings}.RebinSalesOrderCapacity`,
  ];
  const pickingTimeContent = [
    `${ContentHeader.PickingTime}.DurationBetweenAddresses`,
    `${ContentHeader.PickingTime}.DurationBetweenAisles`,
    `${ContentHeader.PickingTime}.ProductPickingDuration`,
    `${ContentHeader.PickingTime}.SpecialProductPickingDuration`,
    `${ContentHeader.PickingTime}.PickListPickingDuration`,
    `${ContentHeader.PickingTime}.PickListPickingDurationThreshold`,
  ];
  const toteSettingsContent = [
    `${ContentHeader.ToteSettings}.ToteVolumeCapacity`,
    `${ContentHeader.ToteSettings}.ToteVolumeThreshold`,
    `${ContentHeader.ToteSettings}.ToteWeightCapacity`,
    `${ContentHeader.ToteSettings}.BatchTrolleyToteCountLimit`,
  ];
  const thresholds = [rebinSettingsContent[0], pickingTimeContent[5], toteSettingsContent[1]];

  const contentCreator = (content: string[]) =>
    content.map((i: string) => (
      <Flex alignItems="center" mt={16} width={450} justifyContent="space-between">
        <Flex alignItems="center">
          <Box>{t(`${intlKey}.${i}.Title`)}</Box>
          <Tooltip
            action={['hover']}
            withPortal={true}
            followCursor
            content={t(`${intlKey}.${i}.Exc`)}
            placement="bottom"
          >
            <Icon name="far fa-exclamation-circle" ml={8} />
          </Tooltip>
        </Flex>
        <Input
          pl={22}
          ml={16}
          fontSize={11}
          type="number"
          min={thresholds.includes(i) ? 0 : 1}
          max={thresholds.includes(i) ? 100 : 1000000}
          placeholder={t(`${intlKey}.Placeholder`)}
          _placeholder={{
            color:
              Number.isNaN(
                rules[`${Object.keys(rules).find(key => i.toLowerCase().split('.')[1] === key.toLowerCase())}`]
              ) && 'palette.red',
          }}
          onChange={(e: SyntheticEvent<HTMLInputElement>) => {
            const keyToUpdate = Object.keys(rules).find(key => i.toLowerCase().split('.')[1] === key.toLowerCase());
            keyToUpdate && setRules({ ...rules, [keyToUpdate]: parseInt(e.currentTarget.value) });
          }}
          value={rules[`${Object.keys(rules).find(key => i.toLowerCase().split('.')[1] === key.toLowerCase())}`]}
          height={32}
          width={200}
          borderRadius="lg"
          isRequired
          isInvalid={Number.isNaN(
            rules[`${Object.keys(rules).find(key => i.toLowerCase().split('.')[1] === key.toLowerCase())}`]
          )}
        />
      </Flex>
    ));

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      size="6xl"
      overlayProps={{
        backgroundColor: 'palette.black',
        opacity: 0.6,
      }}
      contentBoxProps={{
        overflow: 'hidden',
        textAlign: 'left',
        px: '0',
      }}
      showCloseButton
      closeButton={<Icon color="palette.steel_darker" fontSize="22" name="fas fa-times" />}
    >
      <ModalContent fontSize={14} overflowX="hidden" overflowY="auto" width={1} px={64} mt={44}>
        <form
          onSubmit={e => {
            e.preventDefault();
            dispatch(
              resourceActions.resourceRequested(ResourceType.BatchPickingProcessUpsertConfig, {
                payload: {
                  ...rules,
                },
              })
            );
          }}
        >
          <Flex justifyContent="space-between">
            <Box>
              <Box fontSize={18} fontWeight={700} mb={16} color="palette.grey_darker">
                {t(`${intlKey}.${ContentHeader.RebinSettings}.Header`)}
              </Box>
              <Flex alignItems="center" mt={16}>
                <Box>{t(`${intlKey}.${ContentHeader.RebinSettings}.RebinVolumeCapacity.Title`)}</Box>
                <Tooltip
                  action={['hover']}
                  withPortal={true}
                  followCursor
                  content={t(`${intlKey}.${ContentHeader.RebinSettings}.RebinVolumeCapacity.Exc`)}
                  placement="bottom"
                >
                  <Icon name="far fa-exclamation-circle" ml={8} />
                </Tooltip>
              </Flex>
              <Flex alignItems="center" mt={16} width={450} justifyContent="space-between">
                <Flex>
                  <Box mr={16}>
                    {t(`${intlKey}.${ContentHeader.RebinSettings}.RebinVolumeCapacity.${RebinVolumeConfigType.Cell}`)}
                  </Box>
                  <Toggle
                    isChecked={rules.rebinVolumeConfigType === RebinVolumeConfigType.Trolley}
                    onChange={() =>
                      setRules({
                        ...rules,
                        rebinVolumeConfigType:
                          rules.rebinVolumeConfigType === RebinVolumeConfigType.Trolley
                            ? RebinVolumeConfigType.Cell
                            : RebinVolumeConfigType.Trolley,
                      })
                    }
                  />
                  <Box ml={16}>
                    {t(
                      `${intlKey}.${ContentHeader.RebinSettings}.RebinVolumeCapacity.${RebinVolumeConfigType.Trolley}`
                    )}
                  </Box>
                </Flex>
                <Input
                  pl={22}
                  ml={16}
                  fontSize={11}
                  type="number"
                  min={1}
                  max={1000000}
                  placeholder={t(`${intlKey}.Placeholder`)}
                  _placeholder={{
                    color: Number.isNaN(rules.rebinVolumeCapacity) && 'palette.red',
                  }}
                  onChange={(e: SyntheticEvent<HTMLInputElement>) =>
                    setRules({ ...rules, rebinVolumeCapacity: parseInt(e.currentTarget.value) })
                  }
                  value={rules.rebinVolumeCapacity}
                  height={32}
                  width={200}
                  borderRadius="lg"
                  autoFocus
                  isRequired
                  isInvalid={Number.isNaN(rules.rebinVolumeCapacity)}
                />
              </Flex>
              {contentCreator(rebinSettingsContent)}
              <Box fontSize={18} fontWeight={700} mb={16} mt={32} color="palette.grey_darker">
                {t(`${intlKey}.${ContentHeader.PickingTime}.Header`)}
              </Box>
              {contentCreator(pickingTimeContent)}
            </Box>
            <Box>
              <Box fontSize={18} fontWeight={700} mb={16} color="palette.grey_darker">
                {t(`${intlKey}.${ContentHeader.ToteSettings}.Header`)}
              </Box>
              {contentCreator(toteSettingsContent)}
            </Box>
          </Flex>
          <Flex flexDirection="column">
            <Box alignSelf="flex-end" justifySelf="flex-end">
              <Button isLoading={upsertConfig?.isBusy} variant="alternative" fontWeight={700} m={64}>
                {t(`${intlKey}.Save`)}
              </Button>
            </Box>
          </Flex>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default BatchPickingRulesModal;
