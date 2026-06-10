import { get, run, initializeDatabase } from './database.js';
import bcrypt from 'bcryptjs';

export async function seedData(): Promise<void> {
  const existing: any = await get("SELECT COUNT(*)::int as c FROM admin_users");
  if (existing.c === 0) {
    const hash = await bcrypt.hash('doctor_2026_hs', 12);
    await run('INSERT INTO admin_users (username, password_hash, display_name) VALUES (?, ?, ?)', 'doctor_msila', hash, 'Dr. Djaidja');
    await run('INSERT INTO settings (key, value) VALUES (?, ?)', 'cabinet_name', 'Cabinet Dr. Djaidja');
    await run('INSERT INTO settings (key, value) VALUES (?, ?)', 'cabinet_email', 'contact@dr-djaidja.dz');
    await run('INSERT INTO settings (key, value) VALUES (?, ?)', 'cabinet_phone', '+213 21 23 45 67');
    await run('INSERT INTO settings (key, value) VALUES (?, ?)', 'cabinet_address', '24 Rue Didouche Mourad, 16000 Alger');
    console.log('Admin user created (doctor_msila / doctor_2026_hs)');
  } else {
    console.log('Admin user already exists');
  }

  const blogCount: any = await get("SELECT COUNT(*)::int as c FROM blog_posts");
  if (blogCount.c < 7) {
    await run('DELETE FROM blog_posts');
    await run("ALTER SEQUENCE blog_posts_id_seq RESTART WITH 1");

    const insertBlog = (
      title: string, slug: string, excerpt: string, content: string,
      category: string, image_url: string, author: string,
      published: boolean, featured: boolean, views: number
    ) =>
      run(
        'INSERT INTO blog_posts (title, slug, excerpt, content, category, image_url, author, published, featured, views) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        title, slug, excerpt, content, category, image_url, author, published, featured, views
      );

    const blogs = [
      { title: '10 conseils pour booster votre systأ¨me immunitaire', slug: '10-conseils-booster-systeme-immunitaire', excerpt: 'Dأ©couvrez les meilleures stratأ©gies naturelles pour renforcer vos dأ©fenses immunitaires.', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', category: 'prevention', image_url: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=600&h=400&fit=crop', published: true, featured: true, views: 1234 },
      { title: "L'importance d'une alimentation أ©quilibrأ©e", slug: 'importance-alimentation-equilibree', excerpt: 'Une alimentation saine est la base d\'une bonne santأ©.', content: 'Lorem ipsum dolor sit amet.', category: 'nutrition', image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop', published: true, featured: false, views: 856 },
      { title: 'Comprendre et gأ©rer le stress au quotidien', slug: 'comprendre-gerer-stress-quotidien', excerpt: 'Le stress affecte notre santأ© de nombreuses faأ§ons.', content: 'Lorem ipsum dolor sit amet.', category: 'wellness', image_url: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=600&h=400&fit=crop', published: true, featured: true, views: 742 },
      { title: "Les bienfaits de l'activitأ© physique rأ©guliأ¨re", slug: 'bienfaits-activite-physique-reguliere', excerpt: "L'exercice physique est essentiel pour maintenir une bonne santأ©.", content: 'Lorem ipsum dolor sit amet.', category: 'advice', image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop', published: true, featured: false, views: 523 },
      { title: 'Vaccination : tout ce que vous devez savoir', slug: 'vaccination-tout-ce-que-vous-devez-savoir', excerpt: "La vaccination est l'un des moyens les plus efficaces de prأ©venir les maladies.", content: 'Lorem ipsum dolor sit amet.', category: 'prevention', image_url: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600&h=400&fit=crop', published: true, featured: false, views: 892 },
      { title: 'Nouvelles recommandations pour le dأ©pistage du cancer', slug: 'nouvelles-recommandations-depistage-cancer', excerpt: 'Les autoritأ©s de santأ© ont mis أ  jour les recommandations.', content: 'Lorem ipsum dolor sit amet.', category: 'news', image_url: 'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=600&h=400&fit=crop', published: true, featured: false, views: 654 },
      { title: 'Sommeil : comment amأ©liorer la qualitأ© de vos nuits', slug: 'sommeil-ameliorer-qualite-nuits', excerpt: 'Un bon sommeil est essentiel pour votre santأ©.', content: 'Lorem ipsum dolor sit amet.', category: 'wellness', image_url: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=600&h=400&fit=crop', published: true, featured: false, views: 431 },
      { title: 'Les superaliments : mythe ou rأ©alitأ© ?', slug: 'superaliments-mythe-realite', excerpt: 'On entend beaucoup parler de superaliments. Mais que valent-ils vraiment ?', content: 'Lorem ipsum dolor sit amet.', category: 'nutrition', image_url: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=600&h=400&fit=crop', published: true, featured: false, views: 312 },
    ];
    for (const b of blogs) {
      await insertBlog(b.title, b.slug, b.excerpt, b.content, b.category, b.image_url, 'Dr. Djaidja', b.published, b.featured, b.views);
    }
    console.log('Blog posts seeded');
  } else {
    console.log('Blog posts already exist');
  }
}

async function main() {
  await initializeDatabase();
  await seedData();
  console.log('Database ready');
}

const isMainModule = process.argv[1]?.includes('docker-init');
if (isMainModule) {
  main().catch((err) => {
    console.error('Init failed:', err);
    process.exit(1);
  });
}
