import { Box, Flex, Heading, Spacer } from '@chakra-ui/react';

const Header = () => {
  return (
    <Box bg="blue.500" color="white" px={4} py={3} shadow="md">
      <Flex align="center">
        <Heading size="lg">E-Commerce App</Heading>
        <Spacer />
        {/* Add navigation items here later */}
      </Flex>
    </Box>
  );
};

export default Header;
