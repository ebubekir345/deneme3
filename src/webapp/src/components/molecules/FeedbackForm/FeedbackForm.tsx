import {
  Button,
  Box,
  Dialog,
  DialogTypes,
  Text,
  Textarea,
  FormControl,
  Input,
  Popover,
  PseudoBox,
  Icon,
  Heading,
  FormLabel,
  Flex,
} from '@oplog/express';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const intlKey = 'Feedback';

const FeedbackForm: React.FC = () => {
  const { t } = useTranslation();
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isSuccessfulModalOpen, setIsSucccessfulModalOpen] = useState(false);
  const [feedback, setFeedback] = useState({ body: '', subject: '' });

  const handleBodyChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    setFeedback({ ...feedback, body: e.currentTarget.value });
  };

  const handleSubjectChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    setFeedback({ ...feedback, subject: e.currentTarget.value });
  };

  const handleSubmit = (e: React.SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsFeedbackModalOpen(false);
    setIsSucccessfulModalOpen(true);
  };

  const handleOpen = () => {
    setIsFeedbackModalOpen(true);
  };

  const handleClose = () => {
    setIsFeedbackModalOpen(false);
    setIsSucccessfulModalOpen(false);
  };

  const getForm = () => {
    return (
      <Box backgroundColor="palette.snow_lighter" borderBottomLeftRadius="sm" borderBottomRightRadius="sm">
        <Flex
          justifyContent="space-between"
          py="22"
          textAlign="center"
          boxShadow="medium"
          bg="palette.white"
          position="relative"
          p="16px"
        >
          <Heading fontFamily="heading" fontSize="22" fontWeight={800} color="text.h1">
            {t(`${intlKey}.ContactUs`)}
          </Heading>
          <PseudoBox
            as={Button}
            bg="transparent"
            color="palette.black"
            onClick={() => handleClose()}
            icon={{ name: 'fa fa-times' }}
            _hover={{ bg: 'palette.snow' }}
          />
        </Flex>
        <Box px="11" py="16" className="form-body" borderBottomLeftRadius="sm" borderBottomRightRadius="sm">
          <Box mb="16">
            <Text fontSize="13" fontFamily="base" fontWeight={400} lineHeight="large" color="text.h5">
              {t(`${intlKey}.Description`)}
            </Text>
          </Box>
          <form>
            <FormControl mb="11">
              <FormLabel>{t(`${intlKey}.Subject.Title`)}</FormLabel>
              <Input
                placeholder={t(`${intlKey}.Subject.Placeholder`)}
                onChange={handleSubjectChange}
                value={feedback.subject}
              />
            </FormControl>

            <FormControl mb="11">
              <FormLabel>{t(`${intlKey}.Message.Title`)}</FormLabel>
              <Textarea
                autoHeight={false}
                rows={8}
                value={feedback.body}
                placeholder={t(`${intlKey}.Message.Placeholder`)}
                onChange={handleBodyChange}
              />
            </FormControl>

            <Button m="0 auto" size="small" disabled={!(feedback.body && feedback.subject)} onClick={handleSubmit}>
              {t(`${intlKey}.Submit`)}
            </Button>
          </form>
        </Box>
      </Box>
    );
  };

  const closeSuccessDialog = () => {
    setIsSucccessfulModalOpen(false);
    setFeedback({ body: '', subject: '' });
  };

  const renderCompleteOrderDialog = () => {
    return (
      <Dialog
        type={DialogTypes.Success}
        message={t(`${intlKey}.Successful`)}
        isOpen={isSuccessfulModalOpen}
        onApprove={closeSuccessDialog}
        onCancel={handleClose}
        text={{ approve: t(`Modal.Success.Okay`) }}
      />
    );
  };
  return (
    <Box display="flex" mr="11px" alignItems="center">
      <Popover
        content={
          <Box width="320px" margin="-6px" boxShadow="xlarge">
            {getForm()}
          </Box>
        }
        action={['click']}
        placement="top"
        isOpen={isFeedbackModalOpen}
        withPortal
        onClick={() => {
          if (isFeedbackModalOpen) {
            handleClose();
          } else {
            handleOpen();
          }
        }}
      >
        <PseudoBox as="button" bg="transparent" border="0" height="100%" _focus={{ outline: 0 }}>
          <Icon name="far fa-comment-lines" fontSize="28px" color="palette.blue_dark" />
        </PseudoBox>
      </Popover>
      {renderCompleteOrderDialog()}
    </Box>
  );
};

export default FeedbackForm;
