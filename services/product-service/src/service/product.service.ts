export type SampleProduct = {
  id: string;
  name: string;
  price: number;
};

export function getSampleProduct(): SampleProduct {
  return {
    id: "sample-product",
    name: "Sample Product",
    price: 19.99,
  };
}
