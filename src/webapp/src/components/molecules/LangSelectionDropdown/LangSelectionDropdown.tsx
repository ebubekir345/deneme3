import { Flex, Image, Select, Text } from '@oplog/express';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../../../i18n';

interface ILangSelectionDropdown {
  isOptionsOpen?: boolean;
  dropDownWidth?: string | number;
  indicatorVisible?: boolean;
  fontSize?: string | number;
}

const LangSelectionDropdown: React.FC<ILangSelectionDropdown> = ({
  isOptionsOpen,
  dropDownWidth,
  indicatorVisible,
  fontSize
}) => {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    !isOptionsOpen && setMenuOpen(false);
  }, [isOptionsOpen]);

  const languages = [
    {
      value: 'tr',
      label: t('SideBar.TurkishLabel'),
    },
    {
      value: 'en-US',
      label: t('SideBar.EnglishLabel'),
    },
  ];

  const languageOptions = () => {
    const langs: any[] = [];
    languages.map(lang =>
      langs.push({
        value: lang?.value,
        label: (
          <Flex gutter={4} onClick={() => setMenuOpen(false)}>
            <Image ml={-8} width="1.5em" src={`/images/flags/${lang.value}.svg`} />
            <Text fontSize={fontSize ? fontSize : 16}>{lang?.label}</Text>
          </Flex>
        ),
      })
    );
    return langs;
  };

  const handleChange = e => {
    i18n.changeLanguage(e.value.value);
    setMenuOpen(false);
    window.location.reload();
  };

  return (
    <Flex width={dropDownWidth ? dropDownWidth : !isOptionsOpen ? '2em' : '90%'} onClick={() => setMenuOpen(true)}>
      <Select
        options={languageOptions()}
        value={i18n.language}
        onChange={handleChange}
        placeholder={t('SideBar.LanguageSelectPlaceHolder')}
        hideIndicators={!indicatorVisible}
        menuIsOpen={menuOpen}
        onBlur={() => setMenuOpen(false)}
      />
    </Flex>
  );
};

export default LangSelectionDropdown;
