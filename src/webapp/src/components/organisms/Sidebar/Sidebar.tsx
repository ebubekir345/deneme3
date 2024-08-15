import { Box, Flex, Icon, IconProps, Image, PseudoBox, PseudoBoxProps, Text } from '@oplog/express';
import { DropdownItem } from '@oplog/express/dist/components/Button';
import moment from 'moment';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useHistory } from 'react-router-dom';
import { useAuth0 } from '../../../auth/auth0';
import { roles } from '../../../auth/roles';
import { config } from '../../../config';
import i18n from '../../../i18n';
import { urls } from '../../../routers/urls';
import useCommonStore from '../../../store/global/commonStore';
import useSidebarStore from '../../../store/global/sidebarStore';
import LangSelectionDropdown from '../../molecules/LangSelectionDropdown/LangSelectionDropdown';
import SidebarDropdown from '../../organisms/SidebarDropdown/SidebarDropdown';
import changelog from './../../../changelog.json';

export interface SideBarItem {
  name: string;
  icon: IconProps;
  isVisible?: boolean;
  isActive?: boolean;
  onItemClick?: () => void;
  url?: string;
  itemProps?: PseudoBoxProps;
  [key: string]: any;
  hasSubMenu?: boolean;
  subMenuItems?: Partial<SideBarItem>[];
}

export enum DropdownType {
  Settings = 'settings',
  User = 'user',
}

enum DropdownKey {
  Settings = 'settings',
  User = 'user',
}

export interface VersionFieldProps {
  version: {
    title: string;
    value: string;
  };
  lastUpdate: {
    title: string;
    value: string;
  };
}

export interface SideBarProps extends PseudoBoxProps {
  items: SideBarItem[];
  itemProps?: PseudoBoxProps;
  width?: number | string;
  versionField?: VersionFieldProps;
}

const intlKey = 'General';

const SideBar: React.FC<SideBarProps> = ({ items, width, itemProps, ...otherProps }: SideBarProps) => {
  const parentRef = useRef<HTMLElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [{ activeSubMenu }, { setActiveSubMenu }] = useSidebarStore();
  const [openedDropdown, setOpenedDropdown] = useState('');
  const [, { userHasRole, userHasMinRole, setActiveTab }] = useCommonStore();
  const { t } = useTranslation();
  const history = useHistory();
  const { logout, user } = useAuth0();

  const versionField = {
    version: {
      title: t('SideBar.Version'),
      value: changelog.changelog.length ? changelog.changelog[0].version : '',
    },
    lastUpdate: {
      title: t('SideBar.LastUpdate'),
      value: changelog.changelog.length ? changelog.changelog[0].date : '',
    },
  };

  const checkIfRecentUpdateExist = () => {
    const threeDaysAgo = moment()
      .subtract(3, 'days')
      .startOf('day');
    const updateDate = moment(changelog.changelog.length && changelog.changelog[0].date, 'DD.MM.YYYY').startOf('day');
    return updateDate.isAfter(threeDaysAgo);
  };

  const menuOptions = (): DropdownItem[] => {
    let MenuOptions: Array<DropdownItem> = [
      {
        value: 'change-log',
        text: t(`${intlKey}.UserMenu.ChangeLog`),
        icon: { name: 'far fa-cogs' },
        bullet: checkIfRecentUpdateExist(),
        onClick: () => {
          history.push(urls.changeLog);
          setActiveTab(0);
        },
      },
      {
        value: 'sign-out',
        text: t(`${intlKey}.UserMenu.Logout`),
        icon: { name: 'fal fa-power-off' },
        onClick: () => {
          localStorage.clear();
          localStorage.setItem('i18nextLng', i18n.language);
          logout({ returnTo: config.auth.logout_uri });
        },
      },
    ];
    if (userHasRole(roles.Supervisor) || userHasRole(roles.TenantAdmin) || userHasRole(roles.TenantOwner)) {
      MenuOptions = MenuOptions.filter(option => option.value === 'sign-out' || option.value === 'change-log');
    }
    return MenuOptions;
  };

  const menuOptionsForSettings = (): DropdownItem[] => {
    let MenuOptions: Array<DropdownItem> = [
      {
        value: 'warehouseManagement',
        text: t('SideBar.WarehouseManagement'),
        onClick: () => {
          history.push(urls['warehouseManagement']);
          setActiveTab(0);
        },
      },
      {
        value: 'operationManagement',
        text: t('SideBar.OperationManagement'),
        onClick: () => {
          history.push(urls['operationManagement']);
          setActiveTab(0);
        },
      },
      {
        value: 'userSettings',
        text: t('SideBar.UserSettings'),
        onClick: () => {
          history.push(urls['settings']);
          setActiveTab(0);
        },
      },
    ];
    if (!userHasMinRole(roles.TenantAdmin)) {
      MenuOptions = MenuOptions.filter(option => option.value !== 'userSettings');
    }

    return MenuOptions;
  };

  return (
    <PseudoBox
      ref={parentRef}
      role="group"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      tabIndex={0}
      position="fixed"
      left={0}
      zIndex="sideBar"
      overflow="visible"
      bg="#f7f8f9"
      willChange="transform"
      height="100vh"
      width={72}
      top={72}
      transition="width .3s"
      pt={11}
      boxShadow="6px 0px 10px 0 rgba(92, 95, 104, 0.15)"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      {...otherProps}
      _hover={{ width }}
      fontFamily="Montserrat"
      color="#202124"
      letterSpacing="0.07px"
    >
      <Flex overflow="hidden" justifyContent="space-between">
        <Flex
          flexDirection="column"
          alignItems="flex-start"
          bg="none"
          mb={24}
          height={66}
          flexShrink={0}
          overflow="hidden"
        >
          <Link to={urls.home} style={{ textDecoration: 'none' }}>
            <Flex data-cy="header-logo" alignItems="center" pl={16} pb={16} flexShrink={0}>
              <Image height={32} width={32} src="/favicon.svg" alt="Logo" />
              <Text fontSize={20} color="#112e54" ml={26} fontWeight={800} letterSpacing="0.5px">
                MAESTRO
              </Text>
            </Flex>
          </Link>
          {versionField && (
            <Flex
              borderColor="palette.grey_lighter"
              letterSpacing="negativeMedium"
              color="#112e54"
              fontSize={10}
              mt={-8}
            >
              <Flex ml={76} fontWeight={400} flexShrink={0}>
                <Box>{versionField.version.value} - </Box>
                <Box>{versionField.lastUpdate.value}</Box>
              </Flex>
            </Flex>
          )}
        </Flex>
      </Flex>
      <Box height="80%" overflow="auto" overflowX="hidden">
        {items.map(item => {
          if (item.isVisible === false) return null;
          return (
            <Flex flexDirection="column" key={item.name}>
              <PseudoBox
                display="flex"
                key={item.name}
                cursor="pointer"
                onClick={() => {
                  item.hasSubMenu
                    ? item.key === activeSubMenu
                      ? setActiveSubMenu('')
                      : setActiveSubMenu(item.key)
                    : setActiveSubMenu('');
                  if (!item.hasSubMenu) {
                    setActiveTab(0);
                    history.push(item?.itemProps?.to)
                  }
                }}
                href={item.hasSubMenu ? undefined : item.url}
                bg={
                  item.isActive && !item.hasSubMenu
                    ? '#e5eefe'
                    : item?.subMenuItems && item.subMenuItems?.filter(subItem => subItem.isActive).length !== 0
                    ? '#e7e7e7'
                    : '#f7f8f9'
                }
                _hover={{ bg: '#dcdcdc', textDecoration: 'none' }}
                transition="none"
                padding="16px 22px 16px 0"
                {...item.itemProps}
                {...itemProps}
              >
                {item.hasSubMenu && (
                  <PseudoBox
                    as={Icon}
                    width={8}
                    textAlign="center"
                    color="palette.slate"
                    fontSize={12}
                    transition="all 2s"
                    name={
                      item.key === activeSubMenu || item.subMenuItems?.some(subItem => subItem.key === activeSubMenu)
                        ? 'fas fa-caret-down'
                        : 'fas fa-caret-right'
                    }
                    mx={8}
                  />
                )}

                <PseudoBox
                  as={Icon}
                  width={16}
                  textAlign="center"
                  color={item.isActive && !item.hasSubMenu ? '#2f80ed' : 'palette.slate'}
                  fontSize={17}
                  {...item.icon}
                  mr={24}
                  ml={item.hasSubMenu ? 0 : 24}
                />
                <PseudoBox
                  as={Text}
                  width="full"
                  fontSize={14}
                  fontWeight={600}
                  color={item.isActive && !item.hasSubMenu ? '#2f80ed' : '#202124'}
                  margin={0}
                  lineHeight="22px"
                  whiteSpace="nowrap"
                  overflow="hidden"
                  textOverflow="ellipsis"
                >
                  {item.name}
                </PseudoBox>
              </PseudoBox>
              <>
                {(item.key === activeSubMenu || item.subMenuItems?.some(subItem => subItem.key === activeSubMenu)) &&
                  item.subMenuItems?.map(subItem => {
                    if (subItem.subMenuItems) {
                      return (
                        <>
                          <PseudoBox
                            display="flex"
                            key={subItem.name}
                            cursor="pointer"
                            onClick={() => {
                              subItem.hasSubMenu
                                ? subItem.key === activeSubMenu
                                  ? setActiveSubMenu(item.key)
                                  : setActiveSubMenu(subItem.key)
                                : setActiveSubMenu('');
                              if (!subItem.hasSubMenu) {
                                setActiveTab(0);
                                history.push(subItem.itemProps.to);
                              }
                            }}
                            href={subItem.hasSubMenu ? undefined : subItem.url}
                            _hover={{ bg: '#dcdcdc', textDecoration: 'none' }}
                            padding="16px 22px"
                            {...subItem.itemProps}
                            {...itemProps}
                            bg={subItem.isActive ? '#e5eefe' : 'inherit'}
                            color={subItem.isActive ? '#2f80ed' : 'inherit'}
                            pl={isExpanded ? 48 : 24}
                            transition="padding .3s"
                            py={12}
                            fontSize={14}
                            fontWeight={600}
                          >
                            <Flex
                              height={20}
                              width={20}
                              borderRadius="50%"
                              fontWeight={800}
                              color={subItem.isActive ? 'palette.white' : 'palette.grey_darker'}
                              bg={subItem.isActive ? '#2f80ed' : '#dcdcdc'}
                              justifyContent="center"
                              alignItems="center"
                              mr={24}
                              fontSize={7}
                              flexShrink={0}
                            >
                              {subItem.name
                                ?.split(' ')
                                .map(item => item[0])
                                .join('')}
                            </Flex>
                            <PseudoBox
                              as={Text}
                              width="full"
                              fontSize={14}
                              fontWeight={600}
                              color={subItem.isActive && !subItem.hasSubMenu ? '#2f80ed' : '#202124'}
                              margin={0}
                              lineHeight="22px"
                              whiteSpace="nowrap"
                              overflow="hidden"
                              textOverflow="ellipsis"
                            >
                              {subItem.name}
                            </PseudoBox>
                          </PseudoBox>
                          {subItem.key === activeSubMenu &&
                            subItem.subMenuItems?.map(i => {
                              return (
                                <Link
                                  onClick={() => setActiveTab(0)}
                                  key={i.name}
                                  to={i.url || ''}
                                  style={{ textDecoration: 'none', color: i.isActive ? '#2f80ed' : 'inherit' }}
                                >
                                  <PseudoBox
                                    display="flex"
                                    key={i.name}
                                    bg={i.isActive ? '#e5eefe' : 'inherit'}
                                    pl={isExpanded ? 64 : 24}
                                    transition="padding .3s"
                                    onClick={i?.onItemClick}
                                    py={12}
                                    fontSize={14}
                                    fontWeight={600}
                                    cursor="pointer"
                                    _hover={{ bg: '#dcdcdc' }}
                                  >
                                    <Flex
                                      height={20}
                                      width={20}
                                      borderRadius="50%"
                                      fontWeight={800}
                                      color={i.isActive ? 'palette.white' : 'palette.grey_darker'}
                                      bg={i.isActive ? '#2f80ed' : '#dcdcdc'}
                                      justifyContent="center"
                                      alignItems="center"
                                      mr={30}
                                      fontSize={7}
                                      flexShrink={0}
                                    >
                                      {i.name
                                        ?.split(' ')
                                        .map(item => item[0])
                                        .join('')}
                                    </Flex>
                                    <PseudoBox
                                      as={Text}
                                      color={i.isActive ? '#2f80ed' : '#202124'}
                                      whiteSpace="nowrap"
                                      overflow="hidden"
                                      textOverflow="ellipsis"
                                      fontWeight={600}
                                    >
                                      {i.name}
                                    </PseudoBox>
                                  </PseudoBox>
                                </Link>
                              );
                            })}
                        </>
                      );
                    }
                    return (
                      <Link
                        onClick={() => setActiveTab(0)}
                        key={subItem.name}
                        to={subItem.url || ''}
                        style={{ textDecoration: 'none', color: subItem.isActive ? '#2f80ed' : 'inherit' }}
                      >
                        <PseudoBox
                          display="flex"
                          key={subItem.name}
                          bg={subItem.isActive ? '#e5eefe' : 'inherit'}
                          pl={isExpanded ? 48 : 24}
                          transition="padding .3s"
                          onClick={subItem?.onItemClick}
                          py={12}
                          fontSize={14}
                          fontWeight={600}
                          cursor="pointer"
                          _hover={{ bg: '#dcdcdc' }}
                        >
                          <Flex
                            height={20}
                            width={20}
                            borderRadius="50%"
                            fontWeight={800}
                            color={subItem.isActive ? 'palette.white' : 'palette.grey_darker'}
                            bg={subItem.isActive ? '#2f80ed' : '#dcdcdc'}
                            justifyContent="center"
                            alignItems="center"
                            mr={30}
                            fontSize={7}
                            flexShrink={0}
                          >
                            {subItem.name
                              ?.split(' ')
                              .map(item => item[0])
                              .join('')}
                          </Flex>
                          <PseudoBox
                            as={Text}
                            color={subItem.isActive ? '#2f80ed' : '#202124'}
                            whiteSpace="nowrap"
                            overflow="hidden"
                            textOverflow="ellipsis"
                            fontWeight={600}
                          >
                            {subItem.name}
                          </PseudoBox>
                        </PseudoBox>
                      </Link>
                    );
                  })}
              </>
            </Flex>
          );
        })}
      </Box>
      <Flex flexDirection="column">
        <Flex mx={20}>
          <LangSelectionDropdown isOptionsOpen={isExpanded} />
        </Flex>
        <SidebarDropdown
          options={menuOptionsForSettings()}
          fullName={t('SideBar.Settings')}
          type={DropdownType.Settings}
          isOpen={openedDropdown === DropdownKey.Settings}
          openedDropdown={openedDropdown}
          setOpenedDropdown={setOpenedDropdown}
        />
        <SidebarDropdown
          imagePath="/images/user.png"
          options={menuOptions()}
          fullName={user && user.given_name ? `${user.given_name} ${user.family_name}` : user?.nickname}
          notification={checkIfRecentUpdateExist()}
          type={DropdownType.User}
          isOpen={openedDropdown === DropdownKey.User}
          openedDropdown={openedDropdown}
          setOpenedDropdown={setOpenedDropdown}
        />
      </Flex>
    </PseudoBox>
  );
};

SideBar.defaultProps = {
  width: '400px',
};

SideBar.displayName = 'Sidebar';

export default SideBar;
