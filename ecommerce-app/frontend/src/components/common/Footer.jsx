import { Box, Text, Center } from '@chakra-ui/react';

const Footer = () => {
  return (
    <Box bg="gray.100" py={4} mt={8}>
      <Center>
        <Text color="gray.600" fontSize="sm">
          © 2025 E-Commerce App. All rights reserved.
        </Text>
      </Center>
    </Box>
  );
};

export default Footer;
