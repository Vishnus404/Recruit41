import { SimpleGrid, Box, Text } from '@chakra-ui/react';
import ProductCard from './ProductCard';

const ProductGrid = ({ products, onProductSelect, isLoading }) => {
  if (isLoading) {
    // Show skeleton cards while loading
    return (
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={6}>
        {Array.from({ length: 8 }).map((_, index) => (
          <Box key={index} height="350px" bg="gray.100" borderRadius="lg" />
        ))}
      </SimpleGrid>
    );
  }

  if (!products || products.length === 0) {
    return (
      <Box textAlign="center" py={10}>
        <Text fontSize="lg" color="gray.500">
          No products found
        </Text>
      </Box>
    );
  }

  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={6}>
      {products.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
          onViewDetails={onProductSelect}
        />
      ))}
    </SimpleGrid>
  );
};

export default ProductGrid;
