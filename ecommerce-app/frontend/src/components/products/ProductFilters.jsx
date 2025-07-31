import {
  Box,
  HStack,
  VStack,
  Input,
  Select,
  Button,
  Text,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  FormControl,
  FormLabel,
  Checkbox,
  CheckboxGroup,
  Stack,
  Divider,
  useColorModeValue,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';

const ProductFilters = ({ 
  onFiltersChange, 
  categories, 
  brands, 
  priceRange = [0, 1000],
  loading 
}) => {
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    brand: '',
    priceMin: priceRange[0],
    priceMax: priceRange[1],
    inStock: false,
    onSale: false,
  });

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handlePriceRangeChange = (range) => {
    const newFilters = { ...filters, priceMin: range[0], priceMax: range[1] };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const defaultFilters = {
      search: '',
      category: '',
      brand: '',
      priceMin: priceRange[0],
      priceMax: priceRange[1],
      inStock: false,
      onSale: false,
    };
    setFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };

  return (
    <Box
      bg={bgColor}
      border="1px"
      borderColor={borderColor}
      borderRadius="lg"
      p={6}
      mb={6}
    >
      <VStack spacing={6} align="stretch">
        <HStack justify="space-between">
          <Text fontSize="lg" fontWeight="semibold">
            Filters
          </Text>
          <Button size="sm" variant="ghost" onClick={clearFilters}>
            Clear All
          </Button>
        </HStack>

        <FormControl>
          <FormLabel>Search Products</FormLabel>
          <Input
            placeholder="Search by name or brand..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </FormControl>

        <HStack spacing={4}>
          <FormControl>
            <FormLabel>Category</FormLabel>
            <Select
              placeholder="All Categories"
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              {categories?.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>Brand</FormLabel>
            <Select
              placeholder="All Brands"
              value={filters.brand}
              onChange={(e) => handleFilterChange('brand', e.target.value)}
            >
              {brands?.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </Select>
          </FormControl>
        </HStack>

        <FormControl>
          <FormLabel>
            Price Range: ${filters.priceMin} - ${filters.priceMax}
          </FormLabel>
          <RangeSlider
            min={priceRange[0]}
            max={priceRange[1]}
            value={[filters.priceMin, filters.priceMax]}
            onChange={handlePriceRangeChange}
            colorScheme="blue"
          >
            <RangeSliderTrack>
              <RangeSliderFilledTrack />
            </RangeSliderTrack>
            <RangeSliderThumb index={0} />
            <RangeSliderThumb index={1} />
          </RangeSlider>
        </FormControl>

        <Stack direction="row" spacing={6}>
          <Checkbox
            isChecked={filters.inStock}
            onChange={(e) => handleFilterChange('inStock', e.target.checked)}
          >
            In Stock Only
          </Checkbox>
          <Checkbox
            isChecked={filters.onSale}
            onChange={(e) => handleFilterChange('onSale', e.target.checked)}
          >
            On Sale
          </Checkbox>
        </Stack>
      </VStack>
    </Box>
  );
};

export default ProductFilters;
