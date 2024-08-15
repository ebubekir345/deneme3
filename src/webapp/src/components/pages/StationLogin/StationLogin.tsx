import { Box, Button, Flex, Icon, Image, PseudoBox, Text } from '@oplog/express';
import { Resource, resourceActions } from '@oplog/resource-redux';
import lottie from 'lottie-web/build/player/lottie_light';
import React, { useEffect, useRef, useState } from 'react';
import BarcodeReader from 'react-barcode-reader';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useAuth0 } from '../../../auth/auth0';
import { roles } from '../../../auth/roles';
import { config } from '../../../config';
import { ResourceType } from '../../../models';
import { urls } from '../../../routers/urls';
import { AddressTypeOutputDTO } from '../../../services/swagger';
import useCommonStore from '../../../store/global/commonStore';
import { StoreState } from '../../../store/initState';
import GenericErrorModal from '../../molecules/GenericErrorModal';
import LangSelectionDropdown from '../../molecules/LangSelectionDropdown/LangSelectionDropdown';
import { DiscriminatorTypes } from '../../molecules/TouchScreen/StationBox';
import ManuelBarcodeInput from '../../organisms/ManuelBarcodeInput';

const intlKey = 'TouchScreen.Login';

const StationLogin: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [{ auth0UserInfo }, { userHasMinRole }] = useCommonStore();
  const [isGenericErrorModalOpen, setIsGenericErrorModalOpen] = useState(false);
  const [isWrongBarcodeScanned, setIsWrongBarcodeScanned] = useState(false);
  const [isUnauthorizedUser, setIsUnauthorizedUser] = useState(false);
  const [isManuelBarcodeInputOpen, setIsManuelBarcodeInputOpen] = useState(false);
  const stationAddress: Resource<AddressTypeOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.GetAddressType]
  );
  const { logout } = useAuth0();
  const history = useHistory();
  const isBarcodeDebuggingEnabled = !config.isProduction;
  const lottieContainer = useRef<any>(null);

  useEffect(() => {
    lottie.loadAnimation({
      container: lottieContainer.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      // eslint-disable-next-line global-require
      animationData: require('../../../lotties/loadingAnimation.json'),
    });
  }, [stationAddress?.isBusy]);

  const onRedirect = (discriminator: DiscriminatorTypes) => {
    if (discriminator === DiscriminatorTypes.PackingAddress) {
      history.push(urls.packingStation);
    }
    if (discriminator === DiscriminatorTypes.HOVPackingAddress) {
      history.push(urls.hovPackingStation);
    }
    if (discriminator === DiscriminatorTypes.RebinAddress) {
      history.push(urls.rebinStation);
    }
    if (discriminator === DiscriminatorTypes.HOVRebinAddress) {
      history.push(urls.hovRebinStation);
    }
    if (discriminator === DiscriminatorTypes.SimplePackingAddress) {
      history.push(urls.simplePackingStation);
    }
    if (discriminator === DiscriminatorTypes.RasPickStation) {
      history.push(urls.rasPickingStation);
    }
    if (discriminator === DiscriminatorTypes.RasStowStation) {
      history.push(urls.rasPutAwayStation);
    }
    if (discriminator === DiscriminatorTypes.ReturnAddress) {
      history.push(urls.returnStation);
    }
    if (discriminator === DiscriminatorTypes.SLAMAddress) {
      history.push(urls.slamStation);
    }
    if (discriminator === DiscriminatorTypes.ProblemSolverAddress) {
      if (userHasMinRole(roles.ProblemSolver)) history.push(urls.problemSolver);
      else {
        setIsUnauthorizedUser(true);
        localStorage.removeItem('stationAddress');
      }
    }
    if (discriminator === DiscriminatorTypes.MissingItemTransferAddress) {
      if (userHasMinRole(roles.ProblemSolver)) history.push(urls.missingItemTransferStation);
      else {
        setIsUnauthorizedUser(true);
        localStorage.removeItem('stationAddress');
      }
    }
    if (discriminator === DiscriminatorTypes.SingleItemPackingAddress) {
      history.push(urls.singleItemPackingStation);
    }
    if (discriminator === DiscriminatorTypes.ReceivingAddress) {
      history.push(urls.inboundItemStation);
    }
  };

  useEffect(() => {
    const station = localStorage.getItem('stationAddress');
    const stationObject = typeof station === 'string' ? JSON.parse(station) : undefined;
    if (stationObject) {
      onRedirect(DiscriminatorTypes[stationObject.discriminator]);
    }
    return () => {
      dispatch(resourceActions.resourceInit(ResourceType.GetAddressType));
    };
  }, []);

  useEffect(() => {
    if (stationAddress?.isSuccess) {
      if (Object.keys(DiscriminatorTypes).includes(stationAddress?.data?.discriminator || '')) {
        localStorage.setItem('stationAddress', JSON.stringify(stationAddress?.data));
        stationAddress?.data?.discriminator && onRedirect(DiscriminatorTypes[stationAddress?.data?.discriminator]);
      } else {
        setIsWrongBarcodeScanned(true);
      }
    }
    if (stationAddress?.error) {
      if (stationAddress.error.code === 404) {
        setIsWrongBarcodeScanned(true);
      } else {
        setIsGenericErrorModalOpen(true);
      }
    }
  }, [stationAddress]);

  const handleBarcodeScan = (data: string) => {
    if (!stationAddress?.isBusy) {
      setIsWrongBarcodeScanned(false);
      dispatch(resourceActions.resourceRequested(ResourceType.GetAddressType, { AddressLabel: data }));
    }
  };

  const callToActionMessageMap = () => {
    if (stationAddress?.isBusy) {
      return t(`${intlKey}.SessionStarting`);
    }
    if (isWrongBarcodeScanned) {
      return t(`${intlKey}.WrongBarcode`);
    }
    if (isUnauthorizedUser) {
      return t(`${intlKey}.UnauthorizedUser`);
    }
    return t(`${intlKey}.ScanStationLabel`);
  };

  // Debugging Purpose
  const [barcodeTestInput, setBarcodeTestInput] = useState('');
  useEffect(() => {
    setBarcodeTestInput('');
  });
  const handleTestBarcodeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBarcodeTestInput(e.target.value.trim());
  };
  // END Debugging Purpose

  return (
    <>
      <BarcodeReader onScan={handleBarcodeScan} avgTimeByChar={100} testCode={barcodeTestInput} minLength={2} />
      <Box
        position="fixed"
        width="100%"
        height="100%"
        backgroundImage="linear-gradient(to bottom, #1a202c, #2d3748)"
        zIndex={1}
      >
        <Box position="absolute" right="-80px" top="0">
          <img src="/images/oplog-logo-grey.svg" height={480} alt="oplog-logo-grey" />
        </Box>
      </Box>
      <Box width="100%" height="100vh" fontFamily="touchScreen" letterSpacing="negativeLarge" zIndex={2}>
        <Flex height="100%" alignItems="center">
          <Box position="relative" left="16%">
            <Flex>
              {stationAddress?.isBusy ? (
                <Box ref={lottieContainer} width={140} height={140} />
              ) : (
                <PseudoBox
                  display="flex"
                  onClick={() => setIsManuelBarcodeInputOpen(true)}
                  justifyContent="center"
                  alignItems="center"
                  borderRadius="50%"
                  bg={isWrongBarcodeScanned || isUnauthorizedUser ? 'palette.red_dark' : 'palette.blue'}
                  width={140}
                  height={140}
                  cursor="pointer"
                  _hover={{
                    backgroundColor:
                      isWrongBarcodeScanned || isUnauthorizedUser ? 'palette.red_darker' : 'palette.blue_dark',
                  }}
                >
                  <Flex
                    borderRadius="50%"
                    bg="#2d3748"
                    width={110}
                    height={110}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Icon
                      name="fas fa-barcode-scan"
                      color={isWrongBarcodeScanned || isUnauthorizedUser ? 'palette.red_dark' : 'palette.white'}
                      fontSize={28}
                    />
                  </Flex>
                </PseudoBox>
              )}
              <Flex flexDirection="column" ml={52}>
                <Text fontSize={22} fontWeight="bold" color="palette.white" mt={12}>
                  {t(`${intlKey}.Welcome`, {
                    name: auth0UserInfo?.given_name,
                  })}
                </Text>
                <Box width={400} height="1px" backgroundColor="palette.steel_dark" my={24} />
                <Text
                  color={isWrongBarcodeScanned || isUnauthorizedUser ? 'palette.red_dark' : 'palette.slate_light'}
                  whiteSpace="pre-line"
                  fontSize="22"
                  fontWeight="500"
                  lineHeight="large"
                >
                  {callToActionMessageMap()}
                </Text>
              </Flex>
            </Flex>
          </Box>
        </Flex>
        <Flex position="absolute" bottom="8%" width={1} flexDirection="column" alignItems="center">
          {isBarcodeDebuggingEnabled && (
            <input
              onChange={handleTestBarcodeInputChange}
              placeholder="Barcode Scan Debugger"
              style={{
                zIndex: 5000,
                width: '200px',
                height: '32px',
                textAlign: 'center',
                marginBottom: '24px',
              }}
            />
          )}
          <Flex gutter={20}>
            <Flex>
              <Flex
                width={44}
                height={44}
                bg="palette.slate_dark"
                borderRadius="full"
                justifyContent="center"
                alignItems="center"
              >
                <Text fontSize="22" lineHeight="xLarge" letterSpacing="negativeLarge" color="palette.slate_darker">
                  {auth0UserInfo?.given_name
                    ?.charAt(0)
                    .toUpperCase()
                    .concat(auth0UserInfo.family_name?.charAt(0).toUpperCase() || '')}
                </Text>
              </Flex>
              <Flex flexDirection="column" justifyContent="center" ml={8} fontSize={16} letterSpacing="negativeLarge">
                <Text fontWeight={500} lineHeight="medium" color="palette.white">
                  {`${auth0UserInfo?.given_name} ${auth0UserInfo?.family_name}`}
                </Text>
                <Button
                  kind="link"
                  color="palette.slate_dark"
                  width="fit-content"
                  onClick={() => {
                    localStorage.clear();
                    logout({ returnTo: config.auth.logout_uri });
                  }}
                >
                  {t(`${intlKey}.Logout`)}
                </Button>
              </Flex>
            </Flex>
            <Flex>
              <LangSelectionDropdown fontSize={14} dropDownWidth="10em" indicatorVisible={true} />
            </Flex>
          </Flex>
        </Flex>
      </Box>
      {isManuelBarcodeInputOpen && (
        <ManuelBarcodeInput
          placeholder={t(`${intlKey}.ManuelBarcodeInputPlaceholder`)}
          closeScreenKeyboard={() => setIsManuelBarcodeInputOpen(false)}
          getBarcodeDataFromScreenKeyboard={data => handleBarcodeScan(data)}
        />
      )}
      <GenericErrorModal isOpen={isGenericErrorModalOpen} />
    </>
  );
};

export default StationLogin;
