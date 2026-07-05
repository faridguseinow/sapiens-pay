import Link from "next/link";
import { PostForm } from "../post-form";

export default function NewPostPage() {
  return (
    <main className="admin-main">
      <div className="admin-page-heading">
        <div>
          <Link href="/admin/blog" className="admin-back">
            ← Bloqa qayıt
          </Link>
          <h1>Yeni bloq yazısı</h1>
          <p>Məzmunu hazırlayın və istədiyiniz zaman yayımlayın.</p>
        </div>
      </div>
      <PostForm />
    </main>
  );
}
