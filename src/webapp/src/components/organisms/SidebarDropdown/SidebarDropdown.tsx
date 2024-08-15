import React from 'react';
import { Icon, PseudoBox, PseudoBoxProps, Flex, Box, Button, Text } from '@oplog/express';
import { DropdownType } from '../../organisms/Sidebar/Sidebar';

export interface SidebarDropdownProps extends PseudoBoxProps {
  fullName?: string;
  options?: any[];
  imagePath?: string;
  notification?: boolean;
  type?: string;
  isOpen?: boolean;
  openedDropdown: string;
  setOpenedDropdown: (key: string) => void;
}

enum DropdownKey {
  Settings = 'settings',
  User = 'user',
}

export const SidebarDropdown: React.FC<SidebarDropdownProps> = ({
  fullName,
  imagePath,
  options,
  type,
  openedDropdown,
  setOpenedDropdown,
  isOpen,
  ...otherProps
}: SidebarDropdownProps) => {
  const handleDropdown = dropdownType => {
    if (dropdownType === DropdownType.Settings) {
      openedDropdown === DropdownKey.Settings ? setOpenedDropdown('') : setOpenedDropdown(DropdownKey.Settings);
    } else {
      openedDropdown === DropdownKey.User ? setOpenedDropdown('') : setOpenedDropdown(DropdownKey.User);
    }
  };

  return (
    <PseudoBox
      display="flex"
      alignItems="center"
      width={1}
      px={30}
      py={14}
      color="#202124"
      fontSize={14}
      fontWeight={600}
      position="relative"
      onClick={() => handleDropdown(type)}
      cursor="pointer"
      _hover={{ bg: '#dcdcdc' }}
      overflow={isOpen ? 'inherit' : 'hidden'}
    >
      {isOpen && (
        <Flex
          position="absolute"
          right={-200}
          top={-30}
          display={isOpen ? 'block' : 'none'}
          width={200}
          flexDirection="column"
          bg="palette.white"
          boxShadow="0 4px 4px 0 rgba(0, 0, 0, 0.25)"
          borderRadius={4}
        >
          {options?.map((item, index) => (
            <Box key={index} p={12} width={1} onClick={item.onClick} color="#202124" fontSize={12} fontWeight={500}>
              {item.bullet ? (
                <Flex alignItems="center">
                  <Box borderRadius="50%" bg="palette.red_dark" width={8} height={8} mr={8}></Box>
                  <Text>{item.text}</Text>
                </Flex>
              ) : (
                <Text>{item.text}</Text>
              )}
            </Box>
          ))}
        </Flex>
      )}

      {type === DropdownType.Settings ? (
        <Icon position="relative" name="fas fa-cog" mr={24} fontSize={18}></Icon>
      ) : (
        <Flex
          position="relative"
          width={20}
          height={24}
          borderRadius="full"
          backgroundImage={`url('${imagePath}')`}
          backgroundPosition="center"
          backgroundSize="cover"
          alt={fullName}
          mr={24}
          flexShrink={0}
        >
          {otherProps.notification && (
            <Flex
              position="absolute"
              bottom={0}
              left={0}
              width={15}
              height={15}
              justifyContent="center"
              alignItems="center"
              bg="palette.red_dark"
              borderRadius="full"
            >
              <Icon name="fas fa-bell" fontSize={10} color="palette.white" />
            </Flex>
          )}
        </Flex>
      )}
      <Text flexShrink={0}>{fullName}</Text>
    </PseudoBox>
  );
};

export default SidebarDropdown;
