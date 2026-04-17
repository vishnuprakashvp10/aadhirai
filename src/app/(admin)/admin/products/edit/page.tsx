import AdminProductFormClient from '@/components/admin/AdminProductFormClient';
export default function EditProductPage({ searchParams }: { searchParams: { id?: string } }) {
  return <AdminProductFormClient productId={searchParams.id} />;
}
