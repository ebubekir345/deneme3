import { Flex, Icon, Select, Text } from '@oplog/express';
import React, { useEffect, useState } from 'react';
import Hotkeys from 'react-hot-keys';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import useCommonStore from '../../../store/global/commonStore';

interface ISpotlightSearch {
  searchOptions: any;
  isOpen: boolean;
  setIsOpen: any;
}

const spotlightSearchKeys = 'control+m,command+m';

const SpotlightSearch: React.FC<ISpotlightSearch> = ({ searchOptions, isOpen, setIsOpen }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const [, { setActiveTab }] = useCommonStore();
  const [selectedOption, setSelectedOption] = useState(null);
  const [orderedOptions, setOrderedOptions] = useState<any>();

  const options = searchOptions.map(option => ({
    value: option.name,
    label: <Text fontSize={30}>{option.name}</Text>,
    option,
  }));

  useEffect(() => {
    let tempOrdered = options.sort((a, b) => (a.value > b.value ? 1 : b.value > a.value ? -1 : 0));
    setOrderedOptions(tempOrdered);
  }, [searchOptions]);

  const handleChange = selectedOption => {
    setSelectedOption(selectedOption);
    if (
      selectedOption?.value?.option?.itemProps?.to !== undefined ||
      selectedOption?.value?.option?.url !== undefined ||
      selectedOption?.value?.option?.onItemClick
    ) {
      setActiveTab(0);
      if (selectedOption?.value?.option?.itemProps?.to !== undefined) {
        history.push(selectedOption?.value?.option?.itemProps?.to);
      }
      if (selectedOption?.value?.option?.url !== undefined) {
        history.push(selectedOption?.value?.option?.url);
      }
      if (selectedOption?.value?.option?.onItemClick) {
        selectedOption?.value?.option?.onItemClick();
      }
    }
    setIsOpen(false);
  };

  return (
    <>
      <Hotkeys
        keyName={spotlightSearchKeys}
        onKeyUp={() => {
          setIsOpen(true);
        }}
      >
        {isOpen && (
          <Flex
            alignItems="center"
            justifyContent="center"
            mt="30vh"
            zIndex={5000}
            width="50%"
            position="absolute"
            ml="25%"
          >
            <Select
              autoFocus
              maxMenuHeight="60vh"
              placeholder={
                <Flex fontSize={24} pl={4} alignItems="center">
                  <Icon name="fas fa-search" marginRight={8} />
                  <Text> {t('SpotlightSearch.PlaceHolder')}</Text>
                </Flex>
              }
              value={selectedOption}
              onChange={handleChange}
              options={orderedOptions}
              isSearchable
              onBlur={() => setIsOpen(false)}
              menuIsOpen={isOpen}
              noOptionsMessage={() => t('SpotlightSearch.PageNotFound')}
            />
          </Flex>
        )}
      </Hotkeys>
    </>
  );
};

export default SpotlightSearch;
