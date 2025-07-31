import {
  Box,
  Container,
  Grid,
  GridItem,
  Image,
  VStack,
  HStack,
  Text,
  Heading,
  Badge,
  Button,
  Divider,
  useColorModeValue,
  Skeleton,
} from '@chakra-ui/react';
import { useState } from 'react';
import { formatPrice } from '../../utils/formatters';

const ProductDetail = ({ product, onBack }) => {
  const [imageLoading, setImageLoading] = useState(true);
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  if (!product) {
    return (
      <Container maxW="container.xl" py={8}>
        <Text>Product not found</Text>
      </Container>
    );
  }

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
  };

  return (
    <Container maxW="container.xl" py={8}>
      <Button mb={6} onClick={onBack} variant="ghost">
        ← Back to Products
      </Button>

      <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={8}>
        <GridItem>
          <Box
            bg={bgColor}
            border="1px"
            borderColor={borderColor}
            borderRadius="lg"
            overflow="hidden"
            position="relative"
          >
            {imageLoading && <Skeleton height="400px" />}
            <Image
              src={product.image_url || '/placeholder-image.jpg'}
              alt={product.product_name}
              width="100%"
              height={{ base: '300px', md: '400px' }}
              objectFit="cover"
              onLoad={handleImageLoad}
              onError={handleImageError}
              display={imageLoading ? 'none' : 'block'}
            />
            {product.discount_percentage > 0 && (
              <Badge
                position="absolute"
                top={4}
                right={4}
                colorScheme="red"
                fontSize="lg"
                px={3}
                py={1}
              >
                -{product.discount_percentage}% OFF
              </Badge>
            )}
          </Box>
        </GridItem>

        <GridItem>
          <VStack align="stretch" spacing={6}>
            <Box>
              <Heading size="lg" mb={2}>
                {product.product_name}
              </Heading>
              <Text fontSize="lg" color="gray.600">
                by {product.brand}
              </Text>
            </Box>

            <HStack spacing={4}>
              <Badge
                colorScheme={product.inventory_count > 10 ? 'green' : 'orange'}
                fontSize="md"
                px={3}
                py={1}
              >
                {product.inventory_count > 0 ? 'In Stock' : 'Out of Stock'}
              </Badge>
              <Text fontSize="sm" color="gray.500">
                {product.inventory_count} available
              </Text>
            </HStack>

            <Divider />

            <VStack align="stretch" spacing={3}>
              <HStack justify="space-between">
                <Text fontWeight="bold" fontSize="2xl" color="blue.600">
                  {formatPrice(product.retail_price)}
                </Text>
                {product.cost && (
                  <Text
                    fontSize="lg"
                    color="gray.500"
                    textDecoration="line-through"
                  >
                    {formatPrice(product.cost)}
                  </Text>
                )}
              </HStack>

              {product.discount_percentage > 0 && (
                <Text color="green.500" fontWeight="medium">
                  You save {formatPrice(product.cost - product.retail_price)} (
                  {product.discount_percentage}%)
                </Text>
              )}
            </VStack>

            <Divider />

            <Box>
              <Heading size="md" mb={3}>
                Product Details
              </Heading>
              <VStack align="stretch" spacing={2}>
                <HStack justify="space-between">
                  <Text fontWeight="medium">Category:</Text>
                  <Text>{product.category}</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text fontWeight="medium">Department:</Text>
                  <Text>{product.department}</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text fontWeight="medium">SKU:</Text>
                  <Text fontSize="sm" fontFamily="mono">
                    {product.sku}
                  </Text>
                </HStack>
                {product.distribution_center_id && (
                  <HStack justify="space-between">
                    <Text fontWeight="medium">Distribution Center:</Text>
                    <Text fontSize="sm">DC-{product.distribution_center_id}</Text>
                  </HStack>
                )}
              </VStack>
            </Box>

            <Button
              colorScheme="blue"
              size="lg"
              isDisabled={product.inventory_count === 0}
              width="100%"
            >
              {product.inventory_count > 0 ? 'Add to Cart' : 'Out of Stock'}
            </Button>
          </VStack>
        </GridItem>
      </Grid>
    </Container>
  );
};

export default ProductDetail;
