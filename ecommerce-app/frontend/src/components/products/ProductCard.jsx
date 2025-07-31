import {
  Box,
  Image,
  Text,
  VStack,
  HStack,
  Badge,
  Button,
  useColorModeValue,
  Skeleton,
} from '@chakra-ui/react';
import { useState } from 'react';
import { formatPrice } from '../../utils/formatters';

const ProductCard = ({ product, onViewDetails }) => {
  const [imageLoading, setImageLoading] = useState(true);
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
  };

  if (!product) {
    return null;
  }

  return (
    <Box
      bg={cardBg}
      border="1px"
      borderColor={borderColor}
      borderRadius="lg"
      overflow="hidden"
      shadow="md"
      transition="all 0.2s"
      _hover={{ shadow: 'lg', transform: 'translateY(-2px)' }}
      cursor="pointer"
    >
      <Box position="relative" height="200px">
        {imageLoading && (
          <Skeleton height="200px" />
        )}
        <Image
          src={product.image_url || '/placeholder-image.jpg'}
          alt={product.product_name}
          width="100%"
          height="200px"
          objectFit="cover"
          onLoad={handleImageLoad}
          onError={handleImageError}
          display={imageLoading ? 'none' : 'block'}
        />
        {product.discount_percentage > 0 && (
          <Badge
            position="absolute"
            top={2}
            right={2}
            colorScheme="red"
            fontSize="xs"
          >
            -{product.discount_percentage}%
          </Badge>
        )}
      </Box>

      <VStack p={4} align="stretch" spacing={3}>
        <Text
          fontWeight="semibold"
          fontSize="md"
          noOfLines={2}
          minHeight="48px"
        >
          {product.product_name}
        </Text>

        <Text fontSize="sm" color="gray.600" noOfLines={1}>
          {product.brand}
        </Text>

        <HStack justify="space-between" align="center">
          <VStack align="start" spacing={0}>
            <Text fontWeight="bold" fontSize="lg" color="blue.600">
              {formatPrice(product.retail_price)}
            </Text>
            {product.cost && (
              <Text fontSize="sm" color="gray.500" textDecoration="line-through">
                {formatPrice(product.cost)}
              </Text>
            )}
          </VStack>
          
          <Badge
            colorScheme={product.inventory_count > 10 ? 'green' : 'orange'}
            variant="subtle"
          >
            {product.inventory_count > 0 ? 'In Stock' : 'Out of Stock'}
          </Badge>
        </HStack>

        <Button
          colorScheme="blue"
          size="sm"
          onClick={() => onViewDetails(product)}
          isDisabled={product.inventory_count === 0}
        >
          View Details
        </Button>
      </VStack>
    </Box>
  );
};

export default ProductCard;
