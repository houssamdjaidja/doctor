/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, ArrowLeft, Eye } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api";

export function BlogDetailPage() {
  const { id } = useParams();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    api.getBlogPost(id)
      .then(setArticle)
      .catch(() => setArticle(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <p className="text-slate-500">Chargement...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-500 mb-4">Article non trouvé</p>
          <Link to="/blog"><Button variant="secondary"><ArrowLeft className="w-4 h-4" /> Retour au blog</Button></Link>
        </div>
      </div>
    );
  }

  const categories: Record<string, string> = {
    prevention: "Prévention", nutrition: "Nutrition", general: "Santé générale",
    news: "Actualités", advice: "Conseils santé", wellness: "Bien-être",
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <article className="max-w-4xl mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Link to="/blog" className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium mb-8 p-2 -ml-2">
            <ArrowLeft className="w-4 h-4" /> Retour au blog
          </Link>

          {article.image_url && (
            <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden mb-8">
              <img src={article.image_url} alt={article.title}
                className="w-full h-full object-cover" />
            </div>
          )}

          <div className="flex items-center gap-3 mb-4">
            <Badge variant="info">{categories[article.category] || article.category}</Badge>
            <span className="flex items-center gap-1 text-sm text-slate-500">
              <Calendar className="w-4 h-4" /> {article.created_at?.split(" ")[0]}
            </span>

          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">{article.title}</h1>
          <p className="text-lg text-slate-500 mb-2">Par {article.author}</p>

          <div className="prose prose-slate max-w-none mt-8">
            <p className="text-lg text-slate-600 leading-relaxed">{article.excerpt}</p>
            {article.content && (
              <div className="mt-6 text-slate-600 leading-relaxed whitespace-pre-line">{article.content}</div>
            )}
          </div>
        </motion.div>
      </article>
    </div>
  );
}
