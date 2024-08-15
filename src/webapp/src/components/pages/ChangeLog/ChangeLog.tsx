import { Box, BoxProps, Flex, Icon, LayoutContent, Panel, Tab } from '@oplog/express';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useCommonStore from '../../../store/global/commonStore';
import { onTabChange } from '../../../utils/url-utils';
import useRouteProps from '../../../utils/useRouteProps';
import ActionBar from '../../organisms/ActionBar';
import changelog from './../../../changelog.json';

export enum ChangeLogTabs {
  Latest = 'latest',
  Previous = 'previous',
  Upcoming = 'upcoming',
}

interface ChangeLogItemProps extends BoxProps {
  item: ChangeLogDataItemInterface;
}

interface ChangeLogDataItemInterface {
  version: string;
  title: string;
  content: string[];
}

interface ChangeListProps {
  changes: string[];
}

const ChangeList: React.FC<ChangeListProps> = ({ changes }) => (
  <ol style={{ color: 'palette.grey_light', listStyleType: 'disc', paddingLeft: '16px' }}>
    {changes.map((change, i) => (
      <li key={i.toString()} style={{ paddingLeft: '12px', marginBottom: '20px' }}>
        <Box display="inline" lineHeight={1.85} color="palette.black">
          {change}
        </Box>
      </li>
    ))}
  </ol>
);

const ChangeLogItem: React.FC<ChangeLogItemProps> = ({ item, ...boxProps }) => {
  return (
    <Box mb={40} {...boxProps}>
      <Box fontSize={26} fontWeight={800} color="palette.grey_darker" mb={16}>
        {item.title}
      </Box>
      <ChangeList changes={item.content} />
    </Box>
  );
};

const intlKey = 'ChangeLog';

const ChangeLog: React.FC = () => {
  const { t } = useTranslation();
  const [activeVersion, setActiveVersion] = useState('');
  const [isVersionDropdownOpen, setIsVersionDropdownOpen] = useState(false);
  const routeProps = useRouteProps();
  const [{ activeTab }, { setActiveTab, setTabLength }] = useCommonStore();

  useEffect(() => {
    routeProps.history.replace(location.pathname);
  }, [location.pathname]);

  const changeLogData = changelog.changelog;

  const upcomingData = changelog.upcoming;

  useEffect(() => {
    const index = Object.values(ChangeLogTabs).findIndex(path => path === location.pathname.split('/')[2])
    setActiveTab(index === -1 ? 0 : index)
    setTabLength(tabs.length);
  }, []);

  useEffect(() => {
    activeTab !== undefined && updateRouteOnTabChange(activeTab);
  }, [activeTab]);

  const updateRouteOnTabChange = (activeIndex: number) => {
    const activePath = Object.values(ChangeLogTabs)[activeIndex];
    onTabChange(activePath, routeProps);
  };

  const TabLatest = () => (
    <Box
      maxWidth="700px"
      backgroundColor="palette.white"
      boxShadow="0 18px 20px 0 rgba(0, 0, 0, 0.15)"
      p="40px 35px"
      fontFamily="Montserrat"
      letterSpacing="negativeMedium"
    >
      {changeLogData && changeLogData.map((item, i) => <ChangeLogItem key={i.toString()} item={item} />)}
    </Box>
  );

  const TabPrevious = () => (
    <Box
      maxWidth="700px"
      backgroundColor="palette.white"
      boxShadow="0 18px 20px 0 rgba(0, 0, 0, 0.15)"
      p="40px 35px"
      fontFamily="Montserrat"
      letterSpacing="negativeMedium"
    >
      <Box>
        <Flex
          onClick={() => setIsVersionDropdownOpen(!isVersionDropdownOpen)}
          alignItems="center"
          width="294px"
          p="4px 20px 4px 16px"
          minHeight="56px"
          border="xs"
          borderColor="palette.snow_light"
          borderRadius={isVersionDropdownOpen ? '8px 8px 0 0' : '8px'}
          bg="palette.white"
          boxShadow="0 4px 10px 0 rgba(91, 141, 239, 0.1)"
        >
          <Flex justifyContent="space-between" alignItems="center" width="100%">
            <Box fontSize="16px" letterSpacing="-0.5px" color="#767896">
              <Box
                fontSize="13px"
                color="text.body"
                fontWeight={500}
                lineHeight={1.33}
                letterSpacing="negativeMedium"
                transition="all 0.25s"
              >
                {t(`${intlKey}.Dropdown.Placeholder`)}
              </Box>
              {changeLogData && changeLogData?.filter(version => version.version === activeVersion)[0]?.title}
            </Box>

            <Flex alignItems="center">
              <Icon flexShrink={0} name="far fa-angle-down" fontSize="16px" color="text.body" />
            </Flex>
          </Flex>
        </Flex>
        {isVersionDropdownOpen && (
          <Box
            position="absolute"
            width="294px"
            zIndex={1}
            borderRadius="0 0 8px 8px"
            border="xs"
            borderColor="palette.snow_light"
            maxHeight="220px"
            overflow="auto"
            style={{ userSelect: 'none' }}
            borderTop="solid 1px #d7dfe9"
          >
            {changeLogData &&
              changeLogData?.map((version, i, arr) => {
                return (
                  <Flex
                    key={version.version}
                    onClick={() => {
                      setActiveVersion(version.version);
                      setIsVersionDropdownOpen(false);
                    }}
                    position="relative"
                    bg="palette.white"
                    height="56px"
                    alignItems="center"
                    px={20}
                    borderRadius={arr.length - 1 === i ? '0 0 8px 8px' : '0'}
                  >
                    <Box fontWeight={500} color="palette.slate_dark" letterSpacing="-0.5px">
                      {version.title}
                    </Box>
                  </Flex>
                );
              })}
          </Box>
        )}
      </Box>

      {changeLogData &&
        changeLogData
          .filter(item => item.version === activeVersion)
          .map((item, i) => <ChangeLogItem key={i.toString()} item={item} mt={30} />)}
    </Box>
  );

  const TabUpcoming = () => (
    <Box
      maxWidth="700px"
      backgroundColor="palette.white"
      boxShadow="0 18px 20px 0 rgba(0, 0, 0, 0.15)"
      p="40px 35px"
      fontFamily="Montserrat"
      letterSpacing="negativeMedium"
    >
      {upcomingData && <ChangeList changes={upcomingData} />}
    </Box>
  );

  const tabs = [
    {
      id: ChangeLogTabs.Latest,
      title: t(`${intlKey}.Titles.Latest`),
      component: <TabLatest />,
    },
    {
      id: ChangeLogTabs.Previous,
      title: t(`${intlKey}.Titles.Previous`),
      component: <TabPrevious />,
    },
    {
      id: ChangeLogTabs.Upcoming,
      title: t(`${intlKey}.Titles.Upcoming`),
      component: <TabUpcoming />,
    },
  ];

  return (
    <>
      <ActionBar
        breadcrumb={[{ title: t(`${intlKey}.ActionBar.Breadcrumb.Title`) }]}
        title={t(`${intlKey}.ActionBar.Title`)}
      />
      <LayoutContent>
        <Panel>
          <Tab
            onTabChange={data => {
              updateRouteOnTabChange(data);
            }}
            tabProps={{ mb: '0' }}
            tabs={tabs}
          />
        </Panel>
      </LayoutContent>
    </>
  );
};
export default ChangeLog;
