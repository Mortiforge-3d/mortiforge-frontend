import {
    ProductsHero,
    ProductsFilter,
    ProductsGrid,
    Pagination,
} from "../../components/products";

export default function ProductsPage() {
    return (
        <>
            <ProductsHero />
            <ProductsFilter />
            <ProductsGrid />
            <Pagination />
        </>
    );
}