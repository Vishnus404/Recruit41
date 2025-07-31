import { Alert, AlertIcon, AlertTitle, AlertDescription, Box } from '@chakra-ui/react';

const ErrorMessage = ({ title = 'Error', message, onRetry }) => {
  return (
    <Box my={4}>
      <Alert status="error" borderRadius="md">
        <AlertIcon />
        <Box>
          <AlertTitle>{title}</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Box>
      </Alert>
    </Box>
  );
};

export default ErrorMessage;
