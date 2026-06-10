/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  Calendar,
  Clock,
  ArrowRight,
  Heart,
  Apple,
  Activity,
  Newspaper,
  Sparkles,
  Brain,
  Shield,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { api } from "@/lib/api";

const categories = [
  { id: "all", name: "Tous", icon: Sparkles },
  { id: "prevention", name: "Prأ©vention", icon: Shield },
  { id: "nutrition", name: "Nutrition", icon: Apple },
  { id: "general", name: "Santأ© gأ©nأ©rale", icon: Heart },
  { id: "news", name: "Actualitأ©s", icon: Newspaper },
  { id: "advice", name: "Conseils santأ©", icon: Activity },
  { id: "wellness", name: "Bien-أھtre", icon: Brain },
];

export function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getBlogPosts({ published: "true" })
      .then(setArticles)
      .catch(() => setArticles([]))
      .finally(() => setLoading(false));
  }, []);

  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredArticles = articles.filter((article) => article.featured);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <section className="relative py-24 bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Badge variant="success" className="mb-4">Blog Santأ©</Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
              Actualitأ©s &{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Conseils Santأ©
              </span>
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
              Retrouvez nos articles sur la santأ©, la prأ©vention et le bien-أھtre pour prendre soin de vous au quotidien.
            </p>
            <div className="max-w-xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input placeholder="Rechercher un article..." className="pl-12"
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-8 border-b border-slate-100 bg-white sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((cat) => (
              <button key={cat.id} onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${selectedCategory === cat.id ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200" : "bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"}`}>
                <cat.icon className="w-4 h-4" /> {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {loading ? (
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 text-center text-slate-500">Chargement...</div>
        </section>
      ) : (
        <>
          {selectedCategory === "all" && !searchQuery && (
            <section className="py-12">
              <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Articles أ  la une</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {featuredArticles.map((article, index) => (
                    <motion.div key={article.id} initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}>
                      <Link to={`/blog/${article.id}`}>
                        <Card variant="glass" className="h-full group overflow-hidden p-0">
                          <div className="grid md:grid-cols-2 gap-0">
                            <div className="relative h-48 md:h-full">
                              <img src={article.image_url} alt={article.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                              <Badge variant="success" className="absolute top-4 left-4">أ€ la une</Badge>
                            </div>
                            <div className="p-6 flex flex-col justify-center">
                              <Badge variant="info" className="w-fit mb-3">
                                {categories.find((c) => c.id === article.category)?.name}
                              </Badge>
                              <h3 className="text-xl font-semibold text-slate-800 mb-2 group-hover:text-emerald-600 transition-colors">{article.title}</h3>
                              <p className="text-slate-600 text-sm mb-4">{article.excerpt}</p>
                              <div className="flex items-center gap-4 text-sm text-slate-500">
                                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{article.created_at?.split(" ")[0]}</span>
                                <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{article.author}</span>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          )}

          <section className="py-12">
            <div className="max-w-7xl mx-auto px-4">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">
                {selectedCategory === "all" ? "Tous les articles" : categories.find((c) => c.id === selectedCategory)?.name}
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.map((article, index) => (
                  <motion.div key={article.id} initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }}>
                    <Link to={`/blog/${article.id}`}>
                      <Card variant="glass" className="h-full group overflow-hidden p-0">
                        <div className="relative h-48">
                          <img src={article.image_url} alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        </div>
                        <div className="p-5">
                          <Badge variant="info" className="mb-3">
                            {categories.find((c) => c.id === article.category)?.name}
                          </Badge>
                          <h3 className="text-lg font-semibold text-slate-800 mb-2 group-hover:text-emerald-600 transition-colors">{article.title}</h3>
                          <p className="text-slate-600 text-sm mb-4 line-clamp-2">{article.excerpt}</p>
                          <div className="flex items-center justify-between text-sm text-slate-500">
                            <div className="flex items-center gap-3">
                              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{article.created_at?.split(" ")[0]}</span>
                            </div>
                            <ArrowRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
              {filteredArticles.length === 0 && (
                <div className="text-center py-12"><p className="text-slate-500">Aucun article trouvأ© pour votre recherche.</p></div>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
